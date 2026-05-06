# Plan - Polish and Sync V2

The goal is to incorporate the new screenshot, update the README links for better UX, and add a clear GitHub link to the application.

## Goals
- Add `quadrant_snippet.png` to the repository and README.
- Update all external links in `README.md` to open in new tabs.
- Add a prominent GitHub link to the site header.
- Ensure all changes are pushed and live.

## Affected Files
- `README.md`: Update image and links.
- `components/quadrant/Header.tsx`: Add GitHub link.
- `public/screenshots/`: Add new screenshot.

## Risks
- Incorrect HTML syntax in `README.md` might break rendering on some platforms.
- `Github` icon might not be imported correctly if the name is different in the installed version of `lucide-react`.

## Test Strategy
- Manual verification of the site locally.
- Check `README.md` rendering on a local preview if possible.
- Push and verify on the live site.
