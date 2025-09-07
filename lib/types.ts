export interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'admin' | 'user'
}

export interface Lead {
  id: string
  name: string
  email: string
  company: string
  status: 'pending' | 'contacted' | 'responded' | 'converted'
  source: string
  campaign: string
  value: number
  createdAt: string
  lastContacted?: string
  notes?: string
  phone?: string
  linkedin?: string
}

export interface Campaign {
  id: string
  name: string
  status: 'draft' | 'active' | 'paused' | 'completed'
  totalLeads: number
  contactedLeads: number
  respondedLeads: number
  convertedLeads: number
  responseRate: number
  conversionRate: number
  createdAt: string
  updatedAt: string
  description?: string
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface TableColumn<T> {
  key: keyof T
  label: string
  sortable?: boolean
  render?: (value: any, item: T) => React.ReactNode
}

export interface PaginationParams {
  page: number
  limit: number
  search?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  filters?: Record<string, any>
}
