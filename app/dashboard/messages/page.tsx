'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { MessageSquare, Search, Filter, Plus, Clock, CheckCircle, AlertCircle } from 'lucide-react'

const mockMessages = [
  {
    id: '1',
    leadName: 'Sarah Johnson',
    leadEmail: 'sarah@techcorp.com',
    company: 'TechCorp Inc.',
    lastMessage: 'Thanks for reaching out! I\'d love to learn more about your product.',
    timestamp: '2 hours ago',
    status: 'unread',
    campaign: 'Q4 Outreach'
  },
  {
    id: '2',
    leadName: 'Mike Chen',
    leadEmail: 'mike@startup.io',
    company: 'StartupIO',
    lastMessage: 'Can you send me more details about pricing?',
    timestamp: '4 hours ago',
    status: 'read',
    campaign: 'Product Launch'
  },
  {
    id: '3',
    leadName: 'Emily Davis',
    leadEmail: 'emily@enterprise.com',
    company: 'Enterprise Solutions',
    lastMessage: 'I\'m interested in scheduling a demo.',
    timestamp: '1 day ago',
    status: 'replied',
    campaign: 'Demo Campaign'
  },
  {
    id: '4',
    leadName: 'Alex Rodriguez',
    leadEmail: 'alex@consulting.com',
    company: 'Rodriguez Consulting',
    lastMessage: 'This looks perfect for our needs. When can we start?',
    timestamp: '2 days ago',
    status: 'converted',
    campaign: 'Holiday Special'
  }
]

const statusConfig = {
  unread: { variant: 'destructive' as const, label: 'Unread', icon: AlertCircle },
  read: { variant: 'secondary' as const, label: 'Read', icon: CheckCircle },
  replied: { variant: 'default' as const, label: 'Replied', icon: MessageSquare },
  converted: { variant: 'success' as const, label: 'Converted', icon: CheckCircle },
}

export default function MessagesPage() {
  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">
            Manage your conversations and message templates
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          New Message
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unread</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">23</div>
            <p className="text-xs text-muted-foreground">-5% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">68%</div>
            <p className="text-xs text-muted-foreground">+3% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Response Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4h</div>
            <p className="text-xs text-muted-foreground">-0.8h from last week</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <Input placeholder="Search messages..." className="pl-10" />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filter
          </Button>
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-4">
        {mockMessages.map((message) => {
          const status = statusConfig[message.status]
          return (
            <Card key={message.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-blue-100 text-blue-600">
                      {message.leadName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{message.leadName}</h3>
                        <Badge variant={status.variant} className="flex items-center gap-1">
                          <status.icon className="h-3 w-3" />
                          {status.label}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <span>{message.timestamp}</span>
                        <Badge variant="outline" className="text-xs">{message.campaign}</Badge>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{message.company} • {message.leadEmail}</p>
                    <p className="text-gray-700 line-clamp-2">{message.lastMessage}</p>
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
