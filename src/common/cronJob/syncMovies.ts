import { Injectable } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { GenresService } from "@root/domains/genres/genres.service";
import { MoviesService } from "@root/domains/movies/movies.service";
import { TMDBService } from "@root/domains/TMDB/TMDB.service";

@Injectable()
export class SyncMoviesCronJob {
  constructor(
    private readonly tmdbService: TMDBService,
    private readonly moviesService: MoviesService,
    private readonly genresService: GenresService
  ) {}

  // @Cron("* * * * *")
  @Cron("0 0 * * *")
  async syncMovies() {
    const popularMovies = await this.tmdbService.getTMDBPopularMovies();

    for (let movie of popularMovies.results) {
      await this.moviesService.createOrSyncMovie(movie);
    }
  }
  // @Cron("* * * * *")
  @Cron("0 0 1 * *")
  async syncGenres() {
    const genres = await this.tmdbService.getTMDBGenre();
    for (let genre of genres.genres) {
      await this.genresService.createOrSyncGenre(genre);
    }
  }
}
