-- Add driver template columns for LeetCode-style code execution
-- These templates wrap user's solution function with input parsing and output formatting

ALTER TABLE problems ADD COLUMN IF NOT EXISTS driver_code_cpp TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS driver_code_python TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS driver_code_javascript TEXT;
ALTER TABLE problems ADD COLUMN IF NOT EXISTS function_name VARCHAR(100);

-- Update Two Sum problem with driver templates
UPDATE problems SET function_name = 'twoSum' WHERE id = 1;

-- C++ Driver Template for Two Sum
UPDATE problems SET driver_code_cpp = '#include <iostream>
#include <vector>
#include <unordered_map>
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
    vector<int> nums = parseIntArray(line);
    
    int target;
    cin >> target;
    
    vector<int> result = twoSum(nums, target);
    cout << result[0] << " " << result[1] << endl;
    return 0;
}' WHERE id = 1;

-- Python Driver Template for Two Sum
UPDATE problems SET driver_code_python = '# ===== USER SOLUTION START =====
{{USER_SOLUTION}}
# ===== USER SOLUTION END =====

if __name__ == "__main__":
    nums = list(map(int, input().split()))
    target = int(input())
    result = two_sum(nums, target)
    print(result[0], result[1])' WHERE id = 1;

-- JavaScript Driver Template for Two Sum
UPDATE problems SET driver_code_javascript = '// ===== USER SOLUTION START =====
{{USER_SOLUTION}}
// ===== USER SOLUTION END =====

const readline = require("readline");
const rl = readline.createInterface({ input: process.stdin });

let lines = [];
rl.on("line", (line) => lines.push(line));
rl.on("close", () => {
    const nums = lines[0].split(" ").map(Number);
    const target = parseInt(lines[1]);
    const result = twoSum(nums, target);
    console.log(result[0] + " " + result[1]);
});' WHERE id = 1;
