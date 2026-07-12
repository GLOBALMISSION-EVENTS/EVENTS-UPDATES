-- ============================================================
-- GMCI Database Migration: Add missing tables and columns
-- Run this in Supabase SQL Editor (https://supabase.com)
-- ============================================================

-- 1. Fix events table: add missing columns
ALTER TABLE events ADD COLUMN IF NOT EXISTS position INTEGER DEFAULT 0;
ALTER TABLE events ADD COLUMN IF NOT EXISTS event_date TEXT;

-- 2. Create hero_slides table
CREATE TABLE IF NOT EXISTS hero_slides (
    id BIGSERIAL PRIMARY KEY,
    image TEXT NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    position INTEGER DEFAULT 0,
    focal_x REAL DEFAULT 50,
    focal_y REAL DEFAULT 50,
    scale REAL DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public hero slides are viewable by everyone" ON hero_slides;
CREATE POLICY "Public hero slides are viewable by everyone"
    ON hero_slides FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert hero slides" ON hero_slides;
CREATE POLICY "Authenticated users can insert hero slides"
    ON hero_slides FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update hero slides" ON hero_slides;
CREATE POLICY "Authenticated users can update hero slides"
    ON hero_slides FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete hero slides" ON hero_slides;
CREATE POLICY "Authenticated users can delete hero slides"
    ON hero_slides FOR DELETE
    USING (auth.role() = 'authenticated');

CREATE INDEX IF NOT EXISTS hero_slides_position_idx ON hero_slides(position);

-- 3. Create site_content table
CREATE TABLE IF NOT EXISTS site_content (
    id BIGSERIAL PRIMARY KEY,
    section TEXT NOT NULL UNIQUE,
    vision TEXT NOT NULL DEFAULT '',
    mission TEXT NOT NULL DEFAULT '',
    values TEXT[] DEFAULT '{}',
    directorName TEXT NOT NULL DEFAULT '',
    directorTitle TEXT NOT NULL DEFAULT '',
    directorImage TEXT DEFAULT '',
    directorMessage TEXT[] DEFAULT '{}',
    aboutImage TEXT DEFAULT '',
    contactPhone TEXT[] DEFAULT '{}',
    contactEmail TEXT[] DEFAULT '{}',
    contactTwitter TEXT DEFAULT '',
    contactYoutube TEXT DEFAULT '',
    contactAddress TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE site_content ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public site content is viewable by everyone" ON site_content;
CREATE POLICY "Public site content is viewable by everyone"
    ON site_content FOR SELECT
    USING (true);

DROP POLICY IF EXISTS "Authenticated users can insert site content" ON site_content;
CREATE POLICY "Authenticated users can insert site content"
    ON site_content FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can update site content" ON site_content;
CREATE POLICY "Authenticated users can update site content"
    ON site_content FOR UPDATE
    USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Authenticated users can delete site content" ON site_content;
CREATE POLICY "Authenticated users can delete site content"
    ON site_content FOR DELETE
    USING (auth.role() = 'authenticated');

-- Insert default about section content
INSERT INTO site_content (section, vision, mission, values, directorName, directorTitle, directorImage, directorMessage, aboutImage, contactPhone, contactEmail, contactTwitter, contactYoutube, contactAddress)
VALUES (
    'about',
    'Propagate Revival to the nations of the world and draw men to Christ by the power of the Lord Jesus Christ.',
    'Global mission for Christ international is dedicated to igniting the fire of revival and to the teachings of the word of God. Raising men and women who will impact their generation through prayer, passion, and praise.',
    ARRAY['Prayers', 'Word of God', 'Power of the Holy Spirit', 'Righteousness', 'Passion'],
    'Rev. Dr. Anthony Waithaka',
    'Director, Global Mission for Christ International',
    '/images/DIRECTOR.png',
    ARRAY[
        'At Global Mission for Christ International, our heartbeat is to see lives transformed by the power of Jesus Christ and revival spread to the nations of the world.',
        'We are committed to raising men and women grounded in prayer, rooted in the Word of God, empowered by the Holy Spirit, passionate for righteousness, and dedicated to impacting their generation for Christ.',
        'As a ministry, we continue to reach communities through the Gospel, prayer gatherings, revival meetings, and acts of compassion by supporting the needy through medical and community outreach programs.',
        'May this ministry continue to inspire faith, ignite passion for God, and draw many into a deeper relationship with Christ. Together, let us shine His light and carry the message of hope to the world.'
    ],
    '/images/about-us.png',
    ARRAY['+254 715 493 666', '+254 710 642 232'],
    ARRAY['globalmissionfci@gmail.com', 'info@globalmissionfci.org'],
    'Twitter',
    'YouTube: @GlobalMissionForChristK',
    ARRAY['P.O. BOX 444 - 10100', 'Kenya']
) ON CONFLICT (section) DO NOTHING;
