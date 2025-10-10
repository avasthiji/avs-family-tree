# 🌳 AVS Family Tree Application

**Complete Family Tree & Matrimony Management System**  
*Connecting the Akhil Bharatiya Vellalar Sangam (AVS) Community*

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)](https://www.mongodb.com/)
[![React Flow](https://img.shields.io/badge/React%20Flow-11.0-purple)](https://reactflow.dev/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [User Roles](#user-roles)
- [Complete Workflows](#complete-workflows)
- [Technical Stack](#technical-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Authentication & Authorization](#authentication--authorization)
- [Features by Role](#features-by-role)
- [Screenshots](#screenshots)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)

---

## 🎯 Overview

The AVS Family Tree Application is a comprehensive digital platform designed to connect members of the Akhil Bharatiya Vellalar Sangam community. It combines traditional family tree management with modern matrimony services, enabling members to:

- **Build & Visualize** family trees with interactive diagrams
- **Connect** with relatives and community members
- **Find matches** through the integrated matrimony service
- **Preserve heritage** by documenting family history
- **Stay updated** with community events and news

### Key Highlights

- ✅ **Interactive Family Tree Visualization** - Beautiful graph-based family connections
- ✅ **Facebook-Style Search** - Find members by name, gothiram, or place
- ✅ **Relationship Management** - Add, edit, delete family relationships
- ✅ **Matrimony Service** - Profile matching within the community
- ✅ **Admin Dashboard** - Comprehensive user and content management
- ✅ **Multi-Role System** - Admin, Matchmaker, and User roles
- ✅ **Secure Authentication** - OTP-based verification with admin approval
- ✅ **Mobile Responsive** - Works seamlessly on all devices

---

## 🎨 Features

### Core Features

#### 1. **User Management**
- Email & mobile OTP verification
- Admin approval workflow for new users
- Detailed profile management (40+ fields)
- Profile pictures and avatars
- Gothiram (family clan) and native place tracking

#### 2. **Family Tree**
- Interactive visual tree with React Flow
- Multiple generations support (4+ levels)
- Hierarchical layout with clear parent-child relationships
- Drag, pan, and zoom capabilities
- Real-time relationship updates
- Export and share options

#### 3. **Relationship Management**
- 16+ relationship types (Father, Mother, Son, Daughter, Siblings, etc.)
- Add/Edit/Delete relationships
- Bidirectional relationship mapping
- Approval system for relationship verification
- Duplicate prevention
- Relationship descriptions and notes

#### 4. **Advanced Search**
- Real-time autocomplete search
- Multi-criteria filtering (Name, Gothiram, Place, Email, Mobile)
- Facebook-style dropdown results
- Status-based filtering (Admin only)
- Advanced search page with detailed results

#### 5. **Matrimony Service**
- Enable/disable matrimony profile
- Partner preferences and descriptions
- Bio and profile showcase
- Age, height, education, occupation filters
- Search within matrimony profiles
- Match suggestions (coming soon)

#### 6. **Admin Dashboard**
- User approval management
- Bulk approve/reject operations
- Multi-select functionality
- Statistics and analytics
- Reports generation
- Event management
- Content moderation

#### 7. **Events & Community**
- Community event listings
- Event registration
- Calendar integration
- Announcements and updates

---

## 👥 User Roles

### 1. **Admin** 👑
**Full System Access**

**Capabilities:**
- Approve/reject user registrations
- Manage all users and profiles
- View sensitive information (email, mobile)
- Access admin dashboard and reports
- Manage events and announcements
- Bulk operations on users
- Search all users (approved & pending)
- Edit/delete any relationship
- Generate reports and statistics

**Default Admin Account:**
- Email: `admin@avs.com`
- Password: `admin123`

---

### 2. **Matchmaker** 💝
**Matrimony Management**

**Capabilities:**
- View all matrimony profiles
- Search and filter profiles
- Suggest matches
- View extended profile information
- Contact details access (with permission)
- Help users find matches
- Generate match reports

**Use Case:** Dedicated community members who help facilitate marriages within the AVS community.

---

### 3. **Regular User** 👤
**Standard Member**

**Capabilities:**
- Create and manage personal profile
- Build family tree
- Add/edit/delete own relationships
- Search for approved community members
- Enable matrimony profile
- View own statistics
- Attend events
- Connect with family members

**Restrictions:**
- Cannot see pending users
- Cannot access admin features
- Cannot view email/mobile of others
- Requires admin approval to access full features

---

## 🔄 Complete Workflows

### 1. User Registration & Onboarding Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    NEW USER JOURNEY                          │
└─────────────────────────────────────────────────────────────┘

Step 1: Registration Page
   ↓ User enters: Email/Mobile + Personal Details + Password
   │
Step 2: OTP Verification
   ↓ System sends OTP (123456 in dev mode)
   │ User enters OTP
   │
Step 3: Auto-Login
   ↓ User automatically logged in after verification
   │
Step 4: Pending Approval Screen
   ↓ User redirected to /pending-approval
   │ Shows: "Account pending admin approval"
   │
Step 5: Admin Review
   ↓ Admin approves/rejects from dashboard
   │
Step 6: Full Access
   └→ User gets access to all features
```

**Timeline:**
- Registration: 2-3 minutes
- OTP Verification: Instant (dev) / 1-2 minutes (production)
- Admin Approval: Varies (manual process)

---

### 2. Family Tree Building Flow

```
┌─────────────────────────────────────────────────────────────┐
│                 FAMILY TREE CREATION                         │
└─────────────────────────────────────────────────────────────┘

Step 1: Dashboard
   ↓ Click "My Relationships" or "Family Tree"
   │
Step 2: Relationships Page (/relationships)
   ↓ Click "Add Relationship"
   │
Step 3: Search Family Member
   ↓ Use integrated search bar
   │ Search by name, gothiram, or place
   │ Select from dropdown results
   │
Step 4: Define Relationship
   ↓ Select relationship type (Father, Mother, etc.)
   │ Add optional description/notes
   │
Step 5: Save
   ↓ Relationship created
   │ Auto-approved if created by admin
   │
Step 6: View Tree
   └→ Go to Family Tree page
      Interactive visual appears instantly
```

**Features:**
- Real-time search with autocomplete
- 16 relationship types
- Duplicate prevention
- Bidirectional mapping
- Visual tree updates automatically

---

### 3. Search & Discovery Flow

```
┌─────────────────────────────────────────────────────────────┐
│                  MEMBER SEARCH FLOW                          │
└─────────────────────────────────────────────────────────────┘

Method 1: Quick Search (Dashboard)
   ↓ Type in search bar (min 2 characters)
   │ Results appear in dropdown (300ms debounce)
   │ Click user to see details
   └→ Profile information displayed

Method 2: Advanced Search (/search)
   ↓ Navigate to search page
   │ Use filters: All, Name, Gothiram, Place
   │ Admin: Additional Email, Mobile, Status filters
   │ View detailed results
   └→ Click user for full profile card

Method 3: Matrimony Search
   ↓ Go to Matrimony page
   │ Filter by: Age, Height, Education, Location
   │ View active matrimony profiles only
   └→ Contact through matchmaker or direct
```

**Search Capabilities:**
- **Users:** 20 results max
- **Admins:** 50 results max
- **Debounce:** 300ms
- **Indexed Fields:** Email, Mobile, Gothiram, Native Place

---

### 4. Admin Approval Workflow

```
┌─────────────────────────────────────────────────────────────┐
│                  ADMIN APPROVAL PROCESS                      │
└─────────────────────────────────────────────────────────────┘

Step 1: Admin Dashboard
   ↓ Login as admin
   │ View "Pending Approvals" section
   │
Step 2: Review User
   ↓ See user details:
   │ - Name, Email, Mobile
   │ - Gothiram, Native Place
   │ - Registration date
   │ - Verification status
   │
Step 3: Decision
   ├─→ Approve
   │     ↓ User gets full access
   │     │ Email notification sent
   │     └→ User can access all features
   │
   └─→ Reject
         ↓ User denied access
         │ Email notification sent
         └→ User can re-register

Step 4: Bulk Operations (Optional)
   ↓ Select multiple users (checkbox)
   │ Click "Approve Selected" or "Reject Selected"
   └→ All selected users processed at once
```

---

### 5. Matrimony Profile Creation

```
┌─────────────────────────────────────────────────────────────┐
│              MATRIMONY PROFILE SETUP                         │
└─────────────────────────────────────────────────────────────┘

Step 1: Profile Page
   ↓ Navigate to /profile
   │
Step 2: Personal Information (Required)
   ↓ Fill basic details:
   │ - Name, DOB, Gender, Height
   │ - Education, Occupation, Salary
   │ - Photos
   │
Step 3: About Me Tab
   ↓ Write bio and partner preferences:
   │ - Bio Description (500 chars)
   │ - Partner Description (500 chars)
   │ - Enable Matrimony Flag ✓
   │
Step 4: Additional Details
   ↓ Complete profile:
   │ - Gothiram, Rasi, Natchathiram
   │ - Native Place, Current Location
   │ - Contact Information
   │
Step 5: Save & Activate
   └→ Profile visible in matrimony search
      Matchmaker can suggest matches
```

---

## 🛠 Technical Stack

### Frontend
- **Framework:** Next.js 15.5.4 (App Router)
- **Language:** TypeScript
- **UI Library:** React 19
- **Styling:** Tailwind CSS
- **Components:** Shadcn/UI
- **Family Tree:** React Flow 11.0
- **Forms:** React Hook Form
- **State:** React Context + Hooks
- **Icons:** Lucide React
- **Notifications:** Sonner (Toast)

### Backend
- **Runtime:** Node.js 20+
- **API:** Next.js API Routes
- **Database:** MongoDB with Mongoose
- **Authentication:** NextAuth.js v5
- **Password Hashing:** bcryptjs
- **Email:** Nodemailer
- **OTP:** Crypto (Node.js)
- **Validation:** Zod

### DevOps & Tools
- **Package Manager:** npm
- **Build Tool:** Next.js (Turbopack)
- **Linting:** ESLint
- **Version Control:** Git
- **Environment:** dotenv

### Key Libraries
```json
{
  "next": "15.5.4",
  "react": "19.0.0",
  "next-auth": "^5.0.0-beta.22",
  "mongoose": "^8.8.4",
  "reactflow": "^11.11.4",
  "tailwindcss": "^3.4.1",
  "@radix-ui/react-*": "Latest",
  "bcryptjs": "^2.4.3",
  "nodemailer": "^6.9.16",
  "zod": "^3.23.8"
}
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js:** 20.x or higher
- **MongoDB:** 6.0 or higher (local or Atlas)
- **npm:** 10.x or higher
- **Email Account:** For OTP (optional in dev mode)

### Installation

1. **Clone the Repository**
   ```bash
cd /Users/abhisheksaraswst/Desktop/familytreeavs
   cd avs-family-tree
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**

Create `.env.local` file:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/avs-family-tree
   
# NextAuth
NEXTAUTH_SECRET=your-secret-key-min-32-characters-long
   NEXTAUTH_URL=http://localhost:3000
   
# Email (Optional in dev)
   EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Development
NODE_ENV=development
NEXT_PUBLIC_USE_TEST_OTP=true
```

4. **Seed Database**
```bash
# Seed complete family tree (10 users, 24 relationships)
npx tsx src/lib/seed-complete-family.ts

# Or seed basic data
npx tsx src/lib/seed-data.ts
```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

6. **Access Application**
- **URL:** http://localhost:3000
- **Admin:** admin@avs.com / admin123
- **Main User:** arun.ramesh@avs.com / password123

---

## 📁 Project Structure

```
avs-family-tree/
├── src/
│   ├── app/                          # Next.js App Router
│   │   ├── (pages)/
│   │   │   ├── dashboard/            # User dashboard
│   │   │   ├── profile/              # User profile page
│   │   │   ├── family-tree/          # Family tree visualization
│   │   │   ├── relationships/        # Relationship management
│   │   │   ├── search/               # Advanced search
│   │   │   ├── matrimony/            # Matrimony profiles
│   │   │   └── pending-approval/     # Pending approval screen
│   │   ├── admin/
│   │   │   ├── dashboard/            # Admin dashboard
│   │   │   └── reports/              # Admin reports
│   │   ├── auth/
│   │   │   ├── login/                # Login page
│   │   │   ├── register/             # Registration page
│   │   │   └── verify-otp/           # OTP verification
│   │   ├── api/                      # API Routes
│   │   │   ├── auth/                 # Authentication APIs
│   │   │   ├── users/                # User management APIs
│   │   │   ├── relationships/        # Relationship APIs
│   │   │   ├── search/               # Search APIs
│   │   │   └── admin/                # Admin APIs
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Landing page
│   │   └── globals.css               # Global styles
│   ├── components/
│   │   ├── ui/                       # Shadcn/UI components
│   │   ├── providers/                # Context providers
│   │   ├── FamilyTreeView.tsx        # Family tree component
│   │   └── SearchBar.tsx             # Search component
│   ├── lib/
│   │   ├── auth.ts                   # NextAuth configuration
│   │   ├── db.ts                     # MongoDB connection
│   │   ├── email.ts                  # Email utilities
│   │   ├── otp.ts                    # OTP generation
│   │   ├── utils.ts                  # Utility functions
│   │   ├── seed-data.ts              # Basic seeder
│   │   └── seed-complete-family.ts   # Complete family seeder
│   ├── models/
│   │   ├── User.ts                   # User schema
│   │   ├── Relationship.ts           # Relationship schema
│   │   ├── Event.ts                  # Event schema
│   │   └── OTP.ts                    # OTP schema
│   ├── types/
│   │   └── global.d.ts               # TypeScript definitions
│   └── middleware.ts                 # Next.js middleware
├── public/                           # Static assets
├── .env.local                        # Environment variables
├── package.json                      # Dependencies
├── tsconfig.json                     # TypeScript config
├── tailwind.config.ts                # Tailwind config
├── next.config.ts                    # Next.js config
└── README.md                         # This file
```

---

## 📡 API Documentation

### Authentication APIs

#### `POST /api/auth/register`
Register a new user.

**Request:**
```json
{
  "firstName": "Arun",
  "lastName": "Ramesh",
  "email": "arun@example.com",
  "mobile": "9876543210",
  "password": "securepass123",
  "gender": "Male",
  "dob": "2000-01-15",
  "gothiram": "Bharadvaja",
  "nativePlace": "Chennai"
}
```

**Response:**
```json
{
  "message": "Registration successful!",
  "userId": "user_id",
  "identifier": "arun@example.com",
  "type": "email",
  "devOtp": "123456"  // Only in development
}
```

#### `POST /api/auth/verify-otp`
Verify OTP and activate account.

**Request:**
```json
{
  "userId": "user_id",
  "identifier": "arun@example.com",
  "otp": "123456",
  "type": "email"
}
```

**Response:**
```json
{
  "message": "OTP verified successfully!",
  "verified": true,
  "autoLogin": true,
  "user": { /* user data */ }
}
```

---

### User APIs

#### `GET /api/users/profile`
Get current user's profile.

**Headers:**
```
Authorization: Bearer <session_token>
```

**Response:**
```json
{
  "user": {
    "_id": "user_id",
    "firstName": "Arun",
    "lastName": "Ramesh",
    "email": "arun@example.com",
    "gothiram": "Bharadvaja",
    "isApprovedByAdmin": true,
    // ... other fields
  }
}
```

#### `PUT /api/users/profile`
Update user profile.

**Request:**
```json
{
  "bioDesc": "Updated bio",
  "partnerDesc": "Updated partner preferences",
  "enableMarriageFlag": true
}
```

---

### Relationship APIs

#### `GET /api/relationships`
Get all relationships for current user.

**Response:**
```json
{
  "relationships": [
    {
      "_id": "rel_id",
      "personId1": { /* user object */ },
      "personId2": { /* user object */ },
      "relationType": "Father",
      "description": "My father",
      "isApproved": true,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

#### `POST /api/relationships`
Create a new relationship.

**Request:**
```json
{
  "personId2": "user_id",
  "relationType": "Father",
  "description": "Optional description"
}
```

**Response:**
```json
{
  "message": "Relationship created successfully",
  "relationship": { /* relationship object */ }
}
```

#### `PUT /api/relationships/[id]`
Update a relationship.

**Request:**
```json
{
  "relationType": "Mother",
  "description": "Updated description"
}
```

#### `DELETE /api/relationships/[id]`
Delete a relationship.

**Response:**
```json
{
  "message": "Relationship deleted successfully"
}
```

---

### Search APIs

#### `GET /api/search`
Search for users (regular users).

**Query Parameters:**
- `q` (required): Search query (min 2 chars)
- `filter`: all | name | gothiram | place
- `limit`: Number of results (default: 20)

**Example:**
```
GET /api/search?q=arun&filter=name&limit=20
```

**Response:**
```json
{
  "users": [ /* user objects */ ],
  "count": 5,
  "query": "arun"
}
```

#### `GET /api/admin/search`
Search for users (admin only).

**Query Parameters:**
- `q` (required): Search query
- `filter`: all | name | email | mobile | gothiram | place
- `status`: all | approved | pending
- `limit`: Number of results (default: 50)

---

### Admin APIs

#### `GET /api/admin/stats`
Get dashboard statistics.

**Response:**
```json
{
  "stats": {
    "totalUsers": 100,
    "pendingApprovals": 5,
    "approvedUsers": 95,
    "activeMatrimony": 30,
    "totalRelationships": 450,
    "totalEvents": 10
  }
}
```

#### `GET /api/admin/users/pending`
Get pending user approvals.

**Response:**
```json
{
  "users": [
    {
      "_id": "user_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "mobile": "9876543210",
      "createdAt": "2025-01-01T00:00:00Z",
      "isEmailVerified": true,
      "isMobileVerified": false
    }
  ]
}
```

#### `POST /api/admin/users/[userId]/approve`
Approve a user.

**Response:**
```json
{
  "message": "User approved successfully"
}
```

#### `POST /api/admin/users/[userId]/reject`
Reject a user.

**Response:**
```json
{
  "message": "User rejected successfully"
}
```

---

## 🗄 Database Schema

### User Schema

```typescript
{
  // Personal Information
  firstName: String (required),
  lastName: String (required),
  email: String (unique, sparse),
  mobile: String (unique, sparse),
  password: String (required, hashed),
  
  // Profile Details
  gender: "Male" | "Female" | "Other",
  dob: Date,
  placeOfBirth: String,
  timeOfBirth: String,
  height: Number (cm),
  
  // AVS Specific
  gothiram: String (indexed),
  rasi: String,
  natchathiram: String,
  kuladeivam: String,
  nativePlace: String (indexed),
  
  // Contact
  primaryPhone: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
  citizenship: String,
  
  // Professional
  qualification: String,
  jobDesc: String,
  salary: String,
  workPlace: String,
  
  // Matrimony
  bioDesc: String (max 500),
  partnerDesc: String (max 500),
  enableMarriageFlag: Boolean (indexed),
  
  // System
  role: "user" | "admin" | "matchmaker",
  isEmailVerified: Boolean,
  isMobileVerified: Boolean,
  isApprovedByAdmin: Boolean (indexed),
  profilePicture: String,
  
  // Metadata
  createdAt: Date,
  updatedAt: Date,
  createdBy: ObjectId,
  updatedBy: ObjectId
}
```

### Relationship Schema

```typescript
{
  personId1: ObjectId (ref: 'User', indexed),
  personId2: ObjectId (ref: 'User', indexed),
  relationType: String (enum: relationship types, indexed),
  description: String (max 500),
  isApproved: Boolean (indexed),
  approvedBy: ObjectId (ref: 'User'),
  createdBy: ObjectId (ref: 'User'),
  updatedBy: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}

// Unique compound index on (personId1, personId2)
```

**Relationship Types:**
- Father, Mother, Son, Daughter
- Brother, Sister, Older Sibling, Younger Sibling
- Spouse
- Grand Father, Grand Mother
- Uncle, Aunt, Cousin
- Nephew, Niece
- Other

### Event Schema

```typescript
{
  title: String (required),
  description: String,
  eventDate: Date (required),
  location: String,
  organizer: ObjectId (ref: 'User'),
  attendees: [ObjectId] (ref: 'User'),
  isPublished: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### OTP Schema

```typescript
{
  identifier: String (indexed, email or mobile),
  otp: String (hashed),
  type: "email" | "mobile",
  userId: ObjectId (ref: 'User'),
  expiresAt: Date (indexed),
  verified: Boolean,
  createdAt: Date
}
```

---

## 🔐 Authentication & Authorization

### Authentication Flow

```
1. User Registration
   ↓ Email/Mobile + Password + Details
   │
2. Create User (isApprovedByAdmin: false)
   ↓
3. Generate OTP
   ↓ Store in OTP collection (10 min expiry)
   │
4. Send OTP Email (skip in dev mode)
   ↓
5. User Enters OTP
   ↓
6. Verify OTP
   ↓ Check: Correct OTP + Not Expired + Not Used
   │
7. Mark Email/Mobile as Verified
   ↓
8. Auto-Login
   ↓ Create NextAuth session
   │
9. Check Approval Status
   ├─→ Approved: Redirect to /dashboard
   └─→ Pending: Redirect to /pending-approval
```

### Authorization Levels

#### Public Routes (No Auth Required)
- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/auth/verify-otp` - OTP verification

#### Protected Routes (Auth Required)
- `/dashboard` - User dashboard
- `/profile` - User profile
- `/family-tree` - Family tree visualization
- `/relationships` - Relationship management
- `/search` - Member search
- `/matrimony` - Matrimony profiles

#### Admin Routes (Admin Role Required)
- `/admin/dashboard` - Admin dashboard
- `/admin/reports` - Reports and analytics
- `/admin/users` - User management
- `/admin/events` - Event management

#### Pending Approval Route
- `/pending-approval` - Shown to verified but unapproved users

### Middleware Protection

```typescript
// src/middleware.ts
export default async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const path = req.nextUrl.pathname;
  
  // Public routes
  if (publicRoutes.includes(path)) return NextResponse.next();
  
  // Auth required
  if (!token) return NextResponse.redirect('/auth/login');
  
  // Approval check
  if (!token.isApprovedByAdmin && !path.includes('/pending-approval')) {
    return NextResponse.redirect('/pending-approval');
  }
  
  // Admin routes
  if (path.startsWith('/admin') && token.role !== 'admin') {
    return NextResponse.redirect('/dashboard');
  }
  
  return NextResponse.next();
}
```

---

## 🎭 Features by Role

### Admin Features

#### User Management
- ✅ View all users (approved + pending)
- ✅ Approve/reject registrations
- ✅ Bulk approve/reject operations
- ✅ Multi-select with checkboxes
- ✅ View sensitive information
- ✅ Edit user details
- ✅ Delete users
- ✅ Assign roles

#### Dashboard & Reports
- ✅ Statistics overview
- ✅ Pending approvals count
- ✅ Gender distribution
- ✅ Gothiram breakdown
- ✅ Location analytics
- ✅ Growth metrics
- ✅ Export to CSV
- ✅ Custom date ranges

#### Search & Discovery
- ✅ Search all users
- ✅ Filter by approval status
- ✅ Search by email/mobile
- ✅ 50 results per query
- ✅ Full profile access

#### Relationship Management
- ✅ View all relationships
- ✅ Edit any relationship
- ✅ Delete any relationship
- ✅ Auto-approve own relationships
- ✅ Relationship statistics

#### Event Management
- ✅ Create events
- ✅ Edit events
- ✅ Delete events
- ✅ Manage attendees
- ✅ Publish/unpublish

---

### Matchmaker Features

#### Matrimony Management
- ✅ View all matrimony profiles
- ✅ Advanced filtering
- ✅ Contact details access
- ✅ Suggest matches
- ✅ Track match success
- ✅ Generate match reports

#### Profile Access
- ✅ Extended profile view
- ✅ Bio and preferences
- ✅ Family information
- ✅ Contact parents/guardians
- ✅ Note-taking system

---

### Regular User Features

#### Profile Management
- ✅ Edit personal details
- ✅ Upload profile picture
- ✅ Update bio (500 chars)
- ✅ Set partner preferences
- ✅ Enable/disable matrimony
- ✅ Privacy settings

#### Family Tree
- ✅ Add relationships
- ✅ Edit relationships
- ✅ Delete relationships
- ✅ View visual tree
- ✅ Pan, zoom, interact
- ✅ Switch to list view
- ✅ See relationship count

#### Search & Connect
- ✅ Quick search from dashboard
- ✅ Advanced search page
- ✅ Filter by criteria
- ✅ View approved members
- ✅ Send connection requests
- ✅ 20 results per query

#### Matrimony
- ✅ Create matrimony profile
- ✅ View matches
- ✅ Search profiles
- ✅ Contact matchmaker
- ✅ Privacy controls

#### Events
- ✅ View upcoming events
- ✅ Register for events
- ✅ View past events
- ✅ Add to calendar

---

## 📸 Screenshots

### Landing Page
- Hero section with AVS branding
- Feature highlights
- Call-to-action buttons
- Community statistics

### Dashboard
- Quick action cards
- Search bar integration
- My Relationships card
- Family Tree access
- Matrimony section
- Events listing
- Admin panel (for admins)

### Family Tree
- Interactive visual tree
- Node-based layout
- Connection lines
- Pan/zoom controls
- Generation-based hierarchy
- Visual and List view toggle
- Member count display

### Relationships Page
- Add relationship button
- Search integration
- Relationship cards with avatars
- Edit/Delete actions
- Approval status indicators
- Empty state with CTA

### Search Page
- Integrated search bar
- Filter dropdowns
- Result cards with details
- Advanced search options
- Status filters (admin)

### Profile Page
- Tabbed interface:
  - Personal Info
  - Contact Details
  - About Me
  - AVS Details
- Character counters
- Form validation
- Save button

### Admin Dashboard
- Statistics cards
- Pending approvals table
- Multi-select checkboxes
- Bulk action buttons
- Search integration
- Reports section

---

## 🚢 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Connect to Vercel**
- Visit vercel.com
- Import repository
- Configure environment variables
- Deploy

3. **Environment Variables on Vercel**
```
MONGODB_URI=<your-mongodb-atlas-uri>
NEXTAUTH_SECRET=<generate-new-secret>
NEXTAUTH_URL=https://your-domain.vercel.app
EMAIL_USER=<your-email>
EMAIL_PASSWORD=<your-password>
NODE_ENV=production
```

### MongoDB Atlas Setup

1. Create cluster at mongodb.com/atlas
2. Create database user
3. Whitelist IPs (0.0.0.0/0 for all)
4. Get connection string
5. Replace in MONGODB_URI

### Production Checklist

- [ ] Update NEXTAUTH_SECRET
- [ ] Configure production MongoDB
- [ ] Set up email service (SendGrid/AWS SES)
- [ ] Enable HTTPS
- [ ] Configure CORS
- [ ] Set up error tracking (Sentry)
- [ ] Configure analytics
- [ ] Set up backup strategy
- [ ] Test OTP email delivery
- [ ] Test all role permissions
- [ ] Load testing
- [ ] Security audit

---

## 🔧 Troubleshooting

### Common Issues

#### 1. OTP Not Received
**Problem:** Email OTP not arriving  
**Solution:**
- Check SMTP credentials in `.env.local`
- Use dev mode: Set `NEXT_PUBLIC_USE_TEST_OTP=true`
- Dev OTP is always: `123456`
- Check spam folder

#### 2. Lines Not Showing in Family Tree
**Problem:** Family tree nodes appear but no connection lines  
**Solution:**
- Hard refresh: `Ctrl+Shift+R` (Windows) or `Cmd+Shift+R` (Mac)
- Check browser console for errors
- Verify relationships exist in database
- Check edge count in top-left panel

#### 3. MongoDB Connection Failed
**Problem:** Cannot connect to database  
**Solution:**
- Verify MongoDB is running: `mongod`
- Check connection string in `.env.local`
- Ensure database port is open (27017)
- Check network connectivity

#### 4. Cannot Login After Registration
**Problem:** User redirected to pending approval  
**Solution:**
- This is expected behavior
- Admin must approve user
- Login as admin: `admin@avs.com` / `admin123`
- Go to admin dashboard
- Approve the user
- Try logging in again

#### 5. Search Not Working
**Problem:** Search returns no results  
**Solution:**
- Type at least 2 characters
- Check network tab for API calls
- Verify users are approved (for non-admins)
- Check search filters
- Seed database with test data

#### 6. Build Errors
**Problem:** `npm run build` fails  
**Solution:**
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules`: `rm -rf node_modules`
- Reinstall: `npm install`
- Check TypeScript errors: `npm run type-check`

#### 7. Relationship Not Appearing in Tree
**Problem:** Added relationship but tree doesn't show it  
**Solution:**
- Refresh the page
- Check if relationship is approved
- Verify both users exist
- Check console for errors
- Try switching to List view

### Debug Mode

Enable detailed logging:

```env
# .env.local
DEBUG=true
NEXT_PUBLIC_DEBUG=true
```

Check browser console for:
- 🌳 Family Tree Debug logs
- 📊 Node count
- 🔗 Edge count
- ✅ Edge creation logs
- ❌ Error messages

### Get Help

- Check documentation files in project root
- Review code comments
- Check GitHub issues
- Contact: support@avs.com

---

## 🤝 Contributing

### Development Workflow

1. **Fork the Repository**
2. **Create Feature Branch**
```bash
git checkout -b feature/your-feature-name
```

3. **Make Changes**
- Follow existing code style
- Add comments for complex logic
- Update documentation

4. **Test Thoroughly**
```bash
npm run dev
# Test all affected features
```

5. **Commit Changes**
```bash
git add .
git commit -m "feat: Add your feature description"
```

6. **Push and Create PR**
```bash
git push origin feature/your-feature-name
```

### Code Style

- Use TypeScript for type safety
- Follow ESLint rules
- Use Prettier for formatting
- Add JSDoc comments for functions
- Keep components small and focused
- Use meaningful variable names

### Commit Convention

```
feat: New feature
fix: Bug fix
docs: Documentation update
style: Code style changes
refactor: Code refactoring
test: Add tests
chore: Build/config changes
```

---

## 📝 License

This project is proprietary software developed for the Akhil Bharatiya Vellalar Sangam (AVS) community.

**Copyright © 2025 AVS Community**

All rights reserved.

---

## 📞 Support

### Contact Information

- **Email:** support@avs.com
- **Phone:** +91-XXX-XXX-XXXX
- **Website:** https://avs-family-tree.com
- **Community:** https://community.avs.com

### Resources

- [User Guide](./USER_GUIDE.md)
- [Admin Guide](./APPROVE_USER_GUIDE.md)
- [API Documentation](./API_DOCS.md)
- [Search Guide](./SEARCH_FEATURE.md)
- [Relationship Guide](./RELATIONSHIP_FEATURE.md)
- [Family Tree Guide](./FAMILY_TREE_VISUALIZATION.md)

---

## 🙏 Acknowledgments

- AVS Community for their support
- Next.js team for the amazing framework
- React Flow team for the visualization library
- Shadcn for the beautiful UI components
- All contributors and testers

---

## 📊 Project Statistics

- **Total Lines of Code:** 15,000+
- **Components:** 50+
- **API Routes:** 25+
- **Database Collections:** 4
- **Features:** 30+
- **User Roles:** 3
- **Supported Languages:** English, Tamil (coming soon)

---

## 🗺 Roadmap

### Phase 1 (Completed) ✅
- ✅ User authentication & registration
- ✅ Profile management
- ✅ Family tree visualization
- ✅ Relationship management
- ✅ Search functionality
- ✅ Admin dashboard

### Phase 2 (In Progress) 🚧
- 🔄 Matrimony enhancements
- 🔄 Event management improvements
- 🔄 Mobile app development
- 🔄 Advanced analytics

### Phase 3 (Planned) 📅
- 📅 AI-powered match suggestions
- 📅 Video profiles
- 📅 Chat system
- 📅 Payment integration
- 📅 Multi-language support
- 📅 DNA relationship verification

---

## 🎉 Quick Start Summary

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with MongoDB URI

# 3. Seed database
npx tsx src/lib/seed-complete-family.ts

# 4. Start development
npm run dev

# 5. Login as admin
# Email: admin@avs.com
# Password: admin123

# 6. Or login as user
# Email: arun.ramesh@avs.com
# Password: password123
```

**That's it! You're ready to explore the AVS Family Tree application.** 🌳

---

**Built with ❤️ for the AVS Community**

*Connecting Generations, Preserving Heritage, Building Futures*
