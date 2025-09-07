import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import { config } from 'dotenv'
import * as schema from './schema'

// Load environment variables
config({ path: '.env.local' })

// Create the connection with proper error handling
const connectionString = process.env.DATABASE_URL

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set')
}

console.log('🔗 Connecting to database...')
console.log('📍 Connection string:', connectionString.substring(0, 50) + '...')

// Use postgres-js instead of neon-serverless
const sql = postgres(connectionString, {
  ssl: 'require',
  max: 1
})

export const db = drizzle(sql, { schema })

// Export schema for use in other files
export * from './schema'
