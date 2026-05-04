---
name: shadcn-component
description: Use this skill whenever a UI part needs a new shadcn/ui primitive (button, dialog, dropdown, etc.). Ensures the component is added via the official CLI (not copy-pasted), tracked in the manifest, and styled with the project's design tokens.
---

# shadcn/ui Component Skill

## Protocol
1. Identify the primitive needed from https://ui.shadcn.com/docs/components.
2. Run `npx shadcn@latest add <component> --yes` in the workspace root.
3. Do **not** edit files in `components/ui/` afterwards — wrap them in `components/quadrant/` if customization is needed.
4. If a Radix primitive is required indirectly, let shadcn pull it; never `pnpm add @radix-ui/...` manually.
5. Confirm the component is keyboard-accessible (run an `axe` check via Playwright).

## Naming
Wrappers go in `components/quadrant/<feature>/<ComponentName>.tsx` and re-export the shadcn primitive's behavior, never re-implement it.
