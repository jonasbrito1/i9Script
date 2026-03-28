-- Add fields for landing page integration
ALTER TABLE projects
ADD COLUMN show_on_landing BOOLEAN DEFAULT FALSE,
ADD COLUMN landing_image TEXT,
ADD COLUMN landing_tags TEXT,
ADD COLUMN landing_link VARCHAR(255);

-- Update i9Script Web Client to show on landing
UPDATE projects
SET show_on_landing = TRUE
WHERE title = 'i9Script Web Client';
