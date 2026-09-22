// Walks every page of the site in demo mode and dumps the visible text to JSON.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync, writeFileSync } from "node:fs";
import { join, extname } from "node:path";

const root = process.env.SITE_ROOT || "/var/tmp/dist-demo";
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const server = createServer((req, res) => {
  const p = join(root, req.url.split("?")[0] === "/" ? "index.html" : req.url.split("?")[0]);
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[extname(p)] || "application/octet-stream" });
  res.end(readFileSync(p));
});
await new Promise(r => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}/`;

const browser = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });

const persona = async (p) => { await page.goto(base, { waitUntil: "load" }); await page.waitForTimeout(400); await page.click(`[data-persona="${p}"]`); await page.waitForTimeout(400); };
const grab = async (hash) => {
  await page.goto(base + hash, { waitUntil: "load" });
  await page.waitForFunction(() => { const t = document.querySelector("#app .tiny"); return !t || t.textContent !== "Loading…"; });
  await page.waitForTimeout(250);
  return await page.evaluate(() => {
    const out = [];
    const walk = (el) => {
      for (const node of el.children) {
        const tag = node.tagName.toLowerCase();
        if (["script", "style"].includes(tag)) continue;
        if (/^h[1-3]$/.test(tag)) { out.push({ t: "h" + tag[1], v: node.innerText.trim() }); continue; }
        if (node.classList.contains("eyebrow")) { out.push({ t: "eyebrow", v: node.innerText.trim() }); continue; }
        if (["p", "li", "dd", "dt", "blockquote", "cite", "label", "td", "th", "button", "a", "span", "b", "small", "option"].includes(tag)) {
          const txt = node.innerText ? node.innerText.trim() : "";
          if (txt && node.children.length === 0) out.push({ t: tag, v: txt });
          else if (node.children.length) walk(node);
          else if (txt) out.push({ t: tag, v: txt });
          continue;
        }
        if (tag === "input" || tag === "textarea" || tag === "select") { out.push({ t: "field", v: (node.placeholder || node.getAttribute("aria-label") || node.name || "") }); continue; }
        walk(node);
      }
    };
    walk(document.getElementById("app"));
    return out;
  });
};

const result = { pages: [], notes: [], admin: [] };

// Public pages as a guest
await persona("");
for (const [hash, name] of [["#/", "Home (landing page)"], ["#/research", "Research library"], ["#/signin", "Sign in"], ["#/access", "Request access"], ["#/disclaimer", "Disclaimer"], ["#/copyright", "Copyright and terms of use"]]) {
  result.pages.push({ name, hash, blocks: await grab(hash) });
}
// Gate as seen by a guest
result.gateGuest = await grab("#/note/industrial-distribution-compounders");

// Every writeup, in full, as a subscriber
await persona("subscriber");
const slugs = await page.evaluate(async () => {
  const r = await fetch(location.href); return null;
});
for (const slug of ["kill-conditions", "specialty-insurance-post-mortem", "industrial-distribution-compounders", "regional-banks-deposit-franchises", "hospital-outsourcing-margin-recovery", "memory-pricing-discipline"]) {
  result.notes.push({ slug, blocks: await grab("#/note/" + slug) });
}
result.account = await grab("#/account");

// Admin
await persona("admin");
for (const [hash, name] of [["#/admin", "Admin — Overview"], ["#/admin/writeups", "Admin — Writeups"], ["#/admin/members", "Admin — Members"], ["#/admin/requests", "Admin — Requests"], ["#/admin/edit/new", "Admin — New/Edit writeup form"]]) {
  result.admin.push({ name, hash, blocks: await grab(hash) });
}

// Footer + nav
await page.goto(base, { waitUntil: "load" }); await page.waitForTimeout(300);
result.nav = await page.locator("#nav a").allTextContents();
result.footer = { links: await page.locator(".foot-links a").allTextContents(), note: await page.locator(".foot-note").textContent(), copy: await page.locator("#copyLine").textContent() };

writeFileSync("/home/claude/prajit-site/test/site-text.json", JSON.stringify(result, null, 1));
console.log("pages:", result.pages.length, "notes:", result.notes.length, "admin:", result.admin.length);
await browser.close(); server.close();
