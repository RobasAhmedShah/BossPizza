/*
  # Orders System Database Schema

  1. New Tables
    - `orders`
      - `id` (uuid, primary key)
      - `order_number` (text, unique)
      - `customer_name` (text)
      - `customer_email` (text)
      - `customer_phone` (text)
      - `delivery_address` (jsonb)
      - `order_notes` (text)
      - `payment_method` (text)
      - `subtotal` (numeric)
      - `tax_amount` (numeric)
      - `delivery_fee` (numeric)
      - `total_amount` (numeric)
      - `order_status` (text)
      - `payment_status` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `order_items`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `item_type` (text) - 'menu_item', 'deal', 'custom_pizza'
      - `item_id` (text)
      - `item_name` (text)
      - `item_description` (text)
      - `quantity` (integer)
      - `unit_price` (numeric)
      - `total_price` (numeric)
      - `customizations` (jsonb)
      - `created_at` (timestamp)

    - `order_status_history`
      - `id` (uuid, primary key)
      - `order_id` (uuid, foreign key)
      - `status` (text)
      - `notes` (text)
      - `created_at` (timestamp)
      - `created_by` (text)

  2. Security
    - Enable RLS on all tables
    - Add policies for customers to view their own orders
    - Add policies for admin access

  3. Functions
    - Generate unique order numbers
    - Update order status with history tracking
</
*/

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_name text NOT NULL,
  customer_email text NOT NULL,
  customer_phone text NOT NULL,
  company text,
  delivery_address jsonb NOT NULL,
  order_notes text,
  payment_method text NOT NULL DEFAULT 'card',
  subtotal numeric(10,2) NOT NULL DEFAULT 0,
  tax_amount numeric(10,2) NOT NULL DEFAULT 0,
  delivery_fee numeric(10,2) NOT NULL DEFAULT 0,
  total_amount numeric(10,2) NOT NULL DEFAULT 0,
  order_status text NOT NULL DEFAULT 'pending',
  payment_status text NOT NULL DEFAULT 'pending',
  estimated_delivery_time timestamp with time zone,
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  item_type text NOT NULL, -- 'menu_item', 'deal', 'custom_pizza'
  item_id text NOT NULL,
  item_name text NOT NULL,
  item_description text,
  quantity integer NOT NULL DEFAULT 1,
  unit_price numeric(10,2) NOT NULL,
  total_price numeric(10,2) NOT NULL,
  customizations jsonb DEFAULT '{}',
  created_at timestamp with time zone DEFAULT now()
);

-- Order status history table
CREATE TABLE IF NOT EXISTS order_status_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  created_by text DEFAULT 'system'
);

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies for orders
CREATE POLICY "Customers can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (customer_email = auth.jwt() ->> 'email');

CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for order_items
CREATE POLICY "Customers can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- RLS Policies for order_status_history
CREATE POLICY "Customers can view their own order history"
  ON order_status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.customer_email = auth.jwt() ->> 'email'
    )
  );

CREATE POLICY "Anyone can create order history"
  ON order_status_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Admin can view all order history"
  ON order_status_history
  FOR ALL
  TO authenticated
  USING (auth.jwt() ->> 'role' = 'admin');

-- Function to generate unique order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS text AS $$
DECLARE
  new_order_number text;
  counter integer := 1;
BEGIN
  LOOP
    new_order_number := 'BB' || TO_CHAR(NOW(), 'YYYYMMDD') || LPAD(counter::text, 4, '0');
    
    IF NOT EXISTS (SELECT 1 FROM orders WHERE order_number = new_order_number) THEN
      RETURN new_order_number;
    END IF;
    
    counter := counter + 1;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to update order status with history
CREATE OR REPLACE FUNCTION update_order_status(
  order_id_param uuid,
  new_status text,
  notes_param text DEFAULT NULL,
  created_by_param text DEFAULT 'system'
)
RETURNS void AS $$
BEGIN
  -- Update the order status
  UPDATE orders 
  SET 
    order_status = new_status,
    updated_at = now()
  WHERE id = order_id_param;
  
  -- Insert into status history
  INSERT INTO order_status_history (order_id, status, notes, created_by)
  VALUES (order_id_param, new_status, notes_param, created_by_param);
END;
$$ LANGUAGE plpgsql;

-- Function to calculate estimated delivery time
CREATE OR REPLACE FUNCTION calculate_delivery_time()
RETURNS timestamp with time zone AS $$
BEGIN
  -- Add 25-35 minutes to current time for delivery
  RETURN now() + interval '30 minutes';
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_status_history_order_id ON order_status_history(order_id);