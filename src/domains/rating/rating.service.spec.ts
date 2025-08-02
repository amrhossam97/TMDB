import { Test, TestingModule } from '@nestjs/testing';
import { RatingService } from './rating.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '@root/database/entity/movies.entity';
import { User } from '@root/database/entity/users.entity';
import { Rating } from '@root/database/entity/rate.entity';
import { AddRateDTO } from '@root/common/Dto/rating.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('RatingService', () => {
  let service: RatingService;
  let movieRepo, userRepo, ratingRepo;

  beforeEach(async () => {
    movieRepo = { findOne: jest.fn() };
    userRepo = { findOne: jest.fn() };
    ratingRepo = { findOne: jest.fn(), create: jest.fn(), save: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RatingService,
        { provide: getRepositoryToken(Movie), useValue: movieRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: getRepositoryToken(Rating), useValue: ratingRepo },
      ],
    }).compile();

    service = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should add rating successfully', async () => {
    movieRepo.findOne.mockResolvedValue({ id: 1 });
    userRepo.findOne.mockResolvedValue({ id: 1 });
    ratingRepo.findOne.mockResolvedValue(undefined);
    ratingRepo.create.mockReturnValue({ score: 5, comment: 'Great!' });
    ratingRepo.save.mockResolvedValue(true);

    const body: AddRateDTO = { movieId: 1, score: 5, comment: 'Great!' };
    const result = await service.addRating(body, 1);
    expect(result).toBe(true);
    expect(ratingRepo.save).toHaveBeenCalled();
  });

  it('should throw NotFoundException if movie not found', async () => {
    movieRepo.findOne.mockResolvedValue(undefined);
    const body: AddRateDTO = { movieId: 1, score: 5, comment: 'Great!' };
    await expect(service.addRating(body, 1)).rejects.toThrow(NotFoundException);
  });

  it('should throw NotFoundException if user not found', async () => {
    movieRepo.findOne.mockResolvedValue({ id: 1 });
    userRepo.findOne.mockResolvedValue(undefined);
    const body: AddRateDTO = { movieId: 1, score: 5, comment: 'Great!' };
    await expect(service.addRating(body, 1)).rejects.toThrow(NotFoundException);
  });

  it('should throw BadRequestException if already rated', async () => {
    movieRepo.findOne.mockResolvedValue({ id: 1 });
    userRepo.findOne.mockResolvedValue({ id: 1 });
    ratingRepo.findOne.mockResolvedValue({ id: 1 });
    const body: AddRateDTO = { movieId: 1, score: 5, comment: 'Great!' };
    await expect(service.addRating(body, 1)).rejects.toThrow(BadRequestException);
  });
});