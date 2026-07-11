# GMCI Events Platform

A modern, responsive web application for Global Mission For Christ International, built with React, TypeScript, and Vite.

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Data Fetching**: TanStack React Query
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

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the local URL shown (typically `http://localhost:5173`)

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
│   ├── layout/                # Layout components (Navbar, Footer)
│   ├── sections/              # Page sections
│   └── shared/                # Shared components
├── hooks/                     # Custom hooks (useAuth, useEvents)
├── lib/                       # Utility functions and Supabase client
├── pages/                     # Page components
├── types/                     # TypeScript type definitions
├── App.tsx                    # Main app component
├── main.tsx                   # Entry point
└── index.css                  # Global styles with Tailwind
```

## Admin Login

- **Email**: admin@gmci.org
- **Password**: gmci2026

## License

MIT
