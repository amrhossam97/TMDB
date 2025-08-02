import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { AddRateDTO } from "@root/common/Dto/rating.dto";
import { HandleErrorMessage } from "@root/common/exceptions/error-filter";
import { Movie } from "@root/database/entity/movies.entity";
import { Rating } from "@root/database/entity/rate.entity";
import { User } from "@root/database/entity/users.entity";
import { Repository } from "typeorm";

@Injectable()
export class RatingService {
  constructor(
    @InjectRepository(Movie) private readonly movieRepo: Repository<Movie>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    @InjectRepository(Rating) private readonly ratingRepo: Repository<Rating>
  ) {}
  async addRating(body: AddRateDTO, userId: number): Promise<boolean> {
    try {
      const movie = await this.movieRepo.findOne({
        where: { id: body.movieId },
      });
      if (!movie) {
        throw new NotFoundException("Movie not found");
      }

      const user = await this.userRepo.findOne({ where: { id: userId } });
      if (!user) {
        throw new NotFoundException("User not found");
      }
      const existingRating = await this.ratingRepo.findOne({
        where: { movie: { id: body.movieId }, user: { id: userId } },
      });
      if (existingRating) {
        throw new BadRequestException("You have already rated this movie");
      }
      const rating = this.ratingRepo.create({
        movie,
        user,
        score: body.score,
        comment: body.comment,
      });
      await this.ratingRepo.save(rating);
      return true;
    } catch (e) {
      if (e instanceof HttpException) throw e;
      throw new HttpException(HandleErrorMessage(e), e.status ? e.status : 500);
    }
  }
}
