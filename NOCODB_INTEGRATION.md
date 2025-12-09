# NocoDB Integration - Quick Start Guide

## What Was Implemented

A fully functional, dynamic CRUD system powered by NocoDB that integrates seamlessly with Payload CMS and Next.js.

## 📁 Files Created

### Core Components
- `src/blocks/TableBlock/Component.tsx` - Main server component
- `src/blocks/TableBlock/DataTable.tsx` - Client-side table with CRUD UI
- `src/blocks/TableBlock/DynamicForm.tsx` - Dynamic form generator
- `src/blocks/TableBlock/README.md` - Component documentation

### Services
- `src/services/nocodb.ts` - NocoDB service wrapper with all CRUD methods

### API Routes
- `src/app/api/nocodb/columns/route.ts` - Fetch table metadata
- `src/app/api/nocodb/rows/route.ts` - Handle CRUD operations

### UI Components (ShadCN)
- `src/components/ui/dialog.tsx` - Modal dialogs
- `src/components/ui/table.tsx` - Table component
- `src/components/ui/form.tsx` - Form components

### Configuration
- Updated `src/providers/index.tsx` - Added Toaster for notifications
- Updated `.env.example` - Added NocoDB configuration

## 🚀 Quick Start

### 1. Set Up Environment Variables

Create a `.env` file (or update your existing one):

```bash
# NocoDB Configuration
NOCODB_URL=https://your-nocodb-instance.com
NOCODB_API_TOKEN=your_api_token_here
```

### 2. Use TableBlock

In your Payload CMS, add the TableBlock to any page with just the table name:

```typescript
// Example in a page or layout block
<TableBlock source="tasks" />
```

**That's it!** Just provide the table name, and the system will:
- Automatically search across all your NocoDB bases
- Find the matching table (by title or table name)
- Load and display the data

### 3. How It Works

The system automatically:
1. Fetches all your NocoDB bases
2. Searches through tables in each base
3. Finds the first table matching your source name (case-insensitive)
4. Loads the table structure and data

**No need to know base IDs or table IDs!**

## ✨ Features

### Automatic Features
- ✅ Reads table schema from NocoDB
- ✅ Generates forms automatically based on column types
- ✅ Handles all data types (text, number, date, checkbox, etc.)
- ✅ Validates required fields
- ✅ Shows loading states
- ✅ Toast notifications for success/errors
- ✅ Responsive design

### CRUD Operations
- **Create**: Click "Add Record" button
- **Read**: Table displays all records
- **Update**: Click edit icon on any row
- **Delete**: Click trash icon with confirmation dialog

## 🎨 UI Components Used

All components use **ShadCN UI** with **TailwindCSS**:
- Buttons
- Tables
- Forms (with react-hook-form)
- Dialogs/Modals
- Input fields (text, number, date, checkbox, textarea)
- Toast notifications (Sonner)

## 🔒 Security

- ✅ API tokens stored server-side only
- ✅ Client never communicates directly with NocoDB
- ✅ All requests go through Next.js API routes
- ✅ Environment variables not exposed to browser

## 📊 Example Use Cases

### 1. Customer Management
```tsx
<TableBlock source="customers" />
```

### 2. Task Tracking
```tsx
<TableBlock source="tasks" />
```

### 3. Employee Directory
```tsx
<TableBlock source="employees" />
```

### 4. Product Catalog
```tsx
<TableBlock source="products" />
```

**Note**: Just use the table name - the system automatically finds it across all your bases!

## 🛠️ Advanced Configuration

### Customizing Row Limit

Edit `src/blocks/TableBlock/Component.tsx`:

```typescript
NocoDBService.getRows(baseId, tableId, { limit: 200 }) // Change from 100 to 200
```

### Adding Sorting

The API supports sorting. Update the DataTable component to add sort controls:

```typescript
NocoDBService.getRows(baseId, tableId, {
  limit: 100,
  sort: '-created_at' // Sort by created_at descending
})
```

### Filtering

Add a where clause:

```typescript
NocoDBService.getRows(baseId, tableId, {
  where: '(status,eq,active)'
})
```

## 🐛 Debugging

### Check if NocoDB is accessible

```bash
curl -X GET "https://your-nocodb.com/api/v1/db/meta/projects" \
  -H "xc-auth: YOUR_API_TOKEN"
```

### Check Next.js API routes

```bash
# Test columns endpoint
curl http://localhost:3000/api/nocodb/columns?source=base.table

# Test rows endpoint
curl http://localhost:3000/api/nocodb/rows?source=base.table
```

### Enable debug logging

Add console.logs in `src/services/nocodb.ts` to see request/response data.

## 📝 Type Mappings

| NocoDB Type | HTML Input Type | Component |
|-------------|-----------------|-----------|
| SingleLineText | text | Input |
| LongText | textarea | Textarea |
| Email | email | Input |
| URL | url | Input |
| PhoneNumber | tel | Input |
| Number | number | Input |
| Decimal | number | Input |
| Currency | number | Input |
| Checkbox | checkbox | Checkbox |
| Date | date | Input |
| DateTime | datetime-local | Input |
| Time | time | Input |

## 🎯 Next Steps

1. **Test the integration**: Create a simple table in NocoDB and display it
2. **Customize styling**: Modify TailwindCSS classes to match your design
3. **Add features**: Implement pagination, sorting, or filtering as needed
4. **Extend types**: Add support for relation fields or file uploads

## 💡 Tips

- Start with a simple table (few columns, basic types)
- Test CRUD operations one at a time
- Check browser console and server logs for errors
- Use NocoDB's API Explorer to verify your table structure
- Keep your API token secure (never commit to git)

## 📚 Resources

- [NocoDB Documentation](https://docs.nocodb.com/)
- [NocoDB API Reference](https://docs.nocodb.com/developer-resources/rest-apis/)
- [Payload CMS Documentation](https://payloadcms.com/docs)
- [ShadCN UI Components](https://ui.shadcn.com/)

---

**Need Help?**

Check the component README at `src/blocks/TableBlock/README.md` for detailed documentation.
