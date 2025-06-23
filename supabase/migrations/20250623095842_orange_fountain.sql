/*
  # Create nutrition entries table with meal name

  1. New Tables
    - `nutrition_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `username` (text, from auth metadata)
      - `meal_name` (text, user-provided meal name)
      - `meal_date` (date, when the meal was consumed)
      - `total_calories` (numeric, total calories)
      - `total_protein` (numeric, total protein in grams)
      - `total_carbs` (numeric, total carbohydrates in grams)
      - `total_fat` (numeric, total fat in grams)
      - `total_fiber` (numeric, total fiber in grams)
      - `total_vitamin_e` (numeric, total vitamin E in grams)
      - `total_iron` (numeric, total iron in grams)
      - `food_items` (jsonb, complete AI response data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `nutrition_entries` table
    - Add policies for authenticated users to manage their own data

  3. Indexes
    - Index on user_id for fast user-specific queries
    - Index on meal_date for date-based filtering
*/

-- Create nutrition_entries table
CREATE TABLE IF NOT EXISTS nutrition_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL DEFAULT '',
  meal_name text NOT NULL DEFAULT '',
  meal_date date NOT NULL DEFAULT CURRENT_DATE,
  total_calories numeric(8,2) NOT NULL DEFAULT 0,
  total_protein numeric(8,2) NOT NULL DEFAULT 0,
  total_carbs numeric(8,2) NOT NULL DEFAULT 0,
  total_fat numeric(8,2) NOT NULL DEFAULT 0,
  total_fiber numeric(8,2) NOT NULL DEFAULT 0,
  total_vitamin_e numeric(8,2) NOT NULL DEFAULT 0,
  total_iron numeric(8,2) NOT NULL DEFAULT 0,
  food_items jsonb NOT NULL DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE nutrition_entries ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own nutrition entries"
  ON nutrition_entries
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own nutrition entries"
  ON nutrition_entries
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own nutrition entries"
  ON nutrition_entries
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own nutrition entries"
  ON nutrition_entries
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_nutrition_entries_user_id ON nutrition_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_nutrition_entries_meal_date ON nutrition_entries(meal_date);
CREATE INDEX IF NOT EXISTS idx_nutrition_entries_created_at ON nutrition_entries(created_at);

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_nutrition_entries_updated_at'
  ) THEN
    CREATE TRIGGER update_nutrition_entries_updated_at
      BEFORE UPDATE ON nutrition_entries
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;