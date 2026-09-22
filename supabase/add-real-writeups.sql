-- Adds/updates two real writeups: the GMM Pfaudler thesis and the ADC opportunity report.
-- Safe to run more than once (upserts by slug). Paste this into Supabase SQL Editor and run it,
-- same way you ran schema.sql. After running this, open each writeup in Admin -> Writeups and
-- attach its original PDF (Upload document) -- that step can't be done from SQL.

with wu_gmm_pfaudler_transformation_thesis as (
  insert into public.notes (slug, title, summary, sector, type, access, read_time, status, published_at, version)
  values ($wu$gmm-pfaudler-transformation-thesis$wu$, $wu$GMM Pfaudler: From Engineering Company to Global Process-Technology Platform$wu$, $wu$The acquisition phase is over. The extraction phase — integrating technologies, shifting into higher-value end markets, and converting EBIT into PAT — is the thesis now.$wu$, $wu$Industrials$wu$, $wu$Initiation$wu$, $wu$subscriber$wu$, $wu$4 min$wu$, 'published', current_date, 1)
  on conflict (slug) do update set
    title = excluded.title, summary = excluded.summary, sector = excluded.sector, type = excluded.type,
    access = excluded.access, read_time = excluded.read_time, status = excluded.status,
    published_at = excluded.published_at, updated_at = now()
  returning id
)
insert into public.note_bodies (note_id, body)
select id, $wu$The core thesis: the acquisition phase is largely over. GMM Pfaudler is now entering the extraction phase — integrating technologies, shifting into higher-value end markets, improving margins and converting EBIT into PAT.

## Two-Phase Transformation

- Phase 1 (2015–2025) — Acquisition-Led Platform: Pfaudler, SEMCO and other bolt-ons build global scale and technology breadth.
- Phase 2 (FY27 onwards) — Integration-Led Value Creation: four global divisions convert scale into margin, cash flow and EBIT-to-PAT conversion.

## Parent Company and Management

GMM Pfaudler Limited (NSE/BSE: GMMPFAUDLR) is itself the ultimate global holding company — since its 2020 acquisition of a majority stake in the Pfaudler Group, previously owned by Germany's Deutsche Beteiligungs AG (DBAG). Ownership: Patel Promoter Family approximately 22%, Deutsche Beteiligungs AG (DBAG) approximately 32%, public float approximately 44%+. A structure that deliberately combines promoter family, professional management and private equity — designed, per management, to "extract synergies and create value for all stakeholders."

- Ashok Patel — Executive Chairman, Mavag AG. 50+ years in capital goods; Director since 1972; Managing Director 1988–2015. Embodies the three-generation family legacy behind the group.
- Tarak Patel — Managing Director. Third generation of the founding family; led the 2020 acquisition of majority control in the Pfaudler Group that created today's global platform.
- Gregory Gelhaus — Group Chief Executive Officer (since May 2026). Previously Group Chief Transformation Officer (2025–26); now leads execution of the four-division global reorganization.
- Alexander Poempner — Group Chief Financial Officer (since Feb 2025). Driving deleveraging, capital allocation and simplification of the legal and financing architecture inherited from the Pfaudler acquisition.

Recent transition: Thomas Kehl, CEO – International Business, retired effective August 31, 2026 — part of a broader leadership renewal running alongside the divisional reorganization.

## From Regional Silos to Four Global Technology Divisions

Before: a region-led structure — 24–25 operating entities run across India, Europe and the Americas; P&L accountability organised by geography, not technology; limited cross-selling across product lines; fragmented legal and financing architecture, a legacy of the Pfaudler acquisition.

- CRT — Corrosion Resistance Technologies: glass-lined reactors and equipment, the group's traditional core. ₹466 Cr revenue, +10% YoY; order intake +23% YoY.
- PPT — Process Performance Technologies: filtration, drying and process performance for pharma and F&B. ₹255 Cr revenue, +23% YoY; order intake +64% YoY.
- HET — Heavy Engineering Technologies: defence, nuclear and fertiliser-linked heavy engineering. ₹74 Cr revenue, flat YoY; order intake +719% YoY.
- PST — Process Systems Technologies: semiconductor, defence and pharma process systems. Revenue +46% YoY; the fastest-growing division.

Management rationale: sharper accountability, faster decision-making and synergies across technologies, manufacturing and go-to-market teams — creating cross-selling and global engineering leverage that a region-led structure could not.

## Diversification Into Higher-Value End Markets

The same technology platform is being redeployed from traditional chemical process markets into eight adjacent, higher-value end markets: Pharma/CDMO (PPT, PST), Semiconductors (PST), Defence (HET, PST), Nuclear (HET), Power (HET, CRT), Oil & Gas (CRT), Petrochemicals (CRT), and Mining (CRT).

Evidence in the numbers: HET order intake up 719% YoY on defence, nuclear and fertiliser demand; PST revenue up 46% YoY on semiconductor, defence and pharma opportunities.

## Q1 FY27 Proof Points

- Revenue: ₹925 Cr, +16% YoY.
- EBITDA: ₹94 Cr, −7% YoY, 10.1% margin.
- PAT: ₹22 Cr, +118% YoY.
- Order backlog: ₹2,289 Cr, record, +20% YoY.

## Read Carefully

PAT growth was driven primarily by lower finance costs (₹22.7 Cr vs ₹42.9 Cr in Q1 FY26) and a forex restatement gain, not yet by EBITDA margin expansion — EBITDA actually declined 7% YoY on pricing pressure, mix shift and restructuring costs. The transformation thesis therefore still needs EBITDA margin recovery to be proven, not just PAT conversion.

70% of the current order backlog is expected to execute within 10–12 months, improving FY27 revenue visibility versus the multi-year projects that dominated the book a year ago.

## Balance Sheet Strength Funds the Transformation

- Net debt / equity: 0.1×, low leverage.
- Net debt / adjusted EBITDA: 0.4×, improved from 0.5× in FY25.
- FY26 free cash flow: ₹367 Cr, +₹49 Cr YoY, FCF/EBITDA above 90%.
- Planned debt repayment: €7m by Q2 FY27, via internal accruals.

- A sub-0.5× net debt/EBITDA position and free-cash-flow conversion above 90% of EBITDA mean the restructuring is being funded internally, not via fresh leverage.
- The €7m repayment continues a deleveraging trend (0.5× → 0.4×) rather than a one-off gesture.
- Management has flagged further simplification of the legal and financing architecture inherited from the Pfaudler acquisition — a structural tailwind for future EBIT-to-PAT conversion.

## Investment Framework: What Needs to Happen for Re-Rating

The transformation thesis is not proven by backlog and organisational charts alone. These are the checkpoints that would confirm extraction-phase value creation is real.

- EBITDA margin recovery toward the 15% target — from 10.1% in Q1 FY27, the single most important number to track each quarter.
- EBIT-to-PAT conversion sustained without one-offs — Q1 FY27's PAT jump leaned on lower finance costs and forex gains, not operating leverage.
- Cross-divisional synergies showing up in numbers — cross-selling and global engineering leverage across CRT, PPT, HET and PST.
- Backlog converting into billed revenue — 70% of the ₹2,289 Cr backlog executing within 10–12 months, as guided.
- Continued deleveraging and structural simplification — further reduction from 0.4× net debt/Adj. EBITDA and legal-entity rationalisation.

Framing note: consistent with Prajit Research methodology, this thesis is expressed as an aggregate value-creation and re-rating framework — not a per-share price target.

This document is for informational and educational purposes only and does not constitute investment advice or a recommendation to buy or sell any security. Prajit Research and its authors may or may not hold positions in the securities discussed. Past performance is not indicative of future results. Readers should conduct independent due diligence and consult a qualified financial advisor before making investment decisions.$wu$ from wu_gmm_pfaudler_transformation_thesis
on conflict (note_id) do update set body = excluded.body;

with wu_adc_opportunity_2026 as (
  insert into public.notes (slug, title, summary, sector, type, access, read_time, status, published_at, version)
  values ($wu$adc-opportunity-2026$wu$, $wu$ADC: The Next Frontier in Pharma$wu$, $wu$Why the enabling ecosystem may outweigh the molecule — a thesis on the industrial ecosystem behind antibody-drug conjugates, and India's potential role in the global value chain.$wu$, $wu$Healthcare$wu$, $wu$Framework$wu$, $wu$free$wu$, $wu$16 min$wu$, 'published', current_date, 1)
  on conflict (slug) do update set
    title = excluded.title, summary = excluded.summary, sector = excluded.sector, type = excluded.type,
    access = excluded.access, read_time = excluded.read_time, status = excluded.status,
    published_at = excluded.published_at, updated_at = now()
  returning id
)
insert into public.note_bodies (note_id, body)
select id, $wu$The molecule may be the headline. The enabling ecosystem — chemistry, containment, bioconjugation, analytics and supply — can contain the larger and more durable pool of investable value.

## Executive Summary

Antibody–drug conjugates (ADCs) are routinely described as a new generation of targeted oncology medicines. That description is accurate but incomplete. The sharper question for an investor is not how many ADC drugs will reach the market — it is how much specialised chemistry, biologics capacity, bioconjugation capability, analytical infrastructure, containment engineering and supply-chain depth the modality will demand as it scales.

An ADC fuses three components: an antibody that recognises a tumour target, a linker that governs attachment and release, and a highly potent payload engineered to kill the target cell. That fusion sits at the intersection of biologics and high-potency small-molecule chemistry — and the intersection, not the molecule alone, is where the industrial map gets interesting. A single ADC programme can touch antibody development, payload-linker chemistry, high-potency API (HPAPI) handling, conjugation, purification, analytical characterisation, sterile fill-finish, quality systems and global regulatory supply chains.

The ADC opportunity should be studied as an ecosystem, not merely as a list of prospective blockbuster drugs.

The global evidence supports the direction of travel. Literature published around mid-2024 counted 15 clinically approved ADCs and close to 100 candidates in active clinical investigation — with other reviews citing substantially higher trial counts depending on definition. A 2025 SEC filing cited industry estimates placing ADC sales at roughly US$11 billion at the end of 2024, rising above US$23 billion by 2030, while flagging that some estimates run materially higher. The precise forecast matters less than the widening economic surface area created by a technically demanding modality.

India enters the conversation with a substantial existing export base: pharmaceutical exports reached US$30.47 billion in FY2024-25, up 9.4% year over year, and the government's ₹10,000-crore Biopharma SHAKTI programme is now layered on top, targeting more than 1,000 accredited clinical-trial sites and stronger biologics infrastructure over five years. But scale in conventional pharma does not automatically translate into ADC capability. The opportunity opens only if Indian manufacturers climb the complexity curve — from bulk chemistry toward integrated, high-potency, biologics-grade and analytically rigorous operations. That climb, and who is best positioned to make it, is the second and third derivative this report is built to trace.

## 1. What Exactly Is an ADC?

An antibody–drug conjugate is best understood as a molecular delivery system rather than a conventional drug. Instead of exposing the body to a potent cytotoxic agent indiscriminately, the construct uses an antibody to recognise a specific tumour antigen, internalise, and release its payload inside or adjacent to the target cell.

## Three Components, One Engineering Problem

- Antibody — provides target recognition and biological specificity.
- Linker — bridges antibody and payload; governs circulation stability and release kinetics.
- Payload — delivers the pharmacological killing mechanism.

The complexity begins where these three components meet. ADC payloads are commonly 100–1,000 times more potent than conventional chemotherapeutics, with activity in the sub-nanomolar or even picomolar range. The industrial consequence is blunt: a kilogram of ADC payload carries none of the manufacturing-risk equivalence of a kilogram of conventional API. Worker protection, environmental controls, segregation, cleaning validation, analytical sensitivity and containment move from good practice to commercial necessity.

The drug-to-antibody ratio (DAR) — the average number of payload molecules per antibody — is a second design axis. DAR is not a simple "more is better" metric; loading, homogeneity, pharmacokinetics, stability and toxicity must be balanced simultaneously, and modern design has moved past the assumption that every viable construct must sit inside a narrow historical DAR band. An ADC, in short, is not a biologic with a small molecule bolted on — it is a tightly engineered product whose performance depends on the interaction of biology, chemistry, process engineering and analytics.

## 2. Why ADC Manufacturing Differs From Conventional Pharma

Conventional generic manufacturing rewards scale, process efficiency, procurement discipline and regulatory execution. ADC manufacturing adds several layers of technical differentiation on top of that base.

- Hybrid construction — the antibody side demands mammalian-cell (or equivalent) biologics capability, purification and viral-safety control; the payload-linker side demands complex organic synthesis and high-potency containment; conjugation must combine both without compromising antibody function or product quality.
- Process sensitivity — small shifts in conjugation conditions can alter payload distribution, aggregation, potency, impurity profile or stability.
- Analytical intensity — characterisation typically requires multiple orthogonal techniques to establish identity, purity, aggregation, DAR distribution, linker integrity and free payload.
- Facility design — containment strategy for HPAPI manufacture must reconcile product protection with worker and environmental protection from highly potent materials.

ADCs create a wider moat of complexity. Competitive advantage need not sit only with whoever owns the molecule — it can also accrue to suppliers who repeatedly solve difficult manufacturing, analytical and regulatory problems.

## 3. The Global Signal: From Novel Modality to Growing Platform

The ADC story has moved past proof of concept. The first approval dates to 2000, but the field accelerated sharply over the following two decades. Reviews from 2024 report 15 clinically approved ADCs and nearly 100 in clinical investigation; another review counted 189 ADCs under active clinical evaluation at an earlier cut-off — a spread that illustrates how sharply pipeline counts vary by whether the unit of measurement is an asset, an indication, a trial or a programme. The direction, regardless of the exact count, is unambiguous: ADCs have become a platform technology rather than a single drug class.

The opportunity is materially broader than the current approved-drug base — published counts show roughly 15 approved ADCs against close to 100 ADC candidates in clinical investigation, built up over two decades of steady, accelerating regulatory approval, from the first approval in 2000 to 15 cumulative approvals by 2025.

The pipeline is diversifying across breast and other solid tumours, lung cancer, urothelial cancer, haematological malignancies, ovarian and gynaecological cancers, and an emerging set of novel targets and payload classes, alongside next-generation formats such as site-specific conjugation and multi-payload constructs. Published trial-registry analysis puts the concentration in sharp relief: breast and lung cancer alone account for well over 60% of active ADC trials — breast cancer 38%, lung cancer 22%, other indications (urothelial, haematological, ovarian/gynaecological and other) 40%.

Published market estimates indicate substantial growth potential: an illustrative lower-bound trajectory runs from roughly US$11B in 2024 to US$23B by 2030E, though scope and definitions vary across providers. Prajitresearch does not treat any single market-size estimate as a precise target — the more durable observation is that a growing ADC market creates demand at multiple layers of the value chain simultaneously. That layered demand is the core of the ecosystem thesis.

## 4. The ADC Value Chain: Seven Places Where Value Can Accumulate

The most useful lens for this opportunity is decomposition — breaking the molecule down into the capabilities required to create it, rather than treating it as a single product decision. The seven stages: Target/Antibody (biology), Payload + Linker (complex chemistry), Bioconjugation (process science), Purification (downstream), Analytics (characterisation), Fill/Finish (sterility), and Clinical + Supply (regulatory).

- Target and antibody — antibody discovery, expression systems, cell culture, purification and specialised biologics manufacturing.
- Payload and linker chemistry — among the most technically demanding steps: extreme potency, circulation-stable yet efficiently releasable linkers, specialised starting materials and tight impurity control.
- HPAPI manufacturing — dedicated containment, isolators, closed handling, specialised HVAC, waste management and occupational-exposure control; capital- and expertise-intensive by nature.
- Bioconjugation — the bridge between biologics and chemistry; the goal is a reproducible molecule with controlled loading, not merely an "attached" payload.
- Purification — removal of unreacted components, aggregates and impurities while preserving product; a key determinant of yield and quality.
- Analytics — an unusually rich analytical problem spanning identity, purity, aggregation, DAR, payload distribution, free payload, linker integrity and stability.
- Fill-finish and global supply — sterile processing, packaging, cold-chain logistics, quality release, documentation and distribution.

These are not seven independent markets — they are interdependent capabilities. A developer may need several simultaneously, which raises the value of integrated or tightly coordinated suppliers.

## 5. Why India Is Relevant, But the Thesis Is Not Low-Cost India

India's pharmaceutical industry already carries a global manufacturing footprint. Exports reached US$30.47 billion in FY2024-25, up 9.4% year over year, spread across a large number of markets and built on extensive experience operating inside demanding regulatory regimes. That base matters because ADCs do not start from zero in India — but the opportunity is not simply to reproduce the generic-drug playbook at a higher price. ADCs require a genuine capability transition.

Capability transition: generics → complex chemistry → HPAPI → biologics → bioconjugation → integrated ADC development and manufacturing.

India's existing strengths can plausibly support several stages of that journey: complex organic synthesis, process chemistry, analytical chemistry, pharmaceutical engineering, regulated manufacturing, cost-efficient development, export-oriented supply chains and an expanding biologics ecosystem. The 2026 policy environment adds tailwind: the government's ₹10,000-crore Biopharma SHAKTI programme is designed to strengthen domestic biologics and biosimilar capability over five years, with proposed measures spanning discovery funding, research networks, clinical-trial capacity, specialised training and manufacturing infrastructure.

The India Bioeconomy Report 2026 puts India's BioPharma segment at US$64.5 billion in 2025, up from US$58.4 billion in 2024; within that, biotherapeutics were reported at US$24.36 billion in 2025 versus US$21.40 billion in 2024. None of this is ADC revenue — it is evidence of a broader capability base into which ADC manufacturing could fit. The distinction is not cosmetic: a country can carry a large pharmaceutical market and still lack deep ADC capability, while a small number of technically specialised suppliers can become strategically important simply by meeting global quality, containment and reliability requirements.

## Where India Sits on the Global Map Today

Placed alongside the regions already active in ADC manufacturing, India's position is best described as an emerging node rather than an established or fast-scaling one. The US and EU retain the bulk of installed bioconjugation capacity — Lonza alone is estimated to hold roughly 12% of global contract bioconjugation share. South Korea has moved fastest among challengers, with Samsung Biologics, Lotte Biologics and SK pharmteco each committing dedicated ADC lines and cross-partnerships since 2024. China is scaling rapidly through integrated CDMO platforms such as WuXi and Chime Biologics. India's chemistry and export base gives it a credible entry point, but bioconjugation and HPAPI capacity at global scale remain largely still to be built.

## 6. The Second Derivative: The Companies Behind the Molecule

Investors typically begin with a binary question — which company will discover the next blockbuster ADC? A sharper industrial question displaces it: which capabilities must exist regardless of which ADC wins?

If the number of ADC programmes expands, demand can rise for payload intermediates, linker building blocks, highly potent APIs, specialised reactors and containment systems, isolators, antibody production and purification, conjugation services, chromatography and filtration, mass spectrometry and other analytical platforms, sterile fill-finish, specialised packaging, and quality and regulatory services. These are second-order beneficiaries precisely because their revenue does not hinge on any single drug becoming a blockbuster.

The third derivative extends the logic one step further — a supplier to the supplier: ADC developer → ADC manufacturing partner → analytical technology, containment, specialised chemistry or process-equipment provider. This is where an ecosystem-based research process can surface opportunities that a conventional top-down sector screen misses entirely.

"Exposure to ADC" is not enough. The research question is evidence of capability conversion — customer qualification, repeat projects, utilisation, regulatory milestones, capacity expansion, technical hiring, process validation and revenue contribution.

## 7. A Practical Research Framework for Finding ADC Enablers

Prajitresearch screens potential beneficiaries through six lenses, deliberately built to avoid treating "ADC" as a marketing keyword rather than a technical fact.

- Capability — does the business possess a technically difficult capability genuinely relevant to ADCs?
- Qualification — has that capability been accepted by regulated customers or validated through meaningful projects?
- Capacity — is there enough dedicated or suitably segregated capacity to scale?
- Conversion — is the capability translating into orders, programmes, recurring revenue or higher utilisation?
- Adjacency — can the same infrastructure serve adjacent modalities such as peptides, oligonucleotides, PROTACs or radiopharmaceuticals?
- Economics — does the business show pricing power, attractive asset turns, reasonable capital intensity and a path to improving returns?

A disciplined process presses further: what exactly is being supplied, and at which step of the value chain? Is the capability difficult to replicate and validated by global customers? How much of current revenue is genuinely exposed, how much capacity is being added, how sticky is the customer relationship, and is the capability transferable to other complex modalities? Equally — what could go wrong?

## 8. What Could Break the Thesis?

A credible investment thesis carries its own disconfirming evidence. ADC development remains scientifically and commercially difficult — a large clinical pipeline does not imply a proportional number of successful commercial drugs, and clinical failure, safety signals, target biology or manufacturing setbacks can all compress demand.

Technology can move quickly, too: a new linker chemistry, payload class, conjugation method or delivery format can erode the differentiation of existing capability overnight.

Capacity risk cuts the other way as well. If multiple companies build ADC facilities in parallel, utilisation can lag investment and pressure returns on capital. Regulation compounds the risk: high-potency chemistry and biologics manufacturing demand rigorous quality systems, containment and documentation, and a single quality event can dent customer confidence for years. Finally, not every ADC-linked supplier benefits equally — some are exposed only to development-stage projects, others depend on a single customer or molecule, and a third group may combine impressive capability with insufficient commercial scale.

The thesis is not "ADCs will grow, so every ADC-linked company wins." It is narrower: as ADC adoption grows, specialised capabilities that are difficult to reproduce may become increasingly valuable — but the value will accrue selectively.

## 9. The Investment Map: What to Look For

- High scientific intensity — payload chemistry, linker chemistry, bioconjugation, advanced analytics.
- High containment intensity — HPAPI manufacturing, potent-payload handling, dedicated suites, waste and HVAC controls.
- High biological intensity — antibody production, purification, cell culture, biologics process development.
- High integration intensity — end-to-end development from payload-linker through conjugation to final drug substance.
- High recurring potential — analytical testing, process services, repeat development programmes, validated manufacturing capacity.
- High optionality — platforms able to serve multiple complex modalities rather than a single ADC programme.

The strongest ecosystem positions tend to combine three characteristics: technical scarcity, regulatory qualification, and repeatability across multiple customers or modalities. That combination matters more than an "ADC" label on an investor presentation.

## 10. A Five-Stage ADC Opportunity Cycle

Viewing ADC adoption as a capability cycle clarifies where economics accrue at each stage of maturity.

- Stage 1 — Discovery: more targets, antibodies, payloads and linkers enter research.
- Stage 2 — Clinical development: demand shifts toward analytical testing, development manufacturing and small-batch conjugation.
- Stage 3 — Late-stage validation: requirements tighten around process robustness, scale-up, regulatory documentation and supply reliability.
- Stage 4 — Commercial manufacturing: validated capacity, quality systems, supply continuity and cost control become decisive.
- Stage 5 — Platform expansion: once infrastructure exists, the same capabilities can support additional ADCs and adjacent complex modalities.

The operating dynamic this creates is attractive in shape if not in timing: the initial investment is capability-heavy, but successful qualification can convert a single build-out into a platform serving multiple programmes. The research challenge is identifying precisely where a given business sits on this curve.

## 11. The India Thesis in One Sentence

India's ADC opportunity is not primarily a story about discovering a blockbuster molecule — it is a story about whether India can build enough specialised chemistry, biologics, bioconjugation, analytical, containment and manufacturing infrastructure to become a reliable node in the global supply chain for the next generation of complex oncology medicines.

The starting conditions are meaningful: a US$30.47 billion pharmaceutical export base in FY2024-25, a growing biopharma ecosystem, expanding biologics capability and a new ₹10,000-crore national biopharma initiative. The end state, however, is not guaranteed. The winners of this ecosystem are likely to be the businesses that convert structural tailwind into validated capability, customer relationships, utilisation and return on capital — which is why ADC deserves to be studied as a multi-dimensional industrial ecosystem, not a single sector.

## 12. Conclusion: Research Beyond the Obvious

The next phase of oncology may be defined by precision — not only precision in targeting cancer cells, but precision in the manufacturing and supply chain required to make complex therapies reproducibly. ADC is a powerful case study precisely because the molecule exposes the entire value chain: antibody, linker, payload, bioconjugation, purification, analytics, containment, fill-finish, regulatory infrastructure, global supply. Every additional ADC programme adds another data point to demand for these capabilities.

For investors, the opportunity is to move one level deeper than the headline. Do not ask only who will discover the next blockbuster. Ask what infrastructure must exist for the next generation of oncology drugs to be discovered, developed, manufactured, tested and delivered — and then one level deeper again: who supplies that infrastructure, and which of those suppliers can convert technical scarcity into durable economics? That is the Prajitresearch lens.

## Prajitresearch ADC Opportunity Checklist

- Capability — what exactly is technically difficult? Evidence to seek: specialised chemistry, HPAPI, biologics, conjugation, analytics. Red flag: generic capability presented as ADC exposure.
- Qualification — has a global customer validated it? Evidence to seek: audits, regulatory approvals, repeat projects. Red flag: only management commentary.
- Capacity — can it scale? Evidence to seek: dedicated suites, utilisation, expansion. Red flag: large capex with uncertain demand.
- Conversion — is capability becoming revenue? Evidence to seek: orders, milestones, revenue mix, repeat work. Red flag: pipeline without commercial evidence.
- Adjacency — can assets serve other complex modalities? Evidence to seek: peptides, oligonucleotides, PROTACs, radiopharma. Red flag: single-use infrastructure.
- Economics — does complexity create attractive returns? Evidence to seek: pricing power, margins, ROCE, cash conversion. Red flag: high capex with weak utilisation.

## Important Definitions and Research Notes

- ADC = antibody–drug conjugate; HPAPI = highly potent active pharmaceutical ingredient; DAR = drug-to-antibody ratio; CDMO = contract development and manufacturing organisation.
- Market-size figures are presented as published estimates or reported industry figures, not as Prajitresearch forecasts. ADC market definitions vary materially by source.
- Pipeline counts vary by methodology and date. This report uses published literature to demonstrate the breadth of development activity, not to imply a fixed global pipeline count.
- India figures are country-level pharmaceutical or bioeconomy statistics and are not estimates of India's ADC market specifically.
- This report deliberately does not name Indian companies. It is intended to build a research framework for studying the ecosystem and identifying relevant capabilities.
- This is an analytical research note, not investment advice. Readers should independently verify company-level data, regulatory status, customer relationships, capacity, valuations and financial statements before making investment decisions.

## Selected Sources

- U.S. FDA — Oncology/Cancer Hematologic Malignancies Approval Notifications (2025-2026 updates). fda.gov
- Nature / npj Breast Cancer — Novel treatment approaches utilizing ADCs in breast cancer (2025). nature.com
- Cancer Communications — Development of antibody-drug conjugates in cancer: overview and prospects (2024). onlinelibrary.wiley.com
- Bioengineering & Translational Medicine — Antibody drug conjugates in the clinic (2024). aiche.onlinelibrary.wiley.com
- Molecules / PMC — Antibody–Drug Conjugates: A Tutorial Review. pmc.ncbi.nlm.nih.gov
- Drug Discovery Today — Containment challenges in HPAPI manufacture for ADC generation. pubmed.ncbi.nlm.nih.gov
- Springer — The Role of Contract Manufacturing in ADC Drug Substance Development (2026). link.springer.com
- Government of India / PIB — Pharmaceutical exports crossed US$30 billion; FY2024-25 exports US$30.47 billion. pib.gov.in
- Pharmexcil — Trade statistics / India pharmaceutical exports. pharmexcil.com
- BIRAC — India Bioeconomy Report 2026. birac.nic.in
- Government of India / PIB — Biopharma SHAKTI: ₹10,000 crore over five years. pib.gov.in
- Government of India / PIB — Budget 2026-27: Transforming India into a Global Biopharma Hub. pib.gov.in
- SEC filing — Industry background citing published ADC market estimates, used only as a range/context source. sec.gov
- PMC — Antibody-Drug Conjugates (ADCs): current and future biopharmaceuticals, approval history. pmc.ncbi.nlm.nih.gov
- BiochemPEG — 21 Antibody-drug Conjugates Approved by FDA/EMA/NMPA/PMDA, approval-year listing. biochempeg.com
- OncologyTube — Antibody-Drug Conjugates: 40 Years of Cancer Innovation, trial-focus breakdown by indication. oncologytube.com
- Roots Analysis — ADC Manufacturing: Current Landscape and Growth Opportunities, bioconjugation capacity share. rootsanalysis.com
- iMapac — South Korea's ADC Surge: Leading CDMO Expansion and Trajectory. info.imapac.com
- BioSpectrum Asia — SK pharmteco and Lotte Biologics ADC CDMO partnership; China and Asia ADC leadership commentary. biospectrumasia.com

## About Prajitresearch

Prajitresearch produces institutional-grade investment research, investor education content and financial commentary for sophisticated Indian investors, HNIs and family offices. The house approach is macro-first and thesis-driven, filtered through an Indian investor lens, with a consistent preference for aggregate equity value and re-rating context over per-share price targets.

This note follows that discipline: it does not name individual Indian companies, does not issue price targets, and does not present any single market estimate as a house forecast. It is designed as a research framework — a way of decomposing a complex modality into its component capabilities — for readers who intend to do their own diligence on specific businesses.

Research beyond the obvious.

This note includes 13 supporting charts and diagrams in the original report — ADC architecture, containment design, approval timelines, trial-indication mix, market-size trajectory, value-chain and geography maps, and the five-stage opportunity cycle. See the attached PDF for the fully illustrated version.

© 2026 Prajitresearch. All rights reserved. Analytical research note — not investment advice.$wu$ from wu_adc_opportunity_2026
on conflict (note_id) do update set body = excluded.body;

