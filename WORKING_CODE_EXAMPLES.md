# ✅ Working Code Examples - All Languages

Ready-to-use code examples that pass all test cases.

## How to Use in Postman

### Step 1: Copy JSON
Select and copy the ENTIRE JSON block above (including `{` and `}`)

### Step 2: Paste in Postman
1. Method: **POST**
2. URL: `http://localhost:8080/api/submissions`
3. Headers:
   - `Authorization: Bearer <YOUR_JWT_TOKEN>` (token is generated after login)
   - `Content-Type: application/json`
4. Body: Select **raw** and **JSON**
5. Paste the JSON

### Step 3: Send
Click **Send** button


## Problem 1: Two Sum

### Python ✅
```json
{
  "problemId": 1,
  "code": "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n\nfound = False\nfor i in range(len(nums)):\n    for j in range(i+1, len(nums)):\n        if nums[i] + nums[j] == target:\n            print(i, j)\n            found = True\n            break\n    if found:\n        break",
  "language": "python"
}
```

### JavaScript ✅
```json
{
  "problemId": 1,
  "code": "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst nums = lines[1].split(' ').map(Number);\nconst target = parseInt(lines[2]);\n\nlet found = false;\nfor (let i = 0; i < n && !found; i++) {\n    for (let j = i + 1; j < n; j++) {\n        if (nums[i] + nums[j] === target) {\n            console.log(i + ' ' + j);\n            found = true;\n            break;\n        }\n    }\n}",
  "language": "javascript"
}
```

### C++ ✅
```json
{
  "problemId": 1,
  "code": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint main() {\n    int n, target;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cin >> target;\n    \n    bool found = false;\n    for (int i = 0; i < n && !found; i++) {\n        for (int j = i + 1; j < n; j++) {\n            if (nums[i] + nums[j] == target) {\n                cout << i << \" \" << j << endl;\n                found = true;\n                break;\n            }\n        }\n    }\n    return 0;\n}",
  "language": "cpp"
}
```

---

## Problem 6: Palindrome Number

### Python ✅
```json
{
  "problemId": 6,
  "code": "x = int(input())\nif x < 0:\n    print('false')\nelse:\n    s = str(x)\n    print('true' if s == s[::-1] else 'false')",
  "language": "python"
}
```

### JavaScript ✅
```json
{
  "problemId": 6,
  "code": "const fs = require('fs');\nconst input = fs.readFileSync(0, 'utf-8').trim();\nconst x = parseInt(input);\n\nif (x < 0) {\n    console.log('false');\n} else {\n    const str = x.toString();\n    const reversed = str.split('').reverse().join('');\n    console.log(str === reversed ? 'true' : 'false');\n}",
  "language": "javascript"
}
```

### C++ ✅
```json
{
  "problemId": 6,
  "code": "#include <iostream>\n#include <string>\n#include <algorithm>\nusing namespace std;\n\nint main() {\n    int x;\n    cin >> x;\n    if (x < 0) {\n        cout << \"false\" << endl;\n    } else {\n        string s = to_string(x);\n        string rev = s;\n        reverse(rev.begin(), rev.end());\n        cout << (s == rev ? \"true\" : \"false\") << endl;\n    }\n    return 0;\n}",
  "language": "cpp"
}
```

---

## Problem 8: Valid Parentheses

### Python ✅
```json
{
  "problemId": 8,
  "code": "s = input().strip()\nstack = []\nmatching = {'(': ')', '[': ']', '{': '}'}\n\nfor char in s:\n    if char in matching:\n        stack.append(char)\n    else:\n        if not stack or matching[stack.pop()] != char:\n            print('false')\n            exit()\n            \nprint('true' if not stack else 'false')",
  "language": "python"
}
```

### JavaScript ✅
```json
{
  "problemId": 8,
  "code": "const fs = require('fs');\nconst s = fs.readFileSync(0, 'utf-8').trim();\nconst stack = [];\nconst matching = { '(': ')', '[': ']', '{': '}' };\n\nfor (let char of s) {\n    if (matching[char]) {\n        stack.push(char);\n    } else {\n        if (stack.length === 0 || matching[stack.pop()] !== char) {\n            console.log('false');\n            process.exit(0);\n        }\n    }\n}\n\nconsole.log(stack.length === 0 ? 'true' : 'false');",
  "language": "javascript"
}
```

### C++ ✅
```json
{
  "problemId": 8,
  "code": "#include <iostream>\n#include <string>\n#include <stack>\nusing namespace std;\n\nint main() {\n    string s;\n    cin >> s;\n    stack<char> st;\n    \n    for (char c : s) {\n        if (c == '(' || c == '[' || c == '{') {\n            st.push(c);\n        } else {\n            if (st.empty()) {\n                cout << \"false\" << endl;\n                return 0;\n            }\n            char top = st.top();\n            st.pop();\n            if ((c == ')' && top != '(') || \n                (c == ']' && top != '[') || \n                (c == '}' && top != '{')) {\n                cout << \"false\" << endl;\n                return 0;\n            }\n        }\n    }\n    \n    cout << (st.empty() ? \"true\" : \"false\") << endl;\n    return 0;\n}",
  "language": "cpp"
}
```

---

## Problem 10: Binary Search

### Python ✅
```json
{
  "problemId": 10,
  "code": "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n\nleft, right = 0, n - 1\nwhile left <= right:\n    mid = (left + right) // 2\n    if nums[mid] == target:\n        print(mid)\n        exit()\n    elif nums[mid] < target:\n        left = mid + 1\n    else:\n        right = mid - 1\n        \nprint(-1)",
  "language": "python"
}
```

### JavaScript ✅
```json
{
  "problemId": 10,
  "code": "const fs = require('fs');\nconst lines = fs.readFileSync(0, 'utf-8').trim().split('\\n');\nconst n = parseInt(lines[0]);\nconst nums = lines[1].split(' ').map(Number);\nconst target = parseInt(lines[2]);\n\nlet left = 0, right = n - 1;\nwhile (left <= right) {\n    const mid = Math.floor((left + right) / 2);\n    if (nums[mid] === target) {\n        console.log(mid);\n        process.exit(0);\n    } else if (nums[mid] < target) {\n        left = mid + 1;\n    } else {\n        right = mid - 1;\n    }\n}\n\nconsole.log(-1);",
  "language": "javascript"
}
```

### C++ ✅
```json
{
  "problemId": 10,
  "code": "#include <iostream>\n#include <vector>\nusing namespace std;\n\nint binarySearch(vector<int>& nums, int target) {\n    int left = 0, right = nums.size() - 1;\n    while (left <= right) {\n        int mid = left + (right - left) / 2;\n        if (nums[mid] == target) return mid;\n        if (nums[mid] < target) left = mid + 1;\n        else right = mid - 1;\n    }\n    return -1;\n}\n\nint main() {\n    int n, target;\n    cin >> n;\n    vector<int> nums(n);\n    for (int i = 0; i < n; i++) cin >> nums[i];\n    cin >> target;\n    cout << binarySearch(nums, target) << endl;\n    return 0;\n}",
  "language": "cpp"
}
```

## View Submission History

```
Method: GET
URL: http://localhost:8080/api/submissions/user/1

Headers:
Authorization: Bearer <YOUR_JWT_TOKEN>

Response: List of all submissions for user ID 1
```


---

## 📝 Usage Tips

### In Postman:
1. Copy the entire JSON object
2. Paste into request body (select "raw" and "JSON")
3. Make sure Authorization header has valid JWT token
4. Click Send

### Important Notes:

**Newlines in JSON:**
- Use `\n` (single backslash) for **ALL languages** (Python, JavaScript, C++)
- Do NOT use `\\n` (double backslash) - that's only for documentation/markdown

**Reading Input:**
- **Python:** `input()` reads line by line
- **JavaScript:** Use `fs.readFileSync(0, 'utf-8')` to read all at once
- **C++:** `cin >>` reads whitespace-separated tokens

**Exit Early:**
- **Python:** `exit()` or `break`
- **JavaScript:** `process.exit(0)` or `break`
- **C++:** `return 0` or `break`

---

## PowerShell Testing

```powershell
# 1. Login and get token
$loginResponse = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" -Method Post -Body (@{username="user1"; password="password123"} | ConvertTo-Json) -ContentType "application/json"
$token = $loginResponse.token

# 2. Submit code
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    problemId = 1
    code = "n = int(input())`nnums = list(map(int, input().split()))`ntarget = int(input())`n`nfor i in range(len(nums)):`n    for j in range(i+1, len(nums)):`n        if nums[i] + nums[j] == target:`n            print(i, j)`n            break"
    language = "python"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/submissions" -Method Post -Headers $headers -Body $body

# 3. View result
$response | ConvertTo-Json -Depth 5
```

## Expected Submission Statuses

| Status | Description | Example |
|--------|-------------|---------|
| PENDING | Just submitted, not yet executed | Initial state |
| ACCEPTED | All test cases passed | Correct solution |
| WRONG_ANSWER | Output doesn't match expected | Wrong logic |
| RUNTIME_ERROR | Code crashed during execution | Division by zero, null pointer |
| TIME_LIMIT_EXCEEDED | Execution took > 5 seconds | Infinite loop |
| COMPILATION_ERROR | Code failed to compile (C++) | Syntax error |

## Troubleshooting

### Error: "Docker not running"
```bash
# Start Docker Desktop
# Verify:
docker ps
```

### Error: "User not found"
```bash
# First register a user:
POST /api/auth/register
{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}
```

### Error: "Problem not found"
```bash
# Verify problems exist:
GET /api/problems
```

### Error: "No test cases found"
```bash
# Verify test cases:
docker exec unicode-postgres psql -U postgres -d se_project -c "SELECT COUNT(*) FROM test_cases;"
```

## Docker Images Required

The system will automatically pull these images on first use:

- `python:3.11-slim` (~120 MB)
- `node:20-slim` (~170 MB)
- `gcc:13` (~1.2 GB)

## Performance Notes

- First execution of each language will be slower (image pull + container start)
- Subsequent executions are faster (~50-200ms depending on code complexity)
- Timeout set to 5 seconds per test case
- Network access is disabled for security

## Security Features

✅ **Isolated execution** - Each submission runs in separate Docker container  
✅ **No network access** - `--network=none` flag  
✅ **Timeout protection** - 5 second limit  
✅ **Read-only code** - Code files mounted as read-only  
✅ **Automatic cleanup** - Temporary files deleted after execution  
✅ **JWT authentication** - Only authenticated users can submit  

