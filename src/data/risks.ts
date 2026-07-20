/* ================================================================
   FRONT-OFFICE RISK DATA (shared)
   The biggest risks an ABA front office carries — compliance,
   claim denials, prior auth, assessments, and more. Rendered on
   /aba-front-office-risks and embedded in the Zapier/Make page.
   General information, not legal/billing/clinical advice.
   ================================================================ */

export type RiskTag = 'Compliance' | 'Revenue' | 'Clinical';
export interface FrontOfficeRisk {
  title: string;
  tag: RiskTag;
  risk: string;        // what goes wrong
  consequence: string; // what it costs
  mitigation: string;  // how Carelu reduces it
}

export const FRONT_OFFICE_RISKS: FrontOfficeRisk[] = [
  {
    title: 'Handling PHI without a Business Associate Agreement',
    tag: 'Compliance',
    risk: 'The front office touches protected health information (PHI) from the very first message — names, dates of birth, diagnoses, insurance IDs. HIPAA requires a signed Business Associate Agreement (BAA) with every vendor that creates, receives, stores, or transmits that data on your behalf. Consumer automation tools, generic form builders, shared inboxes, spreadsheets, and chat apps typically do not sign one.',
    consequence: 'Routing PHI through a vendor with no BAA is itself a HIPAA violation — before any breach occurs. When PHI is processed by an uncontracted vendor, the covered entity (your practice) owns the violation.',
    mitigation: 'Carelu is HIPAA compliant and SOC 2 Type II, and signs a BAA with every provider. PHI stays inside a compliant system instead of flowing through tools that were never covered.',
  },
  {
    title: 'Claim denials from bad or missing intake data',
    tag: 'Revenue',
    risk: 'Most claim denials trace back to the front office: a mistyped member ID, a name that doesn\'t match the plan, an unverified plan, or missing demographics captured in a hurry. The error is invisible at intake and only surfaces weeks later when the claim bounces.',
    consequence: 'Denied and reworked claims, delayed cash, write-offs, and hours of staff time re-chasing families for information that should have been captured correctly the first time.',
    mitigation: 'Carelu captures insurance details accurately and conversationally at first contact and verifies benefits up front — so the record billing works from is right the first time.',
  },
  {
    title: 'Prior authorization gaps and lapses',
    tag: 'Revenue',
    risk: 'ABA almost always requires prior authorization — separately for assessment and treatment, in fixed increments (often 6 months). Services delivered before an auth is in place, after one lapses, or outside the authorized units frequently can\'t be billed.',
    consequence: 'Unbillable, often unrecoverable services — real care delivered for free — plus scramble and denials when a reauthorization slips through the cracks.',
    mitigation: 'Carelu captures the documentation each payer needs for authorization up front and keeps a complete, verified record, so nothing needed for the PA package is missing when it matters.',
  },
  {
    title: 'Assessment and documentation errors',
    tag: 'Clinical',
    risk: 'Payers demand specific diagnostic instruments, recency windows (e.g., assessments within a set number of months), and a Plan of Care with measurable, baseline-anchored goals. A missing tool, a stale evaluation, or an incomplete POC is a common reason assessments and treatment requests are denied.',
    consequence: 'Denied assessment or treatment authorizations, delayed starts, and families lost during the wait — after the clinical work has already been done.',
    mitigation: 'Carelu gathers the diagnosis report, tools used, and required documents at intake, flagging gaps before they reach the payer instead of after.',
  },
  {
    title: 'Starting families whose eligibility was never verified',
    tag: 'Revenue',
    risk: 'When benefits aren\'t confirmed up front, a family can begin services who turns out to be ineligible, out of network, or already at their benefit limit.',
    consequence: 'Uncompensated care, awkward mid-treatment conversations about coverage, and revenue that can\'t be recovered.',
    mitigation: 'Carelu verifies insurance and benefits at first contact, so your team spends assessment slots on families who can actually start care.',
  },
  {
    title: 'Medical-necessity and coverage mismatches',
    tag: 'Compliance',
    risk: 'Coverage rules vary by payer and plan — ASD-only indications, age ceilings, hour caps, concurrent-therapy restrictions, and state-mandate exemptions. A front office that treats every plan the same will promise care a plan doesn\'t cover.',
    consequence: 'Denials, compliance exposure, and families set up to expect services their plan won\'t pay for.',
    mitigation: 'Carelu is built around payer-aware intake, capturing the plan and details that determine coverage — and Carelu\'s payer guides keep the rules straight, payer by payer.',
  },
  {
    title: 'Missing consents and records-release authorizations',
    tag: 'Compliance',
    risk: 'Consent to treat, HIPAA acknowledgment, and release-of-information forms are easy to skip in a rushed intake — but they gate everything downstream, from requesting a diagnosis report to billing.',
    consequence: 'Stalled intakes, inability to obtain required records, and compliance gaps that surface in an audit.',
    mitigation: 'Carelu collects the required consents and releases conversationally, with automatic follow-up on anything missing.',
  },
  {
    title: 'PHI sprawl and breach exposure',
    tag: 'Compliance',
    risk: 'When intake runs on spreadsheets, personal email, shared inboxes, chat apps, and un-vetted SaaS, PHI ends up scattered across systems no one has secured or covered with a BAA. Every copy is another place a breach can happen — and automation logs can retain that data for weeks.',
    consequence: 'A breach triggers HIPAA breach-notification duties (patients, HHS, sometimes the media), investigation, and penalties — and each stray system multiplies the risk.',
    mitigation: 'Carelu unifies intake in one compliant system of record, so PHI stops living in a dozen places it was never meant to.',
  },
  {
    title: 'Audit and recoupment risk',
    tag: 'Compliance',
    risk: 'Payers and Medicaid audit documentation — supervision logs, timed-code start/stop times, real-time notes, and record-retention rules. Sloppy or back-dated documentation invites clawbacks long after the money was paid.',
    consequence: 'Recoupment of already-collected revenue, corrective action plans, and in serious cases exclusion from programs.',
    mitigation: 'Carelu produces a clean, timestamped intake record from first contact — the foundation an auditable file is built on.',
  },
  {
    title: 'Slow or after-hours response',
    tag: 'Revenue',
    risk: 'Before any compliance or billing risk even applies, the family has to be answered. Our research found 48% of family conversations start outside business hours — and the provider who responds first usually wins the placement.',
    consequence: 'Families lost to a competitor before intake ever begins — the largest and most invisible leak in the funnel.',
    mitigation: 'Carelu answers every family in seconds, on every channel, around the clock — so the compliance and revenue safeguards above actually get the chance to matter.',
  },
];
