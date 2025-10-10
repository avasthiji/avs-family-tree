# 👋 Welcome to AVS Family Tree!

## 🎉 Your project is ready!

---

## ⚡ Quick Start (Choose One)

### Option 1: Automated (Recommended)
```bash
./START.sh
```

### Option 2: Manual
```bash
npm run dev
```

Then visit: **http://localhost:3000/seed** to seed the database

---

## 📚 Documentation Guide

Choose the guide that fits your needs:

| File | Best For | What's Inside |
|------|----------|---------------|
| **[QUICK_START.md](QUICK_START.md)** | Getting started fast | 3-step setup, demo accounts |
| **[COMMANDS.md](COMMANDS.md)** | Command reference | All commands, troubleshooting |
| **[SETUP_GUIDE.md](SETUP_GUIDE.md)** | Detailed setup | Complete walkthrough |
| **[README.md](README.md)** | Project overview | Features, tech stack |

---

## 🔑 Demo Accounts (After Seeding)

```
Admin:      admin@avs.com / admin123
Matchmaker: matchmaker@avs.com / matchmaker123
User:       suresh.raman@email.com / password123
```

---

## 📍 Key URLs

- **Homepage**: http://localhost:3000
- **Login**: http://localhost:3000/auth/login
- **Admin**: http://localhost:3000/admin/dashboard
- **Seed**: http://localhost:3000/seed

---

## 🚀 First Time Setup

1. **Start the server**
   ```bash
   ./START.sh
   ```

2. **Seed the database**
   - Open: http://localhost:3000/seed
   - Click: "Seed Database"

3. **Login and explore**
   - Use: admin@avs.com / admin123

---

## ❓ Common Questions

### How do I start the project?
```bash
./START.sh
```

### Where do I seed the database?
Visit: http://localhost:3000/seed

### What are the demo accounts?
See the "Demo Accounts" section above

### How do I reset everything?
```bash
# Drop database
mongosh
> use avs-family-tree
> db.dropDatabase()

# Restart server
npm run dev
```

### Port 3000 is in use?
```bash
lsof -ti :3000 | xargs kill -9
```

---

## 🆘 Need Help?

1. **Quick fixes**: Check [QUICK_START.md](QUICK_START.md)
2. **All commands**: Check [COMMANDS.md](COMMANDS.md)
3. **Detailed setup**: Check [SETUP_GUIDE.md](SETUP_GUIDE.md)
4. **Troubleshooting**: Check [COMMANDS.md](COMMANDS.md) → Troubleshooting section

---

## ✅ What's Included

- ✅ Complete authentication system
- ✅ User profile management
- ✅ Admin dashboard
- ✅ Family tree visualization
- ✅ Database seeding
- ✅ 10 demo users
- ✅ AVS logo-inspired design
- ✅ Responsive layout
- ✅ Tamil language support

---

## 🎯 Quick Test

1. Start: `./START.sh`
2. Seed: http://localhost:3000/seed
3. Login: admin@avs.com / admin123
4. Explore: Admin dashboard, profile, family tree

---

## 📁 Project Structure

```
avs-family-tree/
├── START.sh              ← Run this first!
├── START_HERE.md         ← You are here
├── QUICK_START.md        ← Quick setup guide
├── COMMANDS.md           ← All commands
├── SETUP_GUIDE.md        ← Detailed guide
├── README.md             ← Project overview
├── .env.local            ← Environment config
├── src/                  ← Application code
│   ├── app/              ← Pages and routes
│   ├── components/       ← UI components
│   ├── lib/              ← Utilities
│   └── models/           ← Database models
└── public/               ← Static files
```

---

## 💡 Pro Tips

- Keep dev server running while working
- Use separate terminal for MongoDB commands
- Clear browser cache if you see old data
- Check `.env.local` if having connection issues

---

## 🎊 You're All Set!

Everything is configured and ready to go. Just run:

```bash
./START.sh
```

And start exploring! 🚀

---

**Built with ❤️ for the AVS Community**

*அகில இந்திய வேளாளர் சங்கம்*
