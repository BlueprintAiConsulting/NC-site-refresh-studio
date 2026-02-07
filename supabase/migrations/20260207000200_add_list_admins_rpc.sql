-- Fallback RPC to list admins when Edge Functions are unavailable.
CREATE OR REPLACE FUNCTION public.list_admins_with_emails()
RETURNS TABLE (
  id UUID,
  user_id UUID,
  email TEXT,
  created_at TIMESTAMPTZ
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  requester_id UUID := auth.uid();
BEGIN
  IF requester_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF NOT public.has_role(requester_id, 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  RETURN QUERY
  SELECT ur.id, ur.user_id, au.email::TEXT, ur.created_at
  FROM public.user_roles ur
  JOIN auth.users au ON au.id = ur.user_id
  WHERE ur.role = 'admin'
  ORDER BY ur.created_at DESC;
END;
$$;

REVOKE ALL ON FUNCTION public.list_admins_with_emails() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admins_with_emails() TO authenticated;
