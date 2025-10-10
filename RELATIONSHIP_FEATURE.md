# Relationship Management Feature Documentation

## Overview
The AVS Family Tree application includes a comprehensive relationship management system that allows users to map and unmap their family connections with other users in the community.

## Features

### 🔗 Core Functionality

#### **1. Add Relationships**
- Search for any family member in the community
- Select from predefined relationship types
- Add optional description/notes
- Automatic duplicate prevention
- Admin auto-approval

#### **2. Edit Relationships**
- Update relationship type
- Modify descriptions
- Track who made changes and when

#### **3. Delete Relationships**
- Remove relationships with confirmation
- Proper authorization checks
- Maintains data integrity

### 📋 Relationship Types

The system supports 16 relationship types:

**Immediate Family:**
- Father
- Mother
- Son
- Daughter
- Brother
- Sister
- Spouse

**Siblings:**
- Older Sibling
- Younger Sibling

**Extended Family:**
- Grand Father
- Grand Mother
- Uncle
- Aunt
- Cousin
- Nephew
- Niece

**Other:**
- Other (for custom relationships)

### 🎨 User Interface

#### **Relationships Page (`/relationships`)**

**Features:**
- Complete relationship management dashboard
- Search integration for easy user selection
- Visual relationship cards with avatars
- Edit and delete actions
- Approval status indicators
- Responsive design

**Components:**
1. **Add Relationship Dialog**
   - Integrated search bar
   - Relationship type selector
   - Description textarea
   - Selected user preview

2. **Relationships List**
   - Avatar display
   - Relationship type badges
   - Approval status icons
   - Edit/Delete buttons
   - Empty state with call-to-action

3. **Edit Relationship Dialog**
   - Update relationship type
   - Modify description
   - Save changes

#### **Dashboard Integration**
- "My Relationships" card on main dashboard
- Quick access to relationship management
- Prominent placement for easy discovery

### 🔌 API Endpoints

#### **GET `/api/relationships`**
Fetch all relationships for the current user.

**Authentication:** Required

**Response:**
```json
{
  "relationships": [
    {
      "_id": "...",
      "personId1": {...},
      "personId2": {...},
      "relationType": "Father",
      "description": "...",
      "isApproved": true,
      "createdBy": {...},
      "createdAt": "2025-10-10T..."
    }
  ]
}
```

#### **POST `/api/relationships`**
Create a new relationship.

**Authentication:** Required

**Request Body:**
```json
{
  "personId2": "user_id",
  "relationType": "Father",
  "description": "Optional description"
}
```

**Validation:**
- Both users must exist
- Cannot create relationship with self
- No duplicate relationships
- Valid relationship type

**Response:**
```json
{
  "message": "Relationship created successfully",
  "relationship": {...}
}
```

**Error Responses:**
- `400`: Missing required fields / Invalid type / Self-relationship
- `404`: User not found
- `409`: Relationship already exists
- `500`: Server error

#### **PUT `/api/relationships/[relationshipId]`**
Update an existing relationship.

**Authentication:** Required

**Authorization:** Must be part of the relationship or admin

**Request Body:**
```json
{
  "relationType": "Brother",
  "description": "Updated description"
}
```

**Response:**
```json
{
  "message": "Relationship updated successfully",
  "relationship": {...}
}
```

#### **DELETE `/api/relationships/[relationshipId]`**
Delete a relationship.

**Authentication:** Required

**Authorization:** Must be part of the relationship or admin

**Response:**
```json
{
  "message": "Relationship deleted successfully"
}
```

### 🗄️ Database Schema

#### **Relationship Model**

```typescript
interface IRelationship {
  _id: ObjectId;
  personId1: ObjectId;        // First person in relationship
  personId2: ObjectId;        // Second person in relationship
  relationType: string;       // Type from enum
  description?: string;       // Optional notes (max 500 chars)
  isApproved: boolean;        // Admin approval status
  approvedBy?: ObjectId;      // Admin who approved
  createdBy?: ObjectId;       // User who created
  updatedBy?: ObjectId;       // User who last updated
  createdAt: Date;
  updatedAt: Date;
}
```

#### **Indexes**
- `personId1` (ascending)
- `personId2` (ascending)
- `relationType` (ascending)
- `isApproved` (ascending)
- `personId1 + personId2` (unique compound index)

#### **Validation**
- Pre-save hook prevents self-relationships
- Unique constraint prevents duplicate relationships
- Description limited to 500 characters

### 🔒 Security & Authorization

#### **Access Control**
✅ Authentication required for all endpoints
✅ Users can only view their own relationships
✅ Users can only edit/delete relationships they're part of
✅ Admins have full access to all relationships

#### **Data Protection**
- Populated user data includes only necessary fields
- Authorization checks before modifications
- Confirmation dialogs for deletions

#### **Admin Privileges**
- Auto-approval for admin-created relationships
- Can modify any relationship
- Can delete any relationship
- Full visibility into all relationships

### 🎯 Business Logic

#### **Relationship Creation**
1. User searches for family member
2. Selects relationship type
3. Optionally adds description
4. System checks for duplicates
5. Creates bidirectional relationship
6. Auto-approves if created by admin

#### **Duplicate Prevention**
The system prevents duplicate relationships by checking both directions:
- User A → User B
- User B → User A

#### **Relationship Display**
- Shows the "other person" from current user's perspective
- Displays relationship type as defined
- Shows approval status
- Includes creator and creation date

### 📱 User Experience

#### **Visual Feedback**
- ✅ Toast notifications for all actions
- ✅ Loading states during API calls
- ✅ Confirmation dialogs for deletions
- ✅ Empty states with guidance
- ✅ Approval status indicators

#### **Status Indicators**
- **Green CheckCircle**: Approved relationship
- **Yellow Clock**: Pending approval
- **Red AlertCircle**: Error or rejected

#### **Interactive Elements**
- Hover effects on relationship cards
- Smooth transitions and animations
- Modal dialogs for forms
- Integrated search with dropdown

### 🔄 Integration with Search

The relationship management system is fully integrated with the search feature:

1. **Search Bar in Add Dialog**
   - Real-time user search
   - Filter by name, gothiram, place
   - Shows user avatars and details
   - Instant selection

2. **User Preview**
   - Shows selected user's information
   - Displays gothiram and location
   - Avatar visualization
   - Confirmation before adding

### 📊 Data Population

Relationships are populated with:
- **User Data**: firstName, lastName, profilePicture, gothiram, nativePlace
- **Creator Data**: firstName, lastName
- **Timestamps**: createdAt, updatedAt

### 🧪 Testing Scenarios

#### **Positive Cases**
1. ✅ Create relationship with valid user
2. ✅ Edit relationship type
3. ✅ Delete own relationship
4. ✅ Admin creates auto-approved relationship
5. ✅ View all relationships

#### **Negative Cases**
1. ❌ Create relationship with self → Error
2. ❌ Duplicate relationship → Error
3. ❌ Invalid relationship type → Error
4. ❌ Non-existent user → Error
5. ❌ Unauthorized edit/delete → Error

#### **Edge Cases**
- Empty relationships list
- Very long descriptions (500 char limit)
- Concurrent edits
- Network failures

### 🚀 Usage Guide

#### **For Users**

1. **Add a Relationship:**
   - Go to Dashboard → My Relationships
   - Click "Add Relationship"
   - Search for family member
   - Select relationship type
   - Add optional description
   - Click "Add Relationship"

2. **Edit a Relationship:**
   - Find the relationship in your list
   - Click the Edit button (pencil icon)
   - Update type or description
   - Click "Update Relationship"

3. **Delete a Relationship:**
   - Find the relationship in your list
   - Click the Delete button (trash icon)
   - Confirm deletion

#### **For Admins**

Admins have all user capabilities plus:
- Auto-approval of created relationships
- Ability to edit any relationship
- Ability to delete any relationship
- Full visibility into all relationships

### 🎨 UI Components Used

- **Card**: Container for relationship management
- **Dialog**: Modal for add/edit forms
- **Button**: Action triggers
- **Select**: Relationship type picker
- **Textarea**: Description input
- **Badge**: Status and type indicators
- **Avatar**: User profile pictures
- **Toast**: Success/error notifications
- **SearchBar**: User search integration

### 🔮 Future Enhancements

Planned features:
- [ ] Relationship approval workflow for non-admins
- [ ] Relationship suggestions based on existing data
- [ ] Bi-directional relationship mapping (e.g., Father ↔ Son)
- [ ] Relationship verification by both parties
- [ ] Relationship history/audit log
- [ ] Export relationships to family tree diagram
- [ ] Relationship statistics and insights
- [ ] Bulk relationship import
- [ ] Relationship notifications
- [ ] Privacy controls per relationship

### 📈 Performance

#### **Optimizations**
- Indexed database queries
- Populated data in single query
- Efficient duplicate checking
- Client-side caching
- Debounced search

#### **Scalability**
- Compound indexes for fast lookups
- Efficient pagination (future)
- Minimal data transfer
- Optimistic UI updates

### 🐛 Common Issues & Solutions

**Issue:** "Relationship already exists"
- **Solution:** Check if relationship is already mapped in either direction

**Issue:** "Cannot create relationship with oneself"
- **Solution:** Select a different user from search

**Issue:** Toast notifications not showing
- **Solution:** Ensure Toaster component is in layout.tsx

**Issue:** Search not working in dialog
- **Solution:** Verify user is authenticated and approved

### 📝 Code Examples

#### **Add Relationship (Client)**
```typescript
const response = await fetch("/api/relationships", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    personId2: selectedUser._id,
    relationType: "Father",
    description: "My father from Rajasthan"
  })
});
```

#### **Delete Relationship (Client)**
```typescript
const response = await fetch(`/api/relationships/${relationshipId}`, {
  method: "DELETE"
});
```

#### **Query Relationships (API)**
```typescript
const relationships = await Relationship.find({
  $or: [
    { personId1: userId },
    { personId2: userId }
  ]
})
.populate('personId1 personId2 createdBy')
.sort({ createdAt: -1 });
```

---

## Summary

The relationship management system provides a complete solution for:
- ✅ Adding family connections
- ✅ Editing relationship details
- ✅ Removing relationships
- ✅ Searching for family members
- ✅ Tracking approval status
- ✅ Maintaining data integrity
- ✅ Providing excellent UX

It's fully integrated with the search feature and provides a solid foundation for building a comprehensive family tree visualization.

---

Last Updated: October 10, 2025
Version: 1.0.0

