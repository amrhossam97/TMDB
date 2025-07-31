import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';

import { SWAGGER_CONFIG } from './swagger.config';

/**
 * Creates an OpenAPI document for an application, via swagger.
 * @param app the nestjs application
 * @returns the OpenAPI document
 */
export function createDocument(app: INestApplication): OpenAPIObject {
  const builder = new DocumentBuilder()
    .setTitle(SWAGGER_CONFIG.title)
    .setDescription(SWAGGER_CONFIG.description)
    .addBearerAuth({in:'header', type: 'http', scheme: 'bearer', bearerFormat: 'JWT' }, 'access-token')
    .addBasicAuth({in:'header', type: 'http' },'basic-auth')
    .addGlobalParameters({
      name: 'lang',
      in: 'query',
      required: true,
      description: 'Language parameter (en, ar)',
      schema: { type: 'string', default: 'ar' },
    })
    .setVersion(SWAGGER_CONFIG.version);
  for (const tag of SWAGGER_CONFIG.tags) {
    builder.addTag(tag);
  }
  const options = builder.build();

  return SwaggerModule.createDocument(app, options);
}
