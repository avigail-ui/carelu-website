/* ================================================================
   INTEGRATION PAGE CONFIGS (/integrations/:slug)
   Partnership pages for the platforms ABA providers already run.
   Carelu is the intake layer that CONNECTS to these systems — it
   answers, qualifies, and verifies families, then delivers complete
   records into the platform. These platforms are partners in the
   funnel, never competitors; every page is written so their teams
   would be glad to read it. Third-party descriptions stay at
   category level with a verify-with-the-vendor note.
   ================================================================ */

export interface IntegrationStep { title: string; desc: string }
export interface IntegrationRow { job: string; where: string }
export interface IntegrationFaq { q: string; a: string }
export interface IntegrationConfig {
  slug: string;
  name: string;           // platform name
  pill: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  whatItIs: string;       // fair, public-information description
  whatCareluAdds: string; // the intake layer, framed additively
  flow: IntegrationStep[]; // how the integration works, start to finish
  rows: IntegrationRow[];  // who runs which job — positive framing
  faq: IntegrationFaq[];
}

export const integrations: Record<string, IntegrationConfig> = {
  'centralreach': {
    slug: 'centralreach',
    name: 'CentralReach',
    pill: 'Integration · CentralReach',
    h1: 'Carelu + CentralReach: intake, delivered into your EHR.',
    metaTitle: 'CentralReach Integration — AI Intake That Feeds Your EHR | Carelu',
    metaDescription:
      'Carelu connects with CentralReach: it answers every family instantly, completes intake, verifies insurance, and delivers admitted clients into CentralReach as complete, verified records — no re-keying.',
    intro: [
      'CentralReach is the system of record for a huge share of the ABA industry — and if it\'s yours, Carelu makes it stronger. Carelu sits at the very front of your funnel: it answers every family the moment they reach out, completes intake conversationally, verifies insurance, and then delivers the admitted client into CentralReach as a complete record. Your clinical and billing teams start from a verified file, not a sticky note.',
    ],
    whatItIs:
      'CentralReach is an EHR and practice-management suite built for ABA and related therapies — clinical data collection, scheduling, billing and revenue cycle, reporting, and enterprise workflows. (Based on public information; verify current capabilities with the vendor.)',
    whatCareluAdds:
      'Carelu adds the layer in front: 24/7 instant response on phone, chat, form, and text; qualification and insurance verification at first contact; conversational document and consent collection; and waitlist nurture. Every admitted family lands in CentralReach ready to schedule and bill.',
    flow: [
      { title: 'A family reaches out', desc: 'Phone, chat, web form, or text — any hour. Carelu answers in seconds, in English or Spanish.' },
      { title: 'Carelu qualifies & verifies', desc: 'Diagnosis status, location, availability, and insurance — verified up front, while the family is engaged.' },
      { title: 'Documents collect themselves', desc: 'Insurance cards, diagnosis reports, consents — gathered conversationally with automatic follow-up on anything missing.' },
      { title: 'The record lands in CentralReach', desc: 'The complete, verified intake syncs into your system of record. Nothing re-keyed, nothing lost in the handoff.' },
    ],
    rows: [
      { job: 'Answering new families 24/7, on every channel', where: 'Carelu' },
      { job: 'Qualification & insurance verification at first contact', where: 'Carelu' },
      { job: 'Document & consent collection with automatic follow-up', where: 'Carelu' },
      { job: 'Waitlist nurture & re-engagement', where: 'Carelu' },
      { job: 'Clinical data, scheduling, billing, RCM', where: 'CentralReach' },
      { job: 'Reporting, compliance & enterprise workflows', where: 'CentralReach' },
    ],
    faq: [
      { q: 'Does Carelu replace CentralReach?', a: 'No — they\'re complementary. CentralReach is the system of record for delivering care; Carelu is the intake layer in front of it. Together they cover the funnel end to end: Carelu converts inquiries into admitted clients, CentralReach runs their care.' },
      { q: 'How does Carelu connect to CentralReach?', a: 'Carelu integrates with leading CRMs and EMRs, CentralReach included, plus webhooks for custom flows — so completed intakes land in your system of record automatically, with the full record attached.' },
      { q: 'What changes for our team day to day?', a: 'New families are answered, verified, and documented before your team touches the file. Coordinators stop chasing packets and start families; clinical and billing teams open CentralReach to records that are already complete.' },
    ],
  },

  'rethink-behavioral-health': {
    slug: 'rethink-behavioral-health',
    name: 'Rethink Behavioral Health',
    pill: 'Integration · Rethink',
    h1: 'Carelu + Rethink: every family answered, every record delivered.',
    metaTitle: 'Rethink Behavioral Health Integration — AI Intake Layer | Carelu',
    metaDescription:
      'Carelu connects with Rethink Behavioral Health: instant 24/7 response to every family, conversational intake and insurance verification, and complete records delivered into your platform.',
    intro: [
      'Rethink Behavioral Health gives ABA organizations a broad platform — clinical tools, practice management, and RCM. Carelu makes that investment work harder by filling it: every inquiry answered in seconds around the clock, every family verified and documented, and every admitted client delivered into your platform ready to schedule and bill.',
    ],
    whatItIs:
      'Rethink Behavioral Health is a behavioral-health technology platform spanning clinical and treatment tools, practice management, and RCM services for ABA and related providers. (Based on public information; verify current capabilities with the vendor.)',
    whatCareluAdds:
      'Carelu adds the inquiry-to-admission pipeline: 24/7 answering across phone, chat, form, and text; up-front insurance verification; automated document collection and reminders; and waitlist nurture — with finished intakes flowing into your platform.',
    flow: [
      { title: 'A family reaches out', desc: 'Any channel, any hour — Carelu responds instantly, so no inquiry waits for the front desk to open.' },
      { title: 'Carelu qualifies & verifies', desc: 'The essentials captured and insurance verified while motivation is highest.' },
      { title: 'Documents collect themselves', desc: 'Consents, cards, and reports gathered in small conversational steps with automatic nudges.' },
      { title: 'The record lands in your platform', desc: 'Admitted clients arrive in Rethink complete and verified — no double entry.' },
    ],
    rows: [
      { job: 'Answering new families 24/7, on every channel', where: 'Carelu' },
      { job: 'Insurance verification at first contact', where: 'Carelu' },
      { job: 'Automated document collection & reminders', where: 'Carelu' },
      { job: 'Waitlist nurture & re-engagement', where: 'Carelu' },
      { job: 'Clinical tools, practice management, RCM', where: 'Rethink' },
      { job: 'Staff training & clinical content', where: 'Rethink' },
    ],
    faq: [
      { q: 'Is Carelu an alternative to Rethink?', a: 'No — they solve different halves of the same funnel. Rethink runs clinical and operational work for the clients you have; Carelu converts new inquiries into admitted clients and hands them to your platform.' },
      { q: 'Can Carelu feed intake data into Rethink?', a: 'Carelu integrates with leading CRMs and EMRs and offers webhooks, so completed intakes land in your system of record automatically.' },
      { q: 'Where does the integration pay off first?', a: 'After-hours and overflow response — 41% of family inquiries arrive outside business hours. Carelu catches them instantly, and your platform receives families who would otherwise never have made it in.' },
    ],
  },

  'aloha-aba': {
    slug: 'aloha-aba',
    name: 'Aloha ABA',
    pill: 'Integration · Aloha ABA',
    h1: 'Carelu + Aloha ABA: the front office for your practice system.',
    metaTitle: 'Aloha ABA Integration — AI Intake for Your Practice System | Carelu',
    metaDescription:
      'Carelu works alongside Aloha ABA: it answers every family 24/7, runs intake and insurance verification up front, and delivers admitted clients into your practice-management system with complete records.',
    intro: [
      'If Aloha ABA runs your practice — scheduling, billing, claims — Carelu runs the funnel that fills it. Every family who calls, chats, texts, or submits a form gets answered in seconds, any hour of the day. By the time a family reaches your practice system, they\'re verified, documented, and ready to schedule.',
    ],
    whatItIs:
      'Aloha ABA is a practice-management platform built for ABA providers — scheduling, billing and claims, data collection, and day-to-day practice operations. (Based on public information; verify current capabilities with the vendor.)',
    whatCareluAdds:
      'Carelu adds the pre-admission front office: instant 24/7 response on every channel, qualification and insurance verification at first contact, conversational document collection, and waitlist nurture — feeding your practice system complete, verified families.',
    flow: [
      { title: 'A family reaches out', desc: 'Carelu answers instantly on phone, chat, form, or text — nights, weekends, and lunch rushes included.' },
      { title: 'Carelu qualifies & verifies', desc: 'Insurance details captured and benefits verified before the family ages in a queue.' },
      { title: 'Documents collect themselves', desc: 'The packet becomes a conversation — completed on a phone, chased automatically when it stalls.' },
      { title: 'The family arrives ready', desc: 'Admitted clients land in your practice system with the complete intake record — ready to schedule and bill.' },
    ],
    rows: [
      { job: 'Answering new families 24/7, on every channel', where: 'Carelu' },
      { job: 'Insurance verification at first contact', where: 'Carelu' },
      { job: 'Document & consent collection with follow-up', where: 'Carelu' },
      { job: 'Waitlist nurture & re-engagement', where: 'Carelu' },
      { job: 'Scheduling, billing & claims', where: 'Aloha ABA' },
      { job: 'Session data & practice operations', where: 'Aloha ABA' },
    ],
    faq: [
      { q: 'Does Carelu replace Aloha ABA?', a: 'No — Aloha-style platforms manage the practice; Carelu is the intake layer in front. Carelu answers, qualifies, and admits families, then hands complete records to the system that runs your practice.' },
      { q: 'Does Carelu integrate with practice-management systems?', a: 'Yes — Carelu connects to leading CRMs and EMRs and supports webhooks, so admitted families arrive in your system of record without re-keying.' },
      { q: 'What does Carelu add if we already have practice management?', a: 'The pre-admission funnel: 24/7 instant response, up-front verification, automated document collection, and waitlist nurture — the window where our research shows 40–85% of families are lost.' },
    ],
  },
};
