'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLeads } from '@/hooks/use-leads'
import { useLeadsStore } from '@/store/leads-store'
import { formatCurrency } from '@/lib/utils'
import { Users, UserCheck, MessageSquare, DollarSign } from 'lucide-react'

export function LeadsStats() {
  const { searchQuery, statusFilter, sourceFilter } = useLeadsStore()
  
  const { data: leadsData, isLoading } = useLeads({
    page: 1,
    limit: 1000, // Get all for stats
    search: searchQuery,
    filters: {
      status: statusFilter,
      source: sourceFilter,
    }
  })

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 w-20 skeleton" />
              <div className="h-4 w-4 skeleton" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-16 skeleton" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const leads = leadsData?.data || []
  const totalValue = leads.reduce((sum, lead) => sum + lead.value, 0)
  const contactedLeads = leads.filter(lead => lead.status === 'contacted' || lead.status === 'responded' || lead.status === 'converted').length
  const respondedLeads = leads.filter(lead => lead.status === 'responded' || lead.status === 'converted').length
  const convertedLeads = leads.filter(lead => lead.status === 'converted').length

  const stats = [
    {
      title: 'Total Leads',
      value: leads.length,
      icon: Users,
      description: 'All leads in your pipeline'
    },
    {
      title: 'Contacted',
      value: contactedLeads,
      icon: UserCheck,
      description: 'Leads you\'ve reached out to'
    },
    {
      title: 'Responded',
      value: respondedLeads,
      icon: MessageSquare,
      description: 'Leads who responded'
    },
    {
      title: 'Total Value',
      value: formatCurrency(totalValue),
      icon: DollarSign,
      description: 'Potential revenue'
    }
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
