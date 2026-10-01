# Portfolio Release - 2026-10-01

## Current Behavior
- Japanese self-introduction with separate university/graduate research and personal tool/system development.
- The first screen lists research focus, the 2026 IEICE General Conference talk and AI-assisted tool development, with direct links to projects, research and contact.
- Individual pages describe motivation, care, results and learning. Audit-style provenance notes were removed from public copy; fictional test data and unverified third-party artwork remain stated plainly.
- Games and anime remain independent interests, not professional claims.
- Actual VisionAuto2, lab-system and Japanese-classroom screenshots are included. Lab and classroom captures use fictional test data.
- Character-bearing screenshots remain at the site owner's explicit direction. Captions state that the artwork is not the owner's original work and that its source and permission are unverified; the homepage note appears only on slides that contain such artwork. No original artwork or runtime bundle is offered.

## Implementation
- Static HTML, CSS and JavaScript with local Lucide icons and Noto Sans JP from Google Fonts; no application backend or account connection.
- Public output is exported from the local preview using a file allowlist and structured HTML processing. CSS and application JavaScript use content-hashed filenames.
- Stylesheet rewritten as one layer: card-based projects, chip tags, status badges, alternating white/soft sections, dark contact band, 12px minimum text and phrase-aware Japanese line breaking.
- Cards and the hero carousel use WebP thumbnails (hero image 1.9 MB → 79 KB); detail pages and the zoom dialog keep the original PNGs. Images carry intrinsic width/height.
- The quick-navigation rail appears only on the home page from 1280px, with a reserved gutter up to 1559px. The decorative appearance panel was removed.
- Open Graph/Twitter metadata and an SVG favicon were added. The mobile menu moves focus into the menu, closes on outside click and Escape. Detail screenshots open the dialog from the image or its button; only backdrop clicks close it.

## Verification
- Ten local tests passed; public package validation passed for 32 files and 10 HTML pages.
- Browser checks at 360/768/1024/1280/1440/1559/1560/1920px: no horizontal overflow, broken images or script errors; minimum rail-to-content gap 54px.
- Menu, carousel, dialog (image click, inner-edge click, backdrop click) and link copy were exercised. An independent review pass found no P1 issues; its P2 findings were fixed.

## Remaining Work
- Cafeteria project has no preserved screenshot and is described in text.
- Exact character artwork sources and permissions remain unverified. Detailed joint research materials and application distribution remain out of scope.
- Profile could add year/expected completion and a Japanese-language certification if the owner provides them.
