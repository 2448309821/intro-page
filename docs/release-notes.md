# Portfolio Release - 2026-09-30

## Current Behavior
- Japanese self-introduction with separate school research and personal tool/system development.
- Individual pages describe motivation, care, results and learning.
- Games and anime remain independent interests, not professional claims.
- Actual VisionAuto2, lab-system and Japanese-classroom screenshots are included. Lab and classroom captures use fictional QA data.
- Character-bearing screenshots remain at the site owner's explicit direction. Public captions now distinguish that display decision from unverified third-party artwork sources and rightsholder permissions; no original artwork or runtime bundle is offered.

## Implementation
- Static HTML, CSS and JavaScript with local Lucide icons; no application backend or account connection.
- Public output is exported from the local preview using a file allowlist and structured HTML processing.
- CSS and application JavaScript use content-hashed filenames to avoid mixing a cached old stylesheet with new HTML after deployment.
- The page uses blue, warm and mint section bands, a desktop quick-navigation rail, link-copy feedback and a back-to-top control so the self-introduction is easier to scan.
- A reserved desktop gutter prevents the rail from covering content in narrow PC windows. Every detail screenshot opens its own caption and image, with fit/original-size switching and a keyboard-scrollable viewport.
- The original local preview remains separate from this public release.

## Verification
- Current local regression: ten tests passed after two new cases first failed as expected; fifty browser page checks at 360/768/1120/1280/1440px passed with no overflow, eager image failures, missing expansion controls or rail overlap.
- Original-size viewing was confirmed at 360px with a 1425px image, viewport scrolling, correct second-image captions and focus restoration. Lab second-image keyboard opening, fit reset and Escape closing passed.
- Public package validation and live deployment verification are recorded for each release before handoff.

## Remaining Work
- Cafeteria project has no preserved screenshot and is described in text.
- Exact character artwork sources and permissions remain unverified, including for the currently displayed screenshots. Detailed joint research materials and application distribution remain out of scope.
