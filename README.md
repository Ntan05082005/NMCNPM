# 🎯 Unicode Programming Practice System

> A full-stack online judge platform for competitive programming practice, similar to LeetCode. Built with Spring Boot, React, and PostgreSQL.

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0.0-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19.2.0-blue.svg)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue.svg)](https://www.postgresql.org/)
[![Java](https://img.shields.io/badge/Java-17-orange.svg)](https://www.oracle.com/java/)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [How The System Works](#-how-the-system-works)
- [Database Schema](#️-database-schema)
- [Authentication & Security Flow](#-authentication--security-flow)
- [Code Execution System](#️-code-execution-system)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Project Structure](#-project-structure)
- [API Documentation](#-api-documentation)
- [Development Guide](#-development-guide)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)

---

## ✨ Features

### 🎓 Core Functionality

- **👤 User Management**
  - JWT-based authentication & authorization
  - Role-based access control (USER, ADMIN)
  - Secure password encryption with BCrypt
  - Email validation and user registration

- **📝 Problem Management**
  - Browse 30+ pre-loaded coding problems
  - Filter by difficulty (Easy, Medium, Hard)
  - Search and tag-based categorization
  - Category organization (Array, String, DP, Graph, etc.)
  - Pagination support
  - Detailed problem descriptions with examples and constraints

- **⚡ Code Execution & Judging**
  - Multi-language support: **C++, Python, Java**
  - Docker-based isolated code execution (sandbox)
  - Automated test case validation
  - Runtime and memory usage tracking
  - Comprehensive error capture and reporting
  - Multiple verdict statuses (Accepted, Wrong Answer, TLE, Runtime Error, etc.)

- **📊 Submission System**
  - Real-time code submission and evaluation
  - Detailed execution feedback
  - Submission history tracking
  - Test case results display
  - Personal statistics

- **🤖 AI Chatbot (UniCode Assistant)**
  - Gemini AI-powered coding assistant
  - Context-aware help on problem pages (knows your current code)
  - Website-aware responses about UniCode features
  - Floating chat interface with theme support
  - **⚠️ Requires your own Gemini API key** - [Get free key here](https://aistudio.google.com/app/apikey)

- **🛡️ Admin Dashboard**
  - Admin-only access at `/admin`
  - Dashboard with platform statistics
  - Problem management (create, edit, delete with rich text editor)
  - User management (view all users, change roles)
  - Submission viewer (view all user submissions)

### 🎨 User Interface

- Modern React SPA with React Router v7
- Responsive design using Tailwind CSS v4
- Professional UI components with Ant Design v6
- Code editor integration for problem solving
- Real-time feedback on code execution
- Protected routes with authentication guards
- Multiple themes: Light, Dark, Christmas, New Year

### 🔐 OAuth2 Social Login

- Google OAuth2 integration
- GitHub OAuth2 support
- Facebook OAuth2 support
- Automatic user creation on first login
- Seamless JWT token generation after OAuth success

---

## 🛠 Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Java | 17 | Programming Language |
| Spring Boot | 4.0.0 | Application Framework |
| Spring Security | - | Authentication & Authorization |
| JWT | 0.12.3 | Token-based Authentication |
| Spring Data JPA | - | Database ORM |
| PostgreSQL | 15 | Relational Database |
| Flyway | - | Database Migration |
| Docker | - | Code Execution Sandbox |
| Maven | 3.6+ | Build & Dependency Management |
| Lombok | - | Boilerplate Code Reduction |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.0 | UI Library |
| Vite | 7.2.4 | Build Tool & Dev Server |
| React Router | 7.9.6 | Client-side Routing |
| Ant Design | 6.0.0 | UI Component Library |
| Tailwind CSS | 4.1.17 | Utility-first CSS Framework |
| Axios | 1.13.2 | HTTP Client |
| React Icons | 5.5.0 | Icon Library |

---

## 🏗 System Architecture

### Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    FRONTEND (React + Vite)                  │
│  Port: 5173 | React Router | Axios | Ant Design | Tailwind │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/REST API
                         │ JWT Authentication (Bearer Token)
┌────────────────────────▼────────────────────────────────────┐
│              BACKEND (Spring Boot 4.0.0)                    │
│                     Port: 8080                              │
├─────────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐  │
│  │ Controllers  │→ │   Services   │→ │  Repositories   │  │
│  │ (REST APIs)  │  │ (Business    │  │  (Data Access)  │  │
│  │              │  │  Logic)      │  │                 │  │
│  └──────────────┘  └──────┬───────┘  └────────┬────────┘  │
│                            │                   │            │
│  ┌──────────────┐         │                   │            │
│  │  Security    │─────────┘                   │            │
│  │  - JWT       │                             │            │
│  │  - OAuth2    │                             │            │
│  └──────────────┘                             │            │
│                                                │            │
│  ┌──────────────────────┐  ┌─────────────────▼──────────┐ │
│  │ CodeExecutionService │  │   PostgreSQL Database      │ │
│  │ (Docker Sandbox)     │  │   - users, problems        │ │
│  └──────────┬───────────┘  │   - submissions, testcases │ │
│             │               │   - tags, problem_tags     │ │
│             ▼               └────────────────────────────┘ │
│  ┌──────────────────────┐                                  │
│  │  Docker Containers   │  ┌─────────────────────────────┐│
│  │  - cpp:latest        │  │   Gemini AI Service         ││
│  │  - python:3.9-slim   │  │   (External API)            ││
│  │  - node:16-alpine    │  └─────────────────────────────┘│
│  └──────────────────────┘                                  │
└─────────────────────────────────────────────────────────────┘
```

### Layered Architecture

The project follows a **clean layered architecture** pattern:

**1. Presentation Layer (Frontend)**
- React components and pages
- Routing with React Router
- API communication via Axios
- State management in components

**2. API Layer (Controllers)**
- REST endpoints handling HTTP requests
- Request validation
- Response formatting
- Authentication/Authorization checks

**3. Business Logic Layer (Services)**
- Core application logic
- Code execution orchestration
- Test case evaluation
- Statistics calculation

**4. Data Access Layer (Repositories)**
- JPA/Hibernate ORM
- Database queries
- Transaction management

**5. Data Layer (PostgreSQL)**
- Persistent data storage
- Flyway migrations for schema versioning

---

## 🔄 How The System Works

This section explains the complete flow of the application from user interaction to response.

### 1️⃣ User Registration & Login Flow

**Local Authentication:**
```
┌──────────────────────────────────────────────────────────┐
│ FRONTEND (React)                                          │
└────┬─────────────────────────────────────────────────────┘
     │ 1. User submits registration/login form
     ▼
POST /api/auth/register or /api/auth/login
     │ { username, email, password }
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ BACKEND: AuthController                                   │
│  ├─ Validate input (empty check, email format)           │
│  ├─ Check username/email uniqueness                      │
│  ├─ Hash password with BCrypt                            │
│  ├─ Save user to database                                │
│  └─ Generate JWT token (24h expiration)                  │
└────┬─────────────────────────────────────────────────────┘
     │ Return: { token, username, userId, email, role }
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ FRONTEND: Store token in localStorage                    │
│  ├─ localStorage.setItem("jwt_token", token)             │
│  └─ All API requests include: Authorization: Bearer <token>
└──────────────────────────────────────────────────────────┘
```

**OAuth2 Social Login Flow:**
```
User clicks "Login with Google/GitHub/Facebook"
     ↓
Frontend redirects to: /oauth2/authorization/{provider}
     ↓
Spring Security OAuth2 handles redirect to provider
     ↓
User authorizes on provider's page
     ↓
Provider redirects back with authorization code
     ↓
CustomOAuth2UserService fetches user info
     ├─ Extract email, name, avatar from provider
     ├─ Check if user exists in database
     └─ Create new user or update existing
     ↓
OAuth2AuthenticationSuccessHandler
     ├─ Generate JWT token
     └─ Redirect to frontend: /oauth2/redirect?token=<jwt>
     ↓
Frontend extracts token from URL and stores it
```

### 2️⃣ Problem Browsing & Filtering Flow

```
┌──────────────────────────────────────────────────────────┐
│ FRONTEND: User visits /problems page                      │
└────┬─────────────────────────────────────────────────────┘
     │ User selects filters (difficulty, tags, search)
     ▼
GET /api/problems?page=0&size=20&difficulty=EASY&tags=array
     │
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ BACKEND: ProblemController.getProblems()                  │
│  └─ Extract authenticated user (optional)                │
└────┬─────────────────────────────────────────────────────┘
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ ProblemService.getProblems()                              │
│  ├─ Build ProblemFilterDto from parameters               │
│  ├─ Create Sort object (default: title ASC)              │
│  └─ Build Pageable with page, size, sort                 │
└────┬─────────────────────────────────────────────────────┘
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ ProblemSpecification.withFilters()                        │
│  ├─ Build JPA Criteria Query dynamically                 │
│  ├─ Add difficulty filter (if provided)                  │
│  ├─ Add tags filter with JOIN (if provided)              │
│  ├─ Add search filter on title (if provided)             │
│  └─ Add isPremium filter (if provided)                   │
└────┬─────────────────────────────────────────────────────┘
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ ProblemRepository.findAll(spec, pageable)                 │
│  └─ Execute SQL query with JOINs on tags table           │
└────┬─────────────────────────────────────────────────────┘
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ ProblemMapper.toDto()                                     │
│  ├─ Convert Problem entity to ProblemDto                 │
│  ├─ Check if user has solved this problem (if userId)    │
│  │   └─ Query submissions table for ACCEPTED status      │
│  ├─ Map tags to TagDto list                              │
│  └─ Include acceptance rate, total submissions           │
└────┬─────────────────────────────────────────────────────┘
     │ Return: PageResponse<ProblemDto>
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ FRONTEND: Render problem list with pagination            │
│  ├─ Display difficulty badge (Easy/Medium/Hard)          │
│  ├─ Show solved status (green checkmark)                 │
│  ├─ Show acceptance rate and tags                        │
│  └─ Pagination controls at bottom                        │
└──────────────────────────────────────────────────────────┘
```

### 3️⃣ Code Submission & Execution Flow (Detailed)

```
┌──────────────────────────────────────────────────────────┐
│ FRONTEND: User on /interface-code/{slug} page            │
│  ├─ User writes code in editor                           │
│  ├─ Selects language (C++, Python, JavaScript)           │
│  └─ Clicks "Submit" button                               │
└────┬─────────────────────────────────────────────────────┘
     │ POST /api/submissions
     │ { problemId, code, language }
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ BACKEND: SubmissionController.submit()                    │
│  ├─ Extract authenticated user from JWT                  │
│  └─ Delegate to SubmissionService                        │
└────┬─────────────────────────────────────────────────────┘
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ SubmissionService.submit()                                │
│  ├─ Fetch Problem from database                          │
│  ├─ Fetch all TestCases for problem                      │
│  ├─ Create Submission entity (status: PENDING)           │
│  └─ For each test case:                                  │
└────┬─────────────────────────────────────────────────────┘
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ CodeExecutionService.execute()                            │
│  ├─ Get driver template for language                     │
│  │   (LeetCode-style: wraps user solution function)      │
│  ├─ Merge user code with driver template                 │
│  │   driver.replace("{{USER_SOLUTION}}", userCode)       │
│  ├─ Create temporary directory                           │
│  ├─ Write code to file (solution.py/js/cpp)              │
│  ├─ Write test input to input.txt                        │
│  └─ Build Docker command                                 │
└────┬─────────────────────────────────────────────────────┘
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ Docker Container Execution (Isolated Sandbox)            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ Docker: trantho16/unicode-python:latest           │  │
│  │  ├─ Network: NONE (no internet access)            │  │
│  │  ├─ Volume: /code (read-only)                     │  │
│  │  ├─ Memory limit: 256MB                           │  │
│  │  └─ Timeout: 10s (hard limit)                     │  │
│  ├────────────────────────────────────────────────────┤  │
│  │ Execute: python solution.py < input.txt           │  │
│  │  ├─ Capture stdout (program output)               │  │
│  │  ├─ Capture stderr (errors)                       │  │
│  │  ├─ Track execution time (nanoseconds)            │  │
│  │  └─ Track memory usage (/usr/bin/time -v)        │  │
│  └────────────────────────────────────────────────────┘  │
│  ├─ Container destroyed after execution                  │
│  └─ Temporary files cleaned up                           │
└────┬─────────────────────────────────────────────────────┘
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ JudgeService.compareOutputs()                             │
│  ├─ Normalize whitespace in output                       │
│  ├─ Compare actual vs expected                           │
│  └─ Categorize result:                                   │
│      ├─ ACCEPTED (output matches)                        │
│      ├─ WRONG_ANSWER (output mismatch)                   │
│      ├─ RUNTIME_ERROR (exception/crash)                  │
│      ├─ TIME_LIMIT_EXCEEDED (too slow)                   │
│      └─ COMPILATION_ERROR (syntax error)                 │
└────┬─────────────────────────────────────────────────────┘
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ Save Submission to Database                               │
│  ├─ Update submission status                             │
│  ├─ Save execution time, memory usage                    │
│  ├─ Save test cases passed/total                         │
│  └─ Update problem statistics (acceptance rate)          │
└────┬─────────────────────────────────────────────────────┘
     │ Return: SubmitResponse
     │ { submissionId, status, testResults[], executionTimeMs }
     ▼
┌────▼─────────────────────────────────────────────────────┐
│ FRONTEND: Display Results                                │
│  ├─ Show status badge (ACCEPTED = green)                 │
│  ├─ Show test case results (passed/failed)               │
│  ├─ Show execution time and memory                       │
│  └─ If error: show error message and stderr              │
└──────────────────────────────────────────────────────────┘
```

**LeetCode-Style Driver Templates:**
```python
# Example Driver Template for Python (Two Sum problem)
{{USER_SOLUTION}}  # User's solution function inserted here

if __name__ == "__main__":
    import json
    import sys
    
    for line in sys.stdin:
        data = json.loads(line)
        nums = data["nums"]
        target = data["target"]
        result = twoSum(nums, target)
        print(json.dumps(result))
```

### 4️⃣ AI Chatbot Integration Flow

```
User types message → POST /api/ai/chat
                            ↓
            AIChatController receives request
                            ↓
            GeminiService builds prompt:
            - System prompt (UniCode Assistant role)
            - Context (current problem, user code)
            - User message
                            ↓
            Call Gemini API (gemini-2.5-flash)
                            ↓
            Parse AI response
                            ↓
            Return formatted markdown to frontend
```

---

## 🗄️ Database Schema

The system uses **PostgreSQL 15** with **Flyway migrations** for version control.

### Entity-Relationship Diagram

```
┌─────────────┐         ┌──────────────┐         ┌────────────┐
│    users    │         │   problems   │         │    tags    │
├─────────────┤         ├──────────────┤         ├────────────┤
│ id (PK)     │────┐    │ id (PK)      │◄────┐   │ id (PK)    │
│ username    │    │    │ title        │     │   │ name       │
│ email       │    │    │ slug         │     │   │ slug       │
│ password    │    │    │ difficulty   │     │   └────────────┘
│ role        │    │    │ description  │     │         │
│ provider    │    │    │ category     │     │         │
└─────────────┘    │    └──────────────┘     │         │
       │           │           │              │         │
       │           │           │              │         │
       │           │      ┌────▼──────────┐   │    ┌────▼──────────┐
       │           │      │  test_cases   │   │    │ problem_tags  │
       │           │      ├───────────────┤   │    ├───────────────┤
       │           │      │ id (PK)       │   │    │ problem_id(FK)│
       │           │      │ problem_id(FK)│───┘    │ tag_id (FK)   │
       │           │      │ input         │        └───────────────┘
       │           │      │ expected_out  │
       │           │      └───────────────┘
       │           │
       │      ┌────▼──────────┐
       └──────► submissions   │
              ├───────────────┤
              │ id (PK)       │
              │ user_id (FK)  │
              │ problem_id(FK)│
              │ code          │
              │ language      │
              │ status        │
              │ execution_time│
              │ memory_used   │
              └───────────────┘
```

### Core Tables

#### 1. **users** - User Account Information
```sql
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255),  -- BCrypt hashed (nullable for OAuth)
    role VARCHAR(20) DEFAULT 'USER' NOT NULL,  -- USER, ADMIN
    
    -- OAuth2 fields
    provider VARCHAR(20) DEFAULT 'LOCAL',  -- LOCAL, GOOGLE, GITHUB, FACEBOOK
    provider_id VARCHAR(255),
    
    -- Profile fields
    full_name VARCHAR(255),
    avatar_url TEXT,
    github_link VARCHAR(255),
    linkedin_link VARCHAR(255),
    theme_preference VARCHAR(50) DEFAULT 'light',
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 2. **problems** - Coding Problems
```sql
CREATE TABLE problems (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    difficulty VARCHAR(20) NOT NULL,  -- EASY, MEDIUM, HARD
    description TEXT NOT NULL,
    
    -- Problem details
    constraints TEXT,
    input_format TEXT,
    output_format TEXT,
    summary TEXT,
    learning_objectives TEXT,
    
    -- Limits
    time_limit_ms INTEGER DEFAULT 2000,
    memory_limit_mb INTEGER DEFAULT 256,
    
    -- Statistics
    acceptance_rate DECIMAL(5,2) DEFAULT 0.0,
    total_submissions INTEGER DEFAULT 0,
    total_accepted INTEGER DEFAULT 0,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    
    -- Code templates (starter code shown to user)
    starter_code_cpp TEXT,
    starter_code_python TEXT,
    starter_code_javascript TEXT,
    
    -- Driver templates (wraps user solution for LeetCode-style execution)
    driver_code_cpp TEXT,
    driver_code_python TEXT,
    driver_code_javascript TEXT,
    function_name VARCHAR(100),
    
    -- Metadata
    category VARCHAR(50),  -- Array, String, DP, Graph, etc.
    is_premium BOOLEAN DEFAULT FALSE,
    author_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

#### 3. **test_cases** - Test Cases for Problems
```sql
CREATE TABLE test_cases (
    id SERIAL PRIMARY KEY,
    problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    input TEXT NOT NULL,
    expected_output TEXT NOT NULL,
    is_sample BOOLEAN DEFAULT FALSE  -- Sample test cases shown to users
);
```

#### 4. **submissions** - User Code Submissions
```sql
CREATE TABLE submissions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    problem_id INTEGER NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    language VARCHAR(20) NOT NULL,  -- CPP, PYTHON, JAVASCRIPT
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    -- Status: ACCEPTED, WRONG_ANSWER, RUNTIME_ERROR, 
    --         TIME_LIMIT_EXCEEDED, COMPILATION_ERROR
    
    -- Results
    output TEXT,
    error_message TEXT,
    execution_time_ms BIGINT,
    memory_used_kb BIGINT,
    test_cases_passed INTEGER DEFAULT 0,
    total_test_cases INTEGER DEFAULT 0,
    
    submitted_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_submissions_user_id ON submissions(user_id);
CREATE INDEX idx_submissions_problem_id ON submissions(problem_id);
CREATE INDEX idx_submissions_status ON submissions(status);
CREATE INDEX idx_submissions_submitted_at ON submissions(submitted_at DESC);
```

#### 5. **tags** - Problem Tags/Categories
```sql
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    slug VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### 6. **problem_tags** - Many-to-Many Relationship
```sql
CREATE TABLE problem_tags (
    problem_id BIGINT NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
    tag_id BIGINT NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (problem_id, tag_id)
);
```

### Database Migrations

The system uses **Flyway** for database versioning. Migrations are located in:
```
src/main/resources/db/migration/
```

Key migrations:
- `V1__create_roles.sql` - Initial roles table
- `V2__create_users.sql` - Users table
- `V4__create_problems.sql` - Problems table
- `V7__enhance_problems_and_add_tags.sql` - Tags and enhancements
- `V9__create_submissions_and_testcases.sql` - Submissions and test cases
- `V21__add_driver_templates.sql` - LeetCode-style driver templates
- `V23__add_user_profile_fields.sql` - User profile enhancements
- `V28__add_oauth_fields.sql` - OAuth2 support

---

## 🔐 Authentication & Security Flow

### JWT Authentication

**Token Generation:**
```java
// JwtUtils.java
String token = Jwts.builder()
    .setSubject(username)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24h
    .signWith(Keys.hmacShaKeyFor(secretKey.getBytes()), SignatureAlgorithm.HS256)
    .compact();
```

**Token Validation Flow:**
```
Every API Request with JWT
     ↓
JwtAuthenticationFilter intercepts
     ↓
Extract token from Authorization header
     ↓
JwtUtils.validateToken(token)
     ├─ Check expiration
     ├─ Verify signature
     └─ Extract username
     ↓
Load user from database
     ↓
Set SecurityContext with user details
     ↓
Request proceeds to controller
```

### Security Configuration

**Protected Routes:**
- `/api/submissions/**` - Requires authentication
- `/api/admin/**` - Requires ADMIN role
- `/api/auth/**` - Public (login/register)
- `/api/problems/**` - Public (read-only)

**CORS Policy:**
```java
// Allows all localhost ports for development
configuration.setAllowedOriginPatterns(Arrays.asList("http://localhost:*"));
configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
configuration.setAllowCredentials(true);
```

**Password Security:**
- BCrypt encryption with default strength (10 rounds)
- Salted hashing automatically
- Never store plain text passwords

### OAuth2 Integration

**Supported Providers:**
1. **Google OAuth2**
2. **GitHub OAuth2**  
3. **Facebook OAuth2**

**OAuth2 Configuration (`application.properties`):**
```properties
spring.security.oauth2.client.registration.google.client-id=YOUR_CLIENT_ID
spring.security.oauth2.client.registration.google.client-secret=YOUR_SECRET
spring.security.oauth2.client.registration.google.scope=email,profile
```

---

## ⚙️ Code Execution System

### Architecture Overview

The code execution system is the core of the online judge platform, providing secure and isolated code execution.

### Execution Flow Components

**1. CodeExecutionService**
- Main orchestrator for code execution
- Manages temporary files and Docker containers
- Tracks execution time and memory usage

**2. Docker Isolation**
```bash
# Python execution example
docker run --rm \
  --network=none \
  -v "/temp/code_exec:/code:ro" \
  -w /code \
  trantho16/unicode-python:latest \
  sh -c "python solution.py < input.txt"
```

**Security Features:**
- ✅ Network disabled (`--network=none`)
- ✅ Read-only volume mount (`:ro`)
- ✅ Container auto-removed after execution (`--rm`)
- ✅ Memory limit enforced (256MB)
- ✅ Timeout enforcement (10s hard limit)

**3. JudgeService**
- Compares actual output with expected output
- Normalizes whitespace for fair comparison
- Categorizes errors (runtime, compilation, timeout)

**4. RuntimeCalculator**
- Measures execution time externally (nanosecond precision)
- Provides fallback timing if internal timing fails

**5. ErrorCaptureService**
- Captures stdout and stderr separately
- Detects compilation errors vs runtime errors
- Formats error messages for user-friendly display

### Docker Images

Custom Docker images with pre-installed tools:
```
trantho16/unicode-python:latest   # Python 3.11 + /usr/bin/time
trantho16/unicode-node:latest     # Node.js 20 + /usr/bin/time
trantho16/unicode-gcc:latest      # GCC 12 + /usr/bin/time
```

### Execution Statuses

| Status | Description | Condition |
|--------|-------------|-----------|
| **ACCEPTED** | ✅ All test cases passed | Output matches expected |
| **WRONG_ANSWER** | ❌ Incorrect output | Output doesn't match |
| **RUNTIME_ERROR** | ⚠️ Program crashed | Exception/segfault |
| **TIME_LIMIT_EXCEEDED** | ⏱️ Too slow | Execution > time limit |
| **COMPILATION_ERROR** | 🔧 Syntax error | Code failed to compile |

### Test Case Execution

**Sample Test Cases:**
- First 2 test cases are shown to users
- Users can run code against samples before submitting

**Hidden Test Cases:**
- Full submission runs against all test cases
- Users see pass/fail count, not actual inputs

**Custom Input:**
- Users can provide custom input for testing
- No expected output comparison
- Just shows what their code produces

---
```

**tags & problem_tags**
```sql
tags:
- id, name, slug

problem_tags (Many-to-Many):
- problem_id (FK → problems)
- tag_id (FK → tags)
```

---

## 🔑 Key Components Explained

### Backend Services

**1. CodeExecutionService**
- Core service for executing user code
- Creates isolated Docker containers per submission
- Supports C++, Python, JavaScript
- Implements timeout and memory limits
- Captures stdout, stderr, and runtime metrics

**2. JudgeService**
- Evaluates submission results
- Compares actual vs expected output
- Categorizes errors (compile, runtime, wrong answer)
- Calculates scores and acceptance rates

**3. ProblemService**
- Manages problem CRUD operations
- Implements filtering and search
- Handles pagination
- Integrates with user solve status

**4. SubmissionService**
- Handles code submission workflow
- Coordinates execution and judging
- Tracks user statistics
- Manages submission history

**5. GeminiService**
- Integrates with Google Gemini AI
- Provides context-aware assistance
- Formats prompts for coding help

### Frontend Components

**1. InterfaceCode**
- Code editor interface
- Language selector
- Run/Submit functionality
- Test case display

**2. Dashboard**
- User statistics overview
- Progress tracking
- Recent submissions

**3. AIChatbot**
- Floating chat widget
- Context-aware AI assistance
- Markdown rendering

---

## 🚀
         │   PostgreSQL     │    │  Docker Engine   │
         │    Database      │    │  (Code Sandbox)  │
         └──────────────────┘    └──────────────────┘
```

### Key Components

1. **Frontend (React + Vite)**
   - Single Page Application (SPA)
   - Client-side routing
   - JWT token storage and management
   - API communication layer

2. **Backend (Spring Boot)**
   - RESTful API endpoints
   - JWT authentication filter
   - Business logic layer
   - Database abstraction

3. **Database (PostgreSQL)**
   - Stores users, problems, submissions, test cases
   - Flyway migrations for version control

4. **Code Execution Engine**
   - Docker-based sandboxed environment
   - Isolated container per execution
   - Language-specific Docker images
   - Timeout and memory constraints

---

## 💻 Prerequisites

Before you begin, ensure your system has:

### Required Software

| Software | Minimum Version | Check Command | Download Link |
|----------|----------------|---------------|---------------|
| Java JDK | 17+ | `java -version` | [Oracle JDK](https://www.oracle.com/java/technologies/downloads/) |
| Maven | 3.6+ | `mvn -version` | [Maven](https://maven.apache.org/download.cgi) |
| Node.js | 18+ | `node -v` | [Node.js](https://nodejs.org/) |
| npm | 9+ | `npm -v` | (comes with Node.js) |
| PostgreSQL | 12+ | `psql --version` | [PostgreSQL](https://www.postgresql.org/download/) |
| Docker Desktop | Latest | `docker --version` | [Docker](https://www.docker.com/products/docker-desktop/) |
| Git | Latest | `git --version` | [Git](https://git-scm.com/) |

### ⚠️ Important Notes

- **Docker Desktop is REQUIRED** for code execution functionality
- Ensure Docker Desktop is running before starting the backend
- Windows users: Use PowerShell or Git Bash for commands
- macOS users: May need to grant Docker access to filesystem

---
## 🚀 Quick Start

> 💡 **Get started in 5 minutes with Docker Compose!**

### Option 1: Docker Compose (Recommended)

```bash
# 1. Clone the repository
git clone <repository-url>
cd unicode-programming-practice

# 2. Copy environment configuration
cp .env.example .env

# 3. Start PostgreSQL database
docker-compose up -d postgres

# Wait for database to be ready (about 10 seconds)
# Check with: docker-compose ps

# 4. Start the backend (in project root)
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run

# 5. Start the frontend (in new terminal)
cd frontend
npm install
npm run dev
```

**Access the application:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Database: localhost:5432

### Option 2: Manual Setup

See [Installation](#-installation) section for detailed manual setup instructions.

### 🎯 Test the Application

1. **Register a new account** at http://localhost:5173/signup
2. **Login** with your credentials
3. **Browse problems** at http://localhost:5173/problems
4. **Solve a problem** and submit your code!

**Default test accounts** (if using backup.sql):
- Username: `testuser` / Password: `password123`

---

## 📦 Installation

### Step 1: Clone Repository

```bash
git clone <repository-url>
cd unicode-programming-practice
```

### Step 2: Database Setup

#### Using Docker Compose (Recommended)

```bash
# Start PostgreSQL container
docker-compose up -d postgres

# Verify it''s running
docker-compose ps

# View logs if needed
docker-compose logs postgres
```

The database will be automatically initialized with:
- Database name: `se_project`
- Username: `postgres`
- Password: `1`
- Port: `5432`

#### Manual PostgreSQL Installation

**Windows:**
1. Download PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer and note the password for `postgres` user
3. Add PostgreSQL bin directory to PATH

**macOS:**
```bash
# Using Homebrew
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

**Create Database:**
```bash
# Connect to PostgreSQL
psql -U postgres

# In psql console:
CREATE DATABASE se_project;
\q
```

**Restore backup data (optional):**
```bash
psql -U postgres -d se_project -f backup.sql
```

### Step 3: Backend Setup

```bash
# Navigate to project root
cd <project-root>

# Option A: Use Maven wrapper (recommended)
./mvnw clean install
# Windows: mvnw.cmd clean install

# Option B: Use system Maven
mvn clean install

# Run the application
./mvnw spring-boot:run
# Windows: mvnw.cmd spring-boot:run
```

**Verify backend is running:**
- Open http://localhost:8080/api/debug/health
- You should see: "Backend is running! ✅"

### Step 4: Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

**Verify frontend is running:**
- Open http://localhost:5173
- You should see the landing page

### Step 5: Docker Setup (For Code Execution)

Ensure Docker Desktop is installed and running:

```bash
# Check Docker installation
docker --version
docker ps
```

#### Build Custom Docker Images (Required)

The code execution service requires custom Docker images with the `time` package pre-installed for accurate memory tracking:

```bash
# Navigate to project root
cd <project-root>

# Build Python execution image
docker build -t unicode-python:latest -f docker/python.Dockerfile docker/

# Build Node.js execution image
docker build -t unicode-node:latest -f docker/node.Dockerfile docker/

# Build GCC (C++) execution image
docker build -t unicode-gcc:latest -f docker/gcc.Dockerfile docker/
```

#### Verify Images

```bash
# Check that all images are built
docker image ls

# You should see:
# unicode-python    latest    ...
# unicode-node      latest    ...
# unicode-gcc       latest    ...
```

**Test code execution:**
1. Login to the application
2. Navigate to any problem
3. Submit a solution
4. Verify execution results appear with runtime and memory usage

---

## ⚙️ Configuration

### Backend Configuration

Configuration file: `src/main/resources/application.properties`

```properties
# Server Configuration
server.port=8080

# Database Configuration
spring.datasource.url=jdbc:postgresql://localhost:5432/se_project
spring.datasource.username=postgres
spring.datasource.password=1

# JPA Configuration
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=false

# JWT Configuration
jwt.secret=MySuperSecretKeyMySuperSecretKeyMySuperSecretKey
jwt.expiration=86400000

# Flyway Migration
spring.flyway.enabled=true
spring.flyway.baseline-on-migrate=true

# Gemini AI Chatbot
# ⚠️ IMPORTANT: You MUST get your own API key from https://aistudio.google.com/
# The AI chatbot will NOT work without a valid API key
gemini.api.key=YOUR_GEMINI_API_KEY_HERE
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

### 🤖 Gemini AI API Key Setup (REQUIRED for AI Chatbot)

**⚠️ CRITICAL: The AI Chatbot feature requires your own Gemini API key**

The chatbot will not function without this configuration. Follow these steps:

**1. Get Your Free Gemini API Key:**
- Visit: https://aistudio.google.com/app/apikey
- Sign in with your Google account
- Click "Create API Key"
- Copy the generated key (starts with `AIza...`)

**2. Add to application.properties:**

Open `src/main/resources/application.properties` and replace:
```properties
gemini.api.key=YOUR_GEMINI_API_KEY_HERE
```

With your actual key:
```properties
gemini.api.key=AIzaSyC...YourActualKeyHere...
```

**3. Restart Backend:**
```bash
# Stop the backend (Ctrl+C)
# Restart it
./mvnw spring-boot:run
```

**4. Test AI Chatbot:**
- Open http://localhost:5173
- Login to the system
- Click the floating chat icon (bottom right)
- Send a message like "What is Unicode?"
- If configured correctly, you'll get an AI response

**Troubleshooting:**
- **No API key:** Chatbot returns "AI service is not configured"
- **Invalid key:** Check for typos, ensure no extra spaces
- **Rate limit:** Free tier has limits, wait and try again
- **Backend not restarted:** Changes require backend restart

**Note:** Keep your API key secure! Don't commit it to public repositories.

### Environment Variables

Create `.env` file from template:

```bash
cp .env.example .env
```

Edit `.env` to customize:

```env
# Database
SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/se_project
SPRING_DATASOURCE_USERNAME=postgres
SPRING_DATASOURCE_PASSWORD=your_password

# JWT
JWT_SECRET=YourSuperSecretKeyHere32CharactersMinimum
JWT_EXPIRATION=86400000

# Server
SERVER_PORT=8080

# Gemini AI (REQUIRED for chatbot feature)
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_API_URL=https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent
```

**⚠️ Security Best Practice:**
- Never commit API keys to version control
- Use environment variables or `.env` files (add to `.gitignore`)
- Rotate keys periodically
- Use different keys for development and production

### Frontend Configuration

Frontend uses environment variables with `VITE_` prefix.

Create `frontend/.env`:

```env
# API Base URL
VITE_API_URL=http://localhost:8080

# Other configurations (if needed)
VITE_APP_NAME=Unicode Programming Practice
```

**Note:** After changing `.env`, restart the dev server (`npm run dev`)

### Docker Configuration

Edit `docker-compose.yml` for custom Docker settings:

```yaml
services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: se_project
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: your_password
    ports:
      - "5432:5432"
```

---

## 📁 Project Structure

```
unicode-programming-practice/
├── src/main/java/com/Unicode/demo/
│   ├── config/              # Security and application configuration
│   │   └── SecurityConfig.java
│   ├── controller/          # REST API endpoints
│   │   ├── AuthController.java          # Login, Register
│   │   ├── ProblemController.java       # Problem CRUD
│   │   ├── SubmissionController.java    # Code submission
│   │   ├── TagController.java           # Problem tags
│   │   └── DebugController.java         # Health check
│   ├── dto/                 # Data Transfer Objects
│   │   ├── ProblemDto.java
│   │   ├── SubmitRequest.java
│   │   └── SubmitResponse.java
│   ├── entity/              # JPA Entities
│   │   ├── User.java
│   │   ├── Problem.java
│   │   ├── Submission.java
│   │   └── TestCase.java
│   ├── enums/               # Enumerations
│   │   ├── Difficulty.java
│   │   ├── Language.java
│   │   └── SubmissionStatus.java
│   ├── repository/          # Spring Data JPA Repositories
│   │   ├── UserRepository.java
│   │   ├── ProblemRepository.java
│   │   └── SubmissionRepository.java
│   ├── security/            # JWT Authentication
│   │   ├── JwtUtils.java
│   │   └── JwtAuthenticationFilter.java
│   ├── service/             # Business Logic
│   │   ├── ProblemService.java
│   │   ├── SubmissionService.java
│   │   ├── JudgeService.java            # Code execution orchestration
│   │   └── CodeExecutionService.java    # Docker-based execution
│   └── UnicodeApplication.java
├── src/main/resources/
│   ├── application.properties           # Application configuration
│   └── db/migration/                    # Flyway migrations
│       ├── V1__create_roles.sql
│       ├── V2__create_users.sql
│       ├── V4__create_problems.sql
│       └── V8__seed_sample_data.sql
├── frontend/
│   ├── src/
│   │   ├── pages/                       # React pages
│   │   │   ├── Start/                   # Landing page
│   │   │   ├── Login/                   # Login page
│   │   │   ├── SignUp/                  # Registration page
│   │   │   ├── ListExercise/            # Problem list
│   │   │   ├── problemDetail/           # Problem description
│   │   │   └── SpecifiedProblem/        # Code editor
│   │   ├── API/                         # API client services
│   │   │   ├── api-login.js
│   │   │   ├── api-problemdetail.js
│   │   │   └── api-submission.js
│   │   ├── utils/                       # Utility functions
│   │   │   └── auth.js                  # JWT token management
│   │   ├── assets/                      # Images and static files
│   │   ├── main.jsx                     # App entry point
│   │   └── index.css                    # Global styles
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── pom.xml                              # Maven dependencies
├── docker-compose.yml                   # Docker services
├── .env.example                         # Environment template
└── README.md                            # This file
```

---

## 📚 API Documentation

### Base URL
```
http://localhost:8080/api
```

### Authentication Endpoints

#### 1. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "message": "Đăng ký thành công!"
}
```

#### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "john_doe",
  "password": "securepass123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "username": "john_doe"
}
```

### Problem Endpoints

#### 3. Get All Problems (with filters)
```http
GET /api/problems?page=0&size=20&difficulty=EASY&tags=array&search=two
```

**Query Parameters:**
- `page` (default: 0) - Page number
- `size` (default: 20) - Items per page
- `difficulty` - Filter by difficulty (EASY, MEDIUM, HARD)
- `tags` - Filter by tags (array, string, dp, etc.)
- `search` - Search in title
- `sortBy` (default: createdAt) - Sort field
- `sortDirection` (default: DESC) - ASC or DESC

**Response:**
```json
{
  "content": [
    {
      "id": 1,
      "title": "Two Sum",
      "slug": "two-sum",
      "difficulty": "EASY",
      "acceptanceRate": 45.5,
      "tags": ["array", "hash-table"],
      "isPremium": false
    }
  ],
  "totalPages": 2,
  "totalElements": 30,
  "currentPage": 0,
  "pageSize": 20
}
```

#### 4. Get Problem Detail
```http
GET /api/problems/{slug}/detail?language=python
```

**Response:**
```json
{
  "id": 1,
  "title": "Two Sum",
  "slug": "two-sum",
  "description": "Given an array of integers...",
  "difficulty": "EASY",
  "examples": [...],
  "constraints": [...],
  "starterCode": "def twoSum(nums, target):\n    pass",
  "language": "python"
}
```

### Submission Endpoints

#### 5. Submit Code
```http
POST /api/submissions
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "problemId": 1,
  "code": "def twoSum(nums, target):\n    # solution",
  "language": "python"
}
```

**Response:**
```json
{
  "submissionId": 123,
  "status": "ACCEPTED",
  "runtime": 45,
  "memory": 14.2,
  "testResults": [
    {
      "testCaseNumber": 1,
      "passed": true,
      "input": "[2,7,11,15], target = 9",
      "expectedOutput": "[0,1]",
      "actualOutput": "[0,1]",
      "runtime": 15
    }
  ],
  "passedTests": 5,
  "totalTests": 5
}
```

#### 6. Get User Submissions
```http
GET /api/submissions/user/{userId}
Authorization: Bearer {jwt_token}
```

**Response:**
```json
[
  {
    "id": 123,
    "problemTitle": "Two Sum",
    "language": "python",
    "status": "ACCEPTED",
    "runtime": 45,
    "memory": 14.2,
    "submittedAt": "2024-01-20T10:30:00"
  }
]
```

### Error Responses

All endpoints may return error responses:

```json
{
  "message": "Error description",
  "status": 400
}
```

**Common Status Codes:**
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (missing/invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `500` - Internal Server Error

For complete API documentation, see [COMPLETE_API_TEST_GUIDE.md](COMPLETE_API_TEST_GUIDE.md)

---
