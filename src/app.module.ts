import { HttpModule } from "@nestjs/axios";
import { Module, ValidationPipe } from "@nestjs/common";
import { APP_INTERCEPTOR, APP_PIPE } from "@nestjs/core";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ResponseTransformInterceptor } from "./common/interceptors/respone-transform.interceptor";
import { configService } from "./config/config";
import { AuthModule } from "./domains/auth/auth.module";
import { TMDBModule } from "./domains/TMDB/TMDB.module";
import { SyncMoviesCronJob } from "./common/cronJob/syncMovies";
import { MoviesModule } from "./domains/movies/movies.module";
import { GenresModule } from "./domains/genres/genres.module";
import { MoviesService } from "./domains/movies/movies.service";
import { GenresService } from "./domains/genres/genres.service";
import { Genre } from "./database/entity/genre.entity";
import { Movie } from "./database/entity/movies.entity";
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    TypeOrmModule.forFeature([Movie, Genre]),
    HttpModule.register(configService.getAxiosConfig()),
    ScheduleModule.forRoot(),
    AuthModule,
    MoviesModule,
    GenresModule,
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
