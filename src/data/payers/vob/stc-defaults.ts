/* ================================================================
   VOB ENRICHMENT — Layer 2 shared source: service-type-code (STC)
   family defaults. See docs/vob-build.md "Layer 2" for the spec.

   Sourcing notes (read before editing):
   - Vocabulary reference: CAQH CORE Eligibility & Benefits (270/271)
     Data Content Rule, Version EB.2.0 (April 2022), Appendix 5.1 "Eligibility
     & Benefits CORE Service Type Codes" — the public STC code list. Critically,
     §1.3.2.5 states CAQH CORE made MH (Mental Health), A4-A8 (Psychiatric/
     Psychotherapy variants), AI/AJ/AK (Substance Abuse/Alcoholism/Drug
     Addiction), and the CE-CJ Mental-Health/Substance-Abuse Provider/Facility
     variants all "discretionary" (a payer MAY decline to return financial
     detail) specifically "because a code is related to behavioral health or
     substance abuse... where privacy issues may impact a health plan or
     information source's ability to return information." ABA/autism has NO
     dedicated STC code in the X12 list — payers must slot ABA benefit
     responses under one of the general buckets above (most commonly MH,
     A4, or A6) or under the generic "30" bucket, which IS mandatory. This
     is the primary-source explanation for why ABA-specific cost-share detail
     is so often absent from real 271 responses even when the payer
     technically "supports" the code.
   - Cigna: fetched and read in full the Cigna Companion Guide 270/271,
     ASC X12N 270/271 (005010X279A1), Version 2.3, August 2024
     (cigna.com/static/www-cigna-com/docs/5010-270-271-companion-guide.pdf).
     Its STC table (§7.1.1) explicitly lists MH, A4-A8, AI/AJ/AK as supported;
     §10.2's worked transmission example returns real EB*C (copay) and EB*A
     (coinsurance) segments for an MH-flavored request. §7.2.2/7.2.3 states
     explicitly that "when the plan is a Mental Health, Pharmacy or Vision
     plan, remaining [deductible/benefit] amounts will not be reported" — a
     documented MH-specific limitation not applied to medical/dental. §10.2
     also shows the underlying information-source identity switches to a
     distinct "Cigna Behavioral Health" legal entity (Tax ID 41-1648670) for
     an MH-specific request, versus the standard CGLIC medical entity — the
     payer ID/EDI envelope is shared (per the Autism Resource Guide fact
     already in georgia.ts), but internally Cigna's benefit administration
     for MH-flavored codes routes to its behavioral-health book of business.
   - UnitedHealthcare: fetched and read in full the UnitedHealthcare Standard
     Companion Guide, HIPAA 270/271 (005010X279A1), Version 9.0, February 2,
     2025 (uhcprovider.com EDI resources). §6.2's STC table explicitly lists
     MH, A4-A8, AI/AJ/AK as supported under UHC's own commercial/Community
     Plan/Medicare payer ID (87726) — no separate Optum Behavioral Health
     payer ID is named anywhere in the document, and no independent Optum BH
     270/271 companion guide could be located publicly (the one candidate
     URL on iedi.optum.com 404s). The guide states plainly that supported
     STCs "will contain copay, coinsurance and benefit deductible
     information." This does NOT resolve whether members whose ABA benefit
     is carved to Optum BH actually receive populated MH-flavor detail
     through this same feed versus a referral/vendor-lookup stub (the guide
     separately documents an EB*U "vendor" segment mechanism for exactly
     that scenario) — flagged as an open question via verifyVia.
   - Aetna: no Aetna companion guide for its commercial/group health line
     could be located or fetched. The only Aetna-branded 270/271 companion
     guide found publicly is for Aetna Senior Supplemental Insurance (Aetna
     SSI) — a Medicare Supplement product line unrelated to ABA/autism
     benefits (aetnaseniorproducts.com/ssi, v1.0, 2013-11-01; payer ID AESSI).
     Aetna's own provider site directs EDI submitters to Availity, and
     Availity's payer-specific "Payer Spaces" companion-guide documentation
     for Aetna sits behind an authenticated portal this pass could not
     reach. Per the "never guess" rule, Aetna's family default ships fully
     'unverified' rather than inferred from the SSI guide or from Cigna/UHC's
     pattern.
   ================================================================ */
import type { StcMap, SourceRef, FieldStatus } from './types.js';

const ACCESS_DATE = '2026-07-23';

function src(url: string, note?: string, staleRisk?: boolean): SourceRef {
  return { url, accessDate: ACCESS_DATE, note, staleRisk };
}

/* -------------------- shared vocabulary reference -------------------- */

export const CAQH_CORE_STC_VOCAB = src(
  'https://www.caqh.org/sites/default/files/CAQH%20CORE%20Eligibility%20Benefits%20(270_271)%20Data%20Content%20Rule%20vEB2.0.pdf',
  'CAQH CORE Eligibility & Benefits (270/271) Data Content Rule, Version EB.2.0, April 2022 — Appendix 5.1 is the public X12 service-type-code (STC) vocabulary; §1.3.2.5 documents that MH, A4-A8, AI/AJ/AK, and the CE-CJ variants are all "discretionary" specifically for behavioral-health/substance-abuse privacy reasons. There is no dedicated STC for autism/ABA in this list.'
);

/* -------------------- Cigna / Evernorth -------------------- */

const CIGNA_COMPANION_GUIDE = src(
  'https://www.cigna.com/static/www-cigna-com/docs/5010-270-271-companion-guide.pdf',
  'Cigna Companion Guide 270/271 — Health Care Eligibility/Benefit Inquiry and Response, ASC X12N 270/271 (005010X279A1), Version 2.3, August 2024. §7.1.1 STC support table lists MH, A4, A5, A6, A7, A8, AI, AJ, AK, BB, BC as supported (CE/CF/CG/CH/CI/CJ absent). §7.2.2-7.2.3: "when the plan is a Mental Health, Pharmacy or Vision plan, remaining amounts will not be reported" — MH-specific limitation on remaining (not base) deductible/benefit detail. §10.2 worked example (Scenario 5) shows a real EB segment with copay/coinsurance and precertification flags for an MH-flavored request, with the information-source identity switching to "Cigna Behavioral Health" (Tax ID 41-1648670).'
);

export const cignaFamilyStc: StcMap = {
  abaBenefitBucket: 'MH',
  deductibleAppliesToAba: 'yes',
  costShareType: 'plan-dependent',
  copayUnit: 'unverified',
  oopMaxApplies: 'unverified',
  quality271Score: 'high',
  fieldStatus: {
    abaBenefitBucket: 'verified',
    deductibleAppliesToAba: 'verified',
    costShareType: 'verified',
    copayUnit: 'unverified',
    oopMaxApplies: 'unverified',
    quality271Score: 'verified',
  },
  verifyVia: {
    deductibleAppliesToAba:
      "Base deductible for MH-flavored codes is returned per the companion guide's own worked example, but REMAINING deductible/benefit amounts are explicitly withheld for Mental Health, Pharmacy, and Vision plans (§7.2.2-7.2.3) — a real 271 for an ABA member may show the base figure but not how much has been used.",
    costShareType:
      'Both copay (EB*C) and coinsurance (EB*A) segments are structurally supported per plan; which applies to a given member is plan-document-specific.',
    copayUnit: 'Not addressed by the companion guide (an EDI/transaction-format document, not a plan-benefit document) — confirm via plan summary or provider services.',
    oopMaxApplies: 'Not addressed by the companion guide — confirm via plan summary or provider services.',
  },
  sources: [CAQH_CORE_STC_VOCAB, CIGNA_COMPANION_GUIDE],
};

/* -------------------- UnitedHealthcare / Optum -------------------- */

const UHC_COMPANION_GUIDE = src(
  'https://www.uhcprovider.com/content/dam/provider/docs/public/resources/edi/EDI-270-271-Companion-Guide-005010X279A1.pdf',
  'UnitedHealthcare Standard Companion Guide, HIPAA 270/271 (005010X279A1), Version 9.0, February 2, 2025. §6.2 STC table lists MH, A4, A5, A6, A7, A8, AI, AJ, AK as supported under UHC\'s own commercial/Community Plan/Medicare payer ID (87726) — no separate Optum Behavioral Health payer ID is named anywhere in the document, and no independent, publicly posted Optum BH 270/271 companion guide could be located to confirm or contradict this. States supported codes "will contain copay, coinsurance and benefit deductible information."'
);

export const uhcFamilyStc: StcMap = {
  abaBenefitBucket: 'MH',
  deductibleAppliesToAba: 'yes',
  costShareType: 'plan-dependent',
  copayUnit: 'unverified',
  oopMaxApplies: 'unverified',
  quality271Score: 'high',
  fieldStatus: {
    abaBenefitBucket: 'inferred',
    deductibleAppliesToAba: 'inferred',
    costShareType: 'inferred',
    copayUnit: 'unverified',
    oopMaxApplies: 'unverified',
    quality271Score: 'inferred',
  },
  verifyVia: {
    abaBenefitBucket:
      "UHC's own EDI feed (87726) formally supports MH/A4-A8 with financial detail, but whether members whose ABA benefit is carved to Optum Behavioral Health actually receive populated MH-flavor detail through this SAME feed — versus a referral/vendor-lookup stub via the guide's own documented EB*U 'vendor' segment mechanism — is not resolved by any source found this pass. Confirm via Provider Express / UHC provider services for the specific plan.",
    deductibleAppliesToAba: 'Same open question as abaBenefitBucket — confirm whether the carved-out BH benefit populates deductible detail on this feed.',
    costShareType: 'Both copay and coinsurance are structurally supported per plan; which applies to a given member is plan-document-specific.',
    copayUnit: 'Not addressed by the companion guide — confirm via plan summary or provider services.',
    oopMaxApplies: 'Not addressed by the companion guide — confirm via plan summary or provider services.',
  },
  sources: [CAQH_CORE_STC_VOCAB, UHC_COMPANION_GUIDE],
};

/* -------------------- Aetna -------------------- */

const AETNA_SSI_COMPANION_GUIDE = src(
  'https://www.aetnaseniorproducts.com/ssi/assets/pdf/Aetna%20SSI%20EDI%20270-271%20Companion%20guide.pdf',
  "Aetna Senior Supplemental Insurance (Aetna SSI) 270/271 Companion Guide, v1.0, 2013-11-01, payer ID AESSI — the only Aetna-branded 270/271 companion guide locatable publicly. Covers Medicare Supplement products (Aetna Health and Life, Allianz Life NY, American Continental, Genworth, Union Fidelity, etc.), NOT Aetna's commercial/group ABA-relevant line — its STC table (MH, A6, A7, A8, AI among 52 CORE-mandated codes) is not applied to the family default below, since this product line does not pay ABA claims. No Aetna commercial-line companion guide is publicly posted; Aetna directs EDI submitters to Availity, whose payer-specific documentation for Aetna sits behind an authenticated portal not reachable this pass."
);

export const aetnaFamilyStc: StcMap = {
  abaBenefitBucket: 'unverified',
  deductibleAppliesToAba: 'unverified',
  costShareType: 'unverified',
  copayUnit: 'unverified',
  oopMaxApplies: 'unverified',
  quality271Score: 'unverified',
  fieldStatus: {
    abaBenefitBucket: 'unverified',
    deductibleAppliesToAba: 'unverified',
    costShareType: 'unverified',
    copayUnit: 'unverified',
    oopMaxApplies: 'unverified',
    quality271Score: 'unverified',
  },
  verifyVia: {
    abaBenefitBucket:
      "No Aetna commercial/group 270/271 companion guide is publicly posted (only a Medicare Supplement product's guide, aetnaseniorproducts.com, was locatable — a different product line that does not pay ABA claims). Aetna's own provider site names Availity as its EDI portal; Availity's Aetna-specific 'Payer Spaces' companion-guide documentation requires an authenticated Availity account. Confirm via Availity or Aetna provider services.",
    deductibleAppliesToAba: 'Same gap as abaBenefitBucket.',
    costShareType: 'Same gap as abaBenefitBucket.',
    copayUnit: 'Same gap as abaBenefitBucket.',
    oopMaxApplies: 'Same gap as abaBenefitBucket.',
    quality271Score: 'Same gap as abaBenefitBucket.',
  },
  sources: [CAQH_CORE_STC_VOCAB, AETNA_SSI_COMPANION_GUIDE],
};

/* -------------------- Anthem / Elevance / Carelon -------------------- */

const ANTHEM_ELEVANCE_NOTE = src(
  'https://www.anthem.com/provider/edi/',
  'Anthem/Elevance provider EDI portal (general) — no Anthem/Elevance-branded 270/271 HIPAA companion guide with an explicit service-type-code support table was located publicly this pass, nor a Carelon Behavioral Health-specific 270/271 companion guide with its own EDI payer ID. Both are candidates for a future pass with authenticated Availity/provider-portal access.'
);

export const anthemFamilyStc: StcMap = {
  abaBenefitBucket: 'unverified',
  deductibleAppliesToAba: 'unverified',
  costShareType: 'unverified',
  copayUnit: 'unverified',
  oopMaxApplies: 'unverified',
  quality271Score: 'unverified',
  fieldStatus: {
    abaBenefitBucket: 'unverified',
    deductibleAppliesToAba: 'unverified',
    costShareType: 'unverified',
    copayUnit: 'unverified',
    oopMaxApplies: 'unverified',
    quality271Score: 'unverified',
  },
  verifyVia: {
    abaBenefitBucket:
      'No Anthem/Elevance 270/271 companion guide with an STC support table, and no Carelon Behavioral Health-specific 270/271 companion guide or EDI payer ID, was locatable publicly this pass. Anthem/Elevance is known (Layer 1, already in-corpus) to route ABA/BH to Carelon Behavioral Health; whether that carve-out rides the same commercial 271 feed or a separate Carelon feed is unconfirmed. Confirm via Availity Payer Spaces (authenticated) or Anthem/Carelon provider services.',
    deductibleAppliesToAba: 'Same gap as abaBenefitBucket.',
    costShareType: 'Same gap as abaBenefitBucket.',
    copayUnit: 'Same gap as abaBenefitBucket.',
    oopMaxApplies: 'Same gap as abaBenefitBucket.',
    quality271Score: 'Same gap as abaBenefitBucket.',
  },
  sources: [CAQH_CORE_STC_VOCAB, ANTHEM_ELEVANCE_NOTE],
};

/* -------------------- BCBS (independent licensees) -------------------- */

const BCBS_LICENSEE_NOTE = src(
  'https://www.excellusbcbs.com/prior-authorization',
  'Excellus BCBS and Highmark BCBS of Western & Northeastern NY (the two independent BCBS licensees in this corpus, both NY guides) — neither publishes a publicly locatable 270/271 HIPAA companion guide with an explicit service-type-code support table this pass, nor was a BCBS Association model/reference 270/271 companion guide (that member plans commonly adopt) locatable. Both plans direct providers to check eligibility via their own secure provider portals rather than a documented EDI STC table.'
);

export const bcbsFamilyStc: StcMap = {
  abaBenefitBucket: 'unverified',
  deductibleAppliesToAba: 'unverified',
  costShareType: 'unverified',
  copayUnit: 'unverified',
  oopMaxApplies: 'unverified',
  quality271Score: 'unverified',
  fieldStatus: {
    abaBenefitBucket: 'unverified',
    deductibleAppliesToAba: 'unverified',
    costShareType: 'unverified',
    copayUnit: 'unverified',
    oopMaxApplies: 'unverified',
    quality271Score: 'unverified',
  },
  verifyVia: {
    abaBenefitBucket:
      'Neither Excellus BCBS nor Highmark BCBS of Western & Northeastern NY publishes a publicly locatable 270/271 companion guide with an STC support table; no BCBS Association reference guide was locatable either. Confirm via each plan\'s own EDI/provider-services department.',
    deductibleAppliesToAba: 'Same gap as abaBenefitBucket.',
    costShareType: 'Same gap as abaBenefitBucket.',
    copayUnit: 'Same gap as abaBenefitBucket.',
    oopMaxApplies: 'Same gap as abaBenefitBucket.',
    quality271Score: 'Same gap as abaBenefitBucket.',
  },
  sources: [CAQH_CORE_STC_VOCAB, BCBS_LICENSEE_NOTE],
};

/* -------------------- inherit helper -------------------- */

const ALL_INFERRED: Record<keyof StcMap & string, FieldStatus> = {
  abaBenefitBucket: 'inferred',
  deductibleAppliesToAba: 'inferred',
  costShareType: 'inferred',
  copayUnit: 'inferred',
  oopMaxApplies: 'inferred',
  quality271Score: 'inferred',
} as Record<keyof StcMap & string, FieldStatus>;

/**
 * Build a per-guide StcMap that inherits a family default. All fields are
 * marked 'inferred' (derived from the payer-family pattern, not a
 * guide/state-specific document) per docs/vob-build.md's fieldStatus rule,
 * except fields the family default itself already ships 'unverified' —
 * those remain 'unverified' rather than being upgraded by inheritance alone.
 */
export function inheritFamilyStc(base: StcMap, guideNote: string): StcMap {
  const fieldStatus: Record<string, FieldStatus> = {};
  (Object.keys(ALL_INFERRED) as (keyof typeof ALL_INFERRED)[]).forEach((key) => {
    const baseValue = (base as unknown as Record<string, unknown>)[key];
    fieldStatus[key] = baseValue === 'unverified' ? 'unverified' : 'inferred';
  });
  return {
    ...base,
    fieldStatus,
    verifyVia: { ...(base.verifyVia ?? {}), _inherited: guideNote },
  };
}
