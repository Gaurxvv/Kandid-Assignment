'use client'

import { LeadsTableInfinite } from '@/components/leads-table-infinite'
import { LeadsFilters } from '@/components/leads-filters'
import { LeadDetailsSheet } from '@/components/lead-details-sheet'
import { useLeadsStore } from '@/store/leads-store'

export default function LeadsPage() {
  const { selectedLead } = useLeadsStore()
  const isSheetOpen = !!selectedLead

  return (
    <div className={`p-6 transition-all duration-300 ${
      isSheetOpen ? 'pr-0' : ''
    }`}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Leads</h1>
      </div>
      
      <div className={`transition-all duration-300 ${
        isSheetOpen ? 'mr-0 sm:mr-[400px] lg:mr-[540px]' : ''
      }`}>
        <LeadsFilters />
        <LeadsTableInfinite />
      </div>
      
      <LeadDetailsSheet />
    </div>
  )
}
