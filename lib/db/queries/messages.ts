import { db } from '../index'
import { messages, leads, users } from '../schema'
import { eq, and, desc, asc, like, or, count } from 'drizzle-orm'

export interface MessageFilters {
  search?: string
  status?: string
  type?: string
  leadId?: string
  userId?: string
}

export interface PaginationParams {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export async function getMessages(filters: MessageFilters, pagination: PaginationParams) {
  const { search, status, type, leadId, userId } = filters
  const { page, limit, sortBy = 'sentAt', sortOrder = 'desc' } = pagination

  // Build where conditions
  const whereConditions = []
  
  if (userId) {
    whereConditions.push(eq(messages.userId, userId))
  }
  
  if (leadId) {
    whereConditions.push(eq(messages.leadId, leadId))
  }
  
  if (search) {
    whereConditions.push(like(messages.content, `%${search}%`))
  }
  
  if (status && status !== 'all') {
    whereConditions.push(eq(messages.status, status))
  }
  
  if (type && type !== 'all') {
    whereConditions.push(eq(messages.type, type))
  }

  // Get total count
  const [totalResult] = await db
    .select({ count: count() })
    .from(messages)
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)

  const total = totalResult.count

  // Get messages with pagination
  const messagesData = await db
    .select({
      id: messages.id,
      content: messages.content,
      type: messages.type,
      status: messages.status,
      sentAt: messages.sentAt,
      readAt: messages.readAt,
      createdAt: messages.createdAt,
      lead: {
        id: leads.id,
        name: leads.name,
        email: leads.email,
        company: leads.company,
      },
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(messages)
    .leftJoin(leads, eq(messages.leadId, leads.id))
    .leftJoin(users, eq(messages.userId, users.id))
    .where(whereConditions.length > 0 ? and(...whereConditions) : undefined)
    .orderBy(sortOrder === 'asc' ? asc(messages[sortBy as keyof typeof messages]) : desc(messages[sortBy as keyof typeof messages]))
    .limit(limit)
    .offset((page - 1) * limit)

  return {
    data: messagesData,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getMessageById(id: string) {
  const [message] = await db
    .select({
      id: messages.id,
      content: messages.content,
      type: messages.type,
      status: messages.status,
      sentAt: messages.sentAt,
      readAt: messages.readAt,
      createdAt: messages.createdAt,
      lead: {
        id: leads.id,
        name: leads.name,
        email: leads.email,
        company: leads.company,
      },
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(messages)
    .leftJoin(leads, eq(messages.leadId, leads.id))
    .leftJoin(users, eq(messages.userId, users.id))
    .where(eq(messages.id, id))
    .limit(1)

  return message
}

export async function createMessage(messageData: {
  leadId: string
  userId: string
  content: string
  type?: string
  status?: string
}) {
  const [newMessage] = await db
    .insert(messages)
    .values({
      ...messageData,
      type: messageData.type || 'outbound',
      status: messageData.status || 'sent',
    })
    .returning()

  return newMessage
}

export async function updateMessage(id: string, messageData: Partial<typeof messageData>) {
  const [updatedMessage] = await db
    .update(messages)
    .set({
      ...messageData,
    })
    .where(eq(messages.id, id))
    .returning()

  return updatedMessage
}

export async function deleteMessage(id: string) {
  await db.delete(messages).where(eq(messages.id, id))
}

export async function getMessagesByLead(leadId: string) {
  return await db
    .select({
      id: messages.id,
      content: messages.content,
      type: messages.type,
      status: messages.status,
      sentAt: messages.sentAt,
      readAt: messages.readAt,
      createdAt: messages.createdAt,
      user: {
        id: users.id,
        name: users.name,
        email: users.email,
      },
    })
    .from(messages)
    .leftJoin(users, eq(messages.userId, users.id))
    .where(eq(messages.leadId, leadId))
    .orderBy(desc(messages.sentAt))
}

export async function markMessageAsRead(id: string) {
  const [updatedMessage] = await db
    .update(messages)
    .set({
      status: 'read',
      readAt: new Date(),
    })
    .where(eq(messages.id, id))
    .returning()

  return updatedMessage
}

export async function getMessageStats(userId?: string) {
  const whereCondition = userId ? eq(messages.userId, userId) : undefined

  const [stats] = await db
    .select({
      totalMessages: count(messages.id),
      sentMessages: sql<number>`count(case when ${messages.status} = 'sent' then 1 end)`,
      deliveredMessages: sql<number>`count(case when ${messages.status} = 'delivered' then 1 end)`,
      readMessages: sql<number>`count(case when ${messages.status} = 'read' then 1 end)`,
      repliedMessages: sql<number>`count(case when ${messages.status} = 'replied' then 1 end)`,
      outboundMessages: sql<number>`count(case when ${messages.type} = 'outbound' then 1 end)`,
      inboundMessages: sql<number>`count(case when ${messages.type} = 'inbound' then 1 end)`,
    })
    .from(messages)
    .where(whereCondition)

  const responseRate = stats.totalMessages > 0 
    ? (stats.repliedMessages / stats.totalMessages) * 100 
    : 0

  return {
    ...stats,
    responseRate,
  }
}
