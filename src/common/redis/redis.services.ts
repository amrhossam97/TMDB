import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import * as Redis from "ioredis";

@Injectable()
export class RedisService {
  constructor(@Inject("REDIS") private readonly redisClient: Redis.Redis) {}

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string, ttl = 60) {
    return this.redisClient.set(key, value, "EX", ttl);
  }
}
