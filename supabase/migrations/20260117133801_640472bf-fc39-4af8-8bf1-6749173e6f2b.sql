-- Create events table
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    location TEXT,
    is_recurring BOOLEAN DEFAULT false,
    recurring_pattern TEXT, -- 'weekly', 'monthly', 'first_saturday', etc.
    is_featured BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on events
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can view events (public)
CREATE POLICY "Anyone can view events"
ON public.events
FOR SELECT
USING (true);

-- Policy: Only admins can insert events
CREATE POLICY "Admins can insert events"
ON public.events
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can update events
CREATE POLICY "Admins can update events"
ON public.events
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Policy: Only admins can delete events
CREATE POLICY "Admins can delete events"
ON public.events
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_events_updated_at
BEFORE UPDATE ON public.events
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample upcoming events
INSERT INTO public.events (title, description, event_date, start_time, end_time, location, is_recurring, recurring_pattern, is_featured) VALUES
('Easter Sunday Celebration', 'Join us for a special Easter service celebrating the resurrection of Christ. Sunrise service at 6:30 AM, followed by breakfast and main services.', '2026-04-05', '08:00:00', '12:00:00', 'Main Sanctuary', false, null, true),
('Vacation Bible School', 'A week of fun, learning, and faith for kids ages 4-12. Registration required.', '2026-06-15', '09:00:00', '12:00:00', 'Education Building', false, null, true),
('Summer Youth Camp', 'Annual youth retreat for students grades 6-12. Three days of worship, fellowship, and adventure.', '2026-07-10', '08:00:00', '17:00:00', 'Camp Lakewood', false, null, true),
('Community Food Drive', 'Help us collect non-perishable food items for local families in need.', '2026-02-14', '09:00:00', '14:00:00', 'Church Parking Lot', false, null, false),
('Women''s Bible Study Kickoff', 'New study series begins! All women are welcome.', '2026-02-07', '10:00:00', '11:30:00', 'Fellowship Hall', false, null, false),
('Men''s Breakfast Fellowship', 'Monthly gathering for food, faith, and friendship.', '2026-02-21', '08:00:00', '10:00:00', 'Fellowship Hall', true, 'third_saturday', false),
('Prayer Night', 'Join us for an evening of prayer and worship.', '2026-01-28', '19:00:00', '21:00:00', 'Chapel', true, 'last_wednesday', false),
('New Members Class', 'Learn about our church family and how to get connected.', '2026-02-08', '12:00:00', '14:00:00', 'Conference Room', false, null, false);