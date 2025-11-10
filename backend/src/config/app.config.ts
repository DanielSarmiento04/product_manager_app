import { registerAs } from '@nestjs/config';

/**
 * Application configuration
 * Registers all application-level settings
 */
export default registerAs('app', () => ({
  // Application settings
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  // CORS settings
  cors: {
    enabled: process.env.CORS_ENABLED === 'true' || true,
    origin: process.env.CORS_ORIGIN || '*',
    credentials: process.env.CORS_CREDENTIALS === 'true' || false,
  },

  // API settings
  apiPrefix: process.env.API_PREFIX || '',
  apiVersion: process.env.API_VERSION || 'v1',

  // Validation settings
  validation: {
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: false,
    },
  },
}));
