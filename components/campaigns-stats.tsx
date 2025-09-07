'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useCampaignMetrics } from '@/hooks/use-campaigns'
import { formatNumber, formatPercentage } from '@/lib/utils'
import { Megaphone, Users, MessageSquare, TrendingUp } from 'lucide-react'

export function CampaignsStats() {
  const { data: metrics, isLoading } = useCampaignMetrics()

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

  if (!metrics) return null

  const stats = [
    {
      title: 'Total Campaigns',
      value: metrics.totalCampaigns,
      icon: Megaphone,
      description: `${metrics.activeCampaigns} active`
    },
    {
      title: 'Total Leads',
      value: formatNumber(metrics.totalLeads),
      icon: Users,
      description: 'Across all campaigns'
    },
    {
      title: 'Response Rate',
      value: formatPercentage(metrics.overallResponseRate),
      icon: MessageSquare,
      description: 'Overall response rate'
    },
    {
      title: 'Conversion Rate',
      value: formatPercentage(metrics.overallConversionRate),
      icon: TrendingUp,
      description: 'Overall conversion rate'
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
