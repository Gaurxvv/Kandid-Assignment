# Linkbird.ai SaaS Dashboard

A production-ready SaaS dashboard that replicates parts of Linkbird.ai (Leads + Campaigns) built with Next.js 15, TypeScript, Tailwind CSS, and shadcn/ui.

## Features

### 🎯 Core Functionality
- **Leads Management**: Complete lead lifecycle tracking with status management
- **Campaigns Management**: Campaign performance tracking and analytics
- **Real-time Search & Filtering**: Advanced filtering and search capabilities
- **Responsive Design**: Mobile-first responsive layout
- **Modern UI**: Beautiful, accessible interface with shadcn/ui components

### 🛠 Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **State Management**: Zustand
- **Data Fetching**: TanStack Query
- **Icons**: Lucide React
- **Font**: Poppins (global default)

### 📊 Dashboard Features
- **Sidebar Navigation**: Collapsible sidebar with navigation
- **Breadcrumb Navigation**: Clear page hierarchy
- **Profile Menu**: User profile and settings access
- **Error Boundaries**: Graceful error handling
- **Loading States**: Skeleton loaders and loading indicators
- **Infinite Scroll**: Efficient data loading for large datasets

### 🎨 UI/UX Features
- **Dark/Light Mode Ready**: CSS variables for theme switching
- **Accessibility**: ARIA compliant components
- **Mobile Responsive**: Optimized for all screen sizes
- **Smooth Animations**: CSS transitions and animations
- **Consistent Design**: Design system with reusable components

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd linkbird-saas-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Build for Production

```bash
npm run build
npm start
```

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Dashboard pages
│   │   ├── leads/        # Leads management
│   │   ├── campaigns/    # Campaigns management
│   │   ├── analytics/    # Analytics dashboard
│   │   └── settings/     # Settings page
│   ├── globals.css       # Global styles
│   └── layout.tsx        # Root layout
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── dashboard-shell.tsx
│   ├── sidebar.tsx
│   ├── header.tsx
│   └── ...
├── hooks/                 # Custom React hooks
│   ├── use-leads.ts
│   └── use-campaigns.ts
├── lib/                   # Utility functions
│   ├── utils.ts
│   ├── types.ts
│   ├── mock-data.ts
│   └── providers.tsx
├── store/                 # Zustand stores
│   ├── ui-store.ts
│   ├── leads-store.ts
│   └── campaigns-store.ts
└── ...
```

## Key Components

### Leads Management
- **Leads Table**: Sortable, filterable table with infinite scroll
- **Lead Details Sheet**: Side panel with complete lead information
- **Lead Filters**: Search, status, and source filtering
- **Lead Stats**: Overview cards with key metrics

### Campaigns Management
- **Campaigns Table**: Performance tracking with progress bars
- **Campaign Filters**: Search and status filtering
- **Campaign Stats**: Overall performance metrics
- **Response/Conversion Rates**: Visual progress indicators

### State Management
- **UI Store**: Sidebar state, theme preferences
- **Leads Store**: Search, filters, selected lead
- **Campaigns Store**: Search, filters, selected campaign

## Data Architecture

### Mock Data
Currently uses mock data arrays for development. The architecture is designed to easily integrate with:
- **Better Auth** for authentication
- **Drizzle ORM** for database operations
- **PostgreSQL** for data persistence

### Data Flow
1. **TanStack Query** handles data fetching and caching
2. **Zustand** manages UI state and filters
3. **React Query** provides optimistic updates and background refetching

## Customization

### Theming
The app uses CSS variables for theming. Modify `app/globals.css` to customize colors:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --primary-foreground: 210 40% 98%;
  /* ... other variables */
}
```

### Font
Poppins is set as the global default font. To change:

1. Update the import in `app/globals.css`
2. Modify the font family in `tailwind.config.js`

### Components
All UI components are built with shadcn/ui and can be customized by modifying the component files in `components/ui/`.

## Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy automatically

### Other Platforms
The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- AWS Amplify
- DigitalOcean App Platform

## Future Enhancements

### Planned Features
- [ ] Authentication with Better Auth
- [ ] Database integration with Drizzle ORM
- [ ] Real-time notifications
- [ ] Advanced analytics charts
- [ ] Email integration
- [ ] API endpoints
- [ ] User roles and permissions
- [ ] Data export functionality

### Integration Ready
The codebase is structured to easily integrate:
- **Authentication**: Better Auth provider ready
- **Database**: Drizzle ORM schemas can be added
- **API Routes**: Next.js API routes for backend
- **Real-time**: WebSocket integration points
- **Email**: Email service integration

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please open an issue in the repository.
