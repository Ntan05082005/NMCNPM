# Unicode Programming Practice System

Hệ thống luyện tập lập trình trực tuyến - SE Project

## 📋 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Công nghệ sử dụng](#công-nghệ-sử-dụng)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt](#cài-đặt)
  - [1. Clone Repository](#1-clone-repository)
  - [2. Cài đặt Database](#2-cài-đặt-database)
  - [3. Cài đặt Backend](#3-cài-đặt-backend)
  - [4. Cài đặt Frontend](#4-cài-đặt-frontend)
- [Chạy ứng dụng](#chạy-ứng-dụng)
- [Cấu hình](#cấu-hình)
- [API Documentation](#api-documentation)
- [Troubleshooting](#troubleshooting)

## 🎯 Giới thiệu

Unicode Programming Practice System là một nền tảng luyện tập lập trình trực tuyến, cho phép người dùng:
- Giải các bài toán lập trình với nhiều mức độ khó khăn
- Nộp và kiểm tra code với nhiều ngôn ngữ lập trình
- Xem lịch sử nộp bài và kết quả test case
- Quản lý bài tập theo tags và difficulty

## 🚀 Công nghệ sử dụng

### Backend
- **Java 17**
- **Spring Boot 4.0.0**
- **Spring Security** - Authentication & Authorization
- **JWT** - Token-based authentication
- **Spring Data JPA** - Database ORM
- **PostgreSQL** - Database
- **Flyway** - Database migration
- **Maven** - Build tool

### Frontend
- **React 19.2.0** - UI Library
- **Vite 7.2.4** - Build tool
- **React Router Dom 7.9.6** - Routing
- **Ant Design 6.0.0** - UI Components
- **Tailwind CSS 4.1.17** - Styling
- **Axios** - HTTP Client

## 💻 Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo máy tính của bạn đã cài đặt:

- **Java Development Kit (JDK) 17** hoặc cao hơn
  - Kiểm tra: `java -version`
- **Apache Maven 3.6+** (hoặc sử dụng Maven wrapper đã có trong project)
  - Kiểm tra: `mvn -version`
- **Node.js 18+** và **npm 9+**
  - Kiểm tra: `node -v` và `npm -v`
- **PostgreSQL 12+**
  - Kiểm tra: `psql --version`
- **Git**
  - Kiểm tra: `git --version`

## 📦 Cài đặt

### 1. Clone Repository

```bash
git clone <repository-url>
cd <project-directory>
```

### 2. Cài đặt Database

#### Bước 2.1: Cài đặt PostgreSQL

**Windows:**
- Download từ [postgresql.org](https://www.postgresql.org/download/windows/)
- Chạy installer và làm theo hướng dẫn
- Ghi nhớ password cho user `postgres`

**macOS:**
```bash
brew install postgresql@15
brew services start postgresql@15
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
```

#### Bước 2.2: Tạo Database

1. Mở PostgreSQL command line hoặc pgAdmin

**Windows/Linux:**
```bash
psql -U postgres
```

**macOS:**
```bash
psql postgres
```

2. Tạo database:
```sql
CREATE DATABASE se_project;
```

3. Kiểm tra database đã được tạo:
```sql
\l
```

4. Thoát:
```sql
\q
```

#### Bước 2.3: Cấu hình kết nối Database

Mở file `src/main/resources/application.properties` và cập nhật thông tin database của bạn:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/se_project
spring.datasource.username=postgres
spring.datasource.password=YOUR_PASSWORD_HERE
```

> **Lưu ý:** Thay `YOUR_PASSWORD_HERE` bằng password PostgreSQL của bạn.

### 3. Cài đặt Backend

#### Bước 3.1: Build project

Từ thư mục gốc của project:

**Windows:**
```bash
mvnw.cmd clean install
```

**macOS/Linux:**
```bash
./mvnw clean install
```

Hoặc nếu đã cài Maven globally:
```bash
mvn clean install
```

#### Bước 3.2: Flyway Migration

Database schema và sample data sẽ tự động được tạo khi chạy ứng dụng lần đầu tiên nhờ Flyway migration. Các migration files nằm trong `src/main/resources/db/migration/`.

### 4. Cài đặt Frontend

#### Bước 4.1: Di chuyển vào thư mục frontend

```bash
cd frontend
```

#### Bước 4.2: Cài đặt dependencies

```bash
npm install
```

#### Bước 4.3: Cấu hình environment

File `.env` đã có sẵn với cấu hình mặc định:

```env
VITE_API_URL=http://localhost:8080
```

> **Lưu ý:** Nếu backend chạy ở port khác, hãy cập nhật `VITE_API_URL` cho phù hợp.

## ▶️ Chạy ứng dụng

### Chạy Backend

Từ thư mục gốc của project:

**Option 1: Sử dụng Maven Wrapper**

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

**macOS/Linux:**
```bash
./mvnw spring-boot:run
```

**Option 2: Sử dụng Maven global**
```bash
mvn spring-boot:run
```

**Option 3: Chạy file JAR sau khi build**
```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

Backend sẽ chạy tại: `http://localhost:8080`

### Chạy Frontend

Mở terminal mới, di chuyển vào thư mục frontend:

```bash
cd frontend
npm run dev
```

Frontend sẽ chạy tại: `http://localhost:5173` (hoặc port khác nếu 5173 đã được sử dụng)

### Chạy đồng thời cả Backend và Frontend

**Option 1: Sử dụng 2 terminal**
- Terminal 1: Chạy backend như hướng dẫn trên
- Terminal 2: Chạy frontend như hướng dẫn trên

**Option 2: Background process (Linux/macOS)**
```bash
# Terminal 1: Backend
./mvnw spring-boot:run &

# Terminal 2: Frontend
cd frontend && npm run dev
```

## ⚙️ Cấu hình

### Backend Configuration

File: `src/main/resources/application.properties`

```properties
# Server Port
server.port=8080

# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/se_project
spring.datasource.username=postgres
spring.datasource.password=1

# JWT Configuration
jwt.secret=MySuperSecretKeyMySuperSecretKeyMySuperSecretKey
jwt.expiration=86400000  # 24 hours in milliseconds

# Flyway
spring.flyway.enabled=true
spring.flyway.validate-on-migrate=false
spring.flyway.baseline-on-migrate=true
```

### Frontend Configuration

File: `frontend/.env`

```env
VITE_API_URL=http://localhost:8080
```

## 📚 API Documentation

Sau khi chạy backend, các API endpoints có sẵn:

### Authentication
- `POST /api/auth/signup` - Đăng ký user mới
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/logout` - Đăng xuất

### Problems
- `GET /api/problems` - Lấy danh sách bài tập (có phân trang và filter)
- `GET /api/problems/{id}` - Lấy chi tiết bài tập
- `POST /api/problems` - Tạo bài tập mới (Admin)
- `PUT /api/problems/{id}` - Cập nhật bài tập (Admin)
- `DELETE /api/problems/{id}` - Xóa bài tập (Admin)

### Submissions
- `POST /api/submissions` - Nộp bài
- `GET /api/submissions` - Lấy danh sách submission
- `GET /api/submissions/{id}` - Lấy chi tiết submission

### Tags
- `GET /api/tags` - Lấy danh sách tags
- `POST /api/tags` - Tạo tag mới (Admin)

### Test Cases
- `GET /api/tests/problem/{problemId}` - Lấy test cases của bài tập

Chi tiết đầy đủ xem file: `COMPLETE_API_TEST_GUIDE.md` và `postman_collection.json`

## 🔨 Build cho Production

### Build Backend

```bash
mvn clean package -DskipTests
```

File JAR sẽ được tạo tại: `target/demo-0.0.1-SNAPSHOT.jar`

Chạy:
```bash
java -jar target/demo-0.0.1-SNAPSHOT.jar
```

### Build Frontend

```bash
cd frontend
npm run build
```

Files build sẽ nằm trong thư mục `frontend/dist/`

## 🐛 Troubleshooting

### Lỗi kết nối Database

**Lỗi:** `Connection refused` hoặc `database "se_project" does not exist`

**Giải pháp:**
1. Kiểm tra PostgreSQL đã chạy: `pg_isready` (Linux/macOS) hoặc kiểm tra Services (Windows)
2. Kiểm tra database đã được tạo: `psql -U postgres -l`
3. Kiểm tra username/password trong `application.properties`

### Lỗi Port đã được sử dụng

**Lỗi:** `Port 8080 is already in use` hoặc `Port 5173 is already in use`

**Giải pháp Backend:**
- Thay đổi port trong `application.properties`: `server.port=8081`
- Hoặc kill process đang dùng port 8080:
  - Windows: `netstat -ano | findstr :8080` rồi `taskkill /PID <PID> /F`
  - Linux/macOS: `lsof -ti:8080 | xargs kill -9`

**Giải pháp Frontend:**
- Vite sẽ tự động chọn port khác (5174, 5175, ...)
- Hoặc cấu hình trong `vite.config.js`

### Lỗi Maven build

**Lỗi:** `JAVA_HOME not set` hoặc `Java version mismatch`

**Giải pháp:**
1. Kiểm tra Java version: `java -version` (phải là Java 17+)
2. Set JAVA_HOME:
   - Windows: `set JAVA_HOME=C:\Path\To\JDK17`
   - Linux/macOS: `export JAVA_HOME=/path/to/jdk17`

### Lỗi npm install

**Lỗi:** `EACCES` permission denied

**Giải pháp:**
```bash
# Linux/macOS
sudo npm install -g npm@latest
# Hoặc sử dụng nvm để quản lý Node.js

# Windows: Chạy terminal as Administrator
```

### Lỗi Flyway Migration

**Lỗi:** `Flyway migration failed`

**Giải pháp:**
1. Xóa database và tạo lại:
```sql
DROP DATABASE se_project;
CREATE DATABASE se_project;
```
2. Hoặc reset Flyway metadata:
```sql
DELETE FROM flyway_schema_history;
```

### Lỗi CORS khi gọi API

**Lỗi:** `Access to XMLHttpRequest has been blocked by CORS policy`

**Giải pháp:**
- Kiểm tra backend có chạy không
- Kiểm tra `VITE_API_URL` trong frontend/.env
- Xem cấu hình CORS trong `SecurityConfig.java`

## 📝 Sample Accounts

Sau khi chạy migrations, có thể sử dụng các tài khoản mẫu (xem trong `V8__seed_sample_data.sql`):

Check file migration để biết username/password mặc định.


**Chúc bạn code vui vẻ! 🚀**
