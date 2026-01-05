# 🚀 Quick Start Guide

Hướng dẫn nhanh để chạy **Unicode Programming Practice System** trong **5 phút**!

## 📋 Mục Lục
- [Yêu cầu tối thiểu](#-yêu-cầu-tối-thiểu)
- [Cách 1: Docker Compose (Khuyến nghị)](#-cách-1-docker-compose-khuyến-nghị---dễ-nhất)
- [Cách 2: Docker Compose với pgAdmin](#-cách-2-docker-compose-với-pgadmin-quản-lý-database)
- [Cách 3: Manual Setup](#-cách-3-manual-setup-không-dùng-docker-compose)
- [Kiểm tra hệ thống](#-kiểm-tra-hệ-thống)
- [Troubleshooting](#-troubleshooting-nhanh)
- [Tính năng chính](#-tính-năng-chính)
- [Tài khoản mặc định](#-tài-khoản-mặc-định)

---

## 📋 Yêu cầu tối thiểu

### Phần mềm bắt buộc:

| Phần mềm | Version | Mục đích | Link Download |
|----------|---------|----------|---------------|
| **Java JDK** | 17+ | Backend runtime | [Oracle](https://www.oracle.com/java/technologies/downloads/) |
| **Docker Desktop** | Latest | Code execution sandbox | [Docker](https://www.docker.com/products/docker-desktop/) |
| **Node.js** | 18+ | Frontend build tool | [Node.js](https://nodejs.org/) |
| **Maven** | 3.6+ | Build tool (included in project) | Auto-installed |

### ⚠️ Lưu ý quan trọng:

**🐳 Docker Desktop là BẮT BUỘC:**
- Hệ thống chạy code trong Docker containers độc lập
- Không có Docker = không thể submit code
- Docker phải được **khởi động TRƯỚC** khi start backend

**🔌 Kiểm tra ports:**
- `5432` - PostgreSQL database
- `8080` - Spring Boot backend
- `5173` - Vite frontend

**💻 Yêu cầu phần cứng:**
- RAM: Tối thiểu 4GB (khuyến nghị 8GB)
- Disk: 10GB trống
- OS: Windows 10/11, macOS 10.14+, hoặc Linux

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

### Bước 3: Cấu hình Gemini AI API Key (BẮT BUỘC cho AI Chatbot)

**⚠️ QUAN TRỌNG: Không có bước này, AI Chatbot sẽ không hoạt động!**

1. **Lấy API key miễn phí:**
   - Truy cập: https://aistudio.google.com/app/apikey
   - Đăng nhập với Google account
   - Click "Create API Key"
   - Copy key (bắt đầu với `AIza...`)

2. **Thêm vào application.properties:**
   ```bash
   # Mở file
   # Windows: notepad src/main/resources/application.properties
   # macOS/Linux: nano src/main/resources/application.properties
   
   # Tìm dòng:
   gemini.api.key=YOUR_GEMINI_API_KEY_HERE
   
   # Thay bằng key của bạn:
   gemini.api.key=AIzaSyC...YourKeyHere...
   ```

3. **Lưu file và tiếp tục**

### Bước 4: Chạy Backend

```bash
# Windows
mvnw.cmd spring-boot:run

# macOS/Linux
./mvnw spring-boot:run
```

### Bước 5: Chạy Frontend

Mở terminal mới:
```bash
cd frontend
npm install
npm run dev
```

### ✅ Hoàn tất!

Truy cập các địa chỉ sau:

| Service | URL | Mô tả |
|---------|-----|-------|
| **Frontend** | http://localhost:5173 | Giao diện người dùng |
| **Backend API** | http://localhost:8080 | REST API endpoints |
| **Database** | localhost:5432 | PostgreSQL (username: postgres, password: 1) |
| **API Health Check** | http://localhost:8080/api/debug/health | Kiểm tra backend |

**Tài khoản mặc định:**
- Admin: `admin` / `admin123`
- User: `testuser` / `password123`

**⚠️ Lưu ý về AI Chatbot:**
- Nếu không cấu hình Gemini API key, chatbot sẽ hiển thị: "AI service is not configured"
- Để chatbot hoạt động, xem lại [Bước 3](#bước-3-cấu-hình-gemini-ai-api-key-bắt-buộc-cho-ai-chatbot)

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

## ✅ Kiểm tra hệ thống

### 1. Kiểm tra Backend hoạt động

```bash
# Kiểm tra health endpoint
curl http://localhost:8080/api/debug/health

# Response mong đợi:
# System is running! Current timestamp: ...
```

### 2. Kiểm tra Database

```bash
# Kiểm tra container PostgreSQL
docker-compose ps postgres

# Kết nối vào database
docker exec -it unicode-postgres psql -U postgres -d se_project

# Trong psql:
\dt  # Xem danh sách tables
\q   # Thoát
```

### 3. Kiểm tra Frontend

Mở trình duyệt: http://localhost:5173

Bạn sẽ thấy trang chủ Unicode với:
- Hero section với nút "Get Started"
- Navigation bar
- Login/Signup options

### 4. Test Code Execution

1. Đăng ký/đăng nhập vào hệ thống
2. Vào `/problems` → Chọn bài "Two Sum"
3. Click "Solve" → Viết code
4. Click "Submit" → Xem kết quả

**Nếu submission thành công → Hệ thống hoạt động hoàn hảo! ✅**

---

## 🐛 Troubleshooting nhanh

### ❌ Lỗi: Port 8080 already in use

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

---

## 🎯 Tính năng chính

### 🔐 Authentication
- Đăng ký/đăng nhập với username & password
- OAuth2: Login với Google, GitHub, Facebook
- JWT token authentication (expiration: 24h)
- Role-based access control (USER, ADMIN)

### 📝 Problems
- 30+ bài tập coding đa dạng
- Filter theo difficulty: Easy, Medium, Hard
- Search và filter theo tags (Array, String, DP, Graph, etc.)
- Chi tiết bài tập với examples, constraints, test cases
- Category organization

### ⚡ Code Execution
- Hỗ trợ 3 ngôn ngữ: **C++, Python, JavaScript**
- Docker-based isolated sandbox (secure execution)
- Automated test case validation
- Real-time feedback với execution time & memory usage
- Multiple verdict statuses: ACCEPTED, WRONG_ANSWER, RUNTIME_ERROR, TIME_LIMIT_EXCEEDED

### 📊 Dashboard & Statistics
- Track progress: problems solved, acceptance rate
- Submission history với detailed results
- Statistics by difficulty (Easy/Medium/Hard)
- Personal performance metrics
- Streak tracking

### 🤖 AI Chatbot (UniCode Assistant)
- Gemini AI-powered coding assistant
- Context-aware help (biết bài đang làm, code hiện tại)
- Giải thích algorithms, data structures
- Debug code và suggest optimizations
- Website navigation help
- **⚠️ YÊU CẦU:** Phải có Gemini API key riêng (miễn phí) - [Lấy key tại đây](https://aistudio.google.com/app/apikey)

### 🛡️ Admin Panel (`/admin`)
- Create/Edit/Delete problems với rich text editor
- Manage users và roles
- View all submissions
- Platform statistics dashboard
- Test case management

---

## 👥 Tài khoản mặc định

Hệ thống đi kèm với các tài khoản test (từ `backup.sql`):

| Role | Username | Password | Quyền hạn |
|------|----------|----------|-----------|
| **Admin** | `admin` | `admin123` | Full access, manage problems & users |
| **User** | `testuser` | `password123` | Submit code, view problems |

**Lưu ý:** Đổi password ngay sau khi login lần đầu trong môi trường production!

---

## 🎓 Hướng dẫn sử dụng

### 🧑‍💻 Đối với User:

**1. Đăng ký/Đăng nhập**
```
→ http://localhost:5173/login
→ Hoặc signup tại http://localhost:5173/signup
→ Hoặc dùng OAuth2 (Google/GitHub/Facebook)
```

**2. Browse Problems**
```
→ http://localhost:5173/problems
→ Filter theo difficulty, tags
→ Search by problem name
```

**3. Solve a Problem**
```
→ Click "Solve" trên bài bất kỳ
→ Đọc description, examples, constraints
→ Chọn ngôn ngữ (C++/Python/JavaScript)
```

**4. Write & Test Code**
```
→ Viết code trong editor
→ Click "Run" để test với sample cases
→ Xem output, debug nếu cần
→ Sử dụng AI Chatbot để được giúp đỡ
```

**5. Submit for Evaluation**
```
→ Click "Submit" để chấm điểm
→ Hệ thống chạy full test cases
→ Xem kết quả: ACCEPTED/WRONG_ANSWER/RUNTIME_ERROR
→ Check execution time & memory usage
```

**6. View History**
```
→ http://localhost:5173/profile/submissions
→ Xem tất cả submissions
→ Filter theo status, problem
→ Review past code
```

### 🛡️ Đối với Admin:

**1. Login với Admin Account**
```
→ Username: admin
→ Password: admin123
```

**2. Access Admin Panel**
```
→ http://localhost:5173/admin
→ View platform statistics
→ Total users, problems, submissions
```

**3. Create New Problem**
```
→ Click "Create New Problem"
→ Fill in: title, slug, difficulty, description
→ Add constraints, examples
→ Set time/memory limits
→ Add tags (Array, String, etc.)
```

**4. Add Test Cases**
```
→ Navigate to problem
→ Add test cases with input/output
→ Mark sample test cases (visible to users)
→ Add hidden test cases for evaluation
```

**5. Manage Users**
```
→ View all users
→ Change roles (USER ↔ ADMIN)
→ View user statistics
```

---

## 📚 Tài liệu chi tiết

- **[README.md](README.md)** - Kiến trúc hệ thống, API documentation đầy đủ
- **[FRONTEND_SETUP.md](frontend/FRONTEND_SETUP.md)** - Hướng dẫn frontend development
- **[COMPLETE_API_TEST_GUIDE.md](COMPLETE_API_TEST_GUIDE.md)** - API testing guide
- **[WORKING_CODE_EXAMPLES.md](WORKING_CODE_EXAMPLES.md)** - Sample code solutions

---

## 🎯 Bước tiếp theo

### 👨‍💻 Cho Developer:

1. ✅ **Đọc kiến trúc hệ thống** trong [README.md](README.md)
2. ✅ **Hiểu flow charts** - Authentication, Code Execution, Problem Display
3. ✅ **Explore codebase:**
   - Backend: `src/main/java/com/Unicode/demo/`
   - Frontend: `frontend/src/`
4. ✅ **Thử modify code:**
   - Add new controller endpoint
   - Create new service method
   - Modify frontend component
5. ✅ **Study database schema** - Flyway migrations trong `src/main/resources/db/migration/`

### 🎓 Cho User/Learner:

1. ✅ **Bắt đầu với Easy problems** - Làm quen với interface
2. ✅ **Thử nhiều ngôn ngữ** - C++, Python, JavaScript
3. ✅ **Sử dụng AI Chatbot** - Học algorithms, debug code
4. ✅ **Track progress** - Xem Dashboard, monitor acceptance rate
5. ✅ **Challenge yourself** - Tiến tới Medium và Hard problems

---

## 🆘 Cần giúp đỡ?

### 🔍 Debug Checklist:

**Backend không start:**
- [ ] Docker Desktop đã chạy chưa?
- [ ] PostgreSQL container đã up chưa? (`docker-compose ps`)
- [ ] Port 8080 có bị conflict không?
- [ ] Java 17+ đã cài chưa? (`java -version`)

**Frontend không load:**
- [ ] Node.js 18+ đã cài chưa? (`node -v`)
- [ ] Đã chạy `npm install` chưa?
- [ ] Port 5173 có available không?
- [ ] Backend đã start chưa?

**Code submission fail:**
- [ ] Docker Desktop đang chạy?
- [ ] Backend logs có error gì không?
- [ ] JWT token còn valid không? (login lại)

**AI Chatbot không hoạt động:**
- [ ] Đã cấu hình Gemini API key chưa?
- [ ] API key có đúng format không? (bắt đầu với `AIza`)
- [ ] Đã restart backend sau khi thêm key chưa?
- [ ] Kiểm tra quota của free tier (có thể đã hết limit)
- [ ] Lấy key mới tại: https://aistudio.google.com/app/apikey

**Database connection error:**
- [ ] PostgreSQL container running? (`docker-compose ps postgres`)
- [ ] Credentials đúng trong `application.properties`?
- [ ] Port 5432 available?

### 📞 Liên hệ & Resources:

- **Mở issue** trên GitHub repository
- **Check logs:** Backend console, Browser console (F12)
- **Đọc error messages** cẩn thận - thường có gợi ý fix
- **Review README.md** - Troubleshooting section chi tiết

---

## 🎉 Chúc bạn coding vui vẻ!

**Happy Coding with Unicode!** 🚀

---

### 📊 Project Stats

- **Backend:** Spring Boot 4.0.0 + Java 17
- **Frontend:** React 19 + Vite 7
- **Database:** PostgreSQL 15
- **Code Execution:** Docker-based sandbox
- **AI Assistant:** Gemini 2.5 Flash
- **Authentication:** JWT + OAuth2

---

**Made with ❤️ by the Unicode Team**
