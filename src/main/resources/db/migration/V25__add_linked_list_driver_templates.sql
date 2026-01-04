-- V25: Add driver templates for linked list problems (Add Two Numbers, Merge Two Sorted Lists)
-- These templates handle ListNode creation, input parsing, and output formatting

-- ============================================
-- Problem 2: Add Two Numbers
-- ============================================

UPDATE problems SET function_name = 'addTwoNumbers' WHERE id = 2;

-- C++ Driver Template for Add Two Numbers
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <sstream>
#include <string>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

ListNode* createList(const string& line) {
    if (line.empty()) return nullptr;
    
    stringstream ss(line);
    int val;
    ListNode* dummy = new ListNode(0);
    ListNode* curr = dummy;
    
    while (ss >> val) {
        curr->next = new ListNode(val);
        curr = curr->next;
    }
    
    return dummy->next;
}

void printList(ListNode* head) {
    bool first = true;
    while (head != nullptr) {
        if (!first) cout << " ";
        cout << head->val;
        first = false;
        head = head->next;
    }
    cout << endl;
}

int main() {
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    
    ListNode* l1 = createList(line1);
    ListNode* l2 = createList(line2);
    
    ListNode* result = addTwoNumbers(l1, l2);
    printList(result);
    
    return 0;
}' WHERE id = 2;

-- Python Driver Template for Add Two Numbers
UPDATE problems SET driver_code_python = 'class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

def create_list(line):
    if not line.strip():
        return None
    
    vals = list(map(int, line.split()))
    dummy = ListNode(0)
    curr = dummy
    
    for val in vals:
        curr.next = ListNode(val)
        curr = curr.next
    
    return dummy.next

def print_list(head):
    result = []
    while head:
        result.append(str(head.val))
        head = head.next
    print(" ".join(result))

if __name__ == "__main__":
    line1 = input()
    line2 = input()
    
    l1 = create_list(line1)
    l2 = create_list(line2)
    
    result = add_two_numbers(l1, l2)
    print_list(result)' WHERE id = 2;

-- JavaScript Driver Template for Add Two Numbers
UPDATE problems SET driver_code_javascript = 'class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

function createList(line) {
    if (!line.trim()) return null;
    
    const vals = line.trim().split(" ").map(Number);
    const dummy = new ListNode(0);
    let curr = dummy;
    
    for (const val of vals) {
        curr.next = new ListNode(val);
        curr = curr.next;
    }
    
    return dummy.next;
}

function printList(head) {
    const result = [];
    while (head !== null) {
        result.push(head.val);
        head = head.next;
    }
    console.log(result.join(" "));
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const l1 = createList(lines[0]);
    const l2 = createList(lines[1]);
    
    const result = addTwoNumbers(l1, l2);
    printList(result);
});' WHERE id = 2;

-- ============================================
-- Problem 9: Merge Two Sorted Lists
-- ============================================

UPDATE problems SET function_name = 'mergeTwoLists' WHERE id = 9;

-- C++ Driver Template for Merge Two Sorted Lists
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <sstream>
#include <string>
using namespace std;

struct ListNode {
    int val;
    ListNode *next;
    ListNode() : val(0), next(nullptr) {}
    ListNode(int x) : val(x), next(nullptr) {}
    ListNode(int x, ListNode *next) : val(x), next(next) {}
};

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

ListNode* createList(const string& line) {
    if (line.empty() || line == " ") return nullptr;
    
    stringstream ss(line);
    int val;
    ListNode* dummy = new ListNode(0);
    ListNode* curr = dummy;
    
    while (ss >> val) {
        curr->next = new ListNode(val);
        curr = curr->next;
    }
    
    return dummy->next;
}

void printList(ListNode* head) {
    if (head == nullptr) {
        cout << endl;
        return;
    }
    
    bool first = true;
    while (head != nullptr) {
        if (!first) cout << " ";
        cout << head->val;
        first = false;
        head = head->next;
    }
    cout << endl;
}

int main() {
    string line1, line2;
    getline(cin, line1);
    getline(cin, line2);
    
    ListNode* l1 = createList(line1);
    ListNode* l2 = createList(line2);
    
    ListNode* result = mergeTwoLists(l1, l2);
    printList(result);
    
    return 0;
}' WHERE id = 9;

-- Python Driver Template for Merge Two Sorted Lists
UPDATE problems SET driver_code_python = 'class ListNode:
    def __init__(self, val=0, next=None):
        self.val = val
        self.next = next

# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

def create_list(line):
    if not line.strip():
        return None
    
    vals = list(map(int, line.split()))
    if not vals:
        return None
    
    dummy = ListNode(0)
    curr = dummy
    
    for val in vals:
        curr.next = ListNode(val)
        curr = curr.next
    
    return dummy.next

def print_list(head):
    if head is None:
        print()
        return
    
    result = []
    while head:
        result.append(str(head.val))
        head = head.next
    print(" ".join(result))

if __name__ == "__main__":
    line1 = input()
    line2 = input()
    
    l1 = create_list(line1)
    l2 = create_list(line2)
    
    result = merge_two_lists(l1, l2)
    print_list(result)' WHERE id = 9;

-- JavaScript Driver Template for Merge Two Sorted Lists
UPDATE problems SET driver_code_javascript = 'class ListNode {
    constructor(val = 0, next = null) {
        this.val = val;
        this.next = next;
    }
}

// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

function createList(line) {
    if (!line.trim()) return null;
    
    const vals = line.trim().split(" ").map(Number);
    if (vals.length === 0 || vals[0] === "") return null;
    
    const dummy = new ListNode(0);
    let curr = dummy;
    
    for (const val of vals) {
        if (!isNaN(val)) {
            curr.next = new ListNode(val);
            curr = curr.next;
        }
    }
    
    return dummy.next;
}

function printList(head) {
    if (head === null) {
        console.log();
        return;
    }
    
    const result = [];
    while (head !== null) {
        result.push(head.val);
        head = head.next;
    }
    console.log(result.join(" "));
}

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const l1 = createList(lines[0] || "");
    const l2 = createList(lines[1] || "");
    
    const result = mergeTwoLists(l1, l2);
    printList(result);
});' WHERE id = 9;
