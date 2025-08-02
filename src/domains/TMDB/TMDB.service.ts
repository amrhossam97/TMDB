import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { GenreDto, GenresResponseDto } from "@root/common/Dto/genre.dto";
import { MovieDto, MoviesResponseDto } from "@root/common/Dto/movie.dto";
import { HandleErrorMessage } from "@root/common/exceptions/error-filter";
import { firstValueFrom } from "rxjs";

@Injectable()
export class TMDBService {
  constructor(private httpService: HttpService) {}
  baseURL = process.env.TMDB_API_URL;
  TMDB_IMAGE_URL = process.env.TMDB_IMAGE_URL;
  TMDB_Token = process.env.TMDB_API_TOKEN;
  TMDB_KEY = process.env.TMDB_API_KEY;
  
  async getTMDBPopularMovies(page: number = 1): Promise<MoviesResponseDto> {
    const url = `${this.baseURL}/movie/popular`;
    const headers = {
      Authorization: `Bearer ${this.TMDB_Token}`,
    };
    const params = {
      page: page,
      language: "en-US",
    };
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers, params })
      );
      return response.data;
    } catch (e) {
      console.log(e);

      throw new HttpException(HandleErrorMessage(e), e.response?.status || 500);
    }
  }
  async getTMDBGenre(): Promise<GenresResponseDto> {
    const url = `${this.baseURL}/genre/movie/list`;
    const headers = {
      Authorization: `Bearer ${this.TMDB_Token}`,
    };
    const params = {
      language: "en",
    };
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers, params })
      );
      return response.data;
    } catch (e) {
      throw new HttpException(HandleErrorMessage(e), e.response?.status || 500);
    }
  }
  async getTMDBImagePath(imgPath: string): Promise<string> {
    return `${this.TMDB_IMAGE_URL}${imgPath}`;
  }
}
