import { Api } from 'nocodb-sdk'
import ncHttpApi from '@/lib/http'

// Initialize NocoDB SDK
console.log('[NocoDB] Initializing with environment variables...')

const nocodbApi = new Api({
  baseURL: process.env.NEXT_PUBLIC_NOCODB_URL,
  headers: {
    'xc-token': process.env.NOCODB_API_TOKEN,
  },
})

console.log('[NocoDB] API client initialized successfully')

export interface NocoDBColumn {
  id: string
  title: string
  column_name?: string | null
  uidt: string // UI Data Type
  dt?: string | null // Data Type
  pk?: boolean
  rqd?: boolean // Required
  unique?: boolean
  ai?: boolean // Auto Increment
  cdf?: string // Column Default Value
  dtxp?: string // Data Type Extra Params
  dtxs?: string // Data Type Extra Scale
  description?: string
  source_id?: string
  base_id?: string
  fk_model_id?: string // Foreign key model ID for relational fields
  np?: string | null
  ns?: string | null
  colOptions: {
    fk_related_model_id?: string
    fk_mm_model_id?: string
    fk_mm_child_column_id?: string
    fk_mm_parent_column_id?: string
    fk_parent_column_id?: string
    fk_child_column_id?: string
    type?: string // 'has_one' | 'has_many' | 'many_to_many'
    fk_label_column_id?: string // Column to use as display label
  }
}

export interface NocoDBRow {
  [key: string]: unknown
}

export interface NocoDBListResponse {
  list: NocoDBRow[]
  pageInfo: {
    totalRows?: number
    page?: number
    pageSize?: number
    isFirstPage?: boolean
    isLastPage?: boolean
  }
}

export interface NocoDBBase {
  id: string
  title: string
  prefix?: string
  status?: string
  description?: string
  meta?: unknown
  color?: string
  deleted?: boolean
  order?: number
  project_id?: string
  created_at?: string
  updated_at?: string
}

export interface NocoDBTable {
  id: string
  title: string
  table_name: string
  type?: string
  enabled?: boolean
  base_id?: string
  project_id?: string
  meta?: unknown
  schema?: unknown
  columns?: NocoDBColumn[]
}

/**
 * NocoDB Service
 * Provides methods to interact with NocoDB API
 */
export class NocoDBService {
  /**
   * Fetch all bases/projects
   */
  static async getBases(): Promise<NocoDBBase[]> {
    try {
      const response = await nocodbApi.base.list()
      return (response.list || []) as NocoDBBase[]
    } catch (error) {
      console.error('Error fetching bases:', error)
      throw new Error('Failed to fetch NocoDB bases')
    }
  }

  /**
   * Fetch all tables in a base
   */
  static async getTables(baseId: string): Promise<NocoDBTable[]> {
    try {
      const response = await nocodbApi.dbTable.list(baseId)
      return (response.list || []) as NocoDBTable[]
    } catch (error) {
      console.error('Error fetching tables:', error)
      throw new Error(`Failed to fetch tables for base ${baseId}`)
    }
  }

  /**
   * Find table by name across all bases
   * Returns the first matching table found
   */
  static async findTableByName(
    tableName: string,
  ): Promise<{ table: NocoDBTable; baseId: string } | null> {
    try {
      const bases = await this.getBases()

      for (const base of bases) {
        const tables = await this.getTables(base.id)
        const matchedTable = tables.find(
          (table) =>
            table.title.toLowerCase() === tableName.toLowerCase() ||
            table.table_name.toLowerCase() === tableName.toLowerCase(),
        )

        if (matchedTable) {
          return {
            table: matchedTable,
            baseId: base.id,
          }
        }
      }

      return null
    } catch (error) {
      console.error('Error finding table:', error)
      throw new Error(`Failed to find table "${tableName}"`)
    }
  }

  /**
   * Parse source string into baseId and tableId
   * Format: "baseId.tableId" (e.g., "p123.t456")
   * Used internally by API routes after findTableByName
   */
  static parseSource(source: string): { baseId: string; tableId: string } {
    const parts = source.split('.')
    if (parts.length !== 2) {
      throw new Error('Invalid source format. Expected format: "baseId.tableId"')
    }
    return {
      baseId: parts[0],
      tableId: parts[1],
    }
  }

  // Get table metadata
  static async getTableMetadata(tableId: string): Promise<NocoDBTable | null> {
    try {
      const response = await nocodbApi.dbTable.read(tableId)
      return response as NocoDBTable
    } catch (error) {
      console.error('Error fetching table metadata:', error)
      return null
    }
  }

  /**
   * Fetch table rows
   */
  static async getRows(
    baseId: string,
    tableId: string,
    options?: {
      limit?: number
      offset?: number
      where?: string
      sort?: string
    },
  ): Promise<NocoDBListResponse> {
    try {
      const response = await nocodbApi.dbTableRow.list('noco', baseId, tableId, options)
      return response as NocoDBListResponse
    } catch (error) {
      console.error('Error fetching rows:', error)
      throw new Error(`Failed to fetch rows for table ${tableId}`)
    }
  }

  /**
   * Create a new row
   */
  static async createRow(
    baseId: string,
    tableId: string,
    data: Record<string, unknown>,
  ): Promise<NocoDBRow> {
    try {
      const response = await nocodbApi.dbTableRow.create('noco', baseId, tableId, data)
      return response as NocoDBRow
    } catch (error) {
      console.error('Error creating row:', error)
      throw new Error(`Failed to create row in table ${tableId}`)
    }
  }

  /**
   * Update an existing row
   */
  static async updateRow(
    baseId: string,
    tableId: string,
    rowId: string,
    data: Record<string, unknown>,
  ): Promise<NocoDBRow> {
    try {
      const response = await nocodbApi.dbTableRow.update('noco', baseId, tableId, rowId, data)
      return response as NocoDBRow
    } catch (error) {
      console.error('Error updating row:', error)
      throw new Error(`Failed to update row ${rowId} in table ${tableId}`)
    }
  }

  /**
   * Delete a row
   */
  static async deleteRow(baseId: string, tableId: string, rowId: string): Promise<void> {
    try {
      await nocodbApi.dbTableRow.delete('noco', baseId, tableId, rowId)
    } catch (error) {
      console.error('Error deleting row:', error)
      throw new Error(`Failed to delete row ${rowId} from table ${tableId}`)
    }
  }

  /**
   * Get primary key column
   */
  static getPrimaryKeyColumn(columns: NocoDBColumn[]): NocoDBColumn | undefined {
    return columns.find((col) => col.pk === true)
  }

  /**
   * Get visible columns (exclude system columns)
   */
  static getVisibleColumns(columns: NocoDBColumn[]): NocoDBColumn[] {
    // Filter out common system columns like CreatedAt, UpdatedAt, etc.
    const systemColumns = ['created_at', 'updated_at', 'created_by', 'updated_by']
    return columns.filter(
      (col) => !col.column_name || !systemColumns.includes(col.column_name.toLowerCase()),
    )
  }

  /**
   * Determine input type based on column metadata
   */
  static getInputType(column: NocoDBColumn): string {
    const uidt = column.uidt?.toLowerCase() || ''

    // Map NocoDB UI Data Types to HTML input types
    if (uidt.includes('singlelinetext') || uidt.includes('longtext')) {
      return 'text'
    }
    if (uidt.includes('email')) {
      return 'email'
    }
    if (uidt.includes('url')) {
      return 'url'
    }
    if (uidt.includes('phonenumber')) {
      return 'tel'
    }
    if (uidt.includes('number') || uidt.includes('decimal') || uidt.includes('currency')) {
      return 'number'
    }
    if (uidt.includes('checkbox')) {
      return 'checkbox'
    }
    if (uidt.includes('date')) {
      return 'date'
    }
    if (uidt.includes('datetime')) {
      return 'datetime-local'
    }
    if (uidt.includes('time')) {
      return 'time'
    }

    // Default to text
    return 'text'
  }

  /**
   * Check if column is editable
   */
  static isColumnEditable(column: NocoDBColumn): boolean {
    // Don't allow editing primary key or auto-increment columns
    if (column.pk || column.ai) {
      return false
    }
    return true
  }

  /**
   * Fetch related records for a relational field
   */
  static async getRelatedRecords(
    relatedTableId: string,
    options?: {
      limit?: number
      offset?: number
    },
  ): Promise<NocoDBRow[]> {
    try {
      const _options = {
        offset: options?.offset || 0,
        limit: options?.limit || 100,
      }

      const response = await ncHttpApi.get(
        `/api/v2/tables/${relatedTableId}/records?offset=${_options.offset}&limit=${_options.limit}`,
      )

      return (response.data.list || []) as NocoDBRow[]
    } catch (error) {
      console.error('Error fetching related records:', error)
      throw new Error(`Failed to fetch related records from table ${relatedTableId}`)
    }
  }
}

export default NocoDBService
