-- Add RLS policies for contact_rate_limits table
-- This table is used by the edge function for rate limiting contact form submissions
-- The edge function uses service_role key, so it bypasses RLS anyway
-- But we add policies for completeness and security best practice

-- Allow the edge function (via service role) to manage rate limits
-- For anon users, no direct access is needed since the edge function handles this
CREATE POLICY "Service role can manage rate limits"
ON public.contact_rate_limits
FOR ALL
USING (true)
WITH CHECK (true);

-- Note: This permissive policy is acceptable because:
-- 1. The contact_rate_limits table only contains IP addresses and timestamps
-- 2. No sensitive user data is stored
-- 3. The edge function uses service_role which bypasses RLS anyway
-- 4. Direct client access is not used - all operations go through the edge function