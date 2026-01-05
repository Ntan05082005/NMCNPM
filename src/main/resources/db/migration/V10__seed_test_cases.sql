-- ========================================
-- TEST CASES FOR ALL 10 PROBLEMS
-- ========================================

-- ============================================================
-- Problem 1: Two Sum
-- Input Format: Line 1: n, Line 2: array, Line 3: target
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(1, '4
2 7 11 15
9', '0 1', true),
(1, '3
3 2 4
6', '1 2', false),
(1, '2
3 3
6', '0 1', false),
(1, '5
1 5 3 7 8
12', '2 4', false);

-- ============================================================
-- Problem 2: Add Two Numbers (Linked List)
-- Input Format: Two space-separated lists of digits (reverse order)
-- Output: Space-separated digits (reverse order)
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(2, '2 4 3
5 6 4', '7 0 8', true),
(2, '0
0', '0', false),
(2, '9 9 9 9 9 9 9
9 9 9 9', '8 9 9 9 0 0 0 1', false);

-- ============================================================
-- Problem 3: Longest Substring Without Repeating Characters
-- Input Format: A string s
-- Output: Integer (length of longest substring)
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(3, 'abcabcbb', '3', true),
(3, 'bbbbb', '1', false),
(3, 'pwwkew', '3', false),
(3, '', '0', false),
(3, 'abcdef', '6', false);

-- ============================================================
-- Problem 4: Median of Two Sorted Arrays
-- Input Format: Line 1: array1, Line 2: array2
-- Output: Decimal number (median)
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(4, '1 3
2', '2.0', true),
(4, '1 2
3 4', '2.5', false),
(4, '0 0
0 0', '0.0', false),
(4, '
1', '1.0', false);

-- ============================================================
-- Problem 5: Reverse Integer
-- Input Format: A signed integer x
-- Output: Reversed integer or 0 if overflow
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(5, '123', '321', true),
(5, '-123', '-321', false),
(5, '120', '21', false),
(5, '1534236469', '0', false);

-- ============================================================
-- Problem 6: Palindrome Number
-- Input Format: An integer x
-- Output: "true" or "false"
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(6, '121', 'true', true),
(6, '-121', 'false', true),
(6, '10', 'false', false),
(6, '12321', 'true', false),
(6, '0', 'true', false);

-- ============================================================
-- Problem 7: Container With Most Water
-- Input Format: Space-separated integers (heights array)
-- Output: Maximum area as integer
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(7, '1 8 6 2 5 4 8 3 7', '49', true),
(7, '1 1', '1', false),
(7, '4 3 2 1 4', '16', false),
(7, '1 2 1', '2', false);

-- ============================================================
-- Problem 8: Valid Parentheses
-- Input Format: A string containing only brackets
-- Output: "true" or "false"
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(8, '()', 'true', true),
(8, '()[]{}', 'true', true),
(8, '(]', 'false', false),
(8, '([)]', 'false', false),
(8, '{[]}', 'true', false),
(8, '((', 'false', false);

-- ============================================================
-- Problem 9: Merge Two Sorted Lists
-- Input Format: Line 1: list1, Line 2: list2 (space-separated)
-- Output: Merged sorted list (space-separated)
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(9, '1 2 4
1 3 4', '1 1 2 3 4 4', true),
(9, '
', '', false),
(9, '
0', '0', false),
(9, '1 2 3
4 5 6', '1 2 3 4 5 6', false);

-- ============================================================
-- Problem 10: Binary Search
-- Input Format: Line 1: n, Line 2: sorted array, Line 3: target
-- Output: Index of target or -1
-- ============================================================
INSERT INTO test_cases (problem_id, input, expected_output, is_sample) VALUES
(10, '6
-1 0 3 5 9 12
9', '4', true),
(10, '6
-1 0 3 5 9 12
2', '-1', true),
(10, '1
5
5', '0', false),
(10, '5
1 2 3 4 5
3', '2', false);
