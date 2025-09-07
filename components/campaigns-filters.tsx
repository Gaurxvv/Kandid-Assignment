'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useCampaignsStore } from '@/store/campaigns-store'
import { Search, X } from 'lucide-react'

export function CampaignsFilters() {
  const {
    searchQuery,
    statusFilter,
    setSearchQuery,
    setStatusFilter,
    clearFilters
  } = useCampaignsStore()

  const hasActiveFilters = searchQuery || statusFilter !== 'all'

  const statusTabs = [
    { value: 'all', label: 'All Campaigns' },
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
  ]

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
      <div className="flex items-center gap-4">
        {/* Status Tabs */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          {statusTabs.map((tab) => (
            <Button
              key={tab.value}
              variant={statusFilter === tab.value ? "default" : "ghost"}
              size="sm"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-4 py-2 text-sm ${
                statusFilter === tab.value
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {tab.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            placeholder="Search campaigns..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 w-64"
          />
        </div>
        
        {hasActiveFilters && (
          <Button
            variant="outline"
            size="sm"
            onClick={clearFilters}
            className="flex items-center gap-2"
          >
            <X className="h-4 w-4" />
            Clear filters
          </Button>
        )}
      </div>
    </div>
  )
}
