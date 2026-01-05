-- Insert sample tags
INSERT INTO tags (name, slug, description) VALUES
('Array', 'array', 'Problems involving array data structures'),
('String', 'string', 'String manipulation and processing'),
('Dynamic Programming', 'dynamic-programming', 'DP optimization problems'),
('Math', 'math', 'Mathematical and number theory problems'),
('Greedy', 'greedy', 'Greedy algorithm problems'),
('Two Pointers', 'two-pointers', 'Two pointer technique'),
('Binary Search', 'binary-search', 'Binary search algorithm'),
('Hash Table', 'hash-table', 'Hash table and hashing'),
('Sorting', 'sorting', 'Sorting algorithms'),
('Tree', 'tree', 'Binary tree and tree traversal'),
('Graph', 'graph', 'Graph theory and algorithms'),
('Backtracking', 'backtracking', 'Backtracking and recursion'),
('Stack', 'stack', 'Stack data structure'),
('Queue', 'queue', 'Queue data structure'),
('Linked List', 'linked-list', 'Linked list problems');

-- Insert sample problems
INSERT INTO problems (title, slug, difficulty, description, acceptance_rate, total_submissions, total_accepted, likes, dislikes, time_limit_ms, memory_limit_mb, constraints, input_format, output_format, sample_input, sample_output, explanation) VALUES

-- Problem 1: Two Sum
('Two Sum', 'two-sum', 'EASY', 
'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

You can return the answer in any order.',
52.5, 1000000, 525000, 15420, 520,
2000, 256,
'2 <= nums.length <= 10^4
-10^9 <= nums[i] <= 10^9
-10^9 <= target <= 10^9
Only one valid answer exists.',
'Line 1: Array of integers nums
Line 2: Integer target',
'Two space-separated integers representing the indices',
'[2,7,11,15]
9',
'0 1',
'Because nums[0] + nums[1] == 9, we return [0, 1].'),

-- Problem 2: Add Two Numbers
('Add Two Numbers', 'add-two-numbers', 'MEDIUM',
'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.

You may assume the two numbers do not contain any leading zero, except the number 0 itself.',
42.3, 850000, 359550, 12340, 890,
3000, 256,
'The number of nodes in each linked list is in the range [1, 100].
0 <= Node.val <= 9
It is guaranteed that the list represents a number that does not have leading zeros.',
'Two linked lists l1 and l2',
'A linked list representing the sum',
'[2,4,3]
[5,6,4]',
'[7,0,8]',
'342 + 465 = 807'),

-- Problem 3: Longest Substring Without Repeating Characters
('Longest Substring Without Repeating Characters', 'longest-substring-without-repeating-characters', 'MEDIUM',
'Given a string s, find the length of the longest substring without repeating characters.',
33.8, 920000, 310960, 18920, 1230,
2000, 256,
'0 <= s.length <= 5 * 10^4
s consists of English letters, digits, symbols and spaces.',
'A string s',
'An integer representing the length',
'abcabcbb',
'3',
'The answer is "abc", with the length of 3.'),

-- Problem 4: Median of Two Sorted Arrays
('Median of Two Sorted Arrays', 'median-of-two-sorted-arrays', 'HARD',
'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.

The overall run time complexity should be O(log (m+n)).',
36.2, 450000, 162900, 15670, 2340,
3000, 256,
'nums1.length == m
nums2.length == n
0 <= m <= 1000
0 <= n <= 1000
1 <= m + n <= 2000
-10^6 <= nums1[i], nums2[i] <= 10^6',
'Two sorted arrays nums1 and nums2',
'A decimal number representing the median',
'[1,3]
[2]',
'2.0',
'The merged array is [1,2,3] and median is 2.'),

-- Problem 5: Reverse Integer
('Reverse Integer', 'reverse-integer', 'MEDIUM',
'Given a signed 32-bit integer x, return x with its digits reversed. If reversing x causes the value to go outside the signed 32-bit integer range [-2^31, 2^31 - 1], then return 0.

Assume the environment does not allow you to store 64-bit integers (signed or unsigned).',
27.5, 780000, 214500, 8920, 3450,
2000, 256,
'-2^31 <= x <= 2^31 - 1',
'A signed 32-bit integer x',
'Reversed integer or 0 if overflow',
'123',
'321',
''),

-- Problem 6: Palindrome Number
('Palindrome Number', 'palindrome-number', 'EASY',
'Given an integer x, return true if x is a palindrome, and false otherwise.',
53.7, 1200000, 644400, 9820, 1120,
2000, 256,
'-2^31 <= x <= 2^31 - 1',
'An integer x',
'true or false',
'121',
'true',
'121 reads as 121 from left to right and from right to left.'),

-- Problem 7: Container With Most Water
('Container With Most Water', 'container-with-most-water', 'MEDIUM',
'You are given an integer array height of length n. There are n vertical lines drawn such that the two endpoints of the ith line are (i, 0) and (i, height[i]).

Find two lines that together with the x-axis form a container, such that the container contains the most water.

Return the maximum amount of water a container can store.',
54.2, 680000, 368560, 16540, 890,
2000, 256,
'n == height.length
2 <= n <= 10^5
0 <= height[i] <= 10^4',
'An array of integers representing heights',
'Maximum area as integer',
'[1,8,6,2,5,4,8,3,7]',
'49',
'The maximum area is between index 1 and 8: min(8,7) * (8-1) = 49'),

-- Problem 8: Valid Parentheses
('Valid Parentheses', 'valid-parentheses', 'EASY',
'Given a string s containing just the characters ''('', '')'', ''{'', ''}'', ''['' and '']'', determine if the input string is valid.

An input string is valid if:
1. Open brackets must be closed by the same type of brackets.
2. Open brackets must be closed in the correct order.
3. Every close bracket has a corresponding open bracket of the same type.',
40.1, 950000, 380950, 12340, 670,
2000, 256,
'1 <= s.length <= 10^4
s consists of parentheses only ''()[]{}''.',
'A string s',
'true or false',
'()[]{}',
'true',
'All brackets are properly matched and nested.'),

-- Problem 9: Merge Two Sorted Lists
('Merge Two Sorted Lists', 'merge-two-sorted-lists', 'EASY',
'You are given the heads of two sorted linked lists list1 and list2.

Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists.

Return the head of the merged linked list.',
61.8, 820000, 506760, 10230, 450,
2000, 256,
'The number of nodes in both lists is in the range [0, 50].
-100 <= Node.val <= 100
Both list1 and list2 are sorted in non-decreasing order.',
'Two sorted linked lists',
'A merged sorted linked list',
'[1,2,4]
[1,3,4]',
'[1,1,2,3,4,4]',
''),

-- Problem 10: Binary Search
('Binary Search', 'binary-search', 'EASY',
'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.

You must write an algorithm with O(log n) runtime complexity.',
55.3, 670000, 370510, 7820, 340,
2000, 256,
'1 <= nums.length <= 10^4
-10^4 < nums[i], target < 10^4
All the integers in nums are unique.
nums is sorted in ascending order.',
'A sorted array nums and an integer target',
'Index of target or -1',
'[-1,0,3,5,9,12]
9',
'4',
'9 exists in nums and its index is 4');

-- Link problems with tags (many-to-many relationships)
-- Two Sum: Array, Hash Table
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(1, 1), (1, 8);

-- Add Two Numbers: Linked List, Math
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(2, 15), (2, 4);

-- Longest Substring: String, Hash Table, Two Pointers
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(3, 2), (3, 8), (3, 6);

-- Median of Two Sorted Arrays: Array, Binary Search, Dynamic Programming
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(4, 1), (4, 7), (4, 3);

-- Reverse Integer: Math
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(5, 4);

-- Palindrome Number: Math
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(6, 4);

-- Container With Most Water: Array, Two Pointers, Greedy
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(7, 1), (7, 6), (7, 5);

-- Valid Parentheses: String, Stack
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(8, 2), (8, 13);

-- Merge Two Sorted Lists: Linked List, Sorting
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(9, 15), (9, 9);

-- Binary Search: Array, Binary Search
INSERT INTO problem_tags (problem_id, tag_id) VALUES
(10, 1), (10, 7);
