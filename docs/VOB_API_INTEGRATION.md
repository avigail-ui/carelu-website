# Carelu VOB API — Integration Guide

**For:** the engineer connecting our intake/eligibility system to the VOB service.
**What it does:** turns a raw PVerify 270/271 eligibility response into a complete,
decision-ready Verification of Benefits (VOB) for ABA — coverage, cost share, prior-auth
path, billing codes/rates, and the correct payer to bill — in ~1 second for most cases,
with a shaped fallback phone call for the rest.

---

## 1. Why this exists (the gap it fills)

PVerify (270/271) tells you the member is **active** and returns benefit figures in
generic X12 service-type buckets. It does **not** know, for ABA specifically:

- which of those buckets carries the ABA cost share,
- whether ABA needs prior authorization, and for which codes,
- what the ABA codes cover or pay (Medicaid),
- who actually administers the behavioral benefit (the carve-out — e.g. Cigna → Evernorth),
- whether the member's employer plan is self-funded (plan-governed) or fully-insured (mandate-protected).

The VOB API layers the Carelu payer directory (179 payer guides, 19 states, verified from
primary sources) on top of the PVerify response to answer all of the above — and, crucially,
to tell you **exactly what it still can't answer**, so nothing is guessed.

---

## 2. The workflow (first-time insurance check)

```
Intake captures card ─▶ Your system runs PVerify (270/271)
                              │
                              ▼
                   POST /api/vob  { payer271, member, employer, practice }
                              │
                    ┌─────────┴─────────┐
                    ▼                   ▼
          status INSTANT_COMPLETE   status CALL_NEEDED
          (full VOB, no call)       (instant VOB + openQuestions + callPlan)
                    │                   │
                    ▼                   ▼
          Show the family          AI agent calls the payer in business hours
          coverage + cost          → webhook posts the COMPLETED VOB back to you
                                    → answers saved to that employer group, so the
                                      NEXT member on that plan is INSTANT_COMPLETE
```

**Compounding:** the first member on a given plan/group may need the call; every subsequent
member on the same group resolves instantly from the stored answer.

---

## 3. Two integration phases — same contract

| | Phase 1 — instant VOB (LIVE NOW) | Phase 2 — full pipeline (after Railway deploy) |
|---|---|---|
| Endpoint | `POST /api/vob` (Vercel) | `POST /api/vob` (LeadTrap backend) — **same request** |
| Returns | synchronous instant VOB | same, **plus** schedules the call |
| Async | none | webhook posts the completed VOB when the call finishes |
| Your work | call it, read `status`/`openQuestions` | additionally: expose a `webhookUrl` to receive completions |

**Build against Phase 1 now.** Phase 2 is purely additive — the request shape and the
instant-response shape do not change; you just also start handling the webhook.

---

## 4. Endpoint

```
POST https://www.carelu.com/api/vob
Authorization: Bearer <VOB_API_KEY>
Content-Type: application/json
```

The `VOB_API_KEY` is issued out-of-band (ask Yoni). It authenticates your system to the
endpoint. Do not embed it in client-side code.

### Request body

```jsonc
{
  "member": {                      // optional but recommended
    "name": "Jordan Sample",
    "memberId": "U1234567801",
    "dob": "2016-04-12",
    "groupNumber": "3005678"       // key for the "resolve instantly next time" behavior
  },
  "payer271": {                    // REQUIRED — from the PVerify response
    "payerName": "Cigna",          // payer or plan name as PVerify returns it
    "payerId": "62308",            // optional; the clearinghouse payer ID if you have it
    "state": "GA",                 // member's state — improves payer resolution
    "eligibilityActive": true,     // did PVerify confirm active coverage?
    "stcBlocks": [                 // the benefit blocks PVerify returned, per service-type code
      { "stc": "MH", "active": true, "copay": 40, "coinsurance": null,
        "deductible": 500, "deductibleMet": 0, "oopMax": 6000, "oopMet": 1200, "network": "in" }
    ]
  },
  "employer": { "name": "Delta Air Lines" },   // optional — enables self-funded vs fully-insured
  "practice": {                                // your practice (for the call, Phase 2)
    "name": "Bright Steps ABA", "npi": "1770000000", "tin": "12-3456789",
    "callbackNumber": "555-010-4477"
  }
}
```

Minimum viable request: `payer271.payerName` (or `payerId`). Everything else sharpens the result.

### Response body

```jsonc
{
  "status": "INSTANT_COMPLETE" | "CALL_NEEDED" | "UNRESOLVED_PAYER",
  "resolvedPayer": { "slug": "cigna-georgia", "name": "...", "state": "GA",
                     "kind": "commercial", "web": "https://www.carelu.com/payers/cigna-georgia" },
  "eligibility": { "active": true },
  "routing": {
    "ediPayerId": { "pverify": "00004", "availity": "62308", "changeHealthcare": "62308" },
    "carveOut": {                          // null if ABA is not carved out
      "administrator": "Evernorth Behavioral Health",
      "administratorPayerId": "62308",     // the hop-2 payer ID to check eligibility against
      "abaRidesOn": "medical",
      "twoHopRequired": false
    }
  },
  "benefit": {                             // the ABA cost-share interpretation of your 271 blocks
    "abaBenefitBucket": "MH",              // WHICH block PVerify returns ABA cost share under
    "interpretationVerified": false,       // is HOW to read the dollar figure directory-verified?
    "copayUnit": "unverified",             // per-visit vs per-day — moves the family's number ~3x
    "deductibleAppliesToAba": "yes",
    "quality271Score": "high",             // does this payer return rich 271 detail, or junk?
    "from271": { "active": true, "copay": 40, "deductible": 500, ... },  // echoed from your input
    "resolved": false                      // true only when the block AND the interpretation are known
  },
  "coverage": [                            // per ABA code
    { "code": "97153", "covered": "Yes", "priorAuth": "Required — ...",
      "priorAuthKnown": true, "unitCap": "32 units/day", "notes": "..." }
  ],
  "rates": { "source": "...", "effectiveDate": "2025-10-01",
             "byCode": { "97153": { "rate": "$20.81", "unit": "15min" } } },   // Medicaid only; null otherwise
  "employer": { "sponsorNameNormalized": "DELTA AIR LINES", "funding": "mixed",
                "medicalFunding": "self-funded", ... },   // null if no employer sent / no 5500 match
  "openQuestions": [                       // THE VOB-QUALITY SIGNAL — what data can't answer
    "Verify the ABA cost share on the MH benefit: copay or coinsurance, per visit or per day, deductible?"
  ],
  "gatingResolved": false,                 // true == full no-call VOB
  "callPlan": {                            // null when gatingResolved; else the residual call
    "phone": "877-279-7603",
    "callThe": "Evernorth Behavioral Health",
    "hours": "Mon–Fri 8:30–5:00 CT",
    "scriptedQuestions": [ "...only the unanswered fields..." ]
  },
  "disclaimer": "..."
}
```

### How to read it

- **`status: INSTANT_COMPLETE`** → you have a full VOB. Render it; no call needed.
- **`status: CALL_NEEDED`** → use the instant portion for what's known; `openQuestions` is
  exactly what's missing, and `callPlan` is how to get it. In Phase 1 you'd have staff make
  that call; in Phase 2 the agent does it and webhooks the completion.
- **`status: UNRESOLVED_PAYER`** → the payer/state didn't match a guide (not covered yet, or a
  name mismatch). Fall back to a manual VOB and log it.
- **`openQuestions.length` is your quality metric.** Empty = fully mechanical. The list shrinks
  over time as call write-backs and uploaded documents fill gaps.

---

## 5. Phase 2 webhook (completion callback)

When the agent's call finishes, the backend POSTs to your `webhookUrl`:

```
POST <your webhookUrl>
X-Vob-Signature: sha256=<HMAC of the raw body, keyed with VOB_API_KEY>
Content-Type: application/json

{ "requestId": "...", "status": "COMPLETE" | "FAILED" | "NO_ANSWER",
  "vob": { ...the full instant portion, now with the call answers filled in... },
  "callAnswers": [ { "question": "...", "answer": "..." } ],
  "payerRefNumber": "REF-...", "transcriptRef": "..." }
```

Verify the signature (recompute the HMAC of the raw body with the shared `VOB_API_KEY`) before
trusting it. Then merge `vob` into the member's record.

---

## 6. Field glossary

- **stcBlock** — one PVerify benefit block for a service-type code (`stc`), carrying the
  cost-share figures PVerify returned. You pass these straight through from the 271.
- **abaBenefitBucket** — which `stc` the payer reports ABA cost share under (e.g. `MH`, `A6`,
  `30`). The service reads your matching block to get the real copay.
- **carveOut / twoHopRequired** — when ABA is administered by a behavioral vendor, the eligibility
  question must be asked against `administratorPayerId`, not the medical payer. `twoHopRequired`
  flags when a second eligibility check is needed.
- **interpretationVerified / resolved** — the dollar figure is only trustworthy when the directory
  has verified *how to read it* (copay unit + deductible applicability). `resolved: false` means
  "we can see a number but can't promise what it means" → it becomes an open question.
- **medicalFunding** — `self-funded` (plan-document-governed, mandate-exempt) vs `fully-insured`
  (mandate-protected) vs `unknown`. Derived from DOL Form 5500 filings; absence of a match is
  always `unknown`, never `fully-insured`.

---

## 7. Test it now

The Phase-1 endpoint is live. Send fake PVerify data and grade the `openQuestions`:

```bash
curl -X POST https://www.carelu.com/api/vob \
 -H "Authorization: Bearer <VOB_API_KEY>" \
 -H "content-type: application/json" \
 -d '{
   "payer271": { "payerName":"Cigna", "state":"GA", "eligibilityActive":true,
     "stcBlocks":[{"stc":"MH","active":true,"copay":40,"deductible":500}] },
   "employer": {"name":"Delta Air Lines"}
 }'
```

Try a Medicaid payer (`"payerName":"Trillium Health Resources","state":"NC"`), a payer with a
carve-out (Cigna/Anthem), and a self-funded vs fully-insured employer, and watch how the
routing, `benefit.resolved`, and `openQuestions` change.

Directory reference: `GET https://www.carelu.com/api/payers` (index),
`GET https://www.carelu.com/api/payers/{slug}` (one guide, including its full `vob` block).

---

## 8. Deploying Phase 2 (backend, for the call + webhook)

Branch `vob-call-agent` in `LeadTrap/LeadTrap` (PR #2854). Deploy to a **new staging service**
(not `prod`): provision Postgres + Redis, set env vars (`ELEVENLABS_API_KEY`,
`ELEVENLABS_WEBHOOK_SECRET`, `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `DATABASE_URL`,
`REDIS_URL`, `VOB_API_KEY`), run migrations (auto on boot), keep the `vob_call_agent` feature
flag at 0% until ready for live dialing. The dedicated outbound number `+1-701-645-7312` and the
ElevenLabs agent are already provisioned. **Reference implementation:** `carelu-website/api/vob.ts`
is the corrected instant-VOB logic — port its `paRequired` field read and single-record `stcMap`
handling into the backend's `vob_instant.ts`.
