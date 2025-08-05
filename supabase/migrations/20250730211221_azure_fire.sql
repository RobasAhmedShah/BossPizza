/*
  # Update Big Boss Pizza Menu with Accurate Pricing

  1. Database Updates
    - Clear existing data and insert accurate menu items
    - Update all categories with proper icons and ordering
    - Insert signature pizzas with 4 size options each
    - Add all menu categories with correct pricing
    - Insert deals with proper item inclusions

  2. Menu Structure
    - Signature Pizzas (11 items with 4 sizes each)
    - Create Your Own Pizza (3 crust types with 4 sizes each)
    - Big Boss Chicken (4 items with portions)
    - Fish & Chips (1 item)
    - Sides (3 items)
    - Drinks (8 items with various sizes)
    - Dips (3 items)
    - Desserts/Specials (3 items)
    - Deals (6 special combo deals)

  3. Pricing Structure
    - All prices in Pakistani Rupees (PKR)
    - Multiple size options for pizzas
    - Fixed pricing for other categories
    - Deal pricing for combo offers
*/

-- Clear existing data
DELETE FROM menu_item_sizes;
DELETE FROM menu_items;
DELETE FROM categories;
DELETE FROM deals;

-- Insert Categories with proper ordering and icons
INSERT INTO categories (name, slug, icon, sort_order) VALUES
('Signature Pizzas', 'signature-pizzas', '🍕', 1),
('Create Your Own Pizza', 'create-your-own', '👨‍🍳', 2),
('Big Boss Chicken', 'big-boss-chicken', '🍗', 3),
('Fish & Chips', 'fish-and-chips', '🐟', 4),
('Sides', 'sides', '🍟', 5),
('Drinks', 'drinks', '🥤', 6),
('Dips', 'dips', '🧂', 7),
('Desserts/Specials', 'desserts-specials', '🍰', 8);

-- Get category IDs for reference
DO $$
DECLARE
    signature_pizzas_id uuid;
    create_your_own_id uuid;
    chicken_id uuid;
    fish_chips_id uuid;
    sides_id uuid;
    drinks_id uuid;
    dips_id uuid;
    desserts_id uuid;
BEGIN
    -- Get category IDs
    SELECT id INTO signature_pizzas_id FROM categories WHERE slug = 'signature-pizzas';
    SELECT id INTO create_your_own_id FROM categories WHERE slug = 'create-your-own';
    SELECT id INTO chicken_id FROM categories WHERE slug = 'big-boss-chicken';
    SELECT id INTO fish_chips_id FROM categories WHERE slug = 'fish-and-chips';
    SELECT id INTO sides_id FROM categories WHERE slug = 'sides';
    SELECT id INTO drinks_id FROM categories WHERE slug = 'drinks';
    SELECT id INTO dips_id FROM categories WHERE slug = 'dips';
    SELECT id INTO desserts_id FROM categories WHERE slug = 'desserts-specials';

    -- Insert Signature Pizzas
    INSERT INTO menu_items (category_id, name, description, image_url, rating, is_popular, sort_order) VALUES
    (signature_pizzas_id, 'Crispy Chicken Pizza', 'Crunchy chicken, onions, jalapeños, pickles & organic sauce', 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400', 4.8, true, 1),
    (signature_pizzas_id, 'Big Boss Chicken Tikka', 'Punjabi & Sindhi marinated chicken, onions & peppers', 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=400', 4.9, true, 2),
    (signature_pizzas_id, 'Big Boss Fajita Pizza', 'Grilled fajita chicken, paprika, oregano, onions', 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400', 4.7, true, 3),
    (signature_pizzas_id, 'American Hot Pizza', 'Peri-peri base, red onions, spicy beef, pepperoni', 'https://images.pexels.com/photos/2741444/pexels-photo-2741444.jpeg?auto=compress&cs=tinysrgb&w=400', 4.6, false, 4),
    (signature_pizzas_id, 'Mixed Pizza', 'Half Veggie + Half Fajita – perfect to share (15" Only)', 'https://images.pexels.com/photos/365459/pexels-photo-365459.jpeg?auto=compress&cs=tinysrgb&w=400', 4.5, false, 5),
    (signature_pizzas_id, 'BBQ Madness', 'Sausage, BBQ chicken, red onions, smoky BBQ drizzle', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400', 4.8, true, 6),
    (signature_pizzas_id, 'Margherita Pizza', 'Classic cheese pizza with homemade tomato sauce', 'https://images.pexels.com/photos/1146760/pexels-photo-1146760.jpeg?auto=compress&cs=tinysrgb&w=400', 4.4, false, 7),
    (signature_pizzas_id, 'Hot Chicken Mughlai', 'Mughlai chicken, garlic drizzle, jalapeños & house sauce', 'https://images.pexels.com/photos/2147491/pexels-photo-2147491.jpeg?auto=compress&cs=tinysrgb&w=400', 4.7, false, 8),
    (signature_pizzas_id, 'Veggie Pizza', 'Olives, mushrooms, red onions, jalapeños & cheese', 'https://images.pexels.com/photos/708587/pexels-photo-708587.jpeg?auto=compress&cs=tinysrgb&w=400', 4.3, false, 9),
    (signature_pizzas_id, 'Chicken Supreme', 'Chicken, mushrooms, sweet corn, red onions, cheese', 'https://images.pexels.com/photos/315755/pexels-photo-315755.jpeg?auto=compress&cs=tinysrgb&w=400', 4.6, false, 10),
    (signature_pizzas_id, 'Chicken Clucker', 'Spicy chicken, capsicum, green chilies, mozzarella', 'https://images.pexels.com/photos/1653877/pexels-photo-1653877.jpeg?auto=compress&cs=tinysrgb&w=400', 4.5, false, 11);

    -- Insert Create Your Own Pizza base options
    INSERT INTO menu_items (category_id, name, description, image_url, rating, is_popular, sort_order) VALUES
    (create_your_own_id, 'Original Crust Pizza', 'Classic hand-tossed crust with your choice of toppings', 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400', 4.5, false, 1),
    (create_your_own_id, 'Thin Crust Pizza', 'Crispy and light crust with your choice of toppings', 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400', 4.4, false, 2),
    (create_your_own_id, 'Pan Crust Pizza', 'Thick and fluffy crust with your choice of toppings', 'https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400', 4.6, false, 3);

    -- Insert Big Boss Chicken
    INSERT INTO menu_items (category_id, name, description, image_url, rating, is_popular, sort_order) VALUES
    (chicken_id, 'Fried Chicken Bucket (9 pcs)', 'Crispy fried chicken pieces - perfect for sharing', 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=400', 4.7, true, 1),
    (chicken_id, 'Fried Chicken Bucket (12 pcs)', 'Large crispy fried chicken bucket - family size', 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=400', 4.8, true, 2),
    (chicken_id, 'Chicken Strips (5 pcs)', 'Tender chicken strips with crispy coating', 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=400', 4.5, false, 3),
    (chicken_id, 'Chicken Wings (6 pcs)', 'Juicy chicken wings with special seasoning', 'https://images.pexels.com/photos/2271107/pexels-photo-2271107.jpeg?auto=compress&cs=tinysrgb&w=400', 4.6, false, 4);

    -- Insert Fish & Chips
    INSERT INTO menu_items (category_id, name, description, image_url, rating, is_popular, sort_order) VALUES
    (fish_chips_id, 'Fish & Chips', 'Fresh fish fillet with golden fries', 'https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400', 4.3, false, 1);

    -- Insert Sides
    INSERT INTO menu_items (category_id, name, description, image_url, rating, is_popular, sort_order) VALUES
    (sides_id, 'Garlic Bread', 'Freshly baked bread with garlic butter', 'https://images.pexels.com/photos/4397287/pexels-photo-4397287.jpeg?auto=compress&cs=tinysrgb&w=400', 4.4, false, 1),
    (sides_id, 'Cheesy Bread', 'Garlic bread topped with melted cheese', 'https://images.pexels.com/photos/4397287/pexels-photo-4397287.jpeg?auto=compress&cs=tinysrgb&w=400', 4.6, true, 2),
    (sides_id, 'French Fries', 'Golden crispy potato fries', 'https://images.pexels.com/photos/1893556/pexels-photo-1893556.jpeg?auto=compress&cs=tinysrgb&w=400', 4.2, false, 3);

    -- Insert Drinks
    INSERT INTO menu_items (category_id, name, description, image_url, rating, is_popular, sort_order) VALUES
    (drinks_id, 'Soft Drink (350ml)', 'Refreshing carbonated soft drink', 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400', 4.0, false, 1),
    (drinks_id, 'Soft Drink (500ml)', 'Refreshing carbonated soft drink', 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400', 4.0, false, 2),
    (drinks_id, 'Soft Drink (1L)', 'Large refreshing carbonated soft drink', 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400', 4.1, false, 3),
    (drinks_id, 'Soft Drink (1.5L)', 'Family size carbonated soft drink', 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400', 4.1, true, 4),
    (drinks_id, 'Soft Drink (2.25L)', 'Extra large carbonated soft drink', 'https://images.pexels.com/photos/50593/coca-cola-cold-drink-soft-drink-coke-50593.jpeg?auto=compress&cs=tinysrgb&w=400', 4.2, false, 5),
    (drinks_id, 'Small Water Bottle', 'Pure drinking water', 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=400', 4.0, false, 6),
    (drinks_id, 'Large Water Bottle', 'Large pure drinking water', 'https://images.pexels.com/photos/327090/pexels-photo-327090.jpeg?auto=compress&cs=tinysrgb&w=400', 4.0, false, 7),
    (drinks_id, 'Bubble Tea', 'Refreshing bubble tea with tapioca pearls', 'https://images.pexels.com/photos/4021983/pexels-photo-4021983.jpeg?auto=compress&cs=tinysrgb&w=400', 4.5, true, 8);

    -- Insert Dips
    INSERT INTO menu_items (category_id, name, description, image_url, rating, is_popular, sort_order) VALUES
    (dips_id, 'Ranch', 'Creamy ranch dipping sauce', 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400', 4.3, true, 1),
    (dips_id, 'Honey Mustard', 'Sweet and tangy honey mustard sauce', 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400', 4.2, false, 2),
    (dips_id, 'Garlic & Herbs', 'Aromatic garlic and herbs dipping sauce', 'https://images.pexels.com/photos/4518843/pexels-photo-4518843.jpeg?auto=compress&cs=tinysrgb&w=400', 4.4, false, 3);

    -- Insert Desserts/Specials
    INSERT INTO menu_items (category_id, name, description, image_url, rating, is_popular, sort_order) VALUES
    (desserts_id, 'Choco Milk', 'Rich chocolate milk dessert drink', 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400', 4.5, true, 1),
    (desserts_id, 'Simply Strawberry', 'Fresh strawberry flavored dessert drink', 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400', 4.4, false, 2),
    (desserts_id, 'Mango Passion', 'Tropical mango passion fruit dessert drink', 'https://images.pexels.com/photos/1854652/pexels-photo-1854652.jpeg?auto=compress&cs=tinysrgb&w=400', 4.6, false, 3);

    -- Now insert sizes for all menu items
    -- Signature Pizzas (all have 4 sizes except Mixed Pizza which is 15" only)
    INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_available)
    SELECT id, '6"', 499, true FROM menu_items WHERE name IN ('Crispy Chicken Pizza', 'Big Boss Chicken Tikka', 'Big Boss Fajita Pizza', 'American Hot Pizza', 'BBQ Madness', 'Margherita Pizza', 'Hot Chicken Mughlai', 'Veggie Pizza', 'Chicken Supreme', 'Chicken Clucker')
    UNION ALL
    SELECT id, '9"', 1199, true FROM menu_items WHERE name IN ('Crispy Chicken Pizza', 'Big Boss Chicken Tikka', 'Big Boss Fajita Pizza', 'American Hot Pizza', 'BBQ Madness', 'Margherita Pizza', 'Hot Chicken Mughlai', 'Veggie Pizza', 'Chicken Supreme', 'Chicken Clucker')
    UNION ALL
    SELECT id, '12"', 1399, true FROM menu_items WHERE name IN ('Crispy Chicken Pizza', 'Big Boss Chicken Tikka', 'Big Boss Fajita Pizza', 'American Hot Pizza', 'BBQ Madness', 'Margherita Pizza', 'Hot Chicken Mughlai', 'Veggie Pizza', 'Chicken Supreme', 'Chicken Clucker')
    UNION ALL
    SELECT id, '15"', 1899, true FROM menu_items WHERE name IN ('Crispy Chicken Pizza', 'Big Boss Chicken Tikka', 'Big Boss Fajita Pizza', 'American Hot Pizza', 'BBQ Madness', 'Margherita Pizza', 'Hot Chicken Mughlai', 'Veggie Pizza', 'Chicken Supreme', 'Chicken Clucker');

    -- Mixed Pizza (15" only)
    INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_available)
    SELECT id, '15"', 1899, true FROM menu_items WHERE name = 'Mixed Pizza';

    -- Create Your Own Pizza sizes
    -- Original Crust
    INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_available)
    SELECT id, '6"', 599, true FROM menu_items WHERE name = 'Original Crust Pizza'
    UNION ALL
    SELECT id, '9"', 1299, true FROM menu_items WHERE name = 'Original Crust Pizza'
    UNION ALL
    SELECT id, '12"', 1499, true FROM menu_items WHERE name = 'Original Crust Pizza'
    UNION ALL
    SELECT id, '15"', 2199, true FROM menu_items WHERE name = 'Original Crust Pizza';

    -- Thin Crust
    INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_available)
    SELECT id, '6"', 549, true FROM menu_items WHERE name = 'Thin Crust Pizza'
    UNION ALL
    SELECT id, '9"', 1249, true FROM menu_items WHERE name = 'Thin Crust Pizza'
    UNION ALL
    SELECT id, '12"', 1449, true FROM menu_items WHERE name = 'Thin Crust Pizza'
    UNION ALL
    SELECT id, '15"', 2149, true FROM menu_items WHERE name = 'Thin Crust Pizza';

    -- Pan Crust
    INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_available)
    SELECT id, '6"', 599, true FROM menu_items WHERE name = 'Pan Crust Pizza'
    UNION ALL
    SELECT id, '9"', 1299, true FROM menu_items WHERE name = 'Pan Crust Pizza'
    UNION ALL
    SELECT id, '12"', 1499, true FROM menu_items WHERE name = 'Pan Crust Pizza'
    UNION ALL
    SELECT id, '15"', 2199, true FROM menu_items WHERE name = 'Pan Crust Pizza';

    -- Single size items (all other categories)
    INSERT INTO menu_item_sizes (menu_item_id, size_name, price, is_available)
    SELECT id, 'Regular', 1899, true FROM menu_items WHERE name = 'Fried Chicken Bucket (9 pcs)'
    UNION ALL
    SELECT id, 'Regular', 2399, true FROM menu_items WHERE name = 'Fried Chicken Bucket (12 pcs)'
    UNION ALL
    SELECT id, 'Regular', 749, true FROM menu_items WHERE name = 'Chicken Strips (5 pcs)'
    UNION ALL
    SELECT id, 'Regular', 699, true FROM menu_items WHERE name = 'Chicken Wings (6 pcs)'
    UNION ALL
    SELECT id, 'Regular', 550, true FROM menu_items WHERE name = 'Fish & Chips'
    UNION ALL
    SELECT id, 'Regular', 340, true FROM menu_items WHERE name = 'Garlic Bread'
    UNION ALL
    SELECT id, 'Regular', 430, true FROM menu_items WHERE name = 'Cheesy Bread'
    UNION ALL
    SELECT id, 'Regular', 255, true FROM menu_items WHERE name = 'French Fries'
    UNION ALL
    SELECT id, '350ml', 80, true FROM menu_items WHERE name = 'Soft Drink (350ml)'
    UNION ALL
    SELECT id, '500ml', 140, true FROM menu_items WHERE name = 'Soft Drink (500ml)'
    UNION ALL
    SELECT id, '1L', 220, true FROM menu_items WHERE name = 'Soft Drink (1L)'
    UNION ALL
    SELECT id, '1.5L', 280, true FROM menu_items WHERE name = 'Soft Drink (1.5L)'
    UNION ALL
    SELECT id, '2.25L', 340, true FROM menu_items WHERE name = 'Soft Drink (2.25L)'
    UNION ALL
    SELECT id, 'Regular', 80, true FROM menu_items WHERE name = 'Small Water Bottle'
    UNION ALL
    SELECT id, 'Regular', 120, true FROM menu_items WHERE name = 'Large Water Bottle'
    UNION ALL
    SELECT id, 'Regular', 299, true FROM menu_items WHERE name = 'Bubble Tea'
    UNION ALL
    SELECT id, 'Regular', 60, true FROM menu_items WHERE name = 'Ranch'
    UNION ALL
    SELECT id, 'Regular', 60, true FROM menu_items WHERE name = 'Honey Mustard'
    UNION ALL
    SELECT id, 'Regular', 60, true FROM menu_items WHERE name = 'Garlic & Herbs'
    UNION ALL
    SELECT id, 'Regular', 299, true FROM menu_items WHERE name = 'Choco Milk'
    UNION ALL
    SELECT id, 'Regular', 299, true FROM menu_items WHERE name = 'Simply Strawberry'
    UNION ALL
    SELECT id, 'Regular', 299, true FROM menu_items WHERE name = 'Mango Passion';

END $$;

-- Insert Deals
INSERT INTO deals (name, description, price, items_included, is_active, sort_order) VALUES
('Solo Cravings', 'Perfect for one person - includes personal pizza and drink', 599, '{"pizza_9": {"count": 1, "size": "9\"", "type": "Personal Pizza"}, "soft_drink_350ml": {"count": 1, "size": "350ml", "type": "Soft Drink"}}', true, 1),

('Power of 3', 'Great value combo with pizza, chicken, and sides', 1849, '{"pizza_12": {"count": 1, "size": "12\"", "type": "Medium Pizza"}, "chicken_pieces": {"count": 3, "type": "Chicken Pieces"}, "cheesy_bread": {"count": 1, "type": "Cheesy Bread"}, "soft_drink_500ml": {"count": 2, "size": "500ml", "type": "Soft Drinks"}}', true, 2),

('The Boss Box', 'Ultimate feast for the whole family', 3599, '{"pizza_15": {"count": 1, "size": "15\"", "type": "Large Pizza"}, "pizza_12": {"count": 1, "size": "12\"", "type": "Regular Pizza"}, "chicken_bucket_9": {"count": 1, "size": "9 pcs", "type": "Chicken Bucket"}, "soft_drink_1_5l": {"count": 1, "size": "1.5L", "type": "Soft Drink"}}', true, 3),

('Squad Goals', 'Perfect for sharing with friends', 2749, '{"pizza_12": {"count": 2, "size": "12\"", "type": "Regular Pizzas"}, "chicken_strips": {"count": 5, "type": "Chicken Strips"}, "french_fries": {"count": 1, "size": "Large", "type": "Fries"}, "soft_drink_1_5l": {"count": 1, "size": "1.5L", "type": "Soft Drink"}}', true, 4),

('Couple Connect', 'Romantic dinner for two', 1299, '{"pizza_12": {"count": 1, "size": "12\"", "type": "Regular Pizza"}, "drinks": {"count": 1, "options": ["1 Bubble Tea", "2 Soft Drinks"], "type": "Beverages"}}', true, 5),

('Family Weekend Box', 'Complete family feast for special occasions', 5499, '{"pizza_15": {"count": 2, "size": "15\"", "type": "Large Pizzas"}, "fish_and_chips": {"count": 1, "type": "Fish & Chips"}, "cheesy_bread": {"count": 1, "type": "Cheesy Bread"}, "chicken_bucket_9": {"count": 1, "size": "9 pcs", "type": "Chicken Bucket"}, "soft_drink_1_5l": {"count": 1, "size": "1.5L", "type": "Soft Drink"}, "dip_platter": {"count": 1, "type": "Family Dip Platter"}}', true, 6);