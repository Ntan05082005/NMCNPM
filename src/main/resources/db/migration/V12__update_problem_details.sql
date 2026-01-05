-- Update Two Sum problem with detailed information
UPDATE problems 
SET 
    summary = 'Given an array of integers and a target value, find two numbers that add up to the target.',
    learning_objectives = '["Understand hash table usage for O(n) lookups", "Learn two-pointer technique", "Practice array traversal optimization"]',
    example1_input = 'nums=[2,7,11,15], target=9',
    example1_output = '[0,1]',
    example1_explanation = 'Because nums[0] + nums[1] == 9, we return [0, 1].',
    example2_input = 'nums=[3,2,4], target=6',
    example2_output = '[1,2]',
    example2_explanation = 'Because nums[1] + nums[2] == 6, we return [1, 2].'
WHERE slug = 'two-sum';

-- Update Add Two Numbers problem
UPDATE problems 
SET 
    summary = 'Add two numbers represented by linked lists where digits are stored in reverse order.',
    learning_objectives = '["Master linked list traversal", "Handle carry in addition operations", "Practice creating new linked list nodes"]',
    example1_input = 'l1=[2,4,3], l2=[5,6,4]',
    example1_output = '[7,0,8]',
    example1_explanation = '342 + 465 = 807. The result is stored in reverse order.',
    example2_input = 'l1=[0], l2=[0]',
    example2_output = '[0]',
    example2_explanation = '0 + 0 = 0'
WHERE slug = 'add-two-numbers';

-- Update Longest Substring problem
UPDATE problems 
SET 
    summary = 'Find the length of the longest substring without repeating characters in a given string.',
    learning_objectives = '["Apply sliding window technique", "Use hash set for character tracking", "Optimize string processing"]',
    example1_input = 's="abcabcbb"',
    example1_output = '3',
    example1_explanation = 'The answer is "abc", with the length of 3.',
    example2_input = 's="bbbbb"',
    example2_output = '1',
    example2_explanation = 'The answer is "b", with the length of 1.'
WHERE slug = 'longest-substring-without-repeating-characters';

-- Update Median of Two Sorted Arrays
UPDATE problems 
SET 
    summary = 'Find the median of two sorted arrays with O(log(m+n)) time complexity.',
    learning_objectives = '["Master binary search on two arrays", "Understand median calculation", "Practice divide and conquer strategy"]',
    example1_input = 'nums1=[1,3], nums2=[2]',
    example1_output = '2.0',
    example1_explanation = 'The merged array is [1,2,3] and median is 2.',
    example2_input = 'nums1=[1,2], nums2=[3,4]',
    example2_output = '2.5',
    example2_explanation = 'The merged array is [1,2,3,4] and median is (2 + 3) / 2 = 2.5'
WHERE slug = 'median-of-two-sorted-arrays';

-- Update Reverse Integer
UPDATE problems 
SET 
    summary = 'Reverse the digits of a signed 32-bit integer, return 0 if overflow occurs.',
    learning_objectives = '["Handle integer overflow detection", "Practice digit manipulation", "Learn modulo operations"]',
    example1_input = 'x=123',
    example1_output = '321',
    example1_explanation = 'Simply reverse the digits: 123 becomes 321.',
    example2_input = 'x=-123',
    example2_output = '-321',
    example2_explanation = 'Reverse the digits while keeping the negative sign: -123 becomes -321.'
WHERE slug = 'reverse-integer';

-- Update Palindrome Number
UPDATE problems 
SET 
    summary = 'Determine if an integer is a palindrome without converting it to a string.',
    learning_objectives = '["Practice integer manipulation", "Avoid string conversion", "Handle negative numbers and edge cases"]',
    example1_input = 'x=121',
    example1_output = 'true',
    example1_explanation = '121 reads as 121 from left to right and from right to left.',
    example2_input = 'x=-121',
    example2_output = 'false',
    example2_explanation = 'From left to right, it reads -121. From right to left, it becomes 121-. Therefore it is not a palindrome.'
WHERE slug = 'palindrome-number';

-- Update Container With Most Water
UPDATE problems 
SET 
    summary = 'Find two lines that form a container with the x-axis that can hold the most water.',
    learning_objectives = '["Apply two-pointer technique", "Optimize area calculation", "Practice greedy algorithms"]',
    example1_input = 'height=[1,8,6,2,5,4,8,3,7]',
    example1_output = '49',
    example1_explanation = 'The max area is between index 1 (height=8) and index 8 (height=7): min(8,7) * (8-1) = 7 * 7 = 49',
    example2_input = 'height=[1,1]',
    example2_output = '1',
    example2_explanation = 'The max area is between index 0 and 1: min(1,1) * (1-0) = 1'
WHERE slug = 'container-with-most-water';

-- Update Valid Parentheses
UPDATE problems 
SET 
    summary = 'Determine if a string of brackets is valid - all brackets must be properly closed and nested.',
    learning_objectives = '["Master stack data structure", "Practice bracket matching", "Understand LIFO principle"]',
    example1_input = 's="()"',
    example1_output = 'true',
    example1_explanation = 'The brackets are properly matched and closed.',
    example2_input = 's="()[]{}"',
    example2_output = 'true',
    example2_explanation = 'All three types of brackets are properly matched in correct order.'
WHERE slug = 'valid-parentheses';

-- Update Merge Two Sorted Lists
UPDATE problems 
SET 
    summary = 'Merge two sorted linked lists into one sorted list by splicing together nodes.',
    learning_objectives = '["Practice linked list manipulation", "Master merge operation", "Handle edge cases with empty lists"]',
    example1_input = 'list1=[1,2,4], list2=[1,3,4]',
    example1_output = '[1,1,2,3,4,4]',
    example1_explanation = 'Merge both lists in sorted order: 1->1->2->3->4->4',
    example2_input = 'list1=[], list2=[0]',
    example2_output = '[0]',
    example2_explanation = 'When one list is empty, return the other list.'
WHERE slug = 'merge-two-sorted-lists';

-- Update Binary Search
UPDATE problems 
SET 
    summary = 'Search for a target value in a sorted array using binary search algorithm with O(log n) complexity.',
    learning_objectives = '["Master binary search algorithm", "Practice divide and conquer", "Understand logarithmic time complexity"]',
    example1_input = 'nums=[-1,0,3,5,9,12], target=9',
    example1_output = '4',
    example1_explanation = '9 exists in nums at index 4',
    example2_input = 'nums=[-1,0,3,5,9,12], target=2',
    example2_output = '-1',
    example2_explanation = '2 does not exist in nums so return -1'
WHERE slug = 'binary-search';
