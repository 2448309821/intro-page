# Portfolio Release - 2026-10-12

## Current Behavior
- Japanese self-introduction with separate research, personal development, and game/anime interests.
- CharaTab, CharaDesk and both VisionAuto2 screenshots have Japanese UI labels edited into the images. These are introduction images, not claims that the applications themselves have Japanese localization.
- Layout proportions, displayed coordinates, timings, dates, colors and disconnected states were checked against the original captures.
- Homepage slides and project thumbnails also use Japanese-labelled versions; the portfolio's own homepage capture was refreshed.
- LabSchedule and classroom images remain actual Japanese-language test-environment captures with fictional data.
- Character images are user-confirmed AI-generated unofficial fan creations. A consolidated material note remains on each character project page; original artwork files and application bundles are not distributed.
- Interactive demos remain removed. Internship screenshots and diagrams with unresolved publication scope remain excluded.

## Implementation
- Static HTML/CSS/JavaScript; no app backend, account connection or runtime data is published.
- Public package uses a file allowlist and content-hashed CSS/JavaScript. Old Chinese screenshots, their thumbnails and obsolete hashed assets were removed from the release tree.
- Full translated images support chapter crops, gallery selection, fit/original-size viewing and keyboard dismissal. Small WebP thumbnails are used on the homepage.

## Verification
- Build: 11 pages. Tests: 43/43 passed. Public-package verification passed with restricted images excluded.
- Local and public-candidate browser checks at desktop 1440px and mobile 390px: translated images loaded, no horizontal overflow, gallery/viewer/zoom/close worked.
- Actual GitHub Pages deployment is checked separately after push; a local test is not evidence that the public deployment has completed.

## Boundaries
- Image translation is presentation editing, not application localization or evidence of performance.
- Source apps, private data, voice/model files and unapproved internship materials are not included.
