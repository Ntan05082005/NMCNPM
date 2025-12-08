# 🧪 Complete API Testing Guide - Unicode Problem Management System

## 📋 Table of Contents
1. [Quick Start](#quick-start)
2. [Authentication APIs](#1-authentication-apis)
3. [Problem APIs](#2-problem-apis)
4. [Tag APIs](#3-tag-apis)
5. [Submission APIs](#4-submission-apis)
6. [Test & Debug APIs](#5-test--debug-apis)
7. [Advanced Testing](#6-advanced-testing)
8. [Troubleshooting](#7-troubleshooting)

---

## Quick Start

### Prerequisites
```bash
✅ PostgreSQL running on localhost:5432
✅ Docker Desktop running
✅ Spring Boot app: ./mvnw spring-boot:run
✅ Postman or curl installed
```

### Base URL
```
http://localhost:8080
```

### Authentication Flow
```
1. Register → 2. Login → 3. Get JWT Token → 4. Use Token in Headers
```

---

## 1. Authentication APIs

### 1.1 Register New User
**Endpoint:** `POST /api/auth/register`  
**Auth Required:** ❌ No  
**Description:** Create a new user account

**Request:**
```json
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123",
  "email": "test@example.com"
}
```

**Success Response (200):**
```json
{
  "message": "User registered successfully",
  "userId": 1,
  "username": "testuser"
}
```

**Error Responses:**
```json
// 400 - Username already exists
{
  "error": "Username already exists"
}

// 400 - Invalid email format
{
  "error": "Invalid email format"
}
```

**PowerShell Test:**
```powershell
$body = @{
    username = "testuser"
    password = "password123"
    email = "test@example.com"
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:8080/api/auth/register" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body
```

**curl Test:**
```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123","email":"test@example.com"}'
```

---

### 1.2 Login
**Endpoint:** `POST /api/auth/login`  
**Auth Required:** ❌ No  
**Description:** Login and receive JWT token

**Request:**
```json
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "username": "testuser",
  "password": "password123"
}
```

**Success Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0dXNlciIsImlhdCI6MTcwNjc4OTEyMCwiZXhwIjoxNzA2ODc1NTIwfQ.xYz...",
  "username": "testuser",
  "role": "USER"
}
```

**Error Responses:**
```json
// 401 - Invalid credentials
{
  "error": "Invalid username or password"
}
```

**PowerShell Test:**
```powershell
$body = @{
    username = "testuser"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8080/api/auth/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body $body

# Save token for later use
$token = $response.token
Write-Host "Token: $token"
```

**curl Test:**
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"password123"}'
```

---

## 2. Problem APIs

### 2.1 Get All Problems (Paginated)
**Endpoint:** `GET /api/problems`  
**Auth Required:** ❌ No  
**Description:** Get list of problems with pagination and filtering

**Query Parameters:**
- `page` (default: 0) - Page number (0-based)
- `size` (default: 10) - Items per page
- `difficulty` (optional) - Filter by difficulty: EASY, MEDIUM, HARD
- `tags` (optional) - Filter by tag slugs (comma-separated)
- `search` (optional) - Search in title and description

**Request Examples:**
```http
# Get first page (10 items)
GET http://localhost:8080/api/problems?page=0&size=10

# Get EASY problems only
GET http://localhost:8080/api/problems?difficulty=EASY

# Filter by tags
GET http://localhost:8080/api/problems?tags=array,hash-table

# Search problems
GET http://localhost:8080/api/problems?search=two sum

# Combined filters
GET http://localhost:8080/api/problems?difficulty=EASY&tags=array&page=0&size=5
```

**Success Response (200):**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Two Sum",
      "slug": "two-sum",
      "difficulty": "EASY",
      "description": "Given an array of integers...",
      "acceptance": 45.5,
      "tags": [
        {"id": 1, "name": "Array", "slug": "array"},
        {"id": 2, "name": "Hash Table", "slug": "hash-table"}
      ]
    }
  ],
  "totalElements": 10,
  "totalPages": 1,
  "currentPage": 0,
  "pageSize": 10,
  "hasNext": false,
  "hasPrevious": false
}
```

**PowerShell Test:**
```powershell
# Get all problems
$problems = Invoke-RestMethod -Uri "http://localhost:8080/api/problems?page=0&size=20"
$problems.content | Format-Table id, title, difficulty

# Filter by difficulty
$easyProblems = Invoke-RestMethod -Uri "http://localhost:8080/api/problems?difficulty=EASY"
Write-Host "Easy problems: $($easyProblems.totalElements)"
```

---

### 2.2 Get Problem by Slug
**Endpoint:** `GET /api/problems/{slug}`  
**Auth Required:** ❌ No  
**Description:** Get detailed problem information by slug

**Request:**
```http
GET http://localhost:8080/api/problems/two-sum
```

**Success Response (200):**
```json
{
  "id": 1,
  "title": "Two Sum",
  "slug": "two-sum",
  "difficulty": "EASY",
  "description": "Given an array of integers nums and an integer target...",
  "acceptance": 45.5,
  "constraints": "2 <= nums.length <= 10^4\n-10^9 <= nums[i] <= 10^9",
  "examples": [
    {
      "input": "nums = [2,7,11,15], target = 9",
      "output": "[0,1]",
      "explanation": "Because nums[0] + nums[1] == 9"
    }
  ],
  "tags": [
    {"id": 1, "name": "Array", "slug": "array"},
    {"id": 2, "name": "Hash Table", "slug": "hash-table"}
  ]
}
```

**Error Response (404):**
```json
{
  "error": "Problem not found"
}
```

---

### 2.3 Get Problem by ID
**Endpoint:** `GET /api/problems/id/{id}`  
**Auth Required:** ❌ No  
**Description:** Get problem by numeric ID

**Request:**
```http
GET http://localhost:8080/api/problems/id/1
```

**Response:** Same as 2.2

---

## 3. Tag APIs

### 3.1 Get All Tags
**Endpoint:** `GET /api/tags`  
**Auth Required:** ❌ No  
**Description:** Get all available problem tags

**Request:**
```http
GET http://localhost:8080/api/tags
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "name": "Array",
    "slug": "array",
    "description": "Problems involving arrays and lists"
  },
  {
    "id": 2,
    "name": "Hash Table",
    "slug": "hash-table",
    "description": "Problems using hash tables"
  },
  {
    "id": 3,
    "name": "Two Pointers",
    "slug": "two-pointers",
    "description": "Two pointer technique problems"
  }
]
```

**PowerShell Test:**
```powershell
$tags = Invoke-RestMethod -Uri "http://localhost:8080/api/tags"
$tags | Format-Table id, name, slug
```

---

### 3.2 Get Tag by Slug
**Endpoint:** `GET /api/tags/{slug}`  
**Auth Required:** ❌ No  
**Description:** Get specific tag information

**Request:**
```http
GET http://localhost:8080/api/tags/array
```

**Success Response (200):**
```json
{
  "id": 1,
  "name": "Array",
  "slug": "array",
  "description": "Problems involving arrays and lists",
  "problemCount": 15
}
```

**Error Response (404):**
```json
{
  "error": "Tag not found"
}
```

---

## 4. Submission APIs

### 4.1 Submit Code
**Endpoint:** `POST /api/submissions`  
**Auth Required:** ✅ Yes (JWT Token)  
**Description:** Submit code solution for a problem

**Request:**
```json
POST http://localhost:8080/api/submissions
Content-Type: application/json
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...

{
  "problemId": 1,
  "language": "python",
  "code": "n = int(input())\nnums = list(map(int, input().split()))\ntarget = int(input())\n\nfor i in range(n):\n    for j in range(i+1, n):\n        if nums[i] + nums[j] == target:\n            print(i, j)\n            break"
}
```

**Fields:**
- `problemId` (required) - Integer: Problem ID (1-10)
- `language` (required) - String: "python", "javascript", or "cpp"
- `code` (required) - String: Your solution code

**Success Response (200) - ACCEPTED:**
```json
{
  "submissionId": 1,
  "status": "ACCEPTED",
  "output": "0 1",
  "errorMessage": null,
  "executionTimeMs": 45,
  "testResults": [
    {
      "testCaseNumber": 1,
      "input": "4\n2 7 11 15\n9",
      "expectedOutput": "0 1",
      "actualOutput": "0 1",
      "passed": true,
      "executionTimeMs": 12,
      "status": "CORRECT"
    },
    {
      "testCaseNumber": 2,
      "input": "3\n3 2 4\n6",
      "expectedOutput": "1 2",
      "actualOutput": "1 2",
      "passed": true,
      "executionTimeMs": 10,
      "status": "CORRECT"
    }
  ],
  "testCasesPassed": 4,
  "totalTestCases": 4
}
```

**Success Response (200) - WRONG_ANSWER:**
```json
{
  "submissionId": 2,
  "status": "WRONG_ANSWER",
  "output": "1 0",
  "errorMessage": null,
  "executionTimeMs": 38,
  "testResults": [
    {
      "testCaseNumber": 1,
      "input": "4\n2 7 11 15\n9",
      "expectedOutput": "0 1",
      "actualOutput": "1 0",
      "passed": false,
      "executionTimeMs": 11,
      "status": "WRONG_ANSWER"
    }
  ],
  "testCasesPassed": 0,
  "totalTestCases": 4
}
```

**Success Response (200) - RUNTIME_ERROR:**
```json
{
  "submissionId": 3,
  "status": "RUNTIME_ERROR",
  "output": "",
  "errorMessage": "IndexError: list index out of range",
  "executionTimeMs": 25,
  "testResults": [
    {
      "testCaseNumber": 1,
      "passed": false,
      "status": "RUNTIME_ERROR",
      "errorMessage": "IndexError: list index out of range"
    }
  ],
  "testCasesPassed": 0,
  "totalTestCases": 4
}
```

**Success Response (200) - TIME_LIMIT_EXCEEDED:**
```json
{
  "submissionId": 4,
  "status": "TIME_LIMIT_EXCEEDED",
  "output": "",
  "errorMessage": "Execution timed out after 5000ms",
  "executionTimeMs": 5000,
  "testCasesPassed": 0,
  "totalTestCases": 4
}
```

**Error Response (403):**
```json
{
  "error": "Access Denied",
  "message": "JWT token required"
}
```

**Error Response (404):**
```json
{
  "error": "Problem not found"
}
```

**Error Response (400):**
```json
{
  "error": "No test cases found for this problem"
}
```

**PowerShell Test:**
```powershell
# Submit Python solution
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$body = @{
    problemId = 1
    language = "python"
    code = @"
n = int(input())
nums = list(map(int, input().split()))
target = int(input())

for i in range(n):
    for j in range(i+1, n):
        if nums[i] + nums[j] == target:
            print(i, j)
            break
"@
} | ConvertTo-Json

$result = Invoke-RestMethod -Uri "http://localhost:8080/api/submissions" `
    -Method Post `
    -Headers $headers `
    -Body $body

Write-Host "Status: $($result.status)" -ForegroundColor $(if($result.status -eq "ACCEPTED"){"Green"}else{"Red"})
Write-Host "Passed: $($result.testCasesPassed)/$($result.totalTestCases)"
```

---

### 4.2 Get User Submissions
**Endpoint:** `GET /api/submissions/user/{userId}`  
**Auth Required:** ✅ Yes (JWT Token)  
**Description:** Get all submissions by a specific user

**Request:**
```http
GET http://localhost:8080/api/submissions/user/1
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Success Response (200):**
```json
[
  {
    "id": 1,
    "problemId": 1,
    "problemTitle": "Two Sum",
    "userId": 1,
    "username": "testuser",
    "language": "python",
    "status": "ACCEPTED",
    "executionTimeMs": 45,
    "submittedAt": "2024-01-15T10:30:00",
    "testCasesPassed": 4,
    "totalTestCases": 4
  },
  {
    "id": 2,
    "problemId": 6,
    "problemTitle": "Palindrome Number",
    "userId": 1,
    "username": "testuser",
    "language": "python",
    "status": "WRONG_ANSWER",
    "executionTimeMs": 38,
    "submittedAt": "2024-01-15T10:35:00",
    "testCasesPassed": 2,
    "totalTestCases": 5
  }
]
```

---

### 4.3 Get Problem Submissions
**Endpoint:** `GET /api/submissions/problem/{problemId}`  
**Auth Required:** ✅ Yes (JWT Token)  
**Description:** Get all submissions for a specific problem

**Request:**
```http
GET http://localhost:8080/api/submissions/problem/1
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Success Response (200):** Similar to 4.2

**PowerShell Test:**
```powershell
$headers = @{
    "Authorization" = "Bearer $token"
}

# Get user submissions
$userSubmissions = Invoke-RestMethod -Uri "http://localhost:8080/api/submissions/user/1" `
    -Headers $headers

$userSubmissions | Format-Table id, problemTitle, status, testCasesPassed

# Get problem submissions
$problemSubmissions = Invoke-RestMethod -Uri "http://localhost:8080/api/submissions/problem/1" `
    -Headers $headers

Write-Host "Total submissions for Problem 1: $($problemSubmissions.Count)"
```

---

## 5. Test & Debug APIs

### 5.1 Public Test Endpoint
**Endpoint:** `GET /api/test/public`  
**Auth Required:** ❌ No  
**Description:** Test endpoint to verify API is accessible

**Request:**
```http
GET http://localhost:8080/api/test/public
```

**Success Response (200):**
```
API public - Ai cũng truy cập được không cần token!
```

**PowerShell Test:**
```powershell
Invoke-RestMethod -Uri "http://localhost:8080/api/test/public"
```

---

### 5.2 Protected Test Endpoint
**Endpoint:** `GET /api/test/protected`  
**Auth Required:** ✅ Yes (JWT Token)  
**Description:** Test endpoint to verify JWT authentication

**Request:**
```http
GET http://localhost:8080/api/test/protected
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
```

**Success Response (200):**
```
API được bảo vệ - Chào testuser! Bạn đã đăng nhập thành công.
```

**Error Response (403):**
```json
{
  "error": "Access Denied"
}
```

**PowerShell Test:**
```powershell
# Without token (should fail)
try {
    Invoke-RestMethod -Uri "http://localhost:8080/api/test/protected"
} catch {
    Write-Host "❌ Failed without token (expected)" -ForegroundColor Yellow
}

# With token (should succeed)
$headers = @{
    "Authorization" = "Bearer $token"
}
$response = Invoke-RestMethod -Uri "http://localhost:8080/api/test/protected" `
    -Headers $headers
Write-Host "✅ $response" -ForegroundColor Green
```

---

### 5.3 Health Check
**Endpoint:** `GET /api/debug/health`  
**Auth Required:** ❌ No  
**Description:** Check if application is running

**Request:**
```http
GET http://localhost:8080/api/debug/health
```

**Success Response (200):**
```
Application is running!
```

**PowerShell Test:**
```powershell
$health = Invoke-RestMethod -Uri "http://localhost:8080/api/debug/health"
if ($health -eq "Application is running!") {
    Write-Host "✅ Backend is healthy" -ForegroundColor Green
} else {
    Write-Host "❌ Backend unhealthy" -ForegroundColor Red
}
```

---

