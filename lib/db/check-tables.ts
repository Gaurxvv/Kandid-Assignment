import { config } from 'dotenv'
import { db } from './index'

// Load environment variables
config({ path: '.env.local' })

async function checkTables() {
  console.log('🔍 Checking database tables...')

  try {
    // First, let's check if we can connect at all
    console.log('🔗 Testing database connection...')
    const connectionTest = await db.execute('SELECT 1 as test')
    console.log('✅ Database connection successful')
    
    // Now check each table
            const tables = ['user', 'session', 'account', 'verification', 'users', 'campaigns', 'leads', 'messages', 'linkedin_accounts', 'activity_logs']
    
    for (const table of tables) {
      try {
        const result = await db.execute(`SELECT COUNT(*) as count FROM ${table}`)
        const count = result.rows?.[0]?.count || result[0]?.count || 'unknown'
        console.log(`✅ ${table} table exists (${count} rows)`)
      } catch (error) {
        console.log(`❌ ${table} table error:`, error.message)
      }
    }
    
  } catch (error) {
    console.log('❌ Database connection failed:')
    console.log('Error message:', error.message)
    console.log('Full error:', error)
  }
}

checkTables()
  .then(() => {
    console.log('🎉 Table check completed!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('💥 Table check failed:', error)
    process.exit(1)
  })
