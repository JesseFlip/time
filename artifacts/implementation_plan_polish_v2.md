# Implementation Plan - Polish and Sync V2

## User Review Required

> [!NOTE]
> I will be using HTML `<a>` tags in the `README.md` to ensure links open in new tabs, as standard Markdown doesn't support this natively on GitHub.

## Proposed Changes

### Assets

#### [NEW] [quadrant_snippet.png](file:///c:/Users/Studnet_F/OneDrive/Organized/01-Active-Projects/Projects/time/public/screenshots/quadrant_snippet.png)
- Move from root to `public/screenshots/`.

### Documentation

#### [MODIFY] [README.md](file:///c:/Users/Studnet_F/OneDrive/Organized/01-Active-Projects/Projects/time/README.md)
- Replace standard Markdown links with `<a href="..." target="_blank">` tags.
- Update the Preview section to include `quadrant_snippet.png`.

### UI Components

#### [MODIFY] [Header.tsx](file:///c:/Users/Studnet_F/OneDrive/Organized/01-Active-Projects/Projects/time/components/quadrant/Header.tsx)
- Update the GitHub link to use a `Github` icon if available, or make it more prominent.
- Ensure `target="_blank"` is set (it already is, but will double-check).

## Verification Plan

### Automated Tests
- `pnpm build` to ensure no breakages.

### Manual Verification
- Verify the header link on the local dev server.
- Verify the image displays correctly in the `README.md`.
