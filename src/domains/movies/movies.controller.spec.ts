import { Test, TestingModule } from "@nestjs/testing";
import { MoviesController } from "./movies.controller";
import { MoviesService } from "./movies.service";
import { GetMoviesFilterDTO } from "@root/common/Dto/movie.dto";
import { UserInterface } from "@root/common/interfaces/user.interface";

describe("MoviesController", () => {
  let controller: MoviesController;
  let service: MoviesService;

  const mockUser: UserInterface = {
    userId: 1,
    userName: "amr hossam",
    userPhone: "+201095047883",
  };

  const mockMoviesService = {
    getMovies: jest
      .fn()
      .mockResolvedValue({ movies: [{ id: 1, title: "Dragon" }], total: 1 }),
    getMoviesByGenre: jest
      .fn()
      .mockResolvedValue({
        movies: [{ id: 2, title: "Action Dragon" }],
        total: 1,
      }),
    getImageURL: jest.fn().mockResolvedValue("http://image.url/test.jpg"),
    addToWishlist: jest.fn().mockResolvedValue(true),
    removeFromWishlist: jest.fn().mockResolvedValue(true),
    markMovieFavorite: jest.fn().mockResolvedValue(true),
    getMyWishlist: jest.fn().mockResolvedValue([{ id: 1, title: "Dragon" }]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MoviesController],
      providers: [{ provide: MoviesService, useValue: mockMoviesService }],
    }).compile();

    controller = module.get<MoviesController>(MoviesController);
    service = module.get<MoviesService>(MoviesService);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });

  it("getMovies should return movies", async () => {
    const body: GetMoviesFilterDTO = {
      title: "Dragon",
      releaseDateFrom: new Date("2025-06-01"),
      releaseDateTo: new Date("2025-07-29"),
    };
    const skip = 0;
    const take = 10;
    const result = await controller.getMovies(body, skip, take);
    expect(result).toEqual({
      result: { movies: [{ id: 1, title: "Dragon" }], total: 1 },
      message: "Movies fetched successfully",
    });
    expect(service.getMovies).toHaveBeenCalledWith(body, skip, take);
  });

  it("getMoviesByGenre should return movies by genre", async () => {
    const body: GetMoviesFilterDTO = {
      title: "Dragon",
      releaseDateFrom: new Date("2025-06-01"),
      releaseDateTo: new Date("2025-07-29"),
    };
    const genreId = 1;
    const skip = 0;
    const take = 10;
    const result = await controller.getMoviesByGenre(body, genreId, skip, take);
    expect(result).toEqual({
      result: { movies: [{ id: 2, title: "Action Dragon" }], total: 1 },
      message: "Movies by genre fetched successfully",
    });
    expect(service.getMoviesByGenre).toHaveBeenCalledWith(
      body,
      genreId,
      skip,
      take
    );
  });

  it("getImageURL should return image url", async () => {
    const imgPath = "test.jpg";
    const result = await controller.getImageURL(imgPath);
    expect(result).toEqual({
      result: "http://image.url/test.jpg",
      message: "Image URL fetched successfully",
    });
    expect(service.getImageURL).toHaveBeenCalledWith(imgPath);
  });

  it("addToWishlist should add movie to wishlist", async () => {
    const movieId = 1;
    const result = await controller.addToWishlist(movieId, mockUser);
    expect(result).toEqual({
      result: true,
      message: "Movie added to wishlist successfully",
    });
    expect(service.addToWishlist).toHaveBeenCalledWith(movieId, mockUser);
  });

  it("removeFromWishlist should remove movie from wishlist", async () => {
    const movieId = 1;
    const result = await controller.removeFromWishlist(movieId, mockUser);
    expect(result).toEqual({
      result: true,
      message: "Movie removed from wishlist successfully",
    });
    expect(service.removeFromWishlist).toHaveBeenCalledWith(movieId, mockUser);
  });

  it("markMovieFavorite should mark movie as favorite", async () => {
    const movieId = 1;
    const result = await controller.markMovieFavorite(movieId, mockUser);
    expect(result).toEqual({
      result: true,
      message: "Movie marked as favorite successfully",
    });
    expect(service.markMovieFavorite).toHaveBeenCalledWith(movieId, mockUser);
  });

  it("getMyWishlist should return user wishlist", async () => {
    const skip = 0;
    const take = 10;
    const result = await controller.getMyWishlist(skip, take, mockUser);
    expect(result).toEqual({
      result: [{ id: 1, title: "Dragon" }],
      message: "My wishlist fetched successfully",
    });
    expect(service.getMyWishlist).toHaveBeenCalledWith(mockUser, skip, take);
  });
});
