-- Create emergency alerts table
CREATE TABLE public.emergency_alerts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  message TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  alert_type TEXT NOT NULL DEFAULT 'warning' CHECK (alert_type IN ('info', 'warning', 'urgent')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE public.emergency_alerts ENABLE ROW LEVEL SECURITY;

-- Public can read active alerts
CREATE POLICY "Anyone can view active alerts" 
ON public.emergency_alerts 
FOR SELECT 
USING (is_active = true);

-- Admins can manage alerts (using has_role function that already exists)
CREATE POLICY "Admins can insert alerts" 
ON public.emergency_alerts 
FOR INSERT 
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update alerts" 
ON public.emergency_alerts 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete alerts" 
ON public.emergency_alerts 
FOR DELETE 
USING (public.has_role(auth.uid(), 'admin'));

-- Trigger for updated_at
CREATE TRIGGER update_emergency_alerts_updated_at
BEFORE UPDATE ON public.emergency_alerts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();