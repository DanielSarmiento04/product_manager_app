import { useState } from 'react';
import type { Product } from '../types/product';

interface ProductItemProps {
  product: Product;
  onDelete: (id: number) => Promise<boolean>;
}

export const ProductItem = ({ product, onDelete }: ProductItemProps) => {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de eliminar "${product.name}"?`)) {
      setDeleting(true);
      await onDelete(product.id);
      setDeleting(false);
    }
  };

  return (
    <div className="product-item">
      <div className="product-info">
        <h3 className="product-name">{product.name}</h3>
        <p className="product-description">{product.description}</p>
        <p className="product-price">
          <strong>Precio:</strong> ${product.price.toFixed(2)}
        </p>
      </div>
      <div className="product-actions">
        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={deleting}
        >
          {deleting ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
};