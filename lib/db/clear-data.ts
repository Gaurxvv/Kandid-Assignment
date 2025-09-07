import { db } from './index'
import { config } from 'dotenv'

config({ path: '.env.local' })

async function clearData() {
  console.log('🧹 Clearing existing data...')
  
  try {
    // Clear tables in reverse dependency order
    await db.execute('DELETE FROM activity_logs')
    console.log('✅ Cleared activity_logs')
    
    await db.execute('DELETE FROM linkedin_accounts')
    console.log('✅ Cleared linkedin_accounts')
    
    await db.execute('DELETE FROM messages')
    console.log('✅ Cleared messages')
    
    await db.execute('DELETE FROM leads')
    console.log('✅ Cleared leads')
    
    await db.execute('DELETE FROM campaigns')
    console.log('✅ Cleared campaigns')
    
    await db.execute('DELETE FROM users')
    console.log('✅ Cleared users')
    
    console.log('🎉 All data cleared successfully!')
  } catch (error: any) {
    console.error('❌ Error clearing data:', error.message)
    throw error
  }
}

clearData()
  .then(() => {
    console.log('✅ Data clearing completed!')
    process.exit(0)
  })
  .catch((err) => {
    console.error('💥 Data clearing failed:', err)
    process.exit(1)
  })
