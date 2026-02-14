# Lovable-Only Migration Audit

This audit summarizes what is already Lovable-friendly, what still depends on Supabase, and the concrete path to complete a GitHub-based transfer to a Lovable-only stack.

## Current status

### Already Lovable-friendly
- Admin login/auth now runs in-site (no Supabase auth dependency).
- Admin management uses local account management in-site.
- `.env.example` includes local admin bootstrap credentials.

### Still Supabase-dependent (outside admin auth)
The following areas still call Supabase directly and must be replaced if you want a full Lovable-only site:

- Public content and interactions:
  - `src/components/EmergencyAlert.tsx`
  - `src/components/Events.tsx`
  - `src/components/HeroImageUploader.tsx`
  - `src/components/PlanVisit.tsx`
  - `src/pages/NewslettersPage.tsx`
- Admin data/content modules:
  - `src/pages/admin/AdminDashboard.tsx`
  - `src/pages/admin/AdminEvents.tsx`
  - `src/pages/admin/AdminNewsletters.tsx`
  - `src/pages/admin/AdminPhotos.tsx`
- Shared storage/data hooks:
  - `src/hooks/useGalleryImages.ts`
  - `src/lib/storage.ts`
- Supabase integration layer:
  - `src/integrations/supabase/client.ts`
  - `src/integrations/supabase/types.ts`
- Backend function/migration folder:
  - `supabase/functions/*`
  - `supabase/migrations/*`

## Recommended migration plan (Lovable-only)

### Phase 1 — Freeze admin/auth to in-site only (done in this repo)
- Keep local admin auth/session flow and local admin management.
- Do not require Supabase env vars for admin routes.

### Phase 2 — Replace Supabase data dependencies
For each feature below, choose one Lovable-compatible replacement:
- Events
- Newsletters
- Gallery/Photos
- Emergency alerts
- Contact form submission

For each feature:
1. Define data source in Lovable (CMS/content collections or Lovable-connected backend).
2. Replace Supabase query/mutation calls in the matching React module.
3. Remove related Supabase storage usage from `src/lib/storage.ts` and direct `supabase.storage` calls.

### Phase 3 — Remove Supabase integration from app code
- Delete all `@/integrations/supabase/*` imports from `src`.
- Remove unused Supabase dependencies from `package.json`.
- Archive or remove `supabase/` folder if no longer needed.

### Phase 4 — GitHub transfer workflow
1. Push this branch to GitHub.
2. In Lovable, import/sync from the same GitHub repository.
3. Map Lovable content/auth settings to the replacement data model from Phase 2.
4. Verify preview build and production build in Lovable.
5. Remove remaining Supabase env vars/secrets from deployment target.

## Verification checklist for full Lovable-only completion
- [ ] `rg -n "supabase|@/integrations/supabase" src` returns no app-runtime usage.
- [ ] Admin login works without Supabase env vars.
- [ ] Admin content CRUD works using Lovable-only data source.
- [ ] Public pages load data without Supabase.
- [ ] Build and tests pass.

## Command used for this audit

```bash
rg -n "supabase|@/integrations/supabase" src supabase docs README.md .env.example
```
