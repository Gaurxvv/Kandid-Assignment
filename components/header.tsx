'use client'

import { Breadcrumbs } from '@/components/breadcrumbs'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'

export function Header() {
  return (
    <header className="flex h-16 items-center justify-between  px-6">
      <div className="flex items-center gap-4">
        <Breadcrumbs />
      </div>
    </header>
  )
}
