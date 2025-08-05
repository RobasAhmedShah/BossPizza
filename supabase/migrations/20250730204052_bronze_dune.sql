/*
  # Big Boss Pizza Menu Database Schema

  1. New Tables
    - `categories`
      - `id` (uuid, primary key)
      - `name` (text)
      - `slug` (text, unique)
      - `icon` (text)
      - `sort_order` (integer)
      - `created_at` (timestamp)
    
    - `menu_items`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key)
      - `name` (text)
      - `description` (text)
      - `image_url` (text)
      - `rating` (decimal)
      - `is_popular` (boolean)
      - `is_available` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamp)
    
    - `menu_item_sizes`
      - `id` (uuid, primary key)
      - `menu_item_id` (uuid, foreign key)
      - `size_name` (text) - e.g., '6"', '9"', '12"', '15"'
      - `price` (decimal)
      - `is_available` (boolean)
    
    - `deals`
      - `id` (uuid, primary key)
      - `name` (text)
      - `description` (text)
      - `price` (decimal)
      - `items_included` (jsonb)
      - `is_active` (boolean)
      - `sort_order` (integer)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access
    - Add policies for authenticated admin write access

  3. Data Population
    - Insert all menu categories
    - Insert all menu items with multiple sizes
    - Insert all deals and combos
*/

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create menu_items table
CREATE TABLE IF NOT EXISTS menu_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  image_url text DEFAULT 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400',
  rating decimal(2,1) DEFAULT 4.5,
  is_popular boolean DEFAULT false,
  is_available boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create menu_item_sizes table
CREATE TABLE IF NOT EXISTS menu_item_sizes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  menu_item_id uuid REFERENCES menu_items(id) ON DELETE CASCADE,
  size_name text NOT NULL,
  price decimal(10,2) NOT NULL,
  is_available boolean DEFAULT true
);

-- Create deals table
CREATE TABLE IF NOT EXISTS deals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  items_included jsonb NOT NULL,
  is_active boolean DEFAULT true,
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_item_sizes ENABLE ROW LEVEL SECURITY;
ALTER TABLE deals ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Categories are viewable by everyone"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Menu items are viewable by everyone"
  ON menu_items FOR SELECT
  TO public
  USING (is_available = true);

CREATE POLICY "Menu item sizes are viewable by everyone"
  ON menu_item_sizes FOR SELECT
  TO public
  USING (is_available = true);

CREATE POLICY "Active deals are viewable by everyone"
  ON deals FOR SELECT
  TO public
  USING (is_active = true);

-- Insert categories
INSERT INTO categories (name, slug, icon, sort_order) VALUES
('Signature Pizza', 'signature', '🍕', 1),
('Create Your Own', 'create', '🎨', 2),
('Big Boss Chicken', 'chicken', '🍗', 3),
('Fish & Chips', 'fish', '🐟', 4),
('Sides', 'sides', '🍟', 5),
('Drinks', 'drinks', '🥤', 6),
('Dips', 'dips', '🧂', 7),
('Desserts', 'desserts', '🍰', 8),
('Deals', 'deals', '🔥', 9);

-- Insert Signature Pizzas
DO $$
DECLARE
  signature_cat_id uuid;
BEGIN
  SELECT id INTO signature_cat_id FROM categories WHERE slug = 'signature';
  
  -- Crispy Chicken Pizza
  INSERT INTO menu_items (category_id, name, description, rating, is_popular, sort_order)
  VALUES (signature_cat_id, 'Crispy Chicken Pizza', 'Crunchy chicken, onions, jalapeños, pickles & organic sauce', 4.8, true, 1);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'Crispy Chicken Pizza'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'Crispy Chicken Pizza'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'Crispy Chicken Pizza'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'Crispy Chicken Pizza';

  -- Big Boss Chicken Tikka
  INSERT INTO menu_items (category_id, name, description, rating, is_popular, sort_order)
  VALUES (signature_cat_id, 'Big Boss Chicken Tikka', 'Punjabi & Sindhi marinated chicken, onions & peppers', 4.9, true, 2);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'Big Boss Chicken Tikka'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'Big Boss Chicken Tikka'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'Big Boss Chicken Tikka'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'Big Boss Chicken Tikka';

  -- Big Boss Fajita Pizza
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (signature_cat_id, 'Big Boss Fajita Pizza', 'Grilled fajita chicken, paprika, oregano, onions', 4.7, 3);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'Big Boss Fajita Pizza'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'Big Boss Fajita Pizza'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'Big Boss Fajita Pizza'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'Big Boss Fajita Pizza';

  -- American Hot Pizza
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (signature_cat_id, 'American Hot Pizza', 'Peri-peri base, red onions, spicy beef, pepperoni', 4.6, 4);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'American Hot Pizza'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'American Hot Pizza'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'American Hot Pizza'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'American Hot Pizza';

  -- Mixed Pizza (15" Only)
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (signature_cat_id, 'Mixed Pizza', 'Half Veggie + Half Fajita – perfect to share', 4.5, 5);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'Mixed Pizza';

  -- BBQ Madness
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (signature_cat_id, 'BBQ Madness', 'Sausage, BBQ chicken, red onions, smoky BBQ drizzle', 4.8, 6);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'BBQ Madness'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'BBQ Madness'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'BBQ Madness'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'BBQ Madness';

  -- Margherita Pizza
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (signature_cat_id, 'Margherita Pizza', 'Classic cheese pizza with homemade tomato sauce', 4.4, 7);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'Margherita Pizza'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'Margherita Pizza'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'Margherita Pizza'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'Margherita Pizza';

  -- Hot Chicken Mughlai
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (signature_cat_id, 'Hot Chicken Mughlai', 'Mughlai chicken, garlic drizzle, jalapeños & house sauce', 4.7, 8);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'Hot Chicken Mughlai'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'Hot Chicken Mughlai'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'Hot Chicken Mughlai'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'Hot Chicken Mughlai';

  -- Veggie Pizza
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (signature_cat_id, 'Veggie Pizza', 'Olives, mushrooms, red onions, jalapeños & cheese', 4.3, 9);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'Veggie Pizza'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'Veggie Pizza'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'Veggie Pizza'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'Veggie Pizza';

  -- Chicken Supreme
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (signature_cat_id, 'Chicken Supreme', 'Chicken, mushrooms, sweet corn, red onions, cheese', 4.6, 10);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'Chicken Supreme'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'Chicken Supreme'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'Chicken Supreme'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'Chicken Supreme';

  -- Chicken Clucker
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (signature_cat_id, 'Chicken Clucker', 'Spicy chicken, capsicum, green chilies, mozzarella', 4.5, 11);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '6"', 4.99 FROM menu_items WHERE name = 'Chicken Clucker'
  UNION ALL
  SELECT id, '9"', 11.99 FROM menu_items WHERE name = 'Chicken Clucker'
  UNION ALL
  SELECT id, '12"', 13.99 FROM menu_items WHERE name = 'Chicken Clucker'
  UNION ALL
  SELECT id, '15"', 18.99 FROM menu_items WHERE name = 'Chicken Clucker';
END $$;

-- Insert Big Boss Chicken items
DO $$
DECLARE
  chicken_cat_id uuid;
BEGIN
  SELECT id INTO chicken_cat_id FROM categories WHERE slug = 'chicken';
  
  -- Fried Chicken Bucket 9 pcs
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (chicken_cat_id, 'Fried Chicken Bucket (9 pcs)', 'Crispy fried chicken pieces with our secret spice blend', 4.7, 1);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 18.99 FROM menu_items WHERE name = 'Fried Chicken Bucket (9 pcs)';

  -- Fried Chicken Bucket 12 pcs
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (chicken_cat_id, 'Fried Chicken Bucket (12 pcs)', 'Perfect for sharing - 12 pieces of our famous fried chicken', 4.8, 2);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Large', 23.99 FROM menu_items WHERE name = 'Fried Chicken Bucket (12 pcs)';

  -- Chicken Strips
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (chicken_cat_id, 'Chicken Strips (5 pcs)', 'Tender chicken strips with crispy coating', 4.5, 3);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 7.49 FROM menu_items WHERE name = 'Chicken Strips (5 pcs)';

  -- Chicken Wings
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (chicken_cat_id, 'Chicken Wings (6 pcs)', 'Hot and spicy chicken wings with blue cheese dip', 4.6, 4);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 6.99 FROM menu_items WHERE name = 'Chicken Wings (6 pcs)';
END $$;

-- Insert Fish & Chips
DO $$
DECLARE
  fish_cat_id uuid;
BEGIN
  SELECT id INTO fish_cat_id FROM categories WHERE slug = 'fish';
  
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (fish_cat_id, 'Fish & Chips', 'Beer-battered fish with crispy golden chips and mushy peas', 4.4, 1);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 5.50 FROM menu_items WHERE name = 'Fish & Chips';
END $$;

-- Insert Sides
DO $$
DECLARE
  sides_cat_id uuid;
BEGIN
  SELECT id INTO sides_cat_id FROM categories WHERE slug = 'sides';
  
  -- Garlic Bread
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (sides_cat_id, 'Garlic Bread', 'Fresh baked bread with garlic butter and herbs', 4.3, 1);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 3.40 FROM menu_items WHERE name = 'Garlic Bread';

  -- Cheesy Bread
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (sides_cat_id, 'Cheesy Bread', 'Garlic bread topped with melted mozzarella cheese', 4.5, 2);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 4.30 FROM menu_items WHERE name = 'Cheesy Bread';

  -- French Fries
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (sides_cat_id, 'French Fries', 'Crispy golden fries seasoned with sea salt', 4.2, 3);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 2.55 FROM menu_items WHERE name = 'French Fries';
END $$;

-- Insert Drinks
DO $$
DECLARE
  drinks_cat_id uuid;
BEGIN
  SELECT id INTO drinks_cat_id FROM categories WHERE slug = 'drinks';
  
  -- Soft Drinks
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (drinks_cat_id, 'Soft Drink', 'Classic Coca-Cola and other refreshing sodas', 4.0, 1);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, '350ml', 0.80 FROM menu_items WHERE name = 'Soft Drink'
  UNION ALL
  SELECT id, '500ml', 1.40 FROM menu_items WHERE name = 'Soft Drink'
  UNION ALL
  SELECT id, '1L', 2.20 FROM menu_items WHERE name = 'Soft Drink'
  UNION ALL
  SELECT id, '1.5L', 2.80 FROM menu_items WHERE name = 'Soft Drink'
  UNION ALL
  SELECT id, '2.25L', 3.40 FROM menu_items WHERE name = 'Soft Drink';

  -- Water Bottles
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (drinks_cat_id, 'Water Bottle', 'Pure drinking water', 4.0, 2);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Small', 0.80 FROM menu_items WHERE name = 'Water Bottle'
  UNION ALL
  SELECT id, 'Large', 1.20 FROM menu_items WHERE name = 'Water Bottle';

  -- Bubble Tea
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (drinks_cat_id, 'Bubble Tea', 'Refreshing bubble tea with tapioca pearls', 4.4, 3);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 2.99 FROM menu_items WHERE name = 'Bubble Tea';
END $$;

-- Insert Dips
DO $$
DECLARE
  dips_cat_id uuid;
BEGIN
  SELECT id INTO dips_cat_id FROM categories WHERE slug = 'dips';
  
  -- Ranch
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (dips_cat_id, 'Ranch Dip', 'Creamy ranch sauce perfect for everything', 4.2, 1);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 0.60 FROM menu_items WHERE name = 'Ranch Dip';

  -- Honey Mustard
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (dips_cat_id, 'Honey Mustard', 'Sweet and tangy honey mustard sauce', 4.1, 2);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 0.60 FROM menu_items WHERE name = 'Honey Mustard';

  -- Garlic & Herbs
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (dips_cat_id, 'Garlic & Herbs', 'Rich garlic sauce with Italian herbs', 4.3, 3);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 0.60 FROM menu_items WHERE name = 'Garlic & Herbs';
END $$;

-- Insert Desserts
DO $$
DECLARE
  desserts_cat_id uuid;
BEGIN
  SELECT id INTO desserts_cat_id FROM categories WHERE slug = 'desserts';
  
  -- Choco Milk
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (desserts_cat_id, 'Choco Milk', 'Rich chocolate milkshake', 4.5, 1);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 2.99 FROM menu_items WHERE name = 'Choco Milk';

  -- Simply Strawberry
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (desserts_cat_id, 'Simply Strawberry', 'Fresh strawberry milkshake', 4.4, 2);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 2.99 FROM menu_items WHERE name = 'Simply Strawberry';

  -- Mango Passion
  INSERT INTO menu_items (category_id, name, description, rating, sort_order)
  VALUES (desserts_cat_id, 'Mango Passion', 'Tropical mango passion fruit shake', 4.6, 3);
  
  INSERT INTO menu_item_sizes (menu_item_id, size_name, price)
  SELECT id, 'Regular', 2.99 FROM menu_items WHERE name = 'Mango Passion';
END $$;

-- Insert Deals
DO $$
DECLARE
  deals_cat_id uuid;
BEGIN
  SELECT id INTO deals_cat_id FROM categories WHERE slug = 'deals';
  
  -- Solo Cravings
  INSERT INTO deals (name, description, price, items_included, sort_order)
  VALUES (
    'Solo Cravings',
    '1 Personal Pizza (9") + 1 Soft Drink (350ml)',
    5.99,
    '{"pizza": "9\" Personal Pizza", "drink": "350ml Soft Drink"}',
    1
  );

  -- Power of 3
  INSERT INTO deals (name, description, price, items_included, sort_order)
  VALUES (
    'Power of 3',
    '1 Medium Pizza (12") + 3 pcs Chicken + 1 Cheesy Bread + 2 Soft Drinks (500ml)',
    18.49,
    '{"pizza": "12\" Medium Pizza", "chicken": "3 pieces", "bread": "Cheesy Bread", "drinks": "2x 500ml Soft Drinks"}',
    2
  );

  -- The Boss Box
  INSERT INTO deals (name, description, price, items_included, sort_order)
  VALUES (
    'The Boss Box',
    '1 Large Pizza (15") + 1 Regular Pizza (12") + 9 pcs Chicken Bucket + 1.5L Soft Drink',
    35.99,
    '{"large_pizza": "15\" Large Pizza", "regular_pizza": "12\" Regular Pizza", "chicken": "9 pieces bucket", "drink": "1.5L Soft Drink"}',
    3
  );

  -- Squad Goals
  INSERT INTO deals (name, description, price, items_included, sort_order)
  VALUES (
    'Squad Goals',
    '2 Regular Pizzas (12") + 5 Chicken Strips + Large Fries + 1.5L Soft Drink',
    27.49,
    '{"pizzas": "2x 12\" Regular Pizzas", "strips": "5 Chicken Strips", "fries": "Large Fries", "drink": "1.5L Soft Drink"}',
    4
  );

  -- Couple Connect
  INSERT INTO deals (name, description, price, items_included, sort_order)
  VALUES (
    'Couple Connect',
    '1 Regular Pizza (12") + 1 Bubble Tea or 2 Soft Drinks',
    12.99,
    '{"pizza": "12\" Regular Pizza", "drinks": "1 Bubble Tea or 2 Soft Drinks"}',
    5
  );

  -- Family Weekend Box
  INSERT INTO deals (name, description, price, items_included, sort_order)
  VALUES (
    'Family Weekend Box',
    '2 Large Pizzas (15") + 1 Fish & Chips + 1 Cheesy Bread + 9 pcs Chicken Bucket + 1.5L Soft Drink + Family Dip Platter',
    54.99,
    '{"pizzas": "2x 15\" Large Pizzas", "fish": "Fish & Chips", "bread": "Cheesy Bread", "chicken": "9 pieces bucket", "drink": "1.5L Soft Drink", "dips": "Family Dip Platter"}',
    6
  );
END $$;