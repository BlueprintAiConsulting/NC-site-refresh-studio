# NC Site Refresh Studio - AI Coding Guidelines

## Project Overview
Modern church website built as a single-page application with section-based navigation. Uses React/TypeScript with Vite, shadcn/ui components. Supabase is optional for future features (forms, auth).

## Local Development Setup

1. **Install dependencies**:
   ```bash
   bun install   # or: npm install
   ```

2. **Environment variables** (optional):
   ```bash
   cp .env.example .env
   ```
   - Get keys from Supabase Dashboard → Project Settings → API
   - Use **anon key only** (never service_role key in frontend)
   - Site runs without Supabase - it's for future form submissions/auth

3. **Start dev server**:
   ```bash
   bun run dev   # or: npm run dev
   # Runs on http://[::]:8080
   ```

## Content Management

**File-based approach** for simplicity and cost control:
- [src/content/site-config.json](../src/content/site-config.json): Service times, contact info, emergency alerts
- [src/content/events.json](../src/content/events.json): Events listing
- [src/content/ministries.json](../src/content/ministries.json): Ministry programs

**Update workflow**: Edit JSON → commit → PR → merge → auto-deploy

Supabase is reserved for Phase 2 (form submissions database, admin panel, user roles).

## Architecture Patterns

### Component Structure
- **Pages** ([src/pages/](../src/pages/)): Top-level route components
- **Section Components** ([src/components/sections/](../src/components/sections/)): Presentational components for page sections
  - Use **PascalCase noun-based names**: `HeroSection`, `ContactSection`, `MinistriesSection`
  - Keep presentational - import data from `src/content/*` JSON files
  - One component per file
- **UI Components** ([src/components/ui/](../src/components/ui/)): Auto-generated shadcn/ui primitives - **do not manually edit**
- **Animations** ([src/components/animations/FadeIn.tsx](../src/components/animations/FadeIn.tsx)): Reusable framer-motion wrappers

### Routing & Navigation
- Router defined in [App.tsx](../src/App.tsx) with catch-all `*` route for 404s
- **Critical**: Add new routes BEFORE the `*` catch-all route in App.tsx
- Section navigation uses anchor links (`#contact`, `#about`) within single-page Index

### Styling System
- **Utility Classes**: Use Tailwind utilities for most styling
- **Custom Utilities** ([index.css](../src/index.css) L130-160):
  - `.section-church`: Section spacing (`py-20 md:py-28`)
  - `.card-church`: Card styling with consistent borders/padding
  - `.btn-primary` / `.btn-secondary`: Button variants
  - `.link-nav`: Navigation link hover states
- **Theme**: HSL color variables via CSS custom properties (primary, secondary, muted, etc.)
- **cn() Helper** ([lib/utils.ts](../src/lib/utils.ts)): Merge Tailwind classes with `cn()`

### Animation Conventions
- Import `FadeIn`, `StaggerContainer`, `StaggerItem` from [animations/FadeIn.tsx](../src/components/animations/FadeIn.tsx)
- Props: `delay` (stagger timing), `direction` (up/down/left/right), `duration`
- Use `whileInView` with `viewport={{ once: true }}` for scroll-triggered animations
- Stagger delays: increment by 0.1-0.15s for list items

## Development Workflows

### Build Commands (Bun preferred)
```bash
bun run dev          # Dev server on http://[::]:8080
bun run build        # Production build
bun run build:dev    # Development mode build
bun run preview      # Preview production build
bun run lint         # ESLint
bun run test         # Run tests once
bun run test:watch   # Test watch mode
```

### Deployment
**GitHub-based workflow**: PR → merge to `main` → build → deploy

**Build settings**:
- Node version: Latest LTS (or match `package.json` engines if specified)
- Build command: `npm run build`
- Output directory: `dist/`

We will standardize on **GitHub Actions** for consistent deploys, using build output `dist/`.

### Component Development
1. Place section components in [src/components/sections/](../src/components/sections/)
2. Use **PascalCase noun-based names**: `ContactSection`, `EventsSection`
3. Export as named function component
4. Use semantic HTML5 tags (`<section>`, `<article>`, etc.)
5. Add `id` attribute for anchor navigation
6. Wrap content in animation components for scroll effects
7. Import content from [src/content/](../src/content/) JSON files

### Adding shadcn/ui Components
- Use [components.json](../components.json) for shadcn config
- Components auto-generated in [src/components/ui/](../src/components/ui/)
- Import with `@/components/ui/[component-name]`

### Path Aliases
- `@/` resolves to `src/` ([vite.config.ts](../vite.config.ts) L15)
- Use absolute imports: `import { Hero } from "@/components/Hero"`

### Supabase Integration (Optional - Phase 2)
- Client: Import `supabase` from [@/integrations/supabase/client](../src/integrations/supabase/client.ts)
- Types: Auto-generated in [types.ts](../src/integrations/supabase/types.ts) - **do not manually edit**
- Edge Functions: Deno-based functions in [supabase/functions/](../supabase/functions/)
- Example: [send-contact-email](../supabase/functions/send-contact-email/index.ts) shows rate limiting and XSS prevention
- Use for form submissions, auth, admin panel - not for content management

## Code Conventions

### TypeScript
- Use explicit return types for complex functions
- Prefer `interface` over `type` for component props
- Use `type` for unions, utilities, and mapped types

### React Patterns
- Functional components with named exports
- Use TanStack Query (`@tanstack/react-query`) for data fetching
- Form handling with `react-hook-form` + `zod` validation
- Toast notifications via `sonner` (imported as `Sonner` in App.tsx)

### Accessibility
- Include skip links for keyboard navigation (see [Index.tsx](../src/pages/Index.tsx) L21)
- Use semantic HTML and ARIA attributes where needed
- Ensure color contrast meets WCAG standards
- Test keyboard navigation and screen readers

## Key Files
- [App.tsx](../src/App.tsx): App shell with providers and routing
- [index.css](../src/index.css): Custom utilities and base styles
- [vite.config.ts](../vite.config.ts): Vite config with path aliases
- [vitest.config.ts](../vitest.config.ts): Test configuration with jsdom
- [package.json](../package.json): Scripts and dependencies

## Testing
- Framework: Vitest with jsdom environment
- Setup: [vitest.config.ts](../vitest.config.ts) configures globals and setup files
- Test location: `src/**/*.{test,spec}.{ts,tsx}`
- Run with `bun run test` or `bun run test:watch`
