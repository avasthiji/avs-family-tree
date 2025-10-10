# Login Testing Guide - तुरंत लॉगिन कैसे करें

## ⚠️ Common Login Issues और Solutions

### Issue 1: "Invalid email/mobile or password" Error

**Possible Reasons:**
1. User नहीं है database में
2. Password गलत है  
3. Email/Mobile verification pending है
4. MongoDB चल नहीं रहा

**Solution:**

#### पहला कदम - Database में Users Check करें:
```bash
mongosh avs-family-tree --eval "db.users.find({}, {firstName:1, email:1, mobile:1}).pretty()"
```

#### दूसरा कदम - Test User बनाएं:

**Option A: Seed Database (Recommended):**
1. Browser में जाएं: `http://localhost:3000/seed`
2. "Seed Complete Family" button पर click करें
3. ये automatically admin और test users बना देगा

Default login credentials after seeding:
- **Admin User**: 
  - Email: `admin@example.com`
  - Mobile: `9876543210`
  - Password: `admin123`

**Option B: Register New User:**
1. जाएं: `http://localhost:3000/auth/register`
2. Fill करें:
   - First Name: `Test`
   - Last Name: `User`
   - Email: `test@example.com`
   - Password: `test1234`
3. OTP डालें: `123456` (development mode में)
4. Verify करें और auto-login होगा

### Issue 2: Login Button Click पर कुछ नहीं हो रहा

**Check करें:**
```bash
# Dev server चल रहा है?
ps aux | grep "next dev"

# If not running, start करें:
npm run dev
```

### Issue 3: "Unauthorized" या Blank Page

**Solution:**
1. Browser cache clear करें
2. Cookies delete करें
3. Private/Incognito window में try करें

### Issue 4: MongoDB Connection Error

```bash
# MongoDB status check करें:
mongosh --eval "db.adminCommand('ping')"

# If not running, start करें:
# macOS:
brew services start mongodb-community

# Linux:
sudo systemctl start mongod

# Windows:
net start MongoDB
```

## 🚀 Quick Login Test Steps

### Method 1: Using Seed Data (Fastest)

1. **Seed Database:**
   ```bash
   # Terminal में:
   npm run dev
   
   # Browser में:
   open http://localhost:3000/seed
   # "Seed Complete Family" button click करें
   ```

2. **Login करें:**
   ```
   Go to: http://localhost:3000/auth/login
   Email: admin@example.com
   Password: admin123
   ```

### Method 2: Register Fresh User

1. **Register:**
   ```
   Go to: http://localhost:3000/auth/register
   Email: yourname@test.com
   Password: test1234 (minimum 8 characters)
   ```

2. **Verify OTP:**
   ```
   OTP: 123456 (always in development)
   ```

3. **Auto-Login:**
   - Automatically logged in after OTP verification
   - Redirected to dashboard

### Method 3: Direct MongoDB Insert (For Testing)

```bash
# Create a test user directly
mongosh avs-family-tree

# In mongosh:
use avs-family-tree

db.users.insertOne({
  firstName: "Test",
  lastName: "User",
  email: "quick@test.com",
  mobile: "9999999999",
  password: "$2a$10$YourHashedPassword", // You need to hash this
  isEmailVerified: true,
  isMobileVerified: true,
  isApprovedByAdmin: true,
  role: "user",
  enableMarriageFlag: false,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🔍 Debug Login Issues

### Check Server Logs

```bash
# Terminal में dev server की logs देखें:
npm run dev

# Login try करें browser में
# Terminal में error messages check करें
```

### Check Browser Console

1. Browser में F12 press करें
2. Console tab open करें
3. Login button click करें
4. Red errors check करें

### Common Error Messages:

**"MONGODB_URI is not defined"**
- Solution: Check `.env.local` file exists
- Run: `cat .env.local | grep MONGODB_URI`

**"NEXTAUTH_SECRET is not defined"**
- Solution: Add to `.env.local`:
  ```bash
  NEXTAUTH_SECRET=your-secret-minimum-32-characters-long-string
  ```

**"Cannot connect to MongoDB"**
- Solution: Start MongoDB:
  ```bash
  mongosh  # Test connection
  ```

## ✅ Working Login Flow

1. **Start MongoDB** ✓
   ```bash
   mongosh  # Should connect successfully
   ```

2. **Start Dev Server** ✓
   ```bash
   npm run dev
   # Server should start on http://localhost:3000
   ```

3. **Seed Database (One time)** ✓
   ```bash
   # Go to: http://localhost:3000/seed
   # Click "Seed Complete Family"
   ```

4. **Login** ✓
   ```
   URL: http://localhost:3000/auth/login
   Email: admin@example.com
   Password: admin123
   ```

5. **Dashboard** ✓
   - Should redirect to `/dashboard`
   - See user profile and options

## 🆘 Still Not Working?

### Complete Reset:

```bash
# 1. Stop dev server (Ctrl+C)

# 2. Clear Next.js cache
rm -rf .next

# 3. Reset database
mongosh avs-family-tree --eval "db.users.deleteMany({})"

# 4. Rebuild
npm run dev

# 5. Seed database again
# Go to: http://localhost:3000/seed
```

### Environment Check:

```bash
# Check all required variables:
cat .env.local

# Should have at least:
# MONGODB_URI=mongodb://localhost:27017/avs-family-tree
# NEXTAUTH_URL=http://localhost:3000
# NEXTAUTH_SECRET=minimum-32-characters-long
```

## 📱 Test Credentials After Seeding

| Name | Email | Mobile | Password | Role |
|------|-------|--------|----------|------|
| Admin User | admin@example.com | 9876543210 | admin123 | admin |
| Raman | raman@example.com | 9876543211 | password123 | user |
| Subbu | subbu@example.com | 9876543212 | password123 | user |

## 🎯 Expected Behavior

**Successful Login:**
1. Click "Sign In" button
2. See loading spinner
3. Redirected to `/dashboard`
4. See user name in header

**Failed Login:**
1. Click "Sign In" button
2. See error message
3. Stay on login page
4. Check error message for reason

## 💡 Pro Tips

1. **Development Mode में OTP हमेशा:** `123456`
2. **Password minimum:** 8 characters
3. **Admin access के लिए:** Seed database या MongoDB में manually `role: "admin"` set करें
4. **Fresh start चाहिए?** Database drop करके फिर से seed करें

---

## Last Resort - Complete Fresh Start

```bash
# Kill everything
pkill -f "next dev"

# Clean everything
rm -rf .next
rm -rf node_modules/.cache

# Reset MongoDB
mongosh avs-family-tree --eval "db.dropDatabase()"

# Fresh install
npm install

# Start fresh
npm run dev

# Seed database
# Browser: http://localhost:3000/seed

# Login
# Browser: http://localhost:3000/auth/login
# Email: admin@example.com
# Password: admin123
```

---

## Contact/Help

If login still not working:
1. Check terminal logs for errors
2. Check browser console for errors
3. Verify MongoDB is running
4. Verify `.env.local` has correct values
5. Try incognito/private window

Login should work! 🎉

