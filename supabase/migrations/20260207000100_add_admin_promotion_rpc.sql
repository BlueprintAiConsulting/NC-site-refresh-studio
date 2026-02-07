-- Fallback RPC for environments where Edge Functions are unavailable.
-- Promotes an existing authenticated user's account to admin by email.
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
