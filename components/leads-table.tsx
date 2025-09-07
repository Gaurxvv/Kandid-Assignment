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
import { useLeads } from '@/hooks/use-leads'
import { useLeadsStore } from '@/store/leads-store'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Lead } from '@/lib/types'
import { ChevronUp, ChevronDown, Eye } from 'lucide-react'

const statusConfig = {
  pending: { variant: 'warning' as const, label: 'Pending' },
  contacted: { variant: 'secondary' as const, label: 'Contacted' },
  responded: { variant: 'default' as const, label: 'Responded' },
  converted: { variant: 'success' as const, label: 'Converted' },
}

export function LeadsTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const { searchQuery, statusFilter, sourceFilter, sortBy, sortOrder, setSortBy, setSortOrder, setSelectedLead } = useLeadsStore()
  
  const { data: leadsData, isLoading, error } = useLeads({
    page: currentPage,
    limit: 10,
    search: searchQuery,
    sortBy,
    sortOrder,
    filters: {
      status: statusFilter,
      source: sourceFilter,
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
        <p className="text-sm text-destructive">Failed to load leads. Please try again.</p>
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
              <SortButton column="company" />
            </TableHead>
            <TableHead className="text-gray-600 font-medium">
              <SortButton column="status" />
            </TableHead>
            <TableHead className="text-gray-600 font-medium">
              <SortButton column="source" />
            </TableHead>
            <TableHead className="text-gray-600 font-medium">
              <SortButton column="value" />
            </TableHead>
            <TableHead className="text-gray-600 font-medium">
              <SortButton column="createdAt" />
            </TableHead>
            <TableHead className="w-[100px] text-gray-600 font-medium">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i} className="border-b border-gray-100">
                <TableCell><div className="h-4 w-32 skeleton" /></TableCell>
                <TableCell><div className="h-4 w-24 skeleton" /></TableCell>
                <TableCell><div className="h-6 w-16 skeleton rounded-full" /></TableCell>
                <TableCell><div className="h-4 w-16 skeleton" /></TableCell>
                <TableCell><div className="h-4 w-20 skeleton" /></TableCell>
                <TableCell><div className="h-4 w-20 skeleton" /></TableCell>
                <TableCell><div className="h-8 w-8 skeleton" /></TableCell>
              </TableRow>
            ))
          ) : leadsData?.data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                No leads found.
              </TableCell>
            </TableRow>
          ) : (
            leadsData?.data.map((lead: Lead) => (
              <TableRow key={lead.id} className="cursor-pointer hover:bg-gray-50 border-b border-gray-100">
                <TableCell className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                      <span className="text-xs font-medium text-gray-600">
                        {lead.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{lead.name}</div>
                      <div className="text-sm text-gray-500">{lead.company}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-600">{lead.source}</TableCell>
                <TableCell>
                  <Badge variant={statusConfig[lead.status].variant}>
                    {statusConfig[lead.status].label}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-600">{lead.source}</TableCell>
                <TableCell className="font-medium text-gray-900">
                  {formatCurrency(lead.value)}
                </TableCell>
                <TableCell className="text-gray-500">
                  {formatDate(lead.createdAt)}
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
            ))
          )}
        </TableBody>
      </Table>
      
      {leadsData && leadsData.totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t">
          <div className="text-sm text-muted-foreground">
            Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, leadsData.total)} of {leadsData.total} results
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
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, leadsData.totalPages))}
              disabled={currentPage === leadsData.totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
