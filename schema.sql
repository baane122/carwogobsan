-- CARWO GOBSAN Database Schema for Insforge
-- Project ID: d2ea6873-871d-41ba-8555-bdf000b97bfc

-- Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(100) NOT NULL,
  name_so VARCHAR(100) NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  image TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(255) NOT NULL,
  name_so VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_so TEXT,
  price DECIMAL(10, 2) NOT NULL,
  price_sos INTEGER, -- Somali Shilling equivalent
  image TEXT NOT NULL,
  images TEXT[], -- Array of additional images
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  stock INTEGER DEFAULT 0,
  featured BOOLEAN DEFAULT FALSE,
  active BOOLEAN DEFAULT TRUE,
  specs JSONB, -- Product specifications as JSON
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255),
  address TEXT,
  district VARCHAR(100), -- Hargeisa districts: New Hargeisa, Golis, 26 June, etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  items JSONB NOT NULL, -- Array of {product_id, product_name, quantity, price}
  total DECIMAL(10, 2) NOT NULL,
  total_sos INTEGER,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, processing, shipped, delivered, cancelled
  delivery_option VARCHAR(50) DEFAULT 'pickup', -- pickup, delivery
  district VARCHAR(100),
  address TEXT,
  notes TEXT,
  whatsapp_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items table (normalized version)
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  product_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Translation strings table
CREATE TABLE translations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key VARCHAR(100) UNIQUE NOT NULL,
  value_en TEXT NOT NULL,
  value_so TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- WhatsApp clicks tracking
CREATE TABLE whatsapp_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  page VARCHAR(100), -- homepage, product, cart
  session_id VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_active ON products(active);
CREATE INDEX idx_orders_customer ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created ON orders(created_at DESC);
CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_product ON order_items(product_id);

-- Insert default categories
INSERT INTO categories (name_en, name_so, slug, image) VALUES
('Cookware', 'Qabka Cuntada', 'cookware', 'https://images.unsplash.com/photo-1584990347449-a5ab8b3dcde5?w=400'),
('Small Appliances', 'Qalabka Yar', 'small-appliances', 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400'),
('Tableware', 'Safkeeda', 'tableware', 'https://images.unsplash.com/photo-1595908126944-28a0d8f6035f?w=400'),
('Electronics', 'Elektarooniga', 'electronics', 'https://images.unsplash.com/photo-1498049794561-2890e3549cc4?w=400'),
('Home Appliances', 'Qalabka Guriga', 'home-appliances', 'https://images.unsplash.com/photo-1556909114-44e7e7333e34?w=400'),
('Phones & Tablets', 'Gacamaha & Taabblayada', 'phones-tablets', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400');

-- Insert default settings
INSERT INTO settings (key, value) VALUES
('currency_usd_to_sos', '{"rate": 9000, "last_updated": "2026-06-12"}'),
('delivery_zones', '{"zones": [{"name": "New Hargeisa", "price": 0}, {"name": "Golis", "price": 5}, {"name": "26 June", "price": 5}, {"name": "State House", "price": 10}, {"name": "Airport", "price": 15}]}'),
('store_info', '{"name": "CARWO GOBSAN", "location": "Suuqa Hadhwanaag Mall, Hargeisa, Somaliland", "phone": "+252633800999", "email": "info@carwogobsan.com", "whatsapp": "https://wa.me/252633800999"}'),
('delivery_options', '{"pickup": {"name": "Pickup at Hadhwanaag Mall", "price": 0, "name_so": "Kaxinta Hadhwanaag Mall"}, "delivery": {"name": "Home Delivery", "price_from": 5, "name_so": "Geynta Guriga"}}');

-- Insert sample products
INSERT INTO products (name_en, name_so, description_en, description_so, price, price_sos, image, category_id, stock, featured, active) VALUES
('Electric Rice Cooker 1.8L', 'Qabka Bariiska Elektarooniga 1.8L', 'Automatic rice cooker with keep-warm function. Perfect for family meals.', 'Qabka bariiska oo toos ah oo leh hawl la ilaaliyo. Ku habboon cuntada qoyska.', 45.00, 405000, 'https://images.unsplash.com/photo-1584990347449-a5ab8b3dcde5?w=800', (SELECT id FROM categories WHERE slug = 'small-appliances'), 15, true, true),
('Stainless Steel Pot Set', 'Digiryo Steelka Ah', '3-piece stainless steel pot set with lids. Durable and easy to clean.', 'Digiryo 3-gees ah oo steelka ah oo leh daboolaya. Adag oo daahirka fudud.', 85.00, 765000, 'https://images.unsplash.com/photo-1595908126944-28a0d8f6035f?w=800', (SELECT id FROM categories WHERE slug = 'cookware'), 20, true, true),
('Non-Stick Frying Pan 28cm', 'Digirka Non-Stick 28cm', 'Premium non-stick frying pan with heat-resistant handle.', 'Digirka non-stick ee sareeya oo leh gacan diirada ku hortagta.', 25.00, 225000, 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800', (SELECT id FROM categories WHERE slug = 'cookware'), 30, true, true),
('Electric Kettle 1.7L', 'Dhibicda Elektarooniga 1.7L', 'Fast boiling electric kettle with automatic shut-off.', 'Dhibicda koraysa degdeg ah oo toos u xirma.', 30.00, 270000, 'https://images.unsplash.com/photo-1556909114-44e7e7333e34?w=800', (SELECT id FROM categories WHERE slug = 'small-appliances'), 25, false, true),
('Ceramic Dinner Set 16-Piece', 'Safkeeda Ceeramiga 16-Qayb', 'Complete dinner set including plates, bowls, and cups.', 'Safkeeda oo dhan oo ka mid ah saxanka, digirka, iyo koobka.', 55.00, 495000, 'https://images.unsplash.com/photo-1595908126944-28a0d8f6035f?w=800', (SELECT id FROM categories WHERE slug = 'tableware'), 12, false, true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply triggers to all tables
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_translations_updated_at BEFORE UPDATE ON translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();