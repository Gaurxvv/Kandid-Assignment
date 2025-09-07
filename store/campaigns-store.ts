import { create } from 'zustand'
import { Campaign } from '@/lib/types'

interface CampaignsState {
  searchQuery: string
  statusFilter: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  selectedCampaign: Campaign | null
  setSearchQuery: (query: string) => void
  setStatusFilter: (status: string) => void
  setSortBy: (sortBy: string) => void
  setSortOrder: (order: 'asc' | 'desc') => void
  setSelectedCampaign: (campaign: Campaign | null) => void
  clearFilters: () => void
}

export const useCampaignsStore = create<CampaignsState>((set) => ({
  searchQuery: '',
  statusFilter: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
  selectedCampaign: null,
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  clearFilters: () => set({
    searchQuery: '',
    statusFilter: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  }),
}))
