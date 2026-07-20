/* ================================================================
   CRM COMPARISON CONFIGS (/carelu-vs-:slug)
   Individual "Carelu vs <CRM>" pages for the horizontal CRMs ABA
   providers reach for. These are generic business tools (not ABA
   care partners), so a direct comparison is fair — but every page
   ends on the same two-sided turn: combine them (Carelu works
   inside your CRM), OR use Carelu as your CRM. Third-party
   descriptions are public-information, category-level, with a
   verify-with-the-vendor note.
   ================================================================ */

export interface CrmFaq { q: string; a: string }
export interface CrmConfig {
  slug: string;          // -> /carelu-vs-<slug>
  name: string;
  pill: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  category: string;      // fair one-line category label
  intro: string[];
  whatItIs: string;      // fair, public-info description
  angle: string;         // the sentence that makes the distinction for THIS crm
  faq: CrmFaq[];
}

// The intake jobs are the same regardless of which CRM — shared table.
export const CRM_ROWS: { job: string; crm: string; carelu: string }[] = [
  { job: 'Answer a family at 9pm on a Saturday', crm: 'Only if you built the automation — and it can\'t actually talk to them', carelu: 'Answers live, in seconds, on phone, chat, form, or text' },
  { job: 'Verify insurance benefits', crm: 'Your staff, by phone, one family at a time', carelu: 'Done automatically at first contact' },
  { job: 'Collect documents & consents', crm: 'You design the forms; you chase the family', carelu: 'Collected conversationally, chased automatically' },
  { job: 'Follow up with a family who went quiet', crm: 'Fires the reminder you configured — to your staff', carelu: 'Re-engages the family directly, on its own' },
  { job: 'Qualify and route a new inquiry', crm: 'Rules you build and maintain', carelu: 'Qualified and routed for you, every time' },
  { job: 'Keep the record complete and current', crm: 'Only as complete as what your team types in', carelu: 'Fills itself from every conversation' },
  { job: 'Who does the intake work', crm: 'Your team — the CRM just remembers it', carelu: 'Carelu — your team does the human calls' },
];

export const crms: Record<string, CrmConfig> = {
  'salesforce': {
    slug: 'salesforce',
    name: 'Salesforce',
    pill: 'Carelu vs. Salesforce',
    h1: 'Carelu vs. Salesforce for ABA intake.',
    metaTitle: 'Carelu vs. Salesforce for ABA Intake — Do It vs. Manage It | Carelu',
    metaDescription:
      'Salesforce is the enterprise CRM standard — endlessly configurable, and your team operates all of it. Carelu is a care enablement platform that does ABA intake for you, and integrates with Salesforce so you never leave it.',
    category: 'the enterprise CRM standard',
    intro: [
      'Salesforce can model almost any process on earth — which is exactly why it takes admins, consultants, and constant upkeep to make it do anything. For ABA intake, the question isn\'t whether Salesforce can hold your pipeline (it can). It\'s who actually answers the family, verifies the insurance, and chases the documents. With Salesforce, that\'s always your team. With Carelu, it\'s Carelu.',
    ],
    whatItIs:
      'Salesforce is the market-leading enterprise CRM — highly customizable pipelines, automation (Flow), reporting, and a vast app ecosystem. Powerful and configurable; it requires setup and administration to operate. (Based on public information; verify current capabilities with the vendor.)',
    angle:
      'Salesforce gives you the most powerful empty database in the world. Carelu gives you the intake work already done — and drops the finished record into Salesforce.',
    faq: [
      { q: 'Is Carelu a replacement for Salesforce?', a: 'It can be, for intake — Carelu can serve as your system of record for families. But you don\'t have to replace anything: Carelu integrates with Salesforce, does the intake work, and syncs complete records into it, so your team keeps the Salesforce they know.' },
      { q: 'Does Carelu integrate with Salesforce?', a: 'Yes — Carelu connects to Salesforce (and offers webhooks for custom objects), so every family Carelu answers, verifies, and admits lands in Salesforce with the full record attached.' },
      { q: 'We already invested heavily in Salesforce. Why add Carelu?', a: 'Salesforce stores and automates; it can\'t answer a family at 9pm or verify insurance for you. Carelu does the actual intake work in front of Salesforce — filling the pipeline you already built instead of waiting for staff to.' },
    ],
  },

  'hubspot': {
    slug: 'hubspot',
    name: 'HubSpot',
    pill: 'Carelu vs. HubSpot',
    h1: 'Carelu vs. HubSpot for ABA intake.',
    metaTitle: 'Carelu vs. HubSpot for ABA Intake — Software You Run vs. Work Done | Carelu',
    metaDescription:
      'HubSpot is a polished all-in-one CRM for marketing, sales, and service — that your team still operates. Carelu is a care enablement platform that does ABA intake itself, and works inside HubSpot so you never leave it.',
    category: 'the all-in-one marketing & sales CRM',
    intro: [
      'HubSpot is one of the friendliest CRMs to run — clean pipelines, email sequences, forms, and dashboards. But "friendly to run" is still "you run it." Every sequence you build fires a reminder to a person; every form still needs a family to fill it and a coordinator to chase it. Carelu doesn\'t hand your team a to-do — it does the intake.',
    ],
    whatItIs:
      'HubSpot is an all-in-one CRM spanning marketing, sales, and service — pipelines, email automation, forms, live chat, and reporting, known for ease of use. It\'s software your team configures and operates. (Based on public information; verify current capabilities with the vendor.)',
    angle:
      'HubSpot automates reminders to your staff. Carelu automates the work itself — answering families, verifying insurance, collecting documents — then syncs it to HubSpot.',
    faq: [
      { q: 'Is Carelu a HubSpot alternative?', a: 'For intake, Carelu can be your system of record. But most providers keep HubSpot and add Carelu in front — Carelu does the intake and syncs complete records into HubSpot, so you keep your pipelines, sequences, and reports.' },
      { q: 'Does Carelu work with HubSpot?', a: 'Yes — Carelu connects to HubSpot natively and via webhooks, so admitted families flow into your HubSpot pipeline fully documented and verified.' },
      { q: 'HubSpot has chat and forms — isn\'t that intake?', a: 'Those are tools your team still operates and monitors. Carelu\'s chat, forms, phone, and text are staffed by the platform itself, 24/7 — it answers, qualifies, verifies, and follows up without anyone driving it.' },
    ],
  },

  'zoho': {
    slug: 'zoho',
    name: 'Zoho',
    pill: 'Carelu vs. Zoho',
    h1: 'Carelu vs. Zoho for ABA intake.',
    metaTitle: 'Carelu vs. Zoho CRM for ABA Intake — Manage Software vs. Get It Done | Carelu',
    metaDescription:
      'Zoho is an affordable, broad CRM suite your team configures and runs. Carelu is a care enablement platform that does ABA intake for you — and integrates with Zoho so you never have to leave it.',
    category: 'the affordable, broad CRM suite',
    intro: [
      'Zoho packs a lot into an affordable suite — CRM, forms, campaigns, and dozens of connected apps. The catch is the same as every CRM: someone has to assemble it, staff it, and keep it running. Carelu isn\'t another app to configure. It\'s the intake work, performed for you, that then feeds Zoho.',
    ],
    whatItIs:
      'Zoho offers a broad, budget-friendly business suite anchored by Zoho CRM — pipelines, automation, forms, and a large app ecosystem. Flexible and affordable; it\'s software your team sets up and operates. (Based on public information; verify current capabilities with the vendor.)',
    angle:
      'Zoho gives you affordable software to organize intake. Carelu gives you the intake done — and hands the record to Zoho.',
    faq: [
      { q: 'Can Carelu replace Zoho?', a: 'For intake, yes — Carelu can be your system of record. But you can also keep Zoho: Carelu does the intake and syncs complete records into Zoho CRM, so nothing about your setup has to change.' },
      { q: 'Does Carelu integrate with Zoho?', a: 'Yes — via native connections and webhooks, so families Carelu answers and verifies land in Zoho automatically.' },
      { q: 'Why not just build intake automation in Zoho?', a: 'You can build reminders and forms — but they still depend on your staff acting and families self-serving. Carelu performs the intake itself, around the clock, and reports the result into Zoho.' },
    ],
  },

  'monday': {
    slug: 'monday',
    name: 'monday.com',
    pill: 'Carelu vs. monday.com',
    h1: 'Carelu vs. monday.com for ABA intake.',
    metaTitle: 'Carelu vs. monday.com for ABA Intake — A Board vs. A Front Office | Carelu',
    metaDescription:
      'monday.com is a flexible work platform teams shape into an intake board. Carelu is a care enablement platform that does the ABA intake work itself — and syncs into monday.com so you never leave it.',
    category: 'the flexible work-management platform',
    intro: [
      'Teams love monday.com because you can shape it into anything — including an intake board with colorful statuses and automations. But a board is a place to track work, not a thing that does it. Every status still moves because a person moved it. Carelu is the front office that actually works the board for you.',
    ],
    whatItIs:
      'monday.com is a flexible work-management platform — customizable boards, statuses, automations, and views that teams configure into CRMs, intake trackers, and more. It\'s a canvas your team builds and operates. (Based on public information; verify current capabilities with the vendor.)',
    angle:
      'monday.com gives you a beautiful board to track intake. Carelu does the intake and updates the board for you.',
    faq: [
      { q: 'Is Carelu a monday.com alternative?', a: 'For intake, Carelu can be your system of record. But many teams keep their monday.com boards and add Carelu — Carelu does the intake and syncs each family\'s status and record into monday.com automatically.' },
      { q: 'Does Carelu connect to monday.com?', a: 'Yes — through native integration and webhooks, so Carelu can create and update items on your boards as it answers, qualifies, and admits families.' },
      { q: 'We built our whole intake board in monday. Do we lose it?', a: 'No — keep it. Carelu populates it for you, so your team watches families move through the board without doing the manual data entry and follow-up behind each move.' },
    ],
  },

  'clickup': {
    slug: 'clickup',
    name: 'ClickUp',
    pill: 'Carelu vs. ClickUp',
    h1: 'Carelu vs. ClickUp for ABA intake.',
    metaTitle: 'Carelu vs. ClickUp for ABA Intake — Task Management vs. Care Enablement | Carelu',
    metaDescription:
      'ClickUp is a powerful work and task platform some teams use as a lightweight CRM. Carelu is a care enablement platform that does ABA intake for you — and integrates with ClickUp so you never leave it.',
    category: 'the all-in-one work & task platform',
    intro: [
      'ClickUp can run your whole operation as tasks, docs, and lists — and plenty of teams bend it into a lightweight intake CRM. But tasks are things a person has to do. A ClickUp task that says "call the family back" is a reminder, not a callback. Carelu makes the callback — and every other intake step — happen on its own.',
    ],
    whatItIs:
      'ClickUp is an all-in-one work platform — tasks, docs, lists, automations, and views that teams adapt into CRMs and trackers. Deeply flexible; it\'s a system your team operates. (Based on public information; verify current capabilities with the vendor.)',
    angle:
      'ClickUp turns intake into a tidy task list for your team. Carelu completes the tasks — answering, verifying, following up — and logs them to ClickUp.',
    faq: [
      { q: 'Can Carelu replace ClickUp for intake?', a: 'It can serve as your system of record for families. But you can also keep ClickUp — Carelu does the intake work and syncs records and statuses into ClickUp so your existing setup keeps working.' },
      { q: 'Does Carelu integrate with ClickUp?', a: 'Yes — via native connection and webhooks, so Carelu can create and update ClickUp items as families move through intake.' },
      { q: 'Isn\'t ClickUp automation enough?', a: 'ClickUp automates task-shuffling between your people. Carelu automates the family-facing work itself — the answering, verifying, and chasing — which is where families are actually won or lost.' },
    ],
  },
};

export const CRM_SLUGS = Object.keys(crms);
