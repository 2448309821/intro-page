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
- Build: 11 pages. Tests: 46/46 passed. Public-package verification passed: 35 allowlisted files, with restricted images excluded.
- Sitewide language audit covers all page copy, metadata, accessible labels and runtime messages. All 13 catalog screenshots were visually inspected, including two local-only captures; no remaining generic Chinese UI text was identified.
- Public candidate: all 45 screenshot expansion entries passed full-image and original-size checks. Five local-only entries were checked separately. All 11 pages passed horizontal-overflow checks at 390px; desktop project pages and home slideshow were checked at 1440px.
- Natural Japanese revisions include project explanations, OCR confidence terminology, questionnaire scope and export descriptions. Three independent wording reviewers and mechanical lint/outline/term checks were used; repetitive navigation and accurate research qualifications were retained intentionally.
- SBOM evaluation now distinguishes the verified populations: 703 projects for Syft/Trivy/cdxgen, and the 276 successful-generation subset for pip-sbom. The obsolete collected count is no longer presented as the final evaluation population.
- The portfolio homepage screenshot was recaptured after confirming the active VisionAuto2 image had loaded. Its actual dimensions are 1425x970.
- Local and public-candidate browser checks at desktop 1440px and mobile 390px: translated images loaded, no horizontal overflow, gallery/viewer/zoom/close worked.
- Actual GitHub Pages deployment is checked separately after push; a local test is not evidence that the public deployment has completed.

## Boundaries
- Image translation is presentation editing, not application localization or evidence of performance.
- Source apps, private data, voice/model files and unapproved internship materials are not included.

## Pagewise Japanese Style Review - 2026-10-12
- Reviewed the homepage and all ten project pages using the local natural-japanese full workflow: lint, outline, terminology, three independent read-only reviewers and a final prose pass. The third-party HumanizerAI API was not called.
- Replaced long contribution noun lists with actual actions, removed duplicated functional explanations and generic learning conclusions, and retained detailed capabilities, personal interests, research facts and contribution boundaries.
- The homepage was left unchanged after review. Screenshots, runtime JavaScript and CSS were unchanged; this pass does not claim a second exhaustive screenshot-pixel audit.
- Public internship pages no longer repeat the same image-withholding message in five chapters. The publication reason remains in the scope section, and restricted screenshots are still excluded.
- Fresh verification: build generated 11 pages, 47/47 tests passed and the 35-file public package passed link/media/privacy checks. All eleven public-candidate pages were checked at desktop 1440px and mobile 390px with no horizontal overflow or empty feature paragraphs.
- Additional interaction checks covered a Japanese full-image viewer with original-size switching, shortened feature sections, SBOM result navigation and separate local-only internship media.

## Personal Homepage Voice - 2026-10-12
- Rewrote the homepage introduction in a lighter first-person voice, keeping research, useful AI-assisted tools for self and others, and games/anime. Concrete scheduling and screen-operation examples replace the generic career closing.
- CharaTab no longer repeats the requested ownership/AI-use paragraphs or their index link. Its five illustrated features and consolidated character-material note remain. Specific contributions on other project pages are unchanged.
- Fresh build: 11 pages. Tests: 49/49 passed. Public verification passed for 35 allowlisted files, excluding restricted internship images.
- Reviewed the short introduction with the local natural-japanese quick workflow and a final reading pass. Browser checks covered the changed homepage and CharaTab at 1440px and 390px, hobby expansion, mobile navigation and full-image/original-size viewing.
- Screenshots, CSS and JavaScript are unchanged. This revision does not claim a new exhaustive image-translation review.
