import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'
import * as schema from './db/schema'

// Fallback to Neon connection string if environment variable is not available
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://neondb_owner:npg_VWNbUi71nSBo@ep-wandering-shadow-ae97zsv6-pooler.c-2.us-east-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require'

const sql = neon(DATABASE_URL)
export const db = drizzle(sql, { schema })
