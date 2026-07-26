const fs = require("fs");
const path = require("path");

const requiredRoutes = [
  "index.html",
  "links/index.html",
  "recursos/index.html",
  "newsletter/index.html",
  "checklist-financiero/index.html",
  "gracias/index.html",
  "blog/index.html",
  "sobre/index.html",
  "terminos/index.html",
  "privacidad/index.html"
];

const requiredFiles = [
  "robots.txt",
  "sitemap.xml",
  "feed.xml",
  "_redirects",
  "_headers",
  "assets/site-config.js",
  "assets/analytics.js",
  "assets/newsletter.js",
  "data/blog.json",
  "data/recursos.json"
];

const textExtensions = new Set([".html", ".js", ".json", ".md", ".xml", ".txt"]);
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function assertFile(file) {
  if (!fs.existsSync(file)) {
    fail(`Missing file: ${file}`);
  }
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".git") continue;

    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }

  return files;
}

function checkJson(file) {
  try {
    return JSON.parse(read(file));
  } catch (error) {
    fail(`Invalid JSON: ${file} (${error.message})`);
    return null;
  }
}

function checkXmlShape(file, rootTag) {
  const content = read(file).trim();

  if (!content.startsWith('<?xml version="1.0" encoding="UTF-8"?>')) {
    fail(`${file} must start with XML declaration`);
  }

  if (!content.includes(`<${rootTag}`)) {
    fail(`${file} missing root tag <${rootTag}>`);
  }
}

function checkMojibake() {
  const suspicious = new RegExp("[\\u00c3\\u00c2]|\\u00e2[^\\s]?");

  for (const file of walk(".")) {
    if (!textExtensions.has(path.extname(file))) continue;

    const content = read(file);

    if (suspicious.test(content)) {
      fail(`Possible mojibake in ${file}`);
    }
  }
}

function checkCanonical(file, expectedUrl) {
  const html = read(file);

  if (!html.includes(`rel="canonical" href="${expectedUrl}"`)) {
    fail(`Missing canonical in ${file}: ${expectedUrl}`);
  }
}

for (const file of [...requiredRoutes, ...requiredFiles]) {
  assertFile(file);
}

const posts = checkJson("data/blog.json") || [];
const resources = checkJson("data/recursos.json") || [];

if (!Array.isArray(posts) || posts.length === 0) {
  fail("data/blog.json must contain at least one post");
}

if (!Array.isArray(resources) || resources.length === 0) {
  fail("data/recursos.json must contain at least one resource");
}

const slugs = new Set();
for (const post of posts) {
  if (!post.slug || slugs.has(post.slug)) {
    fail(`Invalid or duplicated blog slug: ${post.slug}`);
  }

  slugs.add(post.slug);

  if (!fs.existsSync(`blog/${post.slug}/index.html`)) {
    fail(`Missing blog article file for slug: ${post.slug}`);
  }

  for (const key of ["titulo", "fecha", "categoria", "resumen"]) {
    if (!post[key]) {
      fail(`Blog post ${post.slug} missing ${key}`);
    }
  }
}

for (const resource of resources) {
  if (!resource.nombre) {
    fail("Resource missing nombre");
  }

  if (!resource.link_afiliado || !resource.link_afiliado.includes("?tag=minutofinanci-20")) {
    fail(`Resource affiliate link missing tag: ${resource.nombre || "(sin nombre)"}`);
  }

  if (resource.articulo_relacionado && !fs.existsSync(path.join(".", resource.articulo_relacionado, "index.html"))) {
    fail(`Resource related article does not exist: ${resource.nombre} -> ${resource.articulo_relacionado}`);
  }
}

checkXmlShape("sitemap.xml", "urlset");
checkXmlShape("feed.xml", "rss");

const sitemap = read("sitemap.xml");
for (const post of posts) {
  const url = `https://minutofinancieros.com/blog/${post.slug}/`;

  if (!sitemap.includes(url)) {
    fail(`Sitemap missing blog URL: ${url}`);
  }
}

if (sitemap.includes("/gracias/")) {
  fail("Sitemap must not include /gracias/");
}

const feed = read("feed.xml");
const feedItems = (feed.match(/<item>/g) || []).length;
if (feedItems !== posts.length) {
  fail(`Feed item count ${feedItems} does not match blog posts ${posts.length}`);
}

if (!read("gracias/index.html").includes('name="robots" content="noindex,follow"')) {
  fail("gracias/index.html must be noindex,follow");
}

checkCanonical("index.html", "https://minutofinancieros.com/");
checkCanonical("links/index.html", "https://minutofinancieros.com/links/");
checkCanonical("recursos/index.html", "https://minutofinancieros.com/recursos/");
checkCanonical("newsletter/index.html", "https://minutofinancieros.com/newsletter/");
checkCanonical("checklist-financiero/index.html", "https://minutofinancieros.com/checklist-financiero/");
checkCanonical("blog/index.html", "https://minutofinancieros.com/blog/");

if (!read("index.html").includes('rel="alternate" type="application/rss+xml"')) {
  fail("index.html missing RSS alternate link");
}

if (!read("blog/index.html").includes('rel="alternate" type="application/rss+xml"')) {
  fail("blog/index.html missing RSS alternate link");
}

checkMojibake();

if (errors.length) {
  console.error(`Site check failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Site check passed: ${posts.length} posts, ${resources.length} resources.`);
