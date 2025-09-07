'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Linkedin, Plus, Settings, Users, MessageSquare, TrendingUp, CheckCircle, AlertCircle, Clock } from 'lucide-react'

const mockAccounts = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john@company.com',
    profileUrl: 'linkedin.com/in/johnsmith',
    status: 'active',
    connections: 1250,
    messagesSent: 45,
    responseRate: 68,
    lastActivity: '2 hours ago',
    avatar: null
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah@company.com',
    profileUrl: 'linkedin.com/in/sarahjohnson',
    status: 'paused',
    connections: 890,
    messagesSent: 23,
    responseRate: 72,
    lastActivity: '1 day ago',
    avatar: null
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike@company.com',
    profileUrl: 'linkedin.com/in/mikechen',
    status: 'error',
    connections: 2100,
    messagesSent: 0,
    responseRate: 0,
    lastActivity: '3 days ago',
    avatar: null
  }
]

const statusConfig = {
  active: { variant: 'success' as const, label: 'Active', icon: CheckCircle },
  paused: { variant: 'secondary' as const, label: 'Paused', icon: Clock },
  error: { variant: 'destructive' as const, label: 'Error', icon: AlertCircle },
}

export default function LinkedInPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">LinkedIn Accounts</h1>
          <p className="text-gray-600 mt-1">
            Manage your LinkedIn accounts and connections
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Account
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Accounts</CardTitle>
            <Linkedin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">2 active, 1 paused</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Connections</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4,240</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages Sent</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68</div>
            <p className="text-xs text-muted-foreground">+8 this week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">70%</div>
            <p className="text-xs text-muted-foreground">+5% from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Accounts List */}
      <div className="space-y-4">
        {mockAccounts.map((account) => {
          const status = statusConfig[account.status]
          return (
            <Card key={account.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-blue-100 text-blue-600">
                        {account.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{account.name}</h3>
                        <Badge variant={status.variant} className="flex items-center gap-1">
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{account.email}</p>
                      <p className="text-xs text-gray-500">{account.profileUrl}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{account.connections.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Connections</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{account.messagesSent}</div>
                      <div className="text-xs text-gray-500">Messages</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-semibold text-gray-900">{account.responseRate}%</div>
                      <div className="text-xs text-gray-500">Response Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-500">{account.lastActivity}</div>
                      <div className="text-xs text-gray-400">Last Activity</div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="flex items-center gap-1">
                        <Settings className="h-3 w-3" />
                        Settings
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
