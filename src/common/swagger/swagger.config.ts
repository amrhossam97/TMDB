import { SwaggerConfig } from './swagger.interface';

/**
 * Configuration for the swagger UI (found at /api).
 * Change this to suit your app!
 */
export const SWAGGER_CONFIG: SwaggerConfig = {
  title: ' TMDB App services',
  description: 'A service to validate and authenticate all requests passed through into the platform',
  version: '1.0',
  tags: ['Auth'],
};
