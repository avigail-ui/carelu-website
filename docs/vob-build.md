# Carelu Payer Directory — VOB Enrichment Build (Master Prompt)

> Canonical build spec. Every session (local or cloud) working on VOB enrichment
> reads this file first and follows it exactly. Schemas live in
> `src/data/payers/vob/types.ts`; per-state data in `src/data/payers/vob/<state>.ts`.

You are extending the Carelu ABA Payer Directory (currently 164 guides, 19 states, 489 policy rules at https://www.carelu.com/api/payers). The existing corpus covers the policy layer: prior-auth verdicts, diagnosis requirements, mandate layers, submission channels. Your job is to add the layers that turn a PVerify 270/271 eligibility response plus this directory into a complete, instant verification of benefits — no phone call — for as many members as structurally possible.

## Scope

All 19 states currently in the corpus: **AZ, CO, FL, GA, IN, KS, MA, MD, MO, NC, NE, NJ, NM, NY, OH, TN, TX, UT, VA.**

Cover every payer already in the corpus, and add any Medicaid MCO operating ABA benefits in those states that is missing from the index. Priority order for delivery: **GA and NC first** (wedge markets), then FL, TX, NY, then the rest.

## Ground rules — non-negotiable

1. **Primary sources only.** State Medicaid manuals, X12 companion guides, payer provider manuals, PA lists, fee schedules, official EDI directories, federal datasets. No blogs, no billing-company summaries except as leads to primary sources.
2. **Every fact carries its source URL and access date.** Match the existing corpus convention.
3. **Never guess. Never fill a field to complete a schema.** If a value can't be verified from a primary source, set it to `"unverified"` with a `verifyVia` note (portal name, phone, or document to request). An honest gap routes to a scripted call; a fabricated value produces a wrong quote to a family.
4. **Extend, don't replace.** New fields nest into the existing guide JSON under new keys. Emit a changelog entry per change-set in the existing changelog format (type `vob-enrichment`).
5. **Distinguish `verified` / `inferred` / `unverified` on every field** that supports it. `inferred` means derived from a payer-level pattern (e.g., "Cigna generally applies the outpatient BH cost share to ABA codes") rather than a document stating it for this plan.

---

## Layer 1 — EDI routing crosswalk (per guide)

The 271 speaks in clearinghouse payer IDs; the directory currently speaks in prose. Add to every guide:

```
"edi": {
  "payerId": { "pverify": "", "availity": "", "changeHealthcare": "" },
  "supports270271": true/false,
  "supportsRealtime": true/false,
  "bhCarveOut": {
    "administrator": "",          // e.g. Evernorth, Carelon, Optum BH, Magellan, none
    "administratorPayerId": "",
    "abaRidesOn": "medical | bh | either",
    "twoHopRequired": true/false
  },
  "medicaid271Notes": {           // state-medicaid guides only
    "mcoSegmentLocation": "",     // where MCO enrollment appears in the 271 (loop/segment)
    "mcoCarrierCodes": {},        // carrier code → MCO name mapping
    "eligibilitySpanGranularity": "" // monthly / daily / real-time
  }
}
```

**Where to find it:**
- PVerify's published payer list and the Availity Essentials payer list (both public); Optum/Change Healthcare payer directories as cross-check.
- **State Medicaid 270/271 companion guides** — every state publishes one (usually on the MMIS/fiscal-agent site: GAMMIS for GA, NCTracks for NC, TMHP for TX, eMedNY for NY, ForwardHealth-style portals elsewhere). These document exactly which loop/segment carries managed-care enrollment and which carrier codes map to which MCOs. This is the highest-value single document type in this layer — read them in full.
- Payer EDI enrollment pages and provider quick-reference guides for carve-out payer IDs.

## Layer 2 — Service-type-code interpretation map (per payer family, then per guide override)

The 271 returns benefits in generic X12 service-type buckets. Make the ABA mapping explicit:

```
"stcMap": {
  "abaBenefitBucket": "",        // which STC the payer returns ABA-relevant cost share under: 30, MH, A4, A6, etc.
  "deductibleAppliesToAba": "yes | no | plan-dependent",
  "costShareType": "copay | coinsurance | plan-dependent",
  "copayUnit": "per-visit | per-day | plan-dependent",  // critical: ABA has multiple sessions/day — this field moves the family's number 3x
  "oopMaxApplies": true/false,
  "quality271Score": ""          // seed high/medium/low: does this payer return service-level detail or generic junk on the wire?
}
```

**Where to find it:**
- The X12 271 service type code list (public) for the vocabulary.
- Payer-specific 270/271 companion guides (most large commercials publish them) for which STCs they populate.
- `copayUnit` and `deductibleAppliesToAba` are usually only in plan documents or confirmed by phone — mark `plan-dependent` with `verifyVia` rather than guessing. Seed `quality271Score` from companion-guide richness; it will be corrected by live traffic later.

## Layer 3 — Code-level coverage grid (per guide)

Convert the prose PA verdicts into a structured grid. For every guide:

```
"codeGrid": {
  "97151": { "covered": "", "paRequired": "", "unitCap": "", "capPeriod": "", "posAllowed": [], "telehealth": "", "modifiers": [], "notes": "" },
  ... repeat for 97152, 97153, 97154, 97155, 97156, 97157, 97158, 0362T, 0373T ...
}
```

- Include **99366** where the state covers it (TX does).
- Some Medicaid programs use non-Category-I code sets (e.g., Kansas CCTS/IIS structure, H-codes like H2019 in some states) — capture the state's actual billable code set, don't force the CPT list.
- POS values: home, office, school, daycare, community, telehealth (and note POS-code numbers where the manual specifies: 03, 10, 11, 12, etc.).
- Modifiers: licensure tiers (HN/HO/HM/HP), telehealth (GT/95), plan-specific quirks (e.g., Trillium's GT/KX rules — already in the corpus prose).

**Where to find it:** state Medicaid fee schedules and provider manuals (the same sources the corpus was built from), MCO PA lists and lookup tools, payer ABA billing guides. Much of this exists in the current guides as prose — this layer is partly extraction/restructuring of what's already verified, partly filling holes.

## Layer 4 — Medicaid rate tables (state-medicaid and MCO guides)

```
"rates": {
  "source": "", "effectiveDate": "",
  "byCode": { "97153": { "rate": "", "unit": "15min", "modifierTiers": {} }, ... }
}
```

**Where to find it:** every state Medicaid program publishes its fee schedule (GAMMIS fee schedule files, NCTracks rate pages, TMHP fee schedules, published Tailored Plan rate sheets — Alliance and Trillium already surface these in the corpus). MCO rates: only where publicly posted (several NC and NJ plans post them); otherwise `unverified`. **Do not attempt commercial rates** — those are contract-specific and belong in per-client config, not the directory.

## Layer 5 — Employer funding-type dataset (new top-level dataset, not per-guide)

This is the single biggest unlock: it splits commercial members into mandate-protected (fully-insured) vs. plan-document-governed (self-funded) **before** any call.

Build `employers.json` from the **DOL Form 5500 public datasets**:

1. Download the latest Form 5500 and Schedule A bulk datasets from the DOL/EBSA research-data pages (EFAST2 published datasets; annual CSV/zip files).
2. Filter to health & welfare plans (benefit codes indicating health coverage).
3. Extract per plan: sponsor name, sponsor EIN, plan name, plan year end, **funding arrangement and benefit arrangement codes** (general-assets = self-funded; insurance = fully-insured; trust/mixed noted as-is), stop-loss indicators, and the carrier(s) named on Schedule A.
4. Normalize sponsor names (strip Inc/LLC/punctuation, uppercase) and build a fuzzy-match key — intake captures employer names as parents type them.
5. **Record the known limits in the dataset metadata:** employers under 100 participants are largely exempt from filing, and church/government plans don't file — so *absence of a filing must resolve to `funding: "unknown"`, never to `fully-insured`.* Government plans (state/municipal employees) are self-funded-like and mandate-exempt in most states — flag the big public-employee plan names per state where identifiable.

Schema per row: `{ sponsorNameNormalized, ein, funding, carriers[], planYearEnd, participants, source, filingYear }`.

## Layer 6 — Carve-out map (new top-level dataset)

One table so hop-2 routing never requires a human: carrier family × state × line of business → BH administrator, administrator payer ID, and whether ABA is administered on the medical or BH side. The corpus already knows most of these in prose (Cigna→Evernorth; Anthem/Elevance→Carelon; UHC→Optum BH; MD Medicaid→Carelon BHASO; MA→six BH administrators; FL plans delegating to Carelon/TNFL). Extract, structure, and complete for all 19 states from provider manuals.

## Layer 7 — Contact & channel layer (per guide)

For the residual scripted-call path — make every remaining call short:

```
"vobContact": {
  "providerServicesPhone": "", "ivrPath": "", "hours": "",
  "portal": { "name": "", "url": "" },
  "fax": "",
  "scriptedQuestions": []   // ONLY the fields this guide marks unverified/plan-dependent — the call asks 3 questions, not 30
}
```

**Where to find it:** provider quick-reference guides and manual contact pages (many already cited in the corpus). `scriptedQuestions` is generated, not scraped: derive it from whatever is `unverified`/`plan-dependent` in Layers 2–3 for that guide.

## Layer 8 — Schemas only (define, do NOT populate)

Define empty schemas and stop:

- **`groupOverrides` table:** `{ payerId, groupNumber, funding, abaCovered, capsHours, capsDollars, copayUnit, carveOutConfirmed, sourceType: "call | eob | planDoc", refNumber, verifiedDate, verifiedBy }`. Populated later from client historical records and live call write-backs. **Do not ingest any client documents or member data in this build** — that ingestion path has a separate compliance review before it opens.
- **`clientNetworkStatus` per-practice config:** `{ payerId, planNetwork, npi, tin, inNetwork, effectiveDate, contractSource }`. Populated at client onboarding from their contract lists, never scraped.

## Layer 9 — Freshness & QA

- Every new field: `sourceUrl` + `accessDate`. Every changed guide: new `contentHash`; corpus-level `corpusHash` update; changelog entry listing fields added and sources.
- Anything sourced from a document older than 18 months gets `staleRisk: true`.
- Re-verify cadence inherits the existing monthly refresh; Layer 5 refreshes annually when new 5500 datasets publish.
- QA pass per state before moving on: pick 3 guides at random, re-open every cited source, confirm the field matches the document. Log the spot-check in the changelog.

## Output format

- Per-guide JSON extensions (Layers 1–4, 7) merged into existing guides.
- New top-level datasets: `employers.json` (Layer 5), `carveouts.json` (Layer 6), plus the two empty schemas (Layer 8).
- Deliver **state by state**, GA → NC → FL → TX → NY → remaining 14, with a changelog entry closing each state.
- At the end of each state, output a one-paragraph coverage summary: % of that state's guides with a complete no-call VOB path (Medicaid), complete quote path (fully-insured commercial), and what remains call-dependent and why.

Begin with Layer 1 + Layer 3 for Georgia (they share source documents), then Layer 5 as a parallel track since it's a single national dataset.
