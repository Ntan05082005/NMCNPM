# 🌐 Coding Website - Backend API

A Spring Boot REST API for a coding practice platform with user authentication and management.

## ✨ Features Implemented

- ✅ User Registration with DTOs
- ✅ Field Validation (username, email, password)
- ✅ BCrypt Password Hashing
- ✅ Default USER Role Assignment
- ✅ Duplicate Username/Email Detection
- ✅ PostgreSQL Database with Docker
- ✅ Timezone Support (Asia/Ho_Chi_Minh)

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

1. **Java 21** - [Download](https://adoptium.net/)
2. **Maven 3.9+** - [Download](https://maven.apache.org/download.cgi)
3. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/) *(Required for PostgreSQL 16)*

## 🚀 Quick Start

### 1. Start PostgreSQL Database (Docker)

Run PostgreSQL container with the following configuration:

```bash
docker run --name cws-postgres -e POSTGRES_USER=testuser -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=cws -p 5432:5432 -d postgres:16

```

**Verify the container is running:**
```bash
docker ps
```

### 2. Configure Application

The application is pre-configured in `src/main/resources/application.yml`:

```yaml
spring:
  application:
    name: coding-website-backend
  
  datasource:
    url: jdbc:postgresql://localhost:5432/cws?serverTimezone=Asia/Ho_Chi_Minh
    username: testuser
    password: 123456
    driver-class-name: org.postgresql.Driver
  
  jpa:
    hibernate:
      ddl-auto: update  # Auto-creates tables on startup
    show-sql: true      # Logs SQL queries
    properties:
      hibernate:
        dialect: org.hibernate.dialect.PostgreSQLDialect
        format_sql: true
        jdbc:
          time_zone: Asia/Ho_Chi_Minh

server:
  port: 8080
```

### 3. Build & Run

```bash
# Clean and build the project
mvn clean install

# Run the application
mvn spring-boot:run
```

✅ Server starts at: **http://localhost:8080**

## 📡 API Endpoints

### Register User

**Endpoint:** `POST /api/auth/register`

**Request:**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201 Created):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Validation Error (400 Bad Request):**
```json
{
  "username": "Username must be between 3 and 50 characters",
  "email": "Email must be valid",
  "password": "Password must be at least 6 characters"
}
```

**Duplicate Error (400 Bad Request):**
```json
{
  "error": "Username already exists"
}
```
or
```json
{
  "error": "Email already exists"
}
```

## 🧪 Testing the API

### Using Invoke-WebRequest

```bash
# Register a new user
Invoke-WebRequest -Uri "http://localhost:8080/api/auth/register" `
  -Method POST `
  -Headers @{"Content-Type"="application/json"} `
  -Body '{"username":"timezone_test","email":"timezone@test.com","password":"test123"}'
```

### Querry database
```bash
docker exec -it cws-postgres psql -U testuser -d cws -c "SELECT * FROM users;"
```

### Using Postman

1. Create a new POST request to `http://localhost:8080/api/auth/register`
2. Set header: `Content-Type: application/json`
3. In the Body tab, select "raw" and "JSON"
4. Add the request body:
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "test123"
   }
   ```
5. Click "Send"

### Validation Rules

| Field | Rules |
|-------|-------|
| **username** | 3-50 characters, required, must be unique |
| **email** | Valid email format, required, must be unique |
| **password** | Minimum 6 characters, required |

## 📁 Project Structure

```
src/main/java/com/codingwebsite/backend/
├── BackendApplication.java       # Main Spring Boot entry point
├── config/
│   └── SecurityConfig.java       # BCrypt password encoder configuration
├── controller/
│   └── AuthController.java       # REST API endpoints for authentication
├── dto/
│   ├── RegisterRequest.java      # User registration request DTO
│   └── UserDto.java              # User response DTO
├── entity/
│   └── User.java                 # JPA entity for users table
├── enums/
│   └── Role.java                 # User roles (USER, ADMIN)
├── repository/
│   └── UserRepository.java       # Spring Data JPA repository
└── service/
    └── UserService.java          # Business logic for user operations

src/main/resources/
└── application.yml               # Application configuration
```

## �️ Database Schema

The `users` table is automatically created with the following structure:

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (BCrypt hashed) |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'USER' |

## �🔒 Security Features

- **BCrypt Password Hashing** - Passwords are encrypted with BCrypt (strength 10)
- **Field Validation** - Input validation using Jakarta Bean Validation
- **Unique Constraints** - Database-level uniqueness for username and email
- **Default Role Assignment** - New users automatically receive the USER role
- **SQL Injection Protection** - JPA/Hibernate parameterized queries

## 📄 License

This project is part of the NMCNPM course.