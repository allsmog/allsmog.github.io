import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const root = process.cwd();
const siteUrl = "https://allsmog.github.io";
const today = "2026-06-12";
const featuredSlugs = new Set(["kuzushi", "oxidized-joern", "klee-ng"]);
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
  const cleanContent = content
    .trim()
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n");
  writeFileSync(fullPath, `${cleanContent}\n`);
}

function absolute(path) {
  return `${siteUrl}${path}`;
}

function tagList(topics, limit = topics.length) {
  return topics
    .slice(0, limit)
    .map((topic) => `<span class="tag">${escapeHtml(topic)}</span>`)
    .join("");
}

function projectLink(project, label = "open repository") {
  return `<a class="text-link" href="${project.repo}">${label}</a>`;
}

function filterButtons(domains) {
  return [
    `<button class="filter-button active" type="button" data-filter="all">all</button>`,
    ...domains.map(
      (domain) =>
        `<button class="filter-button" type="button" data-filter="${escapeHtml(domain)}">${escapeHtml(domain)}</button>`,
    ),
  ].join("");
}

function featureRow(project, index) {
  const className = index % 2 === 1 ? "feature-row feature-row-reverse" : "feature-row";
  return `
    <article class="${className}" style="--project-accent: ${escapeHtml(project.accent)}">
      <a class="feature-art" href="/projects/${project.slug}/" aria-label="${escapeHtml(project.name)} project page">
        <img src="${project.visual}" alt="${escapeHtml(project.name)} artifact preview" width="1280" height="720">
      </a>
      <div class="feature-copy">
        <p class="dossier-label">${escapeHtml(project.domain)}</p>
        <h3><a href="/projects/${project.slug}/">${escapeHtml(project.name)}</a></h3>
        <p>${escapeHtml(project.description)}</p>
        <ul>${project.highlights.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
        <div class="feature-meta">
          <span>${escapeHtml(project.language)}</span>
          <span>${escapeHtml(project.category)}</span>
          ${projectLink(project)}
        </div>
      </div>
    </article>
  `;
}

function indexCard(project) {
  return `
    <article class="index-card" data-domain="${escapeHtml(project.domain)}" style="--project-accent: ${escapeHtml(project.accent)}">
      <a class="index-art" href="/projects/${project.slug}/" aria-label="${escapeHtml(project.name)} project page">
        <img src="${project.visual}" alt="${escapeHtml(project.name)} artifact preview" width="1280" height="720">
      </a>
      <div class="index-card-body">
        <div class="index-meta">
          <span>${escapeHtml(project.domain)}</span>
          <span>${escapeHtml(project.language)}</span>
        </div>
        <h3><a href="/projects/${project.slug}/">${escapeHtml(project.name)}</a></h3>
        <p>${escapeHtml(project.summary)}</p>
        <div class="tag-row">${tagList(project.topics, 4)}</div>
        <div class="section-actions">
          <a class="text-link" href="/projects/${project.slug}/">case file</a>
          ${projectLink(project, "github")}
        </div>
      </div>
    </article>
  `;
}

function shell({ title, description, path = "/", image = "/assets/site-preview.png", body, jsonLd, includeFilterScript = false }) {
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
      <a class="brand" href="/">Sean Nejad</a>
      <div class="nav-links">
        <a href="/#work">work</a>
        <a href="/#index">index</a>
        <a href="/#about">about</a>
        <a href="https://github.com/allsmog">github</a>
      </div>
    </nav>
  </header>
  <main id="main">${body}</main>
  <footer class="site-footer" id="contact">
    <div class="footer-inner">
      <span>Sean Nejad <span class="muted">// @allsmog</span></span>
      <a href="https://github.com/allsmog">github.com/allsmog</a>
    </div>
  </footer>
  ${includeFilterScript ? filterScript() : ""}
</body>
</html>`;
}

function homePage() {
  const description =
    "Sean Nejad / allsmog builds ProdSec and AppSec systems across AI security, MCP, OSINT, DFIR, malware analysis, reverse engineering, and applied cryptography.";
  const featured = projects.filter((project) => featuredSlugs.has(project.slug));
  const indexProjects = projects.filter((project) => !featuredSlugs.has(project.slug));
  const indexedDomains = [...new Set(indexProjects.map((project) => project.domain))];
  const itemList = projects.map((project, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: absolute(`/projects/${project.slug}/`),
    name: project.name,
  }));

  const body = `
    <section class="dossier-hero">
      <div class="hero-stamp">last updated ${today} · github pages · evidence index</div>
      <div class="dossier-hero-grid">
        <div class="identity-block">
          <p class="dossier-label">prodsec / appsec / natsec / osint</p>
          <h1>Sean Nejad</h1>
          <p class="identity-handle">// @allsmog · security research · offensive tooling · applied crypto</p>
          <p class="identity-line">I build evidence-driven security systems: agentic SAST, CPG and symbolic-analysis infrastructure, OSINT dashboards, DFIR tooling, malware sandboxes, MCP security workflows, and proof-oriented auth.</p>
          <div class="identity-links" aria-label="Primary links">
            <a href="https://github.com/allsmog">github</a>
            <a href="#work">selected work</a>
            <a href="/sitemap.xml">sitemap</a>
          </div>
        </div>
        <figure class="hero-figure">
          <img src="/assets/project-visuals/oxidized-joern.png" alt="Code-property-graph artifact preview" width="1280" height="720">
          <figcaption>case-file figure: code-property graph / symbolic analysis / security workflow evidence</figcaption>
        </figure>
      </div>
    </section>

    <section class="page-section" id="work">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-index">01 / selected work</p>
          <h2>Evidence first. Tools second.</h2>
          <p>Three case-file rows anchor the portfolio: agentic AppSec, code-property-graph infrastructure, and symbolic execution. The rest of the work stays indexed below.</p>
        </div>
        <div class="feature-stack">${featured.map(featureRow).join("")}</div>
      </div>
    </section>

    <section class="page-section index-section" id="index">
      <div class="section-inner">
        <div class="section-heading">
          <p class="section-index">02 / project index</p>
          <h2>Security systems by domain.</h2>
          <p>Filter the rest of the portfolio by the kind of problem you care about.</p>
        </div>
        <div class="filter-row" aria-label="Project filters">${filterButtons(indexedDomains)}</div>
        <div class="index-grid">${indexProjects.map(indexCard).join("")}</div>
      </div>
    </section>

    <section class="page-section about-section" id="about">
      <div class="section-inner about-grid">
        <div>
          <p class="section-index">03 / operating style</p>
          <h2>Builder, security researcher, operator tooling person.</h2>
        </div>
        <div class="about-copy">
          <p>My best work preserves evidence, runs locally where it should, and turns noisy security data into defensible next actions.</p>
          <p>I care about proof state, traceability, explicit scope, and tools that survive contact with real operators.</p>
          <div class="tag-row">${tagList(["ProdSec", "AppSec", "NatSec", "OSINT", "DFIR", "malware analysis", "applied crypto", "program analysis"])}</div>
        </div>
      </div>
    </section>
  `;

  return shell({
    title: "Sean Nejad / allsmog | Security Researcher and Builder",
    description,
    body,
    includeFilterScript: true,
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
          "Program Analysis",
          "Symbolic Execution",
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
    <section class="project-dossier" style="--project-accent: ${escapeHtml(project.accent)}">
      <div class="project-dossier-grid">
        <div class="project-dossier-copy">
          <p class="section-index">case file / ${escapeHtml(project.domain)}</p>
          <h1>${escapeHtml(project.name)}</h1>
          <p class="identity-handle">// ${escapeHtml(project.language)} · ${escapeHtml(project.category)}</p>
          <p class="identity-line">${escapeHtml(project.description)}</p>
          <div class="identity-links">
            <a href="${project.repo}">open repository</a>
            <a href="/">all work</a>
          </div>
        </div>
        <figure class="project-dossier-art">
          <img src="${project.visual}" alt="${escapeHtml(project.name)} artifact preview" width="1280" height="720">
        </figure>
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
            <h2>Related areas</h2>
            <p>${escapeHtml(project.name)} connects to ${escapeHtml(project.topics.join(", "))}. The source repository carries the code, releases, issues, and documentation trail.</p>
          </section>
        </div>
        <aside class="fact-panel" aria-label="${escapeHtml(project.name)} facts">
          <h2>Project facts</h2>
          <dl class="fact-list">
            <div><dt>Domain</dt><dd>${escapeHtml(project.domain)}</dd></div>
            <div><dt>Language</dt><dd>${escapeHtml(project.language)}</dd></div>
            <div><dt>Repository</dt><dd><a href="${project.repo}">${escapeHtml(project.repo.replace("https://github.com/", ""))}</a></dd></div>
            <div><dt>Topics</dt><dd><div class="tag-row">${tagList(project.topics)}</div></dd></div>
          </dl>
        </aside>
      </div>
    </article>
  `;

  return shell({
    title: `${project.name} | Sean Nejad / allsmog`,
    description,
    path: `/projects/${project.slug}/`,
    image: project.visual,
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
    title: "Page not found | Sean Nejad / allsmog",
    description: "The requested allsmog project page was not found.",
    path: "/404.html",
    body: `
      <section class="dossier-hero">
        <div class="hero-stamp">404 · route missing</div>
        <div class="identity-block">
          <p class="dossier-label">not found</p>
          <h1>Sean Nejad</h1>
          <p class="identity-handle">// requested case file unavailable</p>
          <div class="identity-links"><a href="/">return home</a></div>
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

function filterScript() {
  return `<script>
(() => {
  const buttons = [...document.querySelectorAll("[data-filter]")];
  const cards = [...document.querySelectorAll("[data-domain]")];
  for (const button of buttons) {
    button.addEventListener("click", () => {
      const filter = button.dataset.filter;
      for (const item of buttons) item.classList.toggle("active", item === button);
      for (const card of cards) {
        card.hidden = filter !== "all" && card.dataset.domain !== filter;
      }
    });
  }
})();
</script>`;
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
  const tiles = projects
    .slice(0, 6)
    .map((project, index) => {
      const x = 650 + (index % 2) * 260;
      const y = 72 + Math.floor(index / 2) * 164;
      return `<image href="project-visuals/${project.slug}.png" x="${x}" y="${y}" width="232" height="130" preserveAspectRatio="xMidYMid slice" opacity="0.78"/>`;
    })
    .join("\n  ");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="640" viewBox="0 0 1280 640">
  <rect width="1280" height="640" fill="#0c0e12"/>
  <path d="M0 86H1280M0 174H1280M0 262H1280M0 350H1280M0 438H1280M0 526H1280M160 0V640M320 0V640M480 0V640M640 0V640M800 0V640M960 0V640M1120 0V640" stroke="#242832" stroke-width="1" opacity="0.42"/>
  ${tiles}
  <rect width="1280" height="640" fill="url(#shade)"/>
  <defs>
    <linearGradient id="shade" x1="0" x2="1" y1="0" y2="0">
      <stop offset="0" stop-color="#0c0e12" stop-opacity="0.98"/>
      <stop offset="0.62" stop-color="#0c0e12" stop-opacity="0.84"/>
      <stop offset="1" stop-color="#0c0e12" stop-opacity="0.36"/>
    </linearGradient>
  </defs>
  <text x="72" y="116" font-family="JetBrains Mono, SFMono-Regular, Consolas, monospace" font-size="23" font-weight="700" fill="#d4ff4f">prodsec / appsec / natsec / osint</text>
  <text x="72" y="254" font-family="Inter, Arial, sans-serif" font-size="92" font-weight="850" fill="#e8e6e1">Sean Nejad</text>
  <text x="72" y="316" font-family="JetBrains Mono, SFMono-Regular, Consolas, monospace" font-size="27" fill="#9ca3af">// @allsmog · security research + builder</text>
  <text x="72" y="404" font-family="Inter, Arial, sans-serif" font-size="29" fill="#c9c7c1">Agentic SAST, CPG analysis, symbolic execution, OSINT, DFIR, malware, applied crypto.</text>
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
