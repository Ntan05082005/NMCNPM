-- Reset hardcoded problem statistics to actual values from submissions table
-- This updates total_submissions, total_accepted, and acceptance_rate based on actual data

-- First, reset all problems to 0
UPDATE problems SET 
    total_submissions = 0,
    total_accepted = 0,
    acceptance_rate = 0.00;

-- Then update with actual submission counts
UPDATE problems p SET 
    total_submissions = COALESCE((
        SELECT COUNT(*) 
        FROM submissions s 
        WHERE s.problem_id = p.id
    ), 0);

-- Update accepted counts
UPDATE problems p SET 
    total_accepted = COALESCE((
        SELECT COUNT(*) 
        FROM submissions s 
        WHERE s.problem_id = p.id AND s.status = 'ACCEPTED'
    ), 0);

-- Calculate acceptance rate
UPDATE problems SET 
    acceptance_rate = CASE 
        WHEN total_submissions > 0 
        THEN ROUND((total_accepted::DECIMAL / total_submissions) * 100, 2)
        ELSE 0.00
    END;
