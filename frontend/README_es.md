# Aplicación de Gestión de Productos - Frontend

**Español** | [English](./README.md)

Una aplicación React moderna y responsive para gestionar productos farmacéuticos, construida con TypeScript, Vite y React 19.

## Tabla de Contenidos

- [Características](#características)
- [Stack Tecnológico](#stack-tecnológico)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Requisitos Previos](#requisitos-previos)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Scripts Disponibles](#scripts-disponibles)
- [Uso](#uso)
- [Integración con la API](#integración-con-la-api)
- [Componentes](#componentes)
- [Seguridad de Tipos](#seguridad-de-tipos)
- [Calidad de Código](#calidad-de-código)
- [Guías de Desarrollo](#guías-de-desarrollo)
- [Solución de Problemas](#solución-de-problemas)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

## Características

- **Crear Productos**: Agregar nuevos productos farmacéuticos con nombre, descripción y precio
- **Listar Productos**: Ver todos los productos en una lista limpia y organizada
- **Eliminar Productos**: Remover productos del sistema con confirmación
- **Actualizaciones en Tiempo Real**: Actualización automática de la UI después de operaciones CRUD
- **Diseño Responsive**: Enfoque mobile-first con UI/UX moderna
- **Rendimiento Rápido**: Construido con Vite para desarrollo y builds ultrarrápidos
- **Seguridad de Tipos**: Implementación completa en TypeScript con verificación estricta de tipos
- **Manejo de Errores**: Manejo integral de errores y retroalimentación al usuario
- **Calidad de Código**: Configuración ESLint con mejores prácticas de React

## Stack Tecnológico

- **Framework**: [React 19](https://react.dev/) - Última versión con rendimiento mejorado
- **Lenguaje**: [TypeScript 5.9](https://www.typescriptlang.org/) - JavaScript con tipos seguros
- **Herramienta de Build**: [Vite 7](https://vitejs.dev/) - Herramientas frontend de próxima generación
- **Cliente HTTP**: [Axios 1.13](https://axios-http.com/) - Cliente HTTP basado en promesas
- **Calidad de Código**: [ESLint 9](https://eslint.org/) - Utilidad de linting pluggable
- **Definiciones de Tipos**: Cobertura completa de tipos con paquetes @types

## Estructura del Proyecto

```
frontend/
├── public/               # Recursos estáticos
├── src/
│   ├── assets/          # Imágenes, iconos y otros recursos estáticos
│   ├── components/      # Componentes React
│   │   ├── ProductForm.tsx      # Formulario para crear productos
│   │   ├── ProductList.tsx      # Componente contenedor de lista
│   │   └── ProductItem.tsx      # Item individual de producto
│   ├── hooks/           # Custom React hooks
│   │   └── useProducts.ts       # Lógica de gestión de productos
│   ├── services/        # API y servicios externos
│   │   └── api.ts               # Configuración de Axios y llamadas API
│   ├── types/           # Definiciones de tipos TypeScript
│   │   └── product.ts           # Tipos relacionados con productos
│   ├── App.tsx          # Componente principal de la aplicación
│   ├── App.css          # Estilos de la aplicación
│   ├── main.tsx         # Punto de entrada de la aplicación
│   └── index.css        # Estilos globales
├── .env                 # Variables de entorno (crear este archivo)
├── eslint.config.js     # Configuración de ESLint
├── tsconfig.json        # Configuración de TypeScript
├── vite.config.ts       # Configuración de Vite
└── package.json         # Dependencias y scripts
```

## Requisitos Previos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

- **Node.js**: v18.0.0 o superior ([Descargar](https://nodejs.org/))
- **npm**: v9.0.0 o superior (viene con Node.js)
- **API Backend**: El servidor backend debe estar en ejecución (por defecto: `http://localhost:3000`)

## Instalación

1. **Clonar el repositorio** (si aún no lo has hecho):
   ```bash
   git clone <url-del-repositorio>
   cd product_manager_app/frontend
   ```

2. **Instalar dependencias**:
   ```bash
   npm install
   ```

3. **Crear archivo de entorno**:
   ```bash
   cp .env.example .env
   # O crear .env manualmente
   ```

4. **Configurar variables de entorno** (ver [Configuración](#configuración))

## Configuración

Crea un archivo `.env` en la raíz del directorio frontend:

```env
# Configuración de la API
VITE_API_URL=http://localhost:3000

# Opcional: Puerto para el servidor de desarrollo
# VITE_PORT=5173
```

### Variables de Entorno

| Variable | Descripción | Por Defecto | Requerido |
|----------|-------------|-------------|-----------|
| `VITE_API_URL` | URL base de la API backend | `http://localhost:3000` | No |

**Nota**: Todas las variables de entorno en Vite deben tener el prefijo `VITE_` para ser expuestas al cliente.

## Scripts Disponibles

En el directorio del proyecto, puedes ejecutar:

### `npm run dev`
Inicia el servidor de desarrollo con reemplazo de módulos en caliente (HMR).
- Se abre en: `http://localhost:5173`
- Recarga automáticamente al cambiar archivos

```bash
npm run dev
```

### `npm run build`
Compila TypeScript y construye la aplicación para producción en la carpeta `dist`.
- Optimiza el build para el mejor rendimiento
- Minifica código y recursos
- Crea source maps

```bash
npm run build
```

### `npm run preview`
Previsualiza localmente el build de producción.
- Útil para probar el build de producción antes del despliegue

```bash
npm run preview
```

### `npm run lint`
Ejecuta ESLint para verificar la calidad del código e identificar problemas.
- Verifica todos los archivos TypeScript y TSX
- Reporta errores y advertencias

```bash
npm run lint
```

## Uso

### Iniciando la Aplicación

1. **Asegúrate de que el backend esté corriendo**:
   ```bash
   # En el directorio backend
   npm run start:dev
   ```

2. **Inicia el servidor de desarrollo del frontend**:
   ```bash
   # En el directorio frontend
   npm run dev
   ```

3. **Abre tu navegador** y navega a:
   ```
   http://localhost:5173
   ```

### Usando la Aplicación

#### Agregando un Producto
1. Completa el formulario de producto:
   - **Nombre**: Nombre del producto (ej. "Paracetamol 500mg")
   - **Descripción**: Descripción del producto
   - **Precio**: Precio del producto (debe ser mayor que 0)
2. Haz clic en "Agregar Producto"
3. El producto aparecerá en la lista a continuación

#### Visualizando Productos
- Todos los productos se muestran automáticamente cuando la aplicación carga
- Cada producto muestra: nombre, descripción, precio y marcas de tiempo
- La lista se actualiza en tiempo real después de cualquier operación

#### Eliminando un Producto
1. Haz clic en el botón "Eliminar" en cualquier producto
2. Confirma la acción
3. El producto será removido de la lista

## Integración con la API

La aplicación se integra con una API backend de NestJS. Todas las llamadas a la API están centralizadas en `src/services/api.ts`.

### Endpoints de API Utilizados

```typescript
GET    /products          # Obtener todos los productos
POST   /products          # Crear un nuevo producto
DELETE /products/:id      # Eliminar un producto por ID
```

### Ejemplos de Request/Response

#### Obtener Todos los Productos
```typescript
// Request
GET /products

// Response
[
  {
    "id": 1,
    "name": "Paracetamol 500mg",
    "description": "Analgésico y reductor de fiebre",
    "price": 12.99,
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
]
```

#### Crear Producto
```typescript
// Request
POST /products
{
  "name": "Aspirina 100mg",
  "description": "Anticoagulante",
  "price": 8.50
}

// Response
{
  "id": 2,
  "name": "Aspirina 100mg",
  "description": "Anticoagulante",
  "price": 8.50,
  "createdAt": "2024-01-10T10:05:00Z",
  "updatedAt": "2024-01-10T10:05:00Z"
}
```

## Componentes

### ProductForm
Componente de formulario para crear nuevos productos.

**Props:**
- `onSubmit: (product: CreateProductDto) => Promise<boolean>` - Callback para el envío del formulario

**Características:**
- Validación de entrada
- Estado de carga durante el envío
- Reseteo del formulario en envío exitoso
- Retroalimentación de errores

### ProductList
Componente contenedor que muestra todos los productos.

**Props:**
- `products: Product[]` - Array de productos a mostrar
- `loading: boolean` - Indicador de estado de carga
- `onDelete: (id: number) => Promise<boolean>` - Callback de eliminación

**Características:**
- Spinner de carga
- Mensaje de estado vacío
- Diseño de cuadrícula de productos
- Diseño responsive

### ProductItem
Componente de tarjeta de producto individual.

**Props:**
- `product: Product` - Datos del producto
- `onDelete: (id: number) => Promise<boolean>` - Callback de eliminación

**Características:**
- Visualización de información del producto
- Confirmación de eliminación
- Visualización de precio formateado
- Formato de marcas de tiempo

## Seguridad de Tipos

La aplicación usa TypeScript para seguridad de tipos completa. Los tipos clave están definidos en `src/types/product.ts`:

```typescript
// Entidad Product
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

// DTO para crear productos
interface CreateProductDto {
  name: string;
  description: string;
  price: number;
}
```

### Importaciones Solo de Tipos

El proyecto usa la opción `verbatimModuleSyntax` de TypeScript, requiriendo importaciones explícitas de solo tipos:

```typescript
// Correcto
import type { Product } from '../types/product';
import { useState } from 'react';

// Incorrecto
import { Product } from '../types/product';
```

## Calidad de Código

### Configuración de ESLint

El proyecto usa ESLint con reglas estrictas:
- Reglas de React Hooks para uso apropiado de hooks
- React Refresh para HMR rápido
- TypeScript ESLint para linting consciente de tipos
- No se permiten tipos `any`
- Verificación de tipos estricta

### Mejores Prácticas Aplicadas

- Dependencias apropiadas de hooks
- Sin tipos `any` - usar `unknown` con guardias de tipo
- Importaciones solo de tipos para interfaces y tipos
- Manejo apropiado de errores con bloques catch tipados
- Composición y reutilización de componentes

## Guías de Desarrollo

### Agregando Nuevas Características

1. **Crear tipos** en `src/types/` si es necesario
2. **Agregar métodos de API** en `src/services/api.ts`
3. **Crear/actualizar hooks** en `src/hooks/` para la lógica de negocio
4. **Construir componentes** en `src/components/`
5. **Actualizar pruebas** si aplica

### Estilo de Código

- Usa **componentes funcionales** con hooks
- Prefiere **exportaciones nombradas** para componentes
- Usa **TypeScript** para todos los archivos
- Sigue **mejores prácticas de React**
- Mantén componentes **pequeños y enfocados**
- Usa **custom hooks** para lógica compartida

### Guías de Seguridad de Tipos

```typescript
// Bueno: Manejo de errores con tipos seguros
try {
  await api.call();
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}

// Malo: Usando any
try {
  await api.call();
} catch (err: any) {
  console.error(err.message);
}
```

## Solución de Problemas

### Problemas Comunes

#### 1. Error de Conexión a la API

**Problema**: "Error al cargar los productos"

**Solución**:
- Verifica que el backend esté corriendo: `http://localhost:3000`
- Revisa `VITE_API_URL` en `.env`
- Revisa la consola del navegador para errores CORS
- Verifica que el backend permite CORS desde `http://localhost:5173`

#### 2. Puerto Ya en Uso

**Problema**: El puerto 5173 ya está en uso

**Solución**:
```bash
# Matar el proceso usando el puerto
lsof -ti:5173 | xargs kill -9

# O usar un puerto diferente
vite --port 5174
```

#### 3. Errores de TypeScript

**Problema**: Errores de importación de tipos

**Solución**:
- Asegúrate de que las importaciones de tipos usen `import type { ... }`
- Verifica `tsconfig.json` para la configuración correcta
- Ejecuta `npm run build` para verificar la compilación de TypeScript

#### 4. Módulo No Encontrado

**Problema**: Errores de que no se puede encontrar el módulo

**Solución**:
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
```

#### 5. Hot Module Replacement No Funciona

**Problema**: Los cambios no se reflejan en el navegador

**Solución**:
- Verifica que los archivos estén siendo observados correctamente
- Reinicia el servidor de desarrollo: `Ctrl+C` luego `npm run dev`
- Limpia la caché del navegador o usa modo incógnito

### Modo de Depuración

Habilita el logging detallado agregando a tu componente:

```typescript
useEffect(() => {
  console.log('Products:', products);
  console.log('Loading:', loading);
  console.log('Error:', error);
}, [products, loading, error]);
```


Construido usando React, TypeScript y Vite
