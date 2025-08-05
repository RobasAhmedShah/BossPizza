/*
  # Fix RLS Policy for Orders Table

  1. Security Changes
    - Update RLS policy to allow anonymous users to insert orders
    - Allow anonymous users to insert order items and status history
    - Maintain security by restricting read access appropriately

  This enables the checkout process to work for anonymous users while maintaining data security.
*/

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Admin can view all orders" ON orders;
DROP POLICY IF EXISTS "Customers can view their own orders" ON orders;
DROP POLICY IF EXISTS "Anyone can create orders" ON orders;

DROP POLICY IF EXISTS "Admin can view all order items" ON order_items;
DROP POLICY IF EXISTS "Customers can view their own order items" ON order_items;
DROP POLICY IF EXISTS "Anyone can create order items" ON order_items;

DROP POLICY IF EXISTS "Admin can view all order history" ON order_status_history;
DROP POLICY IF EXISTS "Customers can view their own order history" ON order_status_history;
DROP POLICY IF EXISTS "Anyone can create order history" ON order_status_history;

-- Create new policies that allow anonymous order creation
CREATE POLICY "Anyone can create orders"
  ON orders
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Customers can view their own orders"
  ON orders
  FOR SELECT
  TO authenticated
  USING (customer_email = (auth.jwt() ->> 'email'));

CREATE POLICY "Admin can manage all orders"
  ON orders
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Order items policies
CREATE POLICY "Anyone can create order items"
  ON order_items
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Customers can view their own order items"
  ON order_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_items.order_id 
      AND orders.customer_email = (auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Admin can manage all order items"
  ON order_items
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');

-- Order status history policies
CREATE POLICY "Anyone can create order history"
  ON order_status_history
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Customers can view their own order history"
  ON order_status_history
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders 
      WHERE orders.id = order_status_history.order_id 
      AND orders.customer_email = (auth.jwt() ->> 'email')
    )
  );

CREATE POLICY "Admin can manage all order history"
  ON order_status_history
  FOR ALL
  TO authenticated
  USING ((auth.jwt() ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() ->> 'role') = 'admin');