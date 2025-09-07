import { db } from '../index'
import { users, campaigns, leads, messages, linkedinAccounts } from '../schema'
import { eq, and, desc, asc, like, or, count, sql } from 'drizzle-orm'

export interface UserFilters {
  search?: string
  role?: string
  isActive?: boolean
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function getUsers(filters: UserFilters, pagination: PaginationParams) {
  const { search, role, isActive } = filters
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination

  // Build where conditions
  const whereConditions = []
  
  if (search) {
    whereConditions.push(
      or(
        like(users.name, `%${search}%`),
        like(users.email, `%${search}%`)
      )
    )
  }
  
  if (role && role !== 'all') {
    whereConditions.push(eq(users.role, role))
  }
  
  if (isActive !== undefined) {
    whereConditions.push(eq(users.isActive, isActive))
  }

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(users)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

  const total = totalResult.count

  // Get users with pagination
  const baseQuery = db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatar: users.avatar,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

  // Add ordering based on sortBy
  let usersData
  switch (sortBy) {
    case 'id':
      usersData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(users.id) : desc(users.id))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'email':
      usersData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(users.email) : desc(users.email))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'name':
      usersData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(users.name) : desc(users.name))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'role':
      usersData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(users.role) : desc(users.role))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'isActive':
      usersData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(users.isActive) : desc(users.isActive))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    case 'updatedAt':
      usersData = await baseQuery
        .orderBy(sortOrder === 'asc' ? asc(users.updatedAt) : desc(users.updatedAt))
        .limit(limit)
        .offset((page - 1) * limit)
      break
    default:
      // Default to createdAt desc
      usersData = await baseQuery
        .orderBy(desc(users.createdAt))
        .limit(limit)
        .offset((page - 1) * limit)
  }

  return {
    data: usersData,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getUserById(id: string) {
  const [user] = await db
    .select({
      id: users.id,
      email: users.email,
      name: users.name,
      avatar: users.avatar,
      role: users.role,
      isActive: users.isActive,
      createdAt: users.createdAt,
      updatedAt: users.updatedAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1)

  return user
}

export async function getUserByEmail(email: string) {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1)

  return user
}

export async function createUser(userData: {
  email: string
  name: string
  avatar?: string
  role?: string
  isActive?: boolean
}) {
  const [newUser] = await db
    .insert(users)
    .values({
      ...userData,
      role: userData.role || 'user',
      isActive: userData.isActive !== undefined ? userData.isActive : true,
    })
    .returning()

  return newUser
}

export async function updateUser(id: string, userData: Partial<{
  email: string
  name: string
  avatar?: string
  role?: string
  isActive?: boolean
}>) {
  const [updatedUser] = await db
    .update(users)
    .set({
      ...userData,
      updatedAt: new Date(),
    })
    .where(eq(users.id, id))
    .returning()

  return updatedUser
}

export async function deleteUser(id: string) {
  await db.delete(users).where(eq(users.id, id))
}

export async function getUserStats(userId: string) {
  const [stats] = await db
    .select({
      totalCampaigns: count(campaigns.id),
      activeCampaigns: sql<number>`count(case when ${campaigns.status} = 'active' then 1 end)`,
      totalLeads: count(leads.id),
      pendingLeads: sql<number>`count(case when ${leads.status} = 'pending' then 1 end)`,
      contactedLeads: sql<number>`count(case when ${leads.status} = 'contacted' then 1 end)`,
      respondedLeads: sql<number>`count(case when ${leads.status} = 'responded' then 1 end)`,
      convertedLeads: sql<number>`count(case when ${leads.status} = 'converted' then 1 end)`,
      totalMessages: count(messages.id),
      totalLinkedInAccounts: count(linkedinAccounts.id),
      activeLinkedInAccounts: sql<number>`count(case when ${linkedinAccounts.status} = 'active' then 1 end)`,
    })
    .from(users)
    .leftJoin(campaigns, eq(users.id, campaigns.userId))
    .leftJoin(leads, eq(users.id, leads.userId))
    .leftJoin(messages, eq(users.id, messages.userId))
    .leftJoin(linkedinAccounts, eq(users.id, linkedinAccounts.userId))
    .where(eq(users.id, userId))

  return stats
}

export async function getUserDashboardData(userId: string) {
  // Get user stats
  const stats = await getUserStats(userId)

  // Get recent campaigns
  const recentCampaigns = await db
    .select({
      id: campaigns.id,
      name: campaigns.name,
      status: campaigns.status,
      totalLeads: campaigns.totalLeads,
      responseRate: campaigns.responseRate,
      conversionRate: campaigns.conversionRate,
      createdAt: campaigns.createdAt,
    })
    .from(campaigns)
    .where(eq(campaigns.userId, userId))
    .orderBy(desc(campaigns.createdAt))
    .limit(5)

  // Get recent leads
  const recentLeads = await db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      company: leads.company,
      status: leads.status,
      createdAt: leads.createdAt,
      campaign: {
        id: campaigns.id,
        name: campaigns.name,
      },
    })
    .from(leads)
    .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
    .where(eq(leads.userId, userId))
    .orderBy(desc(leads.createdAt))
    .limit(10)

  return {
    stats,
    recentCampaigns,
    recentLeads,
  }
}
