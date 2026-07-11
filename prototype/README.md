# GMCI Events Platform - React Prototype

A modern, responsive web application built with React, TypeScript, Vite, and Tailwind CSS for the Global Mission For Christ International events platform.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Data Fetching**: TanStack React Query
- **Forms**: React Hook Form
- **QR Code**: qrcode
- **Drag & Drop**: SortableJS
- **Database**: Supabase (ready for integration)

## Features

✅ **Modern UI/UX** - Clean, professional design with smooth animations
✅ **Fully Responsive** - Works perfectly on mobile, tablet, and desktop
✅ **Hero Carousel** - Auto-playing banner with manual controls
✅ **Events Management** - View, add, edit, delete, and reorder events
✅ **Content Management System (CMS)** - Admin interface for managing content
✅ **QR Code Generator** - High-quality QR code generation for the website
✅ **Authentication** - Simple admin login system
✅ **Drag & Drop** - Reorder events with ease
✅ **Import/Export** - Backup and restore event data

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Navigate to the prototype directory:
```bash
cd prototype
```

2. Install dependencies:
```bash
npm install
```

3. Copy images from the parent directory:
```bash
# Make sure to copy the images folder from ../ to ./public/
# The structure should be:
# public/
#   images/
#     hero images/
#     GLOBAL LOGO.png
#     about-us.png
#     breakfast-poster.png
#     DIRECTOR.png
#     kiamariga-camp.jpg
```

4. Start the development server:
```bash
npm run dev
```

5. Open your browser and navigate to `http://localhost:5173`

### Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── ui/                    # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── modal.tsx
│   │   └── textarea.tsx
│   ├── layout/               # Layout components
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── sections/             # Page sections
│   │   ├── HeroCarousel.tsx
│   │   ├── EventsSection.tsx
│   │   ├── AboutSection.tsx
│   │   ├── CMSSection.tsx
│   │   └── LoginSection.tsx
│   └── shared/               # Shared components
│       └── EventCard.tsx
├── hooks/                    # Custom hooks
│   ├── useAuth.ts
│   └── useEvents.ts
├── lib/                      # Utility functions
│   ├── supabase.ts
│   └── utils.ts
├── pages/                    # Page components
│   ├── Home.tsx
│   └── QRCodeGenerator.tsx
├── types/                    # TypeScript types
│   └── index.ts
├── App.tsx                   # Main app component
├── main.tsx                  # Entry point
└── index.css                 # Global styles with Tailwind
```

## Admin Login

- **Email**: admin@gmci.org (disabled field)
- **Password**: gmci2026

## Migration Benefits

### From Static HTML to React:

1. **Component Reusability** - Build once, use everywhere
2. **Type Safety** - Catch errors at compile time with TypeScript
3. **Better State Management** - React hooks and context
4. **Improved Developer Experience** - Hot module replacement, fast builds
5. **Modern Tooling** - Vite, ESLint, Prettier
6. **Scalability** - Easy to add new features and pages
7. **SEO Ready** - Can add server-side rendering later if needed
8. **Ecosystem** - Access to thousands of React libraries

## Supabase Integration

The prototype includes a Supabase client ready to be integrated. Currently, data is stored in localStorage for demonstration purposes. To connect to Supabase:

1. Set up your Supabase project
2. Update the configuration in `src/lib/supabase.ts`
3. Replace localStorage hooks with Supabase queries using React Query

## Deployment

The application can be deployed to:
- **Cloudflare Pages** (recommended) - Zero cost, excellent performance
- **Vercel**
- **Netlify**
- **GitHub Pages**

## License

MIT
