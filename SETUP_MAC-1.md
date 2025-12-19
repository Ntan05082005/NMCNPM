# 🍎 Setup Guide for macOS - Unicode Programming Practice System

> **Hướng dẫn setup dự án từ đầu cho macOS**  
> Dành cho người mới clone project lần đầu và chưa cài đặt gì

---

## 📋 Yêu Cầu Hệ Thống

- macOS 10.15 (Catalina) hoặc mới hơn
- Kết nối Internet ổn định
- Tài khoản admin để cài đặt phần mềm

---

## 🚀 BƯỚC 1: Cài Đặt Homebrew (Package Manager)

Homebrew giúp cài đặt các công cụ developer dễ dàng.

### Kiểm tra đã có Homebrew chưa:
```bash
brew --version
```

### Nếu chưa có, cài đặt Homebrew:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

### Sau khi cài xong, chạy các lệnh này (Homebrew sẽ hiển thị):
```bash
echo 'eval "$(/opt/homebrew/bin/brew shellenv)"' >> ~/.zprofile
eval "$(/opt/homebrew/bin/brew shellenv)"
```

### Verify:
```bash
brew --version
# Nên hiển thị: Homebrew 4.x.x
```

---

## 🚀 BƯỚC 2: Cài Đặt Git

### Kiểm tra Git:
```bash
git --version
```

### Nếu chưa có:
```bash
brew install git
```

### Config Git (thay tên và email của bạn):
```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

---

## 🚀 BƯỚC 3: Clone Project

### Clone repository:
```bash
# Di chuyển đến thư mục bạn muốn lưu project
cd ~/Documents  # hoặc thư mục khác

# Clone project (thay YOUR_REPO_URL bằng URL thực tế)
git clone YOUR_REPO_URL
cd unicode-programming-system  # hoặc tên folder project của bạn
```

---

## 🚀 BƯỚC 4: Cài Đặt Java 17

### Cài Java Development Kit (JDK) 17:
```bash
brew install openjdk@17
```

### Tạo symlink cho Java:
```bash
sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
```

### Thêm Java vào PATH (thêm vào file ~/.zshrc):
```bash
echo 'export PATH="/opt/homebrew/opt/openjdk@17/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

### Verify Java:
```bash
java -version
# Nên hiển thị: openjdk version "17.x.x"

javac -version
# Nên hiển thị: javac 17.x.x
```

---

## 🚀 BƯỚC 5: Cài Đặt Maven (Build Tool)

Maven đã có sẵn trong project (`mvnw`), nhưng bạn có thể cài global:

```bash
brew install maven
```

### Verify:
```bash
mvn -version
# Nên hiển thị Maven 3.x.x và Java 17
```

---

## 🚀 BƯỚC 6: Cài Đặt Node.js & npm (Frontend)

### Cài Node.js (bản LTS):
```bash
brew install node
```

### Verify:
```bash
node --version
# Nên hiển thị: v20.x.x hoặc v18.x.x

npm --version
# Nên hiển thị: 10.x.x hoặc 9.x.x
```

---

## 🚀 BƯỚC 7: Cài Đặt Docker Desktop

### Download và cài Docker Desktop:
1. Truy cập: https://www.docker.com/products/docker-desktop/
2. Click **"Download for Mac"**
3. Chọn phiên bản phù hợp:
   - **Apple Silicon (M1/M2/M3)**: Chip Apple Silicon
   - **Intel Chip**: Intel processor

### Cài đặt:
1. Mở file `.dmg` đã download
2. Kéo Docker vào thư mục Applications
3. Mở Docker Desktop từ Applications
4. Đợi Docker khởi động (icon cá voi ở menu bar)

### Verify Docker:
```bash
docker --version
# Nên hiển thị: Docker version 24.x.x

docker-compose --version
# Nên hiển thị: Docker Compose version v2.x.x
```

### Test Docker:
```bash
docker run hello-world
# Nên thấy message "Hello from Docker!"
```

---

## 🚀 BƯỚC 8: Pull Docker Images (Quan Trọng!)

Pull các Docker images cần thiết để chạy code:

```bash
# Python image
docker pull python:3.11-slim

# Node.js image
docker pull node:20-slim

# GCC (C++) image
docker pull gcc:13

# PostgreSQL image
docker pull postgres:15-alpine
```

**Lưu ý:** Bước này có thể mất 5-10 phút tùy tốc độ mạng.

### Verify images:
```bash
docker images
# Nên thấy các images: python:3.11-slim, node:20-slim, gcc:13, postgres:15-alpine
```

---

## 🚀 BƯỚC 9: Setup Database (PostgreSQL)

### Khởi động PostgreSQL bằng Docker Compose:
```bash
# Đảm bảo bạn đang ở thư mục gốc project
pwd  # Kiểm tra đường dẫn

# Start PostgreSQL container
docker-compose up -d postgres
```

### Verify PostgreSQL đang chạy:
```bash
docker ps
# Nên thấy container: unicode-postgres

docker logs unicode-postgres
# Nên thấy: "database system is ready to accept connections"
```

### Kiểm tra connection:
```bash
docker exec -it unicode-postgres psql -U postgres -d se_project -c "SELECT 1;"
# Nên hiển thị: ?column? 
#                    1
```

---

## 🚀 BƯỚC 10: Setup Backend (Spring Boot)

### Di chuyển đến thư mục gốc project:
```bash
cd ~/Documents/unicode-programming-system  # Thay đường dẫn của bạn
```

### Cấu hình application.properties:
File `src/main/resources/application.properties` đã có sẵn config mặc định:
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/se_project
spring.datasource.username=postgres
spring.datasource.password=1
```

**Không cần sửa gì nếu dùng Docker Compose mặc định!**

### Build project (lần đầu sẽ download dependencies):
```bash
./mvnw clean install
```

**Lưu ý:** Lần đầu chạy có thể mất 3-5 phút để download Maven dependencies.

### Start backend server:
```bash
./mvnw spring-boot:run
```

**Đợi cho đến khi thấy:**
```
Started UnicodeApplication in X.xxx seconds
```

### Verify backend:
Mở browser hoặc dùng curl:
```bash
curl http://localhost:8080/api/problems/test
# Nên trả về: "ProblemController is accessible!"
```

**✅ Backend đang chạy trên: http://localhost:8080**

---

## 🚀 BƯỚC 11: Setup Frontend (React)

### Mở Terminal tab mới (giữ backend chạy ở tab cũ)
```bash
# Command + T để mở tab mới trong Terminal
```

### Di chuyển đến thư mục frontend:
```bash
cd ~/Documents/unicode-programming-system/frontend  # Thay đường dẫn của bạn
```

### Cài dependencies:
```bash
npm install
```

**Lưu ý:** Lần đầu chạy có thể mất 2-3 phút.

### Tạo file .env (nếu chưa có):
```bash
cp .env.example .env
```

### Sửa file .env (nếu cần):
```bash
nano .env
```

Nội dung mặc định:
```env
VITE_API_URL=http://localhost:8080
```

Nhấn `Ctrl+X`, sau đó `Y`, rồi `Enter` để lưu.

### Start frontend development server:
```bash
npm run dev
```

**Đợi cho đến khi thấy:**
```
  ➜  Local:   http://localhost:5173/
```

**✅ Frontend đang chạy trên: http://localhost:5173**

---

## 🎉 BƯỚC 12: Test Hệ Thống

### 1. Mở browser và truy cập:
```
http://localhost:5173
```

Bạn sẽ thấy trang chủ UniCode với hero image.

### 2. Test đăng ký tài khoản:
1. Click **"Sign Up"**
2. Nhập username, email, password
3. Click **"Create Account"**
4. Nên thấy message "Đăng ký thành công!"

### 3. Test login:
1. Click **"Login"**
2. Nhập username và password vừa tạo
3. Click **"Login"**
4. Nên được redirect về dashboard

### 4. Test xem problems:
1. Click **"Problems"** hoặc vào `/problems`
2. Nên thấy danh sách 6 categories
3. Click vào **"Algorithm & Data Structure Problems"**
4. Nên thấy list các bài tập

### 5. Test submit code:
1. Click vào một bài tập (ví dụ: "Two Sum")
2. Viết code Python:
```python
n = int(input())
nums = list(map(int, input().split()))
target = int(input())

for i in range(n):
    for j in range(i + 1, n):
        if nums[i] + nums[j] == target:
            print(i, j)
            break
```
3. Click **"Submit"**
4. Đợi kết quả (có thể mất 5-10 giây lần đầu vì Docker pull image)
5. Nên thấy kết quả: **"ACCEPTED"** hoặc test results

---

## 🐛 Troubleshooting - Xử Lý Lỗi Thường Gặp

### ❌ Lỗi: "docker: command not found"
**Nguyên nhân:** Docker chưa được cài hoặc chưa chạy.

**Giải pháp:**
1. Mở Docker Desktop từ Applications
2. Đợi Docker khởi động (icon cá voi ở menu bar)
3. Chạy lại lệnh

---

### ❌ Lỗi: "Connection refused to localhost:5432"
**Nguyên nhân:** PostgreSQL container chưa chạy.

**Giải pháp:**
```bash
docker-compose up -d postgres
docker ps  # Kiểm tra container đang chạy
```

---

### ❌ Lỗi: "Port 8080 already in use"
**Nguyên nhân:** Port 8080 đang được sử dụng bởi ứng dụng khác.

**Giải pháp:**
```bash
# Tìm process đang dùng port 8080
lsof -i :8080

# Kill process (thay PID bằng số hiển thị)
kill -9 PID
```

Hoặc thay đổi port trong `application.properties`:
```properties
server.port=8081
```

---

### ❌ Lỗi: "JAVA_HOME not set"
**Nguyên nhân:** Java chưa được config đúng.

**Giải pháp:**
```bash
# Thêm vào ~/.zshrc
echo 'export JAVA_HOME=$(/usr/libexec/java_home -v 17)' >> ~/.zshrc
source ~/.zshrc

# Verify
echo $JAVA_HOME
```

---

### ❌ Lỗi: "npm: command not found"
**Nguyên nhân:** Node.js chưa được cài.

**Giải pháp:**
```bash
brew install node
node --version
npm --version
```

---

### ❌ Lỗi: Docker "permission denied"
**Nguyên nhân:** Docker chưa có quyền truy cập.

**Giải pháp:**
```bash
sudo chmod 666 /var/run/docker.sock
```

Hoặc thêm user vào docker group:
```bash
sudo dscl . -append /Groups/_developer GroupMembership $(whoami)
```

---

### ❌ Lỗi: "Module not found" khi chạy frontend
**Nguyên nhân:** Dependencies chưa được cài đầy đủ.

**Giải pháp:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

---

### ❌ Lỗi: Code submission timeout
**Nguyên nhân:** Docker images chưa được pull.

**Giải pháp:**
```bash
# Pull lại các images
docker pull python:3.11-slim
docker pull node:20-slim
docker pull gcc:13

# Verify
docker images
```

---

## 📁 Cấu Trúc Thư Mục Sau Khi Setup

```
unicode-programming-system/
├── src/                          # Backend source code
│   └── main/
│       ├── java/                 # Java source files
│       └── resources/            # Config & migrations
├── frontend/                     # Frontend React app
│   ├── src/                      # React components
│   ├── node_modules/            # NPM dependencies (sau npm install)
│   └── package.json
├── target/                       # Build output (sau mvn clean install)
├── docker-compose.yml            # Docker config
├── pom.xml                       # Maven config
├── mvnw                          # Maven wrapper
└── README.md
```

---

## 🔧 Lệnh Hữu Ích

### Start toàn bộ hệ thống:
```bash
# Terminal 1: Start database
docker-compose up -d postgres

# Terminal 2: Start backend
./mvnw spring-boot:run

# Terminal 3: Start frontend
cd frontend && npm run dev
```

### Stop toàn bộ hệ thống:
```bash
# Stop frontend: Ctrl+C trong terminal

# Stop backend: Ctrl+C trong terminal

# Stop database
docker-compose down
```

### Xem logs:
```bash
# Backend logs: Tự động hiển thị trong terminal

# PostgreSQL logs
docker logs unicode-postgres

# Frontend logs: Tự động hiển thị trong terminal
```

### Reset database (nếu cần):
```bash
docker-compose down -v  # Xóa volumes
docker-compose up -d postgres  # Tạo lại database mới
```

### Clean build:
```bash
# Backend
./mvnw clean

# Frontend
cd frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎓 Học Thêm

### Tài liệu hữu ích:
- **Spring Boot:** https://spring.io/guides
- **React:** https://react.dev/
- **Docker:** https://docs.docker.com/get-started/
- **PostgreSQL:** https://www.postgresql.org/docs/

### Video tutorials:
- Homebrew: https://www.youtube.com/watch?v=SELYgZvAZbU
- Docker Desktop for Mac: https://www.youtube.com/watch?v=MU8HUVlJTEY
- Spring Boot: https://www.youtube.com/watch?v=9SGDpanrc8U

---

## ✅ Checklist Hoàn Thành Setup

- [ ] Homebrew đã cài (brew --version)
- [ ] Git đã cài (git --version)
- [ ] Java 17 đã cài (java -version)
- [ ] Node.js đã cài (node --version)
- [ ] Docker Desktop đã cài và đang chạy
- [ ] Docker images đã pull (python, node, gcc, postgres)
- [ ] PostgreSQL container đang chạy (docker ps)
- [ ] Backend đang chạy (http://localhost:8080)
- [ ] Frontend đang chạy (http://localhost:5173)
- [ ] Có thể đăng ký/login
- [ ] Có thể xem problems
- [ ] Có thể submit code và nhận kết quả

---

## 🎉 Hoàn Thành!

Chúc mừng! Bạn đã setup thành công hệ thống Unicode Programming Practice System trên macOS.

**Nếu gặp vấn đề:**
1. Đọc lại phần Troubleshooting
2. Check logs của từng service
3. Liên hệ team qua [email/slack/discord]

**Happy Coding! 🚀**
