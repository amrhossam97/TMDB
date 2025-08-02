import { Test, TestingModule } from '@nestjs/testing';
import { GenresService } from './genres.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Genre } from '@root/database/entity/genre.entity';
import { RedisService } from '@root/common/redis/redis.services';
import { GenreDto } from '@root/common/Dto/genre.dto';
import { NotFoundException } from '@nestjs/common';

describe('GenresService', () => {
  let service: GenresService;
  let genreRepo, redisService;

  beforeEach(async () => {
    genreRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      find: jest.fn(),
    };
    redisService = {
      get: jest.fn(),
      set: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GenresService,
        { provide: getRepositoryToken(Genre), useValue: genreRepo },
        { provide: RedisService, useValue: redisService },
      ],
    }).compile();

    service = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrSyncGenre', () => {
    it('should create new genre if not exists', async () => {
      genreRepo.findOne.mockResolvedValue(undefined);
      genreRepo.create.mockReturnValue({ id: 1, name: 'Action' });
      genreRepo.save.mockResolvedValue({ id: 1, name: 'Action' });

      const dto: GenreDto = { id: 1, name: 'Action' };
      const result = await service.createOrSyncGenre(dto);
      expect(result).toEqual({ id: 1, name: 'Action' });
      expect(genreRepo.create).toHaveBeenCalled();
      expect(genreRepo.save).toHaveBeenCalled();
    });

    it('should update genre if exists', async () => {
      genreRepo.findOne.mockResolvedValue({ id: 1, name: 'Old' });
      genreRepo.save.mockResolvedValue({ id: 1, name: 'Action' });

      const dto: GenreDto = { id: 1, name: 'Action' };
      const result = await service.createOrSyncGenre(dto);
      expect(result).toEqual({ id: 1, name: 'Action' });
      expect(genreRepo.save).toHaveBeenCalled();
    });
  });

  describe('getGenres', () => {
    it('should return genres from redis if exists', async () => {
      redisService.get.mockResolvedValue(JSON.stringify([{ id: 1, name: 'Action' }]));
      const result = await service.getGenres();
      expect(result).toEqual([{ id: 1, name: 'Action' }]);
      expect(redisService.get).toHaveBeenCalledWith('genres');
    });

    it('should return genres from db and set redis if not in redis', async () => {
      redisService.get.mockResolvedValue(null);
      genreRepo.find.mockResolvedValue([{ id: 1, name: 'Action' }]);
      redisService.set.mockResolvedValue(true);

      const result = await service.getGenres();
      expect(result).toEqual([{ id: 1, name: 'Action' }]);
      expect(genreRepo.find).toHaveBeenCalled();
      expect(redisService.set).toHaveBeenCalled();
    });

    it('should throw NotFoundException if no genres found', async () => {
      redisService.get.mockResolvedValue(null);
      genreRepo.find.mockResolvedValue([]);
      await expect(service.getGenres()).rejects.toThrow(NotFoundException);
    });
  });
});