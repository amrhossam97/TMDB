import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GetMoviesFilterDTO, MovieDto } from "@root/common/Dto/movie.dto";
import { HandleErrorMessage } from "@root/common/exceptions/error-filter";
import { UserInterface } from "@root/common/interfaces/user.interface";
import { Genre } from "@root/database/entity/genre.entity";
import { Movie } from "@root/database/entity/movies.entity";
import { User } from "@root/database/entity/users.entity";
import { WatchList } from "@root/database/entity/watchList.entity";
import { In, Repository } from "typeorm";
import { TMDBService } from "../TMDB/TMDB.service";

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
    @InjectRepository(Genre) private readonly genreRepo: Repository<Genre>,
    @InjectRepository(WatchList)
    private readonly watchListRepo: Repository<WatchList>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
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
      if (e instanceof HttpException) throw e;
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
      .leftJoin("movie.ratings", "rating")
      .select([
        "movie.id",
        "movie.title",
        "movie.releaseDate",
        "movie.backdropPath",
        "movie.originalLanguage",
        "movie.originalTitle",
        "genre.id",
        "genre.name",
      ]);
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
    const total = await query.getCount();
    const movies = await query
      .orderBy("movie.releaseDate", "DESC")
      .skip(skip)
      .take(take)
      .getMany();
    const moviesWithAvg = await Promise.all(
      movies.map(async (movie) => {
        const { avg } = await this.movieRepo
          .createQueryBuilder("movie")
          .leftJoin("movie.ratings", "rating")
          .select("AVG(rating.score)", "avg")
          .where("movie.id = :id", { id: movie.id })
          .getRawOne();

        return {
          ...movie,
          averageRating: parseFloat(avg) || 0,
        };
      })
    );
    return { movies: moviesWithAvg, total };
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
      .leftJoin("movie.ratings", "rating")
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
      .where((qb) => {
        const subQuery = qb
          .subQuery()
          .select("movieSub.id")
          .from(Movie, "movieSub")
          .leftJoin("movieSub.genres", "genreSub")
          .where("genreSub.id = :genreId")
          .getQuery();

        return "movie.id IN " + subQuery;
      })
      .setParameter("genreId", genreId);
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

    const total = await query.getCount();
    const movies = await query
      .orderBy("movie.releaseDate", "DESC")
      .skip(skip)
      .take(take)
      .getMany();

    const moviesWithAvg = await Promise.all(
      movies.map(async (movie) => {
        const { avg } = await this.movieRepo
          .createQueryBuilder("movie")
          .leftJoin("movie.ratings", "rating")
          .select("AVG(rating.score)", "avg")
          .where("movie.id = :id", { id: movie.id })
          .getRawOne();

        return {
          ...movie,
          averageRating: parseFloat(avg) || 0,
        };
      })
    );
    return { movies: moviesWithAvg, total };
  }
  async addToWishlist(
    movieId: number,
    userDate: UserInterface
  ): Promise<boolean> {
    try {
      const movie = await this.movieRepo.findOne({ where: { id: movieId } });
      if (!movie) {
        throw new NotFoundException("Movie not found");
      }
      const user = await this.userRepo.findOne({
        where: { id: userDate.userId },
      });
      const watchListItem = this.watchListRepo.create({
        movie,
        user,
      });
      await this.watchListRepo.save(watchListItem);
      return true;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async removeFromWishlist(
    movieId: number,
    userDate: UserInterface
  ): Promise<boolean> {
    try {
      const movie = await this.movieRepo.findOne({ where: { id: movieId } });
      if (!movie) {
        throw new NotFoundException("Movie not found");
      }
      const user = await this.userRepo.findOne({
        where: { id: userDate.userId },
      });
      const watchListItem = await this.watchListRepo.findOne({
        where: { movie: { id: movie.id }, user: { id: user.id } },
      });
      if (watchListItem) {
        await this.watchListRepo.remove(watchListItem);
        return true;
      }
      return false;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async markMovieFavorite(movieId: number, user: UserInterface) {
    try {
      const movie = await this.movieRepo.findOne({ where: { id: movieId } });
      if (!movie) {
        throw new NotFoundException("Movie not found");
      }
      const userEntity = await this.userRepo.findOne({
        where: { id: user.userId },
      });
      if (!userEntity) {
        throw new NotFoundException("User not found");
      }
      const watchListItem = await this.watchListRepo.findOne({
        where: { movie: { id: movieId }, user: userEntity },
      });
      if (!watchListItem) {
        throw new NotFoundException("Movie not found in wishlist");
      }
      watchListItem.isFavorite = true;
      await this.watchListRepo.save(watchListItem);
      return true;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async getMyWishlist(user: UserInterface, skip: number, take: number) {
    try {
      const userEntity = await this.userRepo.findOne({
        where: { id: user.userId },
      });
      if (!userEntity) {
        throw new NotFoundException("User not found");
      }
      const wishlist = await this.watchListRepo.find({
        where: { user: { id: userEntity.id } },
        order: { isFavorite: "DESC" },
        relations: ["movie"],
        skip,
        take,
      });
      return wishlist.map((item) => item.movie);
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
}
