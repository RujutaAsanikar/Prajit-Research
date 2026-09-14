/* Prajit Research — site application
   Runs in two modes:
   - DEMO  (no Supabase config): sample data in memory, persona switcher, nothing saved.
   - LIVE  (Supabase configured): real sign-in, admin, storage, view counts; access enforced by the database.
*/
(() => {
"use strict";

const CFG = Object.assign({ brand: "Prajit Research", established: "2026", contactEmail: "" }, window.PRAJIT_CONFIG || {});

/* =====================================================================
   SITE COPY — edit freely
   ===================================================================== */
const SITE = {
  hero: {
    eyebrow: "Independent equity research",
    titleHtml: 'Patient research for impatient <em class="accent">markets.</em>',
    lede: "Long-form equity writeups — initiations, updates, and post-mortems — built from primary filings, management transcripts, and our own models. No thesis is published without the condition that would prove it wrong.",
    quote: "Most of what moves a stock this week is noise. Most of what moves it over five years is in the footnotes.",
    quoteCite: "Prajit Research, founding note"
  },
  stats: [
    { value: "24", label: "Writeups published" },
    { value: "18", label: "Names under coverage" },
    { value: "3–5 yr", label: "Typical holding horizon" },
    { value: CFG.established, label: "Established" }
  ],
  philosophy: {
    lede: "We read what the market has stopped reading. The edge is not information — it is the willingness to sit with a filing longer than anyone else, and the discipline to write down, in advance, what would make us sell.",
    tenets: [
      { title: "Primary sources only", body: "Every number in a writeup traces to a filing, a transcript, or a model we built. We do not cite sell-side targets, and we do not repeat consensus we have not reconstructed." },
      { title: "Every thesis has a kill condition", body: "Before a note is published it carries the specific, observable event that would falsify it. When that event occurs, the note is updated — and the position is exited — whether or not the price has moved." },
      { title: "Time is the edge", body: "We underwrite for three to five years, which lets us own businesses through the quarters in which nobody else wants to. Patience is not a slogan here; it is the entire model." }
    ]
  },
  process: {
    lede: "The same six steps, in the same order, for every name. The sequence is the product.",
    steps: [
      { title: "Screen", body: "A quantitative pass for businesses with durable returns on capital, sensible balance sheets, and an ownership structure that rewards patience. The screen removes names; it never adds conviction.", out: "Output: a shortlist, never a buy" },
      { title: "Read", body: "Ten years of filings, proxies, and transcripts, in order. We are looking for the year management stopped explaining something.", out: "Output: a reading log with page references" },
      { title: "Model", body: "A unit-economics model built from the operating drivers up, not a revenue line extrapolated forward. Scenarios are weighted, and the bear case is written first.", out: "Output: base, bear, bull with probabilities" },
      { title: "Write", body: "The writeup states the thesis in one paragraph, the valuation in one table, and the kill condition in one sentence. If any of the three cannot be written plainly, the note is not ready.", out: "Output: initiation draft" },
      { title: "Publish", body: "Notes go to subscribers first, then members, then — for selected pieces — the public library. Every note carries a disclosure of any position held.", out: "Output: dated, versioned note" },
      { title: "Revisit", body: "Each quarter, and on any kill-condition event, the note is updated. When we were wrong, the post-mortem is published with the same prominence as the original.", out: "Output: update or post-mortem" }
    ]
  },
  about: {
    lede: "Prajit Research is an independent equity research practice. We have no banking relationships, accept no issuer payment, and publish our positions.",
    bio: "[Founder bio — two or three sentences: background, prior firms, credentials, and why this practice exists. Replace this placeholder before launch.]",
    contactLine: "Institutional readers, allocators, and press can reach us through the access form or by email."
  },
  plans: [
    { name: "Guest", price: "Free", sub: "No account", featured: false, items: ["Summaries of every writeup", "Selected notes in full, marked Free", "Disclaimer and methodology pages"], cta: { label: "Browse the library", href: "#/research" } },
    { name: "Member", price: "Free", sub: "Registered account", featured: true, items: ["Everything in Guest", "Notes marked Member in full", "Email alert on every new writeup and update"], cta: { label: "Create a member account", href: "#/signin" } },
    { name: "Subscriber", price: "Pricing on request", sub: "Annual", featured: false, items: ["Everything in Member", "Every initiation and update in full, on publication day", "Downloadable models (xlsx) and the quarterly call"], cta: { label: "Request subscriber access", href: "#/access?plan=subscriber" } }
  ],
  disclaimer: { updated: "September 2026", sections: [
    { h: "Not investment advice", p: "The content of this website, including all research writeups, models, commentary, and communications (collectively, the \"Content\"), is provided for informational and educational purposes only. Nothing on this site constitutes investment, legal, tax, or accounting advice, or a recommendation to buy, sell, or hold any security or financial instrument. You should consult a qualified professional before making any investment decision." },
    { h: "No offer or solicitation", p: "Nothing here is an offer to sell or a solicitation of an offer to buy any security, fund interest, or advisory service in any jurisdiction where such an offer or solicitation would be unlawful." },
    { h: "Positions and conflicts", p: "Prajit Research and its principals may hold long or short positions in securities discussed, and may trade in those securities at any time without notice, including in a manner inconsistent with the Content. Any such position is disclosed within the relevant writeup at the time of publication." },
    { h: "Accuracy and completeness", p: "The Content is based on sources believed to be reliable, including public filings and company disclosures, but no representation or warranty is made as to its accuracy, completeness, or timeliness. Opinions expressed are current as of the publication date and are subject to change without notice." },
    { h: "Forward-looking statements", p: "The Content contains estimates, projections, and forward-looking statements that involve known and unknown risks and uncertainties. Actual results may differ materially. Past performance is not indicative of future results." },
    { h: "No reliance; limitation of liability", p: "You agree that you use the Content at your own risk and that Prajit Research shall not be liable for any loss or damage, direct or indirect, arising from reliance on the Content. Access to any part of this site is conditioned on acceptance of these terms." },
    { h: "Jurisdiction", p: "The Content is directed at persons in jurisdictions where its distribution is lawful. It is your responsibility to ensure that accessing the Content complies with the laws applicable to you." }
  ]},
  copyright: { updated: "September 2026", sections: [
    { h: "Ownership", p: "All Content on this site, including text, tables, charts, models, and the selection and arrangement thereof, is the property of Prajit Research and is protected by copyright and other intellectual-property laws." },
    { h: "Permitted use", p: "Guests, members, and subscribers are granted a limited, non-exclusive, non-transferable licence to view the Content for personal, non-commercial use. Subscriber downloads are licensed to the named subscriber only." },
    { h: "Restrictions", p: "You may not reproduce, redistribute, republish, sell, or create derivative works from the Content, in whole or in part, without prior written permission. Sharing account access or forwarding gated Content is a breach of these terms and grounds for termination of access." },
    { h: "Quotation and attribution", p: "Brief quotations for commentary, criticism, or news reporting are permitted with clear attribution to Prajit Research and a link to the original writeup." },
    { h: "Trademarks", p: "\"Prajit Research\" and the associated marks are trademarks of Prajit Research. Third-party company names and marks referenced in the Content belong to their respective owners and are used for identification only." },
    { h: "Requests", p: "Permission requests, takedown notices, and licensing enquiries should be sent to the contact address on the access page." }
  ]}
};

/* Sample writeups: illustrative only — no claims about real companies. Used in demo mode. */
const SAMPLE_NOTES = [
  { slug: "kill-conditions", type: "Framework", sector: "Methodology", published_at: "2026-09-02", read_time: "6 min", access: "free", status: "published", version: 2,
    title: "Our kill conditions: how every thesis gets a sell rule before a buy",
    summary: "The one-sentence test each note must pass before publication, and why it matters more than the price target.",
    body: "A price target tells you what we hope. A kill condition tells you what we will do. Every writeup we publish carries one sentence — observable, dated where possible, and independent of the share price — that describes the event that would prove the thesis wrong.\n\nThe discipline sounds obvious. It is rarely practised, because it forces the analyst to argue against the note before it is written. That is exactly the point: the kill condition is the bear case reduced to something we can check each quarter without re-litigating the whole thesis.\n\n## What a good kill condition looks like\n\nIn practice, a good kill condition is specific to the business model.\n\n- For a distributor: two consecutive quarters of gross-margin compression while volume grows.\n- For a bank: a deposit beta above the level the model assumed at the top of the cycle.\n- Never: \"the stock falls 20%\".\n\nWhen a kill condition triggers, two things happen on the same day: the note is updated, and any position is exited. The post-mortem is then published with the same prominence as the initiation. Readers should be able to judge us on our misses as easily as on our hits." },
  { slug: "specialty-insurance-post-mortem", type: "Post-mortem", sector: "Financials", published_at: "2026-08-19", read_time: "9 min", access: "free", status: "published", version: 1,
    title: "What we got wrong on specialty insurance in 2025",
    summary: "A pricing-cycle call that was right on direction and wrong on duration — and what it changed in our model.",
    body: "We initiated on the specialty lines in early 2025 on the view that hard-market pricing had a longer tail than the market assumed. The direction was right. The duration was not, and the kill condition — a second consecutive quarter of rate decreases in the core lines — triggered in the third quarter.\n\nThe error was one of extrapolation. Our model held retention flat while pricing softened, which is the one combination the cycle rarely delivers. When capacity returned, both moved at once.\n\nThe fix was structural rather than cosmetic: the model now links retention to rate change with a lag, and the bear case is required to include a capacity-return scenario for any name whose thesis rests on pricing. It is a more pessimistic model, and a better one.\n\nWe remain interested in the space at a different point in the cycle. The note stays in the library as published, with this post-mortem attached, because the original reasoning is the only honest record of what we believed and why." },
  { slug: "industrial-distribution-compounders", type: "Deep dive", sector: "Industrials", published_at: "2026-08-05", read_time: "22 min", access: "member", status: "published", version: 1, file_path: "member/industrial-distribution-compounders.pdf",
    title: "The quiet compounders in industrial distribution",
    summary: "Why route density, not scale, is the moat — and how to tell which distributors actually have it.",
    body: "Industrial distribution is usually described as a scale business. It is not, or at least not primarily. The economics are set by route density: revenue per delivery stop, stops per route, and the gross margin those stops carry. A large distributor with thin density earns less on capital than a regional one with dense routes.\n\nThis matters because scale is visible in the income statement and density is not. To find it, we rebuild the branch footprint from filings and count stops per route where the company discloses enough to do so.\n\n## The three traits\n\nThe names that pass that screen share three traits:\n\n- Private-label penetration above a threshold.\n- A branch-manager incentive tied to local return on assets rather than revenue.\n- A working-capital cycle that shortens as the branch matures.\n\nEach is disclosed somewhere; none is headlined.\n\nValuation follows from the density model rather than from a peer multiple. We show the base, bear, and bull cases for two illustrative footprints, and the kill condition for each: a sustained decline in gross profit per stop while the branch count grows." },
  { slug: "regional-banks-deposit-franchises", type: "Initiation", sector: "Financials", published_at: "2026-07-22", read_time: "31 min", access: "subscriber", status: "published", version: 3, file_path: "subscriber/regional-banks-deposit-franchises.pdf",
    title: "Regional banks after the rate cycle: deposit franchises that still earn their keep",
    summary: "Separating the banks whose low-cost deposits survived the cycle from those that merely reported them.",
    body: "Every regional bank claims a low-cost deposit franchise. The cycle just ended was the first real test in fifteen years, and the results are now in the call reports. Our initiation ranks the franchises by the deposit beta they actually realised, not the one they guided to.\n\nThe gap between guided and realised beta is the single most useful number in the sector today, because it reveals how much of the \"core\" deposit base was rate-insensitive in fact rather than in management's description.\n\nFrom there the note rebuilds net interest income on a reset funding cost, stresses the securities book at two rate paths, and sets a kill condition per name tied to non-interest-bearing deposit mix rather than to earnings.\n\nThe full initiation includes the model, the ranking table, and the disclosure of positions held." },
  { slug: "hospital-outsourcing-margin-recovery", type: "Initiation", sector: "Healthcare", published_at: "2026-07-01", read_time: "27 min", access: "member", status: "published", version: 1,
    title: "Hospital outsourcing: margin recovery is a volume story",
    summary: "Labour cost gets the headlines; contract density and case mix decide the margin.",
    body: "The consensus view on hospital outsourcing is that margins recover when contract labour normalises. That is half right. Labour is the largest cost, but the margin is decided by contract density — how many service lines the outsourcer runs inside a single facility — and by case mix.\n\nDensity is what turns a fixed on-site cost into a variable one. A single-line contract carries the full overhead of a site; a third line at the same site carries almost none.\n\nThe note sets out how to read density from segment disclosures, why the incumbents' reported \"same-site growth\" understates it, and what a normalised margin looks like once density is modelled explicitly.\n\nKill condition: two consecutive quarters in which new-contract wins are majority single-line, which would indicate the density thesis is not being executed." },
  { slug: "memory-pricing-discipline", type: "Update", sector: "Semiconductors", published_at: "2026-06-12", read_time: "11 min", access: "subscriber", status: "published", version: 2,
    title: "Memory pricing and the discipline nobody expects to last",
    summary: "An update to the initiation: the supply response is slower than our bear case assumed, and the kill condition has not triggered.",
    body: "This update revisits the memory initiation against two quarters of data. The central question was whether capital discipline would hold once pricing recovered; the market assumed it would not, and our bear case agreed.\n\nSo far the supply response has been slower than either expected. Capacity announcements have lagged pricing by more than a full cycle's worth of historical precedent.\n\nWe do not raise the thesis on the strength of two quarters. We do note that the kill condition — a specific capacity-addition threshold — has not triggered, and we update the scenario weights accordingly.\n\nPositions held are disclosed in full below. The model is updated in the subscriber download." },
  { slug: "draft-example-consumer-staples", type: "Initiation", sector: "Consumer", published_at: null, read_time: "18 min", access: "member", status: "draft", version: 1,
    title: "Private label and the pricing umbrella in packaged food",
    summary: "Draft — not yet published. Where branded pricing power survives a private-label share gain, and where it does not.",
    body: "Draft in progress." }
];

/* =====================================================================
   UTILITIES
   ===================================================================== */
const RANK = { free: 0, member: 1, subscriber: 2 };
const ACCESS_LABEL = { free: "Free", member: "Member", subscriber: "Subscriber" };
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const fmtDate = iso => { if (!iso) return "—"; const d = new Date(String(iso).slice(0, 10) + "T00:00:00"); return isNaN(d) ? "—" : d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); };
const fmtDateTime = iso => { const d = new Date(iso); return isNaN(d) ? "—" : d.toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" }); };
const slugify = s => String(s).toLowerCase().normalize("NFKD").replace(/[^\w\s-]/g, "").trim().replace(/[\s_]+/g, "-").replace(/-+/g, "-").slice(0, 80);
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : "id-" + Math.random().toString(36).slice(2));
const todayISO = () => new Date().toISOString().slice(0, 10);
const rankOf = profile => profile ? (profile.is_admin ? 99 : RANK[profile.tier] ?? 1) : 0;
const readTime = text => Math.max(1, Math.round(String(text || "").split(/\s+/).length / 220)) + " min";

/* Markdown-lite: blank-line paragraphs, "## " headings, "- " bullet lists. Everything escaped. */
function renderBody(text){
  const blocks = String(text || "").replace(/\r/g, "").split(/\n{2,}/);
  return blocks.map(b => {
    const lines = b.split("\n").filter(l => l.trim() !== "");
    if (!lines.length) return "";
    if (lines.length === 1 && /^##\s+/.test(lines[0])) return `<h3>${esc(lines[0].replace(/^##\s+/, ""))}</h3>`;
    if (lines.every(l => /^-\s+/.test(l))) return `<ul>${lines.map(l => `<li>${esc(l.replace(/^-\s+/, ""))}</li>`).join("")}</ul>`;
    return `<p>${esc(lines.join(" "))}</p>`;
  }).join("");
}

let toastTimer = null;
function toast(msg, ms = 3200){
  let el = document.getElementById("toast");
  if (!el){ el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
  el.textContent = msg; el.hidden = false;
  clearTimeout(toastTimer); toastTimer = setTimeout(() => { el.hidden = true; }, ms);
}

/* =====================================================================
   DEMO STORE — in-memory sample data, persona switcher
   ===================================================================== */
class DemoStore {
  constructor(){
    this.mode = "demo";
    this.notes = SAMPLE_NOTES.map(n => ({ id: uid(), created_at: "2026-06-01T09:00:00Z", updated_at: "2026-09-01T09:00:00Z", file_path: null, ...n }));
    this.bodies = Object.fromEntries(this.notes.map(n => [n.id, n.body]));
    this.notes.forEach(n => delete n.body);
    this.views = [];
    const seed = { "kill-conditions": 412, "specialty-insurance-post-mortem": 297, "industrial-distribution-compounders": 183, "regional-banks-deposit-franchises": 158, "hospital-outsourcing-margin-recovery": 121, "memory-pricing-discipline": 96 };
    this.notes.forEach(n => { const c = seed[n.slug] || 0; for (let i = 0; i < c; i++) this.views.push({ note_id: n.id, viewer_id: i % 3 === 0 ? "m-" + (i % 17) : null, viewed_at: new Date(Date.now() - Math.random() * 45 * 864e5).toISOString() }); });
    this.personas = {
      member: { id: "demo-member", email: "member@example.com", full_name: "Demo Member", firm: "Independent", tier: "member", is_admin: false, created_at: "2026-08-12T10:00:00Z" },
      subscriber: { id: "demo-subscriber", email: "subscriber@example.com", full_name: "Demo Subscriber", firm: "Example Capital", tier: "subscriber", is_admin: false, created_at: "2026-07-30T10:00:00Z" },
      admin: { id: "demo-admin", email: "admin@example.com", full_name: "Prajit (Admin)", firm: "Prajit Research", tier: "subscriber", is_admin: true, created_at: "2026-06-01T10:00:00Z" }
    };
    this.members = [this.personas.admin, this.personas.subscriber, this.personas.member,
      { id: "demo-m4", email: "reader4@example.com", full_name: "A. Reader", firm: "Family office", tier: "member", is_admin: false, created_at: "2026-08-20T10:00:00Z" },
      { id: "demo-m5", email: "reader5@example.com", full_name: "B. Analyst", firm: "", tier: "subscriber", is_admin: false, created_at: "2026-08-28T10:00:00Z" }];
    this.requests = [
      { id: uid(), name: "C. Allocator", email: "allocator@example.com", firm: "Endowment", plan: "subscriber", note: "Financials coverage, quarterly call.", status: "new", created_at: "2026-09-12T15:20:00Z" },
      { id: uid(), name: "D. Reader", email: "dreader@example.com", firm: "", plan: "member", note: "", status: "approved", created_at: "2026-09-10T11:05:00Z" }
    ];
    this.persona = null;
    this.listeners = [];
  }
  get profile(){ return this.persona ? this.personas[this.persona] : null; }
  async getSession(){ return this.profile ? { user: { id: this.profile.id, email: this.profile.email }, profile: this.profile } : null; }
  onAuth(cb){ this.listeners.push(cb); }
  _emit(){ this.listeners.forEach(cb => cb()); }
  setPersona(key){ this.persona = key || null; this._emit(); }
  async signIn(email, meta){ this.personas.member = { ...this.personas.member, email, full_name: meta.full_name || "Demo Member", firm: meta.firm || "" }; this.setPersona("member"); return { demo: true }; }
  async signOut(){ this.setPersona(null); }
  async updateProfile(patch){ if (!this.profile) return; Object.assign(this.personas[this.persona], patch); this._emit(); }
  async listNotes({ all = false } = {}){ const rows = all && this.profile?.is_admin ? this.notes : this.notes.filter(n => n.status === "published"); return rows.slice().sort((a, b) => String(b.published_at || "9999").localeCompare(String(a.published_at || "9999"))); }
  async getNote(slug){ const n = this.notes.find(x => x.slug === slug); if (!n) return null; if (n.status !== "published" && !this.profile?.is_admin) return null; return n; }
  async getBody(note){ return rankOf(this.profile) >= RANK[note.access] ? (this.bodies[note.id] ?? "") : null; }
  async saveNote(note, body){
    const clean = { ...note }; if (!clean.id) delete clean.id;
    let n = clean.id ? this.notes.find(x => x.id === clean.id) : null;
    if (n) { Object.assign(n, clean, { updated_at: new Date().toISOString(), version: (this.bodies[n.id] !== body ? (n.version || 1) + 1 : n.version) }); }
    else {
      if (this.notes.some(x => x.slug === clean.slug)) throw new Error("A writeup with this slug already exists.");
      n = { created_at: new Date().toISOString(), updated_at: new Date().toISOString(), version: 1, file_path: null, ...clean, id: uid() }; this.notes.push(n);
    }
    this.bodies[n.id] = body; return n;
  }
  async deleteNote(id){ this.notes = this.notes.filter(n => n.id !== id); delete this.bodies[id]; this.views = this.views.filter(v => v.note_id !== id); }
  async recordView(slug){ const n = this.notes.find(x => x.slug === slug); if (n) this.views.push({ note_id: n.id, viewer_id: this.profile?.id || null, viewed_at: new Date().toISOString() }); }
  async stats(){
    const cutoff = Date.now() - 7 * 864e5;
    return this.notes.map(n => { const v = this.views.filter(x => x.note_id === n.id); return { id: n.id, slug: n.slug, title: n.title, status: n.status, views_total: v.length, views_7d: v.filter(x => new Date(x.viewed_at).getTime() > cutoff).length, signed_in_viewers: new Set(v.filter(x => x.viewer_id).map(x => x.viewer_id)).size }; });
  }
  async createRequest(r){ this.requests.unshift({ id: uid(), status: "new", created_at: new Date().toISOString(), ...r }); }
  async listRequests(){ return this.requests.slice(); }
  async updateRequest(id, status){ const r = this.requests.find(x => x.id === id); if (!r) return; r.status = status; if (status === "approved"){ const m = this.members.find(m => m.email.toLowerCase() === r.email.toLowerCase()); if (m && RANK[r.plan] > RANK[m.tier]) m.tier = r.plan; } }
  async listMembers(){ return this.members.slice().sort((a, b) => b.created_at.localeCompare(a.created_at)); }
  async setTier(id, tier){ const m = this.members.find(x => x.id === id); if (m) m.tier = tier; }
  async uploadFile(access, slug, file){ return `${access}/${slug}.${(file.name.split(".").pop() || "pdf").toLowerCase()}`; }
  async fileUrl(path){ return null; }
}

/* =====================================================================
   LIVE STORE — Supabase
   ===================================================================== */
class LiveStore {
  constructor(client){ this.mode = "live"; this.sb = client; this.session = null; this.profileCache = null; this.listeners = []; }
  async init(){
    const { data } = await this.sb.auth.getSession();
    this.session = data.session || null;
    this.sb.auth.onAuthStateChange((_e, session) => { this.session = session || null; this.profileCache = null; this.listeners.forEach(cb => cb()); });
  }
  onAuth(cb){ this.listeners.push(cb); }
  get user(){ return this.session?.user || null; }
  async getSession(){
    if (!this.user) return null;
    if (!this.profileCache){
      const { data } = await this.sb.from("profiles").select("*").eq("id", this.user.id).maybeSingle();
      this.profileCache = data || { id: this.user.id, email: this.user.email, full_name: "", tier: "member", is_admin: false };
    }
    return { user: this.user, profile: this.profileCache };
  }
  get profile(){ return this.profileCache; }
  async signIn(email, meta){
    const redirect = location.origin + location.pathname;
    const { error } = await this.sb.auth.signInWithOtp({ email, options: { data: { full_name: meta.full_name || "", firm: meta.firm || "" }, emailRedirectTo: redirect } });
    if (error) throw error; return { sent: true };
  }
  async signOut(){ await this.sb.auth.signOut(); }
  async updateProfile(patch){ const { error } = await this.sb.from("profiles").update(patch).eq("id", this.user.id); if (error) throw error; this.profileCache = null; }
  async listNotes({ all = false } = {}){
    let q = this.sb.from("notes").select("*").order("published_at", { ascending: false, nullsFirst: true });
    if (!all) q = q.eq("status", "published");
    const { data, error } = await q; if (error) throw error; return data || [];
  }
  async getNote(slug){ const { data, error } = await this.sb.from("notes").select("*").eq("slug", slug).maybeSingle(); if (error) throw error; return data; }
  async getBody(note){ const { data, error } = await this.sb.from("note_bodies").select("body").eq("note_id", note.id).maybeSingle(); if (error) throw error; return data ? data.body : null; }
  async saveNote(note, body){
    const row = { ...note }; delete row.body;
    const { data, error } = await this.sb.from("notes").upsert(row, { onConflict: "id" }).select().single(); if (error) throw error;
    const { error: e2 } = await this.sb.from("note_bodies").upsert({ note_id: data.id, body }, { onConflict: "note_id" }); if (e2) throw e2;
    return data;
  }
  async deleteNote(id){ const { error } = await this.sb.from("notes").delete().eq("id", id); if (error) throw error; }
  async recordView(slug){ try { await this.sb.rpc("record_view", { p_slug: slug }); } catch (_) {} }
  async stats(){ const { data, error } = await this.sb.from("note_stats").select("*"); if (error) throw error; return data || []; }
  async createRequest(r){ const { error } = await this.sb.from("access_requests").insert(r); if (error) throw error; }
  async listRequests(){ const { data, error } = await this.sb.from("access_requests").select("*").order("created_at", { ascending: false }); if (error) throw error; return data || []; }
  async updateRequest(id, status){ const { error } = await this.sb.rpc("review_request", { p_id: id, p_status: status }); if (error) throw error; }
  async listMembers(){ const { data, error } = await this.sb.from("profiles").select("*").order("created_at", { ascending: false }); if (error) throw error; return data || []; }
  async setTier(id, tier){ const { error } = await this.sb.from("profiles").update({ tier }).eq("id", id); if (error) throw error; }
  async uploadFile(access, slug, file){
    const ext = (file.name.split(".").pop() || "pdf").toLowerCase();
    const path = `${access}/${slug}.${ext}`;
    const { error } = await this.sb.storage.from("documents").upload(path, file, { upsert: true, contentType: file.type || undefined }); if (error) throw error;
    return path;
  }
  async moveFile(from, to){ const { error } = await this.sb.storage.from("documents").move(from, to); if (error) throw error; }
  async fileUrl(path){ const { data, error } = await this.sb.storage.from("documents").createSignedUrl(path, 120); if (error) throw error; return data.signedUrl; }
}

/* =====================================================================
   APP STATE
   ===================================================================== */
let store = null;
let auth = null;             // { user, profile } | null
let filter = "All", search = "";
const app = document.getElementById("app");

async function boot(){
  const live = CFG.supabaseUrl && CFG.supabaseAnonKey && window.supabase && window.supabase.createClient;
  if (live){
    try { store = new LiveStore(window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey)); await store.init(); }
    catch (e) { console.error(e); store = new DemoStore(); }
  } else store = new DemoStore();
  store.onAuth(async () => { auth = await store.getSession(); renderChrome(); render(); });
  auth = await store.getSession();
  renderChrome();
  document.getElementById("menuBtn").addEventListener("click", e => { const nav = document.getElementById("nav"), open = nav.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", String(open)); });
  document.getElementById("copyLine").textContent = `© ${CFG.established}–${new Date().getFullYear()} ${CFG.brand}`;
  window.addEventListener("hashchange", render);
  render();
}

function renderChrome(){
  const navAuth = document.getElementById("navAuth"), navAdmin = document.getElementById("navAdmin");
  navAuth.textContent = auth ? "Account" : "Sign in";
  navAuth.setAttribute("href", auth ? "#/account" : "#/signin");
  navAdmin.hidden = !(auth && auth.profile.is_admin);
  const bar = document.getElementById("demoBar");
  if (store.mode === "demo"){
    const p = store.persona || "";
    bar.hidden = false;
    bar.innerHTML = `<div class="demo"><b>Demo mode</b><span>Sample data — nothing is saved. Try the site as:</span>
      <div class="personas">${[["", "Guest"], ["member", "Member"], ["subscriber", "Subscriber"], ["admin", "Admin"]].map(([k, l]) => `<button type="button" data-persona="${k}" aria-pressed="${p === k}">${l}</button>`).join("")}</div></div>`;
    bar.querySelectorAll("[data-persona]").forEach(b => b.addEventListener("click", () => { store.setPersona(b.dataset.persona); toast(`Now viewing as ${b.textContent}`); }));
  } else bar.hidden = true;
}

function route(){
  const raw = location.hash.replace(/^#\/?/, "");
  if (/^(access_token|error|code)=/.test(raw)) return { view: "home", arg: "", arg2: "", q: new URLSearchParams() };
  const [path, query] = raw.split("?");
  const parts = path.split("/").filter(Boolean);
  return { view: parts[0] || "home", arg: parts[1] || "", arg2: parts[2] || "", q: new URLSearchParams(query || "") };
}

function setNav(view){
  document.querySelectorAll("[data-nav]").forEach(a => {
    const on = a.dataset.nav === view || (view === "account" && a.dataset.nav === "signin");
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  document.getElementById("nav").classList.remove("open");
  document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
}

/* =====================================================================
   SHARED FRAGMENTS
   ===================================================================== */
const accessPill = (a, status) => status === "draft" ? `<span class="access draft">Draft</span>` : `<span class="access ${a}">${ACCESS_LABEL[a] || a}</span>`;

function ledgerRows(notes){
  if (!notes.length) return `<p class="empty">No writeups match.</p>`;
  return notes.map(n => `
    <a class="row" href="#/note/${esc(n.slug)}">
      <div class="date">${fmtDate(n.published_at)}</div>
      <div><div class="row-title">${esc(n.title)}</div><p class="sum">${esc(n.summary)}</p></div>
      <div class="kind">${esc(n.type)}<small>${esc(n.sector)} · ${esc(n.read_time)}</small></div>
      <div>${accessPill(n.access, n.status)}</div>
      <div class="arrow">→</div>
    </a>`).join("");
}

const pageHead = (eyebrow, title, lede) => `<section class="page-head"><p class="eyebrow">${esc(eyebrow)}</p><h2>${esc(title)}</h2>${lede ? `<p class="lede">${esc(lede)}</p>` : ""}</section>`;
const loading = () => `<section class="page-body"><p class="tiny">Loading…</p></section>`;

/* =====================================================================
   PUBLIC VIEWS
   ===================================================================== */
async function homeView(){
  const h = SITE.hero;
  const latest = (await store.listNotes()).slice(0, 4);
  return `
  <section class="hero">
    <div class="hero-main">
      <p class="eyebrow">${esc(h.eyebrow)}</p>
      <h1 class="hero-title">${h.titleHtml}</h1>
      <p class="lede">${esc(h.lede)}</p>
      <div class="cta-row"><a class="btn" href="#/access">Request access</a><a class="btn link" href="#/research">Read the library →</a></div>
    </div>
    <div class="hero-side"><div class="est">Est. ${esc(CFG.established)}</div><blockquote class="hero-quote">${esc(h.quote)}<cite>${esc(h.quoteCite)}</cite></blockquote></div>
  </section>
  <div class="stats">${SITE.stats.map(s => `<div class="stat"><b>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div>
  <section class="section" id="philosophy">
    <div class="section-rail"><p class="eyebrow">Philosophy</p><h2>What we believe the edge is</h2></div>
    <div class="section-body"><p class="lede">${esc(SITE.philosophy.lede)}</p>
      <div class="tenets">${SITE.philosophy.tenets.map(t => `<div class="tenet"><h3>${esc(t.title)}</h3><p>${esc(t.body)}</p></div>`).join("")}</div></div>
  </section>
  <section class="section" id="process">
    <div class="section-rail"><p class="eyebrow">Process</p><h2>Six steps, always in order</h2></div>
    <div class="section-body"><p class="lede">${esc(SITE.process.lede)}</p>
      <ol class="steps">${SITE.process.steps.map((s, i) => `<li class="step"><div class="n">${String(i + 1).padStart(2, "0")}</div><div class="t"><h3>${esc(s.title)}</h3><p>${esc(s.body)}</p><div class="out">${esc(s.out)}</div></div></li>`).join("")}</ol></div>
  </section>
  <section class="section" id="research">
    <div class="section-rail"><p class="eyebrow">Research</p><h2>Latest writeups</h2><a class="btn link" href="#/research">Full library →</a></div>
    <div class="section-body"><div class="ledger">${ledgerRows(latest)}</div></div>
  </section>
  <section class="section" id="plans">
    <div class="section-rail"><p class="eyebrow">Access</p><h2>Three ways to read</h2></div>
    <div class="section-body"><div class="plans">${SITE.plans.map(p => `
      <div class="plan${p.featured ? " featured" : ""}"><p class="eyebrow">${esc(p.name)}</p><div class="price">${esc(p.price)}<small>${esc(p.sub)}</small></div>
        <ul>${p.items.map(i => `<li>${esc(i)}</li>`).join("")}</ul><a class="btn ${p.featured ? "" : "ghost"}" href="${p.cta.href}">${esc(p.cta.label)}</a></div>`).join("")}</div></div>
  </section>
  <section class="section" id="about">
    <div class="section-rail"><p class="eyebrow">About</p><h2>Independent, by design</h2></div>
    <div class="section-body"><p class="lede">${esc(SITE.about.lede)}</p><div class="prose"><p>${esc(SITE.about.bio)}</p><p>${esc(SITE.about.contactLine)}</p></div><div><a class="btn" href="#/access">Request access</a></div></div>
  </section>`;
}

async function researchView(){
  const all = await store.listNotes();
  const types = ["All", ...new Set(all.map(n => n.type))];
  const s = search.trim().toLowerCase();
  const notes = all.filter(n => (filter === "All" || n.type === filter) && (!s || [n.title, n.summary, n.sector, n.type].join(" ").toLowerCase().includes(s)));
  return `
  ${pageHead("Research library", "Every writeup, dated and versioned", "Summaries are open to everyone. Full notes open according to their access level — Free, Member, or Subscriber.")}
  <section class="page-body">
    <div class="ledger-head">
      <div class="filters" role="group" aria-label="Filter by type">${types.map(t => `<button class="chip" type="button" data-filter="${esc(t)}" aria-pressed="${t === filter}">${esc(t)}</button>`).join("")}</div>
      <input class="search" id="searchBox" type="search" placeholder="Search titles, sectors…" value="${esc(search)}" aria-label="Search writeups">
    </div>
    <div class="ledger">${ledgerRows(notes)}</div>
  </section>`;
}

async function noteView(slug){
  const n = await store.getNote(slug);
  if (!n) return `<section class="page-body" style="padding-top:80px"><p class="eyebrow">Not found</p><h2>That writeup isn't in the library.</h2><p><a class="btn link" href="#/research">Back to the library →</a></p></section>`;
  if (n.status === "published") store.recordView(slug);
  const body = await store.getBody(n);
  const entitled = body !== null;
  const needs = n.access;
  let gate = "";
  if (!entitled){
    const signedIn = !!auth;
    const headline = needs === "member" ? "The rest of this writeup is for members." : "The rest of this writeup is for subscribers.";
    const copy = needs === "member"
      ? (signedIn ? "Your account does not have member access yet." : "Member accounts are free. Sign in with your email and the full note opens immediately.")
      : (signedIn ? "Subscriber access includes every initiation and update on publication day, the models, and the quarterly call. Request it and we will reply with pricing." : "Subscriber access includes every initiation and update on publication day, the models, and the quarterly call.");
    const cta = needs === "member" && !signedIn ? `<a class="btn" href="#/signin">Sign in or create an account</a>` : `<a class="btn" href="#/access?plan=${needs}">Request ${needs} access</a>`;
    gate = `<div class="gate"><p class="eyebrow">${ACCESS_LABEL[needs]} access</p><h3>${headline}</h3><p>${copy}</p><div class="cta-row">${cta}${!signedIn && needs === "subscriber" ? `<a class="btn link" href="#/signin">Already a subscriber? Sign in →</a>` : ""}</div></div>`;
  }
  const download = entitled && n.file_path ? `<div class="download"><p class="eyebrow bare">Attached document</p><p class="small muted">${esc(n.file_path.split("/").pop())}</p><div><button class="btn ghost sm" type="button" id="dlBtn">Download</button></div></div>` : "";
  const preview = entitled ? renderBody(body) : `<p>${esc(n.summary)}</p>`;
  return `
  <a class="back" href="#/research">← Library</a>
  <section class="note-head">
    <p class="eyebrow">${esc(n.type)} · ${esc(n.sector)}${n.status === "draft" ? " · Draft (only admins can see this)" : ""}</p>
    <h1 class="note-title">${esc(n.title)}</h1>
    <p class="lede">${esc(n.summary)}</p>
    <dl class="meta">
      <div><dt>Published</dt><dd>${fmtDate(n.published_at)}</dd></div>
      <div><dt>Sector</dt><dd>${esc(n.sector)}</dd></div>
      <div><dt>Type</dt><dd>${esc(n.type)}</dd></div>
      <div><dt>Read time</dt><dd>${esc(n.read_time)}</dd></div>
      <div><dt>Version</dt><dd>v${esc(n.version || 1)}</dd></div>
      <div><dt>Access</dt><dd>${accessPill(n.access, n.status)}</dd></div>
    </dl>
  </section>
  <section class="note-body">
    <div class="section-rail"><p class="eyebrow">Writeup</p>${auth ? `<p class="small muted">Signed in as ${esc(auth.profile.full_name || auth.user.email)}</p>` : `<p class="small muted">Reading as a guest</p>`}</div>
    <div>
      <div class="prose">${preview}</div>
      ${gate}${download}
      <p class="disclosure">Disclosure: Prajit Research and its principals may hold positions in securities discussed and may trade them without notice. This writeup is not investment advice. See the <a href="#/disclaimer">Disclaimer</a> and <a href="#/copyright">Copyright</a> terms.</p>
    </div>
  </section>`;
}

function accessView(q){
  const plan = ["member", "subscriber"].includes(q.get("plan")) ? q.get("plan") : "member";
  return `
  ${pageHead("Request access", "Tell us who you are and what you read", "Member accounts are free — you can also create one instantly on the sign-in page. Subscriber requests receive pricing and a sample note by reply.")}
  <section class="split">
    <div class="section-rail"><p class="note-box">We do not sell or share reader information. Your request goes only to the research desk.</p></div>
    <form class="form" id="accessForm" novalidate>
      <div class="two">
        <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" autocomplete="name" placeholder="Full name" required value="${esc(auth?.profile.full_name || "")}"></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" placeholder="you@firm.com" required value="${esc(auth?.user.email || "")}"></div>
      </div>
      <div class="two">
        <div class="field"><label for="f-firm">Firm (optional)</label><input id="f-firm" name="firm" type="text" autocomplete="organization" placeholder="Fund, family office, or independent" value="${esc(auth?.profile.firm || "")}"></div>
        <div class="field"><label for="f-plan">Access requested</label><select id="f-plan" name="plan"><option value="member" ${plan === "member" ? "selected" : ""}>Member — free account</option><option value="subscriber" ${plan === "subscriber" ? "selected" : ""}>Subscriber — full library</option></select></div>
      </div>
      <div class="field"><label for="f-note">What are you looking for? (optional)</label><textarea id="f-note" name="note" placeholder="Sectors you follow, how you use independent research, anything else useful"></textarea></div>
      <div class="cta-row"><button class="btn" type="submit" id="accessSubmit">Send request</button></div>
      <div id="formMsg" hidden></div>
    </form>
  </section>`;
}

function signinView(q){
  if (auth) return accountView();
  return `
  ${pageHead("Sign in", "No password. We email you a link.", "Enter your email and we send a one-time sign-in link. New readers get a free member account automatically.")}
  <section class="split">
    <div class="section-rail"><p class="note-box">Member access is free and opens every note marked Member. Subscriber access is granted by the research desk after a request.</p></div>
    <form class="form" id="signinForm" novalidate>
      <div class="field"><label for="s-email">Email</label><input id="s-email" name="email" type="email" autocomplete="email" placeholder="you@firm.com" required></div>
      <div class="two">
        <div class="field"><label for="s-name">Name (for new accounts)</label><input id="s-name" name="full_name" type="text" autocomplete="name" placeholder="Full name"></div>
        <div class="field"><label for="s-firm">Firm (optional)</label><input id="s-firm" name="firm" type="text" autocomplete="organization" placeholder="Fund, family office, or independent"></div>
      </div>
      <div class="cta-row"><button class="btn" type="submit" id="signinSubmit">Email me a sign-in link</button><span class="small muted">By signing in you accept the <a href="#/disclaimer" style="text-decoration:underline">Disclaimer</a> and <a href="#/copyright" style="text-decoration:underline">Terms</a>.</span></div>
      <div id="formMsg" hidden></div>
    </form>
  </section>`;
}

function accountView(){
  if (!auth) return signinView(new URLSearchParams());
  const p = auth.profile;
  return `
  ${pageHead("Account", p.full_name || auth.user.email, "")}
  <section class="split">
    <div class="section-rail">
      <dl class="meta" style="grid-template-columns:1fr; border-top:0; padding-top:0">
        <div><dt>Email</dt><dd>${esc(auth.user.email)}</dd></div>
        <div><dt>Access level</dt><dd>${p.is_admin ? `<span class="pill ok">Admin</span>` : accessPill(p.tier)}</dd></div>
        <div><dt>Member since</dt><dd>${fmtDate(p.created_at)}</dd></div>
      </dl>
      ${p.is_admin ? `<a class="btn" href="#/admin">Open admin</a>` : (p.tier !== "subscriber" ? `<a class="btn ghost" href="#/access?plan=subscriber">Request subscriber access</a>` : "")}
    </div>
    <form class="form" id="profileForm" novalidate>
      <div class="two">
        <div class="field"><label for="p-name">Name</label><input id="p-name" name="full_name" type="text" value="${esc(p.full_name || "")}"></div>
        <div class="field"><label for="p-firm">Firm</label><input id="p-firm" name="firm" type="text" value="${esc(p.firm || "")}"></div>
      </div>
      <div class="cta-row"><button class="btn" type="submit">Save</button><button class="btn link" type="button" id="signoutBtn">Sign out</button></div>
      <div id="formMsg" hidden></div>
    </form>
  </section>`;
}

function legalView(kind){
  const c = SITE[kind];
  const title = kind === "disclaimer" ? "Disclaimer" : "Copyright and terms of use";
  return `
  ${pageHead(title, kind === "disclaimer" ? "Research, not advice" : "What you may do with what you read", "")}
  <section class="split legal">
    <div class="section-rail"><p class="updated">Last updated ${esc(c.updated)}</p><p class="note-box">${kind === "disclaimer" ? "Please read this before relying on any writeup. Access to the site is conditioned on acceptance of these terms." : "© " + esc(CFG.established) + "–" + new Date().getFullYear() + " " + esc(CFG.brand) + ". All rights reserved."}</p></div>
    <div class="prose">${c.sections.map(s => `<h3>${esc(s.h)}</h3><p>${esc(s.p)}</p>`).join("")}</div>
  </section>`;
}

/* =====================================================================
   ADMIN VIEWS
   ===================================================================== */
function adminShell(tab, inner){
  const tabs = [["", "Overview"], ["writeups", "Writeups"], ["members", "Members"], ["requests", "Requests"]];
  return `
  ${pageHead("Admin", "Research desk", "")}
  <section class="admin">
    <nav class="admin-nav" aria-label="Admin">${tabs.map(([k, l]) => `<a href="#/admin${k ? "/" + k : ""}" ${tab === k ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
    <div class="admin-main">${inner}</div>
  </section>`;
}
const denied = () => `<section class="page-body" style="padding-top:80px"><p class="eyebrow">Admin</p><h2>Sign in with an admin account to continue.</h2><p><a class="btn" href="#/signin">Sign in</a></p></section>`;

async function adminOverview(){
  const [stats, members, requests] = await Promise.all([store.stats(), store.listMembers(), store.listRequests()]);
  const total = stats.reduce((a, s) => a + Number(s.views_total || 0), 0), week = stats.reduce((a, s) => a + Number(s.views_7d || 0), 0);
  const max = Math.max(1, ...stats.map(s => Number(s.views_total || 0)));
  const sorted = stats.slice().sort((a, b) => Number(b.views_total) - Number(a.views_total));
  return adminShell("", `
    <div class="tiles">
      <div class="tile"><b>${total.toLocaleString()}</b><span>Views, all time</span></div>
      <div class="tile"><b>${week.toLocaleString()}</b><span>Views, last 7 days</span></div>
      <div class="tile"><b>${members.length}</b><span>Accounts</span></div>
      <div class="tile"><b>${members.filter(m => m.tier === "subscriber").length}</b><span>Subscribers</span></div>
      <div class="tile"><b>${requests.filter(r => r.status === "new").length}</b><span>Open requests</span></div>
    </div>
    <div class="admin-head"><h3>Views by writeup</h3><a class="btn link" href="#/admin/writeups">Manage writeups →</a></div>
    <div class="table-wrap"><table class="t"><thead><tr><th>Writeup</th><th>All time</th><th>7 days</th><th>Signed-in readers</th></tr></thead><tbody>
      ${sorted.map(s => `<tr><td><div class="title">${esc(s.title)}</div><div class="bar"><i style="width:${Math.round(100 * Number(s.views_total) / max)}%"></i></div></td><td class="num">${Number(s.views_total).toLocaleString()}</td><td class="num">${Number(s.views_7d).toLocaleString()}</td><td class="num">${Number(s.signed_in_viewers).toLocaleString()}</td></tr>`).join("") || `<tr><td colspan="4" class="empty">No views yet.</td></tr>`}
    </tbody></table></div>
    <p class="small muted">Views count every open of a published writeup, signed in or not. Signed-in readers are unique accounts.</p>`);
}

async function adminWriteups(){
  const [notes, stats] = await Promise.all([store.listNotes({ all: true }), store.stats()]);
  const views = Object.fromEntries(stats.map(s => [s.id, Number(s.views_total || 0)]));
  return adminShell("writeups", `
    <div class="admin-head"><h3>Writeups</h3><a class="btn sm" href="#/admin/edit/new">New writeup</a></div>
    <div class="table-wrap"><table class="t"><thead><tr><th>Title</th><th>Status</th><th>Access</th><th>Published</th><th>Views</th><th></th></tr></thead><tbody>
      ${notes.map(n => `<tr data-id="${esc(n.id)}">
        <td><div class="title">${esc(n.title)}</div><div class="sub">${esc(n.type)} · ${esc(n.sector)} · v${esc(n.version || 1)}</div></td>
        <td>${n.status === "published" ? `<span class="pill ok">Published</span>` : `<span class="pill warn">Draft</span>`}</td>
        <td>${accessPill(n.access)}</td>
        <td class="num">${fmtDate(n.published_at)}</td>
        <td class="num">${(views[n.id] || 0).toLocaleString()}</td>
        <td class="actions"><a class="btn ghost sm" href="#/admin/edit/${esc(n.slug)}">Edit</a> <button class="btn ghost sm" type="button" data-toggle="${esc(n.id)}">${n.status === "published" ? "Unpublish" : "Publish"}</button> <button class="btn danger sm" type="button" data-del="${esc(n.id)}">Delete</button></td>
      </tr>`).join("") || `<tr><td colspan="6" class="empty">No writeups yet. Create the first one.</td></tr>`}
    </tbody></table></div>`);
}

async function adminEdit(slug){
  const isNew = slug === "new";
  const n = isNew ? { id: null, slug: "", title: "", summary: "", sector: "", type: "Initiation", access: "member", read_time: "", status: "draft", published_at: todayISO(), file_path: null, version: 1 } : await store.getNote(slug);
  if (!n) return adminShell("writeups", `<p class="err">Writeup not found.</p>`);
  const body = isNew ? "" : (await store.getBody(n)) ?? "";
  const types = ["Initiation", "Update", "Deep dive", "Post-mortem", "Framework", "Quarterly letter"];
  return adminShell("writeups", `
    <div class="admin-head"><h3>${isNew ? "New writeup" : "Edit writeup"}</h3><a class="btn link" href="#/admin/writeups">← All writeups</a></div>
    <form class="form wide" id="editForm" data-id="${esc(n.id || "")}" data-file="${esc(n.file_path || "")}" novalidate>
      <div class="field"><label for="e-title">Title</label><input id="e-title" name="title" type="text" required value="${esc(n.title)}"></div>
      <div class="two">
        <div class="field"><label for="e-slug">Slug (web address)</label><input id="e-slug" name="slug" type="text" value="${esc(n.slug)}" placeholder="auto from title"><span class="hint">Letters, numbers, dashes. Changing it breaks old links.</span></div>
        <div class="field"><label for="e-date">Published date</label><input id="e-date" name="published_at" type="date" value="${esc(n.published_at || "")}"></div>
      </div>
      <div class="field"><label for="e-summary">Summary (shown to everyone)</label><textarea id="e-summary" name="summary" required>${esc(n.summary)}</textarea></div>
      <div class="three">
        <div class="field"><label for="e-sector">Sector</label><input id="e-sector" name="sector" type="text" value="${esc(n.sector)}" placeholder="Financials"></div>
        <div class="field"><label for="e-type">Type</label><select id="e-type" name="type">${types.map(t => `<option ${t === n.type ? "selected" : ""}>${t}</option>`).join("")}</select></div>
        <div class="field"><label for="e-access">Who can read the full note</label><select id="e-access" name="access">${["free", "member", "subscriber"].map(a => `<option value="${a}" ${a === n.access ? "selected" : ""}>${ACCESS_LABEL[a]}</option>`).join("")}</select></div>
      </div>
      <div class="field"><label for="e-body">Body</label><textarea id="e-body" name="body" class="body" placeholder="Paragraphs separated by a blank line. Start a line with ## for a heading, - for a bullet.">${esc(body)}</textarea><span class="hint">Only readers with the access level above ever receive this text — it is never sent to guests.</span></div>
      <div class="two">
        <div class="field"><label for="e-file">Attached document (PDF or spreadsheet, optional)</label><input id="e-file" name="file" type="file" accept=".pdf,.xlsx,.xls,.csv,.docx"><span class="hint">${n.file_path ? "Current: " + esc(n.file_path.split("/").pop()) + " — uploading replaces it." : "Stored privately; only entitled readers can download it."}</span></div>
        <div class="field"><label for="e-status">Status</label><select id="e-status" name="status"><option value="draft" ${n.status === "draft" ? "selected" : ""}>Draft — hidden from readers</option><option value="published" ${n.status === "published" ? "selected" : ""}>Published</option></select></div>
      </div>
      <div class="cta-row"><button class="btn" type="submit" id="saveBtn">Save</button>${isNew ? "" : `<button class="btn danger sm" type="button" data-del="${esc(n.id)}">Delete</button>`}<span class="small muted" id="saveState"></span></div>
      <div id="formMsg" hidden></div>
    </form>`);
}

async function adminMembers(){
  const members = await store.listMembers();
  return adminShell("members", `
    <div class="admin-head"><h3>Members</h3><span class="small muted">${members.length} accounts · ${members.filter(m => m.tier === "subscriber").length} subscribers</span></div>
    <div class="table-wrap"><table class="t"><thead><tr><th>Name</th><th>Email</th><th>Firm</th><th>Access</th><th>Joined</th></tr></thead><tbody>
      ${members.map(m => `<tr>
        <td><div class="title">${esc(m.full_name || "—")}</div>${m.is_admin ? `<div class="sub"><span class="pill ok">Admin</span></div>` : ""}</td>
        <td>${esc(m.email)}</td><td>${esc(m.firm || "—")}</td>
        <td><select class="inline-select" data-tier="${esc(m.id)}" ${m.is_admin ? "disabled" : ""}>${["member", "subscriber"].map(t => `<option value="${t}" ${t === m.tier ? "selected" : ""}>${ACCESS_LABEL[t]}</option>`).join("")}</select></td>
        <td class="num">${fmtDate(m.created_at)}</td>
      </tr>`).join("") || `<tr><td colspan="5" class="empty">No accounts yet.</td></tr>`}
    </tbody></table></div>
    <p class="small muted">Changing a reader's access takes effect on their next page load. Admins are set in the database, not here.</p>`);
}

async function adminRequests(){
  const rs = await store.listRequests();
  const pill = s => s === "approved" ? `<span class="pill ok">Approved</span>` : s === "declined" ? `<span class="pill bad">Declined</span>` : `<span class="pill warn">New</span>`;
  return adminShell("requests", `
    <div class="admin-head"><h3>Access requests</h3><span class="small muted">${rs.filter(r => r.status === "new").length} open</span></div>
    <div class="table-wrap"><table class="t"><thead><tr><th>Received</th><th>Who</th><th>Wants</th><th>Note</th><th>Status</th><th></th></tr></thead><tbody>
      ${rs.map(r => `<tr>
        <td class="num">${fmtDateTime(r.created_at)}</td>
        <td><div class="title">${esc(r.name)}</div><div class="sub">${esc(r.email)}${r.firm ? " · " + esc(r.firm) : ""}</div></td>
        <td>${accessPill(r.plan)}</td><td class="small muted">${esc(r.note || "—")}</td><td>${pill(r.status)}</td>
        <td class="actions">${r.status === "new" ? `<button class="btn ghost sm" type="button" data-req="${esc(r.id)}" data-status="approved">Approve</button> <button class="btn danger sm" type="button" data-req="${esc(r.id)}" data-status="declined">Decline</button>` : ""}</td>
      </tr>`).join("") || `<tr><td colspan="6" class="empty">No requests yet.</td></tr>`}
    </tbody></table></div>
    <p class="small muted">Approving a subscriber request upgrades the account with that email if it exists, and upgrades it automatically when that reader first signs in.</p>`);
}

/* =====================================================================
   RENDER + WIRING
   ===================================================================== */
async function render(){
  const r = route();
  setNav(r.view);
  app.innerHTML = loading();
  let html = "";
  try {
    const isAdmin = auth && auth.profile.is_admin;
    switch (r.view){
      case "research": html = await researchView(); break;
      case "note": html = await noteView(r.arg); break;
      case "access": html = accessView(r.q); break;
      case "signin": html = signinView(r.q); break;
      case "account": html = accountView(); break;
      case "disclaimer": html = legalView("disclaimer"); break;
      case "copyright": html = legalView("copyright"); break;
      case "admin":
        if (!isAdmin) html = denied();
        else if (r.arg === "writeups") html = await adminWriteups();
        else if (r.arg === "edit") html = await adminEdit(r.arg2 || "new");
        else if (r.arg === "members") html = await adminMembers();
        else if (r.arg === "requests") html = await adminRequests();
        else html = await adminOverview();
        break;
      default: html = await homeView();
    }
  } catch (e) {
    console.error(e);
    html = `<section class="page-body" style="padding-top:60px"><p class="eyebrow">Something went wrong</p><p class="err">${esc(e.message || e)}</p></section>`;
  }
  app.innerHTML = html;
  document.title = r.view === "note" ? `${(app.querySelector(".note-title") || {}).textContent || CFG.brand} — ${CFG.brand}` : CFG.brand;
  wire(r);
  if (r.view === "home" && r.arg){ const el = document.getElementById(r.arg); if (el) el.scrollIntoView({ behavior: "auto", block: "start" }); }
  else window.scrollTo(0, 0);
}

const showMsg = (html) => { const m = document.getElementById("formMsg"); if (m){ m.hidden = false; m.innerHTML = html; } };
const validEmail = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);

function wire(r){
  // library
  document.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => { filter = b.dataset.filter; render(); }));
  const sb = document.getElementById("searchBox");
  if (sb){ let t; sb.addEventListener("input", () => { clearTimeout(t); t = setTimeout(async () => { search = sb.value; const all = await store.listNotes(); const s = search.trim().toLowerCase(); const notes = all.filter(n => (filter === "All" || n.type === filter) && (!s || [n.title, n.summary, n.sector, n.type].join(" ").toLowerCase().includes(s))); document.querySelector(".ledger").innerHTML = ledgerRows(notes); }, 120); }); }

  // note download
  const dl = document.getElementById("dlBtn");
  if (dl) dl.addEventListener("click", async () => {
    const n = await store.getNote(r.arg);
    try { const url = await store.fileUrl(n.file_path); if (url) window.open(url, "_blank", "noopener"); else toast("Demo mode: downloads work on the live site."); }
    catch (e) { toast("Download failed: " + e.message); }
  });

  // access request
  const af = document.getElementById("accessForm");
  if (af) af.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(af), name = (f.get("name") || "").trim(), email = (f.get("email") || "").trim();
    if (!name || !validEmail(email)) return showMsg(`<p class="err">Add your name and a valid email address so we can reply.</p>`);
    const btn = document.getElementById("accessSubmit"); btn.disabled = true;
    try {
      await store.createRequest({ name, email, firm: (f.get("firm") || "").trim(), plan: f.get("plan") === "subscriber" ? "subscriber" : "member", note: (f.get("note") || "").trim() });
      af.querySelectorAll("input,textarea,select,button").forEach(el => el.disabled = true);
      showMsg(`<div class="ok"><p class="eyebrow bare">Request received</p><p>Thank you. We reply within two business days${CFG.contactEmail ? ` from ${esc(CFG.contactEmail)}` : ""}.${store.mode === "demo" ? " (Demo mode: this request is visible in the admin Requests tab for this session only.)" : ""}</p></div>`);
    } catch (err) { btn.disabled = false; showMsg(`<p class="err">Could not send: ${esc(err.message)}</p>`); }
  });

  // sign in
  const sf = document.getElementById("signinForm");
  if (sf) sf.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(sf), email = (f.get("email") || "").trim();
    if (!validEmail(email)) return showMsg(`<p class="err">Enter a valid email address.</p>`);
    const btn = document.getElementById("signinSubmit"); btn.disabled = true;
    try {
      const res = await store.signIn(email, { full_name: (f.get("full_name") || "").trim(), firm: (f.get("firm") || "").trim() });
      if (res.demo){ toast("Demo mode: signed in as a member"); location.hash = "#/account"; }
      else showMsg(`<div class="ok"><p class="eyebrow bare">Check your email</p><p>We sent a sign-in link to <b>${esc(email)}</b>. Open it on this device to continue. The link expires in a few minutes.</p></div>`);
    } catch (err) { btn.disabled = false; showMsg(`<p class="err">Could not send the link: ${esc(err.message)}</p>`); }
  });

  // account
  const pf = document.getElementById("profileForm");
  if (pf) pf.addEventListener("submit", async e => { e.preventDefault(); const f = new FormData(pf); try { await store.updateProfile({ full_name: (f.get("full_name") || "").trim(), firm: (f.get("firm") || "").trim() }); auth = await store.getSession(); toast("Saved"); render(); } catch (err) { showMsg(`<p class="err">${esc(err.message)}</p>`); } });
  const so = document.getElementById("signoutBtn");
  if (so) so.addEventListener("click", async () => { await store.signOut(); auth = null; renderChrome(); location.hash = "#/"; toast("Signed out"); });

  // admin: writeups list
  document.querySelectorAll("[data-toggle]").forEach(b => b.addEventListener("click", async () => {
    const notes = await store.listNotes({ all: true }); const n = notes.find(x => x.id === b.dataset.toggle); if (!n) return;
    const body = (await store.getBody(n)) ?? "";
    const next = n.status === "published" ? "draft" : "published";
    try { await store.saveNote({ ...n, status: next, published_at: n.published_at || todayISO() }, body); toast(next === "published" ? "Published" : "Unpublished"); render(); } catch (e) { toast("Failed: " + e.message); }
  }));
  document.querySelectorAll("[data-del]").forEach(b => b.addEventListener("click", async () => {
    if (b.dataset.armed !== "1"){ b.dataset.armed = "1"; b.textContent = "Confirm delete"; setTimeout(() => { b.dataset.armed = "0"; b.textContent = "Delete"; }, 4000); return; }
    try { await store.deleteNote(b.dataset.del); toast("Deleted"); location.hash = "#/admin/writeups"; render(); } catch (e) { toast("Failed: " + e.message); }
  }));

  // admin: editor
  const ef = document.getElementById("editForm");
  if (ef){
    const title = ef.querySelector("#e-title"), slug = ef.querySelector("#e-slug");
    title.addEventListener("input", () => { if (!ef.dataset.id && !slug.dataset.touched) slug.value = slugify(title.value); });
    slug.addEventListener("input", () => { slug.dataset.touched = "1"; });
    ef.addEventListener("submit", async e => {
      e.preventDefault();
      const f = new FormData(ef);
      const note = {
        id: ef.dataset.id || undefined, title: (f.get("title") || "").trim(), slug: slugify(f.get("slug") || f.get("title") || ""),
        summary: (f.get("summary") || "").trim(), sector: (f.get("sector") || "").trim(), type: f.get("type"), access: f.get("access"),
        status: f.get("status"), published_at: f.get("published_at") || null, read_time: readTime(f.get("body")), file_path: ef.dataset.file || null
      };
      if (!note.id) delete note.id;
      if (!note.title || !note.slug || !note.summary) return showMsg(`<p class="err">Title, slug, and summary are required.</p>`);
      const btn = document.getElementById("saveBtn"); btn.disabled = true; document.getElementById("saveState").textContent = "Saving…";
      try {
        const file = f.get("file");
        if (file && file.size > 0){ note.file_path = await store.uploadFile(note.access, note.slug, file); }
        else if (note.file_path && !note.file_path.startsWith(note.access + "/") && store.moveFile){ const to = note.access + "/" + note.file_path.split("/").pop(); await store.moveFile(note.file_path, to); note.file_path = to; }
        const saved = await store.saveNote(note, f.get("body") || "");
        toast("Saved"); location.hash = `#/admin/edit/${saved.slug}`; render();
      } catch (err) { btn.disabled = false; document.getElementById("saveState").textContent = ""; showMsg(`<p class="err">Could not save: ${esc(err.message)}</p>`); }
    });
  }

  // admin: members + requests
  document.querySelectorAll("[data-tier]").forEach(s => s.addEventListener("change", async () => { try { await store.setTier(s.dataset.tier, s.value); toast("Access updated"); } catch (e) { toast("Failed: " + e.message); render(); } }));
  document.querySelectorAll("[data-req]").forEach(b => b.addEventListener("click", async () => { try { await store.updateRequest(b.dataset.req, b.dataset.status); toast(b.dataset.status === "approved" ? "Approved" : "Declined"); render(); } catch (e) { toast("Failed: " + e.message); } }));
}

boot();
})();
