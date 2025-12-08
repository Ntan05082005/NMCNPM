# 🌐 Coding Website - Backend API

A Spring Boot REST API for a coding practice platform with JWT authentication and code execution.

## ✨ Features Implemented

### Authentication
- ✅ User Registration with DTOs
- ✅ User Login with JWT Authentication
- ✅ BCrypt Password Hashing
- ✅ JWT Token Generation & Validation

### Code Submission
- ✅ Submit code for execution (`POST /api/submissions`)
- ✅ Multi-language support (Python, JavaScript, C++)
- ✅ Docker sandbox for isolated execution
- ✅ Test case validation
- ✅ Timeout handling (5 seconds)

### Database
- ✅ PostgreSQL with Docker
- ✅ Problems & Test Cases
- ✅ User Submissions tracking

## 📋 Prerequisites

1. **Java 21** - [Download](https://adoptium.net/)
2. **Maven 3.9+** - [Download](https://maven.apache.org/download.cgi)
3. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)

## 🚀 Quick Start

### 1. Start PostgreSQL (Docker)
```bash
docker run --name cws-postgres -e POSTGRES_USER=testuser -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=cws -p 5432:5432 -d postgres:16
Get-Content backup.sql | docker exec -i cws-postgres5 psql -U testuser -d cws  
```

### 2. Pull Code Execution Images
```bash
docker pull python:3.11-slim
docker pull node:20-slim
docker pull gcc:13
```

### 3. Build & Run
```bash
mvn clean install
mvn spring-boot:run
```

✅ Server: **http://localhost:8080**

---

## 📡 API Endpoints

### Authentication (Public)

#### POST /api/auth/register
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "type": "Bearer",
  "expiresIn": 86400000,
  "user": { "id": 1, "username": "johndoe", "role": "USER" }
}
```

---

### Code Submission (Protected - JWT Required)

#### POST /api/submissions
**Headers:** `Authorization: Bearer <token>`

**Request:**
```json
{
  "problemId": 1,
  "code": "print(input())",
  "language": "python"
}
```

**Supported Languages:**
- `python` - Python 3.11
- `javascript` - Node.js 20
- `cpp` - GCC 13

**Response:**
```json
{
  "submissionId": 1,
  "status": "ACCEPTED",
  "output": "Hello World",
  "executionTimeMs": 1205,
  "testResults": [
    {
      "input": "Hello World",
      "expectedOutput": "Hello World",
      "actualOutput": "Hello World",
      "passed": true
    }
  ]
}
```

**Status Values:**
- `ACCEPTED` - All test cases passed
- `WRONG_ANSWER` - Output doesn't match expected
- `RUNTIME_ERROR` - Code crashed during execution
- `TIME_LIMIT_EXCEEDED` - Execution exceeded 5 seconds
- `COMPILATION_ERROR` - Code failed to compile (C++)

---

#### GET /api/problems
Returns list of all problems.

#### GET /api/problems/{id}
Returns specific problem with test cases.

---

### Admin API (ADMIN Role Required)

#### POST /api/admin/problems
Create a new problem with test cases.

**Headers:** `Authorization: Bearer <admin-token>`

**Request:**
```json
{
  "title": "Sum of Two Numbers",
  "description": "Read two integers (one per line) and print their sum.",
  "testCases": [
    {"input": "5\n3", "expectedOutput": "8"},
    {"input": "10\n20", "expectedOutput": "30"}
  ]
}
```

**Response (201):**
```json
{
  "id": 4,
  "title": "Sum of Two Numbers",
  "description": "Read two integers...",
  "testCases": [
    {"id": 1, "input": "5\n3", "expectedOutput": "8"}
  ]
}
```

#### GET /api/admin/problems
List all problems with test cases.

#### GET /api/admin/problems/{id}
Get specific problem.

#### DELETE /api/admin/problems/{id}
Delete a problem.

**Make a user ADMIN:**
```bash
docker exec -it cws-postgres psql -U testuser -d cws -c "UPDATE users SET role='ADMIN' WHERE username='youruser';"
```

## 🧪 Testing with PowerShell

### Register & Login
```powershell
# Register
$body = '{"username":"testuser","email":"test@example.com","password":"test123"}'
$response = Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/register' -Method POST -ContentType 'application/json' -Body $body

# Save token
$token = $response.token
```

### Submit Code
```powershell
# Python
$code = 'print(input())'
$body = @{problemId=1; code=$code; language="python"} | ConvertTo-Json
$headers = @{"Authorization"="Bearer $token"; "Content-Type"="application/json"}
Invoke-RestMethod -Uri 'http://localhost:8080/api/submissions' -Method POST -Headers $headers -Body $body
```

---

## 📁 Project Structure

```
src/main/java/com/codingwebsite/backend/
├── config/
│   ├── SecurityConfig.java        # JWT & security
│   └── DataInitializer.java       # Sample problems
├── controller/
│   ├── AuthController.java        # Register & Login
│   ├── SubmissionController.java  # Code submission
│   └── AdminController.java       # Admin problem CRUD
├── dto/
│   ├── RegisterRequest.java
│   ├── LoginRequest.java
│   ├── AuthResponse.java
│   ├── SubmitRequest.java
│   ├── SubmitResponse.java
│   ├── TestResultDto.java
│   ├── CreateProblemRequest.java  # Admin create problem
│   └── ProblemDto.java            # Problem response
├── entity/
│   ├── User.java
│   ├── Problem.java
│   ├── TestCase.java
│   └── Submission.java
├── enums/
│   ├── Role.java                  # USER, ADMIN
│   ├── Language.java              # PYTHON, JAVASCRIPT, CPP
│   └── SubmissionStatus.java      # ACCEPTED, WRONG_ANSWER, etc.
├── repository/
│   ├── UserRepository.java
│   ├── ProblemRepository.java
│   └── SubmissionRepository.java
├── security/
│   ├── JwtService.java
│   ├── JwtAuthenticationFilter.java
│   └── CustomUserDetailsService.java
└── service/
    ├── UserService.java
    ├── SubmissionService.java
    ├── ProblemService.java        # Problem CRUD
    └── CodeExecutionService.java  # Docker execution
```

---

## 🗃️ Database Schema

### users
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| username | VARCHAR(50) | Unique |
| email | VARCHAR(100) | Unique |
| password | VARCHAR(255) | BCrypt hashed |
| role | VARCHAR(20) | USER/ADMIN |

### problems
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| title | VARCHAR | Problem title |
| description | TEXT | Problem description |

### test_cases
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| problem_id | BIGINT | Foreign key |
| input | TEXT | Test input |
| expected_output | TEXT | Expected output |

### submissions
| Column | Type | Description |
|--------|------|-------------|
| id | BIGSERIAL | Primary key |
| user_id | BIGINT | Foreign key |
| problem_id | BIGINT | Foreign key |
| code | TEXT | Submitted code |
| language | VARCHAR | PYTHON/JAVASCRIPT/CPP |
| status | VARCHAR | Execution result |
| output | TEXT | Code output |
| execution_time_ms | BIGINT | Time in ms |

---

## 🔒 Security Features

- **JWT Authentication** - Stateless token-based auth
- **BCrypt Password Hashing** - Secure password storage
- **Docker Sandbox** - Isolated code execution
- **Network Disabled** - No network access for code
- **Timeout Limit** - 5 second execution limit

---

## 🐳 Docker Images

| Language | Image | Size |
|----------|-------|------|
| Python | `python:3.11-slim` | ~50MB |
| JavaScript | `node:20-slim` | ~60MB |
| C++ | `gcc:13` | ~1.4GB |

---

## 📄 License

This project is part of the NMCNPM course.