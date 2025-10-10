# 🚀 AVS Family Tree - Quick Start Guide

## ⚡ Super Quick Start (3 Steps)

### Step 1: Start Everything
```bash
./START.sh
```
*Or on Windows: double-click `START.bat`*

### Step 2: Seed Database
Open browser → http://localhost:3000/seed → Click "Seed Database"

### Step 3: Login and Explore
Login with: `admin@avs.com` / `admin123`

**That's it! You're ready to go! 🎉**

---

## 📋 Alternative: Manual Steps

### 1. Start MongoDB
```bash
# macOS
brew services start mongodb-community

# Windows
# Start MongoDB via MongoDB Compass or Services
```

### 2. Start Development Server
```bash
cd /Users/abhisheksaraswst/Desktop/familytreeavs/avs-family-tree
npm run dev
```

### 3. Seed Database
Visit: http://localhost:3000/seed
Click: "Seed Database"

---

## 🔑 Demo Accounts

| Email | Password | Role |
|-------|----------|------|
| admin@avs.com | admin123 | Admin |
| matchmaker@avs.com | matchmaker123 | Matchmaker |
| suresh.raman@email.com | password123 | User |
| vijay.mohan@email.com | password123 | Pending |

---

## 📍 Important URLs

- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/auth/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard
- **Profile**: http://localhost:3000/profile
- **Family Tree**: http://localhost:3000/family-tree
- **Seed Data**: http://localhost:3000/seed

---

## ❓ Having Issues?

### MongoDB Not Running?
```bash
brew services start mongodb-community
```

### Port 3000 Already in Use?
```bash
lsof -ti :3000 | xargs kill -9
```

### Need to Reset Everything?
```bash
# Drop database
mongosh
> use avs-family-tree
> db.dropDatabase()
> exit

# Clear cache
rm -rf .next

# Restart
npm run dev
```

---

## 📚 More Information

- **Full Commands**: See `COMMANDS.md`
- **Setup Guide**: See `SETUP_GUIDE.md`
- **Project Details**: See `README.md`

---

## 🎯 What to Test

### As Admin (admin@avs.com)
1. ✅ View dashboard statistics
2. ✅ Approve pending users
3. ✅ Manage all users
4. ✅ View reports

### As User (suresh.raman@email.com)
1. ✅ Edit profile
2. ✅ View family tree
3. ✅ Search for relatives
4. ✅ Add relationships

### As Pending User (vijay.mohan@email.com)
1. ✅ Login succeeds
2. ✅ Limited access until approved
3. ✅ Can complete profile

---

## 💡 Pro Tip

Keep the development server running in one terminal, and use a second terminal for other commands like seeding or MongoDB operations.

---

**Need help? Check COMMANDS.md for detailed instructions!**

*அகில இந்திய வேளாளர் சங்கம்*
