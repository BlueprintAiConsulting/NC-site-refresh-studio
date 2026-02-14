#!/usr/bin/env bash
set -euo pipefail

mkdir -p .codex

generated_at=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

cat > .codex/HANDOFF_CONTEXT.txt <<EOF
PROJECT HANDOFF CONTEXT (NC-site-refresh-studio)
Generated: ${generated_at}

HIGH-PRIORITY WORKING STYLE
- User wants easiest flow: one-click/two-click, browser-first, copy-paste friendly.
- Prefer GitHub-web-editor patch format when remote integration is unstable.
- Keep explanations plain and short; avoid tool jargon unless needed.
- Confirm what was changed with exact files and quick verification commands.

GIT/PR PIPELINE CONTEXT
- Prior sessions had cases where commits were created locally but not visible in GitHub PR flow.
- If PR flow fails, FIRST check:
  1) git remote -v
  2) git branch -vv
  3) .git/config has [remote "origin"]
- If no remote: explain clearly, then provide browser-only patch path.

NON-LOCAL (BROWSER-ONLY) PR WORKFLOW
- Assume user may not run local git commands.
- Provide a GitHub web-editor patch path when remote is missing or push fails:
  1) Open the target file in GitHub web UI
  2) Click the pencil icon (Edit this file)
  3) Paste exact patch content
  4) Commit directly to branch (or create a branch)
  5) Open PR with copy-paste title/body
- Always include PR title/body text and post-merge verification checklist.

IMPORTANT TECHNICAL CONTEXT
- App is React + Vite SPA with React Router.
- GitHub Pages deploy behavior depends on current base-path setup and main-branch workflow.
- A Firebase-prep change was intended to be non-breaking for GitHub Pages:
  - Dynamic Router basename from import.meta.env.BASE_URL
  - Added build script for Firebase root deployment
  - Added firebase hosting config files
- Known env-key mismatch concern historically discussed:
  - VITE_SUPABASE_PUBLISHABLE_KEY vs VITE_SUPABASE_ANON_KEY
  - If runtime content/images fail, verify env names in build/deploy context.

USER PREFERENCES / DECISIONS
- Strong frustration with “local-only” behavior for client-facing admin workflows.
- Wants predictable mergeable PR behavior.
- Wants practical, direct steps over long architectural debate.
- Do not ask user to run local git commands when avoidable.

DEFAULT DEBUG CHECKLIST (run before proposing fixes)
1) git status --short
2) git log --oneline -n 5
3) git remote -v
4) git branch -vv
5) npm run -s build
6) If deploy issue: confirm target branch/workflow trigger + env vars

DELIVERY FORMAT PREFERENCE
- Provide:
  1) exact files to edit
  2) copy-paste code blocks
  3) PR title/body text
  4) quick post-merge verification list
EOF

cat > .codex/NEW_SESSION_PROMPT.txt <<'EOF'
Use this repository handoff context: .codex/HANDOFF_CONTEXT.txt

Rules for this session:
1) Start by running:
   - git remote -v
   - git branch -vv
   - git status --short
2) If remote is missing, do NOT pretend push/PR is possible; switch to GitHub web-editor patch workflow.
3) If user is non-local, do not require them to run git commands; provide browser-only steps.
4) For every code change, provide exact files changed + verification commands.
5) Always include copy-paste PR title/body text.
6) Prefer lowest-friction path that gets a mergeable PR.
EOF

echo "Created:"
echo "  - .codex/HANDOFF_CONTEXT.txt"
echo "  - .codex/NEW_SESSION_PROMPT.txt"
echo "  - SESSION_HANDOFF_SETUP.sh"
echo
echo "Next step in fresh session:"
echo "1) cat .codex/HANDOFF_CONTEXT.txt"
echo "2) Paste contents of .codex/NEW_SESSION_PROMPT.txt into the first message"
