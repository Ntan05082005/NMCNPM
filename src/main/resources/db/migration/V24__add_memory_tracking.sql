-- Add memory tracking column to submissions table
ALTER TABLE submissions ADD COLUMN IF NOT EXISTS memory_used_kb BIGINT;

-- Add comment for documentation
COMMENT ON COLUMN submissions.memory_used_kb IS 'Memory used by the submission in kilobytes';
