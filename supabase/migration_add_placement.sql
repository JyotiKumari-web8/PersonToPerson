-- ==============================================================================
-- PersonToPerson Database Migration: Add Placement to Business Sponsors
-- ==============================================================================

ALTER TABLE public.business_sponsors
ADD COLUMN IF NOT EXISTS placement TEXT NOT NULL DEFAULT 'both'
CHECK (placement IN ('header', 'footer', 'both'));
