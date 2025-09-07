'use client'

import { useRef, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useLeadsStore } from '@/store/leads-store'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Lead } from '@/lib/types'
import { ChevronUp, ChevronDown, Eye, Clock, CheckCircle, XCircle, MessageSquare } from 'lucide-react'

const statusConfig = {
  pending: { variant: 'warning' as const, label: 'Pending', icon: Clock },
  contacted: { variant: 'secondary' as const, label: 'Contacted', icon: CheckCircle },
  responded: { variant: 'default' as const, label: 'Responded', icon: MessageSquare },
  converted: { variant: 'success' as const, label: 'Converted', icon: CheckCircle },
}

export function LeadsTableInfinite() {
  const { searchQuery, statusFilter, sourceFilter, sortBy, sortOrder, setSortBy, setSortOrder, setSelectedLead } = useLeadsStore()
  
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error
  } = useInfiniteQuery({
    queryKey: ['leads-infinite', { searchQuery, statusFilter, sourceFilter, sortBy, sortOrder }],
    queryFn: async ({ pageParam = 1 }) => {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800))
      
      const { mockLeads } = await import('@/lib/mock-data')
      let filteredLeads = [...mockLeads]
      
      // Apply search filter
      if (searchQuery) {
        const searchLower = searchQuery.toLowerCase()
        filteredLeads = filteredLeads.filter(lead =>
          lead.name.toLowerCase().includes(searchLower) ||
          lead.email.toLowerCase().includes(searchLower) ||
          lead.company.toLowerCase().includes(searchLower) ||
          lead.campaign.toLowerCase().includes(searchLower)
        )
      }
      
      // Apply status filter
      if (statusFilter !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.status === statusFilter)
      }
      
      // Apply source filter
      if (sourceFilter !== 'all') {
        filteredLeads = filteredLeads.filter(lead => lead.source === sourceFilter)
      }
      
      // Apply sorting
      if (sortBy) {
        filteredLeads.sort((a, b) => {
          const aValue = a[sortBy as keyof Lead]
          const bValue = b[sortBy as keyof Lead]
          
          if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1
          if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1
          return 0
        })
      }
      
      // Apply pagination
      const pageSize = 10
      const start = (pageParam - 1) * pageSize
      const end = start + pageSize
      const paginatedLeads = filteredLeads.slice(start, end)
      
      return {
        data: paginatedLeads,
        nextPage: end < filteredLeads.length ? pageParam + 1 : undefined,
        hasMore: end < filteredLeads.length
      }
    },
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  })

  const observer = useRef<IntersectionObserver>()
  const lastElementRef = useCallback((node: HTMLTableRowElement) => {
    if (isLoading) return
    if (observer.current) observer.current.disconnect()
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    })
    if (node) observer.current.observe(node)
  }, [isLoading, hasNextPage, isFetchingNextPage, fetchNextPage])

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const SortButton = ({ column }: { column: string }) => (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => handleSort(column)}
      className="h-auto p-0 font-medium hover:bg-transparent"
    >
      <div className="flex items-center gap-1">
        {column}
        {sortBy === column && (
          sortOrder === 'asc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />
        )}
      </div>
    </Button>
  )

  const formatLastContact = (lastContacted?: string) => {
    if (!lastContacted) return 'Never'
    
    const now = new Date()
    const contactDate = new Date(lastContacted)
    const diffInHours = Math.floor((now.getTime() - contactDate.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    return formatDate(lastContacted)
  }

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Failed to load leads. Please try again.</p>
      </div>
    )
  }

  const allLeads = data?.pages.flatMap(page => page.data) || []

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="border-b border-gray-200">
              <TableHead className="text-gray-600 font-medium min-w-[200px]">
                <SortButton column="name" />
              </TableHead>
              <TableHead className="text-gray-600 font-medium min-w-[180px]">Email</TableHead>
              <TableHead className="text-gray-600 font-medium min-w-[150px]">Company</TableHead>
              <TableHead className="text-gray-600 font-medium min-w-[120px]">
                <SortButton column="campaign" />
              </TableHead>
              <TableHead className="text-gray-600 font-medium min-w-[120px]">
                <SortButton column="status" />
              </TableHead>
              <TableHead className="text-gray-600 font-medium min-w-[120px]">
                <SortButton column="lastContacted" />
              </TableHead>
              <TableHead className="w-[100px] text-gray-600 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <TableRow key={i} className="border-b border-gray-100">
                <TableCell><div className="h-4 w-32 skeleton" /></TableCell>
                <TableCell><div className="h-4 w-40 skeleton" /></TableCell>
                <TableCell><div className="h-4 w-24 skeleton" /></TableCell>
                <TableCell><div className="h-4 w-32 skeleton" /></TableCell>
                <TableCell><div className="h-6 w-16 skeleton rounded-full" /></TableCell>
                <TableCell><div className="h-4 w-20 skeleton" /></TableCell>
                <TableCell><div className="h-8 w-8 skeleton" /></TableCell>
              </TableRow>
            ))
          ) : allLeads.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                No leads found.
              </TableCell>
            </TableRow>
          ) : (
            allLeads.map((lead: Lead, index: number) => {
              const isLast = index === allLeads.length - 1
              const status = statusConfig[lead.status]
              
              return (
                <TableRow 
                  key={lead.id} 
                  ref={isLast ? lastElementRef : null}
                  className="cursor-pointer hover:bg-gray-50 border-b border-gray-100"
                >
                  <TableCell className="py-4 min-w-[200px]">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 truncate">{lead.name}</div>
                        <div className="text-sm text-gray-500 truncate">{lead.phone}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600 min-w-[180px]">
                    <div className="truncate" title={lead.email}>{lead.email}</div>
                  </TableCell>
                  <TableCell className="text-gray-600 min-w-[150px]">
                    <div className="truncate" title={lead.company}>{lead.company}</div>
                  </TableCell>
                  <TableCell className="text-gray-600 min-w-[120px]">
                    <div className="truncate" title={lead.campaign}>{lead.campaign}</div>
                  </TableCell>
                  <TableCell className="min-w-[120px]">
                    <Badge variant={status.variant} className="flex items-center gap-1 w-fit">
                      <status.icon className="h-3 w-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-gray-500 min-w-[120px]">
                    <div className="truncate" title={formatLastContact(lead.lastContacted)}>
                      {formatLastContact(lead.lastContacted)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedLead(lead)}
                      className="h-8 w-8 p-0 hover:bg-gray-100"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
        </Table>
      </div>
      
      {isFetchingNextPage && (
        <div className="flex items-center justify-center py-4 border-t">
          <div className="flex items-center gap-2 text-gray-500">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
            <span className="text-sm">Loading more leads...</span>
          </div>
        </div>
      )}
      
      {!hasNextPage && allLeads.length > 0 && (
        <div className="flex items-center justify-center py-4 border-t">
          <span className="text-sm text-gray-500">No more leads to load</span>
        </div>
      )}
    </div>
  )
}
