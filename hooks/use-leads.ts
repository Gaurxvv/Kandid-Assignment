import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { mockLeads } from '@/lib/mock-data'
import { Lead, PaginationParams } from '@/lib/types'

export function useLeads(params: PaginationParams) {
  return useQuery({
    queryKey: ['leads', params],
    queryFn: async () => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredLeads = [...mockLeads]
      
      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredLeads = filteredLeads.filter(lead =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
        )
      }
      
      // Apply status filter
      if (params.filters?.status && params.filters.status !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === params.filters?.status)
      }
      
      // Apply source filter
      if (params.filters?.source && params.filters.source !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.source === params.filters?.source)
      }
      
      // Apply sorting
      if (params.sortBy) {
        filteredLeads.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Lead]
          const bValue = b[params.sortBy as keyof Lead]
          
          if (aValue < bValue) return params.sortOrder === 'asc' ? -1 : 1
          if (aValue > bValue) return params.sortOrder === 'asc' ? 1 : -1
          return 0
        })
      }
      
      // Apply pagination
      const start = (params.page - 1) * params.limit
      const end = start + params.limit
      const paginatedLeads = filteredLeads.slice(start, end)
      
      return {
        data: paginatedLeads,
        total: filteredLeads.length,
        page: params.page,
        limit: params.limit,
        totalPages: Math.ceil(filteredLeads.length / params.limit)
      }
    },
  })
}

export function useInfiniteLeads(params: Omit<PaginationParams, 'page'>) {
  return useInfiniteQuery({
    queryKey: ['leads-infinite', params],
    queryFn: async ({ pageParam = 1 }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredLeads = [...mockLeads]
      
      // Apply search filter
      if (params.search) {
        const searchLower = params.search.toLowerCase()
        filteredLeads = filteredLeads.filter(lead =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower)
        )
      }
      
      // Apply status filter
      if (params.filters?.status && params.filters.status !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === params.filters?.status)
      }
      
      // Apply source filter
      if (params.filters?.source && params.filters.source !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.source === params.filters?.source)
      }
      
      // Apply sorting
      if (params.sortBy) {
        filteredLeads.sort((a, b) => {
          const aValue = a[params.sortBy as keyof Lead]
          const bValue = b[params.sortBy as keyof Lead]
          
          if (aValue < bValue) return params.sortOrder === 'asc' ? -1 : 1
          if (aValue > bValue) return params.sortOrder === 'asc' ? 1 : -1
          return 0
        })
      }
      
      // Apply pagination
      const start = ((pageParam as number) - 1) * params.limit
      const end = start + params.limit
      const paginatedLeads = filteredLeads.slice(start, end)
      
      return {
        data: paginatedLeads,
        total: filteredLeads.length,
        page: pageParam as number,
        limit: params.limit,
        totalPages: Math.ceil(filteredLeads.length / params.limit)
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined
    },
    initialPageParam: 1,
  })
}
