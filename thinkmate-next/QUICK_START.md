# 🚀 Quick Start Guide - ThinkMate Advanced Features

## What's New? ✨

Your ThinkMate application now has **50+ advanced note-taking features**! Here's how to use them:

---

## 🎯 How to See the New Features

### 1. **Start the Server**
```bash
cd thinkmate-next
npm run dev
```
Open: http://localhost:3000

### 2. **Sign In**
Log in with your Google account (or create an account if needed)

### 3. **Go to Dashboard**
Navigate to `/dashboard` to see all your notes

---

## 🔥 Key Features You'll See Immediately

### **In the Notes List:**

1. **Search Bar with Filters** (at the top)
   - Click the filter icon to access advanced search
   - Filter by tags, categories, date range, favorites
   
2. **View Tabs**
   - **All Notes** - See all your notes
   - **⭐ Favorites** - Only favorited notes
   - **📦 Archived** - Archived notes

3. **Enhanced Note Cards**
   - Tags displayed as colored badges
   - Hover to see quick action buttons (favorite, archive)
   - Click any note to view full details

### **When You Click a Note:**

You'll see a modal with these new buttons:
- **⭐ Favorite** - Star/unstar the note
- **📦 Archive** - Archive/unarchive
- **📋 Copy** - Copy content to clipboard
- **📄 Export** - Export to PDF, Markdown, HTML, Text, or JSON
- **🔗 Share** - Share with permissions and link generation
- **✏️ Edit** - Open the full-featured editor

### **When You Edit a Note:**

The **Enhanced Note Editor** opens with:

#### **Three Tabs:**
1. **Edit Tab**
   - Rich text editor with full formatting toolbar
   - Tag input with autocomplete
   - Category selector
   - Switch between Rich Text and Plain Text modes

2. **Attachments Tab**
   - Drag-and-drop file upload
   - View all attachments
   - Download or delete files
   - Supports images, PDFs, documents, videos, audio

3. **Version History Tab**
   - See all previous versions
   - Preview any version side-by-side
   - Restore to any previous version
   - Add labels and comments

---

## 📝 Creating Notes with Advanced Features

### **Option 1: Use AI Generator (existing)**
1. Go to dashboard
2. Use the AI Note Generator
3. After generating, the note is saved with basic fields

### **Option 2: Edit Any Note**
1. Click any existing note
2. Click **"Edit"**
3. You'll see the full editor with:
   - Rich text formatting
   - Tag management
   - Category assignment
   - File attachments
   - Version history

---

## 🎨 Rich Text Editor Features

### **Toolbar Buttons:**
- **Bold, Italic, Underline, Strikethrough, Code**
- **Headings** (H1 through H6)
- **Lists** (bullet, numbered, checklists)
- **Alignment** (left, center, right, justify)
- **Text Color** and **Highlight Color**
- **Links** - Insert hyperlinks
- **Code Blocks** - For programming code
- **Blockquotes** - For quotes
- **Tables** - Insert and edit tables
- **Horizontal Rules** - Dividers
- **Undo/Redo**

### **Keyboard Shortcuts:**
- `Ctrl+B` or `Cmd+B` - Bold
- `Ctrl+I` or `Cmd+I` - Italic
- `Ctrl+U` or `Cmd+U` - Underline
- `Ctrl+Z` or `Cmd+Z` - Undo
- `Ctrl+Shift+Z` or `Cmd+Shift+Z` - Redo

---

## 🏷️ Using Tags

1. **Add Tags While Editing:**
   - Type in the tags input field
   - Press Enter or comma to add
   - Suggestions appear as you type
   - Each tag gets a unique color

2. **Search by Tags:**
   - Click the filter icon in search
   - Select one or more tags
   - Results show notes with those tags

---

## 📁 Using Categories

1. **Create Categories:**
   - Currently done via API (UI coming soon)
   - Or use the API: `POST /api/categories`

2. **Assign Categories:**
   - In the note editor
   - Use the category dropdown
   - Select a category or leave blank

3. **Filter by Category:**
   - Use advanced search filters
   - Select category from dropdown

---

## 📎 Attaching Files

1. **In Edit Mode:**
   - Click **"Attachments"** tab
   - Drag and drop files OR click to browse
   - Max 50MB per file
   - Supports: Documents, Images, Videos, Audio, Archives

2. **View Attachments:**
   - See all uploaded files
   - Click download icon to download
   - Click delete icon to remove

---

## 📄 Exporting Notes

1. **Open a Note:**
   - Click any note to view

2. **Click "Export" Button:**
   - Choose format:
     - **PDF** - For printing or archiving
     - **Markdown** - For GitHub, Obsidian, etc.
     - **HTML** - Standalone web page
     - **Text** - Plain text version
     - **JSON** - Complete data export

3. **File Downloads Automatically**

---

## 🔗 Sharing Notes

1. **Open a Note** and click **"Share"**

2. **Configure Share Settings:**
   - **Permission Level:**
     - View only
     - Comment (planned)
     - Edit
     - Admin
   
   - **Optional Settings:**
     - Password protection
     - Expiration date
     - Allow/disallow downloads
     - Allow/disallow printing
     - Require sign-in

3. **Generate Link:**
   - Click "Create Share Link"
   - Copy the URL
   - Send to recipients

4. **Manage Shares:**
   - View all shares in dashboard (planned)
   - Revoke access anytime
   - Track who viewed

---

## ⏱️ Version History

1. **Edit a Note:**
   - Changes are auto-saved as versions

2. **View Versions:**
   - Click "Version History" tab
   - See all previous versions with timestamps

3. **Restore a Version:**
   - Click a version to preview
   - Click "Restore This Version"
   - Current content is replaced

4. **Add Labels:**
   - Mark important versions
   - E.g., "Final Draft", "Approved Version"

---

## 🔍 Advanced Search

1. **Click Filter Icon** (beside search bar)

2. **Set Criteria:**
   - **Search Text** - Full-text search
   - **Tags** - Select multiple tags
   - **Category** - Choose a category
   - **Date Range** - From/To dates
   - **Quick Filters** - Favorites or Archived

3. **Apply Filters:**
   - Click "Apply Filters"
   - Results update instantly

4. **Reset:**
   - Click "Reset" to clear all filters

---

## ⭐ Organization Features

### **Favorites:**
- Click the star icon on any note
- Access via "⭐ Favorites" tab
- Quick way to mark important notes

### **Archive:**
- Click the archive icon (📦)
- Removes from main view
- Access via "📦 Archived" tab
- Not deleted, just hidden

### **Trash** (Coming Soon):
- Soft delete with 30-day recovery
- Permanent delete option

---

## 🎯 API Endpoints (for developers)

All features have REST API endpoints:

```
# Notes
GET    /api/notes
POST   /api/notes
PATCH  /api/notes
DELETE /api/notes?id=

# Advanced Note Operations
PATCH  /api/notes/[id]/favorite
PATCH  /api/notes/[id]/archive
PATCH  /api/notes/[id]/trash

# Tags & Categories
GET    /api/tags
GET    /api/categories
POST   /api/categories

# Attachments
POST   /api/attachments/upload
GET    /api/attachments/[noteId]
DELETE /api/attachments/[noteId]?id=

# Versions
GET    /api/notes/[id]/versions
POST   /api/notes/[id]/versions
POST   /api/notes/[id]/restore

# Sharing
GET    /api/share
POST   /api/share
PATCH  /api/share
DELETE /api/share?id=
GET    /api/shared/[shareLink]
```

---

## 🐛 Troubleshooting

### **Not seeing new features?**
1. Hard refresh your browser (`Ctrl+Shift+R` or `Cmd+Shift+R`)
2. Clear browser cache
3. Restart the dev server

### **Styles look broken?**
- Make sure TailwindCSS is compiled
- Check browser console for errors

### **Components not loading?**
- Check if all dependencies installed: `npm install`
- Look for errors in terminal

### **File uploads not working?**
- Check `/public/uploads/` folder exists
- Verify file size (max 50MB)

---

## 📚 Full Documentation

- **FEATURES.md** - Complete feature documentation
- **README_ADVANCED_FEATURES.md** - Technical implementation details
- Component source code is well-documented

---

## 🎉 Tips for Best Experience

1. **Use Rich Text Editor:**
   - Click any note → Edit → Toggle "Rich Text" mode
   - Use the formatting toolbar

2. **Organize with Tags:**
   - Add tags to all notes
   - Use consistent naming (lowercase)

3. **Try Templates** (planned):
   - Quick start with pre-built formats
   - Meeting notes, project plans, etc.

4. **Export Important Notes:**
   - Regular backups as JSON
   - Share as PDF with colleagues

5. **Use Version History:**
   - Safe to experiment
   - Always can restore previous versions

---

## 🚀 What's Next?

All Phase 1-3 features are LIVE! Coming in future updates:
- Real-time collaboration
- More templates
- Mobile app
- AI-powered suggestions

---

## 💬 Need Help?

- Check the comprehensive docs in `FEATURES.md`
- Look at component source code (well-commented)
- API is RESTful and intuitive

---

**Enjoy your enhanced note-taking experience!** 🎊
