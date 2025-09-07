import { create } from 'zustand'
import { Lead } from '@/lib/types'

interface LeadsState {
  searchQuery: string
  statusFilter: string
  sourceFilter: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  selectedLead: Lead | null
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setSourceFilter: (source: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setSelectedLead: (lead: Lead | null) => void
  clearFilters: () => void
}

export const useLeadsStore = create<LeadsState>((set) => ({
  searchQuery: '',
  statusFilter: 'all',
  sourceFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  selectedLead: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSourceFilter: (source) => set({ sourceFilter: source }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  clearFilters: () => set({
    searchQuery: '',
    statusFilter: 'all',
    sourceFilter: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }),
}))
