# Plan - Add Feedback Link

The goal is to provide a direct way for users to suggest feedback or report issues by linking to the GitHub Issues page.

## Goals
- Add a "Feedback" link to the application header.
- Ensure the link opens in a new tab.
- Maintain a clean and professional UI.

## Affected Files
- `components/quadrant/Header.tsx`: Add the new link.

## Risks
- Header clutter on smaller screens.

## Test Strategy
- Manual verification on local dev server.
- Verify the link correctly redirects to the GitHub Issues page.
