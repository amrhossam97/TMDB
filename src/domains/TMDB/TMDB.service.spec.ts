import { HttpService } from "@nestjs/axios";
import { HttpException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { of, throwError } from "rxjs";
import { TMDBService } from "./TMDB.service";

describe("TMDBService", () => {
  let service: TMDBService;
  let httpService: HttpService;

  beforeEach(async () => {
    httpService = {
      get: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [TMDBService, { provide: HttpService, useValue: httpService }],
    }).compile();

    service = module.get<TMDBService>(TMDBService);
    service.baseURL = "http://test-url";
    service.TMDB_IMAGE_URL = "http://img-url/";
    service.TMDB_Token = "test-token";
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });

  it("getTMDBPopularMovies should return data", async () => {
    const mockData = { results: [{ id: 1, title: "Movie" }] };
    (httpService.get as jest.Mock).mockReturnValue(of({ data: mockData }));
    const result = await service.getTMDBPopularMovies(1);
    expect(result).toEqual(mockData);
    expect(httpService.get).toHaveBeenCalled();
  });

  it("getTMDBPopularMovies should throw HttpException on error", async () => {
    (httpService.get as jest.Mock).mockReturnValue(
      throwError(() => ({ response: { status: 404 } }))
    );
    await expect(service.getTMDBPopularMovies(1)).rejects.toThrow(
      HttpException
    );
  });

  it("getTMDBGenre should return data", async () => {
    const mockData = { genres: [{ id: 1, name: "Action" }] };
    (httpService.get as jest.Mock).mockReturnValue(of({ data: mockData }));
    const result = await service.getTMDBGenre();
    expect(result).toEqual(mockData);
    expect(httpService.get).toHaveBeenCalled();
  });

  it("getTMDBGenre should throw HttpException on error", async () => {
    (httpService.get as jest.Mock).mockReturnValue(
      throwError(() => ({ response: { status: 500 } }))
    );
    await expect(service.getTMDBGenre()).rejects.toThrow(HttpException);
  });

  it("getTMDBImagePath should return full image url", async () => {
    const imgPath = "poster.jpg";
    const result = await service.getTMDBImagePath(imgPath);
    expect(result).toBe("http://img-url/poster.jpg");
  });
});
