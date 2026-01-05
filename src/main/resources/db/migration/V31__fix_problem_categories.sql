-- Fix categories for all problems based on their problem type groups
-- This corrects the categories that were all set to 'dsa' by V30

-- DSA Problems (1-10 from V8)
UPDATE problems SET category = 'dsa' 
WHERE slug IN (
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
);

-- Implementation/Simulation Problems (11-15)
UPDATE problems SET category = 'implementation' 
WHERE slug IN (
    'spiral-matrix',
    'robot-bounded-in-circle',
    'game-of-life',
    'text-justification',
    'snake-game'
);

-- Debugging Problems (16-20)
UPDATE problems SET category = 'debugging' 
WHERE slug IN (
    'fix-binary-search-bug',
    'fix-infinite-loop',
    'fix-memory-leak',
    'fix-off-by-one-error',
    'fix-null-pointer-exception'
);

-- System Design Problems (21-25)
UPDATE problems SET category = 'system-design' 
WHERE slug IN (
    'design-url-shortener',
    'design-rate-limiter',
    'design-lru-cache',
    'design-load-balancer',
    'design-parking-lot'
);

-- OOP Problems (26-30)
UPDATE problems SET category = 'oop' 
WHERE slug IN (
    'implement-singleton-pattern',
    'design-vending-machine',
    'design-file-system',
    'implement-observer-pattern',
    'design-chess-game'
);

-- SQL/Database Problems (31-35)
UPDATE problems SET category = 'sql' 
WHERE slug IN (
    'second-highest-salary',
    'customers-who-never-order',
    'rank-scores',
    'department-top-three-salaries',
    'consecutive-numbers'
);
