import { db } from './index'
import { users, campaigns, leads, messages, linkedinAccounts, activityLogs } from './schema'

async function seed() {
  console.log('🌱 Starting database seed...')

  try {
    // Create users
    console.log('👤 Creating users...')
    const [user1] = await db.insert(users).values({
      email: 'john@linkbird.ai',
      name: 'John Smith',
      role: 'admin',
      isActive: true,
    }).returning()

    const [user2] = await db.insert(users).values({
      email: 'sarah@linkbird.ai',
      name: 'Sarah Johnson',
      role: 'user',
      isActive: true,
    }).returning()

    // Create campaigns
    console.log('📢 Creating campaigns...')
    const [campaign1] = await db.insert(campaigns).values({
      name: 'Q4 Outreach',
      description: 'End of year outreach campaign',
      status: 'active',
      totalLeads: 150,
      responseRate: '12.5',
      conversionRate: '3.2',
      userId: user1.id,
    }).returning()

    const [campaign2] = await db.insert(campaigns).values({
      name: 'Product Launch',
      description: 'New product launch campaign',
      status: 'active',
      totalLeads: 89,
      responseRate: '18.7',
      conversionRate: '5.6',
      userId: user1.id,
    }).returning()

    const [campaign3] = await db.insert(campaigns).values({
      name: 'Holiday Special',
      description: 'Holiday season promotion',
      status: 'paused',
      totalLeads: 45,
      responseRate: '8.9',
      conversionRate: '2.1',
      userId: user2.id,
    }).returning()

    // Create leads
    console.log('👥 Creating leads...')
    const leadData = [
      {
        name: 'Alice Cooper',
        email: 'alice@techcorp.com',
        phone: '+1-555-0123',
        company: 'TechCorp Inc.',
        source: 'LinkedIn',
        status: 'contacted',
        campaignId: campaign1.id,
        userId: user1.id,
        lastContacted: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        name: 'Bob Wilson',
        email: 'bob@startup.io',
        phone: '+1-555-0124',
        company: 'StartupIO',
        source: 'Website',
        status: 'responded',
        campaignId: campaign1.id,
        userId: user1.id,
        lastContacted: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
      {
        name: 'Carol Davis',
        email: 'carol@enterprise.com',
        phone: '+1-555-0125',
        company: 'Enterprise Solutions',
        source: 'Referral',
        status: 'converted',
        campaignId: campaign2.id,
        userId: user1.id,
        lastContacted: new Date(Date.now() - 3 * 60 * 60 * 1000), // 3 hours ago
      },
      {
        name: 'David Brown',
        email: 'david@consulting.com',
        phone: '+1-555-0126',
        company: 'Brown Consulting',
        source: 'Cold Email',
        status: 'pending',
        campaignId: campaign2.id,
        userId: user1.id,
      },
      {
        name: 'Eva Martinez',
        email: 'eva@retail.com',
        phone: '+1-555-0127',
        company: 'Retail Plus',
        source: 'LinkedIn',
        status: 'contacted',
        campaignId: campaign3.id,
        userId: user2.id,
        lastContacted: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    ]

    const createdLeads = await db.insert(leads).values(leadData).returning()

    // Create messages
    console.log('💬 Creating messages...')
    const messageData = [
      {
        leadId: createdLeads[0].id,
        userId: user1.id,
        content: 'Hi Alice, I hope this message finds you well. I wanted to reach out regarding our new product that could help TechCorp streamline operations.',
        type: 'outbound',
        status: 'read',
        sentAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        leadId: createdLeads[1].id,
        userId: user1.id,
        content: 'Thanks for reaching out! I\'d love to learn more about your product. Can you send me more details?',
        type: 'inbound',
        status: 'replied',
        sentAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        readAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      },
      {
        leadId: createdLeads[2].id,
        userId: user1.id,
        content: 'This looks perfect for our needs. When can we start?',
        type: 'inbound',
        status: 'replied',
        sentAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
        readAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    ]

    await db.insert(messages).values(messageData)

    // Create LinkedIn accounts
    console.log('🔗 Creating LinkedIn accounts...')
    const linkedinData = [
      {
        userId: user1.id,
        name: 'John Smith',
        email: 'john@linkbird.ai',
        profileUrl: 'linkedin.com/in/johnsmith',
        status: 'active',
        connections: 1250,
        messagesSent: 45,
        responseRate: '12.5',
        lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
      {
        userId: user2.id,
        name: 'Sarah Johnson',
        email: 'sarah@linkbird.ai',
        profileUrl: 'linkedin.com/in/sarahjohnson',
        status: 'paused',
        connections: 890,
        messagesSent: 23,
        responseRate: '18.7',
        lastActivity: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    ]

    await db.insert(linkedinAccounts).values(linkedinData)

    // Create activity logs
    console.log('📊 Creating activity logs...')
    const activityData = [
      {
        userId: user1.id,
        action: 'campaign_created',
        description: 'Created campaign "Q4 Outreach"',
        metadata: { campaignId: campaign1.id, campaignName: 'Q4 Outreach' },
      },
      {
        userId: user1.id,
        action: 'lead_created',
        description: 'Added new lead Alice Cooper',
        metadata: { leadId: createdLeads[0].id, leadName: 'Alice Cooper' },
      },
      {
        userId: user1.id,
        action: 'message_sent',
        description: 'Sent message to Alice Cooper',
        metadata: { leadId: createdLeads[0].id, leadName: 'Alice Cooper' },
      },
      {
        userId: user2.id,
        action: 'campaign_paused',
        description: 'Paused campaign "Holiday Special"',
        metadata: { campaignId: campaign3.id, campaignName: 'Holiday Special' },
      },
    ]

    await db.insert(activityLogs).values(activityData)

    console.log('✅ Database seeded successfully!')
    console.log(`👤 Created 2 users`)
    console.log(`📢 Created 3 campaigns`)
    console.log(`👥 Created ${createdLeads.length} leads`)
    console.log(`💬 Created ${messageData.length} messages`)
    console.log(`🔗 Created ${linkedinData.length} LinkedIn accounts`)
    console.log(`📊 Created ${activityData.length} activity logs`)

  } catch (error) {
    console.error('❌ Error seeding database:', error)
    throw error
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('🎉 Seed completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Seed failed:', error)
      process.exit(1)
    })
}

export { seed }
