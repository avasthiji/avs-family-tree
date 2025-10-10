# AVS Family Tree - Command Reference

## 🚀 Quick Start Commands

### One-Command Startup (Recommended)

```bash
# Make the startup script executable (first time only)
chmod +x START.sh

# Run the startup script
./START.sh
```

This script will:
- ✅ Check MongoDB status
- ✅ Start MongoDB if not running
- ✅ Install dependencies if needed
- ✅ Start the development server
- ✅ Show all demo account credentials

---

## 📋 Individual Commands

### 1. MongoDB Commands

#### Start MongoDB (macOS with Homebrew)
```bash
brew services start mongodb-community
```

#### Start MongoDB (Manual)
```bash
mongod --dbpath /path/to/your/data/directory
```

#### Check MongoDB Status
```bash
brew services list | grep mongodb
# OR
pgrep -x mongod
```

#### Stop MongoDB
```bash
brew services stop mongodb-community
```

#### Restart MongoDB
```bash
brew services restart mongodb-community
```

---

### 2. Project Setup Commands

#### Install Dependencies
```bash
cd /Users/abhisheksaraswst/Desktop/familytreeavs/avs-family-tree
npm install
```

#### Install Additional Packages
```bash
npm install <package-name>
```

---

### 3. Development Server Commands

#### Start Development Server
```bash
npm run dev
```
**Access at:** http://localhost:3000

#### Start with Custom Port
```bash
PORT=3001 npm run dev
```

#### Start in Production Mode
```bash
npm run build
npm start
```

---

### 4. Database Seeding Commands

#### Method 1: Web Interface (Recommended)
1. Start the dev server: `npm run dev`
2. Open browser: http://localhost:3000/seed
3. Click "Seed Database" button

#### Method 2: Command Line
```bash
npm run seed
```

#### Method 3: Direct API Call
```bash
curl -X POST http://localhost:3000/api/admin/seed \
  -H "Content-Type: application/json" \
  -d '{"secret": "avs-seed-secret-2024"}'
```

---

### 5. Build & Production Commands

#### Build for Production
```bash
npm run build
```

#### Start Production Server
```bash
npm start
```

#### Build and Start
```bash
npm run build && npm start
```

---

### 6. Code Quality Commands

#### Run Linter
```bash
npm run lint
```

#### Fix Linting Errors
```bash
npm run lint -- --fix
```

#### Type Check
```bash
npx tsc --noEmit
```

---

### 7. Database Management Commands

#### Connect to MongoDB Shell
```bash
mongosh
```

#### Use AVS Database
```bash
mongosh
> use avs-family-tree
> show collections
```

#### View Users Collection
```bash
mongosh
> use avs-family-tree
> db.users.find().pretty()
```

#### Count Documents
```bash
mongosh
> use avs-family-tree
> db.users.countDocuments()
> db.relationships.countDocuments()
> db.events.countDocuments()
```

#### Clear All Collections
```bash
mongosh
> use avs-family-tree
> db.users.deleteMany({})
> db.relationships.deleteMany({})
> db.otps.deleteMany({})
> db.events.deleteMany({})
```

#### Drop Database (Complete Reset)
```bash
mongosh
> use avs-family-tree
> db.dropDatabase()
```

---

### 8. Git Commands (If using version control)

#### Initialize Git Repository
```bash
git init
git add .
git commit -m "Initial commit: AVS Family Tree"
```

#### Add Remote and Push
```bash
git remote add origin <your-repository-url>
git branch -M main
git push -u origin main
```

---

## 🔑 Demo Accounts

After seeding the database, use these accounts:

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| **Admin** | admin@avs.com | admin123 | Full admin access |
| **Matchmaker** | matchmaker@avs.com | matchmaker123 | Matchmaking services |
| **User** | suresh.raman@email.com | password123 | Approved user |
| **Pending** | vijay.mohan@email.com | password123 | Pending approval |

---

## 📍 Important URLs

| Page | URL | Description |
|------|-----|-------------|
| **Landing** | http://localhost:3000 | Homepage |
| **Login** | http://localhost:3000/auth/login | User login |
| **Register** | http://localhost:3000/auth/register | New user registration |
| **Dashboard** | http://localhost:3000/dashboard | User dashboard |
| **Admin** | http://localhost:3000/admin/dashboard | Admin panel |
| **Profile** | http://localhost:3000/profile | User profile |
| **Family Tree** | http://localhost:3000/family-tree | Family relationships |
| **Seed Data** | http://localhost:3000/seed | Database seeding |

---

## 🐛 Troubleshooting Commands

### Clear Next.js Cache
```bash
rm -rf .next
npm run dev
```

### Clear Node Modules and Reinstall
```bash
rm -rf node_modules package-lock.json
npm install
```

### Check Port Usage
```bash
lsof -i :3000
```

### Kill Process on Port 3000
```bash
lsof -ti :3000 | xargs kill -9
```

### Check MongoDB Connection
```bash
mongosh --eval "db.adminCommand('ping')"
```

### View Environment Variables
```bash
cat .env.local
```

### Check MongoDB Logs (macOS Homebrew)
```bash
tail -f /opt/homebrew/var/log/mongodb/mongo.log
```

---

## 📦 Useful npm Scripts

```json
{
  "dev": "next dev --turbopack",           // Start dev server
  "build": "next build --turbopack",       // Build for production
  "start": "next start",                   // Start production server
  "lint": "eslint",                        // Run linter
  "seed": "tsx src/lib/seed-data.ts"       // Seed database
}
```

---

## 🔧 Common Workflows

### Full Reset and Restart
```bash
# 1. Stop the dev server (Ctrl+C)
# 2. Clear MongoDB
mongosh
> use avs-family-tree
> db.dropDatabase()
> exit

# 3. Clear Next.js cache
rm -rf .next

# 4. Restart
npm run dev

# 5. Reseed database
# Visit http://localhost:3000/seed
```

### Update Dependencies
```bash
npm update
npm audit fix
```

### Add New Component (shadcn/ui)
```bash
npx shadcn@latest add <component-name>
# Example: npx shadcn@latest add button
```

---

## 🚀 Deployment Commands

### Deploy to Vercel
```bash
npm install -g vercel
vercel login
vercel
```

### Build for Production (Manual Deploy)
```bash
npm run build
# Upload .next folder and other files to your server
```

---

## 📊 Database Seeding Details

### What Gets Created:
- **10 Users**: Admin, Matchmaker, 6 approved users, 2 pending users
- **3 Relationships**: Family connections between users
- **4 Events**: Community events

### Seed Data Includes:
- Complete user profiles with astrological details
- Gothiram, Rasi, Natchathiram information
- Contact details and addresses
- Professional information
- Profile pictures (external URLs)
- Family relationships
- Upcoming events

---

## 💡 Pro Tips

### Keep Development Server Running
Use two terminal windows:
```bash
# Terminal 1: Development server
npm run dev

# Terminal 2: Other commands
npm run seed
# OR
mongosh
```

### Watch for File Changes
Next.js automatically reloads on file changes when using `npm run dev`

### Environment Variables
Changes to `.env.local` require server restart

### Clear Browser Cache
Use incognito/private mode for testing, or clear cache regularly

---

## 🆘 Emergency Commands

### Hard Reset Everything
```bash
# Stop all servers
# Kill MongoDB
brew services stop mongodb-community

# Clear everything
rm -rf node_modules .next package-lock.json

# Drop database
mongosh
> use avs-family-tree
> db.dropDatabase()
> exit

# Start fresh
brew services start mongodb-community
npm install
npm run dev
```

---

## 📝 Notes

- Always ensure MongoDB is running before starting the dev server
- Port 3000 must be available
- MongoDB default port is 27017
- Seed data can be re-applied multiple times (it clears existing data)
- All passwords in demo data are hashed with bcrypt

---

## 🎉 Quick Test Workflow

```bash
# 1. Start everything
./START.sh

# 2. In browser, visit:
#    http://localhost:3000/seed

# 3. Click "Seed Database"

# 4. Login with:
#    admin@avs.com / admin123

# 5. Explore the application!
```

---

**Built with ❤️ for the AVS Community**

*அகில இந்திய வேளாளர் சங்கம்*
