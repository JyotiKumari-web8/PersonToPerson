-- ==============================================================================
-- Optional Seed Data / Initial Setup SQL
-- ==============================================================================

-- Example sponsor records
INSERT INTO public.sponsors (id, name, logo_url, website_url, description, is_active)
VALUES 
    ('e1111111-1111-1111-1111-111111111111', 'Apex Cloud Solutions', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=128&auto=format&fit=crop&q=80', 'https://example.com', 'Fast, secure cloud infrastructure for modern local businesses.', true),
    ('e2222222-2222-2222-2222-222222222222', 'Prime Hospitality Group', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=128&auto=format&fit=crop&q=80', 'https://example.com', 'Connecting gourmet diners with world-class local experiences.', true)
ON CONFLICT (id) DO NOTHING;
