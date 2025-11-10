import { useState, useEffect, useCallback } from 'react';
import { productsApi } from '../services/api';
import type { Product, CreateProductDto } from '../types/product';

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar productos
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await productsApi.getAll();
      setProducts(data);
    } catch (err) {
      setError('Error al cargar los productos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Crear producto
  const createProduct = async (product: CreateProductDto): Promise<boolean> => {
    try {
      setError(null);
      const newProduct = await productsApi.create(product);
      setProducts((prev) => [...prev, newProduct]);
      return true;
    } catch (err: unknown) {
      const errorMessage = 
        err && 
        typeof err === 'object' && 
        'response' in err && 
        err.response && 
        typeof err.response === 'object' && 
        'data' in err.response &&
        err.response.data &&
        typeof err.response.data === 'object' &&
        'message' in err.response.data &&
        typeof err.response.data.message === 'string'
          ? err.response.data.message
          : 'Error al crear el producto';
      setError(errorMessage);
      console.error(err);
      return false;
    }
  };

  // Eliminar producto
  const deleteProduct = async (id: number): Promise<boolean> => {
    try {
      setError(null);
      await productsApi.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      return true;
    } catch (err) {
      setError('Error al eliminar el producto');
      console.error(err);
      return false;
    }
  };

  // Cargar productos al montar el componente
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return {
    products,
    loading,
    error,
    createProduct,
    deleteProduct,
    refreshProducts: fetchProducts,
  };
};