import { useState } from 'react';
import type { FormEvent } from 'react';
import type { CreateProductDto } from '../types/product';

interface ProductFormProps {
  onSubmit: (product: CreateProductDto) => Promise<boolean>;
}

export const ProductForm = ({ onSubmit }: ProductFormProps) => {
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    price: 0,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validación básica
    if (!formData.name.trim() || !formData.description.trim() || formData.price <= 0) {
      alert('Por favor, completa todos los campos correctamente');
      return;
    }

    setSubmitting(true);
    const success = await onSubmit(formData);
    setSubmitting(false);

    if (success) {
      // Resetear formulario
      setFormData({ name: '', description: '', price: 0 });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'price' ? parseFloat(value) || 0 : value,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <h2>Agregar Nuevo Producto</h2>
      
      <div className="form-group">
        <label htmlFor="name">Nombre del Producto</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Paracetamol 500mg"
          required
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="description">Descripción</label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Descripción del producto..."
          rows={3}
          required
          disabled={submitting}
        />
      </div>

      <div className="form-group">
        <label htmlFor="price">Precio ($)</label>
        <input
          type="number"
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="0.00"
          step="0.01"
          min="0"
          required
          disabled={submitting}
        />
      </div>

      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Agregando...' : 'Agregar Producto'}
      </button>
    </form>
  );
};