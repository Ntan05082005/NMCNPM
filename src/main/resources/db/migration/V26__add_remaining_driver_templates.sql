-- V26: Add driver templates for remaining problems (3-10, excluding 2 and 9 which were added in V25)
-- These templates handle input parsing, function calling, and output formatting

-- ============================================
-- Problem 3: Longest Substring Without Repeating Characters
-- Input: string s
-- Output: integer (length)
-- ============================================

UPDATE problems SET function_name = 'lengthOfLongestSubstring' WHERE id = 3;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <string>
#include <unordered_set>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

int main() {
    string s;
    getline(cin, s);
    
    int result = lengthOfLongestSubstring(s);
    cout << result << endl;
    
    return 0;
}' WHERE id = 3;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    s = input()
    result = length_of_longest_substring(s)
    print(result)' WHERE id = 3;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const s = lines[0] || "";
    const result = lengthOfLongestSubstring(s);
    console.log(result);
});' WHERE id = 3;

-- ============================================
-- Problem 4: Median of Two Sorted Arrays
-- Input: two lines of space-separated integers
-- Output: decimal number (median)
-- ============================================

UPDATE problems SET function_name = 'findMedianSortedArrays' WHERE id = 4;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <vector>
#include <sstream>
#include <string>
#include <iomanip>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

vector<int> parseIntArray(const string& line) {
    vector<int> result;
    if (line.empty()) return result;
    
    stringstream ss(line);
    int num;
    while (ss >> num) {
        result.push_back(num);
    }
    return result;
}

int main() {
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    
    vector<int> nums1 = parseIntArray(line1);
    vector<int> nums2 = parseIntArray(line2);
    
    double result = findMedianSortedArrays(nums1, nums2);
    cout << fixed << setprecision(1) << result << endl;
    
    return 0;
}' WHERE id = 4;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    line1 = input().strip()
    line2 = input().strip()
    
    nums1 = list(map(int, line1.split())) if line1 else []
    nums2 = list(map(int, line2.split())) if line2 else []
    
    result = find_median_sorted_arrays(nums1, nums2)
    print(result)' WHERE id = 4;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const nums1 = lines[0] && lines[0].trim() ? lines[0].trim().split(" ").map(Number) : [];
    const nums2 = lines[1] && lines[1].trim() ? lines[1].trim().split(" ").map(Number) : [];
    
    const result = findMedianSortedArrays(nums1, nums2);
    console.log(result);
});' WHERE id = 4;

-- ============================================
-- Problem 5: Reverse Integer
-- Input: integer x
-- Output: reversed integer or 0 if overflow
-- ============================================

UPDATE problems SET function_name = 'reverse' WHERE id = 5;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

int main() {
    int x;
    cin >> x;
    
    int result = reverse(x);
    cout << result << endl;
    
    return 0;
}' WHERE id = 5;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    x = int(input())
    result = reverse(x)
    print(result)' WHERE id = 5;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const x = parseInt(lines[0]);
    const result = reverse(x);
    console.log(result);
});' WHERE id = 5;

-- ============================================
-- Problem 6: Palindrome Number
-- Input: integer x
-- Output: "true" or "false"
-- ============================================

UPDATE problems SET function_name = 'isPalindrome' WHERE id = 6;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

int main() {
    int x;
    cin >> x;
    
    bool result = isPalindrome(x);
    cout << (result ? "true" : "false") << endl;
    
    return 0;
}' WHERE id = 6;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    x = int(input())
    result = is_palindrome(x)
    print("true" if result else "false")' WHERE id = 6;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const x = parseInt(lines[0]);
    const result = isPalindrome(x);
    console.log(result ? "true" : "false");
});' WHERE id = 6;

-- ============================================
-- Problem 7: Container With Most Water
-- Input: space-separated integers (heights array)
-- Output: maximum area as integer
-- ============================================

UPDATE problems SET function_name = 'maxArea' WHERE id = 7;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <vector>
#include <sstream>
#include <string>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

vector<int> parseIntArray(const string& line) {
    vector<int> result;
    stringstream ss(line);
    int num;
    while (ss >> num) {
        result.push_back(num);
    }
    return result;
}

int main() {
    string line;
    getline(cin, line);
    vector<int> height = parseIntArray(line);
    
    int result = maxArea(height);
    cout << result << endl;
    
    return 0;
}' WHERE id = 7;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    height = list(map(int, input().split()))
    result = max_area(height)
    print(result)' WHERE id = 7;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const height = lines[0].split(" ").map(Number);
    const result = maxArea(height);
    console.log(result);
});' WHERE id = 7;

-- ============================================
-- Problem 8: Valid Parentheses
-- Input: string s containing only brackets
-- Output: "true" or "false"
-- ============================================

UPDATE problems SET function_name = 'isValid' WHERE id = 8;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <string>
#include <stack>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

int main() {
    string s;
    getline(cin, s);
    
    bool result = isValid(s);
    cout << (result ? "true" : "false") << endl;
    
    return 0;
}' WHERE id = 8;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    s = input()
    result = is_valid(s)
    print("true" if result else "false")' WHERE id = 8;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const s = lines[0] || "";
    const result = isValid(s);
    console.log(result ? "true" : "false");
});' WHERE id = 8;

-- ============================================
-- Problem 10: Binary Search
-- Input: Line 1: n, Line 2: sorted array, Line 3: target
-- Output: Index of target or -1
-- ============================================

UPDATE problems SET function_name = 'search' WHERE id = 10;

-- C++ Driver Template
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <vector>
#include <sstream>
#include <string>
using namespace std;

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

vector<int> parseIntArray(const string& line) {
    vector<int> result;
    stringstream ss(line);
    int num;
    while (ss >> num) {
        result.push_back(num);
    }
    return result;
}

int main() {
    int n;
    cin >> n;
    cin.ignore();
    
    string line;
    getline(cin, line);
    vector<int> nums = parseIntArray(line);
    
    int target;
    cin >> target;
    
    int result = search(nums, target);
    cout << result << endl;
    
    return 0;
}' WHERE id = 10;

-- Python Driver Template
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    n = int(input())
    nums = list(map(int, input().split()))
    target = int(input())
    
    result = search(nums, target)
    print(result)' WHERE id = 10;

-- JavaScript Driver Template
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const n = parseInt(lines[0]);
    const nums = lines[1].split(" ").map(Number);
    const target = parseInt(lines[2]);
    
    const result = search(nums, target);
    console.log(result);
});' WHERE id = 10;
