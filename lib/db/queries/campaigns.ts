import { db } from '../index'
import { campaigns, leads, users } from '../schema'
import { eq, and, desc, asc, like, or, count, sql } from 'drizzle-orm'

export interface CampaignFilters {
  search?: string
  status?: string
  userId?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function getCampaigns(filters: CampaignFilters, pagination: PaginationParams) {
  const { search, status, userId } = filters
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination

  // Build where conditions
  const whereConditions = []
  
  if (userId) {
    whereConditions.push(eq(campaigns.userId, userId))
  }
  
  if (search) {
    whereConditions.push(like(campaigns.name, `%${search}%`))
  }
  
  if (status && status !== 'all') {
    if (status === 'inactive') {
      whereConditions.push(or(eq(campaigns.status, 'paused'), eq(campaigns.status, 'completed')))
    } else {
      whereConditions.push(eq(campaigns.status, status))
    }
  }

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(campaigns)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

  const total = totalResult.count

  // Get campaigns with pagination
  const baseQuery = db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      description: campaigns.description,
      status: campaigns.status,
      totalLeads: campaigns.totalLeads,
      responseRate: campaigns.responseRate,
      conversionRate: campaigns.conversionRate,
      createdAt: campaigns.createdAt,
      updatedAt: campaigns.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(campaigns)
    .leftJoin(users, eq(campaigns.userId, users.id))
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

  // Add ordering based on sortBy
  let campaignsData
  switch (sortBy) {
    case 'id':
      campaignsData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(campaigns.id) : desc(campaigns.id))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'name':
      campaignsData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(campaigns.name) : desc(campaigns.name))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'status':
      campaignsData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(campaigns.status) : desc(campaigns.status))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'totalLeads':
      campaignsData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(campaigns.totalLeads) : desc(campaigns.totalLeads))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'responseRate':
      campaignsData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(campaigns.responseRate) : desc(campaigns.responseRate))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'conversionRate':
      campaignsData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(campaigns.conversionRate) : desc(campaigns.conversionRate))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'updatedAt':
      campaignsData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(campaigns.updatedAt) : desc(campaigns.updatedAt))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    default:
      // Default to createdAt desc
      campaignsData = await baseQuery
        .orderBy(desc(campaigns.createdAt))
        .limit(limit)
        .offset((page - 1) * limit)
  }

  return {
    data: campaignsData,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getCampaignById(id: string) {
  const [campaign] = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      description: campaigns.description,
      status: campaigns.status,
      totalLeads: campaigns.totalLeads,
      responseRate: campaigns.responseRate,
      conversionRate: campaigns.conversionRate,
      createdAt: campaigns.createdAt,
      updatedAt: campaigns.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(campaigns)
    .leftJoin(users, eq(campaigns.userId, users.id))
    .where(eq(campaigns.id, id))
    .limit(1)

  return campaign
}

export async function createCampaign(campaignData: {
  name: string
  description?: string
  status?: string
  userId: string
}) {
  const [newCampaign] = await db
    .insert(campaigns)
    .values({
      ...campaignData,
      status: campaignData.status || 'draft',
    })
    .returning()

  return newCampaign
}

export async function updateCampaign(id: string, campaignData: Partial<{
  name: string
  description?: string
  status?: string
  userId: string
}>) {
  const [updatedCampaign] = await db
    .update(campaigns)
    .set({
      ...campaignData,
      updatedAt: new Date(),
    })
    .where(eq(campaigns.id, id))
    .returning()

  return updatedCampaign
}

export async function deleteCampaign(id: string) {
  await db.delete(campaigns).where(eq(campaigns.id, id))
}

export async function getCampaignMetrics(userId?: string) {
  const whereCondition = userId ? eq(campaigns.userId, userId) : undefined

  const [metrics] = await db
    .select({
      totalCampaigns: count(campaigns.id),
      activeCampaigns: sql<number>`count(case when ${campaigns.status} = 'active' then 1 end)`,
      pausedCampaigns: sql<number>`count(case when ${campaigns.status} = 'paused' then 1 end)`,
      completedCampaigns: sql<number>`count(case when ${campaigns.status} = 'completed' then 1 end)`,
      totalLeads: sql<number>`coalesce(sum(${campaigns.totalLeads}), 0)`,
      avgResponseRate: sql<number>`coalesce(avg(${campaigns.responseRate}), 0)`,
      avgConversionRate: sql<number>`coalesce(avg(${campaigns.conversionRate}), 0)`,
    })
    .from(campaigns)
    .where(whereCondition)

  return metrics
}

export async function getCampaignsByUser(userId: string) {
  return await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.userId, userId))
    .orderBy(desc(campaigns.createdAt))
}

export async function updateCampaignStats(campaignId: string) {
  // Get lead counts for this campaign
  const [leadStats] = await db
    .select({
      totalLeads: count(leads.id),
      contactedLeads: sql<number>`count(case when ${leads.status} = 'contacted' then 1 end)`,
      respondedLeads: sql<number>`count(case when ${leads.status} = 'responded' then 1 end)`,
      convertedLeads: sql<number>`count(case when ${leads.status} = 'converted' then 1 end)`,
    })
    .from(leads)
    .where(eq(leads.campaignId, campaignId))

  // Calculate rates
  const responseRate = leadStats.totalLeads > 0 
    ? (leadStats.respondedLeads / leadStats.totalLeads) * 100 
    : 0
  
  const conversionRate = leadStats.totalLeads > 0 
    ? (leadStats.convertedLeads / leadStats.totalLeads) * 100 
    : 0

  // Update campaign with new stats
  await db
    .update(campaigns)
    .set({
      totalLeads: leadStats.totalLeads,
      responseRate: responseRate.toString(),
      conversionRate: conversionRate.toString(),
      updatedAt: new Date(),
    })
    .where(eq(campaigns.id, campaignId))

  return {
    totalLeads: leadStats.totalLeads,
    responseRate,
    conversionRate,
  }
}
