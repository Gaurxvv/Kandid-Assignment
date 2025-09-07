'use client'

import { CampaignsTable } from '@/components/campaigns-table'
import { CampaignsFilters } from '@/components/campaigns-filters'
import { CampaignsStats } from '@/components/campaigns-stats'

export default function CampaignsPage() {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
        <p className="text-gray-600 mt-1">
          Manage your campaigns and track their performance.
        </p>
      </div>
      
      <CampaignsStats />
      <CampaignsFilters />
      <CampaignsTable />
    </div>
  )
}
