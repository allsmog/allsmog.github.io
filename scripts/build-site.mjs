import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const siteUrl = "https://allsmog.github.io";
const today = "2026-06-12";
const projects = JSON.parse(readFileSync(join(root, "data/projects.json"), "utf8"));

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function write(path, content) {
  const fullPath = join(root, path);
  mkdirSync(dirname(fullPath), { recursive: true });
  writeFileSync(fullPath, `${content.trim()}\n`);
}

function absolute(path) {
  return `${siteUrl}${path}`;
}

function tags(topics) {
  return topics.map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`).join("");
}

function projectCard(project) {
  return `
    <article class="project-card">
      <a href="/projects/${project.slug}/" aria-label="${escapeHtml(project.name)} project page">
        <img src="${project.image}" alt="${escapeHtml(project.name)} social preview" width="1280" height="640" loading="lazy">
      </a>
      <div class="project-card-body">
        <div class="meta-row">
          <span class="meta-pill">${escapeHtml(project.language)}</span>
          <span class="meta-pill">${escapeHtml(project.category)}</span>
        </div>
        <h3><a href="/projects/${project.slug}/">${escapeHtml(project.name)}</a></h3>
        <p>${escapeHtml(project.summary)}</p>
        <div class="tag-row">${tags(project.topics.slice(0, 5))}</div>
        <div class="section-actions">
          <a class="button secondary" href="/projects/${project.slug}/">Project page</a>
          <a class="button secondary" href="${project.repo}">GitHub</a>
        </div>
      </div>
    </article>
  `;
}

function shell({ title, description, path = "/", image = "/assets/site-preview.png", body, jsonLd }) {
  const canonical = absolute(path);
  const fullImage = absolute(image);
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${fullImage}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(description)}">
  <meta name="twitter:image" content="${fullImage}">
  <link rel="stylesheet" href="/assets/site.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="site-header">
    <nav class="nav" aria-label="Primary navigation">
      <a class="brand" href="/">Sean Nejad / allsmog</a>
      <div class="nav-links">
        <a href="/#projects">Projects</a>
        <a href="/#domains">Domains</a>
        <a href="https://github.com/allsmog">GitHub</a>
      </div>
    </nav>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer">
    <div class="footer-inner">
      <span>Sean Nejad / allsmog. Security researcher and builder.</span>
      <a href="https://github.com/allsmog">github.com/allsmog</a>
    </div>
  </footer>
</body>
</html>`;
}

function homePage() {
  const description =
    "Sean Nejad / allsmog builds ProdSec and AppSec systems across AI security, MCP, OSINT, DFIR, malware analysis, reverse engineering, and applied cryptography.";
  const itemList = projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absolute(`/projects/${project.slug}/`),
    name: project.name,
  }));
  const body = `
    <section class="hero" style="--hero-image: url('/assets/site-preview.png')">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">ProdSec / AppSec / NatSec / OSINT</p>
          <h1>Security research and builder work by allsmog.</h1>
          <p class="lede">Applied security systems across agentic SAST, MCP security tooling, OSINT dashboards, memory forensics, malware analysis, and proof-oriented authentication.</p>
          <div class="hero-actions">
            <a class="button primary" href="#projects">View projects</a>
            <a class="button secondary" href="https://github.com/allsmog">GitHub profile</a>
          </div>
        </div>
      </div>
    </section>
    <section class="page-section" id="projects">
      <div class="section-inner">
        <div class="section-heading">
          <h2>Flagship projects</h2>
          <p>Focused project pages for the repos that best represent the security portfolio: product security, application security, OSINT, DFIR, malware analysis, and applied crypto.</p>
        </div>
        <div class="project-grid">${projects.map(projectCard).join("")}</div>
      </div>
    </section>
    <section class="page-section" id="domains">
      <div class="section-inner">
        <div class="section-heading">
          <h2>Security domains</h2>
          <p>The work clusters around systems that help operators find, verify, monitor, and understand security risk.</p>
        </div>
        <div class="domain-grid">
          <article class="domain"><h3>ProdSec and AppSec</h3><p>Agentic SAST, threat modeling, vulnerability triage, and proof-oriented review workflows.</p></article>
          <article class="domain"><h3>NatSec and OSINT</h3><p>Signal dashboards, geospatial monitoring, crisis context, and intelligence workflow tooling.</p></article>
          <article class="domain"><h3>DFIR and malware</h3><p>Memory forensics, malware sandboxing, telemetry, reverse engineering, and report automation.</p></article>
          <article class="domain"><h3>Applied security systems</h3><p>MCP security, LLM security, deception, proof-of-possession auth, and zero-knowledge primitives.</p></article>
        </div>
      </div>
    </section>
  `;

  return shell({
    title: "Sean Nejad / allsmog | Security Researcher and Builder",
    description,
    body,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      name: "Sean Nejad / allsmog",
      url: siteUrl,
      mainEntity: {
        "@type": "Person",
        name: "Sean Nejad",
        alternateName: "allsmog",
        url: siteUrl,
        sameAs: ["https://github.com/allsmog"],
        knowsAbout: [
          "Product Security",
          "Application Security",
          "OSINT",
          "DFIR",
          "Malware Analysis",
          "Reverse Engineering",
          "Applied Cryptography",
          "AI Security",
        ],
      },
      hasPart: {
        "@type": "ItemList",
        itemListElement: itemList,
      },
    },
  });
}

function projectPage(project) {
  const description = project.metaDescription;
  const body = `
    <section class="hero" style="--hero-image: url('${project.image}')">
      <div class="hero-inner">
        <div class="hero-copy">
          <p class="eyebrow">${escapeHtml(project.language)} / ${escapeHtml(project.topics.slice(0, 3).join(" / "))}</p>
          <h1>${escapeHtml(project.name)}</h1>
          <p class="lede">${escapeHtml(project.description)}</p>
          <div class="hero-actions">
            <a class="button primary" href="${project.repo}">Open on GitHub</a>
            <a class="button secondary" href="/">All projects</a>
          </div>
        </div>
      </div>
    </section>
    <article class="page-section project-article">
      <div class="section-inner project-layout">
        <div>
          <section class="content-block">
            <h2>Where it fits</h2>
            <p>${escapeHtml(project.focus)}</p>
          </section>
          <section class="content-block">
            <h2>What stands out</h2>
            <ul>${project.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
          </section>
          <section class="content-block">
            <h2>Search signals</h2>
            <p>${escapeHtml(project.name)} sits in the ${escapeHtml(project.topics.join(", "))} space and links back to the source repository for code, releases, issues, and documentation.</p>
          </section>
        </div>
        <aside class="fact-panel" aria-label="${escapeHtml(project.name)} facts">
          <h2>Project facts</h2>
          <dl class="fact-list">
            <div><dt>Language</dt><dd>${escapeHtml(project.language)}</dd></div>
            <div><dt>Repository</dt><dd><a href="${project.repo}">${escapeHtml(project.repo.replace("https://github.com/", ""))}</a></dd></div>
            <div><dt>Topics</dt><dd><div class="tag-row">${tags(project.topics)}</div></dd></div>
          </dl>
        </aside>
      </div>
    </article>
  `;

  return shell({
    title: `${project.name} | allsmog Security Projects`,
    description,
    path: `/projects/${project.slug}/`,
    image: project.image,
    body,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "SoftwareSourceCode",
      name: project.name,
      description: project.description,
      codeRepository: project.repo,
      programmingLanguage: project.language,
      author: {
        "@type": "Person",
        name: "Sean Nejad",
        alternateName: "allsmog",
        url: siteUrl,
      },
      url: absolute(`/projects/${project.slug}/`),
      keywords: project.topics.join(", "),
    },
  });
}

function notFoundPage() {
  return shell({
    title: "Page not found | allsmog",
    description: "The requested allsmog project page was not found.",
    path: "/404.html",
    body: `
      <section class="hero" style="--hero-image: url('/assets/site-preview.png')">
        <div class="hero-inner">
          <div class="hero-copy">
            <p class="eyebrow">404</p>
            <h1>Page not found.</h1>
            <p class="lede">The project page you requested is not available.</p>
            <div class="hero-actions"><a class="button primary" href="/">Back to projects</a></div>
          </div>
        </div>
      </section>
    `,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Page not found",
      url: absolute("/404.html"),
    },
  });
}

function sitemap() {
  const urls = ["/", ...projects.map((project) => `/projects/${project.slug}/`)];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${absolute(url)}</loc>
    <lastmod>${today}</lastmod>
  </url>`,
  )
  .join("\n")}
</urlset>`;
}

function sitePreviewSvg() {
  const imageTiles = projects
    .map((project, index) => {
      const x = 600 + (index % 2) * 315;
      const y = 64 + Math.floor(index / 2) * 176;
      return `<image href="social/${project.slug}.png" x="${x}" y="${y}" width="292" height="146" preserveAspectRatio="xMidYMid slice" opacity="0.92"/>`;
    })
    .join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640">
  <rect width="1280" height="640" fill="#0b101b"/>
  ${imageTiles}
  <rect width="1280" height="640" fill="url(#shade)"/>
  <defs>
    <linearGradient id="shade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#0b101b" stop-opacity="0.98"/>
      <stop offset="0.58" stop-color="#0b101b" stop-opacity="0.74"/>
      <stop offset="1" stop-color="#0b101b" stop-opacity="0.2"/>
    </linearGradient>
  </defs>
  <text x="72" y="116" font-family="Inter, Arial, sans-serif" font-size="24" font-weight="700" fill="#7dd3c7">ProdSec / AppSec / NatSec / OSINT</text>
  <text x="72" y="234" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="800" fill="#ffffff">Sean Nejad</text>
  <text x="72" y="314" font-family="Inter, Arial, sans-serif" font-size="76" font-weight="800" fill="#ffffff">allsmog</text>
  <text x="72" y="390" font-family="Inter, Arial, sans-serif" font-size="31" font-weight="500" fill="#dbe7f3">Security researcher and builder</text>
  <text x="72" y="448" font-family="Inter, Arial, sans-serif" font-size="24" fill="#dbe7f3">Agentic SAST, MCP security, OSINT, DFIR, malware analysis, applied crypto</text>
  <rect x="72" y="510" width="178" height="48" rx="6" fill="#ffffff"/>
  <text x="96" y="542" font-family="Inter, Arial, sans-serif" font-size="20" font-weight="700" fill="#111827">allsmog.github.io</text>
</svg>`;
}

write("index.html", homePage());
for (const project of projects) {
  write(`projects/${project.slug}/index.html`, projectPage(project));
}
write("404.html", notFoundPage());
write("robots.txt", `User-agent: *
Allow: /
Sitemap: ${absolute("/sitemap.xml")}`);
write("sitemap.xml", sitemap());
write(".nojekyll", "");
write("assets/site-preview.svg", sitePreviewSvg());
