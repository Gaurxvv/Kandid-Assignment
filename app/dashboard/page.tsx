'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { 
  ChevronDown, 
  CheckCircle, 
  Clock, 
  User, 
  XCircle,
  Plane,
  Linkedin
} from 'lucide-react'

export default function DashboardPage() {
  const campaigns = [
    { name: 'Just Herbs', status: 'Active' },
    { name: 'Juicy chemistry', status: 'Active' },
    { name: 'Hyugalife 2', status: 'Active' },
    { name: 'Honeyveda', status: 'Active' },
    { name: 'HempStreet', status: 'Active' },
    { name: 'HealthyHey 2', status: 'Active' }
  ]

  const linkedinAccounts = [
    {
      name: 'Pulkit Garg',
      email: 'pulkit@example.com',
      status: 'Connected',
      requests: { sent: 17, total: 30 }
    },
    {
      name: 'Jivesh Lakhani',
      email: 'jivesh@example.com',
      status: 'Connected',
      requests: { sent: 19, total: 30 }
    },
    {
      name: 'Indrajit Sahani',
      email: 'indrajit@example.com',
      status: 'Connected',
      requests: { sent: 18, total: 30 }
    },
    {
      name: 'Bhavya Arora',
      email: 'bhavya@example.com',
      status: 'Connected',
      requests: { sent: 18, total: 100 }
    }
  ]

  const recentActivity = [
    {
      lead: { name: 'Om Satyarthy', role: 'CEO at TechCorp', initials: 'OS' },
      campaign: 'Gynoveda',
      status: { text: 'Pending Approval', type: 'pending', icon: Clock }
    },
    {
      lead: { name: 'Surdeep Singh', role: 'Marketing Director', initials: 'SS' },
      campaign: 'Digi Sidekick',
      status: { text: 'Sent 7 mins ago', type: 'sent', icon: User }
    },
    {
      lead: { name: 'Dilbag Singh', role: 'Sales Manager', initials: 'DS' },
      campaign: 'The skin story',
      status: { text: 'Do Not Contact', type: 'blocked', icon: XCircle }
    },
    {
      lead: { name: 'Vanshy Jain', role: 'Product Manager', initials: 'VJ' },
      campaign: 'Pokonut',
      status: { text: 'Sent 7 mins ago', type: 'sent', icon: User }
    },
    {
      lead: { name: 'Sunil Pal', role: 'CTO', initials: 'SP' },
      campaign: 'Reaquil',
      status: { text: 'Followup 10 mins ago', type: 'followup', icon: Plane }
    },
    {
      lead: { name: 'Utkarsh K.', role: 'Founder', initials: 'UK' },
      campaign: 'Gynoveda',
      status: { text: 'Sent 7 mins ago', type: 'sent', icon: User }
    },
    {
      lead: { name: 'Shreya Ramakrishna', role: 'VP Marketing', initials: 'SR' },
      campaign: 'Digi Sidekick',
      status: { text: 'Followup 10 mins ago', type: 'followup', icon: Plane }
    },
    {
      lead: { name: 'Deepak Kumar', role: 'Operations Head', initials: 'DK' },
      campaign: 'The skin story',
      status: { text: 'Sent 7 mins ago', type: 'sent', icon: User }
    }
  ]

  const getStatusColor = (type: string) => {
    switch (type) {
      case 'pending': return 'text-purple-600'
      case 'sent': return 'text-orange-600'
      case 'blocked': return 'text-gray-600'
      case 'followup': return 'text-blue-600'
      default: return 'text-gray-600'
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">
          Overview of your campaigns and lead generation performance
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Campaigns and LinkedIn Accounts */}
        <div className="lg:col-span-1 space-y-6">
          {/* Campaigns Section */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Campaigns</CardTitle>
              <Button variant="outline" size="sm" className="text-sm">
                All Campaigns <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {campaigns.map((campaign, index) => (
                  <div key={index} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                    <span className="font-medium text-gray-900">{campaign.name}</span>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {campaign.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* LinkedIn Accounts Section */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">LinkedIn Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {linkedinAccounts.map((account, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                        {account.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-gray-900 truncate">{account.name}</span>
                        <Linkedin className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-sm text-gray-500 truncate">{account.email}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800 mb-1">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        {account.status}
                      </Badge>
                      <div className="text-xs text-gray-500">
                        {account.requests.sent}/{account.requests.total}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Recent Activity */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
              <Button variant="outline" size="sm" className="text-sm">
                Most Recent <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="grid grid-cols-12 items-center p-3 hover:bg-gray-50 rounded-lg gap-0">
                    <div className="col-span-2">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-gray-200 text-gray-600 text-sm">
                          {activity.lead.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="col-span-3">
                      <div className="font-medium text-gray-900">{activity.lead.name}</div>
                      <div className="text-sm text-gray-500">{activity.lead.role}</div>
                    </div>
                    <div className="col-span-3 text-center">
                      <div className="text-sm font-medium text-gray-900">{activity.campaign}</div>
                    </div>
                    <div className="col-span-3 flex items-center justify-end gap-2">
                      <activity.status.icon className={`h-4 w-4 ${getStatusColor(activity.status.type)}`} />
                      <span className={`text-sm font-medium ${getStatusColor(activity.status.type)}`}>
                        {activity.status.text}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
