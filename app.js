/* Prajit Research — site application
   Runs in two modes:
   - DEMO  (no Supabase config): sample data in memory, persona switcher, nothing saved.
   - LIVE  (Supabase configured): real sign-in, admin, storage, view counts; access enforced by the database.
*/
(() => {
"use strict";

const CFG = Object.assign({ brand: "Prajit Research", established: "2026", contactEmail: "", turnstileSiteKey: "" }, window.PRAJIT_CONFIG || {});

/* =====================================================================
   SITE COPY — edit freely
   ===================================================================== */
const SITE_DEFAULTS = {
  hero: {
    eyebrow: "Independent equity research",
    titleHtml: 'Patient research for impatient <em class="accent">markets.</em>',
    lede: "Long-form equity writeups — initiations, updates, and post-mortems — built from primary filings, management transcripts, and our own models. No thesis is published without the condition that would prove it wrong.",
    quote: "Most of what moves a stock this week is noise. Most of what moves it over five years is in the footnotes.",
    quoteCite: "Prajit Research, founding note"
  },
  stats: [
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
    bio: "Founder bio coming soon.",
    contactLine: "Institutional readers, allocators, and press can reach us through the access form or by email."
  },
  plans: [
    { name: "Guest", price: "Free", sub: "No account", featured: false, items: ["Selected notes in full, marked Free", "Disclaimer and methodology pages"], cta: { label: "Browse the library", href: "#/research" } },
    { name: "Member", price: "Free", sub: "Registered account", featured: true, items: ["Everything in Guest", "Summaries of every writeup", "Notes marked Member in full", "Email alert on every new writeup and update"], cta: { label: "Create a member account", href: "#/signup" } },
    { name: "Subscriber", price: "Not open yet", sub: "Coming later", featured: false, disabled: true, items: ["Everything in Member", "Every initiation and update in full, on publication day", "Downloadable models (xlsx) and the quarterly call"], cta: { label: "Request subscriber access", href: "#/access?plan=subscriber" } }
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

/* Every view function above reads from this mutable `SITE` — it starts as a copy of SITE_DEFAULTS and is
   replaced wholesale (applyContentOverrides) once the store's saved overrides load, so admin edits made on
   #/admin/content show up everywhere without touching the dozens of call sites that already say `SITE.xxx`. */
let SITE = structuredClone(SITE_DEFAULTS);

// Keys excluded from admin content-editing because they're structural (a route target), not copy —
// editing one wrong would silently break navigation rather than just reading oddly.
const CONTENT_EXCLUDE_KEYS = new Set(["href"]);

function flattenContent(obj, prefix = ""){
  const out = [];
  if (Array.isArray(obj)) obj.forEach((v, i) => out.push(...flattenContent(v, `${prefix}[${i}]`)));
  else if (obj && typeof obj === "object"){
    for (const k of Object.keys(obj)){
      if (CONTENT_EXCLUDE_KEYS.has(k)) continue;
      out.push(...flattenContent(obj[k], prefix ? `${prefix}.${k}` : k));
    }
  }
  else if (typeof obj === "string") out.push({ key: prefix, value: obj });
  return out;
}

function setByPath(root, path, value){
  const tokens = path.match(/[^.[\]]+/g) || [];
  let node = root;
  for (let i = 0; i < tokens.length - 1; i++){
    node = node[/^\d+$/.test(tokens[i]) ? Number(tokens[i]) : tokens[i]];
    if (node == null) return;
  }
  const last = tokens[tokens.length - 1];
  if (last !== undefined) node[/^\d+$/.test(last) ? Number(last) : last] = value;
}

function applyContentOverrides(rows){
  const next = structuredClone(SITE_DEFAULTS);
  rows.forEach(({ key, value }) => { try { setByPath(next, key, value); } catch (_) {} });
  SITE = next;
}

// "philosophy.tenets[1].title" -> "Philosophy — Tenets 2 — Title"
function contentLabel(path){
  return path.replace(/\[(\d+)\]/g, (_, n) => `.${Number(n) + 1}`).split(".")
    .map(s => s.replace(/([a-z0-9])([A-Z])/g, "$1 $2"))
    .map(s => s.charAt(0).toUpperCase() + s.slice(1))
    .join(" — ");
}
const CONTENT_GROUP_LABEL = { hero: "Home — Hero", stats: "Home — Stats", philosophy: "Home — Philosophy", process: "Home — Process", about: "Home — About", plans: "Plans / pricing", disclaimer: "Disclaimer page", copyright: "Copyright page" };

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
  { slug: "industrial-distribution-compounders", type: "Deep dive", sector: "Industrials", published_at: "2026-08-05", read_time: "22 min", access: "member", status: "published", version: 1, file_path: null,
    title: "The quiet compounders in industrial distribution",
    summary: "Why route density, not scale, is the moat — and how to tell which distributors actually have it.",
    body: "Industrial distribution is usually described as a scale business. It is not, or at least not primarily. The economics are set by route density: revenue per delivery stop, stops per route, and the gross margin those stops carry. A large distributor with thin density earns less on capital than a regional one with dense routes.\n\nThis matters because scale is visible in the income statement and density is not. To find it, we rebuild the branch footprint from filings and count stops per route where the company discloses enough to do so.\n\n## The three traits\n\nThe names that pass that screen share three traits:\n\n- Private-label penetration above a threshold.\n- A branch-manager incentive tied to local return on assets rather than revenue.\n- A working-capital cycle that shortens as the branch matures.\n\nEach is disclosed somewhere; none is headlined.\n\nValuation follows from the density model rather than from a peer multiple. We show the base, bear, and bull cases for two illustrative footprints, and the kill condition for each: a sustained decline in gross profit per stop while the branch count grows." },
  { slug: "regional-banks-deposit-franchises", type: "Initiation", sector: "Financials", published_at: "2026-07-22", read_time: "31 min", access: "subscriber", status: "published", version: 3, file_path: null,
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
    body: "Draft in progress." },
  { slug: "gmm-pfaudler-transformation-thesis", type: "Initiation", sector: "Industrials", published_at: "2026-09-18", read_time: "6 min", access: "subscriber", status: "published", version: 1, file_path: "subscriber/gmm-pfaudler-transformation-thesis.pdf",
    title: "GMM Pfaudler: from engineering company to global process-technology platform",
    summary: "The acquisition phase is over. The thesis now turns on whether four newly formed global divisions can convert scale into EBITDA margin and EBIT-to-PAT conversion.",
    body: `GMM Pfaudler Limited (NSE/BSE: GMMPFAUDLR) is itself the ultimate global holding company — since its 2020 acquisition of a majority stake in the Pfaudler Group, previously owned by Germany's Deutsche Beteiligungs AG (DBAG). The structure deliberately combines a promoter family, professional management, and private equity, designed — per management — to "extract synergies and create value for all stakeholders."

::callout thesis
The acquisition phase is largely over. GMM Pfaudler is now entering the extraction phase — integrating technologies, shifting into higher-value end markets, improving margins, and converting EBIT into PAT.
::

## Two phases, one platform

::flow
Phase 1 · 2015–2025 | Acquisition-led platform | Pfaudler, SEMCO, and other bolt-ons built global scale and technology breadth.
Phase 2 · FY27 onwards | Integration-led value creation | Four global divisions convert that scale into margin, cash flow, and EBIT-to-PAT conversion.
::

## Ownership and leadership

::stats
Patel promoter family | ~22% | Founding family
Deutsche Beteiligungs AG (DBAG) | ~32% | Prior Pfaudler owner
Public float | ~44%+ | Widely held
::

::cards
Vision · Founding family | Ashok Patel — Executive Chairman, Mavag AG | 50+ years in capital goods; director since 1972; managing director 1988–2015. Embodies the three-generation family legacy behind the group. |
Vision · Platform architect | Tarak Patel — Managing Director | Third generation of the founding family; led the 2020 acquisition of majority control in the Pfaudler Group that created today's global platform. |
Execution · Group CEO | Gregory Gelhaus — Group CEO (since May 2026) | Previously Group Chief Transformation Officer (2025–26); now leads execution of the four-division global reorganization. |
Execution · Group CFO | Alexander Poempner — Group CFO (since Feb 2025) | Driving deleveraging, capital allocation, and simplification of the legal and financing architecture inherited from the Pfaudler acquisition. |
::

A leadership renewal is running alongside the divisional reorganization: Thomas Kehl, CEO – International Business, retired effective August 31, 2026.

## From regional silos to four global technology divisions

Before the reorganization, GMM Pfaudler ran 24–25 operating entities across India, Europe, and the Americas, with P&L accountability organized by geography rather than technology — limited cross-selling, and a fragmented legal and financing architecture inherited from the Pfaudler acquisition.

Management's rationale for the change: sharper accountability, faster decision-making, and synergies across technologies, manufacturing, and go-to-market teams — creating cross-selling and global engineering leverage that a region-led structure could not.

::cards
CRT | Corrosion Resistance Technologies | Glass-lined reactors and equipment — the group's traditional core. | ₹466 Cr revenue, +10% YoY · order intake +23% YoY
PPT | Process Performance Technologies | Filtration, drying, and process performance for pharma and F&B. | ₹255 Cr revenue, +23% YoY · order intake +64% YoY
HET | Heavy Engineering Technologies | Defence, nuclear, and fertiliser-linked heavy engineering. | ₹74 Cr revenue, flat YoY · order intake +719% YoY
PST | Process Systems Technologies | Semiconductor, defence, and pharma process systems. | Revenue +46% YoY · fastest-growing division
::

## Diversification into higher-value end markets

The same technology platform is being redeployed from traditional chemical-process markets into eight adjacent, higher-value end markets.

::cards
1 | Pharma / CDMO | PPT · PST |
2 | Semiconductors | PST |
3 | Defence | HET · PST |
4 | Nuclear | HET |
5 | Power | HET · CRT |
6 | Oil & Gas | CRT |
7 | Petrochemicals | CRT |
8 | Mining | CRT |
::

::callout insight
HET order intake is up 719% YoY on defence, nuclear, and fertiliser demand; PST revenue is up 46% YoY on semiconductor, defence, and pharma opportunities.
::

## Q1 FY27 proof points

::stats
Revenue | ₹925 Cr | +16% YoY
EBITDA | ₹94 Cr | −7% YoY · 10.1% margin
PAT | ₹22 Cr | +118% YoY
Order backlog | ₹2,289 Cr | Record · +20% YoY
::

::callout caveat Read carefully
PAT growth was driven primarily by lower finance costs (₹22.7 Cr vs ₹42.9 Cr in Q1 FY26) and a forex restatement gain, not yet by EBITDA margin expansion — EBITDA actually declined 7% YoY on pricing pressure, mix shift, and restructuring costs. The transformation thesis therefore still needs EBITDA margin recovery to be proven, not just PAT conversion.
::

Seventy percent of the current order backlog is expected to execute within 10–12 months, improving FY27 revenue visibility versus the multi-year projects that dominated the book a year ago.

## Financial position

::stats
Net debt / equity | 0.1× | Low leverage
Net debt / adj. EBITDA | 0.4× | Improved from 0.5× in FY25
FY26 free cash flow | ₹367 Cr | +₹49 Cr YoY · FCF/EBITDA >90%
Planned debt repayment | €7m | By Q2 FY27, via internal accruals
::

::callout insight Why this matters for the thesis
A sub-0.5× net debt/EBITDA position and free-cash-flow conversion above 90% of EBITDA mean the restructuring is being funded internally, not via fresh leverage. The €7m repayment continues a deleveraging trend (0.5× → 0.4×) rather than a one-off gesture. Management has flagged further simplification of the legal and financing architecture inherited from the Pfaudler acquisition — a structural tailwind for future EBIT-to-PAT conversion.
::

## What needs to happen for re-rating

The transformation thesis is not proven by backlog and organizational charts alone. These are the checkpoints that would confirm extraction-phase value creation is real.

::flow
| EBITDA margin recovery toward the 15% target | From 10.1% in Q1 FY27 — the single most important number to track each quarter.
| EBIT-to-PAT conversion sustained without one-offs | Q1 FY27's PAT jump leaned on lower finance costs and forex gains, not operating leverage.
| Cross-divisional synergies showing up in the numbers | Cross-selling and global engineering leverage across CRT, PPT, HET, and PST.
| Backlog converting into billed revenue | 70% of the ₹2,289 Cr backlog executing within 10–12 months, as guided.
| Continued deleveraging and structural simplification | Further reduction from 0.4× net debt/adj. EBITDA and legal-entity rationalisation.
::

Consistent with Prajit Research methodology, this thesis is expressed as an aggregate value-creation and re-rating framework — not a per-share price target.` },
  { slug: "adc-opportunity-2026", type: "Framework", sector: "Healthcare", published_at: "2026-09-15", read_time: "10 min", access: "free", status: "published", version: 1, file_path: "free/adc-opportunity-2026.pdf",
    title: "ADC: the next frontier in pharma",
    summary: "Why the enabling ecosystem — chemistry, containment, bioconjugation, analytics, and supply — may outweigh the molecule, and where India's capability curve actually stands.",
    body: `Antibody–drug conjugates (ADCs) are routinely described as a new generation of targeted oncology medicines. That description is accurate but incomplete. The sharper question for an investor is not how many ADC drugs will reach the market — it is how much specialised chemistry, biologics capacity, bioconjugation capability, analytical infrastructure, containment engineering, and supply-chain depth the modality will demand as it scales.

An ADC fuses three components: an antibody that recognises a tumour target, a linker that governs attachment and release, and a highly potent payload engineered to kill the target cell. That fusion sits at the intersection of biologics and high-potency small-molecule chemistry — and the intersection, not the molecule alone, is where the industrial map gets interesting.

::callout thesis
The ADC opportunity should be studied as an ecosystem, not merely as a list of prospective blockbuster drugs.
::

The global evidence supports the direction of travel. Literature published around mid-2024 counted 15 clinically approved ADCs and close to 100 candidates in active clinical investigation, with other reviews citing substantially higher trial counts depending on definition. A 2025 SEC filing cited industry estimates placing ADC sales at roughly US$11 billion at the end of 2024, rising above US$23 billion by 2030, while flagging that some estimates run materially higher. The precise forecast matters less than the widening economic surface area created by a technically demanding modality.

India enters the conversation with a substantial existing export base: pharmaceutical exports reached US$30.47 billion in FY2024–25, up 9.4% year over year, and the government's ₹10,000-crore Biopharma SHAKTI programme is now layered on top, targeting more than 1,000 accredited clinical-trial sites and stronger biologics infrastructure over five years. But scale in conventional pharma does not automatically translate into ADC capability — the opportunity opens only if Indian manufacturers climb the complexity curve.

## What exactly is an ADC?

An antibody–drug conjugate is best understood as a molecular delivery system rather than a conventional drug. Instead of exposing the body to a potent cytotoxic agent indiscriminately, the construct uses an antibody to recognise a specific tumour antigen, internalise, and release its payload inside or adjacent to the target cell.

- Antibody — provides target recognition and biological specificity.
- Linker — bridges antibody and payload; governs circulation stability and release kinetics.
- Payload — delivers the pharmacological killing mechanism.

ADC payloads are commonly 100–1,000 times more potent than conventional chemotherapeutics, with activity in the sub-nanomolar or even picomolar range. The industrial consequence is blunt: a kilogram of ADC payload carries none of the manufacturing-risk equivalence of a kilogram of conventional API. Worker protection, environmental controls, segregation, cleaning validation, analytical sensitivity, and containment move from good practice to commercial necessity.

## Why ADC manufacturing differs from conventional pharma

Conventional generic manufacturing rewards scale, process efficiency, procurement discipline, and regulatory execution. ADC manufacturing adds several layers of technical differentiation on top of that base.

::cards
Hybrid construction | Biologics meets chemistry | Mammalian-cell biologics capability on the antibody side; complex organic synthesis and high-potency containment on the payload-linker side; conjugation must combine both without compromising product quality. |
Process sensitivity | Small shifts, big consequences | Small shifts in conjugation conditions can alter payload distribution, aggregation, potency, impurity profile, or stability. |
Analytical intensity | An unusually rich problem | Characterisation typically requires multiple orthogonal techniques — identity, purity, aggregation, DAR distribution, linker integrity, free payload. |
Facility design | Containment as a constraint | Containment strategy for HPAPI manufacture must reconcile product protection with worker and environmental protection from highly potent materials. |
::

::callout insight
ADCs create a wider moat of complexity. Competitive advantage need not sit only with whoever owns the molecule — it can also accrue to suppliers who repeatedly solve difficult manufacturing, analytical, and regulatory problems.
::

## The global signal: from novel modality to growing platform

The ADC story has moved past proof of concept. The first approval dates to 2000, but the field accelerated sharply over the following two decades — reviews from 2024 report 15 clinically approved ADCs and nearly 100 in clinical investigation, with the direction unambiguous regardless of the exact count: ADCs have become a platform technology rather than a single drug class.

::barchart Global ADC market, published estimates (US$ billion)
2024 | 11
2030E | 23
::

::donut Where the clinical pipeline is concentrated
Breast cancer | 38
Lung cancer | 22
Other indications | 40
::

Prajitresearch does not treat any single market-size estimate as a precise target — the more durable observation is that a growing ADC market creates demand at multiple layers of the value chain simultaneously. That layered demand is the core of the ecosystem thesis.

## The ADC value chain: seven places where value can accumulate

The most useful lens for this opportunity is decomposition — breaking the molecule down into the capabilities required to create it, rather than treating it as a single product decision.

::flow
| Target and antibody | Antibody discovery, expression systems, cell culture, purification, and specialised biologics manufacturing.
| Payload and linker chemistry | Among the most technically demanding steps — extreme potency, circulation-stable yet efficiently releasable linkers, tight impurity control.
| HPAPI manufacturing | Dedicated containment, isolators, closed handling, specialised HVAC and waste management — capital- and expertise-intensive by nature.
| Bioconjugation | The bridge between biologics and chemistry; the goal is a reproducible molecule with controlled loading.
| Purification | Removal of unreacted components, aggregates, and impurities while preserving product — a key determinant of yield and quality.
| Analytics | Identity, purity, aggregation, DAR, payload distribution, free payload, linker integrity, and stability.
| Fill-finish and global supply | Sterile processing, packaging, cold-chain logistics, quality release, and distribution.
::

::callout insight
These are not seven independent markets — they are interdependent capabilities. A developer may need several simultaneously, which raises the value of integrated or tightly coordinated suppliers.
::

## Why India is relevant — but the thesis is not "low-cost India"

India's pharmaceutical industry already carries a global manufacturing footprint. Exports reached US$30.47 billion in FY2024–25, up 9.4% year over year. That base matters because ADCs do not start from zero in India — but the opportunity is not simply to reproduce the generic-drug playbook at a higher price. ADCs require a genuine capability transition: generics → complex chemistry → HPAPI → biologics → bioconjugation → integrated ADC development and manufacturing.

::barchart India pharmaceutical exports (US$ billion)
FY2023-24 | 27.9
FY2024-25 | 30.47
::

The India Bioeconomy Report 2026 puts India's BioPharma segment at US$64.5 billion in 2025, up from US$58.4 billion in 2024; within that, biotherapeutics were reported at US$24.36 billion versus US$21.40 billion. None of this is ADC revenue — it is evidence of a broader capability base into which ADC manufacturing could fit.

Placed alongside the regions already active in ADC manufacturing, India's position is best described as an emerging node rather than an established or fast-scaling one. The US and EU retain the bulk of installed bioconjugation capacity — Lonza alone is estimated to hold roughly 12% of global contract bioconjugation share. South Korea has moved fastest among challengers since 2024; China is scaling rapidly through integrated CDMO platforms. India's chemistry and export base gives it a credible entry point, but bioconjugation and HPAPI capacity at global scale remain largely still to be built.

## The second derivative: the companies behind the molecule

Investors typically begin with a binary question — which company will discover the next blockbuster ADC? A sharper industrial question displaces it: which capabilities must exist regardless of which ADC wins?

If the number of ADC programmes expands, demand can rise for payload intermediates, linker building blocks, highly potent APIs, specialised reactors and containment systems, antibody production and purification, conjugation services, chromatography and analytical platforms, sterile fill-finish, and quality and regulatory services. These are second-order beneficiaries precisely because their revenue does not hinge on any single drug becoming a blockbuster.

The third derivative extends the logic one step further — a supplier to the supplier: ADC developer → ADC manufacturing partner → analytical technology, containment, specialised chemistry, or process-equipment provider.

::callout caveat
"Exposure to ADC" is not enough. The research question is evidence of capability conversion — customer qualification, repeat projects, utilisation, regulatory milestones, capacity expansion, technical hiring, process validation, and revenue contribution.
::

## A practical research framework for finding ADC enablers

Prajitresearch screens potential beneficiaries through six lenses, deliberately built to avoid treating "ADC" as a marketing keyword rather than a technical fact.

::table
Lens | Question | Evidence to seek | Red flag
Capability | What exactly is technically difficult? | Specialised chemistry, HPAPI, biologics, conjugation, analytics | Generic capability presented as ADC exposure
Qualification | Has a global customer validated it? | Audits, regulatory approvals, repeat projects | Only management commentary
Capacity | Can it scale? | Dedicated suites, utilisation, expansion | Large capex with uncertain demand
Conversion | Is capability becoming revenue? | Orders, milestones, revenue mix, repeat work | Pipeline without commercial evidence
Adjacency | Can assets serve other complex modalities? | Peptides, oligonucleotides, PROTACs, radiopharma | Single-use infrastructure
Economics | Does complexity create attractive returns? | Pricing power, margins, ROCE, cash conversion | High capex with weak utilisation
::

## What could break the thesis?

A credible investment thesis carries its own disconfirming evidence. ADC development remains scientifically and commercially difficult — a large clinical pipeline does not imply a proportional number of successful commercial drugs, and clinical failure, safety signals, target biology, or manufacturing setbacks can all compress demand. Technology can move quickly too: a new linker chemistry, payload class, conjugation method, or delivery format can erode the differentiation of existing capability overnight.

Capacity risk cuts the other way as well — if multiple companies build ADC facilities in parallel, utilisation can lag investment and pressure returns on capital. Regulation compounds the risk: a single quality event can dent customer confidence for years. Not every ADC-linked supplier benefits equally; some are exposed only to development-stage projects, others depend on a single customer or molecule.

::callout disconfirm
The thesis is not "ADCs will grow, so every ADC-linked company wins." It is narrower: as ADC adoption grows, specialised capabilities that are difficult to reproduce may become increasingly valuable — but the value will accrue selectively.
::

## A five-stage ADC opportunity cycle

Viewing ADC adoption as a capability cycle clarifies where economics accrue at each stage of maturity.

::flow
| Discovery | More targets, antibodies, payloads, and linkers enter research.
| Clinical development | Demand shifts toward analytical testing, development manufacturing, and small-batch conjugation.
| Late-stage validation | Requirements tighten around process robustness, scale-up, regulatory documentation, and supply reliability.
| Commercial manufacturing | Validated capacity, quality systems, supply continuity, and cost control become decisive.
| Platform expansion | Once infrastructure exists, the same capabilities can support additional ADCs and adjacent complex modalities.
::

The operating dynamic this creates is attractive in shape if not in timing: the initial investment is capability-heavy, but successful qualification can convert a single build-out into a platform serving multiple programmes.

::callout thesis The India thesis, in one sentence
India's ADC opportunity is not primarily a story about discovering a blockbuster molecule — it is a story about whether India can build enough specialised chemistry, biologics, bioconjugation, analytical, containment, and manufacturing infrastructure to become a reliable node in the global supply chain for the next generation of complex oncology medicines.
::

## Conclusion: research beyond the obvious

The next phase of oncology may be defined by precision — not only precision in targeting cancer cells, but precision in the manufacturing and supply chain required to make complex therapies reproducibly. ADC is a powerful case study precisely because the molecule exposes the entire value chain: antibody, linker, payload, bioconjugation, purification, analytics, containment, fill-finish, regulatory infrastructure, global supply.

For investors, the opportunity is to move one level deeper than the headline. Do not ask only who will discover the next blockbuster. Ask what infrastructure must exist for the next generation of oncology drugs to be discovered, developed, manufactured, tested, and delivered — and then one level deeper again: who supplies that infrastructure, and which of those suppliers can convert technical scarcity into durable economics?

This report deliberately does not name individual companies and does not issue price targets. It is designed as a research framework — a way of decomposing a complex modality into its component capabilities — for readers who intend to do their own diligence on specific businesses.` }
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

/* Markdown-lite: blank-line paragraphs, "## " headings, "- " bullet lists, "![caption](src)" figures, and
   ::block ... :: fenced rich-content sections (callout/stats/cards/table/flow/barchart/donut). Everything
   user-authored passes through esc() before it reaches innerHTML. */
const CALLOUT_LABELS = { thesis: "Core thesis", insight: "Key insight", caveat: "Caveat", disconfirm: "Disconfirming view", note: "Note" };
const CHART_COLORS = ["var(--gold)", "var(--ink)", "var(--ink-3)", "var(--ok)", "var(--warn)"];
const safeImageSrc = s => /^https?:\/\//i.test(s) || /^[a-zA-Z0-9][\w.\-\/]*$/.test(s);
const splitRow = line => line.split("|").map(s => s.trim());
const rowsOf = inner => inner.split("\n").map(l => l.trim()).filter(Boolean).map(splitRow);

function renderProse(text){
  const blocks = String(text || "").replace(/\r/g, "").split(/\n{2,}/);
  return blocks.map(b => {
    const lines = b.split("\n").filter(l => l.trim() !== "");
    if (!lines.length) return "";
    if (lines.length === 1 && /^##\s+/.test(lines[0])) return `<h3>${esc(lines[0].replace(/^##\s+/, ""))}</h3>`;
    if (lines.every(l => /^-\s+/.test(l))) return `<ul>${lines.map(l => `<li>${esc(l.replace(/^-\s+/, ""))}</li>`).join("")}</ul>`;
    const img = lines.length === 1 && /^!\[([^\]]*)\]\(([^)]+)\)$/.exec(lines[0]);
    if (img && safeImageSrc(img[2])) return `<figure><img src="${esc(img[2])}" alt="${esc(img[1])}" loading="lazy"><figcaption>${esc(img[1])}</figcaption></figure>`;
    return `<p>${esc(lines.join(" "))}</p>`;
  }).join("");
}

function renderCallout(type, label, inner){
  const known = ["thesis", "insight", "caveat", "disconfirm"].includes(type) ? type : "note";
  const text = label || CALLOUT_LABELS[known];
  return `<div class="callout${known === "note" ? "" : " callout-" + known}"><p class="callout-label">${esc(text)}</p>${renderProse(inner)}</div>`;
}
function renderStats(inner){
  return `<div class="tiles">${rowsOf(inner).map(([label, value, detail]) => `<div class="tile"><b>${esc(value || "")}</b><span>${esc(label || "")}</span>${detail ? `<div class="tile-detail">${esc(detail)}</div>` : ""}</div>`).join("")}</div>`;
}
function renderCards(inner){
  return `<div class="note-cards">${rowsOf(inner).map(([tag, title, body, foot]) => `<div class="note-card">${tag ? `<span class="tag">${esc(tag)}</span>` : ""}<h4>${esc(title || "")}</h4>${body ? `<p>${esc(body)}</p>` : ""}${foot ? `<div class="foot">${esc(foot)}</div>` : ""}</div>`).join("")}</div>`;
}
function renderFlow(inner){
  return `<ol class="steps">${rowsOf(inner).map(([eyebrow, title, body], i) => `<li class="step"><div class="n">${String(i + 1).padStart(2, "0")}</div><div class="t">${eyebrow ? `<p class="eyebrow bare">${esc(eyebrow)}</p>` : ""}<h3>${esc(title || "")}</h3>${body ? `<p>${esc(body)}</p>` : ""}</div></li>`).join("")}</ol>`;
}
function renderTable(inner){
  const [head, ...body] = rowsOf(inner);
  if (!head) return "";
  return `<div class="table-wrap"><table class="t"><thead><tr>${head.map(h => `<th>${esc(h)}</th>`).join("")}</tr></thead><tbody>${body.map(r => `<tr>${r.map(c => `<td>${esc(c)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
}
function renderBarChart(title, inner){
  const rows = rowsOf(inner).map(([label, value]) => ({ label, value: parseFloat(value) || 0 }));
  const max = Math.max(1, ...rows.map(r => r.value));
  return `<div class="chart">${title ? `<p class="chart-title">${esc(title)}</p>` : ""}<div class="bars">${rows.map(r => `<div class="bar-row"><span class="lbl">${esc(r.label)}</span><span class="track"><span class="fill" data-width="${Math.max(2, Math.round(100 * r.value / max))}"></span></span><span class="val">${esc(String(r.value))}</span></div>`).join("")}</div></div>`;
}
function renderDonut(title, inner){
  const rows = rowsOf(inner).map(([label, value]) => ({ label, value: parseFloat(value) || 0 }));
  const total = rows.reduce((a, r) => a + r.value, 0) || 1;
  const r = 52, c = 2 * Math.PI * r;
  let acc = 0;
  const segs = rows.map((row, i) => {
    const len = (row.value / total) * c;
    const seg = `<circle cx="70" cy="70" r="${r}" fill="none" stroke="${CHART_COLORS[i % CHART_COLORS.length]}" stroke-width="20" stroke-dasharray="${len} ${c - len}" stroke-dashoffset="${-acc}" transform="rotate(-90 70 70)"></circle>`;
    acc += len; return seg;
  }).join("");
  const legend = rows.map((row, i) => `<div class="row"><span class="sw" data-bg="${esc(CHART_COLORS[i % CHART_COLORS.length])}"></span><span class="name">${esc(row.label)}</span><span class="pct">${Math.round(100 * row.value / total)}%</span></div>`).join("");
  return `<div class="chart">${title ? `<p class="chart-title">${esc(title)}</p>` : ""}<div class="donut-wrap"><svg width="140" height="140" viewBox="0 0 140 140" role="img" aria-label="${esc(title || "Chart")}">${segs}</svg><div class="donut-legend">${legend}</div></div></div>`;
}

function renderBody(text){
  const lines = String(text || "").replace(/\r/g, "").split("\n");
  let out = "", proseBuf = [], i = 0;
  const flush = () => { if (proseBuf.length){ out += renderProse(proseBuf.join("\n")); proseBuf = []; } };
  while (i < lines.length){
    const open = /^::(\w+)(?:\s+(.*))?$/.exec(lines[i]);
    if (!open){ proseBuf.push(lines[i]); i++; continue; }
    flush();
    const type = open[1].toLowerCase(), rest = (open[2] || "").trim();
    let j = i + 1; const inner = [];
    while (j < lines.length && lines[j].trim() !== "::"){ inner.push(lines[j]); j++; }
    const body = inner.join("\n");
    if (type === "callout"){ const [t, ...lbl] = rest.split(/\s+/); out += renderCallout((t || "note").toLowerCase(), lbl.join(" "), body); }
    else if (type === "stats") out += renderStats(body);
    else if (type === "cards") out += renderCards(body);
    else if (type === "table") out += renderTable(body);
    else if (type === "flow") out += renderFlow(body);
    else if (type === "barchart") out += renderBarChart(rest, body);
    else if (type === "donut") out += renderDonut(rest, body);
    i = j + 1;
  }
  flush();
  return out;
}

/* =====================================================================
   PROTECTED DOCUMENT VIEWER
   Renders a PDF entirely to <canvas> — no native browser PDF toolbar,
   no selectable/copyable text, no exposed file URL in the page — with a
   reader-identifying watermark baked into the pixels of every page.
   This is a real deterrent and a leak-tracing measure. It is NOT, and
   cannot be, a screenshot blocker — no web page can detect or prevent
   OS-level screen capture; that happens entirely outside the browser.
   Anything claiming otherwise for a webpage is not telling the truth.
   ===================================================================== */
const PDFJS_VERSION = "3.11.174";
let pdfjsReady = null;
function ensurePdfJs(){
  if (pdfjsReady) return pdfjsReady;
  pdfjsReady = new Promise((resolve, reject) => {
    if (window.pdfjsLib) return resolve(window.pdfjsLib);
    const s = document.createElement("script");
    s.src = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.min.js`;
    s.onload = () => {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.js`;
      resolve(window.pdfjsLib);
    };
    s.onerror = () => reject(new Error("Could not load the document viewer."));
    document.head.appendChild(s);
  });
  return pdfjsReady;
}

/* A light, readable "PRAJIT RESEARCH" repeating diagonal watermark, tiled so it covers the page corner
   to corner. Text only — no email, no date, nothing else. Drawn twice per instance — once white, once
   black, both very faint and offset by a pixel — so it stays legible whether the page content underneath
   is light or dark, without competing with the actual content for attention. */
function drawWatermark(ctx, width, height, brandText){
  ctx.save();
  const fontSize = Math.max(20, Math.round(width * 0.032));
  ctx.font = `500 ${fontSize}px 'IBM Plex Mono', monospace`;
  const textWidth = ctx.measureText(brandText).width;
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 6);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const stepX = textWidth + fontSize * 2.5, stepY = fontSize * 3.4;
  const span = Math.sqrt(width * width + height * height); // covers every corner once rotated
  for (let y = -span; y < span; y += stepY){
    for (let x = -span; x < span; x += stepX){
      ctx.globalAlpha = 0.09; ctx.fillStyle = "#000000"; ctx.fillText(brandText, x + 1, y + 1);
      ctx.globalAlpha = 0.09; ctx.fillStyle = "#FFFFFF"; ctx.fillText(brandText, x - 1, y - 1);
    }
  }
  ctx.restore();
}

async function renderProtectedPdf(container, url, brandText){
  if (!url){
    container.innerHTML = `<p class="small muted">Demo mode: the protected document viewer works on the live site once the PDF is uploaded through the admin desk.</p>`;
    return;
  }
  container.innerHTML = `<p class="tiny">Loading document…</p>`;
  try {
    const pdfjsLib = await ensurePdfJs();
    const pdf = await pdfjsLib.getDocument(url).promise;
    container.innerHTML = "";
    for (let i = 1; i <= pdf.numPages; i++){
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 1.6 });
      const canvas = document.createElement("canvas");
      canvas.width = viewport.width; canvas.height = viewport.height;
      canvas.className = "pdf-page";
      const ctx = canvas.getContext("2d");
      await page.render({ canvasContext: ctx, viewport }).promise;
      drawWatermark(ctx, viewport.width, viewport.height, brandText);
      container.appendChild(canvas);
    }
  } catch (e){
    container.innerHTML = `<p class="err">Could not load the document: ${esc(e.message || String(e))}</p>`;
  }
}

let pdfGuardsWired = false;
function wireProtectedPdfGuards(container){
  container.addEventListener("contextmenu", e => e.preventDefault());
  container.addEventListener("dragstart", e => e.preventDefault());
  if (pdfGuardsWired) return;
  pdfGuardsWired = true;
  // A plain <div>/<canvas> isn't focusable, so a container-scoped keydown listener would rarely
  // fire — this is registered once on document instead, and self-scopes by checking whether a
  // protected viewer is actually on screen right now (it stops mattering the moment the SPA router
  // navigates away and #pdfViewer is removed from the DOM, no manual cleanup needed).
  document.addEventListener("keydown", e => {
    if (!document.getElementById("pdfViewer")) return;
    const k = e.key.toLowerCase();
    if ((e.ctrlKey || e.metaKey) && ["p", "s", "c", "u"].includes(k)) e.preventDefault();
  });
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
    this.content = [];
  }
  get profile(){ return this.persona ? this.personas[this.persona] : null; }
  async getSession(){ return this.profile ? { user: { id: this.profile.id, email: this.profile.email }, profile: this.profile } : null; }
  onAuth(cb){ this.listeners.push(cb); }
  _emit(){ this.listeners.forEach(cb => cb()); }
  setPersona(key){ this.persona = key || null; this._emit(); }
  async signUp(email, password, meta){
    if (weakPassword(password, email)) throw new Error("Password must be at least 12 characters and not contain your email.");
    const full_name = [meta.first_name, meta.last_name].filter(Boolean).join(" ") || "Demo Member";
    this.personas.member = { ...this.personas.member, email, full_name, firm: meta.firm || "" };
    this.setPersona("member");
    return { needsConfirmation: false };
  }
  async signInWithPassword(email, password){
    if (password !== DEMO_PASSWORD) throw new Error("Incorrect email or password.");
    this.setPersona("member");
    return {};
  }
  async requestPasswordReset(){ return { demo: true }; }
  async updatePassword(){ /* nothing to persist in demo mode — mirrors "nothing is saved" everywhere else */ }
  async reauthenticate(email, currentPassword){ if (currentPassword !== DEMO_PASSWORD) throw new Error("Current password is incorrect."); }
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
  async listContent(){ return this.content.slice(); }
  async saveContent(rows){ rows.forEach(({ key, value }) => { const i = this.content.findIndex(c => c.key === key); if (i >= 0) this.content[i].value = value; else this.content.push({ key, value }); }); }
  async uploadFile(access, slug, file){ return `${access}/${slug}.${(file.name.split(".").pop() || "pdf").toLowerCase()}`; }
  async fileUrl(path){
    // Demo-mode-only static copies for local preview (kept outside the git-tracked project folder —
    // see DEMO_PDF_ASSETS). Any other sample note's fake file_path correctly resolves to null here,
    // matching how it always behaved before.
    return DEMO_PDF_ASSETS.has(path) ? `demo-pdfs/${path.split("/").pop()}` : null;
  }
}

/* =====================================================================
   LIVE STORE — Supabase
   ===================================================================== */
class LiveStore {
  constructor(client){ this.mode = "live"; this.sb = client; this.session = null; this.profileCache = null; this.listeners = []; }
  async init(){
    const { data } = await this.sb.auth.getSession();
    this.session = data.session || null;
    this.sb.auth.onAuthStateChange((event, session) => {
      this.session = session || null; this.profileCache = null;
      if (event === "PASSWORD_RECOVERY"){ recoveryMode = true; location.hash = "#/reset-password"; }
      this.listeners.forEach(cb => cb());
    });
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
  async signUp(email, password, meta, captchaToken){
    if (weakPassword(password, email)) throw new Error("Password must be at least 12 characters and not contain your email.");
    const redirect = location.origin + location.pathname;
    const { data, error } = await this.sb.auth.signUp({
      email, password,
      options: { data: { first_name: meta.first_name || "", last_name: meta.last_name || "", firm: meta.firm || "" }, emailRedirectTo: redirect, captchaToken }
    });
    if (error) throw error;
    return { needsConfirmation: !data.session };
  }
  async signInWithPassword(email, password){
    const { error } = await this.sb.auth.signInWithPassword({ email, password });
    if (error){ if (/email not confirmed/i.test(error.message)) throw new Error("Please confirm your email first — check your inbox for the confirmation link."); throw new Error("Incorrect email or password."); }
  }
  async requestPasswordReset(email, captchaToken){
    const redirect = location.origin + location.pathname;
    const { error } = await this.sb.auth.resetPasswordForEmail(email, { redirectTo: redirect, captchaToken });
    if (error) throw error;
  }
  async updatePassword(newPassword){
    const { error } = await this.sb.auth.updateUser({ password: newPassword });
    if (error) throw error;
    try { await this.sb.auth.signOut({ scope: "others" }); } catch (_) {}
    recoveryMode = false;
  }
  async reauthenticate(email, currentPassword){
    const { error } = await this.sb.auth.signInWithPassword({ email, password: currentPassword });
    if (error) throw new Error("Current password is incorrect.");
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
  async listContent(){ const { data, error } = await this.sb.from("site_content").select("key, value"); if (error) throw error; return data || []; }
  async saveContent(rows){ const payload = rows.map(({ key, value }) => ({ key, value, updated_by: this.user?.id || null })); const { error } = await this.sb.from("site_content").upsert(payload, { onConflict: "key" }); if (error) throw error; }
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
let recoveryMode = false;    // true only between a PASSWORD_RECOVERY auth event and a successful password update
let filter = "All", search = "";
let vtActive = false;        // guards against overlapping document.startViewTransition() calls
const app = document.getElementById("app");

async function boot(){
  if (CFG.turnstileSiteKey){
    const s = document.createElement("script");
    s.src = "https://challenge.cloudflare.com/turnstile/v0/api.js"; s.async = true; s.defer = true;
    document.head.appendChild(s);
  }
  const configured = !!(CFG.supabaseUrl && CFG.supabaseAnonKey);
  if (configured){
    // Live site. Never fall back to sample data here — showing invented writeups on the
    // real site would be worse than showing an honest error.
    if (!(window.supabase && window.supabase.createClient)){
      app.innerHTML = `<section class="page-body pt-64"><p class="eyebrow">Connection problem</p>
        <h2 class="mt-18">The site can't reach its library right now.</h2>
        <p class="lede mt-16">Please refresh the page in a moment. If this continues, contact ${esc(CFG.contactEmail || "the research desk")}.</p></section>`;
      return;
    }
    store = new LiveStore(window.supabase.createClient(CFG.supabaseUrl, CFG.supabaseAnonKey));
    try { await store.init(); } catch (e) { console.error("Supabase init failed:", e); }
  } else store = new DemoStore();
  try { applyContentOverrides(await store.listContent()); } catch (e) { console.error("Site content load failed:", e); }
  store.onAuth(async () => { auth = await store.getSession(); renderChrome(); render(); });
  auth = await store.getSession();
  renderChrome();
  document.getElementById("menuBtn").addEventListener("click", e => { const nav = document.getElementById("nav"), open = nav.classList.toggle("open"); e.currentTarget.setAttribute("aria-expanded", String(open)); });
  document.getElementById("copyLine").textContent = `© ${CFG.established}–${new Date().getFullYear()} ${CFG.brand}`;
  // Account menu: wired once here (not in renderChrome, which reruns on every auth change) so the
  // listeners never accumulate on the same static buttons.
  document.getElementById("avatarBtn").addEventListener("click", e => {
    e.stopPropagation();
    const dd = document.getElementById("accountDropdown"), wasOpen = !dd.hidden;
    closeAccountDropdown();
    if (!wasOpen){ dd.hidden = false; document.getElementById("avatarBtn").setAttribute("aria-expanded", "true"); }
  });
  document.getElementById("signoutBtn2").addEventListener("click", async () => { await store.signOut(); auth = null; renderChrome(); location.hash = "#/"; toast("Signed out"); });
  document.addEventListener("click", e => { if (!e.target.closest(".account-menu")) closeAccountDropdown(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape") closeAccountDropdown(); });
  window.addEventListener("hashchange", render);
  render();
}

const initialsOf = name => {
  const parts = String(name || "").trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  return parts.length === 1 ? parts[0].slice(0, 2).toUpperCase() : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};
function closeAccountDropdown(){
  const dd = document.getElementById("accountDropdown"), btn = document.getElementById("avatarBtn");
  if (dd && !dd.hidden){ dd.hidden = true; btn.setAttribute("aria-expanded", "false"); }
}
function renderChrome(){
  const navAuth = document.getElementById("navAuth"), navAdmin = document.getElementById("navAdmin"), navSignup = document.getElementById("navSignup");
  const accountMenu = document.getElementById("accountMenu"), avatarBtn = document.getElementById("avatarBtn");
  navAuth.hidden = !!auth;
  navSignup.hidden = !!auth;
  accountMenu.hidden = !auth;
  navAdmin.hidden = !(auth && auth.profile.is_admin);
  if (auth){
    const name = auth.profile.full_name || auth.user.email;
    avatarBtn.textContent = initialsOf(name);
    document.getElementById("ddName").textContent = name;
    document.getElementById("ddEmail").textContent = auth.user.email;
  } else closeAccountDropdown();
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
    const on = a.dataset.nav === view || (["account", "forgot-password", "reset-password"].includes(view) && a.dataset.nav === "signin");
    if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
  });
  document.getElementById("nav").classList.remove("open");
  document.getElementById("menuBtn").setAttribute("aria-expanded", "false");
  closeAccountDropdown();
}

/* =====================================================================
   SHARED FRAGMENTS
   ===================================================================== */
const accessPill = (a, status) => status === "draft" ? `<span class="access draft">Draft</span>` : `<span class="access ${esc(a)}">${esc(ACCESS_LABEL[a] || a)}</span>`;

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
  const published = await store.listNotes();
  const latest = published.slice(0, 4);
  const stats = [{ value: String(published.length), label: "Writeups published" }, ...SITE.stats];
  return `
  <section class="hero" data-reveal-group>
    <div class="hero-main">
      <p class="eyebrow" data-reveal>${esc(h.eyebrow)}</p>
      <h1 class="hero-title" data-reveal>${h.titleHtml}</h1>
      <p class="lede" data-reveal>${esc(h.lede)}</p>
      <div class="cta-row" data-reveal><a class="btn" href="#/access">Request access</a><a class="btn link" href="#/research">Read the library →</a></div>
    </div>
    <div class="hero-side" data-reveal><div class="est">Est. ${esc(CFG.established)}</div><blockquote class="hero-quote">${esc(h.quote)}<cite>${esc(h.quoteCite)}</cite></blockquote></div>
  </section>
  <div class="stats" data-reveal-group>${stats.map(s => `<div class="stat" data-reveal><b data-count>${esc(s.value)}</b><span>${esc(s.label)}</span></div>`).join("")}</div>
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
    <div class="section-body"><div class="ledger" data-reveal>${ledgerRows(latest)}</div></div>
  </section>
  <section class="section" id="plans">
    <div class="section-rail"><p class="eyebrow">Access</p><h2>Two ways to read</h2></div>
    <div class="section-body"><div class="plans">${SITE.plans.filter(p => !p.disabled).map(p => `
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
  ${pageHead("Research library", "Every writeup, dated and versioned", "Sign in to read summaries. Full notes open according to their access level — Free, Member, or Subscriber.")}
  <section class="page-body">
    <div class="ledger-head">
      <div class="filters" role="group" aria-label="Filter by type">${types.map(t => `<button class="chip" type="button" data-filter="${esc(t)}" aria-pressed="${t === filter}">${esc(t)}</button>`).join("")}</div>
      <input class="search" id="searchBox" type="search" placeholder="Search titles, sectors…" value="${esc(search)}" aria-label="Search writeups">
    </div>
    <div class="ledger" data-reveal>${ledgerRows(notes)}</div>
  </section>`;
}

async function noteView(slug){
  const n = await store.getNote(slug);
  if (!n) return `<section class="page-body pt-80"><p class="eyebrow">Not found</p><h2>That writeup isn't in the library.</h2><p><a class="btn link" href="#/research">Back to the library →</a></p></section>`;
  if (n.status === "published") store.recordView(slug);
  const body = await store.getBody(n);
  const entitled = body !== null;
  const signedIn = !!auth;
  const needs = n.access;
  let gate = "";
  if (!entitled){
    const headline = needs === "member" ? "The rest of this writeup is for members." : "The rest of this writeup is for subscribers.";
    // Subscriber access is paused (greyed out on Plans too) -- no self-serve request path right now, so
    // this gate explains that instead of inviting a request that can't be honored yet.
    const copy = needs === "member"
      ? (signedIn ? "Your account does not have member access yet." : "Member accounts are free. Sign in with your email and the full note opens immediately.")
      : "Subscriber access isn't open yet — it will include every initiation and update on publication day, the models, and the quarterly call. We'll announce when it's available.";
    const cta = needs === "member" ? (!signedIn ? `<a class="btn" href="#/signup">Create a free account</a>` : `<a class="btn" href="#/access?plan=member">Request member access</a>`) : "";
    gate = `<div class="gate gate-reveal" data-reveal><p class="eyebrow">${ACCESS_LABEL[needs]} access</p><h3>${headline}</h3><p>${copy}</p>${cta || (!signedIn && needs === "subscriber") ? `<div class="cta-row">${cta}${!signedIn && needs === "subscriber" ? `<a class="btn link" href="#/signin">Already have subscriber access? Sign in →</a>` : ""}</div>` : ""}</div>`;
  }
  const hasPdf = entitled && !!n.file_path;
  const pdfBlock = hasPdf ? `<div class="pdf-viewer" id="pdfViewer" data-path="${esc(n.file_path)}"></div>` : "";
  // Summary is a reader perk, not a guest one: anonymous visitors only ever see the locked gate above,
  // never the summary text, since publishing it with no account at all makes "free tier" meaningless.
  const preview = entitled ? (hasPdf ? "" : renderBody(body)) : (signedIn ? `<p>${esc(n.summary)}</p>` : "");
  return `
  <a class="back" href="#/research">← Library</a>
  <section class="note-head" data-reveal-group>
    <p class="eyebrow" data-reveal>${esc(n.type)} · ${esc(n.sector)}${n.status === "draft" ? " · Draft (only admins can see this)" : ""}</p>
    <h1 class="note-title" data-reveal>${esc(n.title)}</h1>
    ${signedIn ? `<p class="lede" data-reveal>${esc(n.summary)}</p>` : `<p class="lede" data-reveal>Sign in to read the summary — it's free.</p>`}
    <dl class="meta" data-reveal>
      <div><dt>Published</dt><dd>${fmtDate(n.published_at)}</dd></div>
      <div><dt>Sector</dt><dd>${esc(n.sector)}</dd></div>
      <div><dt>Type</dt><dd>${esc(n.type)}</dd></div>
      <div><dt>Read time</dt><dd>${esc(n.read_time)}</dd></div>
      <div><dt>Version</dt><dd>v${esc(n.version || 1)}</dd></div>
      <div><dt>Access</dt><dd>${accessPill(n.access, n.status)}</dd></div>
      <div><dt>Kill condition</dt><dd>${n.kill_triggered_at ? `Triggered on ${fmtDate(n.kill_triggered_at)}` : "Not triggered"}</dd></div>
    </dl>
  </section>
  <section class="note-body">
    <div class="section-rail"><p class="eyebrow">Writeup</p>${auth ? `<p class="small muted">Signed in as ${esc(auth.profile.full_name || auth.user.email)}</p>` : `<p class="small muted">Reading as a guest</p>`}</div>
    <div>
      <div class="prose">${preview}</div>
      ${pdfBlock}${gate}
      ${hasPdf ? `<p class="small muted pdf-note">This document is watermarked to your account and shown for on-screen reading only — right-click, copying, printing, and direct download are disabled. A determined reader can still photograph or screenshot a screen, which is true of any document on any website; the watermark exists so that's traceable.</p>` : ""}
      <p class="disclosure">Disclosure: Prajit Research and its principals may hold positions in securities discussed and may trade them without notice. This writeup is not investment advice. See the <a href="#/disclaimer">Disclaimer</a> and <a href="#/copyright">Copyright</a> terms.</p>
    </div>
  </section>`;
}

function accessView(q){
  // Subscriber requests are paused for now (greyed out on the Plans section too) -- member is the only
  // self-serve path while that's true, so this form only ever submits a member request.
  return `
  ${pageHead("Request access", "Tell us who you are and what you read", "Member accounts are free — you can also create one instantly on the sign-in page.")}
  <section class="split">
    <div class="section-rail"><p class="note-box">We do not sell or share reader information. Your request goes only to the research desk.</p></div>
    <form class="form" id="accessForm" novalidate>
      <div class="two">
        <div class="field"><label for="f-name">Name</label><input id="f-name" name="name" type="text" autocomplete="name" placeholder="Full name" required value="${esc(auth?.profile.full_name || "")}"></div>
        <div class="field"><label for="f-email">Email</label><input id="f-email" name="email" type="email" autocomplete="email" placeholder="you@firm.com" required value="${esc(auth?.user.email || "")}"></div>
      </div>
      <div class="field"><label for="f-firm">Firm (optional)</label><input id="f-firm" name="firm" type="text" autocomplete="organization" placeholder="Fund, family office, or independent" value="${esc(auth?.profile.firm || "")}"></div>
      <div class="field"><label for="f-note">What are you looking for? (optional)</label><textarea id="f-note" name="note" placeholder="Sectors you follow, how you use independent research, anything else useful"></textarea></div>
      <div class="cta-row"><button class="btn" type="submit" id="accessSubmit">Send request</button></div>
      <div id="formMsg" hidden></div>
    </form>
  </section>`;
}

function signupView(){
  if (auth) return accountView();
  return `
  ${pageHead("Create account", "Free, and takes a minute", "Member accounts are free and open every note marked Member.")}
  <section class="split">
    <div class="section-rail"><p class="note-box">Your password is handled entirely by our authentication provider — we never see or store it ourselves.</p></div>
    <form class="form" id="signupForm" novalidate data-reveal-group>
      <div class="two" data-reveal>
        <div class="field"><label for="su-first">First name</label><input id="su-first" name="first_name" type="text" autocomplete="given-name" required></div>
        <div class="field"><label for="su-last">Last name</label><input id="su-last" name="last_name" type="text" autocomplete="family-name" required></div>
      </div>
      <div class="field" data-reveal><label for="su-email">Email</label><input id="su-email" name="email" type="email" autocomplete="email" placeholder="you@firm.com" required></div>
      <div class="field" data-reveal><label for="su-firm">Firm (optional)</label><input id="su-firm" name="firm" type="text" autocomplete="organization" placeholder="Fund, family office, or independent"></div>
      <div class="two" data-reveal>
        <div class="field"><label for="su-pass">Password</label><input id="su-pass" name="password" type="password" autocomplete="new-password" minlength="12" required><span class="hint">At least 12 characters.</span></div>
        <div class="field"><label for="su-pass2">Confirm password</label><input id="su-pass2" name="password2" type="password" autocomplete="new-password" minlength="12" required></div>
      </div>
      ${turnstileWidget()}
      <label class="check-row" data-reveal for="su-terms"><input id="su-terms" name="terms" type="checkbox" required> I have read and agree to the <a href="#/disclaimer" class="underline" target="_blank" rel="noopener">Disclaimer, Copyright &amp; Terms</a></label>
      <div class="cta-row" data-reveal><button class="btn" type="submit" id="signupSubmit">Create account</button><span class="small muted">Already have an account? <a href="#/signin" class="underline">Sign in</a></span></div>
      <div id="formMsg" hidden></div>
    </form>
  </section>`;
}

function signinView(q){
  if (auth) return accountView();
  return `
  ${pageHead("Sign in", "Welcome back", "")}
  <section class="split">
    <div class="section-rail"><p class="note-box">New here? <a href="#/signup" class="underline">Create a free account</a> instead — it takes a minute.</p></div>
    <div>
      <form class="form" id="signinForm" novalidate data-reveal-group>
        <div class="field" data-reveal><label for="s-email">Email</label><input id="s-email" name="email" type="email" autocomplete="email" placeholder="you@firm.com" required></div>
        <div class="field" data-reveal><label for="s-pass">Password</label><input id="s-pass" name="password" type="password" autocomplete="current-password" required>${store.mode === "demo" ? `<span class="hint">Demo mode: any email, password is <code>${esc(DEMO_PASSWORD)}</code></span>` : ""}</div>
        <div class="cta-row" data-reveal><button class="btn" type="submit" id="signinSubmit">Sign in</button><a class="btn link" href="#/forgot-password">Forgot password?</a></div>
        <div id="formMsg" hidden></div>
      </form>
    </div>
  </section>`;
}

function forgotPasswordView(){
  if (auth) return accountView();
  return `
  ${pageHead("Forgot password", "We'll email you a reset link", "Enter the email on your account and we'll send instructions to reset your password.")}
  <section class="split">
    <div class="section-rail"><p class="note-box">If there's an account for that address, you'll get an email within a few minutes.</p></div>
    <form class="form" id="forgotForm" novalidate>
      <div class="field"><label for="fp-email">Email</label><input id="fp-email" name="email" type="email" autocomplete="email" placeholder="you@firm.com" required></div>
      ${turnstileWidget()}
      <div class="cta-row"><button class="btn" type="submit" id="forgotSubmit">Send reset link</button><a class="btn link" href="#/signin">Back to sign in</a></div>
      <div id="formMsg" hidden></div>
    </form>
  </section>`;
}

function resetPasswordView(){
  if (!recoveryMode) return `<section class="page-body pt-80"><p class="eyebrow">Reset password</p><h2>This link has expired or was already used.</h2><p><a class="btn link" href="#/forgot-password">Request a new reset link →</a></p></section>`;
  return `
  ${pageHead("Set a new password", "Almost done", "Choose a new password below. This will sign you out of any other active sessions.")}
  <section class="split">
    <div class="section-rail"></div>
    <form class="form" id="resetForm" novalidate>
      <div class="two">
        <div class="field"><label for="rp-pass">New password</label><input id="rp-pass" name="password" type="password" autocomplete="new-password" minlength="12" required><span class="hint">At least 12 characters.</span></div>
        <div class="field"><label for="rp-pass2">Confirm new password</label><input id="rp-pass2" name="password2" type="password" autocomplete="new-password" minlength="12" required></div>
      </div>
      <div class="cta-row"><button class="btn" type="submit" id="resetSubmit">Set new password</button></div>
      <div id="formMsg" hidden></div>
    </form>
  </section>`;
}

function accountView(){
  if (!auth) return signinView(new URLSearchParams());
  const p = auth.profile;
  return `
  ${pageHead("Signed in", p.full_name || auth.user.email, `You're signed in as ${auth.user.email}.`)}
  <section class="split">
    <div class="section-rail">
      <dl class="meta single-col">
        <div><dt>Email</dt><dd>${esc(auth.user.email)}</dd></div>
        <div><dt>Access level</dt><dd>${p.is_admin ? `<span class="pill ok">Admin</span>` : accessPill(p.tier)}</dd></div>
        <div><dt>Member since</dt><dd>${fmtDate(p.created_at)}</dd></div>
      </dl>
      ${p.is_admin ? `<a class="btn" href="#/admin">Open admin</a>` : ""}
    </div>
    <div>
      <form class="form" id="profileForm" novalidate>
        <div class="two">
          <div class="field"><label for="p-name">Name</label><input id="p-name" name="full_name" type="text" value="${esc(p.full_name || "")}"></div>
          <div class="field"><label for="p-firm">Firm</label><input id="p-firm" name="firm" type="text" value="${esc(p.firm || "")}"></div>
        </div>
        <div class="cta-row"><button class="btn" type="submit">Save</button><button class="btn link" type="button" id="signoutBtn">Sign out</button></div>
        <div id="formMsg" hidden></div>
      </form>
      <hr class="rule my-36">
      <form class="form" id="passwordForm" novalidate>
        <p class="eyebrow bare">Change password</p>
        <div class="three">
          <div class="field"><label for="cp-current">Current password</label><input id="cp-current" name="current" type="password" autocomplete="current-password" required>${store.mode === "demo" ? `<span class="hint">Demo mode: <code>${esc(DEMO_PASSWORD)}</code></span>` : ""}</div>
          <div class="field"><label for="cp-new">New password</label><input id="cp-new" name="password" type="password" autocomplete="new-password" minlength="12" required></div>
          <div class="field"><label for="cp-new2">Confirm new password</label><input id="cp-new2" name="password2" type="password" autocomplete="new-password" minlength="12" required></div>
        </div>
        <div class="cta-row"><button class="btn ghost" type="submit">Update password</button></div>
        <div id="passwordMsg" hidden></div>
      </form>
    </div>
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
  const tabs = [["", "Overview"], ["writeups", "Writeups"], ["members", "Members"], ["requests", "Requests"], ["content", "Content"]];
  return `
  ${pageHead("Admin", "Research desk", "")}
  <section class="admin">
    <nav class="admin-nav" aria-label="Admin">${tabs.map(([k, l]) => `<a href="#/admin${k ? "/" + k : ""}" ${tab === k ? 'aria-current="page"' : ""}>${l}</a>`).join("")}</nav>
    <div class="admin-main">${inner}</div>
  </section>`;
}
const denied = () => `<section class="page-body pt-80"><p class="eyebrow">Admin</p><h2>Sign in with an admin account to continue.</h2><p><a class="btn" href="#/signin">Sign in</a></p></section>`;

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
      ${sorted.map(s => `<tr><td><div class="title">${esc(s.title)}</div><div class="bar"><i data-width="${Math.round(100 * Number(s.views_total) / max)}"></i></div></td><td class="num">${Number(s.views_total).toLocaleString()}</td><td class="num">${Number(s.views_7d).toLocaleString()}</td><td class="num">${Number(s.signed_in_viewers).toLocaleString()}</td></tr>`).join("") || `<tr><td colspan="4" class="empty">No views yet.</td></tr>`}
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
  const n = isNew ? { id: null, slug: "", title: "", summary: "", sector: "", type: "Initiation", access: "member", read_time: "", status: "draft", published_at: todayISO(), file_path: null, version: 1, kill_triggered_at: null } : await store.getNote(slug);
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
      <div class="field"><label for="e-body">Body</label><textarea id="e-body" name="body" class="body" placeholder="Paragraphs separated by a blank line. Start a line with ## for a heading, - for a bullet.">${esc(body)}</textarea><span class="hint">Only readers with the access level above ever receive this text — it is never sent to guests.</span>
        <details class="body-help"><summary>Rich content blocks (stat tiles, cards, charts…)</summary><div class="prose small"><p>Wrap a section between a <code>::type</code> line and a line with just <code>::</code>. Rows inside <code>::stats</code>/<code>::cards</code>/<code>::table</code>/<code>::flow</code> are pipe-separated (<code>label | value | detail</code>).</p><ul>
          <li><code>::callout thesis</code> / <code>insight</code> / <code>caveat</code> / <code>disconfirm</code> — optionally followed by a custom label, e.g. <code>::callout caveat Read carefully</code></li>
          <li><code>::stats</code> — rows of <code>label | value | detail</code>, rendered as stat tiles</li>
          <li><code>::cards</code> — rows of <code>tag | title | body | footnote</code>, rendered as a card grid</li>
          <li><code>::table</code> — first row is the header, rest are data rows</li>
          <li><code>::flow</code> — rows of <code>eyebrow | title | body</code>, rendered as a numbered sequence</li>
          <li><code>::barchart Title</code> / <code>::donut Title</code> — rows of <code>label | value</code></li>
          <li><code>![Caption](path-or-url)</code> on its own line — an image, alone in its paragraph</li>
        </ul></div></details></div>
      <div class="two">
        <div class="field"><label for="e-file">Attached document (PDF or spreadsheet, optional)</label><input id="e-file" name="file" type="file" accept=".pdf,.xlsx,.xls,.csv,.docx"><span class="hint">${n.file_path ? "Current: " + esc(n.file_path.split("/").pop()) + " — uploading replaces it." : "Stored privately; only entitled readers can download it."}</span></div>
        <div class="field"><label for="e-status">Status</label><select id="e-status" name="status"><option value="draft" ${n.status === "draft" ? "selected" : ""}>Draft — hidden from readers</option><option value="published" ${n.status === "published" ? "selected" : ""}>Published</option></select></div>
      </div>
      <div class="field"><label for="e-kill">Kill condition triggered on</label><input id="e-kill" name="kill_triggered_at" type="date" value="${esc(n.kill_triggered_at || "")}"><span class="hint">Leave blank while the thesis holds. Shown on the writeup as "Not triggered" / "Triggered on [date]".</span></div>
      <div class="cta-row"><button class="btn" type="submit" id="saveBtn">Save</button><button class="btn ghost" type="button" id="previewBtn">Preview</button>${isNew ? "" : `<button class="btn danger sm" type="button" data-del="${esc(n.id)}">Delete</button>`}<span class="small muted" id="saveState"></span></div>
      <div id="formMsg" hidden></div>
    </form>
    <div id="editPreview" hidden></div>`);
}

// Renders the draft exactly as an entitled reader would see the published note — same markup, same
// CSS classes as noteView() — from whatever's currently typed in the editor, without saving it.
function renderEditPreview(f){
  const title = (f.get("title") || "").trim() || "Untitled writeup", summary = (f.get("summary") || "").trim();
  const sector = (f.get("sector") || "").trim(), type = f.get("type"), access = f.get("access"), status = f.get("status");
  const pub = f.get("published_at") || "", kill = f.get("kill_triggered_at") || "", bodyText = f.get("body") || "";
  const file = f.get("file");
  return `
    <div class="admin-head"><h3>Preview</h3><button class="btn ghost sm" type="button" id="closePreview">← Back to editing</button></div>
    <p class="small muted">Shown as it will look to a reader with ${esc(ACCESS_LABEL[access])} access or higher. Nothing is saved by viewing this.</p>
    <div class="hairline-frame">
      <section class="note-head" data-reveal-group>
        <p class="eyebrow">${esc(type)} · ${esc(sector)}${status === "draft" ? " · Draft (only admins can see this)" : ""}</p>
        <h1 class="note-title">${esc(title)}</h1>
        <p class="lede">${esc(summary)}</p>
        <dl class="meta">
          <div><dt>Published</dt><dd>${fmtDate(pub)}</dd></div>
          <div><dt>Sector</dt><dd>${esc(sector)}</dd></div>
          <div><dt>Type</dt><dd>${esc(type)}</dd></div>
          <div><dt>Access</dt><dd>${accessPill(access, status)}</dd></div>
          <div><dt>Kill condition</dt><dd>${kill ? `Triggered on ${fmtDate(kill)}` : "Not triggered"}</dd></div>
        </dl>
      </section>
      <section class="note-body">
        <div class="section-rail"><p class="eyebrow">Writeup</p></div>
        <div>
          <div class="prose">${renderBody(bodyText)}</div>
          ${file && file.size > 0 ? `<p class="small muted pdf-note">A document is attached — entitled readers will also see the protected viewer for it here; previewing an uploaded file isn't shown in this draft view.</p>` : ""}
          <p class="disclosure">Disclosure: Prajit Research and its principals may hold positions in securities discussed and may trade them without notice. This writeup is not investment advice. See the <a href="#/disclaimer">Disclaimer</a> and <a href="#/copyright">Copyright</a> terms.</p>
        </div>
      </section>
    </div>`;
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

async function adminContent(){
  const overrides = Object.fromEntries((await store.listContent()).map(r => [r.key, r.value]));
  const fields = flattenContent(SITE_DEFAULTS).map(f => ({ key: f.key, value: overrides[f.key] ?? f.value, group: f.key.split(/[.[]/)[0] }));
  const groups = [...new Set(fields.map(f => f.group))];
  return adminShell("content", `
    <div class="admin-head"><h3>Site content</h3><span class="small muted">Edit the copy shown across the public site — home page, philosophy, process, about, plans, disclaimer, copyright. Changes apply immediately, everywhere that text appears.</span></div>
    <form class="form wide" id="contentForm">
      ${groups.map(g => `
        <fieldset class="content-group"><legend>${esc(CONTENT_GROUP_LABEL[g] || g)}</legend>
          ${fields.filter(f => f.group === g).map(f => `
            <div class="field"><label for="c-${esc(f.key)}">${esc(contentLabel(f.key))}</label>
              ${f.value.length > 90 || f.value.includes("\n")
                ? `<textarea id="c-${esc(f.key)}" data-content-key="${esc(f.key)}" data-original="${esc(f.value)}">${esc(f.value)}</textarea>`
                : `<input id="c-${esc(f.key)}" type="text" data-content-key="${esc(f.key)}" data-original="${esc(f.value)}" value="${esc(f.value)}">`}
            </div>`).join("")}
        </fieldset>`).join("")}
      <div class="cta-row"><button class="btn" type="submit" id="contentSaveBtn">Save changes</button><span class="small muted" id="contentSaveState"></span></div>
      <div id="contentMsg" hidden></div>
    </form>`);
}

/* =====================================================================
   RENDER + WIRING
   ===================================================================== */
let renderGen = 0;
let adminFontLoaded = false;
function ensureAdminFont(){
  if (adminFontLoaded) return;
  adminFontLoaded = true;
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap";
  document.head.appendChild(link);
}

async function render(){
  const myGen = ++renderGen;
  const r = route();
  document.documentElement.dataset.section = r.view === "admin" ? "admin" : "";
  if (r.view === "admin") ensureAdminFont();
  setNav(r.view);
  app.innerHTML = loading();
  let html = "";
  try {
    const isAdmin = auth && auth.profile.is_admin;
    switch (r.view){
      case "research": html = await researchView(); break;
      case "note": html = await noteView(r.arg); break;
      case "access": html = accessView(r.q); break;
      case "signup": html = signupView(); break;
      case "signin": html = signinView(r.q); break;
      case "forgot-password": html = forgotPasswordView(); break;
      case "reset-password": html = resetPasswordView(); break;
      case "account": html = accountView(); break;
      case "disclaimer": html = legalView("disclaimer"); break;
      case "copyright": html = legalView("copyright"); break;
      case "admin":
        if (!isAdmin) html = denied();
        else if (r.arg === "writeups") html = await adminWriteups();
        else if (r.arg === "edit") html = await adminEdit(r.arg2 || "new");
        else if (r.arg === "members") html = await adminMembers();
        else if (r.arg === "requests") html = await adminRequests();
        else if (r.arg === "content") html = await adminContent();
        else html = await adminOverview();
        break;
      default: html = await homeView();
    }
  } catch (e) {
    console.error(e);
    html = `<section class="page-body pt-60"><p class="eyebrow">Something went wrong</p><p class="err">${esc(e.message || e)}</p></section>`;
  }
  // A newer render() was triggered while this one was fetching data (rapid navigation) — abandon
  // this stale render entirely rather than racing an already-superseded page onto the screen.
  if (myGen !== renderGen) return;
  const finish = () => {
    app.innerHTML = html;
    document.title = r.view === "note" ? `${(app.querySelector(".note-title") || {}).textContent || CFG.brand} — ${CFG.brand}` : CFG.brand;
    wire(r);
    if (r.view === "home" && r.arg){ const el = document.getElementById(r.arg); if (el) el.scrollIntoView({ behavior: "auto", block: "start" }); }
    else window.scrollTo(0, 0);
    if (window.Motion) Motion.mount(app);
  };
  const reduced = window.Motion && Motion.reducedMotion;
  if (!reduced && document.startViewTransition && !vtActive){
    // Guarded by vtActive: starting a second view transition before the first has fully settled
    // doesn't just "skip" instantly in practice — it can serialize behind it, visibly delaying this
    // render. Rapid navigation (e.g. sign-out immediately followed by a route change) falls back to
    // the plain fade path below instead, which never has that queuing risk.
    vtActive = true;
    const vt = document.startViewTransition(() => finish());
    vt.ready.catch(() => {});
    vt.finished.catch(() => {}).then(() => { vtActive = false; });
  }
  else if (!reduced && window.Motion){ await Motion.fadeOut(app, 150); if (myGen !== renderGen) return; finish(); Motion.fadeIn(app, 320); }
  else finish();
}

const showMsg = (html, id = "formMsg") => { const m = document.getElementById(id); if (m){ m.hidden = false; m.innerHTML = html; if (window.Motion) Motion.fadeIn(m, 220); } };
const validEmail = e => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e);
const weakPassword = (pw, email) => pw.length < 12 || (!!email && pw.toLowerCase().includes(String(email).split("@")[0].toLowerCase()));
const DEMO_PASSWORD = "demo-pass-1234";
const DEMO_PDF_ASSETS = new Set(["subscriber/gmm-pfaudler-transformation-thesis.pdf", "free/adc-opportunity-2026.pdf"]);
const turnstileWidget = () => CFG.turnstileSiteKey ? `<div class="cf-turnstile" data-sitekey="${esc(CFG.turnstileSiteKey)}"></div>` : "";
const turnstileToken = () => { const el = document.querySelector('[name="cf-turnstile-response"]'); return el ? el.value || undefined : undefined; };

async function updateLedger(){
  const el = document.querySelector(".ledger");
  if (!el) return;
  const all = await store.listNotes();
  const s = search.trim().toLowerCase();
  const notes = all.filter(n => (filter === "All" || n.type === filter) && (!s || [n.title, n.summary, n.sector, n.type].join(" ").toLowerCase().includes(s)));
  document.querySelectorAll("[data-filter]").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.filter === filter)));
  if (window.Motion && !Motion.reducedMotion){ await Motion.fadeOut(el, 120); el.innerHTML = ledgerRows(notes); Motion.fadeIn(el, 200); }
  else el.innerHTML = ledgerRows(notes);
}

// Data-driven widths/colors (chart bars, donut swatches) are applied here via the CSSOM rather than
// as HTML style="" attributes, so they keep working once a Content-Security-Policy without
// 'unsafe-inline' for style-src is in place — style-src governs parsed HTML/attribute styles, not
// element.style.* assignments.
function applyDynamicStyles(root){
  root.querySelectorAll("[data-width]").forEach(el => { el.style.width = el.dataset.width + "%"; });
  root.querySelectorAll("[data-bg]").forEach(el => { el.style.background = el.dataset.bg; });
}

function wire(r){
  applyDynamicStyles(app);
  // library
  document.querySelectorAll("[data-filter]").forEach(b => b.addEventListener("click", () => { filter = b.dataset.filter; updateLedger(); }));
  const sb = document.getElementById("searchBox");
  if (sb){ let t; sb.addEventListener("input", () => { clearTimeout(t); t = setTimeout(() => { search = sb.value; updateLedger(); }, 120); }); }

  // protected document viewer (replaces the old raw-download link — nothing downloadable is ever
  // linked for entitled readers now, only rendered on-screen with a "PRAJIT RESEARCH" watermark baked in)
  const pv = document.getElementById("pdfViewer");
  if (pv){
    wireProtectedPdfGuards(pv);
    (async () => {
      let url = null;
      try { url = await store.fileUrl(pv.dataset.path); } catch (e) { console.error(e); }
      renderProtectedPdf(pv, url, "PRAJIT RESEARCH");
    })();
  }

  // access request
  const af = document.getElementById("accessForm");
  if (af) af.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(af), name = (f.get("name") || "").trim(), email = (f.get("email") || "").trim();
    if (!name || !validEmail(email)) return showMsg(`<p class="err">Add your name and a valid email address so we can reply.</p>`);
    const btn = document.getElementById("accessSubmit"); btn.disabled = true;
    try {
      await store.createRequest({ name, email, firm: (f.get("firm") || "").trim(), plan: "member", note: (f.get("note") || "").trim() });
      af.querySelectorAll("input,textarea,select,button").forEach(el => el.disabled = true);
      showMsg(`<div class="ok"><p class="eyebrow bare">Request received</p><p>Thank you. We reply within two business days${CFG.contactEmail ? ` from ${esc(CFG.contactEmail)}` : ""}.${store.mode === "demo" ? " (Demo mode: this request is visible in the admin Requests tab for this session only.)" : ""}</p></div>`);
    } catch (err) { btn.disabled = false; showMsg(`<p class="err">Could not send: ${esc(err.message)}</p>`); }
  });

  // sign up
  const suf = document.getElementById("signupForm");
  if (suf) suf.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(suf), email = (f.get("email") || "").trim();
    const first_name = (f.get("first_name") || "").trim(), last_name = (f.get("last_name") || "").trim();
    const password = f.get("password") || "", password2 = f.get("password2") || "";
    if (!validEmail(email)) return showMsg(`<p class="err">Enter a valid email address.</p>`);
    if (!first_name || !last_name) return showMsg(`<p class="err">Enter your first and last name.</p>`);
    if (weakPassword(password, email)) return showMsg(`<p class="err">Password must be at least 12 characters and not contain your email.</p>`);
    if (password !== password2) return showMsg(`<p class="err">Passwords don't match.</p>`);
    if (!f.get("terms")) return showMsg(`<p class="err">You must agree to the Disclaimer, Copyright &amp; Terms to create an account.</p>`);
    const btn = document.getElementById("signupSubmit"); btn.disabled = true;
    try {
      const res = await store.signUp(email, password, { first_name, last_name, firm: (f.get("firm") || "").trim() }, turnstileToken());
      if (res.needsConfirmation) showMsg(`<div class="ok"><p class="eyebrow bare">Check your email</p><p>We've sent a confirmation link to <b>${esc(email)}</b>. Open it to activate your account, then come back and sign in.</p></div>`);
      else { toast(store.mode === "demo" ? "Demo mode: account created" : "Account created"); auth = await store.getSession(); location.hash = "#/account"; }
    } catch (err) { btn.disabled = false; showMsg(`<p class="err">${esc(err.message)}</p>`); }
  });

  // sign in — password
  const sf = document.getElementById("signinForm");
  if (sf) sf.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(sf), email = (f.get("email") || "").trim(), password = f.get("password") || "";
    if (!validEmail(email) || !password) return showMsg(`<p class="err">Enter your email and password.</p>`);
    const btn = document.getElementById("signinSubmit"); btn.disabled = true;
    try { await store.signInWithPassword(email, password); auth = await store.getSession(); toast("Signed in"); location.hash = "#/account"; }
    catch (err) { btn.disabled = false; showMsg(`<p class="err">${esc(err.message)}</p>`); }
  });

  // forgot password
  const ff = document.getElementById("forgotForm");
  if (ff) ff.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(ff), email = (f.get("email") || "").trim();
    if (!validEmail(email)) return showMsg(`<p class="err">Enter a valid email address.</p>`);
    const btn = document.getElementById("forgotSubmit"); btn.disabled = true;
    try { await store.requestPasswordReset(email, turnstileToken()); }
    catch (_) { /* never reveal whether the account exists */ }
    finally { showMsg(`<div class="ok"><p class="eyebrow bare">Check your email</p><p>If an account exists for <b>${esc(email)}</b>, we've sent instructions to reset your password.${store.mode === "demo" ? " (Demo mode: password reset isn't available here — this works on the live site.)" : ""}</p></div>`); }
  });

  // reset password (only reachable via a real recovery link on the live site)
  const rf = document.getElementById("resetForm");
  if (rf) rf.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(rf), password = f.get("password") || "", password2 = f.get("password2") || "";
    if (weakPassword(password, auth?.user?.email)) return showMsg(`<p class="err">Password must be at least 12 characters and not contain your email.</p>`);
    if (password !== password2) return showMsg(`<p class="err">Passwords don't match.</p>`);
    const btn = document.getElementById("resetSubmit"); btn.disabled = true;
    try { await store.updatePassword(password); toast("Password updated"); auth = await store.getSession(); location.hash = "#/account"; }
    catch (err) { btn.disabled = false; showMsg(`<p class="err">${esc(err.message)}</p>`); }
  });

  // account
  const pf = document.getElementById("profileForm");
  if (pf) pf.addEventListener("submit", async e => { e.preventDefault(); const f = new FormData(pf); try { await store.updateProfile({ full_name: (f.get("full_name") || "").trim(), firm: (f.get("firm") || "").trim() }); auth = await store.getSession(); toast("Saved"); render(); } catch (err) { showMsg(`<p class="err">${esc(err.message)}</p>`); } });
  const so = document.getElementById("signoutBtn");
  if (so) so.addEventListener("click", async () => { await store.signOut(); auth = null; renderChrome(); location.hash = "#/"; toast("Signed out"); });

  // account — change password
  const cpf = document.getElementById("passwordForm");
  if (cpf) cpf.addEventListener("submit", async e => {
    e.preventDefault();
    const f = new FormData(cpf), current = f.get("current") || "", password = f.get("password") || "", password2 = f.get("password2") || "";
    const email = auth?.user?.email || "";
    if (weakPassword(password, email)) return showMsg(`<p class="err">New password must be at least 12 characters and not contain your email.</p>`, "passwordMsg");
    if (password !== password2) return showMsg(`<p class="err">New passwords don't match.</p>`, "passwordMsg");
    const btn = cpf.querySelector("button[type=submit]"); btn.disabled = true;
    try { await store.reauthenticate(email, current); await store.updatePassword(password); showMsg(`<div class="ok"><p>Password updated. Other signed-in devices have been signed out.</p></div>`, "passwordMsg"); cpf.reset(); }
    catch (err) { showMsg(`<p class="err">${esc(err.message)}</p>`, "passwordMsg"); }
    finally { btn.disabled = false; }
  });

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
        status: f.get("status"), published_at: f.get("published_at") || null, read_time: readTime(f.get("body")), file_path: ef.dataset.file || null,
        kill_triggered_at: f.get("kill_triggered_at") || null
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
    const previewBtn = document.getElementById("previewBtn"), previewPane = document.getElementById("editPreview");
    previewBtn.addEventListener("click", () => {
      previewPane.innerHTML = renderEditPreview(new FormData(ef));
      document.documentElement.dataset.section = ""; // show the real public theme while previewing, not the dark admin skin
      ef.hidden = true; previewPane.hidden = false;
      window.scrollTo(0, 0);
      if (window.Motion) Motion.mount(previewPane);
    });
    previewPane.addEventListener("click", e => {
      if (!e.target.closest("#closePreview")) return;
      document.documentElement.dataset.section = "admin";
      previewPane.hidden = true; ef.hidden = false;
    });
  }

  // admin: members + requests
  document.querySelectorAll("[data-tier]").forEach(s => s.addEventListener("change", async () => { try { await store.setTier(s.dataset.tier, s.value); toast("Access updated"); } catch (e) { toast("Failed: " + e.message); render(); } }));
  document.querySelectorAll("[data-req]").forEach(b => b.addEventListener("click", async () => { try { await store.updateRequest(b.dataset.req, b.dataset.status); toast(b.dataset.status === "approved" ? "Approved" : "Declined"); render(); } catch (e) { toast("Failed: " + e.message); } }));

  // admin: site content
  const cf = document.getElementById("contentForm");
  if (cf){
    cf.addEventListener("submit", async e => {
      e.preventDefault();
      const changed = [...cf.querySelectorAll("[data-content-key]")]
        .filter(el => el.value !== el.dataset.original)
        .map(el => ({ key: el.dataset.contentKey, value: el.value }));
      if (!changed.length){ toast("Nothing changed"); return; }
      const btn = document.getElementById("contentSaveBtn"); btn.disabled = true; document.getElementById("contentSaveState").textContent = "Saving…";
      try {
        await store.saveContent(changed);
        changed.forEach(({ key, value }) => setByPath(SITE, key, value));
        changed.forEach(({ key, value }) => { const el = cf.querySelector(`[data-content-key="${CSS.escape(key)}"]`); if (el) el.dataset.original = value; });
        toast("Saved"); document.getElementById("contentSaveState").textContent = ""; btn.disabled = false;
      } catch (err) { btn.disabled = false; document.getElementById("contentSaveState").textContent = ""; showMsg(`<p class="err">Could not save: ${esc(err.message)}</p>`, "contentMsg"); }
    });
  }
}

boot();
})();
