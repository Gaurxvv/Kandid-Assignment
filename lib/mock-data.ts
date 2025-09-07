// Generate additional leads for infinite loading demo
const generateAdditionalLeads = (startId: number, count: number) => {
  const names = [
    'Alice Cooper', 'Bob Smith', 'Carol Davis', 'Derek Johnson', 'Eva Martinez',
    'Frank Wilson', 'Grace Lee', 'Henry Brown', 'Ivy Chen', 'Jack Taylor',
    'Kate Anderson', 'Liam O\'Connor', 'Maya Patel', 'Noah Kim', 'Olivia White',
    'Paul Garcia', 'Quinn Rodriguez', 'Ruby Thompson', 'Sam Wilson', 'Tina Zhang',
    'Uma Singh', 'Victor Lopez', 'Wendy Clark', 'Xavier Moore', 'Yara Ali',
    'Zoe Turner', 'Aaron Foster', 'Bella Reed', 'Caleb Hughes', 'Diana Price',
    'Ethan Wood', 'Fiona Bell', 'Gabriel Ward', 'Hannah Murphy', 'Isaac Cook',
    'Julia Bailey', 'Kyle Rivera', 'Luna Cooper', 'Marcus Howard', 'Nora Torres',
    'Oscar Peterson', 'Penelope Gray', 'Quentin Brooks', 'Riley Sanders', 'Sofia Price',
    'Tyler James', 'Uma Watson', 'Vincent Barnes', 'Willow Ross', 'Xander Cox'
  ]
  
  const companies = [
    'Tech Innovations', 'Digital Solutions', 'Cloud Systems', 'Data Analytics Co',
    'Software Solutions', 'IT Services', 'Web Development', 'Mobile Apps Inc',
    'AI Technologies', 'Blockchain Corp', 'Cyber Security', 'Network Solutions',
    'Database Systems', 'Cloud Computing', 'DevOps Inc', 'Agile Solutions',
    'Scrum Masters', 'Code Academy', 'Programming Hub', 'Tech Academy',
    'Innovation Labs', 'Startup Incubator', 'Venture Capital', 'Investment Group',
    'Financial Services', 'Banking Solutions', 'Insurance Corp', 'Real Estate Pro',
    'Property Management', 'Construction Co', 'Manufacturing Inc', 'Retail Solutions',
    'E-commerce Platform', 'Online Marketplace', 'Digital Marketing', 'Advertising Agency',
    'Media Company', 'Publishing House', 'Content Creation', 'Social Media',
    'Video Production', 'Photography Studio', 'Design Agency', 'Creative Solutions',
    'Brand Management', 'Public Relations', 'Event Planning', 'Consulting Services',
    'Business Solutions', 'Management Consulting'
  ]
  
  const sources = ['LinkedIn', 'Website', 'Referral', 'Cold Email', 'Social Media', 'Google Ads', 'Facebook', 'Twitter', 'Instagram', 'YouTube']
  const statuses = ['pending', 'contacted', 'responded', 'converted'] as const
  const campaigns = ['Q4 Outreach', 'Product Launch', 'Holiday Special', 'Webinar Series', 'Demo Campaign', 'Social Media', 'Email Marketing', 'Content Marketing', 'SEO Campaign', 'PPC Campaign']
  
  return Array.from({ length: count }, (_, index) => {
    const id = startId + index
    const name = names[id % names.length]
    const company = companies[id % companies.length]
    const source = sources[id % sources.length]
    const status = statuses[id % statuses.length]
    const campaign = campaigns[id % campaigns.length]
    const value = Math.floor(Math.random() * 20000) + 1000
    const createdAt = new Date(2023, 11, 1 + (id % 60), Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
    const lastContacted = new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000)
    
    return {
      id: id.toString(),
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@${company.toLowerCase().replace(/\s+/g, '')}.com`,
      phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      company,
      source,
      status,
      campaign,
      value,
      createdAt: createdAt.toISOString(),
      lastContacted: lastContacted.toISOString(),
      notes: `Lead ${id} - ${status} status`,
      linkedin: `linkedin.com/in/${name.toLowerCase().replace(/\s+/g, '')}`
    }
  })
}

export const mockLeads = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techcorp.com',
    phone: '+1-555-0123',
    company: 'TechCorp Inc.',
    source: 'LinkedIn',
    status: 'pending' as const,
    campaign: 'Q4 Outreach',
    value: 5000,
    createdAt: '2024-01-15T10:30:00Z',
    lastContacted: '2024-01-20T14:22:00Z',
    notes: 'Interested in enterprise solution',
    linkedin: 'linkedin.com/in/sarahjohnson'
  },
  {
    id: '2',
    name: 'Mike Chen',
    email: 'mike@startup.io',
    phone: '+1-555-0124',
    company: 'StartupIO',
    source: 'Website',
    status: 'contacted' as const,
    campaign: 'Product Launch',
    value: 2500,
    createdAt: '2024-01-14T09:15:00Z',
    lastContacted: '2024-01-19T11:45:00Z',
    notes: 'Requested demo for next week',
    linkedin: 'linkedin.com/in/mikechen'
  },
  {
    id: '3',
    name: 'Emily Davis',
    email: 'emily@enterprise.com',
    phone: '+1-555-0125',
    company: 'Enterprise Solutions',
    source: 'Referral',
    status: 'responded' as const,
    campaign: 'Demo Campaign',
    value: 15000,
    createdAt: '2024-01-13T16:20:00Z',
    lastContacted: '2024-01-18T13:30:00Z',
    notes: 'Very interested, wants to discuss pricing',
    linkedin: 'linkedin.com/in/emilydavis'
  },
  {
    id: '4',
    name: 'Alex Rodriguez',
    email: 'alex@consulting.com',
    phone: '+1-555-0126',
    company: 'Rodriguez Consulting',
    source: 'Cold Email',
    status: 'converted' as const,
    campaign: 'Holiday Special',
    value: 8000,
    createdAt: '2024-01-12T11:45:00Z',
    lastContacted: '2024-01-17T15:20:00Z',
    notes: 'Signed contract for Q1 implementation',
    linkedin: 'linkedin.com/in/alexrodriguez'
  },
  {
    id: '5',
    name: 'Jessica Wang',
    email: 'jessica@fintech.com',
    phone: '+1-555-0127',
    company: 'FinTech Solutions',
    source: 'LinkedIn',
    status: 'pending' as const,
    campaign: 'Webinar Series',
    value: 12000,
    createdAt: '2024-01-11T14:30:00Z',
    lastContacted: '2024-01-16T10:15:00Z',
    notes: 'Attended our webinar, very engaged',
    linkedin: 'linkedin.com/in/jessicawang'
  },
  {
    id: '6',
    name: 'David Thompson',
    email: 'david@retail.com',
    phone: '+1-555-0128',
    company: 'RetailMax',
    source: 'Website',
    status: 'contacted' as const,
    campaign: 'Q4 Outreach',
    value: 6000,
    createdAt: '2024-01-10T08:45:00Z',
    lastContacted: '2024-01-15T16:30:00Z',
    notes: 'Looking for retail-specific features',
    linkedin: 'linkedin.com/in/davidthompson'
  },
  {
    id: '7',
    name: 'Lisa Anderson',
    email: 'lisa@healthcare.com',
    phone: '+1-555-0129',
    company: 'HealthCare Plus',
    source: 'Referral',
    status: 'responded' as const,
    campaign: 'Product Launch',
    value: 20000,
    createdAt: '2024-01-09T13:20:00Z',
    lastContacted: '2024-01-14T09:45:00Z',
    notes: 'Compliance requirements discussion needed',
    linkedin: 'linkedin.com/in/lisaanderson'
  },
  {
    id: '8',
    name: 'Robert Kim',
    email: 'robert@manufacturing.com',
    phone: '+1-555-0130',
    company: 'Manufacturing Co',
    source: 'Cold Email',
    status: 'converted' as const,
    campaign: 'Demo Campaign',
    value: 18000,
    createdAt: '2024-01-08T15:10:00Z',
    lastContacted: '2024-01-13T14:20:00Z',
    notes: 'Closed deal for enterprise package',
    linkedin: 'linkedin.com/in/robertkim'
  },
  {
    id: '9',
    name: 'Amanda Wilson',
    email: 'amanda@education.com',
    phone: '+1-555-0131',
    company: 'EduTech Solutions',
    source: 'LinkedIn',
    status: 'pending' as const,
    campaign: 'Holiday Special',
    value: 7500,
    createdAt: '2024-01-07T12:30:00Z',
    lastContacted: '2024-01-12T11:15:00Z',
    notes: 'Budget approval pending',
    linkedin: 'linkedin.com/in/amandawilson'
  },
  {
    id: '10',
    name: 'James Brown',
    email: 'james@logistics.com',
    phone: '+1-555-0132',
    company: 'LogiFlow',
    source: 'Website',
    status: 'contacted' as const,
    campaign: 'Webinar Series',
    value: 9500,
    createdAt: '2024-01-06T10:45:00Z',
    lastContacted: '2024-01-11T15:30:00Z',
    notes: 'Interested in integration capabilities',
    linkedin: 'linkedin.com/in/jamesbrown'
  },
  {
    id: '11',
    name: 'Maria Garcia',
    email: 'maria@realestate.com',
    phone: '+1-555-0133',
    company: 'RealEstate Pro',
    source: 'Referral',
    status: 'responded' as const,
    campaign: 'Q4 Outreach',
    value: 11000,
    createdAt: '2024-01-05T14:15:00Z',
    lastContacted: '2024-01-10T12:45:00Z',
    notes: 'Wants to see ROI projections',
    linkedin: 'linkedin.com/in/mariagarcia'
  },
  {
    id: '12',
    name: 'Kevin Lee',
    email: 'kevin@automotive.com',
    phone: '+1-555-0134',
    company: 'AutoTech',
    source: 'Cold Email',
    status: 'converted' as const,
    campaign: 'Product Launch',
    value: 14000,
    createdAt: '2024-01-04T16:20:00Z',
    lastContacted: '2024-01-09T10:30:00Z',
    notes: 'Signed for premium package',
    linkedin: 'linkedin.com/in/kevinlee'
  },
  {
    id: '13',
    name: 'Rachel Taylor',
    email: 'rachel@fashion.com',
    phone: '+1-555-0135',
    company: 'Fashion Forward',
    source: 'LinkedIn',
    status: 'pending' as const,
    campaign: 'Demo Campaign',
    value: 4200,
    createdAt: '2024-01-03T11:30:00Z',
    lastContacted: '2024-01-08T14:15:00Z',
    notes: 'Seasonal business, timing important',
    linkedin: 'linkedin.com/in/racheltaylor'
  },
  {
    id: '14',
    name: 'Tom Wilson',
    email: 'tom@construction.com',
    phone: '+1-555-0136',
    company: 'BuildRight Construction',
    source: 'Website',
    status: 'contacted' as const,
    campaign: 'Holiday Special',
    value: 16000,
    createdAt: '2024-01-02T09:45:00Z',
    lastContacted: '2024-01-07T16:20:00Z',
    notes: 'Large project, needs custom features',
    linkedin: 'linkedin.com/in/tomwilson'
  },
  {
    id: '15',
    name: 'Sophie Martin',
    email: 'sophie@hospitality.com',
    phone: '+1-555-0137',
    company: 'Hospitality Group',
    source: 'Referral',
    status: 'responded' as const,
    campaign: 'Webinar Series',
    value: 8500,
    createdAt: '2024-01-01T13:10:00Z',
    lastContacted: '2024-01-06T11:45:00Z',
    notes: 'Multiple properties, needs multi-tenant setup',
    linkedin: 'linkedin.com/in/sophiemartin'
  },
  {
    id: '16',
    name: 'Chris Johnson',
    email: 'chris@energy.com',
    phone: '+1-555-0138',
    company: 'Green Energy Co',
    source: 'Cold Email',
    status: 'converted' as const,
    campaign: 'Q4 Outreach',
    value: 22000,
    createdAt: '2023-12-31T15:30:00Z',
    lastContacted: '2024-01-05T09:20:00Z',
    notes: 'Enterprise deal closed',
    linkedin: 'linkedin.com/in/chrisjohnson'
  },
  {
    id: '17',
    name: 'Nina Patel',
    email: 'nina@pharma.com',
    phone: '+1-555-0139',
    company: 'PharmaTech',
    source: 'LinkedIn',
    status: 'pending' as const,
    campaign: 'Product Launch',
    value: 19000,
    createdAt: '2023-12-30T12:45:00Z',
    lastContacted: '2024-01-04T13:30:00Z',
    notes: 'Regulatory compliance review needed',
    linkedin: 'linkedin.com/in/ninapatel'
  },
  {
    id: '18',
    name: 'Mark Thompson',
    email: 'mark@banking.com',
    phone: '+1-555-0140',
    company: 'SecureBank',
    source: 'Website',
    status: 'contacted' as const,
    campaign: 'Demo Campaign',
    value: 25000,
    createdAt: '2023-12-29T14:20:00Z',
    lastContacted: '2024-01-03T15:45:00Z',
    notes: 'Security audit in progress',
    linkedin: 'linkedin.com/in/markthompson'
  },
  {
    id: '19',
    name: 'Jennifer Liu',
    email: 'jennifer@ecommerce.com',
    phone: '+1-555-0141',
    company: 'ShopSmart',
    source: 'Referral',
    status: 'responded' as const,
    campaign: 'Holiday Special',
    value: 13000,
    createdAt: '2023-12-28T10:15:00Z',
    lastContacted: '2024-01-02T12:20:00Z',
    notes: 'Holiday season peak, urgent implementation',
    linkedin: 'linkedin.com/in/jenniferliu'
  },
  {
    id: '20',
    name: 'Daniel White',
    email: 'daniel@insurance.com',
    phone: '+1-555-0142',
    company: 'InsurePro',
    source: 'Cold Email',
    status: 'converted' as const,
    campaign: 'Webinar Series',
    value: 17000,
    createdAt: '2023-12-27T16:30:00Z',
    lastContacted: '2024-01-01T14:10:00Z',
    notes: 'Multi-year contract signed',
    linkedin: 'linkedin.com/in/danielwhite'
  },
  // Add 200 more leads for infinite loading demo
  ...generateAdditionalLeads(21, 200)
]

export const mockUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
  role: 'admin' as const
}

export const mockCampaigns = [
  {
    id: '1',
    name: 'Q4 Outreach Campaign',
    description: 'End-of-year outreach to high-value prospects',
    status: 'active' as const,
    totalLeads: 150,
    contactedLeads: 89,
    respondedLeads: 34,
    convertedLeads: 12,
    responseRate: 38.2,
    conversionRate: 35.3,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-20T10:30:00Z'
  },
  {
    id: '2',
    name: 'Product Launch 2024',
    description: 'Launch campaign for new product features',
    status: 'active' as const,
    totalLeads: 200,
    contactedLeads: 156,
    respondedLeads: 78,
    convertedLeads: 23,
    responseRate: 50.0,
    conversionRate: 29.5,
    createdAt: '2024-01-05T00:00:00Z',
    updatedAt: '2024-01-20T14:15:00Z'
  },
  {
    id: '3',
    name: 'Holiday Special Offer',
    description: 'Limited-time holiday promotion',
    status: 'paused' as const,
    totalLeads: 75,
    contactedLeads: 45,
    respondedLeads: 18,
    convertedLeads: 8,
    responseRate: 40.0,
    conversionRate: 44.4,
    createdAt: '2023-12-01T00:00:00Z',
    updatedAt: '2024-01-15T09:20:00Z'
  },
  {
    id: '4',
    name: 'Webinar Series Follow-up',
    description: 'Follow-up campaign for webinar attendees',
    status: 'active' as const,
    totalLeads: 120,
    contactedLeads: 98,
    respondedLeads: 42,
    convertedLeads: 15,
    responseRate: 42.9,
    conversionRate: 35.7,
    createdAt: '2024-01-10T00:00:00Z',
    updatedAt: '2024-01-20T16:45:00Z'
  },
  {
    id: '5',
    name: 'Demo Campaign Q1',
    description: 'Q1 demo requests and follow-ups',
    status: 'completed' as const,
    totalLeads: 80,
    contactedLeads: 80,
    respondedLeads: 32,
    convertedLeads: 11,
    responseRate: 40.0,
    conversionRate: 34.4,
    createdAt: '2023-10-01T00:00:00Z',
    updatedAt: '2023-12-31T23:59:59Z'
  }
]
