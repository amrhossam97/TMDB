import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RatingController } from "./rating.controller";
import { RatingService } from "./rating.service";
import { JwtStrategy } from "@root/common/strategies/jwt.strategy";
import { Movie } from "@root/database/entity/movies.entity";
import { Genre } from "@root/database/entity/genre.entity";
import { TMDBService } from "../TMDB/TMDB.service";
import { User } from "@root/database/entity/users.entity";
import { Rating } from "@root/database/entity/rate.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Movie, Genre, User, Rating]),
    PassportModule,
    JwtModule.register({
      secret: `${process.env.JWT_SECRET_KEY}`,
      signOptions: { expiresIn: 3600 },
    }),
    HttpModule.register({
      timeout: +process.env.AXIOS_TIMEOUT,
      maxRedirects: +process.env.AXIOS_REDIRECTS,
    }),
  ],
  controllers: [RatingController],
  providers: [RatingService, JwtStrategy, TMDBService],
  exports: [RatingService],
})
export class RatingModule {}
