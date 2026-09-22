// Functional test of the site in demo mode (no Supabase). Run: node test/demo.test.mjs
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const root = process.env.SITE_ROOT || join(process.cwd(), "dist");
const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" };
const server = createServer((req, res) => {
  const p = join(root, req.url.split("?")[0] === "/" ? "index.html" : req.url.split("?")[0]);
  if (!existsSync(p)) { res.writeHead(404); return res.end(); }
  res.writeHead(200, { "content-type": types[extname(p)] || "application/octet-stream" }); res.end(readFileSync(p));
});
await new Promise(r => server.listen(0, r));
const base = `http://127.0.0.1:${server.address().port}/`;

const results = []; let failed = 0;
const check = (name, ok, extra = "") => { results.push(`${ok ? "PASS" : "FAIL"}  ${name}${extra ? " — " + extra : ""}`); if (!ok) failed++; };

const browser = await chromium.launch({ executablePath: process.env.CHROMIUM || "/opt/pw-browsers/chromium", args: ["--no-sandbox"] }).catch(() => chromium.launch({ args: ["--no-sandbox"] }));
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
const errors = []; page.on("pageerror", e => errors.push(String(e)));
page.on("console", m => { if (m.type() === "error" && !/jsdelivr|net::ERR|Failed to load resource/.test(m.text())) errors.push(m.text()); });
const go = async (hash) => { await page.goto(base + hash, { waitUntil: "load" }); await page.waitForFunction(() => !document.querySelector("#app .tiny") || document.querySelector("#app .tiny").textContent !== "Loading…"); await page.waitForTimeout(150); };
const text = async (sel) => (await page.locator(sel).allTextContents()).join(" | ");

// 1. Home
await go("#/");
check("home renders hero", (await text("h1")).includes("Patient research"));
check("demo bar visible", await page.locator("#demoBar .demo").isVisible());
check("home shows 4 latest writeups", await page.locator("#research .row").count() === 4);

// 2. Library as guest
await go("#/research");
check("library lists 6 published (draft hidden)", await page.locator(".ledger .row").count() === 6);
await page.click('[data-filter="Initiation"]');
await page.waitForTimeout(200);
check("type filter works", await page.locator(".ledger .row").count() === 2);
await page.click('[data-filter="All"]');
await page.fill("#searchBox", "memory"); await page.waitForTimeout(300);
check("search works", await page.locator(".ledger .row").count() === 1);

// 3. Gated note as guest
await go("#/note/industrial-distribution-compounders");
check("guest sees gate on member note", await page.locator(".gate").count() === 1);
check("guest never receives gated body text", !(await page.content()).includes("route density: revenue per delivery stop"));
check("guest gate offers sign-in", (await text(".gate .btn")).toLowerCase().includes("sign in"));
await go("#/note/kill-conditions");
check("guest reads free note in full", (await text(".prose")).includes("What a good kill condition looks like"));

// 4. Persona: member
await page.click('[data-persona="member"]'); await page.waitForTimeout(300);
await go("#/note/industrial-distribution-compounders");
check("member reads member note", (await text(".prose")).includes("route density"));
check("member sees download for attached doc", await page.locator("#dlBtn").count() === 1);
await go("#/note/regional-banks-deposit-franchises");
check("member is gated on subscriber note", await page.locator(".gate").count() === 1 && (await text(".gate .btn")).toLowerCase().includes("request subscriber"));
check("nav shows Account when signed in", (await text("#navAuth")) === "Account");

// 5. Persona: subscriber
await page.click('[data-persona="subscriber"]'); await page.waitForTimeout(300);
await go("#/note/regional-banks-deposit-franchises");
check("subscriber reads subscriber note", (await text(".prose")).includes("deposit beta"));
await go("#/admin");
check("subscriber cannot open admin", (await text("#app h2")).includes("Sign in with an admin account"));

// 6. Access request as guest → shows in admin
await page.click('[data-persona=""]'); await page.waitForTimeout(300);
await go("#/access?plan=subscriber");
check("plan preselected from link", await page.locator("#f-plan").inputValue() === "subscriber");
await page.fill("#f-name", "Test Reader"); await page.fill("#f-email", "reader@example.org"); await page.fill("#f-note", "Financials");
await page.click("#accessSubmit"); await page.waitForTimeout(300);
check("request confirmation shown", (await text("#formMsg")).includes("Request received"));

// 7. Sign-in form (demo) → account
await go("#/signin");
await page.fill("#s-email", "new@example.org"); await page.fill("#s-name", "New Reader");
await page.click("#signinSubmit"); await page.waitForTimeout(400);
check("demo sign-in lands on account", (await text("#app h2")).includes("New Reader"));
await page.click("#signoutBtn"); await page.waitForTimeout(300);
check("sign out returns to guest", (await text("#navAuth")) === "Sign in");

// 8. Admin
await page.click('[data-persona="admin"]'); await page.waitForTimeout(300);
check("admin link appears", await page.locator("#navAdmin").isVisible());
await go("#/admin");
check("overview tiles render", await page.locator(".tile").count() === 5);
check("views table lists notes", (await page.locator("table.t tbody tr").count()) >= 6);
await go("#/admin/requests");
check("new request listed", (await text("table.t")).includes("reader@example.org"));
const approve = page.locator('[data-req][data-status="approved"]').first();
await approve.click(); await page.waitForTimeout(300);
check("request approved", (await text("table.t")).includes("Approved"));
await go("#/admin/members");
check("members table renders", (await page.locator("table.t tbody tr").count()) >= 5);
await page.selectOption('[data-tier="demo-member"]', "subscriber"); await page.waitForTimeout(200);
await go("#/admin/writeups");
check("writeups list includes draft", (await text("table.t")).includes("Draft") && (await page.locator("table.t tbody tr").count()) === 7);

// 9. Create + publish a writeup
await go("#/admin/edit/new");
await page.fill("#e-title", "Test Note From Admin");
check("slug auto-fills", await page.locator("#e-slug").inputValue() === "test-note-from-admin");
await page.fill("#e-summary", "A summary."); await page.fill("#e-sector", "Energy");
await page.selectOption("#e-access", "free"); await page.selectOption("#e-status", "published");
await page.fill("#e-body", "First paragraph.\n\n## Heading\n\n- one\n- two");
await page.click("#saveBtn"); await page.waitForTimeout(400);
check("save navigates to edit url", page.url().endsWith("#/admin/edit/test-note-from-admin"));
await go("#/research");
await page.fill("#searchBox", ""); await page.waitForTimeout(300);
check("new note appears in library (7)", await page.locator(".ledger .row").count() === 7);
await go("#/note/test-note-from-admin");
check("markdown-lite renders heading and list", await page.locator(".prose h3").count() === 1 && await page.locator(".prose li").count() === 2);
await go("#/admin/writeups");
const toggle = page.locator('[data-toggle]').filter({ hasText: "Unpublish" }).first();
await toggle.click(); await page.waitForTimeout(300);
check("unpublish works", (await text('tr:has-text("Test Note From Admin") .pill')).includes("Draft"));
const del = page.locator('tr:has-text("Test Note From Admin") [data-del]'); await del.click(); await page.waitForTimeout(100); await del.click(); await page.waitForTimeout(300);
check("delete works (7 rows left)", (await page.locator("table.t tbody tr").count()) === 7 && !(await text("table.t")).includes("Test Note From Admin"));

// 10. Mobile width, no horizontal scroll
const m = await browser.newPage({ viewport: { width: 400, height: 800 } });
for (const h of ["#/", "#/research", "#/note/kill-conditions", "#/signin", "#/admin"]) {
  await m.goto(base + h, { waitUntil: "load" }); await m.waitForTimeout(300);
  const sw = await m.evaluate(() => document.documentElement.scrollWidth);
  check(`no horizontal scroll at 400px: ${h}`, sw <= 400, `scrollWidth=${sw}`);
}
await m.click("#menuBtn"); check("mobile menu opens", await m.locator("#nav.open").isVisible());
await m.screenshot({ path: "test/phone-home.png", fullPage: false });
await page.goto(base + "#/admin", { waitUntil: "load" }); await page.waitForTimeout(400);
await page.screenshot({ path: "test/desk-admin.png", fullPage: true });

check("no page errors", errors.length === 0, errors.slice(0, 3).join(" || "));
console.log(results.join("\n"));
console.log(failed ? `\n${failed} FAILED` : "\nALL DEMO TESTS PASSED");
await browser.close(); server.close();
process.exit(failed ? 1 : 0);
