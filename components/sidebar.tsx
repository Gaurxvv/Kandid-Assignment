'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useUIStore } from '@/store/ui-store'
import { useSession, signOut } from '@/lib/auth-client'
import { 
  Users, 
  Megaphone, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  Home,
  MessageSquare,
  Linkedin,
  ClipboardList,
  UserCheck,
  Moon,
  ChevronDown,
  MessageCircle,
  ArrowUp,
  Zap,
  Headphones,
  Link2
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'

const navigation = [
  { 
    section: 'Overview',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home },
      { name: 'Leads', href: '/dashboard/leads', icon: Users },
      { name: 'Campaign', href: '/dashboard/campaigns', icon: Megaphone },
      { name: 'Messages', href: '/dashboard/messages', icon: MessageSquare, badge: '10+' },
      { name: 'LinkedIn Accounts', href: '/dashboard/linkedin', icon: Linkedin },
    ]
  },
  { 
    section: 'Settings',
    items: [
      { name: 'Setting & Billing', href: '/dashboard/settings', icon: Settings },
    ]
  },
  { 
    section: 'Admin Panel',
    items: [
      { name: 'Activity logs', href: '/dashboard/activity', icon: Zap },
      { name: 'User logs', href: '/dashboard/users', icon: UserCheck },
    ]
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarCollapsed, toggleSidebar } = useUIStore()
  const { data: session } = useSession()
  const user = session?.user

  const handleSignOut = async () => {
    try {
      console.log('Starting signout process...')
      // Try different signout methods
      try {
        const result = await signOut()
        console.log('Signout result:', result)
      } catch (signOutError) {
        console.log('SignOut function error:', signOutError)
        // Try manual signout by clearing cookies and redirecting
        document.cookie = 'better-auth.session_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      }
      // Force a page reload to clear any cached state
      window.location.href = '/login'
    } catch (error) {
      console.error('Error signing out:', error)
      // Even if there's an error, redirect to login
      window.location.href = '/login'
    }
  }

  return (
    <>
      {/* Mobile overlay */}
      {!sidebarCollapsed && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed left-2 top-2 bottom-2 z-50 bg-white border-r rounded-lg border-gray-200 transition-all duration-300",
        sidebarCollapsed ? "w-16" : "w-64"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200">
            {!sidebarCollapsed && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">LB</span>
                </div>
                <h1 className="text-xl font-bold text-gray-900">LinkBird</h1>
              </div>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              className="h-10 w-10 text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* User Profile */}
          <div className="px-4 py-3 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-gray-400 text-white text-xs">
                  {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <div className="text-gray-900 text-sm font-medium">{user?.name || 'User'}</div>
                  <div className="text-gray-500 text-xs">{(user as any)?.role || 'user'}</div>
                </div>
              )}
              {!sidebarCollapsed && <ChevronDown className="h-5 w-5 text-gray-400" />}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-6 p-4 overflow-y-auto">
            {navigation.map((section) => (
              <div key={section.section}>
                {!sidebarCollapsed && (
                  <div className="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-3">
                    {section.section}
                  </div>
                )}
                <div className="space-y-1">
                  {section.items.map((item) => {
                    const isActive = pathname === item.href || (item.href === '/dashboard' && pathname === '/dashboard')
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        className={cn(
                          "flex items-center rounded-lg text-sm font-medium transition-colors group",
                          sidebarCollapsed ? "px-2 py-2 justify-center" : "px-3 py-2",
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                        )}
                      >
                        <item.icon className="h-5 w-5" />
                        {!sidebarCollapsed && <span className="ml-3" />}
                        {!sidebarCollapsed && (
                          <>
                            <span className="flex-1">{item.name}</span>
                            {item.badge && (
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5">
                                {item.badge}
                              </Badge>
                            )}
                          </>
                        )}
                      </Link>
                    )
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom User Profile */}
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-gray-400 text-white text-xs">
                    {user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                {!sidebarCollapsed && (
                  <Badge className="absolute -bottom-1 -left-1 text-xs bg-blue-600 text-white px-1 py-0.5 text-[10px]">PRO</Badge>
                )}
              </div>
              {!sidebarCollapsed && (
                <div className="flex-1">
                  <div className="text-gray-900 text-sm font-medium">{user?.name || 'User'}</div>
                  <div className="text-gray-500 text-xs">{user?.email || 'user@example.com'}</div>
                </div>
              )}
            </div>
            {!sidebarCollapsed && (
              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                    <Link2 className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                    <Headphones className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-6 w-6 text-gray-400 hover:text-gray-600 hover:bg-gray-100 flex items-center justify-center">
                    <Moon className="h-5 w-5" />
                  </Button>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-red-600 hover:bg-red-50 text-xs"
                >
                  Sign out
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
