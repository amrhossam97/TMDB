import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TMDBService } from './TMDB.service';
import { JwtStrategy } from '@root/common/strategies/jwt.strategy';

@Module({
  imports: [
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
  controllers:[],
  providers: [TMDBService, JwtStrategy ],
  exports: [TMDBService],
})
export class TMDBModule {}
