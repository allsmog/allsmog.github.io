# allsmog.github.io

Static GitHub Pages portfolio for Sean Nejad / allsmog.

The site is generated into committed HTML so GitHub Pages can publish directly
from the `main` branch root without a framework or build workflow.

```bash
node scripts/generate-project-visuals.mjs
for svg in assets/project-visuals/*.svg; do rsvg-convert "$svg" -o "${svg%.svg}.png"; done
node scripts/build-site.mjs
rsvg-convert assets/site-preview.svg -o assets/site-preview.png
```
