import { HttpException, Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { GenreDto } from "@root/common/Dto/genre.dto";
import { HandleErrorMessage } from "@root/common/exceptions/error-filter";
import { RedisService } from "@root/common/redis/redis.services";
import { Genre } from "@root/database/entity/genre.entity";
import { Repository } from "typeorm";

@Injectable()
export class GenresService {
  constructor(
    @InjectRepository(Genre) private readonly genreRepo: Repository<Genre>,
    private readonly redisService: RedisService
  ) {}

  async createOrSyncGenre(dto: GenreDto): Promise<Genre> {
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
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
  async getGenres(): Promise<Genre[]> {
    try {
      let redisData = await this.redisService.get("genres");
      if (redisData) {
        return JSON.parse(redisData);
      }

      const genres = await this.genreRepo.find();
      if (!genres || genres.length === 0) {
        throw new NotFoundException("No genres found");
      }
      await this.redisService.set("genres", JSON.stringify(genres), 3600);
      return genres;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
}
