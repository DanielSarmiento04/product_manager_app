# Product Manager API - Backend

## Overview

RESTful API for managing pharmaceutical products built with NestJS, TypeORM, and PostgreSQL. This is a technical implementation for igloolab's evaluation, demonstrating production-ready patterns, comprehensive testing, and adherence to NestJS best practices.

## Technical Stack

- **Runtime**: Node.js 18+
- **Framework**: NestJS 11.x (Express-based)
- **Language**: TypeScript 5.7
- **ORM**: TypeORM 0.3.27
- **Database**: PostgreSQL 15 (containerized)
- **Validation**: class-validator + class-transformer
- **Testing**: Jest 29 + Supertest
- **Linting**: ESLint + Prettier

## Project Structure

```
backend/
├── src/
│   ├── modules/
│   │   └── products/
│   │       ├── dto/                    # Data Transfer Objects
│   │       │   ├── create-product.dto.ts
│   │       │   └── update-product.dto.ts
│   │       ├── entities/               # TypeORM entities
│   │       │   └── product.entity.ts
│   │       ├── products.controller.ts  # HTTP request handlers
│   │       ├── products.service.ts     # Business logic
│   │       ├── products.module.ts      # Module definition
│   │       ├── products.controller.spec.ts
│   │       └── products.service.spec.ts
│   ├── app.module.ts                   # Root module
│   └── main.ts                         # Application bootstrap
├── test/
│   ├── products.e2e-spec.ts            # End-to-end tests
│   └── jest-e2e.json                   # E2E test configuration
├── .env                                # Environment variables
├── tsconfig.json                       # TypeScript configuration
├── eslint.config.mjs                   # ESLint configuration
├── nest-cli.json                       # NestJS CLI configuration
└── package.json                        # Dependencies and scripts
```

## Prerequisites

Before starting, ensure you have:

- Node.js 18 or higher
- npm 9 or higher
- Docker Desktop (for PostgreSQL container)
- Git
- A terminal with bash/zsh

## Installation

### 1. Clone and Install Dependencies

```bash
cd backend
npm install
```

### 2. Database Setup

The application expects a PostgreSQL container named `igloolab_postgres`.

**Option A: Start existing container**
```bash
docker start igloolab_postgres
```

**Option B: Create new container**
```bash
docker run -d \
  --name igloolab_postgres \
  -e POSTGRES_USER=igloolab_admin \
  -e POSTGRES_PASSWORD=changeme123 \
  -e POSTGRES_DB=products_db \
  -p 5432:5432 \
  postgres:15
```

**Verify container is running:**
```bash
docker ps | grep igloolab_postgres
```

### 3. Environment Configuration

Create a `.env` file in the backend root:

```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=igloolab_admin
DB_PASSWORD=changeme123
DB_NAME=products_db

# Application
PORT=3000
NODE_ENV=development
```

**Important**: Never commit `.env` files to version control. Use `.env.example` for templates.

### 4. Database Initialization

The application uses TypeORM's `synchronize: true` in development, which automatically creates tables based on entity definitions. The database will be initialized on first run.

**For production**, use migrations instead:
```bash
npm run typeorm migration:generate -- -n InitialSchema
npm run typeorm migration:run
```

## Running the Application

### Development Mode (Hot Reload)

```bash
npm run start:dev
```

The server will start on `http://localhost:3000` with hot-reload enabled. Any changes to TypeScript files will trigger automatic recompilation.

### Production Mode

```bash
npm run build
npm run start:prod
```

### Debug Mode

```bash
npm run start:debug
```

Debug inspector available at `http://localhost:9229`

## API Endpoints

### Base URL
```
http://localhost:3000
```

### Products Resource

| Method | Endpoint | Description | Request Body | Success Response |
|--------|----------|-------------|--------------|------------------|
| GET | `/products` | List all products | - | 200 + Product[] |
| GET | `/products/:id` | Get product by ID | - | 200 + Product |
| POST | `/products` | Create new product | CreateProductDto | 201 + Product |
| PATCH | `/products/:id` | Update product | UpdateProductDto | 200 + Product |
| DELETE | `/products/:id` | Delete product | - | 200 |

### Data Models

#### Product Entity
```typescript
{
  id: number;              // Auto-generated
  name: string;            // Max 255 chars
  description: string;     // TEXT field
  price: number;           // Decimal(10,2)
  created_at: Date;        // Auto-generated
  updated_at: Date;        // Auto-updated
}
```

#### CreateProductDto
```typescript
{
  name: string;            // Required, max 255 chars
  description: string;     // Required
  price: number;           // Required, >= 0
}
```

#### UpdateProductDto
```typescript
{
  name?: string;           // Optional, max 255 chars
  description?: string;    // Optional
  price?: number;          // Optional, >= 0
}
```

### Request Examples

#### Create Product
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paracetamol 500mg",
    "description": "Analgésico y antipirético",
    "price": 5.99
  }'
```

**Response (201 Created):**
```json
{
  "id": 1,
  "name": "Paracetamol 500mg",
  "description": "Analgésico y antipirético",
  "price": 5.99,
  "created_at": "2025-11-09T06:33:09.023Z",
  "updated_at": "2025-11-09T06:33:09.023Z"
}
```

#### List All Products
```bash
curl http://localhost:3000/products
```

**Response (200 OK):**
```json
[
  {
    "id": 1,
    "name": "Paracetamol 500mg",
    "description": "Analgésico y antipirético",
    "price": 5.99,
    "created_at": "2025-11-09T06:33:09.023Z",
    "updated_at": "2025-11-09T06:33:09.023Z"
  }
]
```

#### Get Single Product
```bash
curl http://localhost:3000/products/1
```

#### Update Product (Partial)
```bash
curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 6.99
  }'
```

#### Delete Product
```bash
curl -X DELETE http://localhost:3000/products/1
```

### Error Responses

#### 400 Bad Request (Validation Error)
```json
{
  "statusCode": 400,
  "message": [
    "name should not be empty",
    "price must be a positive number"
  ],
  "error": "Bad Request"
}
```

#### 404 Not Found
```json
{
  "statusCode": 404,
  "message": "Product with ID 999 not found",
  "error": "Not Found"
}
```

## Validation Rules

### Product Name
- Required field
- Must be a string
- Maximum length: 255 characters
- Minimum length: 1 character

### Product Description
- Required field
- Must be a string
- No maximum length (TEXT column in database)

### Product Price
- Required field
- Must be a number
- Minimum value: 0 (non-negative)
- Stored with 2 decimal precision
- Maximum value: 999,999.99 (database constraint)

**Note on Price Handling:**
The API accepts both number and string inputs for price (e.g., `19.99` or `"19.99"`), which are automatically converted to numbers via `class-transformer`. The database stores prices as `DECIMAL(10,2)`, and TypeORM uses a custom transformer to ensure API responses return numeric values instead of strings.

## Testing

The project includes comprehensive testing at three levels:

### Test Coverage Summary

- **Unit Tests (Service)**: 28 tests
- **Unit Tests (Controller)**: 34 tests  
- **E2E Tests**: 45 tests
- **Total**: 107 tests

### Running Tests

**All unit tests:**
```bash
npm test
```

**Watch mode (for development):**
```bash
npm run test:watch
```

**Coverage report:**
```bash
npm run test:cov
```

Open `coverage/lcov-report/index.html` to view detailed coverage.

**E2E tests (requires database):**
```bash
npm run test:e2e
```

**Specific test file:**
```bash
npm test -- products.service.spec.ts
npm run test:e2e -- products.e2e-spec.ts
```

### Test Database Configuration

E2E tests use the same database as development. For isolation, create a separate test database:

```bash
docker exec -it igloolab_postgres psql -U igloolab_admin -d postgres \
  -c "CREATE DATABASE products_db_test;"
```

Update `.env.test`:
```env
DB_NAME=products_db_test
```

### What's Tested

**Service Layer:**
- CRUD operations with mocked repository
- Error handling (NotFoundException)
- Edge cases (min/max values, special characters)
- Concurrent operations
- Data integrity

**Controller Layer:**
- HTTP request handling
- Request validation
- Response formatting
- Error propagation
- ID parameter conversion

**E2E Layer:**
- Full API lifecycle (create → read → update → delete)
- Request validation (400 errors)
- Not found scenarios (404 errors)
- Concurrent requests
- Database integration
- Unicode and special character handling
- Decimal precision

For detailed testing documentation, see [TESTING.md](./TESTING.md).

## Code Quality

### Linting

```bash
npm run lint
npm run lint -- --fix
```

ESLint configuration includes:
- TypeScript type checking
- Prettier integration
- NestJS-specific rules
- Test file exemptions

### Formatting

```bash
npm run format
```

Prettier automatically formats code according to project standards.

### Type Checking

TypeScript is configured with:
- `strict: false` (current setting)
- `strictNullChecks: true`
- `noImplicitAny: false`

**Recommendation**: Enable strict mode for production:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

## Architecture Patterns

### Modular Structure

The application follows NestJS's modular architecture:

```
AppModule (root)
  └── ProductsModule
      ├── ProductsController (HTTP layer)
      ├── ProductsService (business logic)
      └── TypeOrmModule.forFeature([Product])
```

### Dependency Injection

NestJS uses dependency injection throughout:

```typescript
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}
}
```

### DTO Pattern

Data Transfer Objects validate and transform incoming data:

```typescript
export class CreateProductDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  name: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  price: number;
}
```

### Repository Pattern

TypeORM provides the repository pattern for database access:

```typescript
const product = await this.productsRepository.findOneBy({ id });
await this.productsRepository.save(product);
```

## Security Considerations

### Implemented Security Features

**Input Validation:**
- class-validator decorators on all DTOs
- whitelist: true (strips unknown properties)
- forbidNonWhitelisted: true (rejects unknown properties)
- transform: true (type coercion)

**CORS:**
- Currently allows all origins (development)
- Should be restricted in production

**SQL Injection Protection:**
- TypeORM uses parameterized queries
- Repository pattern prevents direct SQL

**Type Safety:**
- TypeScript prevents many runtime errors
- Validation pipes catch invalid data

### Security Recommendations

**For production, implement:**

1. **Environment Variable Validation:**
```typescript
import { IsString, IsNumber, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  DB_HOST: string;
  
  @IsNumber()
  DB_PORT: number;
}
```

2. **CORS Configuration:**
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL,
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  credentials: true,
});
```

3. **Helmet.js:**
```bash
npm install helmet
```

```typescript
import helmet from 'helmet';
app.use(helmet());
```

4. **Rate Limiting:**
```bash
npm install @nestjs/throttler
```

```typescript
ThrottlerModule.forRoot([{
  ttl: 60000,
  limit: 10,
}])
```

5. **ParseIntPipe for ID Parameters:**
```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.productsService.findOne(id);
}
```

See [CODE_REVIEW.md](./CODE_REVIEW.md) for comprehensive security analysis.

## Database Management

### TypeORM Configuration

Current configuration (development):

```typescript
TypeOrmModule.forRoot({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: process.env.NODE_ENV !== 'production',
})
```

**Warning**: `synchronize: true` automatically modifies database schema. This is convenient for development but dangerous in production.

### Migrations (Production Approach)

1. **Generate migration:**
```bash
npm run typeorm migration:generate -- -n AddProductsTable
```

2. **Run migrations:**
```bash
npm run typeorm migration:run
```

3. **Revert migration:**
```bash
npm run typeorm migration:revert
```

### Database Connection Troubleshooting

**Connection refused:**
```bash
# Check if PostgreSQL is running
docker ps | grep postgres

# Start container
docker start igloolab_postgres

# Check logs
docker logs igloolab_postgres
```

**Authentication failed:**
- Verify credentials in `.env` match container configuration
- Check `POSTGRES_USER` and `POSTGRES_PASSWORD` environment variables

**Database does not exist:**
```bash
docker exec -it igloolab_postgres psql -U igloolab_admin -d postgres
CREATE DATABASE products_db;
\q
```

## Performance Considerations

### Current Limitations

1. **No Pagination**: `GET /products` returns all records
2. **No Caching**: Every request hits the database
3. **No Indexing**: Only primary key index exists
4. **No Connection Pooling**: Using default TypeORM settings

### Recommended Optimizations

**Add Pagination:**
```typescript
@Get()
async findAll(@Query() paginationDto: PaginationDto) {
  const { page = 1, limit = 10 } = paginationDto;
  const [data, total] = await this.productsRepository.findAndCount({
    skip: (page - 1) * limit,
    take: limit,
  });
  return { data, total, page, limit };
}
```

**Add Database Indexes:**
```typescript
@Entity('products')
@Index(['name'])
@Index(['created_at'])
export class Product {
  // ...
}
```

**Implement Caching:**
```bash
npm install @nestjs/cache-manager cache-manager
```

```typescript
@CacheModule.register({
  ttl: 60, // seconds
  max: 100, // items
})
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use a different port
PORT=3001 npm run start:dev
```

### TypeScript Compilation Errors

```bash
# Clean build
rm -rf dist
npm run build

# Check TypeScript configuration
npx tsc --noEmit
```

### Test Failures

```bash
# Clear Jest cache
npm test -- --clearCache

# Run tests with verbose output
npm test -- --verbose

# Run single test file
npm test -- products.service.spec.ts
```

### Database Connection Issues

```bash
# Test database connection
docker exec -it igloolab_postgres psql -U igloolab_admin -d products_db -c "SELECT 1;"

# Reset database (DESTRUCTIVE)
docker exec -it igloolab_postgres psql -U igloolab_admin -d postgres \
  -c "DROP DATABASE products_db; CREATE DATABASE products_db;"
```

## Development Workflow

### Adding a New Feature

1. **Create feature branch:**
```bash
git checkout -b feature/add-product-categories
```

2. **Generate module (if needed):**
```bash
nest g module categories
nest g controller categories
nest g service categories
```

3. **Create entity:**
```typescript
// src/modules/categories/entities/category.entity.ts
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;
  
  @Column()
  name: string;
}
```

4. **Create DTOs:**
```typescript
// src/modules/categories/dto/create-category.dto.ts
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
```

5. **Implement service:**
```typescript
@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
  ) {}
  
  async create(dto: CreateCategoryDto): Promise<Category> {
    const category = this.categoriesRepository.create(dto);
    return this.categoriesRepository.save(category);
  }
}
```

6. **Write tests:**
```bash
# Unit tests
touch src/modules/categories/categories.service.spec.ts
touch src/modules/categories/categories.controller.spec.ts

# E2E tests
touch test/categories.e2e-spec.ts
```

7. **Run tests:**
```bash
npm test
npm run test:e2e
```

8. **Commit and push:**
```bash
git add .
git commit -m "feat: add categories module"
git push origin feature/add-product-categories
```

### Code Review Checklist

Before submitting code for review:

- [ ] All tests pass (`npm test` and `npm run test:e2e`)
- [ ] No linting errors (`npm run lint`)
- [ ] Code is formatted (`npm run format`)
- [ ] New features have tests
- [ ] DTOs have validation decorators
- [ ] Error handling is implemented
- [ ] Database changes have migrations (production)
- [ ] Environment variables are documented
- [ ] README is updated (if needed)

## Deployment

### Pre-deployment Checklist

- [ ] Set `NODE_ENV=production`
- [ ] Disable TypeORM synchronize
- [ ] Use database migrations
- [ ] Configure CORS with specific origins
- [ ] Add helmet.js security headers
- [ ] Implement rate limiting
- [ ] Add logging and monitoring
- [ ] Set up CI/CD pipeline
- [ ] Configure environment variables securely
- [ ] Review and address all CODE_REVIEW.md findings

### Environment Variables for Production

```env
NODE_ENV=production
PORT=3000
DB_HOST=<production-db-host>
DB_PORT=5432
DB_USER=<production-db-user>
DB_PASSWORD=<strong-password>
DB_NAME=products_db
FRONTEND_URL=https://your-frontend.com
LOG_LEVEL=info
```

### Build for Production

```bash
npm run build
```

The compiled JavaScript will be in the `dist/` directory.

### Run in Production

```bash
NODE_ENV=production node dist/main
```

Or use a process manager:

```bash
npm install -g pm2
pm2 start dist/main.js --name product-api
pm2 save
pm2 startup
```

## Documentation

This project includes comprehensive documentation:

- **README.md** (this file): Complete developer guide
- **README_ES.md**: Spanish version of this guide
- **CODE_REVIEW.md**: Detailed code analysis with 20 findings
- **TESTING.md**: Testing guide and best practices
- **TEST_SUMMARY.md**: Breakdown of all 107 tests
- **DELIVERABLES.md**: Executive summary for reviewers
- **QUICK_REFERENCE.md**: One-page cheat sheet


## Technical Decisions

### Why NestJS?

- Enterprise-ready framework with TypeScript support
- Built-in dependency injection
- Excellent TypeORM integration
- Comprehensive testing utilities
- Active community and documentation

### Why TypeORM?

- Native TypeScript support
- Repository pattern
- Active Record and Data Mapper support
- Migration system
- Wide database support

### Why PostgreSQL?

- ACID compliance
- Strong data integrity
- JSON support (for future extensions)
- Excellent performance
- Industry standard for production

### Why Jest?

- NestJS default testing framework
- Excellent TypeScript support
- Built-in mocking capabilities
- Snapshot testing
- Coverage reporting



## License

UNLICENSED - For igloolab technical test evaluation only.



**Version**: 1.0.0  
**Last Updated**: November 10, 2025  
**Maintainer**: Technical Test Candidate  
**Target Audience**: igloolab Development Team
