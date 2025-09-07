import { pgTable, text, timestamp, integer, decimal, jsonb, uuid, boolean } from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Better Auth required tables
export const user = pgTable('user', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull().default(false),
  name: text('name'),
  image: text('image'), // Changed from 'avatar' to 'image' for Better Auth compatibility
  role: text('role').notNull().default('user'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at'),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
})

// Legacy users table (for backward compatibility)
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  name: text('name').notNull(),
  avatar: text('avatar'),
  role: text('role').notNull().default('user'),
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Campaigns table
export const campaigns = pgTable('campaigns', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status').notNull().default('draft'), // draft, active, paused, completed
  totalLeads: integer('total_leads').notNull().default(0),
  responseRate: decimal('response_rate', { precision: 5, scale: 2 }).default('0.00'),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 2 }).default('0.00'),
  userId: text('user_id').references(() => user.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Leads table
export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  company: text('company').notNull(),
  source: text('source').notNull(), // LinkedIn, Website, Referral, Cold Email
  status: text('status').notNull().default('pending'), // pending, contacted, responded, converted
  campaignId: uuid('campaign_id').references(() => campaigns.id),
  userId: text('user_id').references(() => user.id),
  lastContacted: timestamp('last_contacted'),
  notes: text('notes'),
  customFields: jsonb('custom_fields'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Messages table
export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  leadId: uuid('lead_id').references(() => leads.id),
  userId: text('user_id').references(() => user.id),
  content: text('content').notNull(),
  type: text('type').notNull().default('outbound'), // outbound, inbound
  status: text('status').notNull().default('sent'), // sent, delivered, read, replied
  sentAt: timestamp('sent_at').defaultNow().notNull(),
  readAt: timestamp('read_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// LinkedIn Accounts table
export const linkedinAccounts = pgTable('linkedin_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id),
  name: text('name').notNull(),
  email: text('email').notNull(),
  profileUrl: text('profile_url'),
  status: text('status').notNull().default('active'), // active, paused, error
  connections: integer('connections').default(0),
  messagesSent: integer('messages_sent').default(0),
  responseRate: decimal('response_rate', { precision: 5, scale: 2 }).default('0.00'),
  lastActivity: timestamp('last_activity'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

// Activity Logs table
export const activityLogs = pgTable('activity_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: text('user_id').references(() => user.id),
  action: text('action').notNull(), // lead_created, campaign_started, message_sent, etc.
  description: text('description'),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

// Relations
export const userRelations = relations(user, ({ many }) => ({
  campaigns: many(campaigns),
  leads: many(leads),
  messages: many(messages),
  linkedinAccounts: many(linkedinAccounts),
  activityLogs: many(activityLogs),
  sessions: many(session),
  accounts: many(account),
}))

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}))

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}))

export const usersRelations = relations(users, ({ many }) => ({
  campaigns: many(campaigns),
  leads: many(leads),
  messages: many(messages),
  linkedinAccounts: many(linkedinAccounts),
  activityLogs: many(activityLogs),
}))

export const campaignsRelations = relations(campaigns, ({ one, many }) => ({
  user: one(user, {
    fields: [campaigns.userId],
    references: [user.id],
  }),
  leads: many(leads),
}))

export const leadsRelations = relations(leads, ({ one, many }) => ({
  user: one(user, {
    fields: [leads.userId],
    references: [user.id],
  }),
  campaign: one(campaigns, {
    fields: [leads.campaignId],
    references: [campaigns.id],
  }),
  messages: many(messages),
}))

export const messagesRelations = relations(messages, ({ one }) => ({
  lead: one(leads, {
    fields: [messages.leadId],
    references: [leads.id],
  }),
  user: one(user, {
    fields: [messages.userId],
    references: [user.id],
  }),
}))

export const linkedinAccountsRelations = relations(linkedinAccounts, ({ one }) => ({
  user: one(user, {
    fields: [linkedinAccounts.userId],
    references: [user.id],
  }),
}))

export const activityLogsRelations = relations(activityLogs, ({ one }) => ({
  user: one(user, {
    fields: [activityLogs.userId],
    references: [user.id],
  }),
}))
