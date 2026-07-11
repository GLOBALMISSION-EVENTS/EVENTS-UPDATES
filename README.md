# Global Mission For Christ International Events Platform

A beautiful, responsive website for showcasing GMCI events with a user-friendly drag-and-drop CMS.

## Features

✨ **Beautiful Design** - Visually compelling UI with professional styling
📅 **Events Showcase** - Display upcoming and recent events
📝 **Drag-and-Drop CMS** - Easy event management for non-technical users
🔐 **Admin Login** - Secure authentication with Supabase
💾 **Supabase Database** - Real-time database for event storage
📤 **Import/Export** - Backup and restore event data
📱 **Responsive** - Works perfectly on all devices
🌐 **GitHub Pages Ready** - Easy deployment via GitHub Actions

## Project Structure

```
GMCI/
├── .github/
│   └── workflows/
│       └── deploy.yml    # GitHub Pages deployment workflow
├── gmci-app/
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/    # Navbar, Footer
│   │   │   ├── sections/  # HeroCarousel, EventsSection, AboutSection, etc.
│   │   │   ├── shared/    # EventCard, Button, Input, etc.
│   │   │   └── ui/        # UI components
│   │   ├── hooks/         # useAuth, useEvents
│   │   ├── lib/           # utils, supabase client
│   │   ├── pages/         # Home, QRCodeGenerator
│   │   ├── types/         # TypeScript types
│   │   └── App.tsx        # Main app component
│   ├── public/            # Static assets (images)
│   └── package.json       # Project dependencies
└── README.md              # This file
```

## Supabase Setup

To set up your Supabase backend:

### 1. Create a Supabase Project
- Go to https://supabase.com and create a new project
- Wait for the project to initialize

### 2. Create Events Table
Go to your Supabase project → SQL Editor → New Query and run:

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  venue TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('upcoming', 'recent')),
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Enable read access for all users" ON events
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable delete for authenticated users only" ON events
  FOR DELETE USING (auth.role() = 'authenticated');
```

### 3. Configure Supabase Client
Update `gmci-app/src/lib/supabase.ts` with your project credentials:
```typescript
const SUPABASE_URL = 'YOUR_SUPABASE_URL'
const SUPABASE_ANON_KEY = 'YOUR_SUPABASE_ANON_KEY'
```

### 4. Set Up Authentication
- In your Supabase project, go to Authentication → Users
- Add a new user (email and password) for admin login

## Local Development

1. Navigate to the app directory:
   ```bash
   cd gmci-app
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to http://localhost:5173/EVENTS-UPDATES/

## GitHub Pages Deployment

The project is set up for automatic deployment to GitHub Pages via GitHub Actions:

1. In your repository on GitHub, go to **Settings** → **Pages**
2. Under "Source", select **GitHub Actions**
3. Push your code to the `main` branch - the workflow will automatically build and deploy!

Your site will be live at: `https://YOUR_USERNAME.github.io/EVENTS-UPDATES/`

## How to Use the CMS

1. Login with your admin credentials
2. Click **+ Add New Event** to create a new event
3. Drag and drop events to reorder them
4. Click ✏️ to edit an event
5. Click 🗑️ to delete an event
6. Use 📤 Export and 📥 Import for backup/restore
7. Use 🔄 Reset to Default to restore original events

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Supabase (Auth + Database)
- TanStack Query
- Vitest (Testing)

## License

MIT
