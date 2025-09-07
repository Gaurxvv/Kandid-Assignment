import { db } from '../index'
import { leads, campaigns, users } from '../schema'
import { eq, and, desc, asc, like, or, count } from 'drizzle-orm'

export interface LeadFilters {
  search?: string
  status?: string
  source?: string
  campaign?: string
  userId?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function getLeads(filters: LeadFilters, pagination: PaginationParams) {
  const { search, status, source, campaign, userId } = filters
  const { page, limit, sortBy = 'createdAt', sortOrder = 'desc' } = pagination

  // Build where conditions
  const whereConditions = []
  
  if (userId) {
    whereConditions.push(eq(leads.userId, userId))
  }
  
  if (search) {
    whereConditions.push(
      or(
        like(leads.name, `%${search}%`),
        like(leads.email, `%${search}%`),
        like(leads.company, `%${search}%`)
      )
    )
  }
  
  if (status && status !== 'all') {
    whereConditions.push(eq(leads.status, status))
  }
  
  if (source && source !== 'all') {
    whereConditions.push(eq(leads.source, source))
  }
  
  if (campaign && campaign !== 'all') {
    whereConditions.push(eq(leads.campaignId, campaign))
  }

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(leads)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

  const total = totalResult.count

  // Get leads with pagination
  const leadsData = await db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      company: leads.company,
      source: leads.source,
      status: leads.status,
      lastContacted: leads.lastContacted,
      notes: leads.notes,
      customFields: leads.customFields,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt,
      campaign: {
        id: campaigns.id,
        name: campaigns.name,
      },
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(leads)
    .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
    .leftJoin(users, eq(leads.userId, users.id))
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(sortOrder === 'asc' ? asc(leads[sortBy as keyof typeof leads]) : desc(leads[sortBy as keyof typeof leads]))
    .limit(limit)
    .offset((page - 1) * limit)

  return {
    data: leadsData,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getLeadById(id: string) {
  const [lead] = await db
    .select({
      id: leads.id,
      name: leads.name,
      email: leads.email,
      phone: leads.phone,
      company: leads.company,
      source: leads.source,
      status: leads.status,
      lastContacted: leads.lastContacted,
      notes: leads.notes,
      customFields: leads.customFields,
      createdAt: leads.createdAt,
      updatedAt: leads.updatedAt,
      campaign: {
        id: campaigns.id,
        name: campaigns.name,
        status: campaigns.status,
      },
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(leads)
    .leftJoin(campaigns, eq(leads.campaignId, campaigns.id))
    .leftJoin(users, eq(leads.userId, users.id))
    .where(eq(leads.id, id))
    .limit(1)

  return lead
}

export async function createLead(leadData: {
  name: string
  email: string
  phone?: string
  company: string
  source: string
  status?: string
  campaignId?: string
  userId: string
  notes?: string
  customFields?: any
}) {
  const [newLead] = await db
    .insert(leads)
    .values({
      ...leadData,
      status: leadData.status || 'pending',
    })
    .returning()

  return newLead
}

export async function updateLead(id: string, leadData: Partial<typeof leadData>) {
  const [updatedLead] = await db
    .update(leads)
    .set({
      ...leadData,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id))
    .returning()

  return updatedLead
}

export async function deleteLead(id: string) {
  await db.delete(leads).where(eq(leads.id, id))
}

export async function getLeadsByCampaign(campaignId: string) {
  return await db
    .select()
    .from(leads)
    .where(eq(leads.campaignId, campaignId))
    .orderBy(desc(leads.createdAt))
}

export async function getLeadsByUser(userId: string) {
  return await db
    .select()
    .from(leads)
    .where(eq(leads.userId, userId))
    .orderBy(desc(leads.createdAt))
}
