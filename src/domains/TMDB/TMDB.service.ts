import { HttpService } from "@nestjs/axios";
import { HttpException, Injectable } from "@nestjs/common";
import { HandleErrorMessage } from "@root/common/exceptions/error-filter";
import { firstValueFrom } from "rxjs";

@Injectable()
export class AuthService {
  constructor(private httpService: HttpService) {}
  baseURL = process.env.TMDB_API_URL;
  TMDB_Token = process.env.TMDB_API_TOKEN;

  async getTMDBPopularMovies(page: number = 1) {
    const url = `${this.baseURL}/movie/popular`;
    const headers = {
      api_key: this.TMDB_Token,
    };
    const params = {
      page: page,
      language: "en-US",
    };
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers, params })
      );
      console.log(response);

      return response.data;
    } catch (e) {
      throw new HttpException(HandleErrorMessage(e), e.response?.status || 500);
    }
  }
  async getTMDBGenre() {
    const url = `${this.baseURL}/genre/movie/list`;
    const headers = {
      api_key: this.TMDB_Token,
    };
    const params = {
      language: "en",
    };
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, { headers, params })
      );
      console.log(response);

      return response.data;
    } catch (e) {
      throw new HttpException(HandleErrorMessage(e), e.response?.status || 500);
    }
  }
}
