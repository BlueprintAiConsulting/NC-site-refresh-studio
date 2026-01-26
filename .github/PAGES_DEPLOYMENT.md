# GitHub Pages Deployment

This branch contains the GitHub Actions workflow for deploying the site to GitHub Pages.

## Changes
- Added `.github/workflows/pages.yml` - GitHub Actions workflow that builds and deploys to Pages
- Fixed `src/App.tsx` - Closed JSX comment to fix build error

## Workflow Details
The workflow:
- Triggers on push to main branch
- Builds the Vite app using Node.js 18
- Uploads the `dist` directory as a Pages artifact
- Deploys to GitHub Pages automatically
