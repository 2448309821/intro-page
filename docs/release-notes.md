# Portfolio Release - 2026-09-30

## Current Behavior
- Japanese self-introduction with separate school research and personal tool/system development.
- Individual pages describe motivation, care, results and learning.
- Games and anime remain independent interests, not professional claims.
- Actual VisionAuto2 and lab-system screenshots are included. Lab data is fictional QA data.
- Third-party character screenshots, local QA files, runtime data and private application source are excluded.

## Implementation
- Static HTML, CSS and JavaScript with local Lucide icons; no application backend or account connection.
- Public output is exported from the local preview using a file allowlist and structured HTML processing.
- CSS and application JavaScript use content-hashed filenames to avoid mixing a cached old stylesheet with new HTML after deployment.
- The original local preview remains separate from this public release.

## Verification
- Public package: ten pages, resolved local links and assets, no local paths or restricted screenshot files.
- Existing local version: nine content tests and thirty responsive checks passed.
- Public version: twenty browser checks across desktop and mobile passed, with no horizontal overflow, broken detail images or console errors.

## Remaining Work
- Classroom project screenshot is not yet included.
- Cafeteria project has no preserved screenshot and is described in text.
- Character artwork, detailed joint research materials and application distribution require separate review.
