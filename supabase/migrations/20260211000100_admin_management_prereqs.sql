-- Consolidated DB-side prerequisites for admin management fallback workflows.
-- NOTE: Edge Function deployment, function secrets, and SMTP configuration cannot be handled via SQL migrations.

-- 1) Ensure fallback RPC exists for edge-function outage scenarios.
CREATE OR REPLACE FUNCTION public.promote_existing_user_to_admin(target_email TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
  requester_id UUID := auth.uid();
  normalized_email TEXT;
  target_user_id UUID;
BEGIN
  IF requester_id IS NULL THEN
    RAISE EXCEPTION 'Unauthorized';
  END IF;

  IF NOT public.has_role(requester_id, 'admin') THEN
    RAISE EXCEPTION 'Forbidden';
  END IF;

  normalized_email := lower(trim(target_email));
  IF normalized_email IS NULL OR normalized_email = '' THEN
    RAISE EXCEPTION 'Email is required';
  END IF;

  SELECT id
  INTO target_user_id
  FROM auth.users
  WHERE lower(email) = normalized_email
  LIMIT 1;

  IF target_user_id IS NULL THEN
    RAISE EXCEPTION 'No account found for this email. Ask them to sign up first, then add them as admin.';
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (target_user_id, 'admin')
  ON CONFLICT (user_id, role) DO NOTHING;

  IF FOUND THEN
    RETURN normalized_email || ' is now an admin.';
  END IF;

  RETURN normalized_email || ' is already an admin.';
END;
$$;

REVOKE ALL ON FUNCTION public.promote_existing_user_to_admin(TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.promote_existing_user_to_admin(TEXT) TO authenticated;

-- 2) Ensure RPC for listing admins with emails exists (fallback if list-admins edge function is unreachable).
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
  ORDER BY ur.created_at ASC;
END;
$$;

REVOKE ALL ON FUNCTION public.list_admins_with_emails() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.list_admins_with_emails() TO authenticated;

-- 3) Add a diagnostic RPC to confirm SQL-side prerequisites are in place.
CREATE OR REPLACE FUNCTION public.admin_management_diagnostics()
RETURNS TABLE (
  check_name TEXT,
  ok BOOLEAN,
  details TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
  RETURN QUERY
  SELECT
    'user_roles_table_exists'::TEXT,
    EXISTS (
      SELECT 1
      FROM information_schema.tables t
      WHERE t.table_schema = 'public'
        AND t.table_name = 'user_roles'
    ),
    'Required for admin role assignments.'::TEXT;

  RETURN QUERY
  SELECT
    'promote_existing_user_to_admin_exists'::TEXT,
    EXISTS (
      SELECT 1
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public'
        AND p.proname = 'promote_existing_user_to_admin'
    ),
    'Fallback RPC used when add-admin edge function is unreachable and password is blank.'::TEXT;

  RETURN QUERY
  SELECT
    'list_admins_with_emails_exists'::TEXT,
    EXISTS (
      SELECT 1
      FROM pg_proc p
      JOIN pg_namespace n ON n.oid = p.pronamespace
      WHERE n.nspname = 'public'
        AND p.proname = 'list_admins_with_emails'
    ),
    'Fallback RPC used when list-admins edge function is unreachable.'::TEXT;

  RETURN QUERY
  SELECT
    'requester_is_admin'::TEXT,
    CASE
      WHEN auth.uid() IS NULL THEN FALSE
      ELSE public.has_role(auth.uid(), 'admin')
    END,
    'Current caller must be an admin to use admin-management RPCs.'::TEXT;

  RETURN QUERY
  SELECT
    'edge_function_and_smtp_note'::TEXT,
    FALSE,
    'Edge Function deployment/secrets and SMTP setup are outside SQL migrations and must be configured in Supabase dashboard/CLI.'::TEXT;
END;
$$;

REVOKE ALL ON FUNCTION public.admin_management_diagnostics() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.admin_management_diagnostics() TO authenticated;
