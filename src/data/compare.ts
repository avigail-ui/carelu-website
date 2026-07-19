/* ================================================================
   COMPARISON PAGE CONFIGS (/compare/:slug)
   Honest "different jobs, one funnel" pages for the platforms ABA
   providers already know. Descriptions of third-party products are
   based on public information and kept at the category level — each
   page carries a verify-with-the-vendor note. Carelu is positioned
   truthfully: the intake/front-office layer that runs BEFORE and
   ALONGSIDE practice-management platforms, not a replacement.
   ================================================================ */

export interface CompareRow { job: string; them: string; carelu: string }
export interface CompareFaq { q: string; a: string }
export interface CompareConfig {
  slug: string;
  name: string;           // third-party product name
  pill: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  whatItIs: string;       // fair, public-information description
  whereItStops: string;   // the front-office gap, framed at category level
  rows: CompareRow[];
  together: string;       // how they work side-by-side
  faq: CompareFaq[];
}

export const compares: Record<string, CompareConfig> = {
  'aloha-aba': {
    slug: 'aloha-aba',
    name: 'Aloha ABA',
    pill: 'Compare · Aloha ABA + Carelu',
    h1: 'Aloha ABA and Carelu: different jobs, one funnel.',
    metaTitle: 'Aloha ABA + Carelu: Practice Management vs. Intake | Carelu',
    metaDescription:
      'Aloha ABA is a practice-management platform for running an ABA practice. Carelu is the intake layer that answers, qualifies, and admits families before they ever reach your PM system. How the two fit together.',
    intro: [
      'If you\'re evaluating Aloha ABA — or already run your practice on it — the question isn\'t "Aloha or Carelu." They do different jobs. Aloha-style practice-management platforms run the practice you have: scheduling, billing, claims, payroll, the operational spine of delivering care. Carelu runs the funnel that fills it: answering every family who reaches out, completing intake, and verifying insurance before your team touches the file.',
    ],
    whatItIs:
      'Aloha ABA is a practice-management platform built for ABA providers — scheduling, billing and claims, data collection, and the day-to-day operations of running a practice. (Product details are based on public information; verify current capabilities with the vendor.)',
    whereItStops:
      'Practice-management systems are built around clients you\'ve already admitted. The window before that — the 2am website inquiry, the voicemail during a session block, the family that needs insurance verified and forms chased — mostly lives outside them. Our research found 41% of family inquiries arrive outside business hours, and not one of 114 providers studied let a family book during first contact. That pre-admission window is where 40–85% of families are lost.',
    rows: [
      { job: 'Scheduling, billing & claims for active clients', them: 'Core strength', carelu: 'Not Carelu\'s job' },
      { job: 'Session data collection & practice operations', them: 'Core strength', carelu: 'Not Carelu\'s job' },
      { job: 'Answering new families 24/7 (phone, chat, form, text)', them: 'Outside the PM scope', carelu: 'Core strength' },
      { job: 'Insurance verification at first contact', them: 'Typically after admission', carelu: 'Core strength' },
      { job: 'Document & consent collection with automatic follow-up', them: 'Varies', carelu: 'Core strength' },
      { job: 'Waitlist nurture & re-engagement', them: 'Outside the PM scope', carelu: 'Core strength' },
    ],
    together:
      'The clean division of labor: Carelu owns first contact to admission — instant answers on every channel, qualification, verification, documents, scheduling the assessment. The moment a family is admitted, they land in your practice-management system with a complete, verified record. No re-keying, no gap between "family said yes" and "practice can bill."',
    faq: [
      { q: 'Is Carelu a replacement for Aloha ABA?', a: 'No. Aloha-style platforms manage the practice — scheduling, billing, claims. Carelu is the intake layer in front: it answers, qualifies, and admits families, then hands complete records to whatever system runs your practice.' },
      { q: 'Does Carelu integrate with practice-management systems?', a: 'Carelu connects to leading CRMs and EMRs and supports webhooks for everything else, so admitted families arrive in your system of record with the full intake record attached.' },
      { q: 'What does Carelu add if we already have practice management?', a: 'The pre-admission funnel: 24/7 instant response on every channel, up-front insurance verification, automated document collection, and waitlist nurture — the window where our research shows 40–85% of families are lost.' },
    ],
  },

  'centralreach': {
    slug: 'centralreach',
    name: 'CentralReach',
    pill: 'Compare · CentralReach + Carelu',
    h1: 'CentralReach and Carelu: the EHR and the front door.',
    metaTitle: 'CentralReach + Carelu: Where Intake Fits Alongside Your EHR | Carelu',
    metaDescription:
      'CentralReach is the dominant EHR/practice-management suite for ABA. Carelu is the AI front office that fills it — answering families instantly, completing intake, and delivering admitted clients into your system of record.',
    intro: [
      'CentralReach is the system of record for a huge share of the ABA industry — clinical data, scheduling, billing, claims, and the workflows of delivering care at scale. Carelu doesn\'t compete with any of that. Carelu is the front door in front of it: the layer that catches every family the moment they reach out and turns inquiries into admitted, verified clients inside your EHR.',
    ],
    whatItIs:
      'CentralReach is an EHR and practice-management suite built for ABA and related therapies — clinical data collection, scheduling, billing and revenue cycle, reporting, and enterprise workflows. (Based on public information; verify current capabilities with the vendor.)',
    whereItStops:
      'An EHR\'s world starts when a client exists in it. The funnel before that — the inquiry that arrives Saturday night, the benefits check nobody ran until Thursday, the packet a parent abandoned on page nine — is front-office work, not EHR work. Our research across 249 provider accounts found the machinery for that window largely missing industry-wide: 41% of inquiries arrive after hours, only 2% of providers run automated re-engagement, and 0 of 114 offer in-conversation booking.',
    rows: [
      { job: 'Clinical data, scheduling, billing, RCM', them: 'Core strength', carelu: 'Not Carelu\'s job' },
      { job: 'Enterprise reporting & compliance workflows', them: 'Core strength', carelu: 'Not Carelu\'s job' },
      { job: 'Answering new families 24/7 (phone, chat, form, text)', them: 'Outside the EHR scope', carelu: 'Core strength' },
      { job: 'Qualification & insurance verification at first contact', them: 'Typically manual, post-inquiry', carelu: 'Core strength' },
      { job: 'Conversational document & consent collection', them: 'Portal/packet driven', carelu: 'Core strength' },
      { job: 'Waitlist nurture & re-engagement', them: 'Outside the EHR scope', carelu: 'Core strength' },
    ],
    together:
      'Carelu answers, qualifies, verifies, and collects — then delivers the admitted family into CentralReach as a complete record. Your clinical and billing teams start from a verified file instead of a sticky note. Carelu integrates with leading CRMs and EMRs, CentralReach included, with webhooks for anything custom.',
    faq: [
      { q: 'Does Carelu replace CentralReach?', a: 'No — CentralReach is the system of record for delivering care. Carelu is the intake layer in front of it, converting inquiries into admitted clients that arrive in your EHR fully documented and verified.' },
      { q: 'Does Carelu work with CentralReach?', a: 'Yes — Carelu connects to leading CRMs and EMRs including CentralReach, plus webhooks for custom flows, so intake data lands in your system of record without re-keying.' },
      { q: 'Why add Carelu if CentralReach has intake forms?', a: 'Forms are one step. The losses happen around them: unanswered after-hours calls, slow verification, abandoned packets, silent waitlists. Carelu runs that whole pre-admission funnel conversationally, 24/7.' },
    ],
  },

  'rethink-behavioral-health': {
    slug: 'rethink-behavioral-health',
    name: 'Rethink Behavioral Health',
    pill: 'Compare · Rethink + Carelu',
    h1: 'Rethink and Carelu: the platform and the pipeline.',
    metaTitle: 'Rethink Behavioral Health + Carelu: Platform vs. Intake Pipeline | Carelu',
    metaDescription:
      'Rethink Behavioral Health provides clinical, practice-management, and RCM tools for ABA providers. Carelu is the AI intake layer that fills the platform — answering every family instantly and running intake end to end.',
    intro: [
      'Rethink Behavioral Health offers a broad platform for ABA organizations — clinical tools, practice management, and revenue-cycle capabilities. Like every platform in its class, its center of gravity is the clients you already serve. Carelu\'s center of gravity is the families you haven\'t admitted yet — the inquiry-to-admission window where practices quietly lose almost half their demand.',
    ],
    whatItIs:
      'Rethink Behavioral Health is a behavioral-health technology platform spanning clinical/treatment tools, practice management, and RCM services for ABA and related providers. (Based on public information; verify current capabilities with the vendor.)',
    whereItStops:
      'Platform breadth doesn\'t reach the moment of first contact. When a parent calls at 8:40pm, submits a form on Sunday, or stalls on a consent packet, the platform can\'t help until someone — or something — responds, qualifies, verifies, and follows up. Our Intake Gap research found that machinery missing across the industry: 41% of inquiries arrive after hours and only 2% of providers automate re-engagement.',
    rows: [
      { job: 'Clinical tools, practice management, RCM', them: 'Core strength', carelu: 'Not Carelu\'s job' },
      { job: 'Staff training & clinical content', them: 'Platform scope', carelu: 'Not Carelu\'s job' },
      { job: 'Answering new families 24/7 (phone, chat, form, text)', them: 'Outside the platform scope', carelu: 'Core strength' },
      { job: 'Insurance verification at first contact', them: 'Typically post-inquiry', carelu: 'Core strength' },
      { job: 'Automated document collection & reminders', them: 'Varies', carelu: 'Core strength' },
      { job: 'Waitlist nurture & re-engagement', them: 'Outside the platform scope', carelu: 'Core strength' },
    ],
    together:
      'Run Rethink (or any platform) as your system of record, and put Carelu at the front: every inquiry answered in seconds, every family verified and documented, every admitted client delivered into your platform ready to schedule and bill. Two systems, one funnel, no families lost in the handoff.',
    faq: [
      { q: 'Is Carelu an alternative to Rethink?', a: 'No — they solve different problems. Rethink runs clinical and operational work for existing clients; Carelu converts new inquiries into admitted clients and hands them off to your platform.' },
      { q: 'Can Carelu feed intake data into our existing platform?', a: 'Yes — Carelu integrates with leading CRMs and EMRs and offers webhooks, so completed intakes land in your system of record automatically.' },
      { q: 'Where\'s the fastest ROI in adding Carelu?', a: 'After-hours and overflow response. 41% of family inquiries arrive outside business hours; answering them instantly is typically the single largest recoverable leak in an ABA funnel.' },
    ],
  },
};
