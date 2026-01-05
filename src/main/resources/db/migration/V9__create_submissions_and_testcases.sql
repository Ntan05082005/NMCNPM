-- Create test_cases table
CREATE TABLE test_cases (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER NOT NULL,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- Create submissions table
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    problem_id INTEGER NOT NULL,
    code TEXT NOT NULL,
    language VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    output TEXT,
    error_message TEXT,
    execution_time_ms BIGINT,
    submitted_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (problem_id) REFERENCES problems(id) ON DELETE CASCADE
);

-- Create indexes for better query performance
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_test_cases_problem_id ON test_cases(problem_id);
