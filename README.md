# NC Site Refresh Studio

A modern church website built with React, TypeScript, and Vite.

## Getting Started

### Prerequisites

- [Bun](https://bun.sh/) (recommended) or Node.js & npm

### Installation

```sh
# Clone the repository
git clone <YOUR_GIT_URL>

# Navigate to the project directory
cd NC-site-refresh-studio

# Install dependencies
bun install
# or: npm install

# Start the development server
bun run dev
# or: npm run dev
```

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build for production
- `bun run build:dev` - Build in development mode
- `bun run preview` - Preview production build
- `bun run lint` - Run ESLint
- `bun run test` - Run tests
- `bun run test:watch` - Run tests in watch mode

## Deployment

GitHub Pages deployments are triggered from the `main` branch via the workflow at
`.github/workflows/pages.yml`, with manual runs supported through `workflow_dispatch`.

## Tech Stack

- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React** - UI framework
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Supabase** - Optional backend services for content/features
- **Local admin auth** - Basic admin sign-in via environment variables

## Project Structure

- `/src/components` - React components
- `/src/pages` - Page components
- `/src/hooks` - Custom React hooks
- `/src/integrations` - Third-party integrations
- `/supabase` - Supabase configuration and migrations


## Admin Login Configuration

Basic admin access works without Supabase Auth.

You can either:

1. Configure a primary admin in `.env`:
```sh
VITE_ADMIN_EMAIL=admin@example.com
VITE_ADMIN_PASSWORD=change-me
```
2. Or, if no admin exists yet, open `/admin/login` and create the first admin account directly from the login form.

The admin session is stored in browser `localStorage` under `admin-auth-session`.


## Verifying the Admin Flow (No Supabase Auth)

1. Start the app (`npm run dev`).
2. Visit `/admin/login`.
3. Sign in with an existing admin account (or create the first one if prompted).
4. Confirm you are redirected to `/admin/dashboard`.
5. Click **Sign Out** and confirm you are returned to an unauthenticated state.

This verifies the admin auth flow itself works without Supabase Auth.


## Adding Admins (Full Local Replacement)

Admin provisioning is now local to the site and does not require Supabase:

1. Sign in using the env-configured primary admin (`VITE_ADMIN_EMAIL` / `VITE_ADMIN_PASSWORD`).
2. Open `/admin/management`.
3. Enter the new admin's email and password, then click **Add Admin**.
4. The account is stored in browser `localStorage` under `admin-auth-accounts`.
5. The primary env admin cannot be removed in the UI; edit `.env` to change that account.

> Note: Because accounts are local-storage based, this is single-browser/device admin management.
> For multi-device/shared production admin accounts, replace this with your own backend user system.
