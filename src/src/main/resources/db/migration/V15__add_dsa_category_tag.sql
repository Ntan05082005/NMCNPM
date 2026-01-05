-- ============================================================
-- Add DSA category tag and link existing DSA problems
-- ============================================================

-- Add the main DSA category tag
INSERT INTO tags (name, slug, description) VALUES
('Algorithm & Data Structure', 'algorithm-data-structure', 'Algorithm and data structure problems')
ON CONFLICT (slug) DO NOTHING;

-- Link all existing DSA problems (problems 1-10) with the new tag
-- These problems already have specific tags (array, string, etc.)
-- Now we add the category tag to make filtering easier

INSERT INTO problem_tags (problem_id, tag_id)
SELECT p.id, t.id FROM problems p, tags t
WHERE p.slug IN (
    'two-sum',
    'add-two-numbers',
    'longest-substring-without-repeating-characters',
    'median-of-two-sorted-arrays',
    'reverse-integer',
    'palindrome-number',
    'container-with-most-water',
    'valid-parentheses',
    'merge-two-sorted-lists',
    'binary-search'
) AND t.slug = 'algorithm-data-structure'
ON CONFLICT DO NOTHING;
