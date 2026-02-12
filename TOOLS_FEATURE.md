# Tools Management Feature - Documentation

## Overview
The Tools Management feature allows administrators to add, edit, delete, and manage useful tools and website links for users. Each tool can include an icon, title, description, link, and active/inactive status.

## Features

### Admin Features
- ✅ Add new tools with auto-favicon fetching
- ✅ Edit existing tools
- ✅ Delete tools with confirmation
- ✅ Toggle tool visibility (on/off)
- ✅ Set display order
- ✅ Custom icon upload or use auto-fetched favicon
- ✅ Real-time preview of tools

### User Features
- ✅ Browse all active tools
- ✅ Click to visit tools in new tab
- ✅ Responsive grid layout
- ✅ Beautiful card design with hover effects
- ✅ Auto-loaded favicons from websites

## Files Created

### Backend
1. **`backend/models/Tool.js`** - MongoDB schema for tools
2. **`backend/routes/toolRoutes.js`** - API routes for CRUD operations
3. **`backend/server.js`** - Updated to include tool routes

### Frontend (User Site)
1. **`Witcet 3.0/src/components/Tools.jsx`** - User-facing tools page
2. **`Witcet 3.0/src/styles/Tools.css`** - Styling for tools page
3. **`Witcet 3.0/src/App.jsx`** - Updated with Tools route
4. **`Witcet 3.0/src/components/Navbar.jsx`** - Updated with Tools link

### Admin Dashboard
1. **`Admin-Dashboard/src/pages/ManageTools.jsx`** - Admin tool management page
2. **`Admin-Dashboard/src/pages/ManageTools.css`** - Admin styling
3. **`Admin-Dashboard/src/App.jsx`** - Updated with ManageTools route
4. **`Admin-Dashboard/src/components/Sidebar.jsx`** - Updated with Tools menu item

## API Endpoints

### GET /api/tools
- **Description**: Fetch all tools
- **Query Parameters**: 
  - `admin=true` - Include inactive tools (admin only)
- **Auth**: Not required (public)
- **Response**: Array of tool objects

### GET /api/tools/:id
- **Description**: Fetch single tool by ID
- **Auth**: Not required
- **Response**: Tool object

### POST /api/tools
- **Description**: Create new tool
- **Auth**: Required (Bearer token)
- **Body**:
  ```json
  {
    "title": "Tool Title",
    "description": "Tool description",
    "link": "https://example.com",
    "icon": "/images/custom-icon.png",
    "order": 0
  }
  ```
- **Response**: Created tool object with auto-fetched favicon

### PUT /api/tools/:id
- **Description**: Update existing tool
- **Auth**: Required (Bearer token)
- **Body**: Same as POST
- **Response**: Updated tool object

### PATCH /api/tools/:id/toggle
- **Description**: Toggle tool active status
- **Auth**: Required (Bearer token)
- **Response**: Updated tool object

### DELETE /api/tools/:id
- **Description**: Delete tool
- **Auth**: Required (Bearer token)
- **Response**: Success message

## Tool Schema

```javascript
{
  title: String,           // Required
  description: String,     // Required
  link: String,           // Required (full URL)
  icon: String,           // Optional custom icon path
  faviconUrl: String,     // Auto-fetched from website
  isActive: Boolean,      // Default: true
  order: Number,         // Display order (0 = first)
  createdAt: Date,       // Auto-generated
  updatedAt: Date        // Auto-updated on save
}
```

## Dependencies Added

### Backend
- `axios` - For fetching website content
- `cheerio` - For parsing HTML to extract favicon links

Install with:
```bash
cd backend
npm install axios cheerio
```

## Environment Variables

### Witcet 3.0/.env
```
VITE_API_BASE_URL=https://witcet-admin-dashboard.onrender.com
```

### Admin-Dashboard/.env
```
VITE_API_BASE_URL=https://witcet-admin-dashboard.onrender.com
```

## Favicon Fetching Logic

The system automatically attempts to fetch favicons in this order:
1. Parse HTML for `<link rel="icon">` or similar tags
2. Try common favicon locations:
   - `/favicon.ico`
   - `/favicon.png`
   - `/apple-touch-icon.png`
   - `/android-chrome-192x192.png`
3. Fallback to default SVG icon if all fail

## Usage Guide

### For Admins

1. **Navigate to Tools Management**
   - Login to Admin Dashboard
   - Click "Tools" in the sidebar

2. **Add a New Tool**
   - Click "Add New Tool" button
   - Fill in:
     - Title (e.g., "ChatGPT")
     - Description (brief explanation)
     - URL (full website URL)
     - Custom icon (optional)
     - Display order (optional, default 0)
   - Click "Add Tool"
   - System will automatically fetch the website's favicon

3. **Edit a Tool**
   - Click the blue edit icon on any tool
   - Update fields as needed
   - Click "Update Tool"

4. **Toggle Tool Status**
   - Click the eye/eye-slash icon to activate/deactivate
   - Inactive tools won't show to users

5. **Delete a Tool**
   - Click the red trash icon
   - Confirm deletion

### For Users

1. **Access Tools Page**
   - Navigate to `/tools` or click "Tools" in navbar

2. **Browse Tools**
   - View all active tools in a grid layout
   - See tool icon, title, and description

3. **Visit a Tool**
   - Click any tool card
   - Opens in a new tab

## Design Features

### User Interface
- Modern card-based layout
- Gradient backgrounds and hover effects
- Responsive design (mobile-friendly)
- Auto-sizing icon containers
- Loading and empty states

### Admin Interface
- Clean table layout
- Inline editing and status toggle
- Modal-based add/edit forms
- Icon preview in table
- Confirmation before delete
- Success/error notifications

## Future Enhancements

Potential improvements:
- [ ] Category/tags for tools
- [ ] Search and filter functionality
- [ ] Analytics (click tracking)
- [ ] Bulk operations
- [ ] Import/export tools
- [ ] User ratings and favorites
- [ ] Tool recommendations

## Troubleshooting

### Favicon not loading?
- Ensure the website URL is correct and accessible
- Some websites may block favicon fetching
- Use custom icon upload as alternative

### Tools not showing?
- Check if tools are marked as active
- Verify API connection
- Check browser console for errors

### Permission errors?
- Ensure admin token is valid
- Check authentication middleware

## Support

For issues or questions, contact the development team.
