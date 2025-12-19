-- Drop unused tables since we're using enum for roles now
ALTER TABLE submissions ADD COLUMN test_cases_passed INTEGER DEFAULT 0;
ALTER TABLE submissions ADD COLUMN total_test_cases INTEGER DEFAULT 0;