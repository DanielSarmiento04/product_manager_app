import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { join } from 'path';

// Load environment variables
config();

/**
 * TypeORM DataSource configuration for migrations
 * This is used by TypeORM CLI for generating and running migrations
 */
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'products_db',
  
  // Entities
  entities: [join(__dirname, '..', '**', '*.entity{.ts,.js}')],
  
  // Migrations
  migrations: [join(__dirname, '..', 'migrations', '*{.ts,.js}')],
  migrationsTableName: 'migrations',
  
  // Synchronize should be false when using migrations
  synchronize: false,
  
  // Logging
  logging: process.env.DB_LOGGING === 'true' || false,
});
