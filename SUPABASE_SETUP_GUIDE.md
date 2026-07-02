# 🚀 Supabase Setup Guide for GMCI Events Platform

## Overview
This guide will walk you through setting up Supabase authentication and database for production-grade security.

---

## 📋 Prerequisites
- Supabase account (free): https://supabase.com
- GitHub account (for easy sign-in)

---

## Part 1: Create Supabase Project (5 minutes)

### Step 1: Sign Up
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign in with GitHub (easiest) or create account with email
4. Create organization: `GMCI` or your preferred name

### Step 2: Create Project
1. Click "New Project"
2. Fill in details:
   ```
   Name: gmci-events
   Database Password: [Generate strong password - SAVE IT!]
   Region: ap-southeast-1 (Singapore - closest to Kenya)
   Pricing Plan: Free
   ```
3. Click "Create new project"
4. ⏰ Wait 2-3 minutes for project to initialize

### Step 3: Get API Keys
Once project is ready:

1. Go to **Settings** (gear icon) → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6...` (long string)

3. Open `supabase-config.js` in your project
4. Replace:
   ```javascript
   url: 'YOUR_SUPABASE_URL_HERE'  →  url: 'https://xxxxx.supabase.co'
   anonKey: 'YOUR_SUPABASE_ANON_KEY_HERE'  →  anonKey: 'eyJhbG...'
   ```

---

## Part 2: Set Up Database (10 minutes)

### Step 4: Create Events Table

1. In Supabase dashboard, go to **SQL Editor**
2. Click "New query"
3. Copy and paste this SQL:

```sql
-- Create events table
CREATE TABLE IF NOT EXISTS events (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL CHECK (char_length(title) <= 200),
    date TEXT NOT NULL,
    venue TEXT NOT NULL,
    description TEXT NOT NULL CHECK (char_length(description) <= 5000),
    type TEXT NOT NULL CHECK (type IN ('upcoming', 'recent')),
    image TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id),
    display_order INTEGER DEFAULT 0
);

-- Enable Row Level Security
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read events (public website)
CREATE POLICY "Public events are viewable by everyone"
    ON events FOR SELECT
    USING (true);

-- Policy: Only authenticated users can insert
CREATE POLICY "Authenticated users can insert events"
    ON events FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Only authenticated users can update
CREATE POLICY "Authenticated users can update events"
    ON events FOR UPDATE
    USING (auth.role() = 'authenticated');

-- Policy: Only authenticated users can delete
CREATE POLICY "Authenticated users can delete events"
    ON events FOR DELETE
    USING (auth.role() = 'authenticated');

-- Create index for ordering
CREATE INDEX IF NOT EXISTS events_display_order_idx ON events(display_order);
CREATE INDEX IF NOT EXISTS events_type_idx ON events(type);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
CREATE TRIGGER update_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

4. Click **Run** (or press Ctrl/Cmd + Enter)
5. You should see: ✅ Success. No rows returned

### Step 5: Insert Initial Events (Optional)

If you want to migrate your existing events:

```sql
-- Insert your current events (update values as needed)
INSERT INTO events (title, date, venue, description, type, image, display_order) VALUES
('Mission Impact Breakfast', '10th July 2026 - 9AM', 'Y.M.C.A. Hall - Nyeri Town', 
 'Join us for a morning of fellowship, prayer, and inspiration as we unite in fundraising for the Great August Harvest, 5th Annual Mega Conference & Medical Camp. Breakfast will be served. Come Hungry - Leave Inspired. Blessed are those who hunger and thirst for righteousness, for they shall be filled. Mat 5:6 (NIV)', 
 'upcoming', 'images/breakfast-poster.png', 1),

('5th Annual Mega Conference & Free Medical Camp', '9-16th August 2026 from 9AM', 'Kiamariga Nursery Grounds',
 'Theme: Healing the Land - Amos 9:14 From Exile to Divine Restoration. All Are Welcome! Featuring: Rev. Anthony Waithaka (Director - GMCI), Archbishop Simon Githigi (Elim Pentecostal Kenya), Bishop Moses Mbugua (Redeemed Gospel Church Thika), Apostle Anthony Ngumo (Reigners Chapel), Rev. James Nyaga (Excellent Glory Center), Bishop Dr. Margaret Wangare (Anointed Christian Fellowship Banana).',
 'upcoming', 'images/about-us.png', 2),

('Conference & Medical Camp @ Kiamariga', '9th -16 August 2026', 'Kiamariga',
 'Our 5th Annual Conference & Medical Camp',
 'upcoming', 'images/kiamariga-camp.jpg', 3);
```

---

## Part 3: Set Up Authentication (5 minutes)

### Step 6: Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Find **Email** provider
3. Enable it (should be on by default)
4. **Confirm email**: OFF (for easier testing)
   - ⚠️ Turn ON for production
5. **Secure email change**: ON (recommended)
6. Click **Save**

### Step 7: Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add user** → **Create new user**
3. Fill in:
   ```
   Email: your-email@example.com
   Password: [Strong password - SAVE IT!]
   Auto Confirm User: ✅ (checked)
   ```
4. Click **Create user**

✅ This is your admin account!

---

## Part 4: Update Your Website Code (15 minutes)

### Step 8: Add Supabase Library to HTML

Open `index.html` and add this BEFORE the closing `</head>` tag:

```html
<!-- Supabase JS Client -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="supabase-config.js"></script>
```

### Step 9: Test Connection

1. Open your website locally
2. Open browser console (F12)
3. You should see: ✅ Supabase initialized
4. Test in console:
   ```javascript
   const { data, error } = await supabase.from('events').select('*');
   console.log(data); // Should show your events
   ```

---

## Part 5: Update Authentication (I'll code this for you next)

I'll create:
- ✅ `supabase-auth.js` - Authentication logic
- ✅ `supabase-events.js` - Event management with Supabase
- ✅ Update `index.html` to use Supabase
- ✅ Remove old localStorage code

---

## 📊 Before vs After

| Feature | Before (localStorage) | After (Supabase) |
|---------|----------------------|------------------|
| Authentication | Client-side password hash | Real user accounts |
| Data Storage | Browser localStorage (5-10MB) | Cloud database (500MB free) |
| Security | Can be manipulated | Row-level security |
| Sync | Single device only | All devices |
| Backup | Manual export only | Automatic backups |
| Images | Base64 in localStorage | Can use Supabase Storage |
| Multi-user | No | Yes (future) |

---

## 🎯 Next Steps

After you complete Part 1-3 (creating project and database):

1. ✅ Share your Supabase URL and anon key with me
2. I'll update all the code to use Supabase
3. Test locally
4. Deploy to GitHub Pages

---

## 💰 Pricing (Free Tier Limits)

Your usage will be **well within free tier**:

| Resource | Free Tier | Your Usage | Status |
|----------|-----------|------------|--------|
| Database | 500MB | ~10MB | ✅ |
| Storage | 1GB | ~100MB | ✅ |
| Auth Users | Unlimited | 1-5 | ✅ |
| API Requests | 50,000/month | ~1,000/month | ✅ |
| Bandwidth | 5GB | ~500MB | ✅ |

No credit card required!

---

## 🆘 Troubleshooting

### "Supabase library not loaded"
- Check that CDN script is in `<head>` section
- Check internet connection
- Try different CDN: `https://unpkg.com/@supabase/supabase-js@2`

### "Invalid API key"
- Double-check you copied the **anon** key (not service_role key)
- Make sure there are no extra spaces
- Try regenerating the key in Supabase dashboard

### "Row Level Security" errors
- Make sure you ran ALL the SQL in Step 4
- Check policies are enabled: **Authentication** → **Policies**

### Can't login
- Check user was created: **Authentication** → **Users**
- Make sure "Auto Confirm User" was checked
- Try resetting password from Supabase dashboard

---

## 📞 Support

If you get stuck:
1. Check Supabase docs: https://supabase.com/docs
2. Check browser console for errors (F12)
3. Verify all SQL ran successfully
4. Let me know and I'll help debug!

---

**Ready to proceed?**

Complete Steps 1-7 above, then tell me when you have:
- ✅ Supabase project created
- ✅ Database table created
- ✅ Admin user created
- ✅ URL and anon key copied to `supabase-config.js`

Then I'll write the integration code!
