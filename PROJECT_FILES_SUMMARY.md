# 📁 Project Files Summary

Bản tóm tắt các file quan trọng trong Unicode Programming Practice System.

## 📄 Documentation Files

### README.md
- **Mục đích**: Hướng dẫn cài đặt và chạy project đầy đủ
- **Nội dung**:
  - Giới thiệu project và features
  - Yêu cầu hệ thống (Java 17, Node.js, PostgreSQL, Docker)
  - Hướng dẫn cài đặt chi tiết (2 options: Docker Compose hoặc Manual)
  - Kiến trúc Docker Sandbox & Bảo mật
  - API documentation overview
  - Troubleshooting guide
  - Sample accounts và data

### QUICK_START.md ⭐ NEW
- **Mục đích**: Hướng dẫn setup nhanh trong 5 phút
- **Nội dung**:
  - Quick start với Docker Compose
  - Quick start manual setup
  - Test API nhanh
  - Troubleshooting nhanh
  - Sample accounts

### COMPLETE_API_TEST_GUIDE.md
- **Mục đích**: Documentation đầy đủ về API endpoints
- **Nội dung**:
  - Authentication APIs (register, login)
  - Problem APIs (CRUD, filtering, pagination)
  - Submission APIs (submit code, view history)
  - Test & Debug APIs
  - Postman collection examples

### WORKING_CODE_EXAMPLES.md
- **Mục đích**: Code examples hoạt động cho tất cả problems
- **Nội dung**:
  - Working solutions cho Python, JavaScript, C++
  - Test cases và expected outputs
  - Docker image requirements
  - Security features
  - Performance notes

## ⚙️ Configuration Files

### .env.example ⭐ NEW
- **Mục đích**: Template cho backend environment variables
- **Nội dung**:
  - Database configuration
  - Server configuration
  - JWT configuration
  - Flyway configuration
  - Logging settings

### frontend/.env.example ⭐ NEW
- **Mục đích**: Template cho frontend environment variables
- **Nội dung**:
  - Backend API URL
  - Optional app configuration

### application.properties
- **Mục đích**: Spring Boot configuration (actual config)
- **Location**: `src/main/resources/application.properties`
- **Nội dung**:
  - Server port: 8080
  - PostgreSQL connection
  - JWT settings
  - Flyway migration settings

## 🐳 Docker Files

### docker-compose.yml ⭐ NEW
- **Mục đích**: Orchestrate services với Docker
- **Services**:
  - **postgres**: PostgreSQL 15 database
    - Port: 5432
    - Auto-load backup.sql on init
    - Persistent volume
  - **backend** (commented): Spring Boot application
  - **pgadmin** (commented): Database management UI
- **Networks**: unicode-network
- **Volumes**: postgres_data

### .dockerignore ⭐ NEW
- **Mục đích**: Exclude files khi build Docker images
- **Excludes**:
  - Git files, IDE configs
  - Build artifacts (target/, dist/)
  - Node modules
  - Environment files
  - Logs và temp files

## 💾 Database Files

### backup.sql ⭐ NEW
- **Mục đích**: Database backup và sample data
- **Nội dung**:
  - Sample users với BCrypt passwords
    - admin / admin123
    - testuser / password123
  - Comments về problems và test cases (created by Flyway)
  - Restore instructions
  - Database statistics query

### Flyway Migration Files
- **Location**: `src/main/resources/db/migration/`
- **Files**:
  - `V1__create_roles.sql` - User roles table
  - `V2__create_users.sql` - Users table
  - `V3__create_user_roles.sql` - User-role mapping
  - `V4__create_problems.sql` - Problems table
  - `V6__add_email_to_users.sql` - Add email field
  - `V7__enhance_problems_and_add_tags.sql` - Tags and problem enhancements
  - `V8__seed_sample_data.sql` - 10 sample problems
  - `V9__create_submissions_and_testcases.sql` - Submissions table
  - `V10__seed_test_cases.sql` - Test cases for problems

## 🔒 Security & Git Files

### .gitignore
- **Mục đích**: Exclude sensitive và generated files từ Git
- **Updated với**: ⭐ NEW
  - Environment files (`.env`, `.env.local`)
  - Database backups (`*.sql.backup`)
  - Temp files (`temp/`, `code_exec_*/`)
  - Docker override files

## 📦 Build & Dependency Files

### pom.xml
- **Mục đích**: Maven project configuration
- **Key Dependencies**:
  - Spring Boot 4.0.0
  - Spring Security + JWT (jjwt 0.12.3)
  - Spring Data JPA
  - PostgreSQL driver
  - Flyway migration
  - Lombok

### frontend/package.json
- **Mục đích**: Frontend dependencies và scripts
- **Key Dependencies**:
  - React 19.2.0
  - Vite 7.2.4
  - React Router 7.9.6
  - Ant Design 6.0.0
  - Tailwind CSS 4.1.17
  - Axios

## 📝 API & Testing Files

### postman_collection.json
- **Mục đích**: Postman collection cho API testing
- **Contains**: All API endpoints với examples

### POSTMAN_SUBMISSION_EXAMPLES.json
- **Mục đích**: Examples về code submissions
- **Contains**: Working code examples cho Postman

## 🏗️ Source Code Structure

```
src/main/java/com/Unicode/demo/
├── config/
│   └── SecurityConfig.java          # Spring Security + CORS
├── controller/
│   ├── AuthController.java          # Login, Register
│   ├── ProblemController.java       # Problem CRUD
│   ├── SubmissionController.java    # Submit code
│   ├── TagController.java           # Tags management
│   └── TestController.java          # Test cases
├── dto/                              # Data Transfer Objects
├── entity/                           # JPA Entities
│   ├── User.java
│   ├── Problem.java
│   ├── Submission.java
│   ├── TestCase.java
│   └── Tag.java
├── enums/
│   ├── Language.java                # PYTHON, JAVASCRIPT, CPP
│   ├── Difficulty.java              # EASY, MEDIUM, HARD
│   ├── Role.java                    # USER, ADMIN
│   └── SubmissionStatus.java        # ACCEPTED, WRONG_ANSWER, etc.
├── repository/                       # Spring Data JPA
├── security/
│   ├── JwtAuthenticationFilter.java # JWT validation
│   └── JwtUtils.java                # JWT generation
└── service/
    ├── CodeExecutionService.java    # 🐳 Docker sandbox execution
    ├── JudgeService.java            # Judge submissions
    ├── SubmissionService.java       # Submission logic
    ├── ProblemService.java          # Problem logic
    └── RuntimeCalculator.java       # Measure execution time
```

## 🎨 Frontend Structure

```
frontend/src/
├── API/                              # API calls
│   ├── api-login.js
│   ├── api-signup.js
│   ├── api-problemdetail.js
│   ├── api-submission.js
│   └── api-test.js
├── pages/                            # React pages
│   ├── Login/
│   ├── SignUp/
│   ├── ListExercise/
│   ├── problemDetail/
│   ├── SpecifiedProblem/
│   └── Start/
├── utils/
│   └── auth.js                      # Authentication utilities
└── main.jsx                         # App entry point
```

## 🔐 Security Features (Docker Sandbox)

Documented trong README.md:
- ✅ **Isolated Execution** - Mỗi submission trong container riêng
- ✅ **No Network Access** - `--network=none`
- ✅ **Timeout Protection** - 5 giây/test case
- ✅ **Read-only Code Mount** - Code không thể tự sửa
- ✅ **Automatic Cleanup** - Xóa temp files sau execution
- ✅ **JWT Authentication** - Chỉ authenticated users
- ✅ **Resource Limits** - Docker resource constraints

## 📊 Docker Images Used

- **python:3.11-slim** (~120 MB)
- **node:20-slim** (~170 MB)
- **gcc:13** (~1.2 GB)

## 🚀 Quick Command Reference

### Start with Docker Compose
```bash
docker-compose up -d postgres
./mvnw spring-boot:run
cd frontend && npm run dev
```

### Manual Database Setup
```bash
psql -U postgres
CREATE DATABASE se_project;
\q
```

### Restore Backup
```bash
docker exec -i unicode-postgres psql -U postgres -d se_project < backup.sql
```

### Stop Everything
```bash
docker-compose down
```

## 📌 Important Notes

1. **Docker Desktop is REQUIRED** - Code execution uses Docker containers
2. **Flyway migrations** run automatically on first startup
3. **Sample data** included in migrations (10 problems with test cases)
4. **JWT secret** should be changed in production
5. **Environment files** (`.env`) are gitignored for security
6. **Temp directories** (`code_exec_*`) are auto-cleaned after execution

## 🔄 Recent Updates

### New Files Added (This Session):
- ✅ `README.md` - Updated với Docker sandbox documentation
- ✅ `QUICK_START.md` - Quick setup guide
- ✅ `.env.example` - Backend environment template
- ✅ `frontend/.env.example` - Frontend environment template
- ✅ `docker-compose.yml` - Docker orchestration
- ✅ `.dockerignore` - Docker build exclusions
- ✅ `backup.sql` - Database backup và sample users
- ✅ `.gitignore` - Updated với environment và temp files

### Files Already Present:
- ✅ `COMPLETE_API_TEST_GUIDE.md`
- ✅ `WORKING_CODE_EXAMPLES.md`
- ✅ `postman_collection.json`
- ✅ `POSTMAN_SUBMISSION_EXAMPLES.json`
- ✅ Flyway migration files
- ✅ Complete source code (Backend + Frontend)

## 📚 Next Steps (Optional)

Consider adding these files in the future:
- `LICENSE` - Open source license
- `CONTRIBUTING.md` - Contribution guidelines
- `CHANGELOG.md` - Version history
- `Dockerfile` - For containerizing Spring Boot app
- `.github/workflows/` - CI/CD pipelines
- `docs/` - Additional documentation folder

---

**Project Status**: ✅ Ready for Development and Testing

**Last Updated**: 2025
