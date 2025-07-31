import { Transport } from '@nestjs/microservices';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
const fs = require('fs');

require('dotenv').config();

class ConfigService {
  constructor(private env: { [k: string]: string | undefined }) {}

  private getValue(key: string, throwOnMissing = true): string {
    const value = this.env[key];
    if (!value && throwOnMissing) {
      throw new Error(`config error - missing env.${key}`);
    }

    return value;
  }

  public ensureValues(keys: string[]) {
    keys.forEach((k) => this.getValue(k, true));
    return this;
  }

  public isProduction() {
    const mode = this.getValue('MODE_APP', false);
    if (mode === 'DEV' || mode === 'LOCAL') return false;
    return true;
  }
  public getAxiosConfig(): Object {
    return {
      timeout: process.env.AXIOS_TIMEOUT,
      maxRedirects: process.env.AXIOS_TIMEOUTAXIOS_REDIRECTS,
    };
  }

  public getTypeOrmConfig(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.getValue('POSTGRES_HOST'),
      port: parseInt(this.getValue('POSTGRES_PORT')),
      username: this.getValue('POSTGRES_USER'),
      password: this.getValue('POSTGRES_PASSWORD'),
      database: this.getValue('POSTGRES_DATABASE'),
      logging: !!this.getValue('LOGGING'),
      logger: 'simple-console',
      migrationsTableName: 'migration',
      migrationsRun: true,
      entities: [
        __dirname + '/../database/entity/*.entity.ts',
        __dirname + '/../database/entity/*.entity.js',
      ],
      migrations: [
        __dirname + '/../database/migration/*.ts',
        __dirname + '/../database/migration/*.js',
      ],
      ssl:
        process.env.DB_SSL == 'production'
          ? {
              rejectUnauthorized: false,
              ca: process.env.CA_DB,
            }
          : false,
    };
  }
}

const configService = new ConfigService(process.env).ensureValues([
  'POSTGRES_HOST',
  'POSTGRES_PORT',
  'POSTGRES_USER',
  'POSTGRES_PASSWORD',
  'POSTGRES_DATABASE',
]);

export { configService };
