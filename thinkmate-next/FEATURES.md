# ThinkMate Advanced Features Documentation

This document describes all the advanced note-taking features implemented in ThinkMate.

## Table of Contents

1. [Rich Text Editor](#1-rich-text-editor)
2. [File Attachments](#2-file-attachments)
3. [Tags and Categories](#3-tags-and-categories)
4. [Note Templates](#4-note-templates)
5. [Version History](#5-version-history)
6. [Export Features](#6-export-features)
7. [Note Sharing](#7-note-sharing)
8. [Advanced Search](#8-advanced-search)
9. [Organization Features](#9-organization-features)

---

## 1. Rich Text Editor

### Features
- **Text Formatting**: Bold, italic, underline, strikethrough, inline code
- **Headings**: H1 through H6
- **Lists**: Bullet lists, numbered lists, and interactive checklists
- **Alignment**: Left, center, right, and justify
- **Colors**: Text color and background highlighting with color picker
- **Links**: Insert and edit hyperlinks
- **Code Blocks**: Syntax-highlighted code blocks
- **Blockquotes**: Quote formatting
- **Tables**: Insert and edit tables with rows/columns
- **Undo/Redo**: Full history management

### Implementation
- Built with **TipTap**, a modern headless editor
- All content stored as HTML in MongoDB
- Maintains backward compatibility with plain text notes
- Keyboard shortcuts (Ctrl+B for bold, etc.)
- Mobile-responsive with touch support

### Usage
```typescript
import RichTextEditor from '@/components/editor/RichTextEditor';

<RichTextEditor
  content={content}
  onChange={setContent}
  placeholder="Start writing..."
/>
```

---

## 2. File Attachments

### Features
- **Upload Methods**: Drag-and-drop or click to upload
- **Supported Types**: 
  - Documents (PDF, DOC, DOCX)
  - Images (JPG, PNG, GIF, WebP)
  - Videos (MP4, MOV)
  - Audio (MP3, WAV)
  - Archives (ZIP, RAR)
- **Size Limits**: 50MB per file
- **Preview**: In-app preview for images and PDFs
- **Management**: Download and delete attachments
- **Metadata**: Shows filename, size, upload date

### API Endpoints
- `POST /api/attachments/upload` - Upload a file
- `GET /api/attachments/[noteId]` - List attachments
- `DELETE /api/attachments/[noteId]?id=attachmentId` - Delete attachment

### Storage
Files are currently stored in `/public/uploads`. For production, consider using:
- AWS S3
- Cloudinary
- UploadThing

### Usage
```typescript
import FileUpload from '@/components/notes/FileUpload';
import AttachmentList from '@/components/notes/AttachmentList';

<FileUpload noteId={noteId} onUploadSuccess={handleUpload} />
<AttachmentList attachments={attachments} onDelete={handleDelete} />
```

---

## 3. Tags and Categories

### Tags
- **Multiple Tags**: Assign multiple tags per note
- **Auto-suggest**: Suggests existing tags while typing
- **Color Coding**: Each tag gets a consistent color
- **Statistics**: Shows count of notes per tag
- **Filtering**: Click tag to filter notes

### Categories
- **Hierarchical**: Support for nested categories
- **Custom Colors**: Assign colors to categories
- **Icons**: Optional emoji or icon for each category
- **Single Assignment**: Each note can belong to one category

### API Endpoints
- `GET /api/tags` - Get all tags with usage counts
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category
- `PATCH /api/categories` - Update category
- `DELETE /api/categories?id=categoryId` - Delete category

### Usage
```typescript
import TagInput from '@/components/editor/TagInput';
import CategorySelector from '@/components/editor/CategorySelector';

<TagInput tags={tags} onChange={setTags} suggestions={availableTags} />
<CategorySelector value={categoryId} onChange={setCategoryId} categories={categories} />
```

---

## 4. Note Templates

### Built-in Templates
1. **Meeting Notes** - Date, Attendees, Agenda, Action Items
2. **Project Plan** - Overview, Goals, Milestones, Tasks
3. **Daily Journal** - Date, Mood, Gratitude, Goals, Reflections
4. **Book Notes** - Title, Author, Key Takeaways, Quotes
5. **Recipe** - Ingredients, Instructions, Prep Time, Servings
6. **Bug Report** - Title, Steps to Reproduce, Expected/Actual Behavior
7. **Weekly Review** - Accomplishments, Challenges, Next Week Goals

### Features
- **Custom Templates**: Users can create their own templates
- **Variables**: Support for placeholders like {{date}}, {{user}}, {{time}}
- **Rich Formatting**: Templates support full rich text formatting
- **Quick Create**: "New from Template" button
- **Share Templates**: Export/import templates as JSON

### API Endpoints
- `GET /api/templates` - List all templates (user's + public)
- `POST /api/templates` - Create new template
- `PATCH /api/templates` - Update template
- `DELETE /api/templates?id=templateId` - Delete template
- `POST /api/templates/[id]/create-note` - Create note from template

### Usage
```typescript
import TemplateLibrary from '@/components/notes/TemplateLibrary';

<TemplateLibrary onSelectTemplate={handleSelectTemplate} />
```

---

## 5. Version History

### Features
- **Auto-save Versions**: Automatically saved on significant edits
- **Manual Snapshots**: "Save Version" button for important milestones
- **Version List**: Timeline view showing all versions with dates
- **Comparison**: Side-by-side diff view showing changes
- **Restore**: Revert to any previous version
- **Labels**: Add custom labels to versions (e.g., "Final Draft")
- **Comments**: Add notes explaining changes
- **Version Limit**: Keeps last 50 versions per note

### API Endpoints
- `GET /api/notes/[id]/versions` - List all versions
- `POST /api/notes/[id]/versions` - Create new version snapshot
- `POST /api/notes/[id]/restore` - Restore from a version

### Usage
```typescript
import VersionHistory from '@/components/notes/VersionHistory';

<VersionHistory noteId={noteId} onRestore={handleRestore} />
```

---

## 6. Export Features

### Supported Formats

#### PDF Export
- Preserves rich formatting
- Custom styling
- Page layout
- Metadata included

#### Microsoft Word (.docx)
- Full formatting support
- Compatible with Word 2016+
- Note: Requires additional implementation

#### Markdown (.md)
- Converts rich text to markdown
- Preserves headings, lists, links
- Code blocks with language tags
- Includes tags as hashtags

#### HTML (.html)
- Standalone HTML file
- Inline CSS styling
- Embedded metadata

#### Plain Text (.txt)
- Strips all formatting
- Clean, readable text

#### JSON Export
- Complete note data including metadata
- For backup and data portability

### Usage
```typescript
import ExportMenu from '@/components/notes/ExportMenu';
import { exportToPDF, exportToMarkdown } from '@/lib/export';

// Using component
<ExportMenu note={note} />

// Using functions directly
exportToPDF(note);
exportToMarkdown(note);
```

---

## 7. Note Sharing

### Features

#### Share Options
- **Specific Users**: Share with users by email
- **Shareable Link**: Generate unique link
- **Public Notes**: Anyone with link can view
- **Team Sharing**: Share with workspace members

#### Permission Levels
- **View**: Can only read the note
- **Comment**: Can add comments but not edit
- **Edit**: Can modify note content
- **Admin**: Can edit + manage permissions + delete

#### Share Settings
- **Expiration**: Set expiration date (link expires after X days)
- **Password Protection**: Require password to access
- **Download Control**: Allow/disallow downloading
- **Print Control**: Allow/disallow printing
- **Require Sign-in**: Require authentication to view
- **View Tracking**: Track who viewed and when

#### Collaboration
- Activity log (who made what changes)
- Notification when someone views/edits
- Share management interface

### API Endpoints
- `GET /api/share` - List user's shares
- `POST /api/share` - Create new share
- `PATCH /api/share` - Update share permissions
- `DELETE /api/share?id=shareId` - Revoke share
- `GET /api/shared/[shareLink]` - Access shared note
- `POST /api/shared/[shareLink]` - Verify password for protected share

### Usage
```typescript
import ShareModal from '@/components/notes/ShareModal';

<ShareModal
  noteId={noteId}
  onClose={handleClose}
  onShareCreated={handleShareCreated}
/>
```

---

## 8. Advanced Search

### Features

#### Search Capabilities
- **Full-text Search**: Search across title and content
- **Tag Filtering**: Filter by multiple tags
- **Category Filtering**: Browse by category
- **Date Range**: Filter by creation/modification date
- **Quick Filters**: Favorites, archived notes
- **Combined Filters**: Use multiple filters simultaneously

#### Search UI
- Collapsible advanced filters
- Tag selection with visual indicators
- Category dropdown
- Date range pickers
- Active filter count badge
- Reset filters button

### Usage
```typescript
import AdvancedSearch from '@/components/notes/AdvancedSearch';

<AdvancedSearch
  onSearch={handleSearch}
  availableTags={tags}
  availableCategories={categories}
/>
```

---

## 9. Organization Features

### Favorites
- **Star Notes**: Mark important notes as favorites
- **Quick Access**: Filter to show only favorites
- **Visual Indicator**: Star icon on favorite notes

**API**: `PATCH /api/notes/[id]/favorite`

### Archive
- **Hide Notes**: Archive notes to hide from main list
- **Not Deleted**: Archived notes are not deleted
- **Restore**: Unarchive anytime

**API**: `PATCH /api/notes/[id]/archive`

### Trash
- **Soft Delete**: Notes moved to trash, not permanently deleted
- **30-day Auto-delete**: Automatically delete after 30 days
- **Restore**: Recover deleted notes
- **Permanent Delete**: Option to permanently delete

**API**: `PATCH /api/notes/[id]/trash`

### Pin Notes
- **Pin to Top**: Keep important notes at the top of the list
- **Visual Indicator**: Pin icon on pinned notes

### Color Coding
- **Custom Colors**: Assign colors to notes for visual organization
- **Color Picker**: Choose from preset colors

### Folders/Workspaces
- Organize notes into projects or workspaces
- Hierarchical organization

---

## Database Models

### Note Model
```typescript
{
  userId: string;
  title: string;
  content: string;
  prompt: string;
  action: 'generate' | 'notes' | 'expand' | 'summarize';
  isRichText: boolean;
  tags: string[];
  categoryId: string;
  isFavorite: boolean;
  isArchived: boolean;
  isPinned: boolean;
  color: string;
  isDeleted: boolean;
  deletedAt: Date;
  wordCount: number;
  readTime: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Category Model
```typescript
{
  userId: string;
  name: string;
  parentId: string;
  color: string;
  icon: string;
  description: string;
  order: number;
}
```

### Template Model
```typescript
{
  userId: string;
  name: string;
  description: string;
  content: string;
  category: string;
  isPublic: boolean;
  isRichText: boolean;
  variables: string[];
  thumbnail: string;
  usageCount: number;
}
```

### NoteVersion Model
```typescript
{
  noteId: string;
  userId: string;
  title: string;
  content: string;
  version: number;
  label: string;
  comment: string;
  changes: {
    added: number;
    removed: number;
  };
  createdAt: Date;
}
```

### Attachment Model
```typescript
{
  noteId: string;
  userId: string;
  filename: string;
  originalName: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: 'document' | 'image' | 'video' | 'audio' | 'archive' | 'other';
  thumbnailUrl: string;
  metadata: object;
  uploadedAt: Date;
}
```

### Share Model
```typescript
{
  noteId: string;
  sharedBy: string;
  sharedWith: string[];
  shareLink: string;
  permissions: 'view' | 'comment' | 'edit' | 'admin';
  expiresAt: Date;
  password: string;
  allowDownload: boolean;
  allowPrint: boolean;
  requireSignIn: boolean;
  views: Array<{
    userId: string;
    viewedAt: Date;
    ipAddress: string;
  }>;
  isActive: boolean;
  revokedAt: Date;
}
```

---

## Component Architecture

```
src/
├── components/
│   ├── editor/
│   │   ├── RichTextEditor.tsx       # TipTap editor
│   │   ├── EditorMenuBar.tsx        # Formatting toolbar
│   │   ├── TagInput.tsx             # Tag input with autocomplete
│   │   └── CategorySelector.tsx    # Category dropdown
│   └── notes/
│       ├── EnhancedNoteEditor.tsx   # Full editor with tabs
│       ├── FileUpload.tsx           # Drag-drop upload
│       ├── AttachmentList.tsx       # Attachment management
│       ├── VersionHistory.tsx       # Version viewer
│       ├── TemplateLibrary.tsx      # Template browser
│       ├── ShareModal.tsx           # Share configuration
│       ├── ExportMenu.tsx           # Export dropdown
│       └── AdvancedSearch.tsx       # Search filters
├── models/
│   ├── Note.ts                      # Enhanced note model
│   ├── Category.ts
│   ├── Template.ts
│   ├── NoteVersion.ts
│   ├── Attachment.ts
│   └── Share.ts
└── lib/
    └── export.ts                    # Export utilities
```

---

## Installation & Setup

### 1. Install Dependencies
```bash
npm install @tiptap/react @tiptap/starter-kit @tiptap/extension-color \
  @tiptap/extension-text-style @tiptap/extension-highlight \
  @tiptap/extension-link @tiptap/extension-table \
  @tiptap/extension-table-row @tiptap/extension-table-cell \
  @tiptap/extension-table-header @tiptap/extension-task-list \
  @tiptap/extension-task-item @tiptap/extension-text-align \
  @tiptap/extension-underline react-dropzone date-fns uuid \
  jspdf html2canvas turndown
```

### 2. Environment Variables
```env
MONGODB_URI=your_mongodb_connection_string
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
```

### 3. File Storage (Optional)
For production, configure cloud storage:
- AWS S3: Set up S3 bucket and credentials
- Cloudinary: Get API key and secret
- UploadThing: Get API token

---

## Usage Examples

### Creating a Note with All Features
```typescript
import EnhancedNoteEditor from '@/components/notes/EnhancedNoteEditor';

function NotePage() {
  const handleSave = (note) => {
    console.log('Note saved:', note);
  };

  return (
    <EnhancedNoteEditor
      onSave={handleSave}
    />
  );
}
```

### Searching Notes
```typescript
const [notes, setNotes] = useState([]);

const handleSearch = async (filters) => {
  const queryParams = new URLSearchParams();
  if (filters.query) queryParams.append('q', filters.query);
  if (filters.tags.length) queryParams.append('tags', filters.tags.join(','));
  if (filters.categoryId) queryParams.append('category', filters.categoryId);
  
  const response = await fetch(`/api/notes?${queryParams}`);
  const data = await response.json();
  setNotes(data.notes);
};
```

---

## Best Practices

### 1. Performance
- Implement pagination for large note lists
- Lazy load attachments
- Use virtual scrolling for long lists
- Optimize image uploads (compress, resize)

### 2. Security
- Validate file types and sizes
- Sanitize HTML content
- Hash passwords for protected shares
- Implement rate limiting on API routes

### 3. User Experience
- Auto-save drafts every 30 seconds
- Show loading states for async operations
- Provide feedback on actions (toasts, alerts)
- Support keyboard shortcuts

### 4. Data Management
- Archive old versions to reduce database size
- Implement trash auto-cleanup (30 days)
- Backup critical data regularly
- Monitor storage usage

---

## Future Enhancements

### Phase 1
- Real-time collaborative editing (WebSockets)
- Advanced markdown editor option
- Mobile app (React Native)

### Phase 2
- AI-powered suggestions and summaries
- Voice-to-text note creation
- OCR for image attachments
- Full-text search in PDFs

### Phase 3
- Team workspaces
- Role-based access control
- Audit logs
- Advanced analytics dashboard

---

## Support & Documentation

For issues or questions:
- GitHub Issues: [repository-url]
- Documentation: [docs-url]
- Email: support@thinkmate.app

---

## License

[Your License Here]

---

## Credits

Built with:
- Next.js 16
- TipTap Editor
- MongoDB
- Tailwind CSS
- React Dropzone
- jsPDF
- Turndown

---

**Last Updated**: February 2026
