import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GenresController } from "./genres.controller";
import { GenresService } from "./genres.service";
import { JwtStrategy } from "@root/common/strategies/jwt.strategy";
import { Movie } from "@root/database/entity/movies.entity";
import { Genre } from "@root/database/entity/genre.entity";

@Module({
  imports: [
    TypeOrmModule.forFeature([Genre]),
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
  controllers: [GenresController],
  providers: [GenresService, JwtStrategy],
  exports: [GenresService],
})
export class GenresModule {}
