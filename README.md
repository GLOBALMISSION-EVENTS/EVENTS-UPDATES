# Global Mission For Christ International Events Platform

A responsive website for showcasing GMCI events with a user-friendly drag-and-drop CMS on a separate admin route.

**Live site:** https://globalmission-events.github.io/EVENTS-UPDATES/

## Features

- **Events Showcase** — Display upcoming and recent events with filter tabs
- **Drag-and-Drop CMS** — Admin panel at `/admin` with event/slide/about management
- **Protected Admin Route** — CMS is gated behind Supabase Auth; unauthenticated users are redirected to `/login`
- **QR Code Generator** — Generate and download PNG/SVG QR codes for the event page
- **Secure Authentication** — Supabase Auth with email/password
- **GitHub Pages Deployment** — Automatic deploy via GitHub Actions on push to `main`
- **Pre-push Validation** — Husky hooks run lint, tests, and build before every push

## Project Structure

```
GMCI/
├── .github/
│   └── workflows/
│       └── deploy.yml       # CI: lint → test:coverage → build → deploy
├── gmci-app/
│   ├── .husky/
│   │   ├── pre-commit       # Runs npm test on commit
│   │   └── pre-push         # Runs npm run ci-check on push
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # ProtectedRoute (route guard)
│   │   │   ├── layout/      # Navbar, Footer
│   │   │   ├── sections/    # HeroCarousel, EventsSection, AboutSection, CMSSection, LoginSection
│   │   │   ├── shared/      # EventCard
│   │   │   └── ui/          # Button, Input, Modal, Textarea, Card
│   │   ├── hooks/           # useAuth, useEvents, useHeroSlides, useAboutContent
│   │   ├── lib/             # supabase client, utils
│   │   ├── pages/           # Home (public), AdminPage (protected), LoginPage, QRCodeGenerator
│   │   ├── types/           # TypeScript interfaces
│   │   └── App.tsx          # Route definitions
│   ├── public/              # Static assets (images)
│   └── package.json         # Project dependencies and scripts
└── README.md
```

## Routes

| Path | Access | Content |
|---|---|---|
| `/` | Public | Home — hero, events, about |
| `/login` | Public | Admin login; redirects to `/admin` on success |
| `/admin` | Protected | CMS panel (events, hero slides, about content, QR generator) |
| `/qrcode` | Public | Standalone QR code generator |

## Local Development

```bash
cd gmci-app
npm install
npm run dev
```

Open http://localhost:5173/EVENTS-UPDATES/

## Supabase Setup

### 1. Create Project
Go to https://supabase.com and create a new project.

### 2. Create Events Table
Run the full script below in the Supabase SQL Editor. It handles both
new setups and existing tables (adds the `position` column if missing).

```sql
-- Add position column if upgrading from an older schema
ALTER TABLE events ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;

-- Enable RLS (safe to run multiple times)
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Create policies (DROP + CREATE makes this idempotent)
DROP POLICY IF EXISTS "Enable read access for all users" ON events;
CREATE POLICY "Enable read access for all users" ON events
  FOR SELECT USING (true);

DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON events;
CREATE POLICY "Enable insert for authenticated users only" ON events
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable update for authenticated users only" ON events;
CREATE POLICY "Enable update for authenticated users only" ON events
  FOR UPDATE USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Enable delete for authenticated users only" ON events;
CREATE POLICY "Enable delete for authenticated users only" ON events
  FOR DELETE USING (auth.role() = 'authenticated');
```

If the table doesn't exist yet, run this **first**:

```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  position INTEGER DEFAULT 0,
  title TEXT NOT NULL,
  date TEXT NOT NULL,
  venue TEXT NOT NULL,
  description TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('upcoming', 'recent')),
  image TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. Seed Initial Events (Recommended)

Required because client-side seeding cannot insert with the anonymous
key under the default RLS policies.

```sql
INSERT INTO events (position, title, date, venue, description, type, image)
VALUES
  (1, 'Mission Impact Breakfast', '10th July 2026 - 9AM', 'Y.M.C.A. Hall - Nyeri Town', 'Join us for a morning of fellowship, prayer, and inspiration as we unite in fundraising for the Great August Harvest, 5th Annual Mega Conference & Medical Camp. Breakfast will be served. Come Hungry - Leave Inspired. Blessed are those who hunger and thirst for righteousness, for they shall be filled. Mat 5:6 (NIV)', 'upcoming', '/images/breakfast-poster.png'),
  (2, '5th Annual Mega Conference & Free Medical Camp', '9-16th August 2026 from 9AM', 'Kiamariga Nursery Grounds', 'Theme: Healing the Land - Amos 9:14 From Exile to Divine Restoration. All Are Welcome!', 'upcoming', '/images/about-us.png'),
  (3, 'Conference & Medical Camp @ Kiamariga', '9th -16th August 2026', 'Kiamariga', 'Our 5th Annual Conference & Medical Camp', 'upcoming', '/images/kiamariga-camp.jpg');
```

### 4. Configure Supabase Client
Update `gmci-app/src/lib/supabase.ts` with your project credentials.

### 5. Set Up Authentication
In Supabase → Authentication → Users, add an admin user (email + password).

## Available Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start dev server |
| `npm run build` | TypeScript check + production build |
| `npm run test` | Run Vitest tests (watch mode) |
| `npm run test:coverage` | Run tests with coverage report |
| `npm run lint` | ESLint (zero warnings policy) |
| `npm run ci-check` | **lint → test:coverage → build** — matches the CI pipeline |
| `npm run preview` | Preview production build |

## Git Hooks (Husky)

| Hook | Trigger | Runs |
|---|---|---|
| `pre-commit` | `git commit` | `npm test` |
| `pre-push` | `git push` | `npm run ci-check` |

Push will be blocked locally if any check fails, so CI should always pass.

## GitHub Pages Deployment

Push to `main` triggers `.github/workflows/deploy.yml`:
1. Lint
2. Test with coverage
3. Build
4. Deploy to GitHub Pages

Ensure **Settings → Pages → Source** is set to **GitHub Actions**.

## Technologies

React 18, TypeScript, Vite, Tailwind CSS, Supabase (Auth + Database),
TanStack Query, React Router v6, Vitest, Husky, QRCode.
