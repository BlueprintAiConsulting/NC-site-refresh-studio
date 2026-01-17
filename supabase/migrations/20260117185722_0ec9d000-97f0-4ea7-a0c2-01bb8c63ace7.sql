-- Create rate limiting table for contact form submissions
CREATE TABLE public.contact_rate_limits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for efficient lookup
CREATE INDEX idx_contact_rate_limits_ip_time ON public.contact_rate_limits (ip_address, submitted_at DESC);

-- Enable RLS on the table
ALTER TABLE public.contact_rate_limits ENABLE ROW LEVEL SECURITY;

-- Create policy allowing edge functions to manage rate limits (using service role)
-- No user-facing policies needed as this is backend-only

-- Create function to clean up old rate limit entries (older than 1 hour)
CREATE OR REPLACE FUNCTION public.cleanup_old_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.contact_rate_limits 
  WHERE submitted_at < now() - INTERVAL '1 hour';
END;
$$;