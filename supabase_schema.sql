-- ============================================================
-- SQL Schema for NGO Impact Stories (Highlights, Spotlight, Posts)
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. Table: ngo_highlights
CREATE TABLE IF NOT EXISTS public.ngo_highlights (
    id text PRIMARY KEY,
    title text NOT NULL,
    category text,
    "coverImage" text,
    "shortDescription" text,
    "fullDescription" text,
    date text,
    location text,
    "impactText" text,
    status text DEFAULT 'Published',
    "order" integer DEFAULT 0,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);

-- 2. Table: ngo_posts
CREATE TABLE IF NOT EXISTS public.ngo_posts (
    id text PRIMARY KEY,
    title text NOT NULL,
    category text,
    image text,
    "shortDescription" text,
    "fullDescription" text,
    date text,
    location text,
    "impactText" text,
    status text DEFAULT 'Published',
    "isSpotlight" boolean DEFAULT false,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);

-- 3. Table: ngo_spotlight
CREATE TABLE IF NOT EXISTS public.ngo_spotlight (
    id text PRIMARY KEY,
    title text NOT NULL,
    category text,
    image text,
    "shortDescription" text,
    "fullDescription" text,
    date text,
    location text,
    "impactStat1" text,
    "impactStat2" text,
    "impactStat3" text,
    "buttonText" text DEFAULT 'View Program',
    "buttonLink" text DEFAULT '#',
    status text DEFAULT 'Active',
    "isSpotlight" boolean DEFAULT true,
    "createdAt" timestamp with time zone DEFAULT now(),
    "updatedAt" timestamp with time zone DEFAULT now()
);

-- ============================================================
-- Set up Row Level Security (RLS) policies
-- (Assuming public read access and authenticated write access)
-- ============================================================

-- Enable RLS
ALTER TABLE public.ngo_highlights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ngo_spotlight ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all three tables
CREATE POLICY "Allow public read access on ngo_highlights" ON public.ngo_highlights FOR SELECT USING (true);
CREATE POLICY "Allow public read access on ngo_posts" ON public.ngo_posts FOR SELECT USING (true);
CREATE POLICY "Allow public read access on ngo_spotlight" ON public.ngo_spotlight FOR SELECT USING (true);

-- Allow public write access (admin panel runs unauthenticated)
CREATE POLICY "Allow public insert on ngo_highlights" ON public.ngo_highlights FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on ngo_highlights" ON public.ngo_highlights FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on ngo_highlights" ON public.ngo_highlights FOR DELETE USING (true);

CREATE POLICY "Allow public insert on ngo_posts" ON public.ngo_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on ngo_posts" ON public.ngo_posts FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on ngo_posts" ON public.ngo_posts FOR DELETE USING (true);

CREATE POLICY "Allow public insert on ngo_spotlight" ON public.ngo_spotlight FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on ngo_spotlight" ON public.ngo_spotlight FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on ngo_spotlight" ON public.ngo_spotlight FOR DELETE USING (true);

