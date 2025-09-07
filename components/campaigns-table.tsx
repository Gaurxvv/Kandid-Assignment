'use client'

import { useState } from 'react'
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
import { useCampaigns } from '@/hooks/use-campaigns'
import { useCampaignsStore } from '@/store/campaigns-store'
import { formatDate, formatNumber } from '@/lib/utils'
import { Campaign } from '@/lib/types'
import { ChevronUp, ChevronDown, Users, Clock, X, MessageSquare } from 'lucide-react'

const statusConfig = {
  draft: { variant: 'secondary' as const, label: 'Draft' },
  active: { variant: 'success' as const, label: 'Active' },
  paused: { variant: 'warning' as const, label: 'Paused' },
  completed: { variant: 'default' as const, label: 'Completed' },
}

export function CampaignsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const { searchQuery, statusFilter, sortBy, sortOrder, setSortBy, setSortOrder } = useCampaignsStore()
  
  const { data: campaignsData, isLoading, error } = useCampaigns({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    sortBy,
    sortOrder,
    filters: {
      status: statusFilter,
    }
  })

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

  if (error) {
    return (
      <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4">
        <p className="text-sm text-destructive">Failed to load campaigns. Please try again.</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-gray-600 font-medium">
              <SortButton column="name" />
            </TableHead>
            <TableHead className="text-gray-600 font-medium">
              <SortButton column="status" />
            </TableHead>
            <TableHead className="text-gray-600 font-medium">Total Leads</TableHead>
            <TableHead className="text-gray-600 font-medium">Request Status</TableHead>
            <TableHead className="text-gray-600 font-medium">Connection Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-gray-100">
                <TableCell><div className="h-4 w-32 skeleton" /></TableCell>
                <TableCell><div className="h-6 w-16 skeleton rounded-full" /></TableCell>
                <TableCell><div className="h-4 w-20 skeleton" /></TableCell>
                <TableCell><div className="h-4 w-16 skeleton" /></TableCell>
                <TableCell><div className="h-4 w-16 skeleton" /></TableCell>
              </TableRow>
            ))
          ) : campaignsData?.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center text-gray-500">
                No campaigns found.
              </TableCell>
            </TableRow>
          ) : (
            campaignsData?.data.map((campaign: Campaign) => (
              <TableRow key={campaign.id} className="hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="py-4">
                  <div className="font-medium text-gray-900">{campaign.name}</div>
                </TableCell>
                <TableCell>
                  <Badge variant={statusConfig[campaign.status].variant}>
                    {statusConfig[campaign.status].label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span className="font-medium">{formatNumber(campaign.totalLeads)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-green-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">0</span>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-600">
                      <Clock className="h-4 w-4" />
                      <span className="text-sm">{formatNumber(campaign.contactedLeads)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600">
                      <X className="h-4 w-4" />
                      <span className="text-sm">0</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1 text-blue-600">
                      <Users className="h-4 w-4" />
                      <span className="text-sm">0</span>
                    </div>
                    <div className="flex items-center gap-1 text-blue-600">
                      <MessageSquare className="h-4 w-4" />
                      <span className="text-sm">0</span>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      
      {campaignsData && campaignsData.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, campaignsData.total)} of {campaignsData.total} results
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, campaignsData.totalPages))}
              disabled={currentPage === campaignsData.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
