-- BLR Picnic Registration Database Schema
-- Run this in your Supabase SQL Editor (https://supabase.com)

-- 1. Create the registrations table
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
    transaction_id TEXT, -- Optional UPI reference / transaction ID
    screenshot_url TEXT NOT NULL, -- URL of the uploaded screenshot
    status TEXT DEFAULT 'pending'::text NOT NULL -- pending, verified, cancelled
    );

-- Enable Row Level Security (RLS)
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 2. Configure RLS Policies for registrations table
-- Allow anonymous users to register (insert only)
CREATE
POLICY "Allow public insert to registrations"
ON public.registrations 
FOR INSERT 
TO anon 
WITH CHECK (true);

-- Restrict read/write to authenticated admins only (protect Mahatma privacy)
CREATE
POLICY "Allow admin read access"
ON public.registrations 
FOR
SELECT
    TO authenticated
    USING (true);

CREATE
POLICY "Allow admin update access"
ON public.registrations 
FOR
UPDATE
    TO authenticated
    USING (true);


-- 3. Storage Setup for Payment Screenshots
-- Note: Create a bucket named "screenshots" in the Supabase Dashboard under Storage.
-- Make sure the bucket is set to "Public" so screenshots can be resolved via public URL,
-- or run the SQL below to create it and configure security:

INSERT INTO storage.buckets (id, name, public)
VALUES ('screenshots', 'screenshots', true) ON CONFLICT (id) DO NOTHING;

-- Storage Security Policies for 'screenshots' bucket
-- Allow public/anonymous uploads
CREATE
POLICY "Allow public upload to screenshots"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'screenshots');

-- Allow public read of screenshots (so admin and app can view them)
CREATE
POLICY "Allow public read of screenshots"
ON storage.objects
FOR
SELECT
    TO anon
    USING (bucket_id = 'screenshots');
