-- Add starter code templates and category to problems table

-- Add new columns
ALTER TABLE problems ADD COLUMN IF NOT EXISTS category VARCHAR(50);
ALTER TABLE problems ADD COLUMN IF NOT EXISTS starter_code_cpp TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS starter_code_python TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS starter_code_javascript TEXT;

-- Set default category for existing problems based on their tags
UPDATE problems SET category = 'Programming' WHERE category IS NULL;

-- Update specific problems with starter code examples

-- Two Sum problem (id=1)
UPDATE problems 
SET 
    category = 'Data Structures & Algorithms',
    starter_code_cpp = '#include <iostream>
#include <vector>
using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    // Write your code here
    
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    int target = 9;
    vector<int> result = twoSum(nums, target);
    cout << "[" << result[0] << ", " << result[1] << "]" << endl;
    return 0;
}',
    starter_code_python = 'def two_sum(nums, target):
    """
    :param nums: List[int]
    :param target: int
    :return: List[int]
    """
    # Write your code here
    pass

if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = two_sum(nums, target)
    print(result)',
    starter_code_javascript = 'function twoSum(nums, target) {
    // Write your code here
    
}

// Test
const nums = [2, 7, 11, 15];
const target = 9;
console.log(twoSum(nums, target));'
WHERE slug = 'two-sum';

-- Palindrome Number (id=2)
UPDATE problems 
SET 
    category = 'Data Structures & Algorithms',
    starter_code_cpp = '#include <iostream>
using namespace std;

bool isPalindrome(int x) {
    // Write your code here
    
}

int main() {
    int x = 121;
    cout << (isPalindrome(x) ? "true" : "false") << endl;
    return 0;
}',
    starter_code_python = 'def is_palindrome(x):
    """
    :param x: int
    :return: bool
    """
    # Write your code here
    pass

if __name__ == "__main__":
    x = 121
    print(is_palindrome(x))',
    starter_code_javascript = 'function isPalindrome(x) {
    // Write your code here
    
}

// Test
const x = 121;
console.log(isPalindrome(x));'
WHERE slug = 'palindrome-number';

-- Reverse Integer (id=3)
UPDATE problems 
SET 
    category = 'Data Structures & Algorithms',
    starter_code_cpp = '#include <iostream>
using namespace std;

int reverse(int x) {
    // Write your code here
    
}

int main() {
    int x = 123;
    cout << reverse(x) << endl;
    return 0;
}',
    starter_code_python = 'def reverse_integer(x):
    """
    :param x: int
    :return: int
    """
    # Write your code here
    pass

if __name__ == "__main__":
    x = 123
    print(reverse_integer(x))',
    starter_code_javascript = 'function reverse(x) {
    // Write your code here
    
}

// Test
const x = 123;
console.log(reverse(x));'
WHERE slug = 'reverse-integer';

-- Roman to Integer (id=4)
UPDATE problems 
SET 
    category = 'Data Structures & Algorithms',
    starter_code_cpp = '#include <iostream>
#include <string>
using namespace std;

int romanToInt(string s) {
    // Write your code here
    
}

int main() {
    string s = "III";
    cout << romanToInt(s) << endl;
    return 0;
}',
    starter_code_python = 'def roman_to_int(s):
    """
    :param s: str
    :return: int
    """
    # Write your code here
    pass

if __name__ == "__main__":
    s = "III"
    print(roman_to_int(s))',
    starter_code_javascript = 'function romanToInt(s) {
    // Write your code here
    
}

// Test
const s = "III";
console.log(romanToInt(s));'
WHERE slug = 'roman-to-integer';

-- Longest Common Prefix (id=5)
UPDATE problems 
SET 
    category = 'Data Structures & Algorithms',
    starter_code_cpp = '#include <iostream>
#include <vector>
#include <string>
using namespace std;

string longestCommonPrefix(vector<string>& strs) {
    // Write your code here
    
}

int main() {
    vector<string> strs = {"flower", "flow", "flight"};
    cout << longestCommonPrefix(strs) << endl;
    return 0;
}',
    starter_code_python = 'def longest_common_prefix(strs):
    """
    :param strs: List[str]
    :return: str
    """
    # Write your code here
    pass

if __name__ == "__main__":
    strs = ["flower", "flow", "flight"]
    print(longest_common_prefix(strs))',
    starter_code_javascript = 'function longestCommonPrefix(strs) {
    // Write your code here
    
}

// Test
const strs = ["flower", "flow", "flight"];
console.log(longestCommonPrefix(strs));'
WHERE slug = 'longest-common-prefix';

-- Valid Parentheses (id=6)
UPDATE problems 
SET 
    category = 'Data Structures & Algorithms',
    starter_code_cpp = '#include <iostream>
#include <string>
using namespace std;

bool isValid(string s) {
    // Write your code here
    
}

int main() {
    string s = "()";
    cout << (isValid(s) ? "true" : "false") << endl;
    return 0;
}',
    starter_code_python = 'def is_valid(s):
    """
    :param s: str
    :return: bool
    """
    # Write your code here
    pass

if __name__ == "__main__":
    s = "()"
    print(is_valid(s))',
    starter_code_javascript = 'function isValid(s) {
    // Write your code here
    
}

// Test
const s = "()";
console.log(isValid(s));'
WHERE slug = 'valid-parentheses';

-- Merge Two Sorted Lists (id=7)
UPDATE problems 
SET 
    category = 'Data Structures & Algorithms',
    starter_code_cpp = '#include <iostream>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode(int x) : val(x), next(NULL) {}
};

ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {
    // Write your code here
    
}

int main() {
    // Create test lists
    ListNode* list1 = new ListNode(1);
    list1->next = new ListNode(2);
    list1->next->next = new ListNode(4);
    
    ListNode* list2 = new ListNode(1);
    list2->next = new ListNode(3);
    list2->next->next = new ListNode(4);
    
    ListNode* result = mergeTwoLists(list1, list2);
    
    // Print result
    while (result != NULL) {
        cout << result->val << " ";
        result = result->next;
    }
    cout << endl;
    
    return 0;
}',
    starter_code_python = 'class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

def merge_two_lists(list1, list2):
    """
    :param list1: ListNode
    :param list2: ListNode
    :return: ListNode
    """
    # Write your code here
    pass

if __name__ == "__main__":
    # Create test lists
    list1 = ListNode(1, ListNode(2, ListNode(4)))
    list2 = ListNode(1, ListNode(3, ListNode(4)))
    
    result = merge_two_lists(list1, list2)
    
    # Print result
    while result:
        print(result.val, end=" ")
        result = result.next',
    starter_code_javascript = 'class ListNode {
    constructor(val, next = null) {
        this.val = val;
        this.next = next;
    }
}

function mergeTwoLists(list1, list2) {
    // Write your code here
    
}

// Test
const list1 = new ListNode(1, new ListNode(2, new ListNode(4)));
const list2 = new ListNode(1, new ListNode(3, new ListNode(4)));

let result = mergeTwoLists(list1, list2);

// Print result
let values = [];
while (result) {
    values.push(result.val);
    result = result.next;
}
console.log(values);'
WHERE slug = 'merge-two-sorted-lists';

-- Set category for remaining problems if not already set
UPDATE problems 
SET category = 'Data Structures & Algorithms' 
WHERE category IS NULL OR category = 'Programming';

-- Add default starter code for problems without specific templates
UPDATE problems 
SET starter_code_cpp = '#include <iostream>
using namespace std;

// TODO: Implement your solution here

int main() {
    // Write your code here
    return 0;
}'
WHERE starter_code_cpp IS NULL;

UPDATE problems 
SET starter_code_python = '# TODO: Implement your solution here

def solution():
    pass

if __name__ == "__main__":
    # Write your code here
    pass'
WHERE starter_code_python IS NULL;

UPDATE problems 
SET starter_code_javascript = '// TODO: Implement your solution here

function solution() {
    // Write your code here
}

// Test your solution
console.log(solution());'
WHERE starter_code_javascript IS NULL;
