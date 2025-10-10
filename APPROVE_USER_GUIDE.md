# User Approval Guide

## ✅ Issue Fixed

Users can now **log in after OTP verification**, even if not approved by admin. They will see a **"Pending Approval" page** instead of being blocked.

## 🔄 What Changed

### Before:
- User registers → Verifies OTP → ❌ **Cannot log in** → Shows "Invalid email/mobile or password"

### After:
- User registers → Verifies OTP → ✅ **Can log in** → Sees "Pending Approval" page

## 🎯 How to Approve Users

### Option 1: Via Admin Dashboard (Recommended)

1. **Log in as Admin:**
   ```
   Email: admin@avs.com
   Password: admin123
   ```

2. **Go to Admin Dashboard:**
   ```
   http://localhost:3001/admin/dashboard
   ```

3. **Approve Pending Users:**
   - You'll see a list of pending users
   - Click the **"Approve"** button next to the user
   - User can now access the full dashboard!

### Option 2: Via MongoDB (Quick Fix)

If you need to approve a user immediately:

```bash
# Connect to MongoDB
mongosh

# Switch to database
use avs-family-tree

# Find the user
db.users.find({ email: "manish@gm.com" })

# Approve the user
db.users.updateOne(
  { email: "manish@gm.com" },
  { $set: { isApprovedByAdmin: true, approvedAt: new Date() } }
)

# Verify
db.users.findOne({ email: "manish@gm.com" }, { isApprovedByAdmin: 1, email: 1 })
```

### Option 3: Via Seed Script (Auto-Approve for Development)

You can modify the seed script to auto-approve users:

```bash
# Run seed script
npm run seed

# This will create sample users including admin
```

## 📊 User States

### 1. **Registered (Not Verified)**
- User has registered but not verified OTP
- ❌ Cannot log in

### 2. **Verified (Pending Approval)** ← Current State
- User has verified OTP
- ✅ Can log in
- Sees "Pending Approval" page
- Cannot access dashboard features

### 3. **Approved** 
- Admin has approved the user
- ✅ Can log in
- ✅ Full dashboard access
- ✅ Can use all features

## 🔐 Admin Accounts

### Seed Database with Admin:

```bash
# In your terminal
npm run seed
```

This creates:
- **Admin User:**
  - Email: `admin@avs.com`
  - Password: `admin123`
  - Role: admin
  - Auto-approved

- **Regular Users:**
  - Various test users
  - Some approved, some pending

## 🚀 Quick Test Flow

### Test the Complete Registration Flow:

1. **Register New User:**
   ```
   http://localhost:3001/auth/register
   
   Name: Test User
   Email: test@example.com
   Password: password123
   ```

2. **Verify OTP:**
   ```
   OTP: 123456
   ```

3. **Auto-Login:**
   - ✅ Logged in automatically
   - Redirected to Pending Approval page

4. **Approve User:**
   - Log in as admin (`admin@avs.com` / `admin123`)
   - Go to Admin Dashboard
   - Click "Approve" on the pending user

5. **User Can Now Access Dashboard:**
   - User logs in again (or refreshes)
   - ✅ Full dashboard access!

## 📝 Files Modified

1. ✅ **`/lib/auth.ts`**
   - Removed admin approval blocking from login
   - Users can now log in even if pending approval

2. ✅ **`/app/pending-approval/page.tsx`** (NEW)
   - Beautiful pending approval page
   - Shows account status
   - Allows checking for approval updates

3. ✅ **`/app/dashboard/page.tsx`**
   - Redirects unapproved users to pending-approval page
   - Instead of profile/complete (which didn't exist)

## 🎨 Pending Approval Page Features

- ✅ Shows user info (name, email/mobile)
- ✅ Visual status indicators (verified ✓, pending ⏳)
- ✅ Information about approval process
- ✅ "Check Status" button to refresh
- ✅ "View Profile" link
- ✅ Logout option
- ✅ Beautiful AVS-branded design

## 🐛 Issue Resolution

### Original Problem:
- User `manish@gm.com` registered
- Verified OTP successfully
- ❌ Could not log in (blocked by admin approval check in auth)
- Error: "Invalid email/mobile or password"

### Solution:
1. ✅ Removed login blocking for unapp roved users
2. ✅ Created pending approval page
3. ✅ Users can log in and see their status
4. ✅ Admin can approve from dashboard

## 💡 For Development

### Auto-Approve Users After OTP (Optional):

If you want users to be auto-approved in development, add this to `/app/api/auth/verify-otp/route.ts`:

```typescript
// After user.save()
if (process.env.NODE_ENV === 'development') {
  user.isApprovedByAdmin = true;
  user.approvedAt = new Date();
  await user.save();
}
```

## 🎉 Ready!

The user can now:
1. ✅ Register with `manish@gm.com`
2. ✅ Verify OTP: `123456`
3. ✅ Log in successfully
4. ✅ See pending approval page
5. ⏳ Wait for admin approval (or you can approve manually)

Try logging in now with your credentials!

