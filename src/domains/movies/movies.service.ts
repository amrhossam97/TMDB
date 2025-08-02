import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GetMoviesFilterDTO, MovieDto } from "@root/common/Dto/movie.dto";
import { HandleErrorMessage } from "@root/common/exceptions/error-filter";
import { Genre } from "@root/database/entity/genre.entity";
import { Movie } from "@root/database/entity/movies.entity";
import { In, Repository } from "typeorm";
import { TMDBService } from "../TMDB/TMDB.service";

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Genre) private readonly genreRepo: Repository<Genre>,
    private readonly tmdbService: TMDBService
  ) {}
  async createOrSyncMovie(dto: MovieDto): Promise<Movie> {
    try {
      let movie = await this.movieRepo.findOne({
        where: { tmdbId: dto.id },
        relations: ["genres"],
      });
      const genres = await this.genreRepo.find({
        where: { tmdbId: In(dto.genre_ids) },
      });
      if (!movie) {
        movie = this.movieRepo.create({
          tmdbId: dto.id,
          title: dto.title,
          overview: dto.overview,
          releaseDate: new Date(dto.release_date),
          backdropPath: dto.backdrop_path,
          posterPath: dto.poster_path,
          originalLanguage: dto.original_language,
          originalTitle: dto.original_title,
          genres,
        });
      } else {
        movie.title = dto.title;
        movie.overview = dto.overview;
        movie.releaseDate = new Date(dto.release_date);
        movie.backdropPath = dto.backdrop_path;
        movie.posterPath = dto.poster_path;
        movie.originalLanguage = dto.original_language;
        movie.originalTitle = dto.original_title;
        movie.genres = genres;
      }

      return await this.movieRepo.save(movie);
    } catch (e) {
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async getImageURL(imgPath: string): Promise<string> {
    return this.tmdbService.getTMDBImagePath(imgPath);
  }
  async getMovies(body: GetMoviesFilterDTO, skip, take) {
    const query = this.movieRepo
      .createQueryBuilder("movie")
      .leftJoinAndSelect("movie.genres", "genre")
      .select([
        "movie.id",
        "movie.title",
        "movie.releaseDate",
        "movie.backdropPath",
        "movie.originalLanguage",
        "movie.originalTitle",
        "genre.id",
        "genre.name",
      ])
      .orderBy("movie.releaseDate", "DESC")
      .skip(skip)
      .take(take);

    if (body.title) {
      query.where("movie.title ILIKE :title", { title: `%${body.title}%` });
    }

    if (body.releaseDateFrom) {
      query.andWhere("movie.releaseDate >= :from", {
        from: new Date(body.releaseDateFrom),
      });
    }

    if (body.releaseDateTo) {
      query.andWhere("movie.releaseDate <= :to", {
        to: new Date(body.releaseDateTo),
      });
    }

    const [movies, total] = await query.getManyAndCount();
    return { movies, total };
  }
  async getMoviesByGenre(
    body: GetMoviesFilterDTO,
    genreId: number,
    skip: number,
    take: number
  ) {
    const query = this.movieRepo
      .createQueryBuilder("movie")
      .leftJoinAndSelect("movie.genres", "genre")
      .select([
        "movie.id",
        "movie.title",
        "movie.releaseDate",
        "movie.backdropPath",
        "movie.originalLanguage",
        "movie.originalTitle",
        "genre.id",
        "genre.name",
      ])
      .where("genre.id = :genreId", { genreId })
      .orderBy("movie.releaseDate", "DESC")
      .skip(skip)
      .take(take);

    if (body.title) {
      query.where("movie.title ILIKE :title", { title: `%${body.title}%` });
    }

    if (body.releaseDateFrom) {
      query.andWhere("movie.releaseDate >= :from", {
        from: new Date(body.releaseDateFrom),
      });
    }

    if (body.releaseDateTo) {
      query.andWhere("movie.releaseDate <= :to", {
        to: new Date(body.releaseDateTo),
      });
    }

    const [movies, total] = await query.getManyAndCount();
    return { movies, total };
  }
}
