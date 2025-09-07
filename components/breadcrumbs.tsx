'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs() {
  const pathname = usePathname()
  
  const pathSegments = pathname.split('/').filter(Boolean)
  
  const breadcrumbs = pathSegments.map((segment, index) => {
    const href = '/' + pathSegments.slice(0, index + 1).join('/')
    const isLast = index === pathSegments.length - 1
    
    return {
      label: segment.charAt(0).toUpperCase() + segment.slice(1),
      href: isLast ? undefined : href,
    }
  })

  return (
    <nav className="flex items-center space-x-1 text-sm text-gray-600">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex items-center space-x-1">
          {index > 0 && <ChevronRight className="h-4 w-4 text-gray-400" />}
          {breadcrumb.href ? (
            <Link
              href={breadcrumb.href}
              className="text-gray-600 hover:text-gray-900"
            >
              {breadcrumb.label}
            </Link>
          ) : (
            <span className="font-medium text-gray-900">
              {breadcrumb.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
