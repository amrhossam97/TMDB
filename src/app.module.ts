import { HttpModule } from "@nestjs/axios";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { ScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { SyncMoviesCronJob } from "./common/cronJob/syncMovies";
import { ResponseTransformInterceptor } from "./common/interceptors/respone-transform.interceptor";
import { configService } from "./config/config";
import { Genre } from "./database/entity/genre.entity";
import { Movie } from "./database/entity/movies.entity";
import { User } from "./database/entity/users.entity";
import { WatchList } from "./database/entity/watchList.entity";
import { AuthModule } from "./domains/auth/auth.module";
import { GenresModule } from "./domains/genres/genres.module";
import { GenresService } from "./domains/genres/genres.service";
import { MoviesModule } from "./domains/movies/movies.module";
import { MoviesService } from "./domains/movies/movies.service";
import { RatingModule } from "./domains/rating/rating.module";
import { TMDBModule } from "./domains/TMDB/TMDB.module";
import { RedisModule } from "./common/redis/redis.module";
import { RedisService } from "./common/redis/redis.services";

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Movie, Genre, WatchList, User]),
    HttpModule.register(configService.getAxiosConfig()),
    ScheduleModule.forRoot(),
    AuthModule,
    MoviesModule,
    GenresModule,
    RatingModule,
    RedisModule,
    TMDBModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseTransformInterceptor,
    },
    AppService,
    MoviesService,
    GenresService,
    RedisService,
    SyncMoviesCronJob,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    },
  ],
})
export class AppModule {}
