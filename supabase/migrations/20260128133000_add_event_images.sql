-- Add image fields to events for admin-managed event photos
ALTER TABLE public.events
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS image_path TEXT;