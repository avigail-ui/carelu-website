/* ================================================================
   PAYER GUIDE CONFIGS (/payers/:slug) — shared types.
   ABA coverage & prior-auth guides per payer, distilled from primary
   sources (payer clinical policies, state manuals) compiled June–July
   2026. Framed as verification guidance: every page carries a
   "policies change — verify" disclaimer and links its sources.
   Data lives in one file per state (+ national.ts); index.ts merges.
   ================================================================ */

export interface PayerFact { label: string; value: string }
export interface PayerSource { title: string; url: string }
export interface PayerSection {
  h2: string;
  body?: string[];
  list?: { title: string; desc: string }[];
  cites?: PayerSource[];   // sources for THIS section, rendered inline under it
}
export interface PayerFaq { q: string; a: string }
export type PayerKind = 'state-medicaid' | 'medicaid-mco' | 'commercial';
export interface PayerConfig {
  slug: string;
  payer: string;
  pill: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  atGlance: PayerFact[];
  sections: PayerSection[];
  collect: { title: string; desc: string }[]; // what intake should gather from the family
  sources: PayerSource[];
  faq: PayerFaq[];
  // Taxonomy for the state-organized directory.
  state?: string;          // 'GA', 'NC', ... or 'US' for national commercial policy
  kind?: PayerKind;        // state medicaid program, a Medicaid MCO, or commercial
  parent?: string;         // for MCOs: the state Medicaid program they administer
  family?: string;         // carrier family ('aetna', 'anthem', 'unitedhealthcare', …) to cross-link commercial ↔ Medicaid plans
  cardDesc?: string;       // one-line description for directory cards
  // Funnel-critical facts surfaced prominently (assessment PA is asked constantly).
  assessmentPA?: string;   // does the ASSESSMENT (not just treatment) need prior auth?
  treatmentPA?: string;    // does treatment need prior auth?
  dxRequired?: string;     // is an autism diagnosis required (and how strict)?
}

export const PAYER_REVIEWED = 'July 2026';

// State metadata for the directory + per-state breakdowns on commercial guides.
export interface StateMeta { code: string; name: string; mandate: string; medicaidSlug: string }
export const STATE_META: StateMeta[] = [
  { code: 'GA', name: 'Georgia', mandate: 'Ava\u2019s Law (O.C.G.A. \u00a7 33-24-59.10)', medicaidSlug: 'georgia-medicaid' },
  { code: 'NC', name: 'North Carolina', mandate: 'N.C.G.S. \u00a7 58-3-192 (autism coverage)', medicaidSlug: 'north-carolina-medicaid' },
  { code: 'IN', name: 'Indiana', mandate: 'Indiana autism insurance mandate (IC 27-8-14.2)', medicaidSlug: 'indiana-medicaid' },
  { code: 'VA', name: 'Virginia', mandate: 'Virginia autism insurance mandate (\u00a7 38.2-3418.17)', medicaidSlug: 'virginia-medicaid' },
  { code: 'TN', name: 'Tennessee', mandate: 'Tenn. Code Ann. \u00a7 56-7-2367 (neurological parity)', medicaidSlug: 'tenncare-tennessee-medicaid' },
  { code: 'OH', name: 'Ohio', mandate: 'Ohio autism insurance mandate (R.C. 3923.84)', medicaidSlug: 'ohio-medicaid' },
  { code: 'NJ', name: 'New Jersey', mandate: 'P.L. 2009, c.115 (N.J.S.A. 17:48-6ii et al.)', medicaidSlug: 'new-jersey-medicaid' },
  { code: 'MD', name: 'Maryland', mandate: 'Habilitative services mandate (Md. Ins. \u00a7 15-835 + COMAR 31.10.39.03)', medicaidSlug: 'maryland-medicaid' },
  { code: 'CO', name: 'Colorado', mandate: 'Colorado autism insurance mandate (C.R.S. \u00a7 10-16-104(1.4))', medicaidSlug: 'colorado-medicaid' },
  { code: 'UT', name: 'Utah', mandate: 'Utah autism insurance mandate (Utah Code \u00a7 31A-22-642; caps removed 2020)', medicaidSlug: 'utah-medicaid' },
  { code: 'AZ', name: 'Arizona', mandate: 'Steven\u2019s Law (A.R.S. \u00a7 20-826.04; dollar caps repealed by SB 1590, 2025)', medicaidSlug: 'arizona-ahcccs' },
  { code: 'NY', name: 'New York', mandate: 'NY autism mandate (Ins. Law \u00a7\u00a7 3216(i)(25), 3221(l)(17), 4303(ee))', medicaidSlug: 'new-york-medicaid' },
  { code: 'NM', name: 'New Mexico', mandate: 'New Mexico autism insurance mandate (NMSA 1978 \u00a7 59A-22-49)', medicaidSlug: 'new-mexico-medicaid' },
  { code: 'MO', name: 'Missouri', mandate: 'Missouri autism insurance mandate (RSMo \u00a7 376.1224)', medicaidSlug: 'missouri-medicaid' },
  { code: 'TX', name: 'Texas', mandate: 'Texas autism mandate (Tex. Ins. Code \u00a7 1355.015)', medicaidSlug: 'texas-medicaid' },
  { code: 'MA', name: 'Massachusetts', mandate: 'ARICA \u2014 Ch. 207, Acts of 2010 (M.G.L. c. 175 \u00a7 47AA et al.)', medicaidSlug: 'masshealth-massachusetts-medicaid' },
  { code: 'FL', name: 'Florida', mandate: 'Steven A. Geller Autism Coverage Act (\u00a7 627.6686, Fla. Stat.)', medicaidSlug: 'florida-medicaid' },
  { code: 'KS', name: 'Kansas', mandate: 'Kansas autism insurance mandate (K.S.A. 40-2,194)', medicaidSlug: 'kansas-medicaid' },
  { code: 'NE', name: 'Nebraska', mandate: 'Neb. Rev. Stat. \u00a7 44-7,106 (autism coverage, 25 hr/wk cap)', medicaidSlug: 'nebraska-medicaid' },
];
