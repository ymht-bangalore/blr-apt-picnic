-- BLR Picnic Registration Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com)

-- =========================================================================
-- DEBUG / CLEANUP STEP: Run this block to clean up any conflicting policies
-- =========================================================================
DO
$$
DECLARE
pol record;
BEGIN
    -- Drop all existing policies on public.registrations table
FOR pol IN
SELECT policyname
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename = 'registrations' LOOP
        EXECUTE format('DROP POLICY %I ON public.registrations', pol.policyname);
END LOOP;

    -- Drop all existing custom policies on storage.objects for the screenshots bucket
FOR pol IN
SELECT policyname
FROM pg_policies
WHERE schemaname = 'storage'
  AND tablename = 'objects'
  AND policyname LIKE '%screenshots%' LOOP
        EXECUTE format('DROP POLICY %I ON storage.objects', pol.policyname);
END LOOP;
END $$;


-- 1. Create the registrations table
-- MIGRATION NOTE FOR EXISTING TABLES:
-- If your registrations table is already created, run the following SQL command:
-- ALTER TABLE public.registrations ADD COLUMN IF NOT EXISTS pickup_point TEXT NOT NULL DEFAULT 'Self';

CREATE TABLE IF NOT EXISTS public.registrations
(
    id
    UUID
    PRIMARY
    KEY
    DEFAULT
    gen_random_uuid
(
),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    people JSONB NOT NULL, -- Stores array of objects: [{"name": "Mahatma Name", "mobile": "9876543210"}]
    amount INTEGER NOT NULL, -- Total calculated amount (₹100 * number of people)
    pickup_point TEXT NOT NULL DEFAULT 'Self', -- Boarding point for bus or Self
    screenshot_url TEXT NOT NULL, -- URL of the uploaded screenshot
    status TEXT DEFAULT 'pending'::text NOT NULL -- pending, verified, cancelled
    );

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 2. Configure RLS Policies for registrations table
-- Allow all roles (anonymous, authenticated, etc.) to register (insert only)
CREATE
POLICY "Allow public insert to registrations"
ON public.registrations 
FOR INSERT 
WITH CHECK (true);

CREATE
POLICY "Allow admin read access"
ON public.registrations 
FOR
SELECT
    TO authenticated
    USING (true);

-- Allow public to select registrations (required for UPDATE filters to locate the row)
CREATE
POLICY "Allow public select of pending registrations"
ON public.registrations
FOR
SELECT
    TO anon, authenticated
    USING (status = 'pending');

CREATE
POLICY "Allow admin update access"
ON public.registrations 
FOR
UPDATE
    TO authenticated
    USING (true);

-- Allow public to update pending registrations (e.g. to attach screenshots)
CREATE
POLICY "Allow public update of pending registrations"
ON public.registrations
FOR
UPDATE
    USING (status = 'pending')
WITH CHECK (status = 'pending');


-- 3. Storage Setup for Payment Screenshots
-- Note: Create a bucket named "screenshots" in the Supabase Dashboard under Storage.
-- Make sure the bucket is set to "Public" so screenshots can be resolved via public URL,
-- or run the SQL below to create it and configure security:

INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true) ON CONFLICT (id) DO NOTHING;

-- Storage Security Policies for 'screenshots' bucket
-- Allow public uploads (any role)
CREATE
POLICY "Allow public upload to screenshots"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'screenshots');

-- Allow public read of screenshots (so admin and app can view them)
CREATE
POLICY "Allow public read of screenshots"
ON storage.objects
FOR
SELECT
    USING (bucket_id = 'screenshots');
