import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '@root/database/entity/movies.entity';
import { Genre } from '@root/database/entity/genre.entity';
import { WatchList } from '@root/database/entity/watchList.entity';
import { User } from '@root/database/entity/users.entity';
import { TMDBService } from '../TMDB/TMDB.service';
import { MovieDto, GetMoviesFilterDTO } from '@root/common/Dto/movie.dto';
import { UserInterface } from '@root/common/interfaces/user.interface';
import { NotFoundException, HttpException } from '@nestjs/common';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepo, genreRepo, watchListRepo, userRepo, tmdbService;

  beforeEach(async () => {
    movieRepo = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        leftJoin: jest.fn().mockReturnThis(),
        select: jest.fn().mockReturnThis(),
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getMany: jest.fn().mockResolvedValue([{ id: 1, title: 'Dragon' }]),
        getCount: jest.fn().mockResolvedValue(1),
        getRawOne: jest.fn().mockResolvedValue({ avg: '4.5' }),
        subQuery: jest.fn().mockReturnThis(),
        from: jest.fn().mockReturnThis(),
        getQuery: jest.fn().mockReturnValue('(SELECT ...)'),
        setParameter: jest.fn().mockReturnThis(),
      })),
    };
    genreRepo = { find: jest.fn() };
    watchListRepo = {
      create: jest.fn(),
      save: jest.fn(),
      findOne: jest.fn(),
      remove: jest.fn(),
      find: jest.fn(),
    };
    userRepo = { findOne: jest.fn() };
    tmdbService = { getTMDBImagePath: jest.fn() };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        { provide: getRepositoryToken(Movie), useValue: movieRepo },
        { provide: getRepositoryToken(Genre), useValue: genreRepo },
        { provide: getRepositoryToken(WatchList), useValue: watchListRepo },
        { provide: getRepositoryToken(User), useValue: userRepo },
        { provide: TMDBService, useValue: tmdbService },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createOrSyncMovie', () => {
    it('should create new movie if not exists', async () => {
      const dto: MovieDto = {
        id: 1,
        title: 'Test',
        overview: 'desc',
        release_date: '2025-07-29',
        backdrop_path: 'back.jpg',
        poster_path: 'poster.jpg',
        original_language: 'en',
        original_title: 'Test',
        genre_ids: [1, 2],
      };
      movieRepo.findOne.mockResolvedValue(undefined);
      genreRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      movieRepo.create.mockReturnValue({ ...dto, genres: [{ id: 1 }, { id: 2 }] });
      movieRepo.save.mockResolvedValue({ id: 1 });

      const result = await service.createOrSyncMovie(dto);
      expect(result).toEqual({ id: 1 });
      expect(movieRepo.create).toHaveBeenCalled();
      expect(movieRepo.save).toHaveBeenCalled();
    });

    it('should update movie if exists', async () => {
      const dto: MovieDto = {
        id: 1,
        title: 'Test',
        overview: 'desc',
        release_date: '2025-07-29',
        backdrop_path: 'back.jpg',
        poster_path: 'poster.jpg',
        original_language: 'en',
        original_title: 'Test',
        genre_ids: [1, 2],
      };
      movieRepo.findOne.mockResolvedValue({ id: 1 });
      genreRepo.find.mockResolvedValue([{ id: 1 }, { id: 2 }]);
      movieRepo.save.mockResolvedValue({ id: 1 });

      const result = await service.createOrSyncMovie(dto);
      expect(result).toEqual({ id: 1 });
      expect(movieRepo.save).toHaveBeenCalled();
    });

    it('should throw error if exception occurs', async () => {
      movieRepo.findOne.mockRejectedValue(new Error('DB error'));
      const dto: MovieDto = {
        id: 1,
        title: 'Test',
        overview: 'desc',
        release_date: '2025-07-29',
        backdrop_path: 'back.jpg',
        poster_path: 'poster.jpg',
        original_language: 'en',
        original_title: 'Test',
        genre_ids: [1, 2],
      };
      await expect(service.createOrSyncMovie(dto)).rejects.toThrow(HttpException);
    });
  });

  describe('getImageURL', () => {
    it('should return image url', async () => {
      tmdbService.getTMDBImagePath.mockResolvedValue('http://image.url/test.jpg');
      const result = await service.getImageURL('test.jpg');
      expect(result).toBe('http://image.url/test.jpg');
      expect(tmdbService.getTMDBImagePath).toHaveBeenCalledWith('test.jpg');
    });
  });

  describe('getMovies', () => {
    it('should return movies and total', async () => {
      const body: GetMoviesFilterDTO = {
        title: 'Dragon',
        releaseDateFrom: new Date('2025-07-29'),
        releaseDateTo: new Date('2025-07-29'),
      };
      const skip = 0;
      const take = 10;
      const result = await service.getMovies(body, skip, take);
      expect(result).toEqual({
        movies: [{ id: 1, title: 'Dragon', averageRating: 4.5 }],
        total: 1,
      });
    });
  });

  describe('getMoviesByGenre', () => {
    it('should return movies by genre and total', async () => {
      const body: GetMoviesFilterDTO = {
        title: 'Dragon',
        releaseDateFrom: new Date('2025-07-29'),
        releaseDateTo: new Date('2025-07-29'),
      };
      const genreId = 1;
      const skip = 0;
      const take = 10;
      const result = await service.getMoviesByGenre(body, genreId, skip, take);
      expect(result).toEqual({
        movies: [{ id: 1, title: 'Dragon', averageRating: 4.5 }],
        total: 1,
      });
    });
  });

  describe('addToWishlist', () => {
    it('should add movie to wishlist', async () => {
      movieRepo.findOne.mockResolvedValue({ id: 1 });
      userRepo.findOne.mockResolvedValue({ id: 1 });
      watchListRepo.create.mockReturnValue({ movie: { id: 1 }, user: { id: 1 } });
      watchListRepo.save.mockResolvedValue(true);

      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      const result = await service.addToWishlist(1, user);
      expect(result).toBe(true);
      expect(watchListRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if movie not found', async () => {
      movieRepo.findOne.mockResolvedValue(undefined);
      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      await expect(service.addToWishlist(999, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('removeFromWishlist', () => {
    it('should remove movie from wishlist', async () => {
      movieRepo.findOne.mockResolvedValue({ id: 1 });
      userRepo.findOne.mockResolvedValue({ id: 1 });
      watchListRepo.findOne.mockResolvedValue({ id: 1 });
      watchListRepo.remove.mockResolvedValue(true);

      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      const result = await service.removeFromWishlist(1, user);
      expect(result).toBe(true);
      expect(watchListRepo.remove).toHaveBeenCalled();
    });

    it('should return false if watchListItem not found', async () => {
      movieRepo.findOne.mockResolvedValue({ id: 1 });
      userRepo.findOne.mockResolvedValue({ id: 1 });
      watchListRepo.findOne.mockResolvedValue(undefined);

      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      const result = await service.removeFromWishlist(1, user);
      expect(result).toBe(false);
    });

    it('should throw NotFoundException if movie not found', async () => {
      movieRepo.findOne.mockResolvedValue(undefined);
      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      await expect(service.removeFromWishlist(1, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('markMovieFavorite', () => {
    it('should mark movie as favorite', async () => {
      movieRepo.findOne.mockResolvedValue({ id: 1 });
      userRepo.findOne.mockResolvedValue({ id: 1 });
      watchListRepo.findOne.mockResolvedValue({ id: 1, isFavorite: false });
      watchListRepo.save.mockResolvedValue(true);

      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      const result = await service.markMovieFavorite(1, user);
      expect(result).toBe(true);
      expect(watchListRepo.save).toHaveBeenCalled();
    });

    it('should throw NotFoundException if movie not found', async () => {
      movieRepo.findOne.mockResolvedValue(undefined);
      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      await expect(service.markMovieFavorite(1, user)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user not found', async () => {
      movieRepo.findOne.mockResolvedValue({ id: 1 });
      userRepo.findOne.mockResolvedValue(undefined);
      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      await expect(service.markMovieFavorite(1, user)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if movie not in wishlist', async () => {
      movieRepo.findOne.mockResolvedValue({ id: 1 });
      userRepo.findOne.mockResolvedValue({ id: 1 });
      watchListRepo.findOne.mockResolvedValue(undefined);
      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      await expect(service.markMovieFavorite(1, user)).rejects.toThrow(NotFoundException);
    });
  });

  describe('getMyWishlist', () => {
    it('should return wishlist movies', async () => {
      userRepo.findOne.mockResolvedValue({ id: 1 });
      watchListRepo.find.mockResolvedValue([
        { movie: { id: 1, title: 'Dragon' } },
        { movie: { id: 2, title: 'Action Dragon' } },
      ]);
      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      const result = await service.getMyWishlist(user, 0, 10);
      expect(result).toEqual([
        { id: 1, title: 'Dragon' },
        { id: 2, title: 'Action Dragon' },
      ]);
      expect(watchListRepo.find).toHaveBeenCalled();
    });

    it('should throw NotFoundException if user not found', async () => {
      userRepo.findOne.mockResolvedValue(undefined);
      const user: UserInterface = { userId: 1, userName: 'amr', userPhone: '123' };
      await expect(service.getMyWishlist(user, 0, 10)).rejects.toThrow(NotFoundException);
    });
  });
});