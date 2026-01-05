-- Add tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add problem_tags junction table (many-to-many)
CREATE TABLE problem_tags (
    problem_id BIGINT NOT NULL,
    tag_id BIGINT NOT NULL,
    PRIMARY KEY (problem_id, tag_id),
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
);

-- Add more metadata columns to problems table
ALTER TABLE problems 
ADD COLUMN acceptance_rate DECIMAL(5,2) DEFAULT 0.0,
ADD COLUMN total_submissions INTEGER DEFAULT 0,
ADD COLUMN total_accepted INTEGER DEFAULT 0,
ADD COLUMN likes INTEGER DEFAULT 0,
ADD COLUMN dislikes INTEGER DEFAULT 0,
ADD COLUMN time_limit_ms INTEGER DEFAULT 2000,
ADD COLUMN memory_limit_mb INTEGER DEFAULT 256,
ADD COLUMN constraints TEXT,
ADD COLUMN input_format TEXT,
ADD COLUMN output_format TEXT,
ADD COLUMN sample_input TEXT,
ADD COLUMN sample_output TEXT,
ADD COLUMN explanation TEXT,
ADD COLUMN updated_at TIMESTAMP DEFAULT NOW(),
ADD COLUMN is_premium BOOLEAN DEFAULT FALSE,
ADD COLUMN author_id INTEGER,
ADD CONSTRAINT fk_problem_author FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL;

-- Create indexes for better query performance
CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_created_at ON problems(created_at);
CREATE INDEX idx_problems_acceptance_rate ON problems(acceptance_rate);
CREATE INDEX idx_problems_likes ON problems(likes);
CREATE INDEX idx_tags_name ON tags(name);
CREATE INDEX idx_problem_tags_problem_id ON problem_tags(problem_id);
CREATE INDEX idx_problem_tags_tag_id ON problem_tags(tag_id);
