-- Menu Seeder Script
-- This script creates sample categories and menu items for the Naxos restaurant

-- First, let's insert categories
INSERT INTO categories (name, sequence)
VALUES 
  ('Wraps', 1),
  ('Roast Chicken Meals', 2),
  ('Salads', 3),
  ('Sides', 4),
  ('Drinks', 5),
  ('Desserts', 6);

-- Get the category IDs for reference
DO $$
DECLARE
  wraps_id UUID;
  chicken_id UUID;
  salads_id UUID;
  sides_id UUID;
  drinks_id UUID;
  desserts_id UUID;
BEGIN
  -- Get category IDs
  SELECT id INTO wraps_id FROM categories WHERE name = 'Wraps' LIMIT 1;
  SELECT id INTO chicken_id FROM categories WHERE name = 'Roast Chicken Meals' LIMIT 1;
  SELECT id INTO salads_id FROM categories WHERE name = 'Salads' LIMIT 1;
  SELECT id INTO sides_id FROM categories WHERE name = 'Sides' LIMIT 1;
  SELECT id INTO drinks_id FROM categories WHERE name = 'Drinks' LIMIT 1;
  SELECT id INTO desserts_id FROM categories WHERE name = 'Desserts' LIMIT 1;

  -- Insert menu items for Wraps
  INSERT INTO menu_items (title, description, price, photo_url, category, category_id, is_featured, sequence)
  VALUES
    ('Classic Gyro Wrap', 'Traditional Greek gyro with tzatziki, tomatoes, onions, and fries wrapped in warm pita bread', 8.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Wraps', wraps_id, true, 1),
    ('Chicken Souvlaki Wrap', 'Grilled chicken skewers with fresh vegetables and garlic sauce in a soft pita', 9.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Wraps', wraps_id, false, 2),
    ('Falafel Wrap', 'Crispy falafel with hummus, tahini, and fresh vegetables', 7.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Wraps', wraps_id, false, 3),
    ('Halloumi Wrap', 'Grilled halloumi cheese with roasted vegetables and mint yogurt sauce', 10.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Wraps', wraps_id, false, 4);

  -- Insert menu items for Roast Chicken Meals
  INSERT INTO menu_items (title, description, price, photo_url, category, category_id, is_featured, sequence)
  VALUES
    ('Quarter Chicken Meal', 'Juicy quarter chicken with two sides of your choice', 12.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Roast Chicken Meals', chicken_id, true, 1),
    ('Half Chicken Meal', 'Flavorful half chicken with two sides and pita bread', 18.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Roast Chicken Meals', chicken_id, false, 2),
    ('Whole Chicken Meal', 'Whole roasted chicken with four sides, perfect for sharing', 28.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Roast Chicken Meals', chicken_id, false, 3),
    ('Chicken Skewers Plate', 'Three chicken skewers marinated in Greek spices with rice and salad', 15.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Roast Chicken Meals', chicken_id, true, 4);

  -- Insert menu items for Salads
  INSERT INTO menu_items (title, description, price, photo_url, category, category_id, is_featured, sequence)
  VALUES
    ('Greek Salad', 'Fresh tomatoes, cucumbers, olives, and feta cheese with olive oil dressing', 8.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Salads', salads_id, true, 1),
    ('Mediterranean Salad', 'Mixed greens with grilled vegetables, chickpeas, and lemon herb dressing', 9.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Salads', salads_id, false, 2),
    ('Chicken Caesar Salad', 'Romaine lettuce with grilled chicken, croutons, and Caesar dressing', 11.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Salads', salads_id, false, 3),
    ('Quinoa Tabbouleh', 'Quinoa with parsley, mint, tomatoes, and lemon juice', 10.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Salads', salads_id, false, 4);

  -- Insert menu items for Sides
  INSERT INTO menu_items (title, description, price, photo_url, category, category_id, is_featured, sequence)
  VALUES
    ('Greek Fries', 'Hand-cut fries with feta cheese, oregano, and olive oil', 4.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Sides', sides_id, false, 1),
    ('Roasted Potatoes', 'Lemon and herb roasted potatoes', 3.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Sides', sides_id, false, 2),
    ('Rice Pilaf', 'Fluffy rice cooked with herbs and spices', 3.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Sides', sides_id, false, 3),
    ('Grilled Vegetables', 'Seasonal vegetables grilled with olive oil and herbs', 5.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Sides', sides_id, false, 4),
    ('Pita Bread', 'Warm, soft pita bread', 1.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Sides', sides_id, false, 5);

  -- Insert menu items for Drinks
  INSERT INTO menu_items (title, description, price, photo_url, category, category_id, is_featured, sequence)
  VALUES
    ('Greek Frappe', 'Traditional Greek iced coffee', 3.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Drinks', drinks_id, false, 1),
    ('Fresh Orange Juice', 'Freshly squeezed orange juice', 4.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Drinks', drinks_id, false, 2),
    ('Sparkling Water', 'Refreshing sparkling mineral water', 2.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Drinks', drinks_id, false, 3),
    ('Greek Wine (Glass)', 'Selection of Greek wines by the glass', 7.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Drinks', drinks_id, false, 4);

  -- Insert menu items for Desserts
  INSERT INTO menu_items (title, description, price, photo_url, category, category_id, is_featured, sequence)
  VALUES
    ('Baklava', 'Layers of filo pastry filled with chopped nuts and sweetened with honey', 5.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Desserts', desserts_id, true, 1),
    ('Greek Yogurt with Honey', 'Creamy Greek yogurt drizzled with honey and walnuts', 4.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Desserts', desserts_id, false, 2),
    ('Galaktoboureko', 'Custard-filled pastry soaked in sweet syrup', 6.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Desserts', desserts_id, false, 3),
    ('Loukoumades', 'Greek honey dumplings with cinnamon and walnuts', 5.99, 'https://res.cloudinary.com/don7pwn6g/image/upload/v1740470565/naxos/placeholder-food.jpg', 'Desserts', desserts_id, false, 4);
END $$; 