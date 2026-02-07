# Task Proposals from Codebase Review

## 1) Typo fix task
**Issue observed:** The emergency banner copy uses "voice mail"; project copy elsewhere uses modern concise wording, so this should be standardized to "voicemail".

**Proposed task:**
- Update the sentence in `src/components/sections/EmergencyCancellationsSection.tsx` to use "voicemail".
- Keep meaning and contact details unchanged.

**Acceptance criteria:**
- The component text renders "voicemail greeting" (single word).
- No other wording changes beyond typo/copy cleanup.

---

## 2) Bug fix task
**Issue observed:** The fallback hero image path in `site-config.json` is `/public/hero-default.jpg`, but there is no corresponding `public/hero-default.jpg` file. In Vite, public assets should be referenced as `/...` without the `/public` prefix.

**Proposed task:**
- Fix `src/content/site-config.json` fallback hero URL to a valid public path.
- Add/confirm an actual default hero asset at that path.
- Verify hero sections render an image when Supabase has no hero image configured.

**Acceptance criteria:**
- Fallback hero image loads in pages that use `siteConfig.heroImage.url`.
- No 404 network request for the fallback hero URL.

---

## 3) Code comment/documentation discrepancy task
**Issue observed:** `public/newsletters/README.md` instructs maintainers to edit `/src/components/Newsletter.tsx` directly, but the component now reads from `src/content/newsletters.json`.

**Proposed task:**
- Update `public/newsletters/README.md` to point to `src/content/newsletters.json` as the source of newsletter entries.
- Adjust example snippets to match the current JSON shape (`title`, `month`, `year`, `pdfUrl`, etc.).

**Acceptance criteria:**
- README instructions match the current implementation.
- A new maintainer can add a newsletter using README steps without inspecting component code.

---

## 4) Test improvement task
**Issue observed:** `AdminManagement.test.tsx` currently covers one happy path (adding a new admin) but does not cover failure or duplicate/admin-already-exists behaviors.

**Proposed task:**
- Add tests for:
  - `add-admin` function invocation failure (toast/error handling).
  - duplicate/admin-already-present responses from backend.
  - disabled/loading states during async submit.
- Assert user-visible outcomes, not just mocked function calls.

**Acceptance criteria:**
- Test suite includes at least one negative-path test.
- Tests verify UI feedback (error or success messaging) and button state transitions.
- Existing happy-path test remains passing.
