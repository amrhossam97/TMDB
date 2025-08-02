import { HttpException, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenreDto } from "@root/common/Dto/genre.dto";
import { MovieDto } from "@root/common/Dto/movie.dto";
import { HandleErrorMessage } from "@root/common/exceptions/error-filter";
import { Genre } from "@root/database/entity/genre.entity";
import { Movie } from "@root/database/entity/movies.entity";
import { In, Repository } from "typeorm";

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre) private readonly genreRepo: Repository<Genre>
  ) {}

  async createOrSyncGenre(dto:GenreDto): Promise<Genre> {
    try {
      let genre = await this.genreRepo.findOne({
        where: { tmdbId: dto.id },
      });

      if (!genre) {
        genre = this.genreRepo.create({
          tmdbId: dto.id,
          name: dto.name,
        });
      } else {
        genre.name = dto.name;
      }

      return await this.genreRepo.save(genre);
    } catch (e) {
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
}
