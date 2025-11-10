import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsString,
  IsOptional,
  validateSync,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';

/**
 * Environment variable validation schema
 * Ensures all required environment variables are present and valid
 */
enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

export class EnvironmentVariables {
  // Application
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment = Environment.Development;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(65535)
  PORT: number = 3000;

  // Database
  @IsString()
  DB_HOST: string;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(65535)
  DB_PORT: number = 5432;

  @IsString()
  DB_USER: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsBoolean()
  @IsOptional()
  DB_LOGGING: boolean = false;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(100)
  DB_POOL_MAX: number = 10;

  @IsNumber()
  @IsOptional()
  @Min(1)
  @Max(50)
  DB_POOL_MIN: number = 2;

  // CORS
  @IsBoolean()
  @IsOptional()
  CORS_ENABLED: boolean = true;

  @IsString()
  @IsOptional()
  CORS_ORIGIN: string = '*';

  @IsBoolean()
  @IsOptional()
  CORS_CREDENTIALS: boolean = false;

  // API
  @IsString()
  @IsOptional()
  API_PREFIX: string = '';

  @IsString()
  @IsOptional()
  API_VERSION: string = 'v1';
}

/**
 * Validates environment variables
 * @param config - Raw environment configuration
 * @returns Validated environment variables
 * @throws Error if validation fails
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    const errorMessages = errors
      .map((error) => {
        const constraints = error.constraints
          ? Object.values(error.constraints as Record<string, string>)
          : [];
        return `  - ${error.property}: ${constraints.join(', ')}`;
      })
      .join('\n');

    throw new Error(
      `Environment variable validation failed:\n${errorMessages}`,
    );
  }

  return validatedConfig as EnvironmentVariables;
}
