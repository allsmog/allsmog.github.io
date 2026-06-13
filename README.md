# allsmog.github.io

Static GitHub Pages portfolio for Sean Nejad / allsmog.

The site is generated into committed HTML so GitHub Pages can publish directly
from the `main` branch root without a framework or build workflow.

```bash
node scripts/build-site.mjs
rsvg-convert assets/site-preview.svg -o assets/site-preview.png
sips -s format jpeg -s formatOptions 84 assets/site-preview.png --out assets/site-preview.jpg
```

Generated project artwork is committed under `assets/generated/`. Replace those
files intentionally when refreshing the visual system; `scripts/build-site.mjs`
only regenerates HTML, XML, text, and the social preview SVG.
