# 🎨 Frontend Setup Guide

## ✅ What's Been Updated

### 1. **Merged NMCNPM-front-end-design → frontend**
- ✅ All files copied from NMCNPM-front-end-design to frontend folder
- ✅ React 19 + Vite + TailwindCSS + Ant Design
- ✅ Complete page structure ready

### 2. **Updated API Integration**
All API files now connect to **real backend** (localhost:8080) instead of MockAPI:

#### **Updated Files:**
- ✅ `frontend/src/API/api-problemdetail.js` - Problem and submission APIs
- ✅ `frontend/src/API/api-login.js` - Login API (already correct)
- ✅ `frontend/src/API/api-signup.js` - Signup API (updated)
- ✅ `frontend/src/API/api-test.js` - Test APIs (already correct)

#### **New Files:**
- ✅ `frontend/src/API/api-submission.js` - Dedicated submission API
- ✅ `frontend/src/utils/auth.js` - Authentication helper functions
- ✅ `frontend/.env` - Environment configuration

---

## 🚀 Quick Start

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Start Backend
```bash
# In root directory
./mvnw spring-boot:run
```

### Step 3: Start Frontend
```bash
# In frontend directory
npm run dev
```

### Step 4: Open Browser
```
http://localhost:5173
```

---

## 📂 Frontend Structure

```
frontend/
├── public/                  # Static assets
│   └── vite.svg
├── src/
│   ├── API/                 # API integration
│   │   ├── api-login.js     ✅ Login API
│   │   ├── api-signup.js    ✅ Signup API
│   │   ├── api-problemdetail.js  ✅ Problems & Submissions
│   │   ├── api-submission.js     ✅ Submission helpers
│   │   └── api-test.js      ✅ Test endpoints
│   ├── assets/              # Images, icons
│   ├── pages/               # React pages
│   │   ├── Start/           # Landing page
│   │   ├── Login/           # Login page
│   │   ├── SignUp/          # Signup page
│   │   ├── ListExercise/    # Exercise categories
│   │   ├── SpecifiedProblem/  # Problem list by difficulty
│   │   ├── problemDetail/   # Problem detail & code editor
│   │   └── Protected/       # Protected route example
│   ├── utils/               # Helper utilities
│   │   └── auth.js          ✅ Auth helpers
│   ├── main.jsx             # App entry point
│   └── index.css            # Global styles
├── .env                     ✅ Environment variables
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
└── index.html               # HTML template
```

---

## 🔌 API Integration Details

### **Environment Variables**
`.env`:
```bash
VITE_API_URL=http://localhost:8080
```

### **API Functions Available**

#### **Authentication (api-login.js, api-signup.js)**
```javascript
import { loginUser } from "./API/api-login";
import { registerUser } from "./API/api-signup";

// Login
const response = await loginUser({ username, password });
const { token, username } = response.data;
localStorage.setItem("jwt_token", token);

// Signup
await registerUser({ username, password, email });
```

#### **Problems (api-problemdetail.js)**
```javascript
import { 
  getAllProblems, 
  getProblemById, 
  getProblemBySlug,
  getAllTags 
} from "./API/api-problemdetail";

// Get all problems
const response = await getAllProblems({ 
  page: 0, 
  size: 10, 
  difficulty: "EASY",
  tags: "array,hash-table",
  search: "two sum"
});

// Get problem by ID
const problem = await getProblemById(1);

// Get problem by slug
const problem = await getProblemBySlug("two-sum");

// Get all tags
const tags = await getAllTags();
```

#### **Submissions (api-problemdetail.js or api-submission.js)**
```javascript
import { submitCode, getUserSubmissions } from "./API/api-submission";

// Submit code (requires JWT token in localStorage)
const result = await submitCode({
  problemId: 1,
  language: "python",
  code: "n = int(input())\nprint(n)"
});

console.log(result.data.status); // "ACCEPTED" or "WRONG_ANSWER"
console.log(result.data.testCasesPassed); // 4
console.log(result.data.totalTestCases); // 4

// Get user submissions
const submissions = await getUserSubmissions(userId);
```

#### **Test Endpoints (api-test.js)**
```javascript
import { callPublic, callProtected } from "./API/api-test";

// Public endpoint (no auth required)
await callPublic();

// Protected endpoint (requires JWT token)
await callProtected();
```

---

## 🎯 Pages to Update

### **Priority 1: High Priority - Need Updates**

#### 1. **problemDetail/index.jsx** 🔴
**Current:** Uses MockAPI for fetching problem details  
**Need:** Update to use real backend API

**Changes needed:**
```javascript
// OLD (MockAPI)
import { mockApi } from "../../API/api-problemdetail";
const response = await mockApi.get(`/problem/${id}`);

// NEW (Real Backend)
import { getProblemById, submitCode } from "../../API/api-problemdetail";

// Fetch problem
const response = await getProblemById(id);
const problem = response.data;

// Submit code
const result = await submitCode({
  problemId: id,
  language: selectedLanguage,
  code: userCode
});
```

#### 2. **SpecifiedProblem/index.jsx** 🔴
**Current:** May use MockAPI  
**Need:** Update to fetch problems by difficulty

**Changes needed:**
```javascript
import { getAllProblems } from "../../API/api-problemdetail";

const response = await getAllProblems({ 
  difficulty: "EASY",
  page: 0,
  size: 20 
});
const problems = response.data.content;
```

#### 3. **ListExercise/index.jsx** 🔴
**Current:** May use static data  
**Need:** Fetch from real API

**Changes needed:**
```javascript
import { getAllTags } from "../../API/api-problemdetail";

const response = await getAllTags();
const tags = response.data;
```

---

### **Priority 2: Already Working - Just Verify**

#### 4. **Login/index.jsx** ✅
Should already work with `api-login.js`

**Verify:**
```javascript
import { loginUser } from "../../API/api-login";

const response = await loginUser({ username, password });
localStorage.setItem("jwt_token", response.data.token);
```

#### 5. **SignUp/index.jsx** ✅
Should already work with updated `api-signup.js`

**Verify:**
```javascript
import { registerUser } from "../../API/api-signup";

await registerUser({ username, password, email });
```

---

## 🧪 Testing Frontend Integration

### Test 1: Health Check
```bash
# Open browser console on any page
fetch('http://localhost:8080/api/debug/health')
  .then(r => r.text())
  .then(console.log);

# Should output: "Application is running!"
```

### Test 2: Get Problems
```bash
fetch('http://localhost:8080/api/problems?page=0&size=5')
  .then(r => r.json())
  .then(console.log);

# Should return: { content: [...], totalElements: 10, ... }
```

### Test 3: Login Flow
1. Go to SignUp page → Register user
2. Go to Login page → Login
3. Check browser localStorage: `localStorage.getItem('jwt_token')`
4. Should see JWT token starting with "eyJ..."

### Test 4: Submit Code (After Login)
1. Login first
2. Go to problem detail page
3. Write code in editor
4. Click submit
5. Should see test results

---

## 🔧 Common Issues & Fixes

### Issue 1: CORS Error
**Error:** `Access to fetch at 'http://localhost:8080' blocked by CORS policy`

**Fix:** Backend already has CORS enabled in SecurityConfig, but verify:
```java
// SecurityConfig.java
.cors(Customizer.withDefaults())
```

### Issue 2: 403 Forbidden on Submit
**Error:** `403 Forbidden` when submitting code

**Fix:** Ensure JWT token is in localStorage:
```javascript
// In browser console
localStorage.getItem('jwt_token')

// If null, login again
```

### Issue 3: API Not Found
**Error:** `404 Not Found` for API calls

**Fix:** Check backend is running:
```bash
./mvnw spring-boot:run

# Verify in browser:
# http://localhost:8080/api/debug/health
```

### Issue 4: Environment Variables Not Working
**Error:** `VITE_API_URL` is undefined

**Fix:** Restart Vite dev server:
```bash
# Stop server (Ctrl+C)
# Start again
npm run dev
```

---

## 📝 Next Steps

1. ✅ **Install dependencies:** `cd frontend && npm install`
2. ✅ **Start backend:** `./mvnw spring-boot:run`
3. ✅ **Start frontend:** `npm run dev`
4. 🔴 **Update problemDetail page** to use real API
5. 🔴 **Update SpecifiedProblem page** to fetch from backend
6. 🔴 **Update ListExercise page** to use tags API
7. ✅ **Test login/signup flow**
8. ✅ **Test code submission**

---

## 🎉 Success Checklist

- [ ] Frontend starts without errors
- [ ] Backend running on :8080
- [ ] Can register new user
- [ ] Can login and receive JWT token
- [ ] Can view problem list
- [ ] Can view problem details
- [ ] Can submit code and see results
- [ ] Test results show ACCEPTED/WRONG_ANSWER correctly

---

## 📚 Additional Resources

- **Vite Docs:** https://vitejs.dev/
- **React Router:** https://reactrouter.com/
- **Ant Design:** https://ant.design/
- **Axios:** https://axios-http.com/
- **TailwindCSS:** https://tailwindcss.com/

---

**Frontend is now connected to real backend! 🚀**
