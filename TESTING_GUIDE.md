# Testing Guide - Search & Relationship Features

## 🚀 Quick Start

Your dev server is running at: **http://localhost:3002**

## 🧪 Test Scenarios

### 1. Test Search Functionality

#### From Dashboard
1. Login to your account
2. Look for the search bar on the dashboard (top section)
3. Type at least 2 characters
4. See results appear in dropdown
5. Try different filters (All, Name, Gothiram, Place)
6. Click on a result to see it selected

#### Advanced Search Page
1. Click "Advanced Search" button
2. Navigate to `/search` page
3. Use the search bar
4. See detailed user profiles
5. Test with different search terms

#### Admin Search
1. Login as admin (admin@avs.com)
2. Use the search bar
3. Try status filter (All Users, Approved, Pending)
4. Search by email or mobile
5. Verify you see pending users

### 2. Test Relationship Management

#### Add Relationship
1. Go to Dashboard
2. Click "Manage" on "My Relationships" card
3. Or navigate to `/relationships`
4. Click "Add Relationship" button
5. In the dialog:
   - Use search bar to find a user
   - Select a user from results
   - Choose relationship type
   - Add optional description
   - Click "Add Relationship"
6. Verify toast notification appears
7. See new relationship in your list

#### Edit Relationship
1. Find a relationship in your list
2. Click the Edit button (pencil icon)
3. Change relationship type
4. Update description
5. Click "Update Relationship"
6. Verify changes are saved

#### Delete Relationship
1. Find a relationship in your list
2. Click the Delete button (trash icon)
3. Confirm deletion in dialog
4. Verify relationship is removed
5. See toast notification

### 3. Test Edge Cases

#### Duplicate Prevention
1. Try adding a relationship with someone you're already connected to
2. Should see error: "Relationship already exists"

#### Self-Relationship
1. Try searching for yourself
2. You shouldn't see your own profile in search results
3. If you somehow try to add yourself, should see error

#### Invalid Relationship Type
1. API should reject invalid types
2. UI dropdown only shows valid types

### 4. Test Permissions

#### Regular User
1. Can only see approved users in search
2. Cannot see email/mobile of other users
3. Can only edit/delete own relationships
4. Cannot see pending users

#### Admin User
1. Can see all users (approved + pending)
2. Can see email/mobile
3. Can edit/delete any relationship
4. Has status filter in search

### 5. Test UI/UX

#### Responsive Design
1. Test on mobile (resize browser)
2. Check tablet view
3. Verify desktop layout
4. All elements should adapt

#### Loading States
1. Watch for loading spinners
2. Verify during search
3. Check during API calls
4. Buttons should disable when loading

#### Empty States
1. View relationships page with no relationships
2. Should see helpful empty state
3. Call-to-action button present

#### Toast Notifications
1. Should appear for all actions
2. Success: Green toast
3. Error: Red toast
4. Auto-dismiss after few seconds

### 6. Test Search Performance

#### Debounce
1. Type quickly in search
2. API should only call after 300ms pause
3. Check network tab in browser
4. Should not spam API

#### Results Limit
1. Search for common term
2. Regular users: Max 20 results
3. Admin: Max 50 results

## 📋 Test Checklist

### Search Feature
- [ ] Dashboard search bar works
- [ ] Advanced search page works
- [ ] Filter dropdown changes results
- [ ] Admin status filter works
- [ ] Click outside closes dropdown
- [ ] Debounce prevents spam
- [ ] Results show correct user info
- [ ] Badges display correctly

### Relationship Management
- [ ] Can add new relationship
- [ ] Search integration works in dialog
- [ ] Relationship types dropdown works
- [ ] Description textarea works
- [ ] Can edit existing relationship
- [ ] Can delete relationship
- [ ] Confirmation dialog shows
- [ ] Toast notifications appear
- [ ] Empty state shows when no relationships

### Security & Authorization
- [ ] Cannot see own profile in search
- [ ] Regular users see only approved
- [ ] Admins see all users
- [ ] Cannot add duplicate relationship
- [ ] Cannot create self-relationship
- [ ] Authorization checks work

### UI/UX
- [ ] Mobile responsive
- [ ] Loading states work
- [ ] Avatars display
- [ ] Badges show correctly
- [ ] Hover effects work
- [ ] Animations smooth
- [ ] No layout shifts

## 🐛 If Something Doesn't Work

### Search Not Working
1. Check browser console for errors
2. Verify you're logged in
3. Check network tab for API response
4. Ensure typing 2+ characters
5. Try refreshing page

### Relationship Add Fails
1. Check if user is approved
2. Verify both users exist
3. Check for duplicate
4. Look at console errors
5. Check toast notification message

### Toast Notifications Missing
1. Verify Toaster is in layout.tsx
2. Check if sonner is imported
3. Restart dev server
4. Clear browser cache

### Styling Issues
1. Check if Tailwind classes are working
2. Verify component imports
3. Check globals.css
4. Try hard refresh (Ctrl+Shift+R)

## 🎯 Admin Test Account

Use the admin account to test all features:
- **Email:** admin@avs.com
- **Password:** Check your seed data

## 📊 What to Look For

### Good Signs ✅
- Fast search results (< 500ms)
- Smooth animations
- Clear error messages
- Helpful empty states
- Responsive on all devices
- No console errors
- Toast notifications work
- Data persists after refresh

### Red Flags ❌
- Slow API responses
- Console errors
- Missing toast notifications
- Broken layouts on mobile
- Data not saving
- Authorization bypassed
- Duplicate relationships allowed

## 🔄 After Testing

1. Check terminal for any errors
2. Look at browser console
3. Verify database has correct data
4. Test logout and login again
5. Try different user roles
6. Test edge cases
7. Document any bugs found

## 💡 Tips

- Use Chrome DevTools for debugging
- Check Network tab for API calls
- Use React DevTools for component inspection
- Test in incognito for clean state
- Try different browsers
- Test with slow 3G network simulation

---

## 🎊 Expected Results

After successful testing, you should be able to:

✅ Search for any family member quickly
✅ Add relationships with ease
✅ Edit relationship details
✅ Delete relationships safely
✅ See beautiful, responsive UI
✅ Get helpful feedback via toasts
✅ Navigate smoothly between pages
✅ Experience no bugs or errors

---

**Happy Testing! 🚀**

If you encounter any issues, check the documentation files or contact the development team.

