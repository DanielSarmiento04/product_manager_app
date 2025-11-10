import type { Product } from '../types/product';
import { ProductItem } from './ProductItem';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  onDelete: (id: number) => Promise<boolean>;
}

export const ProductList = ({ products, loading, onDelete }: ProductListProps) => {
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando productos...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="empty-state">
        <p>No hay productos disponibles.</p>
        <p>Agrega tu primer producto usando el formulario de arriba.</p>
      </div>
    );
  }

  return (
    <div className="product-list">
      <h2>Lista de Productos ({products.length})</h2>
      <div className="products-grid">
        {products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};