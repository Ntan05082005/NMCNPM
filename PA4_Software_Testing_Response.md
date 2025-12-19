# Unicode Programming Practice System - Software Testing

## 2. Test Plan

### Testing Approach Overview
Our testing strategy for the Unicode Programming Practice System encompasses multiple testing levels and techniques to ensure comprehensive coverage of the web-based coding practice platform.

### Testing Techniques to be Applied

**1. Functional Testing**
- **Unit Testing**: Individual backend service methods (ProblemService, SubmissionService, JudgeService)
- **Integration Testing**: API endpoint testing with database interactions
- **End-to-End Testing**: Complete user workflows from frontend to backend

**2. API Testing**
- **REST API Testing**: All endpoints (/api/auth, /api/problems, /api/submissions)
- **Authentication Testing**: JWT token validation and security
- **Input Validation Testing**: Request payload validation and error handling

**3. Frontend Testing**
- **User Interface Testing**: React component functionality and user interactions
- **Navigation Testing**: Router-based page transitions and URL handling
- **Form Validation Testing**: Login, signup, and code submission forms

**4. Security Testing**
- **Authentication & Authorization**: JWT implementation and role-based access
- **Input Sanitization**: Protection against injection attacks
- **CORS Configuration**: Cross-origin request handling

**5. Performance Testing**
- **Code Execution Testing**: Timeout and resource limit enforcement
- **Database Query Performance**: Pagination and filtering efficiency
- **Concurrent User Testing**: Multiple simultaneous submissions

### Testing Objects/Components

**Backend Components:**
- Authentication Controllers (AuthController)
- Problem Management (ProblemController, ProblemService)
- Submission Processing (SubmissionController, SubmissionService)
- Code Execution Engine (CodeExecutionService, JudgeService)
- Database Repositories and Data Models
- Security Configuration (JWT, CORS, Security filters)

**Frontend Components:**
- Authentication Pages (Login, SignUp)
- Problem Listing and Filtering (ListExercise)
- Problem Detail and Code Editor (ProblemDetail)
- API Integration Modules
- Routing and Navigation System

**System Integration:**
- Frontend-Backend API Communication
- Database Integration (PostgreSQL with Flyway migrations)
- File System Integration (for code execution environments)

### Testing Environment
- **Backend**: Spring Boot application on localhost:8080
- **Frontend**: React/Vite development server on localhost:5173
- **Database**: PostgreSQL container via Docker Compose
- **Tools**: Postman/curl for API testing, browser dev tools for frontend testing

## 3.1 List of Test Cases

| Seq | Test Case | Target | Description |
|-----|-----------|---------|-------------|
| 1 | User Registration Valid Data | AuthController.register() | Test successful user registration with valid username, email, password |
| 2 | User Registration Duplicate Username | AuthController.register() | Test registration failure when username already exists |
| 3 | User Login Valid Credentials | AuthController.login() | Test successful login with correct username/password |
| 4 | User Login Invalid Credentials | AuthController.login() | Test login failure with incorrect password |
| 5 | JWT Token Validation | JwtAuthenticationFilter | Test JWT token validation for protected endpoints |
| 6 | Get Problems List with Pagination | ProblemController.getProblems() | Test problem listing with page/size parameters |
| 7 | Get Problems with Difficulty Filter | ProblemController.getProblems() | Test filtering problems by difficulty level |
| 8 | Get Problem Detail by Slug | ProblemController.getProblemDetailBySlug() | Test retrieving problem details for coding interface |
| 9 | Submit Code Valid Solution | SubmissionController.submit() | Test code submission with correct solution |
| 10 | Submit Code Invalid Solution | SubmissionController.submit() | Test code submission with wrong answer |
| 11 | Submit Code Compilation Error | CodeExecutionService | Test handling of code that fails to compile |
| 12 | Submit Code Timeout | JudgeService | Test code execution timeout handling |
| 13 | Frontend Login Form Validation | Login Page Component | Test form validation on empty/invalid inputs |
| 14 | Frontend Problem List Display | ListExercise Component | Test problem list rendering and pagination controls |
| 15 | Frontend Code Editor Functionality | ProblemDetail Component | Test code editor, language selection, and submission |
| 16 | CORS Configuration | SecurityConfig | Test cross-origin requests from frontend to backend |

---

*This document provides the foundation for comprehensive testing of the Unicode Programming Practice System, covering both functional and non-functional requirements across all system components.*