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

## Tech Stack

- **Vite** - Build tool and dev server
- **TypeScript** - Type safety
- **React** - UI framework
- **shadcn/ui** - Component library
- **Tailwind CSS** - Styling
- **Supabase** - Backend services

## Project Structure

- `/src/components` - React components
- `/src/pages` - Page components
- `/src/hooks` - Custom React hooks
- `/src/integrations` - Third-party integrations
- `/supabase` - Supabase configuration and migrations
