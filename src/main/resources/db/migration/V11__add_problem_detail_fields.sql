-- Add new fields for problem detail page
ALTER TABLE problems ADD COLUMN IF NOT EXISTS summary TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS learning_objectives TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS example1_input TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS example1_output TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS example1_explanation TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS example2_input TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS example2_output TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS example2_explanation TEXT;
