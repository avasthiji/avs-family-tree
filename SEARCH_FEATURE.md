# Search Feature Documentation

## Overview
The AVS Family Tree application now includes a comprehensive Facebook-style search functionality that allows users to search for community members by multiple criteria.

## Features

### 🔍 Search Capabilities
- **Name Search**: Search by first name or last name
- **Gothiram Search**: Find members by their gothiram
- **Place Search**: Search by native place, city, state, or work place
- **Email/Mobile Search** (Admin only): Search by email or mobile number

### 🎯 Filter Options
Users can filter their search by:
- `All` - Search across all fields
- `Name` - Search only names
- `Gothiram` - Search only gothiram
- `Place` - Search only location-related fields
- `Email` (Admin) - Search by email address
- `Mobile` (Admin) - Search by mobile number

### 👥 User Types

#### Regular Users
- Can search only **approved** users
- Cannot see their own profile in search results
- Cannot view email/mobile information of other users
- Can access quick search from dashboard
- Can use advanced search page for detailed results

#### Admin Users
- Can search **all users** (approved and pending)
- Additional status filter:
  - `All Users` - Show all users
  - `Approved` - Show only approved users
  - `Pending` - Show only pending approvals
- Can view email and mobile information
- Can search by email and mobile
- Higher result limit (50 vs 20)

## Components

### 1. SearchBar Component (`/components/SearchBar.tsx`)
A reusable search bar with real-time autocomplete dropdown.

**Props:**
- `isAdmin?: boolean` - Whether the user is an admin
- `onSelectUser?: (user: SearchResult) => void` - Callback when a user is selected

**Features:**
- Debounced search (300ms delay)
- Real-time results dropdown
- Click outside to close
- Loading indicator
- Filter dropdown
- Status filter (admin only)

### 2. Search Page (`/app/search/page.tsx`)
Dedicated search page with detailed user information display.

**Features:**
- Full-page search interface
- Detailed user profile cards
- Advanced filtering options
- Responsive design

### 3. API Routes

#### `/api/search` (User Search)
**Method:** GET

**Query Parameters:**
- `q` (required): Search query string (min 2 characters)
- `filter` (optional): 'name' | 'gothiram' | 'place' | 'all'
- `limit` (optional): Number of results (default: 20)

**Response:**
```json
{
  "users": [...],
  "count": 5,
  "query": "search term"
}
```

**Restrictions:**
- Only returns approved users
- Excludes current user from results
- Limited user information (no email/mobile)

#### `/api/admin/search` (Admin Search)
**Method:** GET

**Query Parameters:**
- `q` (required): Search query string (min 2 characters)
- `filter` (optional): 'name' | 'email' | 'mobile' | 'gothiram' | 'place' | 'all'
- `status` (optional): 'approved' | 'pending' | 'all'
- `limit` (optional): Number of results (default: 50)

**Response:**
```json
{
  "users": [...],
  "count": 15,
  "query": "search term"
}
```

**Admin Features:**
- Can search all users regardless of approval status
- Full user information including email and mobile
- Additional filters (email, mobile)
- Status-based filtering

## Usage

### Dashboard Integration
Both user and admin dashboards include the search bar:

```tsx
<SearchBar 
  isAdmin={user.role === "admin"} 
  onSelectUser={(user) => {
    console.log("Selected user:", user);
  }} 
/>
```

### Advanced Search Page
Access the full search page at `/search`:
- More space for results
- Detailed user profiles
- Better filtering options

## Search Algorithm

The search uses MongoDB's `$regex` with case-insensitive matching (`$options: 'i'`):

```javascript
{
  $or: [
    { firstName: { $regex: searchQuery, $options: 'i' } },
    { lastName: { $regex: searchQuery, $options: 'i' } },
    { gothiram: { $regex: searchQuery, $options: 'i' } },
    { nativePlace: { $regex: searchQuery, $options: 'i' } },
    // ... more fields
  ]
}
```

### Performance Considerations
- Indexed fields: email, mobile, gothiram, nativePlace
- Results are limited to prevent overload
- Debounced input to reduce API calls
- Query requires minimum 2 characters

## UI Elements

### Search Result Card
Each search result displays:
- **Avatar** with initials fallback
- **Full Name** (first + last)
- **Badges**: 
  - Admin (red)
  - Pending (yellow, admin only)
  - Matrimony (pink, if active)
  - Gender
- **Gothiram** with icon
- **Location** (native place or city) with icon
- **Email** (admin only)

### Visual Feedback
- Loading spinner while searching
- "No results" message with icon
- Result count at bottom
- Hover effects on result cards

## Security & Privacy

### Access Control
✅ Authentication required for all search endpoints
✅ Non-admins can only see approved users
✅ Users cannot see their own profile in search
✅ Email/mobile visible only to admins

### Data Protection
- Minimal data exposure in regular search
- Sensitive information (email, mobile) restricted to admins
- Approval status filtering for privacy

## Mobile Responsiveness
- Fully responsive design
- Touch-friendly interactions
- Optimized for small screens
- Collapsible filters on mobile

## Future Enhancements
- [ ] Save search history
- [ ] Favorite/bookmark users
- [ ] Export search results (CSV)
- [ ] Advanced filters (age range, marriage status)
- [ ] Search by relationship type
- [ ] Fuzzy search for typos
- [ ] Search suggestions/autocomplete
- [ ] Sort options (name, location, date joined)

## Testing

### Test Cases

1. **Basic Search**
   - Search with 1 character → No API call
   - Search with 2+ characters → Results appear
   - Empty search → No results

2. **Filter Testing**
   - Test each filter individually
   - Verify correct API parameters
   - Check result accuracy

3. **Admin Features**
   - Verify status filter works
   - Check email/mobile visibility
   - Test pending user search

4. **UI/UX Testing**
   - Debounce functionality
   - Click outside to close
   - Keyboard navigation
   - Mobile responsiveness

## Support
For issues or feature requests, contact the development team.

---

Last Updated: October 10, 2025
Version: 1.0.0

