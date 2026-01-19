-- Drop the overly permissive policy and create proper restrictive policies
-- Since the edge function uses service_role key (which bypasses RLS), 
-- we should deny all direct client access to this internal rate-limiting table

DROP POLICY IF EXISTS "Service role can manage rate limits" ON public.contact_rate_limits;

-- Deny all direct access from clients (anon/authenticated users)
-- The edge function uses service_role which bypasses RLS, so it will still work
-- No SELECT policy = no reads allowed
-- No INSERT policy = no inserts allowed
-- No UPDATE policy = no updates allowed  
-- No DELETE policy = no deletes allowed

-- This is the most secure approach - RLS is enabled with no permissive policies
-- The service_role used by edge functions bypasses RLS entirely