-- Database initialization script for igloolab products application
-- This script runs automatically when the PostgreSQL container starts for the first time

-- Create the products table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_products_name ON products(name);

-- Insert some sample data for testing (optional - remove if not needed)
INSERT INTO products (name, description, price) VALUES
    ('Paracetamol 500mg', 'Analgésico y antipirético de venta libre', 5.99),
    ('Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', 8.50),
    ('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 15.75),
    ('Omeprazol 20mg', 'Inhibidor de la bomba de protones', 12.30),
    ('Loratadina 10mg', 'Antihistamínico para alergias', 6.45)
ON CONFLICT DO NOTHING;

-- Create trigger function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_products_updated_at 
    BEFORE UPDATE ON products 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions (if you create additional users)
-- GRANT SELECT, INSERT, UPDATE, DELETE ON products TO your_app_user;
-- GRANT USAGE, SELECT ON SEQUENCE products_id_seq TO your_app_user;