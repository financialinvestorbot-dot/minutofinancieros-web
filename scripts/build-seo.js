const fs = require("fs");

const site = "https://minutofinancieros.com";
const today = "2026-07-27";
const posts = JSON.parse(fs.readFileSync("data/blog.json", "utf8"));

const staticUrls = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/links/", changefreq: "weekly", priority: "0.7" },
  { path: "/recursos/", changefreq: "weekly", priority: "0.9" },
  { path: "/newsletter/", changefreq: "monthly", priority: "0.8" },
  { path: "/checklist-financiero/", changefreq: "monthly", priority: "0.8" },
  { path: "/blog/", changefreq: "weekly", priority: "0.8" }
];

const legalUrls = [
  { path: "/sobre/", changefreq: "monthly", priority: "0.5" },
  { path: "/terminos/", changefreq: "yearly", priority: "0.3" },
  { path: "/privacidad/", changefreq: "yearly", priority: "0.3" }
];

function xmlEscape(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;")
    .replace(/[^\x09\x0a\x0d\x20-\x7e]/g, (char) => `&#x${char.codePointAt(0).toString(16).toUpperCase()};`);
}

function pubDate(date) {
  return new Date(`${date}T12:00:00-03:00`).toUTCString();
}

function urlEntry({ path, changefreq, priority }) {
  return `  <url>
    <loc>${site}${path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

function buildSitemap() {
  const postUrls = posts.map((post, index) => ({
    path: `/blog/${post.slug}/`,
    changefreq: "monthly",
    priority: index < 3 ? "0.8" : "0.7"
  }));

  const urls = [...staticUrls, ...postUrls, ...legalUrls].map(urlEntry).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildFeed() {
  const latest = posts.map((post) => post.fecha).sort().at(-1);
  const items = posts.map((post) => {
    const url = `${site}/blog/${post.slug}/`;

    return `    <item>
      <title>${xmlEscape(post.titulo)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate(post.fecha)}</pubDate>
      <category>${xmlEscape(post.categoria)}</category>
      <description>${xmlEscape(post.resumen)}</description>
    </item>`;
  }).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Minuto Financieros Blog</title>
    <link>${site}/blog/</link>
    <atom:link href="${site}/feed.xml" rel="self" type="application/rss+xml" />
    <description>Guias cortas de educacion financiera sobre ahorro, presupuesto, deudas, habitos e inversion basica.</description>
    <language>es-AR</language>
    <lastBuildDate>${pubDate(latest)}</lastBuildDate>
${items}
  </channel>
</rss>
`;
}

fs.writeFileSync("sitemap.xml", buildSitemap(), "ascii");
fs.writeFileSync("feed.xml", buildFeed(), "ascii");

console.log(`Generated sitemap.xml and feed.xml from ${posts.length} posts.`);
