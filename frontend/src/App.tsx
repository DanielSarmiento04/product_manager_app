import { ProductForm } from './components/ProductForm';
import { ProductList } from './components/ProductList';
import { useProducts } from './hooks/useProducts';
import './App.css';

function App() {
  const { products, loading, error, createProduct, deleteProduct } = useProducts();

  return (
    <div className="app">
      <header className="app-header">
        <h1>🏥 Gestión de Productos - IglooLab</h1>
        <p>Sistema de gestión para productos farmacéuticos</p>
      </header>

      <main className="app-main">
        {error && (
          <div className="alert alert-error">
            <strong>Error:</strong> {error}
          </div>
        )}

        <section className="form-section">
          <ProductForm onSubmit={createProduct} />
        </section>

        <section className="list-section">
          <ProductList
            products={products}
            loading={loading}
            onDelete={deleteProduct}
          />
        </section>
      </main>

      <footer className="app-footer">
        <p>© 2024 IglooLab - Prueba Técnica Full Stack Developer</p>
      </footer>
    </div>
  );
}

export default App;