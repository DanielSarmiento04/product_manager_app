import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Get configuration values with type safety
  const appConfig = configService.get('app') as {
    port: number;
    nodeEnv: string;
    cors: { enabled: boolean; origin: string; credentials: boolean };
    apiPrefix: string;
    validation: {
      whitelist: boolean;
      forbidNonWhitelisted: boolean;
      transform: boolean;
    };
  };

  const port = appConfig?.port || 3000;
  const corsConfig = appConfig?.cors || {
    enabled: true,
    origin: '*',
    credentials: false,
  };

  // Enable CORS with configuration
  if (corsConfig.enabled) {
    app.enableCors({
      origin: corsConfig.origin,
      credentials: corsConfig.credentials,
    });
  }

  // Global validation pipe with configuration
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: appConfig?.validation.whitelist ?? true,
      forbidNonWhitelisted: appConfig?.validation.forbidNonWhitelisted ?? true,
      transform: appConfig?.validation.transform ?? true,
    }),
  );

  // Set global prefix if configured
  if (appConfig?.apiPrefix) {
    app.setGlobalPrefix(appConfig.apiPrefix);
  }

  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Environment: ${appConfig?.nodeEnv || 'development'}`);
}

void bootstrap();
