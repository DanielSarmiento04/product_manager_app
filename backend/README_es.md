# API de Gestión de Productos - Backend

## Descripción General

API RESTful para la gestión de productos farmacéuticos construida con NestJS, TypeORM y PostgreSQL. Esta es una implementación técnica para la evaluación de igloolab, demostrando patrones listos para producción, pruebas exhaustivas y adherencia a las mejores prácticas de NestJS.

## Stack Tecnológico

- **Runtime**: Node.js 18+
- **Framework**: NestJS 11.x (basado en Express)
- **Lenguaje**: TypeScript 5.7
- **ORM**: TypeORM 0.3.27
- **Base de Datos**: PostgreSQL 15 (contenedorizado)
- **Validación**: class-validator + class-transformer
- **Testing**: Jest 29 + Supertest
- **Linting**: ESLint + Prettier

## Estructura del Proyecto

```
backend/
├── src/
│   ├── modules/
│   │   └── products/
│   │       ├── dto/                    # Data Transfer Objects
│   │       │   ├── create-product.dto.ts
│   │       │   └── update-product.dto.ts
│   │       ├── entities/               # Entidades TypeORM
│   │       │   └── product.entity.ts
│   │       ├── products.controller.ts  # Manejadores de peticiones HTTP
│   │       ├── products.service.ts     # Lógica de negocio
│   │       ├── products.module.ts      # Definición del módulo
│   │       ├── products.controller.spec.ts
│   │       └── products.service.spec.ts
│   ├── app.module.ts                   # Módulo raíz
│   └── main.ts                         # Inicialización de la aplicación
├── test/
│   ├── products.e2e-spec.ts            # Pruebas end-to-end
│   └── jest-e2e.json                   # Configuración de pruebas E2E
├── .env                                # Variables de entorno
├── tsconfig.json                       # Configuración de TypeScript
├── eslint.config.mjs                   # Configuración de ESLint
├── nest-cli.json                       # Configuración de NestJS CLI
└── package.json                        # Dependencias y scripts
```

## Prerequisitos

Antes de comenzar, asegúrate de tener:

- Node.js 18 o superior
- npm 9 o superior
- Docker Desktop (para el contenedor de PostgreSQL)
- Git
- Una terminal con bash/zsh

## Instalación

### 1. Clonar e Instalar Dependencias

```bash
cd backend
npm install
```

### 2. Configuración de la Base de Datos

La aplicación espera un contenedor de PostgreSQL llamado `igloolab_postgres`.

**Opción A: Iniciar contenedor existente**
```bash
docker start igloolab_postgres
```

**Opción B: Crear nuevo contenedor**
```bash
docker run -d \
  --name igloolab_postgres \
  -e POSTGRES_USER=igloolab_admin \
  -e POSTGRES_PASSWORD=changeme123 \
  -e POSTGRES_DB=products_db \
  -p 5432:5432 \
  postgres:15
```

**Verificar que el contenedor esté ejecutándose:**
```bash
docker ps | grep igloolab_postgres
```

### 3. Configuración de Variables de Entorno

Crear un archivo `.env` en la raíz del backend:

```env
# Base de datos
DB_HOST=localhost
DB_PORT=5432
DB_USER=igloolab_admin
DB_PASSWORD=changeme123
DB_NAME=products_db

# Aplicación
PORT=3000
NODE_ENV=development
```

**Importante**: Nunca hacer commit de archivos `.env` en el control de versiones. Usa `.env.example` para plantillas.

### 4. Inicialización de la Base de Datos

La aplicación utiliza `synchronize: true` de TypeORM en desarrollo, que crea automáticamente las tablas basándose en las definiciones de las entidades. La base de datos se inicializará en la primera ejecución.

**Para producción**, utiliza migraciones en su lugar:
```bash
npm run typeorm migration:generate -- -n InitialSchema
npm run typeorm migration:run
```

## Ejecutar la Aplicación

### Modo Desarrollo (Hot Reload)

```bash
npm run start:dev
```

El servidor se iniciará en `http://localhost:3000` con hot-reload habilitado. Cualquier cambio en los archivos TypeScript activará la recompilación automática.

### Modo Producción

```bash
npm run build
npm run start:prod
```

### Modo Debug

```bash
npm run start:debug
```

Inspector de debug disponible en `http://localhost:9229`

## Endpoints de la API

### URL Base
```
http://localhost:3000
```

### Recurso Products

| Método | Endpoint | Descripción | Cuerpo de Petición | Respuesta Exitosa |
|--------|----------|-------------|-------------------|-------------------|
| GET | `/products` | Listar todos los productos | - | 200 + Product[] |
| GET | `/products/:id` | Obtener producto por ID | - | 200 + Product |
| POST | `/products` | Crear nuevo producto | CreateProductDto | 201 + Product |
| PATCH | `/products/:id` | Actualizar producto | UpdateProductDto | 200 + Product |
| DELETE | `/products/:id` | Eliminar producto | - | 200 |

### Modelos de Datos

#### Entidad Product
```typescript
{
  id: number;              // Generado automáticamente
  name: string;            // Máximo 255 caracteres
  description: string;     // Campo TEXT
  price: number;           // Decimal(10,2)
  created_at: Date;        // Generado automáticamente
  updated_at: Date;        // Actualizado automáticamente
}
```

#### CreateProductDto
```typescript
{
  name: string;            // Requerido, máximo 255 caracteres
  description: string;     // Requerido
  price: number;           // Requerido, >= 0
}
```

#### UpdateProductDto
```typescript
{
  name?: string;           // Opcional, máximo 255 caracteres
  description?: string;    // Opcional
  price?: number;          // Opcional, >= 0
}
```

### Ejemplos de Peticiones

#### Crear Producto
```bash
curl -X POST http://localhost:3000/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Paracetamol 500mg",
    "description": "Analgésico y antipirético",
    "price": 5.99
  }'
```

**Respuesta (201 Created):**
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

#### Listar Todos los Productos
```bash
curl http://localhost:3000/products
```

**Respuesta (200 OK):**
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

#### Obtener Producto Individual
```bash
curl http://localhost:3000/products/1
```

#### Actualizar Producto (Parcial)
```bash
curl -X PATCH http://localhost:3000/products/1 \
  -H "Content-Type: application/json" \
  -d '{
    "price": 6.99
  }'
```

#### Eliminar Producto
```bash
curl -X DELETE http://localhost:3000/products/1
```

### Respuestas de Error

#### 400 Bad Request (Error de Validación)
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

## Reglas de Validación

### Nombre del Producto
- Campo requerido
- Debe ser un string
- Longitud máxima: 255 caracteres
- Longitud mínima: 1 carácter

### Descripción del Producto
- Campo requerido
- Debe ser un string
- Sin longitud máxima (columna TEXT en la base de datos)

### Precio del Producto
- Campo requerido
- Debe ser un número
- Valor mínimo: 0 (no negativo)
- Almacenado con 2 decimales de precisión
- Valor máximo: 999,999.99 (restricción de base de datos)

**Nota sobre el Manejo de Precios:**
La API acepta tanto números como strings para el precio (ej. `19.99` o `"19.99"`), que se convierten automáticamente a números mediante `class-transformer`. La base de datos almacena los precios como `DECIMAL(10,2)`, y TypeORM utiliza un transformador personalizado para asegurar que las respuestas de la API devuelvan valores numéricos en lugar de strings.

## Pruebas

El proyecto incluye pruebas exhaustivas en tres niveles:

### Resumen de Cobertura de Pruebas

- **Pruebas Unitarias (Service)**: 28 pruebas
- **Pruebas Unitarias (Controller)**: 34 pruebas  
- **Pruebas E2E**: 45 pruebas
- **Total**: 107 pruebas

### Ejecutar Pruebas

**Todas las pruebas unitarias:**
```bash
npm test
```

**Modo watch (para desarrollo):**
```bash
npm run test:watch
```

**Reporte de cobertura:**
```bash
npm run test:cov
```

Abre `coverage/lcov-report/index.html` para ver la cobertura detallada.

**Pruebas E2E (requiere base de datos):**
```bash
npm run test:e2e
```

**Archivo de prueba específico:**
```bash
npm test -- products.service.spec.ts
npm run test:e2e -- products.e2e-spec.ts
```

### Configuración de Base de Datos para Pruebas

Las pruebas E2E usan la misma base de datos que desarrollo. Para aislamiento, crea una base de datos de prueba separada:

```bash
docker exec -it igloolab_postgres psql -U igloolab_admin -d postgres \
  -c "CREATE DATABASE products_db_test;"
```

Actualiza `.env.test`:
```env
DB_NAME=products_db_test
```

### Qué se Prueba

**Capa de Servicio:**
- Operaciones CRUD con repositorio mockeado
- Manejo de errores (NotFoundException)
- Casos extremos (valores mín/máx, caracteres especiales)
- Operaciones concurrentes
- Integridad de datos

**Capa de Controlador:**
- Manejo de peticiones HTTP
- Validación de peticiones
- Formato de respuestas
- Propagación de errores
- Conversión de parámetros ID

**Capa E2E:**
- Ciclo de vida completo de la API (crear → leer → actualizar → eliminar)
- Validación de peticiones (errores 400)
- Escenarios de no encontrado (errores 404)
- Peticiones concurrentes
- Integración con base de datos
- Manejo de Unicode y caracteres especiales
- Precisión decimal

Para documentación detallada de pruebas, ver [TESTING.md](./TESTING.md).

## Calidad del Código

### Linting

```bash
npm run lint
npm run lint -- --fix
```

La configuración de ESLint incluye:
- Verificación de tipos de TypeScript
- Integración con Prettier
- Reglas específicas de NestJS
- Exenciones para archivos de prueba

### Formateo

```bash
npm run format
```

Prettier formatea automáticamente el código según los estándares del proyecto.

### Verificación de Tipos

TypeScript está configurado con:
- `strict: false` (configuración actual)
- `strictNullChecks: true`
- `noImplicitAny: false`

**Recomendación**: Habilitar modo estricto para producción:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true
  }
}
```

## Patrones de Arquitectura

### Estructura Modular

La aplicación sigue la arquitectura modular de NestJS:

```
AppModule (raíz)
  └── ProductsModule
      ├── ProductsController (capa HTTP)
      ├── ProductsService (lógica de negocio)
      └── TypeOrmModule.forFeature([Product])
```

### Inyección de Dependencias

NestJS utiliza inyección de dependencias en toda la aplicación:

```typescript
@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}
}
```

### Patrón DTO

Los Data Transfer Objects validan y transforman los datos entrantes:

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

### Patrón Repository

TypeORM proporciona el patrón repository para acceso a la base de datos:

```typescript
const product = await this.productsRepository.findOneBy({ id });
await this.productsRepository.save(product);
```

## Consideraciones de Seguridad

### Características de Seguridad Implementadas

**Validación de Entrada:**
- Decoradores de class-validator en todos los DTOs
- whitelist: true (elimina propiedades desconocidas)
- forbidNonWhitelisted: true (rechaza propiedades desconocidas)
- transform: true (coerción de tipos)

**CORS:**
- Actualmente permite todos los orígenes (desarrollo)
- Debe restringirse en producción

**Protección contra Inyección SQL:**
- TypeORM usa consultas parametrizadas
- El patrón repository previene SQL directo

**Seguridad de Tipos:**
- TypeScript previene muchos errores en tiempo de ejecución
- Los pipes de validación capturan datos inválidos

### Recomendaciones de Seguridad

**Para producción, implementar:**

1. **Validación de Variables de Entorno:**
```typescript
import { IsString, IsNumber, validateSync } from 'class-validator';

class EnvironmentVariables {
  @IsString()
  DB_HOST: string;
  
  @IsNumber()
  DB_PORT: number;
}
```

2. **Configuración de CORS:**
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

4. **Limitación de Tasa:**
```bash
npm install @nestjs/throttler
```

```typescript
ThrottlerModule.forRoot([{
  ttl: 60000,
  limit: 10,
}])
```

5. **ParseIntPipe para Parámetros ID:**
```typescript
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return this.productsService.findOne(id);
}
```

Ver [CODE_REVIEW.md](./CODE_REVIEW.md) para un análisis completo de seguridad.

## Gestión de la Base de Datos

### Configuración de TypeORM

Configuración actual (desarrollo):

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

**Advertencia**: `synchronize: true` modifica automáticamente el esquema de la base de datos. Esto es conveniente para desarrollo pero peligroso en producción.

### Migraciones (Enfoque para Producción)

1. **Generar migración:**
```bash
npm run typeorm migration:generate -- -n AddProductsTable
```

2. **Ejecutar migraciones:**
```bash
npm run typeorm migration:run
```

3. **Revertir migración:**
```bash
npm run typeorm migration:revert
```

### Solución de Problemas de Conexión a la Base de Datos

**Conexión rechazada:**
```bash
# Verificar si PostgreSQL está ejecutándose
docker ps | grep postgres

# Iniciar contenedor
docker start igloolab_postgres

# Revisar logs
docker logs igloolab_postgres
```

**Autenticación fallida:**
- Verificar que las credenciales en `.env` coincidan con la configuración del contenedor
- Revisar variables de entorno `POSTGRES_USER` y `POSTGRES_PASSWORD`

**La base de datos no existe:**
```bash
docker exec -it igloolab_postgres psql -U igloolab_admin -d postgres
CREATE DATABASE products_db;
\q
```

## Consideraciones de Rendimiento

### Limitaciones Actuales

1. **Sin Paginación**: `GET /products` devuelve todos los registros
2. **Sin Caché**: Cada petición accede a la base de datos
3. **Sin Indexación**: Solo existe el índice de clave primaria
4. **Sin Pooling de Conexiones**: Usando configuración predeterminada de TypeORM

### Optimizaciones Recomendadas

**Agregar Paginación:**
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

**Agregar Índices de Base de Datos:**
```typescript
@Entity('products')
@Index(['name'])
@Index(['created_at'])
export class Product {
  // ...
}
```

**Implementar Caché:**
```bash
npm install @nestjs/cache-manager cache-manager
```

```typescript
@CacheModule.register({
  ttl: 60, // segundos
  max: 100, // elementos
})
```

## Solución de Problemas

### Puerto Ya en Uso

```bash
# Encontrar proceso usando puerto 3000
lsof -i :3000

# Matar proceso
kill -9 <PID>

# O usar un puerto diferente
PORT=3001 npm run start:dev
```

### Errores de Compilación de TypeScript

```bash
# Limpiar build
rm -rf dist
npm run build

# Verificar configuración de TypeScript
npx tsc --noEmit
```

### Fallos en Pruebas

```bash
# Limpiar caché de Jest
npm test -- --clearCache

# Ejecutar pruebas con salida verbose
npm test -- --verbose

# Ejecutar archivo de prueba individual
npm test -- products.service.spec.ts
```

### Problemas de Conexión a Base de Datos

```bash
# Probar conexión a base de datos
docker exec -it igloolab_postgres psql -U igloolab_admin -d products_db -c "SELECT 1;"

# Reiniciar base de datos (DESTRUCTIVO)
docker exec -it igloolab_postgres psql -U igloolab_admin -d postgres \
  -c "DROP DATABASE products_db; CREATE DATABASE products_db;"
```

## Flujo de Trabajo de Desarrollo

### Agregar una Nueva Funcionalidad

1. **Crear rama de funcionalidad:**
```bash
git checkout -b feature/add-product-categories
```

2. **Generar módulo (si es necesario):**
```bash
nest g module categories
nest g controller categories
nest g service categories
```

3. **Crear entidad:**
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

4. **Crear DTOs:**
```typescript
// src/modules/categories/dto/create-category.dto.ts
export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  name: string;
}
```

5. **Implementar servicio:**
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

6. **Escribir pruebas:**
```bash
# Pruebas unitarias
touch src/modules/categories/categories.service.spec.ts
touch src/modules/categories/categories.controller.spec.ts

# Pruebas E2E
touch test/categories.e2e-spec.ts
```

7. **Ejecutar pruebas:**
```bash
npm test
npm run test:e2e
```

8. **Commit y push:**
```bash
git add .
git commit -m "feat: add categories module"
git push origin feature/add-product-categories
```

### Lista de Verificación para Code Review

Antes de enviar código para revisión:

- [ ] Todas las pruebas pasan (`npm test` y `npm run test:e2e`)
- [ ] Sin errores de linting (`npm run lint`)
- [ ] El código está formateado (`npm run format`)
- [ ] Las nuevas funcionalidades tienen pruebas
- [ ] Los DTOs tienen decoradores de validación
- [ ] El manejo de errores está implementado
- [ ] Los cambios de base de datos tienen migraciones (producción)
- [ ] Las variables de entorno están documentadas
- [ ] El README está actualizado (si es necesario)

## Despliegue

### Lista de Verificación Pre-despliegue

- [ ] Establecer `NODE_ENV=production`
- [ ] Deshabilitar synchronize de TypeORM
- [ ] Usar migraciones de base de datos
- [ ] Configurar CORS con orígenes específicos
- [ ] Agregar encabezados de seguridad helmet.js
- [ ] Implementar limitación de tasa
- [ ] Agregar logging y monitoreo
- [ ] Configurar pipeline de CI/CD
- [ ] Configurar variables de entorno de forma segura
- [ ] Revisar y resolver todos los hallazgos de CODE_REVIEW.md

### Variables de Entorno para Producción

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

### Build para Producción

```bash
npm run build
```

El JavaScript compilado estará en el directorio `dist/`.

### Ejecutar en Producción

```bash
NODE_ENV=production node dist/main
```

O usar un gestor de procesos:

```bash
npm install -g pm2
pm2 start dist/main.js --name product-api
pm2 save
pm2 startup
```

## Documentación

Este proyecto incluye documentación exhaustiva:

- **README.md**: Guía completa para desarrolladores (versión en inglés)
- **README_ES.md** (este archivo): Versión en español de esta guía
- **CODE_REVIEW.md**: Análisis detallado del código con 20 hallazgos
- **TESTING.md**: Guía de pruebas y mejores prácticas
- **TEST_SUMMARY.md**: Desglose de todas las 107 pruebas
- **DELIVERABLES.md**: Resumen ejecutivo para revisores
- **QUICK_REFERENCE.md**: Hoja de referencia de una página


## Decisiones Técnicas

### ¿Por qué NestJS?

- Framework listo para empresas con soporte de TypeScript
- Inyección de dependencias integrada
- Excelente integración con TypeORM
- Utilidades de testing exhaustivas
- Comunidad activa y documentación

### ¿Por qué TypeORM?

- Soporte nativo de TypeScript
- Patrón repository
- Soporte para Active Record y Data Mapper
- Sistema de migraciones
- Amplio soporte de bases de datos

### ¿Por qué PostgreSQL?

- Cumplimiento ACID
- Integridad de datos robusta
- Soporte JSON (para extensiones futuras)
- Excelente rendimiento
- Estándar de la industria para producción

### ¿Por qué Jest?

- Framework de testing predeterminado de NestJS
- Excelente soporte de TypeScript
- Capacidades de mocking integradas
- Testing de snapshots
- Reportes de cobertura


## Licencia

UNLICENSED - Solo para evaluación de prueba técnica de igloolab.


---

**Versión**: 1.0.0  
**Última Actualización**: 10 de noviembre de 2025  
**Mantenedor**: Candidato a Prueba Técnica  
**Audiencia Objetivo**: Equipo de Desarrollo de igloolab
