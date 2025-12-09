# TableBlock - Updated Usage Guide

## ✨ What Changed

The `source` parameter is now **much simpler** - just provide the table name!

### Before (Old Format)
```tsx
<TableBlock source="baseId.tableId" />
// e.g., <TableBlock source="p123abc.t456def" />
```

### After (New Format) ✅
```tsx
<TableBlock source="tableName" />
// e.g., <TableBlock source="customers" />
```

---

## 🚀 How It Works Now

### Step 1: Just Use the Table Name

```tsx
<TableBlock source="tasks" />
<TableBlock source="customers" />
<TableBlock source="employees" />
<TableBlock source="products" />
```

### Step 2: The System Does the Rest

The TableBlock now automatically:
1. **Fetches all your NocoDB bases** using `NocoDBService.getBases()`
2. **Searches through all tables** using `NocoDBService.getTables(baseId)` for each base
3. **Finds your table** by matching the name (case-insensitive)
4. **Loads the data** and renders the table

### Step 3: Enjoy!

No more:
- ❌ Looking up base IDs
- ❌ Finding table IDs
- ❌ Constructing "baseId.tableId" strings

Just:
- ✅ Type the table name
- ✅ Done!

---

## 🔍 How Table Matching Works

The system matches tables by:
1. **Display Title** (what you see in NocoDB UI)
2. **Internal Table Name** (the database table name)

Both are case-insensitive, so these all work:
- `"customers"` = `"Customers"` = `"CUSTOMERS"`
- `"my_tasks"` = `"My_Tasks"` = `"MY_TASKS"`

**First Match Wins**: If you have multiple tables with the same name in different bases, the first one found will be used.

---

## 📝 Updated Examples

### Simple Tables
```tsx
// Project management
<TableBlock source="tasks" />
<TableBlock source="projects" />

// CRM
<TableBlock source="customers" />
<TableBlock source="contacts" />
<TableBlock source="deals" />

// HR
<TableBlock source="employees" />
<TableBlock source="departments" />

// E-commerce
<TableBlock source="products" />
<TableBlock source="orders" />
<TableBlock source="inventory" />
```

### Complete Page Example
```tsx
import { TableBlock } from '@/blocks/TableBlock/Component'

export default function CustomersPage() {
  return (
    <div>
      <h1>Customer Management</h1>
      <TableBlock source="customers" />
    </div>
  )
}
```

---

## 🎯 New Features Added

### 1. Automatic Base Discovery
- No need to know which base contains your table
- System searches all bases automatically

### 2. Smart Table Lookup
- Matches by title or table name
- Case-insensitive search
- First match is used

### 3. Table Title Display
- Shows the table's display title from NocoDB
- Shows the internal table name as subtitle
- Better context for users

### 4. Better Error Messages
```tsx
// If table not found:
"Error: Table 'xyz' not found"
"Make sure the table name is correct and exists in your NocoDB instance."

// If no source provided:
"Error: No data source specified"
"Please provide a table name (e.g., 'tasks' or 'customers')"
```

---

## 🔧 Technical Details

### New Service Methods

**NocoDBService.getBases()**
```typescript
// Fetches all NocoDB bases/projects
const bases = await NocoDBService.getBases()
// Returns: Array of { id, title, ... }
```

**NocoDBService.getTables(baseId)**
```typescript
// Fetches all tables in a base
const tables = await NocoDBService.getTables('base123')
// Returns: Array of { id, title, table_name, ... }
```

**NocoDBService.findTableByName(tableName)**
```typescript
// Searches all bases for a table
const result = await NocoDBService.findTableByName('customers')
// Returns: { table: {...}, baseId: 'base123' } or null
```

### Internal Source Format

While you provide just the table name, internally the system:
1. Finds the table and gets its `baseId` and `tableId`
2. Constructs an internal source: `"baseId.tableId"`
3. Uses this for API calls to maintain compatibility

So the API routes still work with the `"baseId.tableId"` format internally.

---

## ⚡ Performance Notes

### First Load
The first time a table is loaded, the system:
1. Fetches all bases (1 API call)
2. Fetches tables for each base (N API calls, where N = number of bases)
3. Finds the matching table
4. Loads the data

This typically takes a few seconds depending on how many bases you have.

### Optimization Ideas
If you have many bases and want to optimize:

**Option 1: Cache base/table list**
```typescript
// Could add caching in the service
static cachedBases: NocoDBBase[] | null = null
```

**Option 2: Specify base hint** (future enhancement)
```tsx
<TableBlock source="customers" baseHint="crm" />
```

**Option 3: Use old format** (still supported internally)
```tsx
// If you know the IDs, you can still pass them directly to API routes
// But not recommended for user-facing source prop
```

---

## 🐛 Troubleshooting

### "Table not found" error

**Check 1**: Verify the table name
- Go to NocoDB and check the exact table name
- Try copying it directly from NocoDB

**Check 2**: Check table name vs title
- NocoDB has two names: display title and internal table_name
- The system checks both, but try the exact one shown in NocoDB

**Check 3**: Check API token permissions
- Make sure your API token has access to all bases
- Test with NocoDB API Explorer

### Slow loading

**Cause**: Many bases to search through
- Each base requires an API call to list tables

**Solution**: 
- Reduce number of bases in NocoDB
- Or wait for caching feature
- Or filter to specific base (future enhancement)

### Multiple tables with same name

**Behavior**: First match is used

**Solution**: 
- Rename tables to be unique
- Or manually specify base (future enhancement)

---

## 📚 Migration Guide

### If You Were Using Old Format

**Before:**
```tsx
<TableBlock source="p_abc123.nc_def456" />
```

**After:**
```tsx
<TableBlock source="my_table" />
```

### No Code Changes Needed!

The old internal format (`"baseId.tableId"`) is still used by:
- API routes
- DataTable component
- Internal service methods

Only the **user-facing** `source` prop is simplified.

---

## ✅ Summary

**Old Way**: 
- Manual lookup of base ID and table ID
- Complex: `"p_abc123.nc_def456"`

**New Way**:
- Just type the table name
- Simple: `"customers"`

**Result**: 
- Easier to use
- More intuitive
- Less error-prone
- Still fully functional!

---

**Ready to use!** Just provide table names and the system handles the rest. 🎉
