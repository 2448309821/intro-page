# Portfolio Release - 2026-09-30

## Current Behavior
- Japanese self-introduction with separate school research and personal tool/system development.
- Individual pages describe motivation, care, results and learning.
- Games and anime remain independent interests, not professional claims.
- Actual VisionAuto2, lab-system and Japanese-classroom screenshots are included. Lab and classroom captures use fictional QA data.
- Character-bearing screenshots are included because the author explicitly approved publication; each page states attribution and that the image itself is not redistributed. This note does not replace a formal third-party license.

## Implementation
- Static HTML, CSS and JavaScript with local Lucide icons; no application backend or account connection.
- Public output is exported from the local preview using a file allowlist and structured HTML processing.
- CSS and application JavaScript use content-hashed filenames to avoid mixing a cached old stylesheet with new HTML after deployment.
- The page uses blue, warm and mint section bands, a desktop quick-navigation rail, link-copy feedback and a back-to-top control so the self-introduction is easier to scan.
- The original local preview remains separate from this public release.

## Verification
- Public package: ten pages, resolved local links and assets, no local paths or restricted screenshot files.
- Existing local version: nine content tests and thirty responsive checks passed.
- Public version: twenty browser checks across desktop and mobile passed, with no horizontal overflow, broken detail images or console errors.

## Remaining Work
- Cafeteria project has no preserved screenshot and is described in text.
- Character artwork still needs the stated attribution and rights review before reuse outside this portfolio; detailed joint research materials and application distribution remain out of scope.
