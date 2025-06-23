/*
  # Create nutrition entries table

  1. New Tables
    - `nutrition_entries`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `username` (text)
      - `meal_date` (date)
      - `total_calories` (numeric)
      - `total_protein` (numeric)
      - `total_carbs` (numeric)
      - `total_fat` (numeric)
      - `total_fiber` (numeric)
      - `total_vitamin_e` (numeric)
      - `total_iron` (numeric)
      - `food_items` (jsonb, stores the complete response data)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `nutrition_entries` table
    - Add policy for authenticated users to read/write their own data
*/

CREATE TABLE IF NOT EXISTS nutrition_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username text NOT NULL,
  meal_date date NOT NULL DEFAULT CURRENT_DATE,
  total_calories numeric DEFAULT 0,
  total_protein numeric DEFAULT 0,
  total_carbs numeric DEFAULT 0,
  total_fat numeric DEFAULT 0,
  total_fiber numeric DEFAULT 0,
  total_vitamin_e numeric DEFAULT 0,
  total_iron numeric DEFAULT 0,
  food_items jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE nutrition_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own nutrition entries"
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

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_nutrition_entries_user_date 
  ON nutrition_entries(user_id, meal_date DESC);

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
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