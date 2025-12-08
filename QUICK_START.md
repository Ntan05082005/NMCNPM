# 🚀 Quick Start Guide

Hướng dẫn nhanh để chạy Unicode Programming Practice System trong 5 phút!

## 📋 Yêu cầu tối thiểu

- ✅ Java 17+
- ✅ Docker Desktop (đang chạy)
- ✅ Node.js 18+

## ⚡ Cách 1: Docker Compose (Khuyến nghị - Dễ nhất)

### Bước 1: Clone và setup

```bash
git clone <repository-url>
cd <project-directory>
```

### Bước 2: Start PostgreSQL với Docker Compose

```bash
docker-compose up -d postgres
```

Kiểm tra database đã chạy:
```bash
docker-compose ps
```

### Bước 3: Chạy Backend

```bash
# Windows
mvnw.cmd spring-boot:run

# macOS/Linux
./mvnw spring-boot:run
```

### Bước 4: Chạy Frontend

Mở terminal mới:
```bash
cd frontend
npm install
npm run dev
```

### ✅ Hoàn tất!

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080
- Database: localhost:5432

---

## 🐳 Cách 2: Docker Compose với pgAdmin (Quản lý database)

### Start tất cả services

Uncomment phần `pgadmin` trong `docker-compose.yml`, sau đó:

```bash
docker-compose up -d
```

Access:
- pgAdmin: http://localhost:5050
  - Email: admin@unicode.com
  - Password: admin

---

## 🔧 Cách 3: Manual Setup (Không dùng Docker Compose)

### Bước 1: Install PostgreSQL thủ công

Xem chi tiết trong [README.md](README.md#2-cài-đặt-database)

### Bước 2: Tạo database

```sql
CREATE DATABASE se_project;
```

### Bước 3: Cấu hình application.properties

Copy từ `.env.example` và điều chỉnh:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/se_project
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD
```

### Bước 4: Chạy backend & frontend

Giống như Cách 1, bước 3 & 4.

---

## 🎯 Test API nhanh

### 1. Register user

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

### 3. Get problems

```bash
curl http://localhost:8080/api/problems
```

---

## 🛑 Dừng services

### Docker Compose

```bash
docker-compose down
```

### Giữ lại database data

```bash
docker-compose down  # Không xóa volumes
```

### Xóa tất cả kể cả data

```bash
docker-compose down -v
```

---

## 🐛 Troubleshooting nhanh

### Lỗi: Port 8080 already in use

```bash
# Windows
netstat -ano | findstr :8080
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8080 | xargs kill -9
```

### Lỗi: Docker not running

1. Mở Docker Desktop
2. Đợi icon xanh lá
3. Chạy lại: `docker-compose up -d postgres`

### Lỗi: Cannot connect to database

```bash
# Kiểm tra database
docker-compose logs postgres

# Restart database
docker-compose restart postgres
```

### Reset database hoàn toàn

```bash
docker-compose down -v
docker-compose up -d postgres
./mvnw spring-boot:run  # Flyway sẽ tạo lại schema
```

---

## 📚 Tài liệu chi tiết

- [README.md](README.md) - Hướng dẫn đầy đủ
- [COMPLETE_API_TEST_GUIDE.md](COMPLETE_API_TEST_GUIDE.md) - API documentation
- [WORKING_CODE_EXAMPLES.md](WORKING_CODE_EXAMPLES.md) - Code examples

---

## 🎓 Sample Accounts

Sau khi migrations chạy, bạn có thể dùng:

Check file `backup.sql` để xem sample users:
- **Admin**: username: `admin`, password: `admin123`
- **User**: username: `testuser`, password: `password123`

---

**Happy Coding! 🚀**
