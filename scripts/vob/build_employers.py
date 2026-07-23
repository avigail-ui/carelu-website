#!/usr/bin/env python3
"""
VOB enrichment Layer 5 — employer funding-type dataset (docs/vob-build.md).

Builds src/data/vob-employers/employers-<letter-range>.json + index.json from
the DOL/EBSA EFAST2 public Form 5500 + Schedule A bulk CSV datasets.

Also does MEDICAL-LINE disambiguation for the ~70% of filings that land on
the plan-level `funding: "mixed"` bucket (one 5500 filing wrapping medical +
dental + life etc. all on the same Part II Line 9a/9b indicators). Per
Schedule A row attached to a filing (joined on ACK_ID), classify which
line of business that row insures using, in priority order:
  1. The Schedule A WLFR_BNFT_* benefit-type checkboxes (ground truth from
     the filing itself) plus whether a premium was actually reported —
     many "health" Schedule A rows are administrative-services-only (ASO)
     contracts for a self-funded plan and report $0 premium; those are
     evidence of self-funded, not fully-insured.
  2. A documented carrier-name / free-text rule list (ANCILLARY_NAME_MARKERS,
     ANCILLARY_TEXT_MARKERS below) for rows whose checkboxes are blank or
     only the catch-all OTHER box is set.
  3. Anything left over is `medicalFunding: "ambiguous"` with carrier names
     preserved — never silently guessed into fully-insured or self-funded.
See classify_medical_funding() for the full decision tree.

Source data (not committed — download fresh for each annual refresh):
  https://www.askebsa.dol.gov/FOIA Files/<year>/Latest/F_5500_<year>_Latest.zip
  https://www.askebsa.dol.gov/FOIA Files/<year>/Latest/F_SCH_A_<year>_Latest.zip

Usage:
  python3 scripts/vob/build_employers.py \
    --form5500 /tmp/vob-build/raw/unzipped/f_5500_2024_latest.csv \
    --scha /tmp/vob-build/raw/unzipped/F_SCH_A_2024_latest.csv \
    --filing-year 2024 \
    --out-dir src/data/vob-employers

This script, not the generated JSON, is the source of truth for the annual
refresh: re-run it against next year's dataset and commit the regenerated
shards + index.
"""

import argparse
import csv
import json
import re
import sys
from collections import defaultdict

csv.field_size_limit(10_000_000)

HEALTH_WELFARE_CODE = "4A"

SUFFIX_RE = re.compile(
    r"\b(INCORPORATED|INC|LLC|LLP|LP|CORP|CORPORATION|CO|COMPANY|LTD|LIMITED)\b\.?"
)
PUNCT_RE = re.compile(r"[^\sA-Z0-9]")
SPACE_RE = re.compile(r"\s+")

# State employee / public-sector health benefit plans in the 19 states the
# Carelu payer directory covers. These do not file Form 5500 at all (governmental
# plan exemption under ERISA 4(b)(1)), so they will never appear as a match in
# this dataset -- flagged here so absence isn't mistaken for "no plan exists".
GOVERNMENT_PLAN_NOTES = [
    {"state": "GA", "plan": "State Health Benefit Plan (SHBP)", "administeredBy": "Georgia Dept. of Community Health"},
    {"state": "NC", "plan": "State Health Plan for Teachers and State Employees", "administeredBy": "NC State Treasurer"},
    {"state": "FL", "plan": "State Group Insurance Program", "administeredBy": "FL Dept. of Management Services"},
    {"state": "TX", "plan": "Employees Retirement System of Texas (ERS) Group Benefits Program / Teacher Retirement System (TRS-ActiveCare)", "administeredBy": "ERS / TRS"},
    {"state": "NY", "plan": "New York State Health Insurance Program (NYSHIP)", "administeredBy": "NYS Dept. of Civil Service"},
    {"state": "OH", "plan": "State of Ohio employee health plan / Ohio Public Employees Retirement System", "administeredBy": "Ohio DAS"},
    {"state": "VA", "plan": "The Local Choice / State employee health benefits program", "administeredBy": "Virginia DHRM"},
    {"state": "NJ", "plan": "State Health Benefits Program (SHBP) / School Employees' Health Benefits Program (SEHBP)", "administeredBy": "NJ Div. of Pensions and Benefits"},
    {"state": "MD", "plan": "State Employee and Retiree Health and Welfare Benefits Program", "administeredBy": "MD Dept. of Budget and Management"},
    {"state": "MA", "plan": "Group Insurance Commission (GIC)", "administeredBy": "MA GIC"},
    {"state": "MO", "plan": "Missouri Consolidated Health Care Plan (MCHCP)", "administeredBy": "MCHCP"},
    {"state": "TN", "plan": "State of Tennessee Group Insurance Program", "administeredBy": "TN Dept. of Finance and Administration"},
    {"state": "IN", "plan": "State Personnel Department health plan", "administeredBy": "Indiana SPD"},
    {"state": "KS", "plan": "State Employee Health Plan (SEHP)", "administeredBy": "Kansas State Employees Health Care Commission"},
    {"state": "NE", "plan": "State of Nebraska employee health plan", "administeredBy": "NE Dept. of Administrative Services"},
    {"state": "AZ", "plan": "Arizona Dept. of Administration Benefit Options", "administeredBy": "AZ DOA"},
    {"state": "CO", "plan": "State of Colorado employee health plan (PEBC)", "administeredBy": "CO Dept. of Personnel & Administration"},
    {"state": "UT", "plan": "Public Employees Health Program (PEHP)", "administeredBy": "PEHP Utah"},
    {"state": "NM", "plan": "New Mexico Public Schools Insurance Authority / Risk Management Division", "administeredBy": "NM RMD / NMPSIA"},
]


def normalize_sponsor_name(raw: str) -> str:
    name = (raw or "").upper().strip()
    name = PUNCT_RE.sub(" ", name)
    name = SUFFIX_RE.sub(" ", name)
    name = SPACE_RE.sub(" ", name).strip()
    return name


def welfare_codes(packed: str) -> list:
    packed = (packed or "").strip()
    return [packed[i : i + 2] for i in range(0, len(packed), 2) if packed[i : i + 2]]


def is_health_welfare(packed: str) -> bool:
    return HEALTH_WELFARE_CODE in welfare_codes(packed)


def classify_funding(row: dict):
    """Returns (funding, raw) per docs/vob-build.md Layer 5 ground rules:
    general-assets -> self-funded; insurance -> fully-insured;
    trust or any combination of the three -> mixed. `raw` is the compact
    list of DOL Form 5500 Part II Line 9a/9b indicator codes that were set
    (F_INS/F_GEN/F_TRUST = funding arrangement, B_INS/B_GEN/B_TRUST = benefit
    arrangement), preserved only when funding isn't a clean single type."""
    f_ins = row.get("FUNDING_INSURANCE_IND") == "1"
    f_gen = row.get("FUNDING_GEN_ASSET_IND") == "1"
    f_trust = row.get("FUNDING_TRUST_IND") == "1"
    b_ins = row.get("BENEFIT_INSURANCE_IND") == "1"
    b_gen = row.get("BENEFIT_GEN_ASSET_IND") == "1"
    b_trust = row.get("BENEFIT_TRUST_IND") == "1"

    has_insurance = f_ins or b_ins
    has_gen_asset = f_gen or b_gen
    has_trust = f_trust or b_trust
    kinds = sum([has_insurance, has_gen_asset, has_trust])

    if kinds == 0:
        return "unknown", None
    if kinds > 1 or has_trust:
        raw = []
        if f_ins:
            raw.append("F_INS")
        if f_gen:
            raw.append("F_GEN")
        if f_trust:
            raw.append("F_TRUST")
        if b_ins:
            raw.append("B_INS")
        if b_gen:
            raw.append("B_GEN")
        if b_trust:
            raw.append("B_TRUST")
        return "mixed", raw
    if has_insurance:
        return "fully-insured", None
    return "self-funded", None


# ---------------------------------------------------------------------------
# Medical-line disambiguation (docs/vob-build.md Layer 5 fix).
#
# Schedule A WLFR_BNFT_* checkboxes are the ground truth for a row's line of
# business when the filer checked them accurately. WLFR_BNFT_HEALTH_IND is
# the medical/health box; the ancillary boxes cover dental, vision, life,
# short/long-term disability, and stop-loss. A large share of filings only
# check the catch-all WLFR_BNFT_OTHER_IND (or nothing at all) -- for those we
# fall back to a documented, explicit rule list on the carrier name and the
# free-text WLFR_TYPE_BNFT_OTH_TEXT field. Anything that still doesn't match
# is left unclassified and the filing resolves to "ambiguous", never guessed.
ANCILLARY_FLAG_FIELDS = [
    "WLFR_BNFT_DENTAL_IND",
    "WLFR_BNFT_VISION_IND",
    "WLFR_BNFT_LIFE_INSUR_IND",
    "WLFR_BNFT_TEMP_DISAB_IND",
    "WLFR_BNFT_LONG_TERM_DISAB_IND",
    "WLFR_BNFT_STOP_LOSS_IND",
    "WLFR_BNFT_UNEMP_IND",
]

# Carrier-name substrings (matched against the uppercased, whitespace-
# collapsed INS_CARRIER_NAME) that identify an ancillary line of business.
# Applied only to rows whose WLFR_BNFT_HEALTH_IND box is NOT checked, so a
# carrier that also underwrites medical elsewhere (e.g. "CIGNA HEALTH AND
# LIFE INSURANCE COMPANY" writing a life/AD&D Schedule A) is still classified
# correctly for *that row* -- the health checkbox already wins when present.
ANCILLARY_NAME_MARKERS = [
    "DENTAL", "VISION", "VSP", "DELTA DENTAL", "EYEMED", "GUARDIAN",
    "LIFE INSURANCE", "LIFE INS", "LIFE AND ACCIDENT",
    "DISABILITY", "STOP LOSS", "STOP-LOSS", "EXCESS LOSS", "EXCESS RISK",
    "ACCIDENT", "AD&D", "ACCIDENTAL DEATH", "UNUM", "COLONIAL LIFE", "AFLAC",
    "LEGALSHIELD", "LEGAL PLAN", "LEGAL SERVICES", "METLIFE LEGAL",
    "CRITICAL ILLNESS", "HOSPITAL INDEMNITY", "LONG TERM CARE",
    "RELIANCE STANDARD", "RELIASTAR", "AMERICAN HERITAGE LIFE",
    "CONTINENTAL AMERICAN", "ARAG", "LINCOLN NATIONAL LIFE",
]

# Free-text WLFR_TYPE_BNFT_OTH_TEXT substrings that identify an ancillary
# line of business when only the catch-all OTHER box is checked -- observed
# from the actual dataset's OTHER-benefit free text (voluntary/supplemental
# benefits dominate that bucket: AD&D, EAP, critical illness, legal, etc.).
ANCILLARY_TEXT_MARKERS = [
    "ACCIDENTAL DEATH", "DISMEMBERMENT", "AD&D", "ADD",
    "EMPLOYEE ASSISTANCE", "EAP", "CRITICAL ILLNESS", "LEGAL",
    "HOSPITAL INDEMNITY", "LONG TERM CARE", "BUSINESS TRAVEL ACCIDENT",
    "ACCIDENT", "TELEHEALTH", "VOLUNTARY", "WELLNESS",
]


def _has_ancillary_marker(name: str, other_text: str) -> bool:
    return any(m in name for m in ANCILLARY_NAME_MARKERS) or any(
        m in other_text for m in ANCILLARY_TEXT_MARKERS
    )


def load_schedule_a_details(path: str) -> dict:
    """Per-ACK_ID list of Schedule A rows with the fields medical-line
    disambiguation needs: carrier name, benefit-type checkboxes, the OTHER
    free-text field, and whether a premium amount was actually reported."""
    details = defaultdict(list)
    with open(path, newline="", encoding="latin-1") as f:
        reader = csv.DictReader(f)
        for row in reader:
            ack_id = row.get("ACK_ID")
            name = SPACE_RE.sub(" ", (row.get("INS_CARRIER_NAME") or "").strip())
            if not ack_id or not name:
                continue
            try:
                premium = float(row.get("WLFR_PREMIUM_RCVD_AMT") or 0) or float(
                    row.get("WLFR_TOT_EARNED_PREM_AMT") or 0
                )
            except ValueError:
                premium = 0.0
            details[ack_id].append(
                {
                    "name": name,
                    "name_upper": name.upper(),
                    "is_health": row.get("WLFR_BNFT_HEALTH_IND") == "1",
                    "is_ancillary_flag": any(row.get(f) == "1" for f in ANCILLARY_FLAG_FIELDS),
                    "is_stop_loss": row.get("WLFR_BNFT_STOP_LOSS_IND") == "1"
                    or "STOP LOSS" in name.upper()
                    or "STOP-LOSS" in name.upper()
                    or "EXCESS LOSS" in name.upper(),
                    "other_text": (row.get("WLFR_TYPE_BNFT_OTH_TEXT") or "").strip().upper(),
                    "premium_present": premium > 0,
                }
            )
    return details


def classify_medical_funding(scha_rows: list, original_funding: str):
    """Returns (medicalFunding, medicalCarriers, stopLoss) per docs/vob-build.md
    Layer 5 fix. See the module docstring / constants above for the full rule
    list. `original_funding` (the existing plan-level `funding` field) is only
    consulted when a filing has NO Schedule A rows attached at all, to decide
    between a confirmed self-funded read (no insurance contracts of any kind
    were filed) and "unknown" (no Schedule A evidence either way)."""
    stop_loss = any(r["is_stop_loss"] for r in scha_rows)

    if not scha_rows:
        if original_funding == "self-funded":
            return "self-funded", [], stop_loss
        return "unknown", [], stop_loss

    medical_insured, medical_aso, ancillary, unclassified = [], [], [], []
    for r in scha_rows:
        if r["is_health"]:
            (medical_insured if r["premium_present"] else medical_aso).append(r)
        elif r["is_ancillary_flag"] or _has_ancillary_marker(r["name_upper"], r["other_text"]):
            ancillary.append(r)
        else:
            unclassified.append(r)

    if medical_insured:
        carriers = sorted({r["name"] for r in medical_insured})
        return "fully-insured", carriers, stop_loss

    if unclassified:
        # A carrier whose line of business we can't pin down from the
        # checkboxes or the name/text rule list -- preserve the names rather
        # than guess which bucket (medical vs. ancillary) it belongs in.
        carriers = sorted({r["name"] for r in unclassified})
        return "ambiguous", carriers, stop_loss

    if medical_aso or ancillary:
        # Only ASO (health box checked, no premium -> administrative-services
        # contract on a self-funded plan) and/or pure ancillary lines were
        # filed -- no evidence the medical benefit itself is insured.
        return "self-funded", [], stop_loss

    return "unknown", [], stop_loss


def tax_period_to_iso(value: str):
    # FORM_TAX_PRD is already ISO (YYYY-MM-DD) in the bulk CSVs.
    value = (value or "").strip()
    if re.match(r"^\d{4}-\d{2}-\d{2}$", value):
        return value
    return None


def load_schedule_a_carriers(path: str) -> dict:
    carriers = defaultdict(list)
    with open(path, newline="", encoding="latin-1") as f:
        reader = csv.DictReader(f)
        for row in reader:
            ack_id = row.get("ACK_ID")
            name = (row.get("INS_CARRIER_NAME") or "").strip()
            if not ack_id or not name:
                continue
            name = SPACE_RE.sub(" ", name)
            if name not in carriers[ack_id]:
                carriers[ack_id].append(name)
    return carriers


def build_rows(form5500_path: str, scha_path: str, filing_year: int, source: str) -> list:
    carriers_by_ack = load_schedule_a_carriers(scha_path)
    scha_details_by_ack = load_schedule_a_details(scha_path)
    rows = []
    with open(form5500_path, newline="", encoding="latin-1") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if not is_health_welfare(row.get("TYPE_WELFARE_BNFT_CODE") or ""):
                continue
            ein = (row.get("SPONS_DFE_EIN") or "").strip()
            sponsor_name = row.get("SPONSOR_DFE_NAME") or ""
            if not ein or not sponsor_name:
                continue
            try:
                participants = int(row.get("TOT_PARTCP_BOY_CNT") or 0)
            except ValueError:
                participants = 0

            funding, raw = classify_funding(row)
            ack_id = row.get("ACK_ID")
            carriers = sorted(carriers_by_ack.get(ack_id, []))
            medical_funding, medical_carriers, stop_loss = classify_medical_funding(
                scha_details_by_ack.get(ack_id, []), funding
            )

            entry = {
                "sponsorNameNormalized": normalize_sponsor_name(sponsor_name),
                "ein": ein,
                "funding": funding,
                "carriers": carriers,
                "planYearEnd": tax_period_to_iso(row.get("FORM_TAX_PRD")),
                "participants": participants,
                "source": source,
                "filingYear": filing_year,
                "medicalFunding": medical_funding,
            }
            if raw is not None:
                entry["raw"] = raw
            if medical_carriers:
                entry["medicalCarriers"] = medical_carriers
            if stop_loss:
                entry["stopLoss"] = True
            rows.append(entry)
    return rows


LETTER_SHARDS = [
    ("a-c", "A", "C"),
    ("d-f", "D", "F"),
    ("g-i", "G", "I"),
    ("j-l", "J", "L"),
    ("m-o", "M", "O"),
    ("p-r", "P", "R"),
    ("s-t", "S", "T"),
    ("u-z", "U", "Z"),
    ("0-9-other", "", ""),
]


def shard_key_for(name: str) -> str:
    first = name[:1]
    for key, lo, hi in LETTER_SHARDS[:-1]:
        if lo <= first <= hi:
            return key
    return LETTER_SHARDS[-1][0]


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--form5500", required=True, help="Path to f_5500_<year>_latest.csv")
    parser.add_argument("--scha", required=True, help="Path to F_SCH_A_<year>_latest.csv")
    parser.add_argument("--filing-year", type=int, required=True)
    parser.add_argument("--out-dir", required=True)
    parser.add_argument(
        "--min-participants",
        type=int,
        default=100,
        help="Drop plans with fewer participants than this (size budget; these are largely the ERISA-exempt small filers anyway).",
    )
    args = parser.parse_args()

    source = f"DOL Form 5500 ({args.filing_year})"
    source_full = f"DOL/EBSA EFAST2 Form 5500 + Schedule A bulk datasets, plan year {args.filing_year}"

    print(f"Loading Schedule A carriers from {args.scha} ...", file=sys.stderr)
    print(f"Parsing Form 5500 rows from {args.form5500} ...", file=sys.stderr)
    rows = build_rows(args.form5500, args.scha, args.filing_year, source)
    print(f"{len(rows)} health & welfare plan rows before size-budget filter", file=sys.stderr)

    kept = [r for r in rows if r["participants"] >= args.min_participants]
    dropped = len(rows) - len(kept)
    print(
        f"{len(kept)} rows kept (>= {args.min_participants} participants); {dropped} dropped for size budget",
        file=sys.stderr,
    )

    shards = defaultdict(list)
    for row in kept:
        shards[shard_key_for(row["sponsorNameNormalized"])].append(row)

    funding_counts = defaultdict(int)
    medical_funding_counts = defaultdict(int)
    for row in kept:
        funding_counts[row["funding"]] += 1
        medical_funding_counts[row["medicalFunding"]] += 1

    import os

    os.makedirs(args.out_dir, exist_ok=True)
    index = {
        "meta": {
            "layer": "vob-enrichment-layer-5",
            "description": "Employer funding-type dataset (mandate-protected fully-insured vs. plan-document-governed self-funded), built from DOL Form 5500 public filings, per docs/vob-build.md Layer 5.",
            "filingYear": args.filing_year,
            "source": source_full,
            "sourceUrls": [
                f"https://www.askebsa.dol.gov/FOIA Files/{args.filing_year}/Latest/F_5500_{args.filing_year}_Latest.zip",
                f"https://www.askebsa.dol.gov/FOIA Files/{args.filing_year}/Latest/F_SCH_A_{args.filing_year}_Latest.zip",
            ],
            "rowCount": len(kept),
            "totalHealthWelfarePlansBeforeSizeBudget": len(rows),
            "minParticipantsFilter": args.min_participants,
            "fundingBreakdown": dict(funding_counts),
            "medicalFundingBreakdown": dict(medical_funding_counts),
            "medicalFundingRule": {
                "description": (
                    "Medical-line disambiguation: which line of business each Schedule A "
                    "row attached to a filing (joined on ACK_ID) actually insures, so a "
                    "single 5500 filing that wraps medical + dental + life etc. (the "
                    "plan-level `funding` field's 'mixed' bucket) resolves to a specific "
                    "medical-benefit funding read instead of degrading to 'unknown' downstream."
                ),
                "decisionOrder": [
                    "1. WLFR_BNFT_HEALTH_IND checked AND a premium amount reported "
                    "(WLFR_PREMIUM_RCVD_AMT or WLFR_TOT_EARNED_PREM_AMT > 0) -> "
                    "medicalFunding='fully-insured', medicalCarriers names that row's carrier(s).",
                    "2. WLFR_BNFT_HEALTH_IND checked but NO premium reported -> treated as an "
                    "administrative-services-only (ASO) contract on a self-funded plan, "
                    "not evidence of insured medical -- folds into the self-funded case below.",
                    "3. No health checkbox, but the row is a recognized ancillary line -- "
                    "via WLFR_BNFT_DENTAL/VISION/LIFE_INSUR/TEMP_DISAB/LONG_TERM_DISAB/"
                    "STOP_LOSS/UNEMP checkboxes, OR (when only the catch-all OTHER box is "
                    "checked or no box is checked) a documented carrier-name rule list "
                    "(DENTAL, VISION, VSP, DELTA DENTAL, LIFE INSURANCE, DISABILITY, STOP "
                    "LOSS, AD&D, UNUM, AFLAC, etc. -- full list in "
                    "scripts/vob/build_employers.py:ANCILLARY_NAME_MARKERS) or the "
                    "WLFR_TYPE_BNFT_OTH_TEXT free-text field (AD&D, EAP, CRITICAL ILLNESS, "
                    "LEGAL, HOSPITAL INDEMNITY, etc. -- ANCILLARY_TEXT_MARKERS).",
                    "4. If EVERY Schedule A row on the filing is ASO and/or ancillary (step "
                    "2/3), and none are unclassified -> medicalFunding='self-funded'; "
                    "stopLoss=true is recorded when a stop-loss Schedule A row exists.",
                    "5. A carrier whose line of business can't be determined from either the "
                    "checkboxes or the rule list -> medicalFunding='ambiguous', with that "
                    "carrier's name preserved in medicalCarriers. NEVER silently guessed.",
                    "6. No Schedule A rows attached to the filing at all: medicalFunding="
                    "'self-funded' only if the plan-level `funding` field is already a clean "
                    "'self-funded' (no insurance contracts of any kind were filed); otherwise "
                    "'unknown' -- absence of Schedule A evidence is not evidence of anything.",
                ],
                "limits": [
                    "The rule operates per Schedule A row/ACK_ID, not per named entity -- the "
                    "same legal carrier (e.g. a life insurer that also underwrites medical "
                    "elsewhere) is classified correctly per-row because the HEALTH_IND "
                    "checkbox is checked independently on each Schedule A filing.",
                    "Absence of a health-flagged, premium-bearing Schedule A row is NEVER "
                    "read as fully-insured, and absence of any Schedule A evidence is NEVER "
                    "read as self-funded unless the plan-level funding field already says so "
                    "independently -- both default to 'unknown'/'ambiguous' rather than a guess.",
                    "The carrier-name and free-text rule lists are heuristic and were tuned "
                    "against this dataset's actual OTHER-benefit text distribution; a carrier "
                    "with an unusual name that doesn't hit any marker resolves to 'ambiguous', "
                    "which is the safe failure mode, not a data bug.",
                ],
            },
            "limits": [
                "Employers with fewer than ~100 participants are largely exempt from Form 5500 filing entirely; absence of a match MUST resolve to funding 'unknown', NEVER 'fully-insured'.",
                "Church plans and government (federal/state/municipal) plans do not file Form 5500 at all (ERISA 4(b) exemptions) and will never appear in this dataset regardless of size.",
                "This build additionally drops filed plans below the --min-participants threshold to stay under the repo's size budget; those are almost entirely small filers whose absence already resolves to 'unknown' by the rule above.",
                "'mixed' funding means the filing marked more than one of insurance/general-assets/trust (or trust alone) on Form 5500 Part II Line 9a/9b -- the raw indicator codes are preserved per-row in a `raw` field.",
                "Carrier names come from Schedule A (insurance contracts) and are only present for filings that attached one; self-funded plans typically have none.",
                "Sponsor name matching is normalized-exact/contains, not deduped across a sponsor's multiple plans (e.g. medical vs. dental may file as separate rows) -- callers should expect and handle multiple rows per employer.",
            ],
            "governmentPlanNotes": GOVERNMENT_PLAN_NOTES,
        },
        "shards": [],
    }

    for key, _, _ in LETTER_SHARDS:
        plans = shards.get(key, [])
        if not plans:
            continue
        plans.sort(key=lambda r: (r["sponsorNameNormalized"], r["ein"]))
        filename = f"employers-{key}.json"
        path = os.path.join(args.out_dir, filename)
        with open(path, "w", encoding="utf-8") as f:
            json.dump(plans, f, separators=(",", ":"), ensure_ascii=False)
        size = os.path.getsize(path)
        index["shards"].append({"key": key, "file": filename, "count": len(plans), "bytes": size})
        print(f"wrote {path}: {len(plans)} rows, {size} bytes", file=sys.stderr)

    index_path = os.path.join(args.out_dir, "index.json")
    with open(index_path, "w", encoding="utf-8") as f:
        json.dump(index, f, indent=2, ensure_ascii=False)
    print(f"wrote {index_path}", file=sys.stderr)

    total_bytes = sum(s["bytes"] for s in index["shards"]) + os.path.getsize(index_path)
    print(f"total dataset size: {total_bytes} bytes ({total_bytes / (1024*1024):.2f} MB)", file=sys.stderr)


if __name__ == "__main__":
    main()
