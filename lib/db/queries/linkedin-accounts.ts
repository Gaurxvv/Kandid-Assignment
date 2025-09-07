import { db } from '../index'
import { linkedinAccounts, users } from '../schema'
import { eq, and, desc, asc, like, or, count } from 'drizzle-orm'

export interface LinkedInAccountFilters {
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

export async function getLinkedInAccounts(filters: LinkedInAccountFilters, pagination: PaginationParams) {
  const { search, status, userId } = filters
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination

  // Build where conditions
  const whereConditions = []
  
  if (userId) {
    whereConditions.push(eq(linkedinAccounts.userId, userId))
  }
  
  if (search) {
    whereConditions.push(
      or(
        like(linkedinAccounts.name, `%${search}%`),
        like(linkedinAccounts.email, `%${search}%`)
      )
    )
  }
  
  if (status && status !== 'all') {
    whereConditions.push(eq(linkedinAccounts.status, status))
  }

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(linkedinAccounts)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

  const total = totalResult.count

  // Get LinkedIn accounts with pagination
  const accountsData = await db
    .select({
      id: linkedinAccounts.id,
      name: linkedinAccounts.name,
      email: linkedinAccounts.email,
      profileUrl: linkedinAccounts.profileUrl,
      status: linkedinAccounts.status,
      connections: linkedinAccounts.connections,
      messagesSent: linkedinAccounts.messagesSent,
      responseRate: linkedinAccounts.responseRate,
      lastActivity: linkedinAccounts.lastActivity,
      createdAt: linkedinAccounts.createdAt,
      updatedAt: linkedinAccounts.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(linkedinAccounts)
    .leftJoin(users, eq(linkedinAccounts.userId, users.id))
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(sortOrder === 'asc' ? asc(linkedinAccounts[sortBy as keyof typeof linkedinAccounts]) : desc(linkedinAccounts[sortBy as keyof typeof linkedinAccounts]))
    .limit(limit)
    .offset((page - 1) * limit)

  return {
    data: accountsData,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getLinkedInAccountById(id: string) {
  const [account] = await db
    .select({
      id: linkedinAccounts.id,
      name: linkedinAccounts.name,
      email: linkedinAccounts.email,
      profileUrl: linkedinAccounts.profileUrl,
      status: linkedinAccounts.status,
      connections: linkedinAccounts.connections,
      messagesSent: linkedinAccounts.messagesSent,
      responseRate: linkedinAccounts.responseRate,
      lastActivity: linkedinAccounts.lastActivity,
      createdAt: linkedinAccounts.createdAt,
      updatedAt: linkedinAccounts.updatedAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(linkedinAccounts)
    .leftJoin(users, eq(linkedinAccounts.userId, users.id))
    .where(eq(linkedinAccounts.id, id))
    .limit(1)

  return account
}

export async function createLinkedInAccount(accountData: {
  userId: string
  name: string
  email: string
  profileUrl?: string
  status?: string
  connections?: number
  messagesSent?: number
  responseRate?: string
}) {
  const [newAccount] = await db
    .insert(linkedinAccounts)
    .values({
      ...accountData,
      status: accountData.status || 'active',
      connections: accountData.connections || 0,
      messagesSent: accountData.messagesSent || 0,
      responseRate: accountData.responseRate || '0.00',
    })
    .returning()

  return newAccount
}

export async function updateLinkedInAccount(id: string, accountData: Partial<typeof accountData>) {
  const [updatedAccount] = await db
    .update(linkedinAccounts)
    .set({
      ...accountData,
      updatedAt: new Date(),
    })
    .where(eq(linkedinAccounts.id, id))
    .returning()

  return updatedAccount
}

export async function deleteLinkedInAccount(id: string) {
  await db.delete(linkedinAccounts).where(eq(linkedinAccounts.id, id))
}

export async function getLinkedInAccountsByUser(userId: string) {
  return await db
    .select()
    .from(linkedinAccounts)
    .where(eq(linkedinAccounts.userId, userId))
    .orderBy(desc(linkedinAccounts.createdAt))
}

export async function updateLinkedInAccountStats(id: string, stats: {
  connections?: number
  messagesSent?: number
  responseRate?: string
  lastActivity?: Date
}) {
  const [updatedAccount] = await db
    .update(linkedinAccounts)
    .set({
      ...stats,
      updatedAt: new Date(),
    })
    .where(eq(linkedinAccounts.id, id))
    .returning()

  return updatedAccount
}

export async function getLinkedInAccountStats(userId?: string) {
  const whereCondition = userId ? eq(linkedinAccounts.userId, userId) : undefined

  const [stats] = await db
    .select({
      totalAccounts: count(linkedinAccounts.id),
      activeAccounts: sql<number>`count(case when ${linkedinAccounts.status} = 'active' then 1 end)`,
      pausedAccounts: sql<number>`count(case when ${linkedinAccounts.status} = 'paused' then 1 end)`,
      errorAccounts: sql<number>`count(case when ${linkedinAccounts.status} = 'error' then 1 end)`,
      totalConnections: sql<number>`coalesce(sum(${linkedinAccounts.connections}), 0)`,
      totalMessagesSent: sql<number>`coalesce(sum(${linkedinAccounts.messagesSent}), 0)`,
      avgResponseRate: sql<number>`coalesce(avg(${linkedinAccounts.responseRate}), 0)`,
    })
    .from(linkedinAccounts)
    .where(whereCondition)

  return stats
}
