import { Test, TestingModule } from '@nestjs/testing';
import { RatingController } from './rating.controller';
import { RatingService } from './rating.service';
import { AddRateDTO } from '@root/common/Dto/rating.dto';
import { UserInterface } from '@root/common/interfaces/user.interface';

describe('RatingController', () => {
  let controller: RatingController;
  let service: RatingService;

  const mockRatingService = {
    addRating: jest.fn().mockResolvedValue(true),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RatingController],
      providers: [{ provide: RatingService, useValue: mockRatingService }],
    }).compile();

    controller = module.get<RatingController>(RatingController);
    service = module.get<RatingService>(RatingService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('addRating should return success message', async () => {
    const body: AddRateDTO = { movieId: 1, score: 5, comment: 'Great!' };
    const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
    const result = await controller.addRating(body, user);
    expect(result).toEqual({ result: true, message: 'Rating added successfully' });
    expect(service.addRating).toHaveBeenCalledWith(body, user.userId);
  });
});