--
-- PostgreSQL Database Backup for Unicode Programming Practice System
-- Generated for se_project database
--

-- This file contains sample data for development/testing
-- In production, use: pg_dump -U postgres -d se_project > backup.sql

-- Note: Tables are created automatically by Flyway migrations
-- This file only contains sample data backup

-- ============================================================================
-- Sample Users (passwords are BCrypt hashed)
-- ============================================================================

-- Default Admin User
-- Username: admin, Password: admin123
INSERT INTO users (username, email, password, role, created_at, updated_at) 
VALUES (
    'admin',
    'admin@unicode.com',
    '$2a$10$rZ8YTzO8bvwh5dC8HxfSKuK.L3Q0qvH0gZvLvZxk0KZrWxGzJ0FZK',
    'ADMIN',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

-- Sample User 1
-- Username: testuser, Password: password123
INSERT INTO users (username, email, password, role, created_at, updated_at) 
VALUES (
    'testuser',
    'test@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye6gJQpq6n8xY4zXqd7LxrXZzD3xqh8K.',
    'USER',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

-- Sample User 2
-- Username: john_doe, Password: password123
INSERT INTO users (username, email, password, role, created_at, updated_at) 
VALUES (
    'john_doe',
    'john@example.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMye6gJQpq6n8xY4zXqd7LxrXZzD3xqh8K.',
    'USER',
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

-- ============================================================================
-- Additional Sample Data
-- ============================================================================

-- Note: Problems and test cases are seeded by Flyway migrations:
-- - V8__seed_sample_data.sql: Contains 10 sample problems
-- - V10__seed_test_cases.sql: Contains test cases for all problems

-- ============================================================================
-- Sample Submissions (Optional - for testing submission history)
-- ============================================================================

-- Uncomment below to add sample submissions:

/*
DO $$
DECLARE
    user_id_var BIGINT;
    problem_id_var BIGINT;
BEGIN
    -- Get a sample user and problem
    SELECT id INTO user_id_var FROM users WHERE username = 'testuser' LIMIT 1;
    SELECT id INTO problem_id_var FROM problems WHERE slug = 'two-sum' LIMIT 1;
    
    IF user_id_var IS NOT NULL AND problem_id_var IS NOT NULL THEN
        -- Sample accepted submission
        INSERT INTO submissions (user_id, problem_id, language, code, status, execution_time_ms, submitted_at)
        VALUES (
            user_id_var,
            problem_id_var,
            'PYTHON',
            'def two_sum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    target = int(input())
    result = two_sum(nums, target)
    print(json.dumps(result))',
            'ACCEPTED',
            145,
            CURRENT_TIMESTAMP
        );
        
        -- Sample wrong answer submission
        INSERT INTO submissions (user_id, problem_id, language, code, status, execution_time_ms, submitted_at)
        VALUES (
            user_id_var,
            problem_id_var,
            'PYTHON',
            'def two_sum(nums, target):
    return [0, 1]  # Wrong answer

if __name__ == "__main__":
    import json
    nums = json.loads(input())
    target = int(input())
    result = two_sum(nums, target)
    print(json.dumps(result))',
            'WRONG_ANSWER',
            98,
            CURRENT_TIMESTAMP - INTERVAL '1 hour'
        );
    END IF;
END $$;
*/

-- ============================================================================
-- Database Statistics
-- ============================================================================

-- View record counts
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'problems', COUNT(*) FROM problems
UNION ALL
SELECT 'test_cases', COUNT(*) FROM test_cases
UNION ALL
SELECT 'submissions', COUNT(*) FROM submissions
UNION ALL
SELECT 'tags', COUNT(*) FROM tags;

-- ============================================================================
-- Restore Instructions
-- ============================================================================

/*
To restore this backup:

1. Using psql command line:
   psql -U postgres -d se_project -f backup.sql

2. Using Docker:
   docker exec -i unicode-postgres psql -U postgres -d se_project < backup.sql

3. Using docker-compose:
   docker-compose exec -T postgres psql -U postgres -d se_project < backup.sql

To create a new backup:
   pg_dump -U postgres -d se_project > backup.sql
   
   Or with Docker:
   docker exec unicode-postgres pg_dump -U postgres -d se_project > backup.sql
*/
