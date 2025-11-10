# Product Manager App - Frontend

[Español](./README_es.md) | **English**

A modern, responsive React application for managing pharmaceutical products, built with TypeScript, Vite, and React 19.

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Configuration](#configuration)
- [Available Scripts](#available-scripts)
- [Usage](#usage)
- [API Integration](#api-integration)
- [Components](#components)
- [Type Safety](#type-safety)
- [Code Quality](#code-quality)
- [Development Guidelines](#development-guidelines)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Create Products**: Add new pharmaceutical products with name, description, and price
- **List Products**: View all products in a clean, organized list
- **Delete Products**: Remove products from the system with confirmation
- **Real-time Updates**: Automatic UI updates after CRUD operations
- **Responsive Design**: Mobile-first approach with modern UI/UX
- **Fast Performance**: Built with Vite for lightning-fast development and builds
- **Type Safety**: Full TypeScript implementation with strict type checking
- **Error Handling**: Comprehensive error handling and user feedback
- **Code Quality**: ESLint configuration with React best practices

## Tech Stack

- **Framework**: [React 19](https://react.dev/) - Latest version with improved performance
- **Language**: [TypeScript 5.9](https://www.typescriptlang.org/) - Type-safe JavaScript
- **Build Tool**: [Vite 7](https://vitejs.dev/) - Next generation frontend tooling
- **HTTP Client**: [Axios 1.13](https://axios-http.com/) - Promise-based HTTP client
- **Code Quality**: [ESLint 9](https://eslint.org/) - Pluggable linting utility
- **Type Definitions**: Complete type coverage with @types packages

## Project Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── assets/          # Images, icons, and other static resources
│   ├── components/      # React components
│   │   ├── ProductForm.tsx      # Form for creating products
│   │   ├── ProductList.tsx      # List container component
│   │   └── ProductItem.tsx      # Individual product item
│   ├── hooks/           # Custom React hooks
│   │   └── useProducts.ts       # Product management logic
│   ├── services/        # API and external services
│   │   └── api.ts               # Axios configuration and API calls
│   ├── types/           # TypeScript type definitions
│   │   └── product.ts           # Product-related types
│   ├── App.tsx          # Main application component
│   ├── App.css          # Application styles
│   ├── main.tsx         # Application entry point
│   └── index.css        # Global styles
├── .env                 # Environment variables (create this)
├── eslint.config.js     # ESLint configuration
├── tsconfig.json        # TypeScript configuration
├── vite.config.ts       # Vite configuration
└── package.json         # Dependencies and scripts
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher ([Download](https://nodejs.org/))
- **npm**: v9.0.0 or higher (comes with Node.js)
- **Backend API**: The backend server must be running (default: `http://localhost:3000`)

## Installation

1. **Clone the repository** (if not already done):
   ```bash
   git clone <repository-url>
   cd product_manager_app/frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create environment file**:
   ```bash
   cp .env.example .env
   # Or create .env manually
   ```

4. **Configure environment variables** (see [Configuration](#configuration))

## Configuration

Create a `.env` file in the root of the frontend directory:

```env
# API Configuration
VITE_API_URL=http://localhost:3000

# Optional: Port for development server
# VITE_PORT=5173
```

### Environment Variables

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000` | No |

**Note**: All environment variables in Vite must be prefixed with `VITE_` to be exposed to the client.

## Available Scripts

In the project directory, you can run:

### `npm run dev`
Starts the development server with hot module replacement (HMR).
- Opens at: `http://localhost:5173`
- Auto-reloads on file changes

```bash
npm run dev
```

### `npm run build`
Compiles TypeScript and builds the app for production to the `dist` folder.
- Optimizes the build for best performance
- Minifies code and assets
- Creates source maps

```bash
npm run build
```

### `npm run preview`
Locally previews the production build.
- Useful for testing the production build before deployment

```bash
npm run preview
```

### `npm run lint`
Runs ESLint to check code quality and identify issues.
- Checks all TypeScript and TSX files
- Reports errors and warnings

```bash
npm run lint
```

## Usage

### Starting the Application

1. **Ensure the backend is running**:
   ```bash
   # In the backend directory
   npm run start:dev
   ```

2. **Start the frontend development server**:
   ```bash
   # In the frontend directory
   npm run dev
   ```

3. **Open your browser** and navigate to:
   ```
   http://localhost:5173
   ```

### Using the Application

#### Adding a Product
1. Fill in the product form:
   - **Name**: Product name (e.g., "Paracetamol 500mg")
   - **Description**: Product description
   - **Price**: Product price (must be greater than 0)
2. Click "Agregar Producto" (Add Product)
3. The product will appear in the list below

#### Viewing Products
- All products are displayed automatically when the app loads
- Each product shows: name, description, price, and timestamps
- The list updates in real-time after any operation

#### Deleting a Product
1. Click the "Eliminar" (Delete) button on any product
2. Confirm the action
3. The product will be removed from the list

## API Integration

The application integrates with a NestJS backend API. All API calls are centralized in `src/services/api.ts`.

### API Endpoints Used

```typescript
GET    /products          # Fetch all products
POST   /products          # Create a new product
DELETE /products/:id      # Delete a product by ID
```

### Request/Response Examples

#### Get All Products
```typescript
// Request
GET /products

// Response
[
  {
    "id": 1,
    "name": "Paracetamol 500mg",
    "description": "Pain reliever and fever reducer",
    "price": 12.99,
    "createdAt": "2024-01-10T10:00:00Z",
    "updatedAt": "2024-01-10T10:00:00Z"
  }
]
```

#### Create Product
```typescript
// Request
POST /products
{
  "name": "Aspirin 100mg",
  "description": "Blood thinner",
  "price": 8.50
}

// Response
{
  "id": 2,
  "name": "Aspirin 100mg",
  "description": "Blood thinner",
  "price": 8.50,
  "createdAt": "2024-01-10T10:05:00Z",
  "updatedAt": "2024-01-10T10:05:00Z"
}
```

## Components

### ProductForm
Form component for creating new products.

**Props:**
- `onSubmit: (product: CreateProductDto) => Promise<boolean>` - Callback for form submission

**Features:**
- Input validation
- Loading state during submission
- Form reset on successful submission
- Error feedback

### ProductList
Container component that displays all products.

**Props:**
- `products: Product[]` - Array of products to display
- `loading: boolean` - Loading state indicator
- `onDelete: (id: number) => Promise<boolean>` - Delete callback

**Features:**
- Loading spinner
- Empty state message
- Product grid layout
- Responsive design

### ProductItem
Individual product card component.

**Props:**
- `product: Product` - Product data
- `onDelete: (id: number) => Promise<boolean>` - Delete callback

**Features:**
- Product information display
- Delete confirmation
- Formatted price display
- Timestamp formatting

## Type Safety

The application uses TypeScript for full type safety. Key types are defined in `src/types/product.ts`:

```typescript
// Product entity
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  createdAt?: string;
  updatedAt?: string;
}

// DTO for creating products
interface CreateProductDto {
  name: string;
  description: string;
  price: number;
}
```

### Type-Only Imports

The project uses TypeScript's `verbatimModuleSyntax` option, requiring explicit type-only imports:

```typescript
// Correct
import type { Product } from '../types/product';
import { useState } from 'react';

// Incorrect
import { Product } from '../types/product';
```

## Code Quality

### ESLint Configuration

The project uses ESLint with strict rules:
- React Hooks rules for proper hook usage
- React Refresh for fast HMR
- TypeScript ESLint for type-aware linting
- No `any` types allowed
- Strict type checking

### Best Practices Enforced

- Proper hook dependencies
- No `any` types - use `unknown` with type guards
- Type-only imports for interfaces and types
- Proper error handling with typed catch blocks
- Component composition and reusability

## Development Guidelines

### Adding New Features

1. **Create types** in `src/types/` if needed
2. **Add API methods** in `src/services/api.ts`
3. **Create/update hooks** in `src/hooks/` for business logic
4. **Build components** in `src/components/`
5. **Update tests** if applicable

### Code Style

- Use **functional components** with hooks
- Prefer **named exports** for components
- Use **TypeScript** for all files
- Follow **React best practices**
- Keep components **small and focused**
- Use **custom hooks** for shared logic

### Type Safety Guidelines

```typescript
// Good: Type-safe error handling
try {
  await api.call();
} catch (err: unknown) {
  if (err instanceof Error) {
    console.error(err.message);
  }
}

// Bad: Using any
try {
  await api.call();
} catch (err: any) {
  console.error(err.message);
}
```

## Troubleshooting

### Common Issues

#### 1. API Connection Error

**Problem**: "Error al cargar los productos"

**Solution**:
- Verify backend is running: `http://localhost:3000`
- Check `VITE_API_URL` in `.env`
- Check browser console for CORS errors
- Verify backend allows CORS from `http://localhost:5173`

#### 2. Port Already in Use

**Problem**: Port 5173 is already in use

**Solution**:
```bash
# Kill the process using the port
lsof -ti:5173 | xargs kill -9

# Or use a different port
vite --port 5174
```

#### 3. TypeScript Errors

**Problem**: Type import errors

**Solution**:
- Ensure type imports use `import type { ... }`
- Check `tsconfig.json` for correct configuration
- Run `npm run build` to verify TypeScript compilation

#### 4. Module Not Found

**Problem**: Cannot find module errors

**Solution**:
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 5. Hot Module Replacement Not Working

**Problem**: Changes not reflecting in browser

**Solution**:
- Check if files are being watched correctly
- Restart the dev server: `Ctrl+C` then `npm run dev`
- Clear browser cache or use incognito mode

### Debug Mode

Enable verbose logging by adding to your component:

```typescript
useEffect(() => {
  console.log('Products:', products);
  console.log('Loading:', loading);
  console.log('Error:', error);
}, [products, loading, error]);
```


Built using React, TypeScript, and Vite
