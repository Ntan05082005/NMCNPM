# 🌐 Coding Website - Backend API

A Spring Boot REST API for a coding practice platform with JWT authentication.

## ✨ Features Implemented

- ✅ User Registration with DTOs
- ✅ User Login with JWT Authentication
- ✅ Field Validation (username, email, password)
- ✅ BCrypt Password Hashing
- ✅ JWT Token Generation & Validation
- ✅ Default USER Role Assignment
- ✅ Duplicate Username/Email Detection
- ✅ PostgreSQL Database with Docker
- ✅ Timezone Support (Asia/Ho_Chi_Minh)

## 📋 Prerequisites

1. **Java 21** - [Download](https://adoptium.net/)
2. **Maven 3.9+** - [Download](https://maven.apache.org/download.cgi)
3. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)

## 🚀 Quick Start

### 1. Start PostgreSQL Database (Docker)

```bash
docker run --name cws-postgres -e POSTGRES_USER=testuser -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=cws -p 5432:5432 -d postgres:16
```

**Start existing container:**
```bash
docker start cws-postgres
```

### 2. Build & Run

```bash
mvn clean install
mvn spring-boot:run
```

✅ Server starts at: **http://localhost:8080**

---

## 📡 API Endpoints

### 1. Register User
**POST** `/api/auth/register`

**Request:**
```json
{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response (201 Created):**
```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "type": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

---

### 2. Login User
**POST** `/api/auth/login`

**Request:**
```json
{
  "username": "johndoe",
  "password": "password123"
}
```

**Response (200 OK):**
```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "type": "Bearer",
  "expiresIn": 86400000,
  "user": {
    "id": 1,
    "username": "johndoe",
    "email": "john@example.com",
    "role": "USER"
  }
}
```

**Invalid Credentials (403 Forbidden):**
```json
{
  "error": "Invalid username or password"
}
```

---

### 3. Using JWT Token for Protected Endpoints

Add the token to the Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzM4NCJ9...
```

---

## 🧪 Testing the API

### Using PowerShell

**Register:**
```powershell
$body = '{"username":"testuser","email":"test@example.com","password":"test123"}'
Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/register' -Method POST -ContentType 'application/json' -Body $body
```

**Login:**
```powershell
$body = '{"username":"testuser","password":"test123"}'
Invoke-RestMethod -Uri 'http://localhost:8080/api/auth/login' -Method POST -ContentType 'application/json' -Body $body
```

### Using Postman

1. Create POST request to `http://localhost:8080/api/auth/register`
2. Set header: `Content-Type: application/json`
3. Body (raw JSON):
   ```json
   {
     "username": "testuser",
     "email": "test@example.com",
     "password": "test123"
   }
   ```

**Login:**
- POST `http://localhost:8080/api/auth/login`
- Body:
   ```json
   {
     "username": "testuser",
     "password": "test123"
   }
   ```

### Query Database
```bash
docker exec -it cws-postgres psql -U testuser -d cws -c "SELECT * FROM users;"
```

---

## ✅ Validation Rules

| Field | Rules |
|-------|-------|
| **username** | 3-50 characters, required, unique |
| **email** | Valid email format, required, unique |
| **password** | Minimum 6 characters, required |

---

## 📁 Project Structure

```
src/main/java/com/codingwebsite/backend/
├── BackendApplication.java       # Main entry point
├── config/
│   └── SecurityConfig.java       # JWT & BCrypt configuration
├── controller/
│   └── AuthController.java       # Register & Login endpoints
├── dto/
│   ├── RegisterRequest.java      # Registration request DTO
│   ├── LoginRequest.java         # Login request DTO
│   ├── AuthResponse.java         # JWT token response DTO
│   └── UserDto.java              # User response DTO
├── entity/
│   └── User.java                 # JPA entity (implements UserDetails)
├── enums/
│   └── Role.java                 # User roles (USER, ADMIN)
├── repository/
│   └── UserRepository.java       # Spring Data JPA repository
├── security/
│   ├── JwtService.java           # JWT token generation/validation
│   ├── JwtAuthenticationFilter.java  # JWT request filter
│   └── CustomUserDetailsService.java # User loading for Spring Security
└── service/
    └── UserService.java          # Business logic

src/main/resources/
└── application.yml               # Application & JWT configuration
```

---

## 🗃️ Database Schema

| Column | Type | Constraints |
|--------|------|-------------|
| id | BIGSERIAL | PRIMARY KEY |
| username | VARCHAR(50) | UNIQUE, NOT NULL |
| email | VARCHAR(100) | UNIQUE, NOT NULL |
| password | VARCHAR(255) | NOT NULL (BCrypt hashed) |
| role | VARCHAR(20) | NOT NULL, DEFAULT 'USER' |
| created_at | TIMESTAMP | Auto-generated |
| updated_at | TIMESTAMP | Auto-updated |

---

## 🔒 Security Features

- **JWT Authentication** - Stateless token-based authentication
- **BCrypt Password Hashing** - Passwords encrypted with BCrypt
- **24-hour Token Expiration** - Configurable in application.yml
- **Field Validation** - Jakarta Bean Validation
- **Unique Constraints** - Database-level uniqueness
- **SQL Injection Protection** - JPA parameterized queries

---

## ⚙️ Configuration

JWT settings in `application.yml`:
```yaml
jwt:
  secret: CodingWebsiteSecretKey2024ForJWTTokenGenerationMustBeLongEnough256Bits
  expiration: 86400000  # 24 hours in milliseconds
```

---

## 📄 License

This project is part of the NMCNPM course.