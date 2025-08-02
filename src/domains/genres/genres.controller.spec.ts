import { Test, TestingModule } from '@nestjs/testing';
import { GenresController } from './genres.controller';
import { GenresService } from './genres.service';

describe('GenresController', () => {
  let controller: GenresController;
  let service: GenresService;

  const mockGenresService = {
    getGenres: jest.fn().mockResolvedValue([{ id: 1, name: 'Action' }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GenresController],
      providers: [{ provide: GenresService, useValue: mockGenresService }],
    }).compile();

    controller = module.get<GenresController>(GenresController);
    service = module.get<GenresService>(GenresService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getGenres should return genres with success message', async () => {
    const result = await controller.getGenres();
    expect(result).toEqual({
      result: [{ id: 1, name: 'Action' }],
      message: 'Genres fetched successfully',
    });
    expect(service.getGenres).toHaveBeenCalled();
  });
});