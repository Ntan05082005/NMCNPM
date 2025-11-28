## ✨ Features Implemented

- ✅ User Registration with DTOs
- ✅ Field Validation (username, email, password)
- ✅ BCrypt Password Hashing
- ✅ Default USER Role Assignment
- ✅ Duplicate Username/Email Detection

## 📋 Requirement

1. **Java 21** - [Download](https://adoptium.net/)
2. **Maven 3.9+** - [Download](https://maven.apache.org/download.cgi)
3. **PostgreSQL 16+** - [Download](https://www.postgresql.org/download/)
4. **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)

## 🚀 Quick Start

### 1. Setup Database

```bash
# Start PostgreSQL and create database
psql -U postgres
CREATE DATABASE coding_website;
\q
```

### 2. Configure Application

Edit `src/main/resources/application.yml`:

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
      ddl-auto: update
    show-sql: true
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
# Build project
mvn clean install

# Run application
mvn spring-boot:run
```

Server starts at: **http://localhost:8080**

## 📡 API Endpoints

### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Success Response (201):**
```json
{
  "id": 1,
  "username": "johndoe",
  "email": "john@example.com",
  "role": "USER"
}
```

**Validation Error (400):**
```json
{
  "username": "Username must be between 3 and 50 characters",
  "email": "Email must be valid",
  "password": "Password must be at least 6 characters"
}
```

## 🧪 Testing

### Using cURL

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "test123"
  }'
```

### Using Postman

1. Import the endpoint: `POST http://localhost:8080/api/auth/register`
2. Set header: `Content-Type: application/json`
3. Add body with username, email, password
4. Send request

## 📁 Project Structure

```
src/main/java/com/codingwebsite/backend/
├── BackendApplication.java       # Main application
├── config/
│   └── SecurityConfig.java       # Security & BCrypt config
├── controller/
│   └── AuthController.java       # REST endpoints
├── dto/
│   ├── RegisterRequest.java      # Registration input
│   └── UserDto.java              # User response
├── entity/
│   └── User.java                 # Database entity
├── enums/
│   └── Role.java                 # USER, ADMIN roles
├── repository/
│   └── UserRepository.java       # Database operations
└── service/
    └── UserService.java          # Business logic
```

## 🔒 Security Features

- **BCrypt Password Hashing** - Passwords are never stored in plain text
- **Field Validation** - Input validation before processing
- **Unique Constraints** - Username and email must be unique
- **Default Role** - New users automatically get USER role