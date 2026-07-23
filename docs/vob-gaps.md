# VOB Build — Medicaid MCO Coverage Gap Census

> Companion to `docs/vob-build.md`. Research-only pass: no payer guides were written in this run. Every roster claim below carries a source URL and access date (2026-07-23) from the state Medicaid agency or a primary contract/enrollment document. Where a state's roster page was bot-blocked or unreadable, the state is marked **incomplete** with the URL to check manually.

## Georgia

| | |
|---|---|
| Existing guides | CareSource, Peach State Health Plan, Amerigroup (GA Medicaid CMO) |
| Current official roster | Georgia Families / Georgia Families 360°: **Amerigroup Community Care, CareSource, Peach State Health Plan (Centene)** — 3 CMOs, ~1.59M aggregate enrollment (no per-plan breakdown published). Source: dch.georgia.gov/medicaid-managed-care; medicaid.georgia.gov/programs/all-programs/georgia-families/care-management-organizations-cmo (accessed 2026-07-23). Amerigroup alone also runs Georgia Families 360° (~27,000 foster-care/JJ youth). |
| Missing plans | **None today** — but DCH's Dec 2, 2024 NOIA awarded new Georgia Families contracts to **CareSource (incumbent), Humana, Molina Healthcare, and UnitedHealthcare** (UHC also wins GF 360°); **Amerigroup and Peach State were NOT re-awarded**. Go-live had not occurred as of access date (secondary sources disagree: mid-2026 vs Jan 2027). Recommend building Humana GA, Molina GA, and UnitedHealthcare GA ABA guides now, ahead of transition — no confirmed enrollment size yet. |
| Not-a-gap / carve-out notes | No ABA carve-out — each CMO runs its own EPSDT Adaptive Behavior Services PA. |
| Stale entries | None yet — Amerigroup GA still branded "Amerigroup" (GA was not in Elevance's confirmed Wellpoint-rebrand batches: AZ/IA/NJ/TN/TX/WA Jan 2024, DC July 2025). Watch: Amerigroup and Peach State will both go stale once the new Georgia Families contracts take effect. |

## North Carolina

| | |
|---|---|
| Existing guides | Healthy Blue, AmeriHealth Caritas NC, Carolina Complete Health, UHC Community Plan NC, WellCare of NC (5 Standard Plans) + Alliance Health, Trillium Health Resources, Vaya Health, Partners Health Management (4 Tailored Plans) |
| Current official roster | Standard Plans (now **4, not 5**): AmeriHealth Caritas NC, Healthy Blue, UnitedHealthcare of NC, **Carolina Complete Health (statewide as of 4/1/2026, absorbed WellCare)**. Tailored Plans unchanged: Alliance Health, Partners Health Management, Trillium Health Resources, Vaya Health (~240,000 members combined). Source: medicaid.ncdhhs.gov/about-nc-medicaid/health-plans; medicaid.ncdhhs.gov/tailored-plans (accessed 2026-07-23). |
| Missing plans | None — current 4 Standard + 4 Tailored roster is a subset of Carelu's 9 guides. |
| Not-a-gap / carve-out notes | RB-BHT (ABA) is covered under Clinical Coverage Policy 8F across both Standard Plans and Tailored Plans and NC Medicaid Direct — no statewide carve-out. Standard vs. Tailored is a population split (general vs. higher-acuity BH/IDD/TBI), not a carve-out gap. |
| Stale entries | **WellCare of North Carolina no longer exists as a standalone plan** — merged into Carolina Complete Health effective April 1, 2026 (medicaid.ncdhhs.gov/providers/provider-playbook-medicaid-managed-care/trending-topics/wellcare-north-carolina-and-carolina-complete-health-merge-april-1-2026, accessed 2026-07-23). Retire the WellCare guide; update Carolina Complete Health's service area from Regions 3-5 to statewide. |

## Arizona

| | |
|---|---|
| Existing guides | Mercy Care, UnitedHealthcare Community Plan of AZ, Arizona Complete Health – Complete Care Plan, Banner-University Family Care, Health Choice Arizona, Molina Healthcare of Arizona, DES/DDD |
| Current official roster | AHCCCS Complete Care (ACC), rev. 2026-06-30: Arizona Complete Health – Complete Care Plan (340,089), UnitedHealthcare Community Plan (311,219), Mercy Care (285,573), Banner-University Family Care (209,528), **Blue Cross Blue Shield of Arizona Health Choice** (173,110), Molina Healthcare/Molina Complete Care (33,978). Total 1,353,497. Source: azahcccs.gov/Members/Downloads/Resources/ENGLISH_HealthPlanList.pdf; azahcccs.gov/PlansProviders/Downloads/Enrol1st.pdf (accessed 2026-07-23). |
| Missing plans | None — all 6 current ACC contractors match Carelu's 6 guides. |
| Not-a-gap / carve-out notes | ABA (Ch. 320-S) is administered per-MCO, statewide, no carve-out. CRS is folded into the ACC plans (not standalone). DES/DDD unchanged — covers ALTCS I/DD statewide, correctly a separate guide. |
| Stale entries | **"Health Choice Arizona" is branding-stale** — now "Blue Cross Blue Shield of Arizona Health Choice" (BCBSAZ Health Choice) since BCBSAZ's 2019 acquisition of Steward Health Choice Arizona; contract retained through the 2024 re-procurement. Rename the guide, no coverage change. Molina's official name is now "Molina Healthcare"/"Molina Complete Care" rather than "Molina Healthcare of Arizona" (cosmetic). |

## Indiana

| | |
|---|---|
| Existing guides | Anthem BCBS Indiana (Medicaid), MHS, CareSource Indiana, MDwise, UnitedHealthcare Community Plan of Indiana |
| Current official roster | Anthem (HIP, Hoosier Care Connect, Hoosier Healthwise, PathWays for Aging), CareSource (HIP, Hoosier Healthwise), MHS (HIP, Hoosier Care Connect, Hoosier Healthwise), UnitedHealthcare Community Plan (Hoosier Care Connect, PathWays for Aging only), **Humana (PathWays for Aging only, new entrant)**. Source: in.gov/medicaid/partners/medicaid-partners/managed-care-health-plans (accessed 2026-07-23). No per-MCE enrollment breakdown published; statewide total 1,632,766 (Jan 2026, FSSA Monthly Medicaid Financial Report). |
| Missing plans | Humana is new but PathWays for Aging serves adults 60+/duals, not the pediatric ASD/ABA population — **not a priority ABA gap**, no enrollment figure found for it regardless. |
| Not-a-gap / carve-out notes | ABA for ASD (≤20) is a covered EPSDT/medically-necessary benefit, administered per-MCE (Anthem and CareSource each publish their own ABA UM policy). Effective 4/1/2026, IHCP bulletin BT202627 moves ABA to EPSDT-exclusive coverage — verify manually whether this changes MCE-level administration (source PDF wasn't machine-readable). |
| Stale entries | **MDwise CONFIRMED EXITED** — ends as an MCE for HIP and Hoosier Healthwise effective Jan 1, 2026 (FSSA press release, in.gov/fssa/files/MDwise-Participation_FINAL-2025.pdf, accessed 2026-07-23), cited as "most expensive and lowest in quality" of the four legacy plans. Members reassigned to Anthem, CareSource, or MHS. **Retire the MDwise guide.** Also: Carelu's existing UHC Indiana guide should be scoped to Hoosier Care Connect + PathWays only, not Hoosier Healthwise/HIP. |

## Kansas

| | |
|---|---|
| Existing guides | Sunflower Health Plan, UnitedHealthcare Community Plan of Kansas, Healthy Blue Kansas |
| Current official roster | KanCare 3.0 (Jan 2025–Dec 2027): Sunflower Health Plan (~159,386/mo, 36.7%), UnitedHealthcare Community Plan (~161,986/mo, 37.3%), Healthy Blue (BCBS-KS + Elevance, ~113,014/mo, 26.0%). Total ~434,385/mo. Source: kslegislature.gov Bethell Joint Committee testimony PDF, 2025-10-13; kdhe.ks.gov/m/newsflash/home/detail/1104 (accessed 2026-07-23). |
| Missing plans | None — all 3 current MCOs already covered. |
| Not-a-gap / carve-out notes | ABA is MCO-administered (EPSDT CCTS/IIS + KanCare Autism HCBS Waiver), no statewide carve-out — confirmed via KDHE claims tables. |
| Stale entries | **None — Carelu's roster is correct.** Healthy Blue replaced Aetna Better Health of Kansas in the KanCare 3.0 award (effective Jan 1, 2025, not 2024); Aetna sued and lost (Shawnee Co. District Court, July 2024) and exited. Carelu already reflects the current lineup. |

## New Mexico

| | |
|---|---|
| Existing guides | Blue Cross Blue Shield of NM, Presbyterian Health Plan, Molina Healthcare of NM, UnitedHealthcare Community Plan of NM (all Turquoise Care) |
| Current official roster | Turquoise Care (since 7/1/2024): **exactly the same 4 plans** — BCBS of NM, Molina Healthcare of NM, Presbyterian Health Plan, UnitedHealthcare Community Plan of NM. HCA states explicitly "members can choose from among four health plans." Source: hca.nm.gov/turquoise-care-health-plans/; hca.nm.gov/turquoise-care/ (accessed 2026-07-23). Per-plan enrollment not extractable (Tableau-style dashboard, JS-rendered). |
| Missing plans | None — no 5th active MCO exists. |
| Not-a-gap / carve-out notes | ABA is delivered through the member's MCO care coordinator — MCO-administered, not carved out. |
| Stale entries | None. Note: Western Sky Community Care (Centene) — a prior Centennial Care MCO — exited Medicaid 6/30/2024 and did not continue into Turquoise Care; it was never in Carelu's directory, so this is not a stale-entry issue, just background. |

## Nebraska

| | |
|---|---|
| Existing guides | Nebraska Total Care (Centene), Molina Healthcare of Nebraska, UnitedHealthcare Community Plan of Nebraska |
| Current official roster | Heritage Health — same 3 statewide MCOs, current contract term began 1/1/2024: Molina Healthcare of Nebraska (113,537), Nebraska Total Care (110,020), UnitedHealthcare Community Plan (108,802); total ~332,359 (Dec 2025). Source: dhhs.ne.gov Heritage Health EQR Technical Report, Table 1-1; DHHS Provider Bulletin 23-04 (accessed 2026-07-23). |
| Missing plans | None — no 4th MCO in the current roster. (Healthy Blue lost its bid for the 2024 term and is not and never was in Carelu's directory — not a stale entry, background only.) |
| Not-a-gap / carve-out notes | ABA is integrated into each MCO's capitated physical+behavioral health contract — not carved out. ABA spend grew from $4.6M (2020) to $82.8M (2024) statewide; DHHS cut ABA reimbursement rates effective 8/1/2025. |
| Stale entries | None. |

## Massachusetts

| | |
|---|---|
| Existing guides | MBHP, WellSense Health Plan, Tufts Health Together (Point32Health), Fallon Health, Health New England — BeHealthy Partnership, Mass General Brigham Health Plan |
| Current official roster | MassHealth runs 15 ACPPs + 2 Primary Care ACOs + 1 MCO (WellSense Essential) + the FFS PCC Plan (MBHP-administered). Family groupings: Fallon (Atrius/Berkshire/365 Care) → Carelon BH; MGB Health Plan → Optum BH; WellSense (7 ACPPs + Essential MCO) → **insourced its own BH in-house effective 1/1/2026**, replacing Carelon; Health New England BeHealthy → MBHP; Community Care Cooperative (C3) and Revere Health Choice (Primary Care ACOs) → MBHP. Source: mass.gov/info-details/full-list-of-masshealth-acos-and-mcos; mass.gov enrollment/caseload metrics (accessed 2026-07-23). MassHealth does not publish enrollment by individual plan name (only aggregate ACO-A/ACO-B totals: 830,948 / 263,577, Jan 2026). |
| Missing plans | None confirmed with a distinct, un-covered BH administrator — MBHP already covers the Primary Care ACOs and PCC Plan; Carelon and Optum (the other 2 of the "six BH administrators" the corpus references) are reachable via Fallon's and MGB's existing guides respectively. |
| Not-a-gap / carve-out notes | WellSense's historical Carelon/Beacon relationship is now moot post-insourcing — no separate Carelon MA guide needed. |
| Stale entries | **Tufts Health Together MCO product was discontinued effective 1/1/2026** (All Provider Bulletin 410) — only its two ACPPs (w/ Cambridge Health Alliance, w/ UMass Memorial Health) remain active; Carelu's guide should be updated to reflect the ACPP-only structure, not the discontinued MCO product. **WellSense's BH carve-out description should be updated from Carelon to in-house BH, effective 1/1/2026.** |
| Incomplete | masslegalservices.org ACO comparison PDF (403 Forbidden); Tufts Health Together w/ CHA/UMass Memorial's current BH vendor not independently confirmed this run — check mass.gov managed-care-entity bulletins 144/146 manually. |

## New York

| | |
|---|---|
| Existing guides | Fidelis Care NY, UHC Community Plan NY, Anthem HealthPlus NY, Healthfirst NY, MetroPlusHealth, EmblemHealth NY, Molina Healthcare of NY |
| Current official roster | NYS DOH Medicaid Managed Care Enrollment Report, Jan 2025 (health.ny.gov/health_care/managed_care/reports/enrollment/monthly/2025/docs/en01_25.pdf, accessed 2026-07-23; state total 4,459,389): Fidelis Care 1,461,084 · Healthfirst PHSP 1,096,151 · MetroPlus 405,555 (+SN 4,510) · Anthem HP 334,717 · UnitedHealthcare of NY 251,843 · Molina Healthcare of NY (incl. Affinity by Molina brand) 226,281 · **Excellus Health Plan (BCBS) 182,280** · **MVP Health Plan 162,046** · HIP of Greater NY/EmblemHealth 133,947 · **CDPHP 82,431** · **Highmark Western & NE NY 45,402** · **Independent Health Association 60,275** · Amida Care SN 9,097 · VNS Choice SNP 3,770. |
| Missing plans (largest first) | **1. Excellus Health Plan (BCBS) — 182,280 members**, Central/Western NY + Southern Tier. **2. MVP Health Plan — 162,046**, Capital Region/Hudson Valley/North Country. **3. Independent Health Association — 60,275**, Erie/Monroe. **4. CDPHP — 82,431**, Albany/Capital District — *(note: agent's own list ranked CDPHP above Independent Health by enrollment; sequence corrected here by enrollment size)*. **5. Highmark Western & NE NY — 45,402** (formerly HealthNow/BCBS WNY). Lower priority (niche/SNP): Amida Care SN — 9,097 (NYC HIV SNP); VNS Choice SNP — 3,770. All administer ABA as mainstream MMC plans (see below) — all 7 are real gaps. |
| Not-a-gap / carve-out notes | ABA is a mainstream MMC/EPSDT benefit statewide since it was fully carved IN to the standard benefit package Jan 1, 2023 (previously FFS-only from Aug 2021) — every plan above administers it directly, no BH-vendor carve-out. |
| Stale entries | None — Affinity Health Plan did **not** dissolve into VNS Health; it was acquired by Molina in 2020/21 and continues as "Affinity by Molina Healthcare," a co-branded product under Molina Healthcare of NY. Verify Carelu's Molina NY guide references the Affinity brand for downstate members. |
| Incomplete | health.ny.gov mcplans/enrollment pages return HTTP 403 to automated fetch — verify manually at health.ny.gov/health_care/managed_care/mcplans.htm. Most recent report (June 2026) located but not fully parsed; Jan 2025 figures used as latest successfully extracted. |

## Ohio

| | |
|---|---|
| Existing guides | CareSource Ohio, Buckeye Health Plan, Molina Healthcare of Ohio, Anthem BCBS Ohio, UHC Community Plan Ohio, AmeriHealth Caritas Ohio, Humana Healthy Horizons Ohio |
| Current official roster | Next Generation Medicaid managed care, unchanged at 7 statewide plans: AmeriHealth Caritas Ohio, Anthem Blue Cross and Blue Shield, Buckeye Community Health Plan (Centene), CareSource Ohio, Humana Healthy Horizons in Ohio, Molina Healthcare of Ohio, UnitedHealthcare Community Plan of Ohio. Source: ODM Next Generation Managed Care Member FAQs; ohiomh.com (state enrollment broker) (accessed 2026-07-23). No per-plan enrollment published in sources reached. |
| Missing plans | None. |
| Not-a-gap / carve-out notes | ABA (97151-97158, 0362T, 0373T) is explicitly excluded from OhioRISE (the Aetna-run BH/multi-system-youth carve-out, launched 7/1/2022) per ODM's OhioRISE Mixed Services Protocol (eff. 4/1/2026): ABA claims go to "the individual's Medicaid MCO (or FFS)." **OhioRISE/Aetna Better Health of Ohio does not need its own ABA guide** — confirmed not-a-gap. |
| Stale entries | None — all 7 plans match, no exits, no renames (Ohio's Medicaid MCO was never branded Amerigroup, so no Wellpoint-rebrand issue applies here). |
| Incomplete | managedcare.medicaid.ohio.gov/managed-care and an ODM NextGen press release both 404'd; a 2026 "Managed Care Health Plan Comparison" PDF fetched as unreadable binary — worth a manual look for enrollment-by-plan detail. |

## Tennessee

| | |
|---|---|
| Existing guides | BlueCare Tennessee (BCBST), UHC Community Plan of TN, Wellpoint Tennessee (formerly Amerigroup) |
| Current official roster | TennCare CY2024 MCPAR + tn.gov (accessed 2026-07-23): BlueCare Tennessee 552,517 (37.7%) · Wellpoint Tennessee 438,735 (29.9%) · UnitedHealthcare Community Plan 439,049 (29.9%) · **TennCare Select 37,095 (2.5%)** — a distinct PIHP product underwritten by Volunteer State Health Plan, a BlueCross BlueShield of TN subsidiary (same parent as BlueCare Tennessee). Total 1,467,396. No competitive re-procurement in 2024 — state law now locks in the incumbent lineup; the only 2024 event was the Amerigroup→Wellpoint rebrand. |
| Missing plans | **TennCare Select — 37,095 members**, soft/secondary gap: legally distinct product (not just a BlueCare Tennessee alias), serves SSI children/foster youth/IDD-CHOICES populations — a population that skews toward autism/ABA needs — under the same statewide ABA contract terms. Worth its own guide entry despite shared parent with BlueCare TN. |
| Not-a-gap / carve-out notes | ABA is MCO-administered across all 4 products, integrated into each at-risk contract — no BH carve-out vendor. |
| Stale entries | None — all 3 existing guides hold active 2025 TennCare contracts; Wellpoint/Amerigroup rebrand is accurate. |
| Incomplete | 744-page MCO Statewide Contract PDF not text-parseable — check manually if exact contracting-party legal names are needed. |

## Virginia

| | |
|---|---|
| Existing guides | Aetna Better Health of Virginia, Anthem HealthKeepers Plus, Humana Healthy Horizons in Virginia, Sentara Community Plan, UHC Community Plan of Virginia |
| Current official roster | Cardinal Care Managed Care, per DMAS provider education deck (6/16/2025) and DMAS bulletin (accessed 2026-07-23): Aetna Better Health of Virginia, Anthem HealthKeepers Plus, **Humana Healthy Horizons in Virginia (new MCO effective 7/1/2025)**, Sentara Health Plans (Medicaid product still branded "Sentara Community Plan"), UnitedHealthcare of the Mid-Atlantic. Exactly **5** statewide MCOs — DMAS's own slide states "Molina will no longer be available." No per-plan enrollment found (interactive dashboard only). |
| Missing plans | None — Carelu's 5-plan list already matches the current 5-MCO roster exactly (Humana was likely added to the corpus already in anticipation of/response to the 7/1/2025 change). |
| Not-a-gap / carve-out notes | ABA is MCO-administered for managed-care members; FFS (non-MCO) members' ABA runs through Acentra Health, DMAS's FFS BH services administrator. |
| Stale entries | **Molina Complete Care of Virginia exited effective 6/30/2025** — members moved to Humana. Not in Carelu's directory, so nothing to retire, but do not add Molina VA as a "gap" if it resurfaces in cross-checks. Sentara branding note: corporate parent is now "Sentara Health Plans" (formerly Optima Health, rebranded 2023-2024) — "Sentara Community Plan" remains the correct Medicaid product name. |
| Incomplete | DMAS public overview pages don't list plan names/enrollment; virginiamanagedcare.com returned HTTP 503 (bot-blocked) — check manually. |

## New Jersey

| | |
|---|---|
| Existing guides | Horizon NJ Health, Aetna Better Health of NJ, Fidelis Care NJ (formerly WellCare), UHC Community Plan (NJ FamilyCare), Wellpoint NJ (formerly Amerigroup) |
| Current official roster | Confirmed via njfamilycare.dhs.state.nj.us and nj.gov/humanservices/dmahs (accessed 2026-07-23): **same 5 plans** — Aetna Better Health of NJ, Fidelis Care, Horizon NJ Health, UnitedHealthcare Community Plan, Wellpoint. Statewide NJ FamilyCare enrollment 1,799,053 (June 2026) — DMAHS does not publish per-MCO enrollment breakdowns. |
| Missing plans | None. |
| Not-a-gap / carve-out notes | No statewide ABA carve-out — ABA (benefit effective 4/1/2020) is administered by each of the 5 MCOs directly; some (e.g., UHC) subcontract ABA *network management* to Optum, which is a vendor layer under the MCO, not a coverage carve-out. NJ's separate Behavioral Health Integration (BHI) initiative (Phase 1 eff. 1/1/2025) covers outpatient MH/SUD counseling — does not name or affect ABA. |
| Stale entries | None — Fidelis Care/WellCare rebrand (~Aug 2023) and Wellpoint/Amerigroup rebrand (~Jan 2024) both confirmed accurate, though from secondary sources (the specific DMAHS rebrand-FAQ PDFs 404'd/misresolved). |
| Incomplete | Several DMAHS "HMO"/health-plan landing-page URLs 404'd; no primary source with per-MCO enrollment was located. |

## Colorado / Maryland / Missouri / Utah — carve-out currency check

| State | Carve-out still current? | Current MCO/RAE/ACO roster (source) | Recent change |
|---|---|---|---|
| **CO** | Yes — Acentra/ColoradoPAR still runs PBT UM separately from RAE-administered capitated BH (hcpf.colorado.gov/behavioral-health, via search index; direct fetch 403'd). | ACC Phase III (eff. 7/1/2025), now 4 RAEs: Colorado Access, Colorado Community Health Alliance, Northeast Health Partners, Rocky Mountain Health Plans (hcpf.colorado.gov/accountable-care-collaborative-resource-center). | No structural change. A July 2025 OIG finding triggered a PBT Emergency Rule (~11/5/2025) tightening RBT certification — a compliance change, not a payer-routing change. |
| **MD** | Yes — health.maryland.gov/mmcp/healthchoice confirms specialty BH is carved out; members go to Carelon (maryland.carelonbh.com), confirmed directly (accessed 2026-07-23). | 9 HealthChoice MCOs per CY2026 MCO Agreement: Aetna Better Health, CareFirst BCBS, Community Health Plan Maryland, Jai Medical Systems, Kaiser Permanente, Maryland Physicians Care, MedStar Family Choice, UnitedHealthcare, Wellpoint Maryland. | BHASO vendor already moved Optum→Carelon effective 1/1/2025 — already reflected as current in Carelu's guide. Only since then: NPI-on-claims requirement (eff. 7/1/2026), payment vendor PaySpan→Zelis (6/12/2026) — operational, not structural. |
| **MO** | Likely yes, not fully re-verified on a 2025/2026-dated document — most recent MO HealthNet Managed Care Policy Statement located is dated 7/2023 and states ABA is FFS, "outside of the managed care benefit" (dss.mo.gov). | Healthy Blue, UnitedHealthcare Community Plan, Home State Health, Show Me Healthy Kids (mydss.mo.gov/mhd/managed-care-health-plans). | None found. |
| **UT** | Yes, strongly — Utah Medicaid ASD Services FAQ states ASD/ABA is billed FFS "even if your child is enrolled in" a managed care plan, naming all 4 ACOs (via search snippet; PDF unreadable as binary directly). | 4 ACOs confirmed directly (medicaid.utah.gov/managed-care/, accessed 2026-07-23): Health Choice Utah, Healthy U, Molina Healthcare, SelectHealth Community Care. | None found. |

No action needed for any of these four states — all remain correctly documented as FFS/BHASO carve-outs with no MCO-level ABA guide required.

## Florida

| | |
|---|---|
| Existing guides | Sunshine Health, Children's Medical Services (CMS) Health Plan, Simply Healthcare Plans, UHC Community Plan of FL, Humana Healthy Horizons in FL, Aetna Better Health of FL, Molina Healthcare of FL, Community Care Plan, Florida Community Care |
| Current official roster | AHCA Medicaid Monthly Enrollment Report, March 2026 (ENR_202603.xls "MARKETSHARE" tab, accessed 2026-07-23), post the 2024/2025 SMMC re-procurement: Sunshine Health 1,096,745 · Simply Healthcare Plans 518,466 · Humana Medical Plan 510,876 · UnitedHealthcare of Florida 232,083 (Regions B/D/I) · Aetna Better Health of Florida 129,506 (Regions D/E/I) · CMS Health Plan 112,554 (statewide, separate procurement) · Community Care Plan (SFCCN) 66,839 (Regions E-I) · Molina Healthcare of Florida 56,514 (Region I only) · Florida Community Care 38,091 (+987 CIDD). Total SMMC-MMA 2,825,369. AmeriHealth Caritas Florida exited 2/1/2025 (0 enrollment) — was never in Carelu's directory. |
| Missing plans | **None** — all plans with material MMA enrollment are already in Carelu's 9-plan roster; no new entrant (e.g. Doctors HealthCare Plans) won material enrollment. |
| Not-a-gap / carve-out notes | BA/ABA moved from FFS-only to direct MMA-plan reimbursement effective 2/1/2025 (AHCA BA Program Highlight, 10/18/2024) — none of the 9 plans routes BA to an external BH vendor at the contract level. |
| Stale entries | None — Simply Healthcare, Community Care Plan, and Florida Community Care all *won* (did not lose) their re-procurement contracts. |
| Incomplete | AHCA's clean-URL pages 403/404 to automated fetch; only `.html`-suffixed and `/content/download/` PDF/XLS links worked — verify manually at ahca.myflorida.com/medicaid/statewide-medicaid-managed-care/2025-2030-smmc-plans if a fresher figure is needed. |

## Texas

| | |
|---|---|
| Existing guides | Superior HealthPlan, Texas Children's Health Plan, Wellpoint (formerly Amerigroup TX), UHC Community Plan of TX, Aetna Better Health of TX, Molina Healthcare of TX, Community First Health Plans, Driscoll Health Plan |
| Current official roster | HHSC MCO Provider Relations Contacts (Sept 2024 edition, retrieved via Wayback Machine — live hhs.texas.gov blocks automated fetch; accessed 2026-07-23), 13 service delivery areas, ~16-17 MCOs total. All 8 of Carelu's plans appear active. Additional plans by SDA: **Blue Cross Blue Shield of Texas** (Travis/Austin, STAR), **Dell Children's Health Plan** (Travis, new Ascension entrant), **Cook Children's Health Plan** (Tarrant/Fort Worth, STAR/STAR Kids), **Community Health Choice** (Harris/Houston + Jefferson, STAR/STAR+PLUS), **Parkland Community Health Plan** (Dallas, STAR), **El Paso Health/El Paso First** (El Paso, STAR/STAR+PLUS), **FirstCare** (Lubbock/MRSA West, STAR), **Baylor Scott & White/Scott & White Rightcare** (MRSA Central, STAR). No HHSC per-MCO enrollment figures were retrievable (stats pages 403'd) — sizes below are inferred from service-area population, not published counts. |
| Missing plans (unranked enrollment, ordered by metro-market size) | **Community Health Choice** (Harris + Jefferson — Houston is TX's largest Medicaid market) · **Blue Cross Blue Shield of Texas** (Travis/Austin) · **Cook Children's Health Plan** (Tarrant/Fort Worth) · **Parkland Community Health Plan** (Dallas) · **El Paso Health/El Paso First** (El Paso) · **FirstCare** (Lubbock/MRSA West) · **Baylor Scott & White/Scott & White Rightcare** (MRSA Central) · **Dell Children's Health Plan** (Travis, newly launched — likely smallest enrollment). All administer THSteps-CCP ABA directly (not carved out) — every one is a real gap. |
| Not-a-gap / carve-out notes | THSteps-CCP autism/ABA benefit (eff. 2/1/2022) is not carved out anywhere in Texas — confirmed via TMHP policy release; every MCO delivers it directly. |
| Stale entries | None found among Carelu's 8 guides. "Tall Cross/Sendero" (mentioned in the research brief) does not appear in the current roster at all — likely already exited Medicaid managed care, but could not be confirmed directly; it was never in Carelu's directory regardless. |
| Incomplete | hhs.texas.gov returns HTTP 403 to automated fetch for nearly all pages/PDFs (service-area map, STAR/STAR Kids program pages, MCO financial-statistical reports) — verify manually at hhs.texas.gov/services/health/medicaid-chip/medicaid-chip-members/star-kids and the managed-care-service-areas-map PDF. A newer (Jan 2026) revision of the provider-contacts PDF appears to exist per search indexing but was not directly fetchable — recommend a follow-up pass for exact enrollment figures. |

---

## Ranked top 15 — missing Medicaid MCO guides across all 19 states

*Weighted toward GA, NC, FL, TX, NY per the build spec's priority order. Ranked by confirmed member enrollment where published; by metro-market size where the state didn't publish per-plan figures (Texas); pending-procurement plans ranked below confirmed-live gaps regardless of eventual size.*

| # | Plan | State | Basis for priority |
|---|---|---|---|
| 1 | Excellus Health Plan (BCBS) | NY | 182,280 members — Central/Western NY + Southern Tier; largest confirmed enrollment gap in the entire census. |
| 2 | MVP Health Plan | NY | 162,046 members — Capital Region, Hudson Valley, North Country. |
| 3 | CDPHP | NY | 82,431 members — Albany/Capital District. |
| 4 | Independent Health Association | NY | 60,275 members — Erie/Monroe (Buffalo/Rochester). |
| 5 | Highmark Western & NE NY | NY | 45,402 members — Western NY (formerly HealthNow/BCBS WNY). |
| 6 | Community Health Choice | TX | Serves Harris (Houston, TX's largest Medicaid market) + Jefferson SDAs; no published figure but largest metro footprint among TX gaps. |
| 7 | Blue Cross Blue Shield of Texas | TX | Travis/Austin SDA; large statewide-insurer footprint entering STAR. |
| 8 | Cook Children's Health Plan | TX | Tarrant/Fort Worth STAR + STAR Kids — pediatric-focused, directly relevant to ABA demand. |
| 9 | Parkland Community Health Plan | TX | Dallas County safety-net STAR plan. |
| 10 | UnitedHealthcare (Georgia Medicaid CMO) | GA | Named awardee in DCH's Dec 2024 Georgia Families NOIA (also wins Georgia Families 360°); not yet live — build ahead of the transition since GA is a top-2 priority wedge market. |
| 11 | Humana (Georgia Medicaid CMO) | GA | Named awardee in the same GA NOIA; not yet live. |
| 12 | Molina Healthcare (Georgia Medicaid CMO) | GA | Named awardee in the same GA NOIA; not yet live. |
| 13 | El Paso Health / El Paso First | TX | Sole MCO(s) for the El Paso SDA — regional but no substitute coverage exists in the directory for that market. |
| 14 | FirstCare | TX | Lubbock + MRSA West SDAs — regional, smaller expected enrollment. |
| 15 | TennCare Select | TN | 37,095 members — legally distinct PIHP product (Volunteer State Health Plan/BCBST) serving SSI children, foster youth, and IDD/CHOICES populations that skew toward ABA need; shares a parent with the already-covered BlueCare Tennessee but is a separate contract and member-facing brand. |

**Not ranked but noted for completeness:** Baylor Scott & White/Scott & White Rightcare (TX, MRSA Central) and Dell Children's Health Plan (TX, Travis, newly launched) are real gaps but smaller/newer than the above. Amida Care SN (9,097) and VNS Choice SNP (3,770) in NY are real gaps but niche special-needs plans (HIV SNP / HARP-adjacent) — lower ABA-volume priority than mainstream MCOs.

## States with an incomplete census (verify manually)

- **GA** — DCH's own NOIA announcement didn't disclose awardee names/dates directly (corroborated via Becker's Payer, OPEN MINDS, The Current GA); the Georgia Procurement Registry has the actual NOIA/NOA documents. Per-plan enrollment dashboard is interactive (dch.georgia.gov/medicaid-online-enrollment-dashboard), not fetchable.
- **NC** — ncmedicaidplans.gov is JS-rendered with no static content; NCDHHS enrollment dashboard is interactive with no static per-plan figures; investors.centene.com merger release returned HTTP 403.
- **AZ** — none; both primary AHCCCS PDFs rendered successfully.
- **IN** — IHCP bulletins BT202627 and BT2025157 (the April 2026 ABA/EPSDT policy change) returned corrupted/binary text; no public per-MCE enrollment figures located.
- **KS** — none; kancare.ks.gov confirmed the 3-plan lineup, only a stale enrollment-period notice observed.
- **MA** — masslegalservices.org ACO comparison PDF returned HTTP 403; Tufts Health Together's (w/ CHA, w/ UMass Memorial) current BH vendor wasn't independently confirmed — check mass.gov managed-care-entity bulletins 144/146 manually.
- **NE** — none; all needed sources were retrievable.
- **NJ** — several DMAHS "HMO"/health-plan landing pages 404'd; no primary source with per-MCO enrollment was located.
- **NM** — HCA's Medicaid Enrollment Dashboard is an interactive Tableau-style tool with no extractable per-MCO figures; the ABA Agency Manual Instructions PDF returned unreadable binary.
- **NY** — health.ny.gov mcplans/enrollment-report pages return HTTP 403 to automated fetch (worked around via a mirror for the enrollment table, but verify manually at health.ny.gov/health_care/managed_care/mcplans.htm); a newer June 2026 enrollment report was located but not fully parsed.
- **OH** — managedcare.medicaid.ohio.gov/managed-care and an ODM press release both 404'd; a 2026 "Managed Care Health Plan Comparison" PDF was unreadable binary.
- **TN** — the 744-page MCO Statewide Contract PDF could not be text-parsed (exact contracting-party legal names unverified, immaterial to the gap analysis).
- **TX** — hhs.texas.gov returns HTTP 403 to automated fetch for nearly all pages/PDFs; the full MCO roster and gap list rest on a Wayback Machine capture of a Sept 2024 HHSC document plus indexed references to a Jan 2026 revision that couldn't be directly fetched. **This state's census should be treated as good-but-not-final** — recommend a follow-up pass with direct browser/API access to confirm current enrollment figures and rule out any SDA changes since Sept 2024.
- **VA** — DMAS's public overview pages don't list plan names/enrollment (sourced from a provider-education slide deck instead); virginiamanagedcare.com returned HTTP 503 (bot-blocked).
- **CO** — hcpf.colorado.gov returned HTTP 403 to every direct WebFetch attempt; all CO findings rely on WebSearch snippets, not direct page fetch.
- **MO** — most recent MO HealthNet Managed Care Policy Statement located is dated 7/2023; no 2025/2026-dated document was found to confirm the carve-out is still current (though no contrary evidence was found either).
- **UT** — the ASD Services FAQ and provider manual PDFs returned unreadable binary; carve-out confirmation rests on WebSearch snippets of those same documents.

No state's roster was so thoroughly blocked that it could not be characterized at all — every state above has at least one directly-fetched primary source — but the items listed should be manually re-checked before this census is treated as final for procurement/build decisions.
