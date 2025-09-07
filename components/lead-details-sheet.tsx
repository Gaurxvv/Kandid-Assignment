'use client'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useLeadsStore } from '@/store/leads-store'
import { formatDate, formatCurrency } from '@/lib/utils'
import { Mail, Phone, Linkedin, Building, Calendar, DollarSign } from 'lucide-react'

const statusConfig = {
  pending: { variant: 'warning' as const, label: 'Pending' },
  contacted: { variant: 'secondary' as const, label: 'Contacted' },
  responded: { variant: 'default' as const, label: 'Responded' },
  converted: { variant: 'success' as const, label: 'Converted' },
}

export function LeadDetailsSheet() {
  const { selectedLead, setSelectedLead } = useLeadsStore()

  if (!selectedLead) return null

  const status = statusConfig[selectedLead.status]

  return (
    <Sheet open={!!selectedLead} onOpenChange={() => setSelectedLead(null)}>
      <SheetContent className="w-full sm:w-[400px] lg:w-[540px]">
        <SheetHeader>
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-lg font-semibold text-primary">
                {selectedLead.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <SheetTitle className="text-left">{selectedLead.name}</SheetTitle>
              <SheetDescription className="text-left">
                {selectedLead.email}
              </SheetDescription>
            </div>
            <Badge variant={status.variant}>
              {status.label}
            </Badge>
          </div>
        </SheetHeader>

        <div className="mt-4 space-y-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">{selectedLead.email}</div>
                </div>
              </div>
              
              {selectedLead.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{selectedLead.phone}</div>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3">
                <Building className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Company</div>
                  <div className="text-sm text-muted-foreground">{selectedLead.company}</div>
                </div>
              </div>
              
              {selectedLead.linkedin && (
                <div className="flex items-center gap-3">
                  <Linkedin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">LinkedIn</div>
                    <a 
                      href={selectedLead.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Lead Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Lead Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Estimated Value</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(selectedLead.value)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="text-sm font-medium">Created</div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(selectedLead.createdAt)}
                  </div>
                </div>
              </div>
              
              {selectedLead.lastContacted && (
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Last Contacted</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(selectedLead.lastContacted)}
                    </div>
                  </div>
                </div>
              )}
              
              <div>
                <div className="text-sm font-medium mb-2">Source</div>
                <Badge variant="outline">{selectedLead.source}</Badge>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2">
            <Button className="flex-1">
              Contact Lead
            </Button>
            <Button variant="outline" className="flex-1">
              Update Status
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
