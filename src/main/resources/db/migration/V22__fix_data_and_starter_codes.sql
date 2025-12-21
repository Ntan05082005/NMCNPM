-- V22: Fix test case data and update starter codes to LeetCode-style (function-only)
-- This migration ensures all data changes are persisted for anyone cloning the project

-- ============================================
-- FIX TEST CASE DATA
-- ============================================

-- Fix Two Sum test case 4: expected output was wrong (2 4 -> 1 3)
UPDATE test_cases SET expected_output = '1 3' WHERE id = 4;

-- Update Two Sum test case format (space-separated integers)
UPDATE test_cases SET input = E'2 7 11 15\n9' WHERE id = 1;
UPDATE test_cases SET input = E'3 2 4\n6' WHERE id = 2;
UPDATE test_cases SET input = E'3 3\n6' WHERE id = 3;
UPDATE test_cases SET input = E'1 5 3 7 8\n12' WHERE id = 4;

-- ============================================
-- UPDATE STARTER CODES TO FUNCTION-ONLY (LeetCode-style)
-- ============================================

-- Problem 1: Two Sum
UPDATE problems SET 
    starter_code_cpp = 'vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    
}',
    starter_code_python = 'def two_sum(nums, target):
    # Write your code here
    pass',
    starter_code_javascript = 'function twoSum(nums, target) {
    // Write your code here
    
}'
WHERE id = 1;

-- Problem 2: Add Two Numbers
UPDATE problems SET 
    starter_code_cpp = 'ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {
    // Write your code here
    
}',
    starter_code_python = 'def add_two_numbers(l1, l2):
    # Write your code here
    pass',
    starter_code_javascript = 'function addTwoNumbers(l1, l2) {
    // Write your code here
    
}'
WHERE id = 2;

-- Problem 3: Longest Substring Without Repeating Characters
UPDATE problems SET 
    starter_code_cpp = 'int lengthOfLongestSubstring(string s) {
    // Write your code here
    
}',
    starter_code_python = 'def length_of_longest_substring(s):
    # Write your code here
    pass',
    starter_code_javascript = 'function lengthOfLongestSubstring(s) {
    // Write your code here
    
}'
WHERE id = 3;

-- Problem 4: Median of Two Sorted Arrays
UPDATE problems SET 
    starter_code_cpp = 'double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {
    // Write your code here
    
}',
    starter_code_python = 'def find_median_sorted_arrays(nums1, nums2):
    # Write your code here
    pass',
    starter_code_javascript = 'function findMedianSortedArrays(nums1, nums2) {
    // Write your code here
    
}'
WHERE id = 4;

-- Problem 5: Reverse Integer
UPDATE problems SET 
    starter_code_cpp = 'int reverse(int x) {
    // Write your code here
    
}',
    starter_code_python = 'def reverse(x):
    # Write your code here
    pass',
    starter_code_javascript = 'function reverse(x) {
    // Write your code here
    
}'
WHERE id = 5;

-- Problem 6: Palindrome Number
UPDATE problems SET 
    starter_code_cpp = 'bool isPalindrome(int x) {
    // Write your code here
    
}',
    starter_code_python = 'def is_palindrome(x):
    # Write your code here
    pass',
    starter_code_javascript = 'function isPalindrome(x) {
    // Write your code here
    
}'
WHERE id = 6;

-- Problem 7: Container With Most Water
UPDATE problems SET 
    starter_code_cpp = 'int maxArea(vector<int>& height) {
    // Write your code here
    
}',
    starter_code_python = 'def max_area(height):
    # Write your code here
    pass',
    starter_code_javascript = 'function maxArea(height) {
    // Write your code here
    
}'
WHERE id = 7;

-- Problem 8: Valid Parentheses
UPDATE problems SET 
    starter_code_cpp = 'bool isValid(string s) {
    // Write your code here
    
}',
    starter_code_python = 'def is_valid(s):
    # Write your code here
    pass',
    starter_code_javascript = 'function isValid(s) {
    // Write your code here
    
}'
WHERE id = 8;

-- Problem 9: Merge Two Sorted Lists
UPDATE problems SET 
    starter_code_cpp = 'ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    // Write your code here
    
}',
    starter_code_python = 'def merge_two_lists(list1, list2):
    # Write your code here
    pass',
    starter_code_javascript = 'function mergeTwoLists(list1, list2) {
    // Write your code here
    
}'
WHERE id = 9;

-- Problem 10: Binary Search
UPDATE problems SET 
    starter_code_cpp = 'int search(vector<int>& nums, int target) {
    // Write your code here
    
}',
    starter_code_python = 'def search(nums, target):
    # Write your code here
    pass',
    starter_code_javascript = 'function search(nums, target) {
    // Write your code here
    
}'
WHERE id = 10;

-- Problem 11: Spiral Matrix
UPDATE problems SET 
    starter_code_cpp = 'vector<int> spiralOrder(vector<vector<int>>& matrix) {
    // Write your code here
    
}',
    starter_code_python = 'def spiral_order(matrix):
    # Write your code here
    pass',
    starter_code_javascript = 'function spiralOrder(matrix) {
    // Write your code here
    
}'
WHERE id = 11;

-- Problem 12: Robot Bounded In Circle
UPDATE problems SET 
    starter_code_cpp = 'bool isRobotBounded(string instructions) {
    // Write your code here
    
}',
    starter_code_python = 'def is_robot_bounded(instructions):
    # Write your code here
    pass',
    starter_code_javascript = 'function isRobotBounded(instructions) {
    // Write your code here
    
}'
WHERE id = 12;

-- Problem 13: Game of Life
UPDATE problems SET 
    starter_code_cpp = 'void gameOfLife(vector<vector<int>>& board) {
    // Write your code here
    
}',
    starter_code_python = 'def game_of_life(board):
    # Write your code here
    pass',
    starter_code_javascript = 'function gameOfLife(board) {
    // Write your code here
    
}'
WHERE id = 13;

-- Problem 14: Text Justification
UPDATE problems SET 
    starter_code_cpp = 'vector<string> fullJustify(vector<string>& words, int maxWidth) {
    // Write your code here
    
}',
    starter_code_python = 'def full_justify(words, max_width):
    # Write your code here
    pass',
    starter_code_javascript = 'function fullJustify(words, maxWidth) {
    // Write your code here
    
}'
WHERE id = 14;

-- Problem 15: Snake Game
UPDATE problems SET 
    starter_code_cpp = 'class SnakeGame {
public:
    SnakeGame(int width, int height, vector<vector<int>>& food) {
        // Initialize your data structure here
    }
    
    int move(string direction) {
        // Write your code here
    }
};',
    starter_code_python = 'class SnakeGame:
    def __init__(self, width, height, food):
        # Initialize your data structure here
        pass
    
    def move(self, direction):
        # Write your code here
        pass',
    starter_code_javascript = 'class SnakeGame {
    constructor(width, height, food) {
        // Initialize your data structure here
    }
    
    move(direction) {
        // Write your code here
    }
}'
WHERE id = 15;

-- Problems 16-20: Debug problems (keep as-is, they need full code to debug)
-- Problems 21-30: System Design problems (keep as-is, they need class structure)
-- Problems 31-35: SQL problems (no starter code needed)
