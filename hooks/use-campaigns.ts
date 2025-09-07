import { useQuery } from '@tanstack/react-query'
import { mockCampaigns } from '@/lib/mock-data'
import { Campaign, PaginationParams } from '@/lib/types'

export function useCampaigns(params: PaginationParams) {
  return useQuery({
    queryKey: ['campaigns', params],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredCampaigns = [...mockCampaigns]
      
      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredCampaigns = filteredCampaigns.filter(campaign =>
          campaign.name.toLowerCase().includes(searchLower) ||
          campaign.description?.toLowerCase().includes(searchLower)
        )
      }
      
      // Apply status filter
      if (params.filters?.status && params.filters.status !== 'all') {
        if (params.filters.status === 'inactive') {
          filteredCampaigns = filteredCampaigns.filter(campaign => 
            campaign.status === 'paused' || campaign.status === 'completed'
          )
        } else {
          filteredCampaigns = filteredCampaigns.filter(campaign => campaign.status === params.filters?.status)
        }
      }
      
      // Apply sorting
      if (params.sortBy) {
        filteredCampaigns.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Campaign]
          const bValue = b[params.sortBy as keyof Campaign]
          
          if (aValue < bValue) return params.sortOrder === 'asc' ? -1 : 1
          if (aValue > bValue) return params.sortOrder === 'asc' ? 1 : -1
          return 0
        })
      }
      
      // Apply pagination
      const start = (params.page - 1) * params.limit
      const end = start + params.limit
      const paginatedCampaigns = filteredCampaigns.slice(start, end)
      
      return {
        data: paginatedCampaigns,
        total: filteredCampaigns.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(filteredCampaigns.length / params.limit)
      }
    },
  })
}

export function useCampaignMetrics() {
  return useQuery({
    queryKey: ['campaign-metrics'],
    queryFn: async () => {
      await new Promise(resolve => setTimeout(resolve, 300))
      
      const totalLeads = mockCampaigns.reduce((sum, campaign) => sum + campaign.totalLeads, 0)
      const totalContacted = mockCampaigns.reduce((sum, campaign) => sum + campaign.contactedLeads, 0)
      const totalResponded = mockCampaigns.reduce((sum, campaign) => sum + campaign.respondedLeads, 0)
      const totalConverted = mockCampaigns.reduce((sum, campaign) => sum + campaign.convertedLeads, 0)
      
      const overallResponseRate = totalContacted > 0 ? (totalResponded / totalContacted) * 100 : 0
      const overallConversionRate = totalResponded > 0 ? (totalConverted / totalResponded) * 100 : 0
      
      return {
        totalLeads,
        totalContacted,
        totalResponded,
        totalConverted,
        overallResponseRate,
        overallConversionRate,
        activeCampaigns: mockCampaigns.filter(c => c.status === 'active').length,
        totalCampaigns: mockCampaigns.length
      }
    },
  })
}
