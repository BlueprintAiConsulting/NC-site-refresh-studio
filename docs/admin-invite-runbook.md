# Admin Invite / Add Admin Runbook

Use this when **Add Admin** fails (for example: `Failed to fetch`, `Edge Function` error), or invite emails are not received.

## Scope
- Admin creation from the Admin Management page
- Invite-email flow and fallback behavior

## How the flow works
1. Frontend calls Supabase Edge Function: `add-admin`.
2. If password is provided, the function creates/updates the user with password.
3. If password is blank and invite is enabled, the function sends invite via Supabase Auth (`inviteUserByEmail`).
4. If Edge Function transport fails and password is blank, frontend falls back to RPC `promote_existing_user_to_admin`.

## Quick triage

### 1) Reproduce with both modes
- **Invite mode**: Email set, password blank, “Send invite email” checked.
- **Password mode**: Email set, password filled.

Record exact error toast text and timestamp.

### 2) If you see transport errors (`Failed to fetch`, `Edge Function` unavailable)
- Confirm `add-admin` Edge Function is deployed in the target Supabase project.
- Confirm frontend environment variables point to the same Supabase project.
- Retry.

> Note: password-based creation cannot use fallback when Edge Functions are unavailable.

### 3) Ensure fallback RPC exists
Run in Supabase SQL Editor:

```sql
select proname
from pg_proc
join pg_namespace n on n.oid = pg_proc.pronamespace
where n.nspname = 'public'
  and proname = 'promote_existing_user_to_admin';
```

If not found, run migrations (or execute migration SQL for:
`supabase/migrations/20260207000100_add_admin_promotion_rpc.sql`).

### 4) Invite delivery troubleshooting
If admin creation succeeds but no email arrives:
- Check Supabase Auth email/SMTP configuration.
- Check Supabase Auth logs/email logs.
- Ask recipient to check spam/quarantine.
- Retry invite after verifying sender configuration.

## Operational checklist
- [ ] `add-admin` deployed
- [ ] `list-admins` deployed
- [ ] fallback RPC exists (`promote_existing_user_to_admin`)
- [ ] Invite mode tested successfully
- [ ] Password mode tested successfully
- [ ] Recipient confirms invite received

## Escalation notes template
Capture and share:
- Timestamp (with timezone)
- Admin email tested
- Mode used (invite/password)
- Exact UI error message
- Supabase project ref
- Whether Edge Function logs show request
- Whether Auth logs show email send/bounce
