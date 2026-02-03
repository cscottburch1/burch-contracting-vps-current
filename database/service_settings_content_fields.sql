-- Add content and SEO fields to service_settings table
-- This allows full content management for each service

ALTER TABLE service_settings
ADD COLUMN IF NOT EXISTS page_title VARCHAR(200) AFTER description,
ADD COLUMN IF NOT EXISTS page_content TEXT AFTER page_title,
ADD COLUMN IF NOT EXISTS meta_title VARCHAR(200) AFTER page_content,
ADD COLUMN IF NOT EXISTS meta_description VARCHAR(300) AFTER meta_title,
ADD COLUMN IF NOT EXISTS meta_keywords VARCHAR(500) AFTER meta_description,
ADD COLUMN IF NOT EXISTS hero_image VARCHAR(500) AFTER meta_keywords,
ADD COLUMN IF NOT EXISTS featured_image VARCHAR(500) AFTER hero_image,
ADD COLUMN IF NOT EXISTS call_to_action_text VARCHAR(200) DEFAULT 'Get a Free Quote' AFTER featured_image,
ADD COLUMN IF NOT EXISTS call_to_action_url VARCHAR(500) DEFAULT '/contact' AFTER call_to_action_text;

-- Update existing services with SEO-friendly content
UPDATE service_settings SET
    page_title = 'Professional Handyman Services in Greenville, SC',
    page_content = '<p>Our skilled handymen handle all your home repair and maintenance needs. From fixing leaky faucets to installing ceiling fans, we do it all with precision and care.</p><p>No job is too small! We pride ourselves on providing prompt, professional service for all your handyman needs.</p>',
    meta_title = 'Handyman Services Greenville SC | Burch Contracting',
    meta_description = 'Professional handyman services in Greenville, SC. Quick fixes, installations, repairs & maintenance. Licensed & insured. Call for same-day service!',
    meta_keywords = 'handyman, home repairs, installations, maintenance, Greenville SC, quick fixes'
WHERE service_slug = 'handyman';

UPDATE service_settings SET
    page_title = 'Kitchen & Bathroom Remodeling Experts',
    page_content = '<p>Transform your home with our complete remodeling services. We specialize in kitchen and bathroom renovations that increase your home''s value and your quality of life.</p><p>From design to completion, our experienced team handles every aspect of your remodeling project with meticulous attention to detail.</p>',
    meta_title = 'Home Remodeling Greenville SC | Kitchen & Bath Experts',
    meta_description = 'Expert kitchen & bathroom remodeling in Greenville, SC. Custom designs, quality craftsmanship, and transparent pricing. Transform your home today!',
    meta_keywords = 'remodeling, kitchen remodel, bathroom remodel, renovation, Greenville SC, home improvement'
WHERE service_slug = 'remodeling';

UPDATE service_settings SET
    page_title = 'Home Additions & Expansion Services',
    page_content = '<p>Need more space? We build high-quality home additions including room additions, decks, porches, and outdoor living spaces that blend seamlessly with your existing home.</p><p>Our addition services are designed to maximize your home''s potential while maintaining its architectural integrity and increasing its value.</p>',
    meta_title = 'Home Additions Greenville SC | Room Additions & Decks',
    meta_description = 'Quality home additions in Greenville, SC. Room additions, decks, porches & outdoor spaces. Licensed builders with 20+ years experience. Free estimates!',
    meta_keywords = 'home additions, room addition, deck building, porch construction, Greenville SC, home expansion'
WHERE service_slug = 'additions';

UPDATE service_settings SET
    page_title = 'Basement Finishing & Renovation Services',
    page_content = '<p>Unlock the potential of your basement with our professional finishing services. We transform dark, unused spaces into beautiful, functional living areas perfect for entertainment, work, or relaxation.</p><p>Our basement finishing services include framing, drywall, flooring, lighting, and all finishing touches to create your dream space.</p>',
    meta_title = 'Basement Finishing Greenville SC | Complete Renovations',
    meta_description = 'Professional basement finishing in Greenville, SC. Complete renovations from design to finish. Increase your home value and living space. Free consultation!',
    meta_keywords = 'basement finishing, basement renovation, basement remodel, Greenville SC, home improvement'
WHERE service_slug = 'basement';
