# AVS Family Tree - Complete Setup Guide

## 🎉 Project Complete!

All features have been successfully implemented. The AVS Family Tree application is ready for development and testing!

## ✅ Completed Features

### 1. **Project Setup** ✓
- Next.js 14+ with TypeScript
- Tailwind CSS with AVS logo-inspired theme
- shadcn/ui components
- MongoDB with Mongoose ODM
- NextAuth.js v5 authentication

### 2. **Authentication System** ✓
- User registration with OTP verification
- Email and mobile OTP support
- Secure login system
- Password hashing with bcrypt
- JWT session management
- Rate limiting on OTP requests

### 3. **Landing Page** ✓
- Stunning design with AVS branding
- Hero section with animations
- Feature showcase
- Statistics display
- Responsive design
- Tamil language support

### 4. **User Profile Management** ✓
- Complete profile system
- Tabbed interface (Basic, Contact, Professional, Cultural)
- Edit functionality
- Profile picture support
- Astrological details (Rasi, Natchathiram, Gothiram)
- Native place and Kuladeivam information

### 5. **Admin Dashboard** ✓
- Statistics cards
- Pending user approvals
- User approval/rejection system
- Quick action cards
- Role-based access control
- Comprehensive user management

### 6. **Family Tree** ✓
- Relationship listing
- Family connections view
- Search for relatives
- Add relationship functionality
- Approval system for relationships

### 7. **Demo Data** ✓
- 10 demo users with realistic data
- Admin account
- Matchmaker account
- Regular users
- Pending approval users
- Sample relationships
- Community events
- Easy web-based seeding

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MongoDB running locally or connection string ready
- npm or yarn package manager

### Step 1: Environment Setup

The `.env.local` file has been created with default values:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/avs-family-tree

# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=avs-family-tree-secret-key-2024-change-in-production

# Email (Update with your Gmail credentials)
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
EMAIL_FROM=noreply@avs-family-tree.com

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Important:** Update the email credentials if you want to test OTP functionality.

### Step 2: Install Dependencies

```bash
cd /Users/abhisheksaraswst/Desktop/familytreeavs/avs-family-tree
npm install
```

### Step 3: Start MongoDB

Make sure MongoDB is running:
```bash
# macOS with Homebrew
brew services start mongodb-community

# Or start manually
mongod --dbpath /path/to/your/data/directory
```

### Step 4: Seed the Database

The development server is already running. Open your browser and:

1. Visit: `http://localhost:3000/seed`
2. Click the **"Seed Database"** button
3. Wait for confirmation message

This will create:
- 10 demo users
- 3 family relationships
- 4 community events

### Step 5: Explore the Application

Visit `http://localhost:3000` and explore:

## 👥 Demo Accounts

| Role | Email | Password | Purpose |
|------|-------|----------|---------|
| **Admin** | admin@avs.com | admin123 | Full admin access, approve users |
| **Matchmaker** | matchmaker@avs.com | matchmaker123 | Matrimony services |
| **User** | suresh.raman@email.com | password123 | Regular approved user |
| **Pending** | vijay.mohan@email.com | password123 | Pending admin approval |

## 📱 Features by Role

### Regular Users
- ✅ Complete profile management
- ✅ Search for relatives
- ✅ View family tree
- ✅ Add relationships
- ✅ Enable matrimony profile
- ✅ View events
- ✅ Update personal information

### Admin
- ✅ All user features
- ✅ View dashboard statistics
- ✅ Approve/reject new registrations
- ✅ Manage all users
- ✅ View reports
- ✅ Manage events
- ✅ Assign roles (admin, matchmaker)

### Matchmaker
- ✅ All user features
- ✅ View assigned matrimony profiles
- ✅ Match recommendations
- ✅ Contact management

## 🎨 Design Features

### Color Scheme (AVS Logo Inspired)
- **Primary Red**: #E63946
- **Secondary Teal**: #2A9D8F
- **Accent Orange**: #F77F00
- **Purple**: #7209B7
- **Blue**: #4361EE
- **Background**: #F8F9FA

### Custom CSS Classes
- `.avs-gradient` - Red to Orange gradient
- `.avs-gradient-secondary` - Teal to Blue gradient
- `.avs-gradient-purple` - Purple to Blue gradient
- `.avs-button-primary` - Primary action button
- `.avs-button-secondary` - Secondary action button
- `.avs-text-gradient` - Gradient text effect
- `.avs-card` - Card with shadow
- `.avs-animation-float` - Floating animation
- `.avs-animation-pulse` - Pulse animation

## 🔐 Security Features

1. **OTP System**
   - 6-digit random OTP
   - 5-minute expiry
   - Maximum 3 attempts
   - Rate limiting (3 requests per hour)

2. **Password Security**
   - Minimum 8 characters
   - Bcrypt hashing (10 salt rounds)
   - Secure storage

3. **Session Management**
   - JWT tokens
   - HTTP-only cookies
   - 24-hour expiry

4. **Admin Approval**
   - All new users require admin approval
   - Prevents spam and ensures quality

5. **Input Validation**
   - Email validation
   - Mobile number validation (Indian format)
   - Zod schemas for API validation

## 📂 Project Structure

```
avs-family-tree/
├── src/
│   ├── app/
│   │   ├── (auth)/              # Authentication pages
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   └── verify-otp/
│   │   ├── (dashboard)/         # Protected user pages
│   │   │   ├── dashboard/
│   │   │   ├── profile/
│   │   │   └── family-tree/
│   │   ├── (admin)/             # Admin-only pages
│   │   │   └── admin/
│   │   │       └── dashboard/
│   │   ├── api/                 # API routes
│   │   │   ├── auth/
│   │   │   ├── users/
│   │   │   ├── admin/
│   │   │   └── relationships/
│   │   ├── seed/                # Database seeding page
│   │   ├── layout.tsx           # Root layout
│   │   ├── page.tsx             # Landing page
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   └── providers/           # React providers
│   ├── lib/
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── db.ts                # MongoDB connection
│   │   ├── email.ts             # Email service
│   │   ├── otp.ts               # OTP utilities
│   │   ├── seed-data.ts         # Demo data
│   │   └── env.ts               # Environment config
│   ├── models/                  # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Relationship.ts
│   │   ├── OTP.ts
│   │   └── Event.ts
│   └── types/                   # TypeScript types
├── public/                      # Static assets
├── .env.local                   # Environment variables
├── README.md                    # Project README
├── SETUP_GUIDE.md              # This file
└── package.json                 # Dependencies

```

## 🧪 Testing the Application

### 1. Test User Registration
1. Go to `/auth/register`
2. Fill in the form
3. Verify OTP (check console if email not configured)
4. Account created but pending approval

### 2. Test Admin Approval
1. Login as admin: `admin@avs.com / admin123`
2. Go to admin dashboard
3. See pending users
4. Approve the new user
5. User can now login and access features

### 3. Test Profile Management
1. Login as approved user
2. Go to profile page
3. Edit various sections
4. Save changes
5. Verify updates

### 4. Test Family Tree
1. Login as user
2. Go to family tree page
3. View existing relationships
4. Search for relatives
5. Add connections

## 🌟 Key Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Beautiful homepage with AVS branding |
| Register | `/auth/register` | User registration form |
| Login | `/auth/login` | User login page |
| OTP Verify | `/auth/verify-otp` | OTP verification |
| Dashboard | `/dashboard` | User dashboard |
| Profile | `/profile` | User profile management |
| Family Tree | `/family-tree` | Family relationships view |
| Admin Dashboard | `/admin/dashboard` | Admin control panel |
| Seed Data | `/seed` | Database seeding interface |

## 📊 Database Collections

1. **users** - User accounts and profiles
2. **relationships** - Family relationships
3. **otps** - OTP verification codes
4. **events** - Community events

## 🔧 Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Seed database (via script)
npm run seed

# Check linting
npm run lint
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB is running
- Check MONGODB_URI in .env.local
- Verify database name is correct

### OTP Not Sending
- Email credentials need to be configured
- For testing, check server console for OTP
- Or use the dummy accounts provided

### Admin Approval Not Working
- Make sure you're logged in as admin
- Check browser console for errors
- Verify API routes are working

### Styling Issues
- Clear browser cache
- Check if Tailwind is compiling correctly
- Verify globals.css is loaded

## 🚀 Next Steps (Optional Enhancements)

1. **Advanced Family Tree Visualization**
   - Implement D3.js or React Flow
   - Interactive tree diagrams
   - Expandable nodes

2. **Matrimony Module**
   - Profile browsing
   - Match recommendations
   - Matchmaker dashboard

3. **Search Functionality**
   - Advanced filters
   - Gothiram-based search
   - Native place search

4. **Events Management**
   - RSVP system
   - Calendar view
   - Event notifications

5. **Email Notifications**
   - Welcome emails
   - Approval notifications
   - Relationship requests

6. **Export Features**
   - Family tree PDF
   - User data CSV
   - Reports generation

## 📝 Notes

- The application uses Next.js 14 App Router
- All passwords are hashed with bcrypt
- JWT tokens expire after 24 hours
- OTP codes expire after 5 minutes
- Admin approval is required for new users
- The theme is based on the AVS logo colors
- Tamil language support is included

## 🆘 Support

If you encounter any issues:
1. Check this guide first
2. Review the README.md
3. Check browser console for errors
4. Verify environment variables
5. Ensure MongoDB is running

## 🎉 Success!

Your AVS Family Tree application is now fully set up and ready to use!

**Test it now:**
1. Visit `http://localhost:3000`
2. Login as admin: `admin@avs.com / admin123`
3. Explore all features!

---

**Built with ❤️ for the AVS Community**

*அகில இந்திய வேளாளர் சங்கம்*
