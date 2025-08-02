import { Module, Global } from '@nestjs/common';
import { configService } from '@root/config/config';
import Redis from 'ioredis';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS',
      useFactory: async () => {
        return new Redis(
          await configService.getRedisConfig(),
        );
      },
    },
  ],
  exports: ['REDIS'],
})
export class RedisModule {}
