#!/usr/bin/env python3
"""
VOB enrichment Layer 5 — employer funding-type dataset (docs/vob-build.md).

Builds src/data/vob-employers/employers-<letter-range>.json + index.json from
the DOL/EBSA EFAST2 public Form 5500 + Schedule A bulk CSV datasets.

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

            entry = {
                "sponsorNameNormalized": normalize_sponsor_name(sponsor_name),
                "ein": ein,
                "funding": funding,
                "carriers": carriers,
                "planYearEnd": tax_period_to_iso(row.get("FORM_TAX_PRD")),
                "participants": participants,
                "source": source,
                "filingYear": filing_year,
            }
            if raw is not None:
                entry["raw"] = raw
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
    for row in kept:
        funding_counts[row["funding"]] += 1

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
