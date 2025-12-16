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

### 🎨 User Interface

- Modern React SPA with React Router v7
- Responsive design using Tailwind CSS v4
- Professional UI components with Ant Design v6
- Code editor integration for problem solving
- Real-time feedback on code execution
- Protected routes with authentication guards

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

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend (React)                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Pages   │  │   API    │  │  Utils   │  │  Assets  │   │
│  │          │  │  Layer   │  │          │  │          │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                             ↓ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                    Backend (Spring Boot)                     │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │ Controllers │→ │  Services   │→ │ Repositories │        │
│  └─────────────┘  └─────────────┘  └─────────────┘        │
│                          ↓                                   │
│                   ┌─────────────┐                           │
│                   │   Security  │                           │
│                   │  (JWT Auth) │                           │
│                   └─────────────┘                           │
└─────────────────────────────────────────────────────────────┘
                   ↓                        ↓
         ┌──────────────────┐    ┌──────────────────┐
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

# Pull required images (optional, will auto-pull on first use)
docker pull openjdk:17-slim
docker pull python:3.11-slim
docker pull gcc:latest
```

**Test code execution:**
1. Login to the application
2. Navigate to any problem
3. Submit a solution
4. Verify execution results appear

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
```

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
```

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
