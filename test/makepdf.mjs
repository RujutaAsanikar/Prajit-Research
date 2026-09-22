// Builds the reference PDF from the scraped site text.
import { readFileSync, writeFileSync } from "node:fs";
import { chromium } from "playwright";

const D = JSON.parse(readFileSync("/home/claude/prajit-site/test/site-text.json", "utf8"));
const esc = s => String(s ?? "").replace(/[&<>]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" }[c]));

const NOTE_TITLES = {
  "kill-conditions": "Our kill conditions: how every thesis gets a sell rule before a buy",
  "specialty-insurance-post-mortem": "What we got wrong on specialty insurance in 2025",
  "industrial-distribution-compounders": "The quiet compounders in industrial distribution",
  "regional-banks-deposit-franchises": "Regional banks after the rate cycle",
  "hospital-outsourcing-margin-recovery": "Hospital outsourcing: margin recovery is a volume story",
  "memory-pricing-discipline": "Memory pricing and the discipline nobody expects to last"
};

// Render scraped blocks. Skip nav/footer chrome that repeats on every page.
const SKIP = new Set(["MENU", "RESEARCH", "PHILOSOPHY", "PROCESS", "ABOUT", "SIGN IN", "ACCOUNT", "ADMIN", "REQUEST ACCESS", "GUEST", "MEMBER", "SUBSCRIBER", "DEMO MODE"]);
function blocks(list, { drop = [] } = {}){
  const out = [];
  let lastEyebrow = "";
  for (const b of list){
    const v = (b.v || "").trim();
    if (!v) continue;
    if (drop.some(d => v.startsWith(d))) continue;
    if (b.t === "eyebrow"){ if (v === lastEyebrow) continue; lastEyebrow = v; out.push(`<p class="eb">${esc(v)}</p>`); continue; }
    if (b.t === "h1") out.push(`<h3 class="pt">${esc(v)}</h3>`);
    else if (b.t === "h2") out.push(`<h4>${esc(v)}</h4>`);
    else if (b.t === "h3") out.push(`<h5>${esc(v)}</h5>`);
    else if (b.t === "li") out.push(`<p class="li">— ${esc(v)}</p>`);
    else if (b.t === "a" || b.t === "button") out.push(`<p class="btn">[button] ${esc(v)}</p>`);
    else if (b.t === "field") out.push(`<p class="fld">[input field] ${esc(v)}</p>`);
    else if (b.t === "dt" || b.t === "th") out.push(`<p class="lbl">${esc(v)}</p>`);
    else if (b.t === "cite") out.push(`<p class="cite">${esc(v)}</p>`);
    else out.push(`<p>${esc(v)}</p>`);
  }
  return out.join("\n");
}

const page = (n) => D.pages.find(p => p.name.startsWith(n));

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@page { size: A4; margin: 20mm 18mm 18mm 18mm; }
* { box-sizing: border-box; }
body { margin:0; font-family: Georgia, "Times New Roman", serif; font-size: 10.5pt; line-height: 1.5; color:#1C1A16; background:#fff; }
.mono { font-family: "DejaVu Sans Mono", Menlo, monospace; }
h1 { font-size: 28pt; font-weight: normal; line-height:1.1; margin:0 0 6mm; letter-spacing:-0.01em; }
h2 { font-size: 16pt; font-weight: normal; margin: 0 0 4mm; padding-bottom:2mm; border-bottom:1.5px solid #9E7D1E; color:#1C1A16; }
h3 { font-size: 13pt; font-weight: normal; margin: 6mm 0 2mm; }
h3.pt { font-size: 14pt; }
h4 { font-size: 12pt; font-weight: normal; margin: 5mm 0 2mm; }
h5 { font-size: 10.5pt; font-weight: bold; margin: 4mm 0 1.5mm; }
p { margin: 0 0 2.2mm; }
.eb { font-family:"DejaVu Sans Mono", monospace; font-size:7.5pt; letter-spacing:.12em; text-transform:uppercase; color:#7C6216; margin:4mm 0 1.5mm; }
.li { padding-left:5mm; }
.btn { font-family:"DejaVu Sans Mono", monospace; font-size:8pt; color:#5E5749; letter-spacing:.04em; }
.fld { font-family:"DejaVu Sans Mono", monospace; font-size:8pt; color:#877F6E; }
.lbl { font-family:"DejaVu Sans Mono", monospace; font-size:8pt; text-transform:uppercase; letter-spacing:.08em; color:#877F6E; margin-bottom:0.5mm; }
.cite { font-size:9pt; color:#5E5749; font-style:italic; }
.sec { page-break-before: always; }
.cover { height: 245mm; display:flex; flex-direction:column; justify-content:center; }
.cover .rule { width:40mm; border-top:2px solid #9E7D1E; margin-bottom:8mm; }
.cover .sub { font-size:12pt; color:#5E5749; margin-top:6mm; max-width:120mm; }
.cover .meta { margin-top:14mm; font-family:"DejaVu Sans Mono", monospace; font-size:8.5pt; letter-spacing:.08em; text-transform:uppercase; color:#877F6E; line-height:2; }
table { width:100%; border-collapse:collapse; margin:3mm 0 5mm; font-size:9.5pt; }
th { text-align:left; font-family:"DejaVu Sans Mono", monospace; font-size:7.5pt; text-transform:uppercase; letter-spacing:.1em; color:#877F6E; font-weight:normal; border-bottom:1px solid #B9AE96; padding:1.5mm 3mm 1.5mm 0; }
td { padding:2mm 3mm 2mm 0; border-bottom:1px solid #E5DECC; vertical-align:top; }
td.y { color:#3E6B3A; white-space:nowrap; }
td.n { color:#8C2F2F; white-space:nowrap; }
td.p { color:#8A5A12; white-space:nowrap; }
.card { border-left:2px solid #9E7D1E; padding:2mm 0 2mm 5mm; margin:4mm 0; background:#FBF8F1; }
.note { background:#F3EEE3; padding:4mm 5mm; margin:4mm 0; font-size:9.5pt; }
.pagebox { border:1px solid #D8CFBC; padding:5mm; margin:0 0 6mm; break-inside:auto; }
.pagebox > .ttl { break-after:avoid; }
h2, h3, h4, h5 { break-after:avoid; }
table { break-inside:auto; }
tr { break-inside:avoid; }
.pagebox > .ttl { font-family:"DejaVu Sans Mono", monospace; font-size:8pt; letter-spacing:.1em; text-transform:uppercase; color:#1C1A16; border-bottom:1px solid #D8CFBC; padding-bottom:2mm; margin:0 0 3mm; }
.addr { font-family:"DejaVu Sans Mono", monospace; font-size:8pt; color:#877F6E; }
ol.toc { list-style:none; padding:0; margin:6mm 0 0; }
ol.toc li { padding:2mm 0; border-bottom:1px solid #E5DECC; font-size:11pt; }
ol.toc span { font-family:"DejaVu Sans Mono", monospace; font-size:8pt; color:#9E7D1E; margin-right:4mm; }
</style></head><body>

<div class="cover">
  <div class="rule"></div>
  <h1>Prajit Research<br>Website Reference</h1>
  <p class="sub">Every page, every menu item, all the text on the site, and an honest account of what works today and what does not.</p>
  <div class="meta">
    Prepared 15 September 2026<br>
    For Rahul Asanikar and Abhijit Kulkarni<br>
    Domain: prajitresearch.com<br>
    Status: built and connected to its database; awaiting DNS
  </div>
</div>

<div class="sec">
<h2>Contents</h2>
<ol class="toc">
  <li><span>01</span>Where the site stands today</li>
  <li><span>02</span>What works and what does not</li>
  <li><span>03</span>Site map — every menu item and what is inside</li>
  <li><span>04</span>The public pages, word for word</li>
  <li><span>05</span>The six sample writeups, in full</li>
  <li><span>06</span>The admin area, screen by screen</li>
  <li><span>07</span>What is left to do</li>
</ol>
</div>

<div class="sec">
<h2>01 · Where the site stands today</h2>
<p>The website is finished and connected to a live database. Three things remain outside the website itself: the domain, the email sender, and the real content.</p>

<h3>The parts and who holds them</h3>
<table>
<tr><th>Part</th><th>What it does</th><th>Where it lives</th></tr>
<tr><td><b>The website</b></td><td>Everything a visitor sees and clicks</td><td>Four files in the GitHub repository <span class="mono">rujutaasanikar/prajit-research</span></td></tr>
<tr><td><b>The database</b></td><td>Stores writeups, member accounts, view counts, uploaded documents; decides who is allowed to read what</td><td>Supabase project <span class="mono">PrajitResearch</span> (free plan, East US), owned by ruju25a@gmail.com</td></tr>
<tr><td><b>The address</b></td><td>prajitresearch.com</td><td>GoDaddy — DNS records not yet changed</td></tr>
</table>

<h3>Who can do what</h3>
<table>
<tr><th>Person</th><th>Sees</th></tr>
<tr><td><b>Guest</b> (no account)</td><td>The landing page, the library list, every writeup summary, and the full text of writeups marked <i>Free</i>. The disclaimer and copyright pages.</td></tr>
<tr><td><b>Member</b> (free account)</td><td>Everything above, plus the full text of writeups marked <i>Member</i>, and any document attached to them.</td></tr>
<tr><td><b>Subscriber</b></td><td>Everything, including writeups marked <i>Subscriber</i> and their attached models.</td></tr>
<tr><td><b>Admin</b></td><td>Everything, plus the Research desk: add, edit, publish and delete writeups; see view counts; change any reader's access level; approve or decline access requests. Only two email addresses are admins: <span class="mono">ruju25a@gmail.com</span> and <span class="mono">prajitresearch@gmail.com</span>.</td></tr>
</table>

<div class="note"><b>How the gate is enforced.</b> The text of a Member or Subscriber writeup is never sent to a browser that is not entitled to it — it is withheld by the database, not hidden by the page. Someone who opens the page source of a gated writeup as a guest finds the summary and nothing more. This was tested with more than forty automated checks covering guests, members, subscribers and admins.</div>
</div>

<div class="sec">
<h2>02 · What works and what does not</h2>

<h3>Works today</h3>
<table>
<tr><th>Feature</th><th>Status</th><th>Detail</th></tr>
<tr><td>Landing page</td><td class="y">Working</td><td>Hero, four statistics, Philosophy, Process, latest four writeups, three access tiers, About.</td></tr>
<tr><td>Research library</td><td class="y">Working</td><td>All published writeups, newest first. Filter by type, search by title or sector.</td></tr>
<tr><td>Writeup pages</td><td class="y">Working</td><td>Full text for entitled readers; summary plus an invitation for everyone else. Shows date, sector, type, reading time, version number, access level.</td></tr>
<tr><td>Sign up / sign in</td><td class="y">Working</td><td>One flow: enter an email, receive a link, click it. First-time visitors get a free Member account automatically. No passwords exist, so there is no "forgot password" to fail.</td></tr>
<tr><td>Account page</td><td class="y">Working</td><td>Reader can see their access level and change their own name and firm — nothing else.</td></tr>
<tr><td>Admin — writeups</td><td class="y">Working</td><td>Create, edit, publish, unpublish, delete. Attach a PDF or spreadsheet. Set the access level per writeup. Drafts are invisible to readers.</td></tr>
<tr><td>Admin — view counts</td><td class="y">Working</td><td>Per writeup: all-time opens, opens in the last seven days, and how many distinct signed-in readers.</td></tr>
<tr><td>Admin — members</td><td class="y">Working</td><td>Every account listed; change anyone between Member and Subscriber.</td></tr>
<tr><td>Admin — requests</td><td class="y">Working</td><td>Requests from the public form arrive here; approve or decline. Approving upgrades that person's account, and applies automatically if they sign up later.</td></tr>
<tr><td>Disclaimer and Copyright</td><td class="y">Working</td><td>Full pages, linked in the footer and under every writeup.</td></tr>
<tr><td>Phones and tablets</td><td class="y">Working</td><td>Tested down to 400 pixels wide; no sideways scrolling on any page.</td></tr>
<tr><td>Dark mode</td><td class="y">Working</td><td>Follows the reader's own device setting.</td></tr>
</table>

<h3>Not built yet — deliberately</h3>
<table>
<tr><th>Feature</th><th>Status</th><th>What happens instead</th></tr>
<tr><td>Card payments</td><td class="n">Not built</td><td>No checkout on the site. A reader requests Subscriber access; you take payment however you like (invoice, transfer, a payment link) and then switch them to Subscriber in the admin. Automated checkout can be added later.</td></tr>
<tr><td>Email alerts to readers</td><td class="n">Not built</td><td>New writeups are not emailed out. The Member tier currently promises this in the copy — either build it before launch or soften that line.</td></tr>
<tr><td>Search engine listing</td><td class="p">Pending</td><td>Works once the domain is live; nothing to do.</td></tr>
<tr><td>Watermarked downloads</td><td class="n">Not built</td><td>Attached documents are private to entitled readers but carry no per-reader watermark.</td></tr>
<tr><td>Comments, forums, reader profiles</td><td class="n">Not built</td><td>Out of scope.</td></tr>
</table>

<h3>Blocked on something outside the website</h3>
<table>
<tr><th>Item</th><th>Status</th><th>What is needed</th></tr>
<tr><td>prajitresearch.com</td><td class="p">Blocked</td><td>Four A records and one CNAME at GoDaddy. Needs the account verification code from Abhijit. Until then the site is reachable only at its GitHub address.</td></tr>
<tr><td>Sign-in emails at volume</td><td class="p">Blocked</td><td>Supabase's built-in sender is limited to a few messages an hour — fine for testing, not for readers. Connect a free sender (Resend or Brevo) under Authentication → SMTP Settings. Ten minutes.</td></tr>
<tr><td>Real writeups</td><td class="p">Waiting</td><td>The six in the library are samples written to demonstrate the design. They describe no real company. Replace them before launch.</td></tr>
<tr><td>Four statistics, founder bio, pricing</td><td class="p">Waiting</td><td>Placeholders. See section 04 for the exact wording to replace.</td></tr>
<tr><td>Legal review</td><td class="p">Waiting</td><td>Counsel should read the Disclaimer and Copyright pages once. One question worth asking: where are paying readers located, and does selling research there trigger any registration requirement.</td></tr>
</table>
</div>

<div class="sec">
<h2>03 · Site map</h2>
<p>The menu at the top of every page:</p>
<table>
<tr><th>Menu item</th><th>Goes to</th><th>What is there</th></tr>
<tr><td><b>Prajit Research</b> (top left)</td><td>Home</td><td>The landing page.</td></tr>
<tr><td><b>Research</b></td><td>The library</td><td>Every published writeup, with a type filter and a search box.</td></tr>
<tr><td><b>Philosophy</b></td><td>Home, Philosophy section</td><td>Three beliefs: primary sources only; every thesis has a kill condition; time is the edge.</td></tr>
<tr><td><b>Process</b></td><td>Home, Process section</td><td>The six numbered steps, each with the output it produces.</td></tr>
<tr><td><b>About</b></td><td>Home, About section</td><td>Independence statement and founder biography.</td></tr>
<tr><td><b>Sign in</b> / <b>Account</b></td><td>Sign-in page, or the account page once signed in</td><td>Email-link sign-in. Once signed in the same menu item reads "Account".</td></tr>
<tr><td><b>Admin</b></td><td>The research desk</td><td>Only appears for the two admin accounts. Four tabs: Overview, Writeups, Members, Requests.</td></tr>
<tr><td><b>Request access</b> (gold button)</td><td>The request form</td><td>Name, email, firm, which level, and a free-text note.</td></tr>
</table>
<p>In the footer of every page: Research · Philosophy · Process · About · Request access · Sign in · Disclaimer · Copyright, plus the standing legal note and the copyright line.</p>
<div class="card">
<p class="lbl">Footer legal note</p>
<p>${esc(D.footer.note)}</p>
<p class="lbl" style="margin-top:3mm">Copyright line</p>
<p>${esc(D.footer.copy)}</p>
</div>
</div>

<div class="sec">
<h2>04 · The public pages, word for word</h2>
<p>Everything below is the actual text on the site, captured from the live pages. Square-bracket markers show buttons and form fields.</p>

<div class="pagebox"><p class="ttl">Home — the landing page</p>${blocks(page("Home").blocks)}</div>
<div class="pagebox"><p class="ttl">Research — the library</p>${blocks(page("Research library").blocks)}</div>
<div class="pagebox"><p class="ttl">Sign in</p>${blocks(page("Sign in").blocks)}</div>
<div class="pagebox"><p class="ttl">Request access</p>${blocks(page("Request access").blocks)}</div>
<div class="pagebox"><p class="ttl">What a guest sees on a gated writeup</p>${blocks(D.gateGuest)}</div>
<div class="pagebox"><p class="ttl">Account page (signed in)</p>${blocks(D.account)}</div>
<div class="pagebox"><p class="ttl">Disclaimer</p>${blocks(page("Disclaimer").blocks)}</div>
<div class="pagebox"><p class="ttl">Copyright and terms of use</p>${blocks(page("Copyright").blocks)}</div>
</div>

<div class="sec">
<h2>05 · The six sample writeups</h2>
<div class="note"><b>These are samples.</b> They were written to show how the design handles a real note — the reasoning is generic and no real company is named or described. Replace all six with Prajit Research's own work before launch. Deleting one takes two clicks in the admin.</div>
${D.notes.map(n => `<div class="pagebox"><p class="ttl">${esc(NOTE_TITLES[n.slug] || n.slug)}</p><p class="addr">Web address: /#/note/${esc(n.slug)}</p>${blocks(n.blocks, { drop: ["← Library", "Disclosure:"] })}<p class="cite" style="margin-top:3mm">Every writeup page ends with: "Disclosure: Prajit Research and its principals may hold positions in securities discussed and may trade them without notice. This writeup is not investment advice."</p></div>`).join("\n")}
</div>

<div class="sec">
<h2>06 · The admin area</h2>
<p>Reachable only by the two admin accounts, at the address ending <span class="mono">/#/admin</span>. Anyone else who types that address is asked to sign in with an admin account.</p>
${D.admin.map(a => `<div class="pagebox"><p class="ttl">${esc(a.name)}</p>${blocks(a.blocks, { drop: ["Viewing as"] })}</div>`).join("\n")}
<div class="note"><b>Note on the numbers shown above.</b> The view counts and member names in this document come from the demonstration data, not from real readers. On the live site these tables start empty and fill as people visit.</div>
</div>

<div class="sec">
<h2>07 · What is left to do</h2>
<table>
<tr><th>#</th><th>Task</th><th>Who</th><th>Time</th></tr>
<tr><td>1</td><td>Get the GoDaddy verification code and add the DNS records (four A records for @, one CNAME for www pointing to rujutaasanikar.github.io)</td><td>Rahul + Abhijit</td><td>10 min</td></tr>
<tr><td>2</td><td>On GitHub: Settings → Pages → wait for "DNS check successful", then tick Enforce HTTPS</td><td>Rahul</td><td>5 min + waiting</td></tr>
<tr><td>3</td><td>Connect a free email sender in Supabase (Authentication → SMTP Settings)</td><td>Rahul</td><td>10 min</td></tr>
<tr><td>4</td><td>Sign in once with an admin email to confirm the admin area opens</td><td>Both</td><td>2 min</td></tr>
<tr><td>5</td><td>Delete the six sample writeups; add the real ones</td><td>Whoever writes them</td><td>—</td></tr>
<tr><td>6</td><td>Send the four statistics, the founder biography and the subscriber price</td><td>Rahul</td><td>—</td></tr>
<tr><td>7</td><td>Counsel reads the Disclaimer and Copyright pages</td><td>Counsel</td><td>—</td></tr>
<tr><td>8</td><td>Invite Abhijit to the Supabase project and the GitHub repository</td><td>Rahul</td><td>5 min</td></tr>
<tr><td>9</td><td>Decide whether to build email alerts for new writeups, or soften that promise in the Member tier</td><td>Both</td><td>—</td></tr>
</table>
<div class="card"><p>Nothing in this list costs money. The Supabase and GitHub plans in use are free, and the email senders suggested have free tiers that cover a small readership.</p></div>
</div>

</body></html>`;

writeFileSync("/var/tmp/ref.html", html);
const b = await chromium.launch({ executablePath: "/opt/pw-browsers/chromium", args: ["--no-sandbox"] });
const p = await b.newPage();
await p.goto("file:///var/tmp/ref.html", { waitUntil: "load" });
await p.waitForTimeout(500);
await p.pdf({ path: "/mnt/user-data/outputs/Prajit-Research-Website-Reference.pdf", format: "A4", printBackground: true,
  displayHeaderFooter: true, headerTemplate: "<div></div>",
  footerTemplate: `<div style="width:100%;font-family:Georgia,serif;font-size:7.5pt;color:#877F6E;padding:0 18mm;display:flex;justify-content:space-between;"><span>Prajit Research — Website Reference</span><span class="pageNumber"></span></div>`,
  margin: { top: "20mm", bottom: "18mm", left: "18mm", right: "18mm" } });
await b.close();
console.log("pdf written");
