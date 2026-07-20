/* ================================================================
   RESOURCE / BoFu PAGE CONFIGS
   Intent-matched articles for the small-but-real keyword cluster
   (aba waitlist management, client intake process, intake forms,
   intake drop-off). Add a page by adding an object + it's live at
   /resources/<slug> and should be added to sitemap.xml + llms.txt.
   ================================================================ */

export interface ResourceListItem { title: string; desc: string }
export interface ResourceSection {
  h2: string;
  body?: string[];          // paragraphs
  list?: ResourceListItem[]; // optional card list under the paragraphs
}
export interface ResourceFaq { q: string; a: string }
export interface ResourceCompareRow { step: string; manual: string; carelu: string }
export interface ResourceConfig {
  slug: string;
  pill: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string[];
  sections: ResourceSection[];
  download?: { label: string; file: string; blurb: string };
  faq: ResourceFaq[];
  // Optional "manual benchmark vs Carelu" comparison, rendered near the end.
  compareTitle?: string;
  compareIntro?: string;
  compare?: ResourceCompareRow[];
  ctaHeadline: string;
  ctaSub: string;
}

export const resources: Record<string, ResourceConfig> = {
  'aba-waitlist-management': {
    slug: 'aba-waitlist-management',
    pill: 'Guide · Waitlist Management',
    h1: 'ABA waitlist management: keep families engaged, not waiting.',
    metaTitle: 'ABA Waitlist Management: The Complete Guide | Carelu',
    metaDescription:
      'How ABA providers keep waitlisted families engaged, verified, and ready to start — instead of losing them to the first competitor with an opening. Free checklist included.',
    intro: [
      'Most ABA waitlists are where families go to disappear. A parent calls, gets told "we\'ll reach out when a spot opens," and then hears nothing for weeks. By the time you call back, they\'ve started with another provider — because every family on your waitlist is on three other waitlists too.',
      'Waitlist management isn\'t a spreadsheet problem. It\'s a communication and readiness problem: the providers who convert their waitlist treat it as a pipeline of families being actively prepared to start, not a queue of names waiting their turn.',
    ],
    sections: [
      {
        h2: 'Why ABA waitlists leak',
        body: [
          'Between diagnosis and first session, a family is at their most motivated — and their most impatient. Industry drop-off between first inquiry and first appointment commonly runs 40–85%. Three leaks account for almost all of it:',
        ],
        list: [
          { title: 'Silence', desc: 'No touchpoint between "you\'re on the list" and "a spot opened." Families read silence as rejection and keep shopping.' },
          { title: 'Unreadiness', desc: 'A spot opens, but the family\'s insurance was never verified and documents were never collected — so the opening sits empty for weeks while paperwork catches up.' },
          { title: 'Stale data', desc: 'By the time you call, the phone number changed, availability changed, or the child already started elsewhere. Nobody knew, because nobody asked.' },
        ],
      },
      {
        h2: 'What good waitlist management looks like',
        body: [
          'The goal is simple to state: when a spot opens, the next family should be able to start within days, not weeks. That takes four habits:',
        ],
        list: [
          { title: 'Verify eligibility at intake, not at opening', desc: 'Run insurance verification the day a family joins the waitlist. Families who won\'t clear benefits shouldn\'t age on your list for months first.' },
          { title: 'Collect documents up front', desc: 'Diagnosis report, insurance card, consents, availability — gather them while motivation is highest, the week the family first reaches out.' },
          { title: 'Touch every family on a cadence', desc: 'A short check-in every 2–3 weeks: position update, document nudges, availability confirmation. It keeps data fresh and tells families you haven\'t forgotten them.' },
          { title: 'Rank by readiness, not just date', desc: 'The next spot should go to the family who is verified, documented, and schedulable — order of arrival matters, but readiness decides who can actually start.' },
        ],
      },
      {
        h2: 'The metrics that matter',
        body: [
          'If you track nothing else, track these four: waitlist-to-start conversion rate (what share of waitlisted families ever begin services), time from opening to first session, share of the list that is "start-ready" (verified + documented), and contact freshness (when each family was last touched). A healthy list is above 60% start-ready with no family untouched for more than a month.',
        ],
      },
      {
        h2: 'Where automation fits',
        body: [
          'Everything above is rote, repetitive, and time-sensitive — which is exactly what front-office staff don\'t have hours for, and exactly what software does well. An AI intake platform like Carelu answers every new inquiry instantly, verifies insurance up front, collects documents while the family is motivated, and keeps every waitlisted family warm with automatic check-ins — so when a spot opens, the next family is ready to start, not ready to be chased.',
        ],
      },
    ],
    download: {
      label: 'Download the free ABA intake checklist (PDF)',
      file: '/downloads/aba-intake-checklist.pdf',
      blurb: 'Every step from first contact to first session — printable, and free to adapt for your practice.',
    },
    faq: [
      {
        q: 'How long is a typical ABA waitlist?',
        a: 'Anywhere from weeks to over a year depending on region and staffing. Length matters less than leakage: a six-month list that stays engaged converts better than a six-week list that goes silent.',
      },
      {
        q: 'How often should we contact waitlisted families?',
        a: 'Every two to three weeks, briefly. Confirm availability, nudge missing documents, and share their status. Less than monthly and families assume they\'ve been forgotten.',
      },
      {
        q: 'Should we verify insurance before or after a spot opens?',
        a: 'Before — the day they join the list. Verification at opening adds weeks of delay to every start and lets ineligible families age on the list.',
      },
    ],
    ctaHeadline: 'Your waitlist, working itself.',
    ctaSub: 'Carelu keeps every waitlisted family verified, documented, and warm — automatically. See it live on your own intake.',
  },

  'aba-client-intake-process': {
    slug: 'aba-client-intake-process',
    pill: 'Guide · Intake Process',
    h1: 'The ABA client intake process, step by step.',
    metaTitle: 'ABA Client Intake Process: Step-by-Step Guide | Carelu',
    metaDescription:
      'The complete ABA intake process — from first contact to first session — with the benchmarks, documents, and drop-off points at every step. Free checklist included.',
    intro: [
      'Intake is the funnel every ABA practice lives or dies by, and most practices have never mapped theirs. A family reaches out; days or weeks later they either start services with you — or with whoever answered first. Everything between those two moments is the intake process.',
      'Here is the full sequence, what belongs at each step, and where families are most likely to disappear.',
    ],
    sections: [
      {
        h2: 'Step 1 — First contact (the first five minutes)',
        body: [
          'A parent calls, chats, texts, or submits a form — usually after contacting several providers in one sitting. Speed decides this step: families overwhelmingly start with the provider who responds first with something substantive. Answer instantly, capture the essentials (child\'s age, diagnosis status, insurance, zip code, availability), and set the expectation for what happens next. If first response takes longer than a few minutes — or the call hits voicemail — assume a competitor has them.',
        ],
      },
      {
        h2: 'Step 2 — Qualification & insurance verification',
        body: [
          'Verify benefits before anything else moves: payer, plan, ABA coverage, deductible status, and whether you\'re in network. Practices that verify up front stop wasting assessment slots on families who can\'t clear benefits — and stop losing eligible families to the multi-week "we\'re checking your insurance" black hole. Target: verification complete within 24–48 hours of first contact.',
        ],
      },
      {
        h2: 'Step 3 — Documents & consents',
        body: [
          'The diagnosis report, insurance card, intake packet, and consent signatures. This is the step where momentum goes to die — long PDF packets, printer-and-scanner requests, and week-long email silences. Collect digitally, in small pieces, with automatic reminders. A family should be able to finish the packet on their phone the same week they first called.',
        ],
      },
      {
        h2: 'Step 4 — Assessment scheduling',
        body: [
          'Book the initial assessment while the family is engaged — ideally on the very first interaction, contingent on verification clearing. Every additional day between "you qualify" and a scheduled date measurably increases no-shows and dropouts.',
        ],
      },
      {
        h2: 'Step 5 — Authorization & onboarding',
        body: [
          'After the assessment: submit the auth request, track it against payer timelines, and keep the family informed while they wait. Then convert the authorization into a real schedule — team assignment, session times, and a clear first-day experience. Silence during the auth wait is the last big drop-off point; a weekly one-line status update largely eliminates it.',
        ],
      },
      {
        h2: 'The benchmarks to hold yourself to',
        list: [
          { title: 'First response', desc: 'Under 5 minutes, any hour a family might reach out — including evenings and weekends, when a large share of inquiries arrive.' },
          { title: 'Insurance verified', desc: 'Within 24–48 hours of first contact.' },
          { title: 'Documents complete', desc: 'Within one week of first contact.' },
          { title: 'Inquiry to first appointment', desc: 'Under two weeks wherever auth timelines allow. Every week added costs measurable conversion.' },
        ],
      },
    ],
    download: {
      label: 'Download the free ABA intake checklist (PDF)',
      file: '/downloads/aba-intake-checklist.pdf',
      blurb: 'The full process on one printable page — use it to map your own funnel and find your leaks.',
    },
    compareTitle: 'The same steps — done for you, in a fraction of the time.',
    compareIntro: 'Those benchmarks assume a fully-staffed team hitting every step on time. Carelu holds the whole sequence to the fast end of the range automatically, around the clock — so the delays that lose families never happen.',
    compare: [
      { step: 'First response', manual: 'Under 5 min — if someone is available', carelu: 'Instant, 24/7, on every channel' },
      { step: 'Insurance verification', manual: '24–48 hours, staff by phone', carelu: 'At first contact, automatically' },
      { step: 'Documents & consents', manual: '~1 week, with staff chasing', carelu: 'Same session, chased automatically' },
      { step: 'Assessment scheduling', manual: 'After verification clears', carelu: 'Booked in the first conversation' },
      { step: 'Inquiry → first appointment', manual: 'Under 2 weeks (the goal)', carelu: 'Days — no waiting on callbacks' },
    ],
    faq: [
      {
        q: 'How long should ABA intake take?',
        a: 'From first contact to first appointment: under two weeks where authorization timelines allow. The paperwork itself rarely needs more than a few days — the delay is almost always waiting on responses.',
      },
      {
        q: 'Where do most families drop out of intake?',
        a: 'At the very start (no response, or a voicemail) and during document collection. Both are solved by speed and small, digital, phone-friendly steps with automatic follow-up.',
      },
      {
        q: 'Can the intake process be automated?',
        a: 'Most of it — first response, qualification, insurance verification, document collection, reminders, and scheduling are all rote and time-sensitive. That\'s exactly what Carelu automates, with your team handling the conversations that need a human.',
      },
    ],
    ctaHeadline: 'Intake that runs itself.',
    ctaSub: 'Carelu answers every family instantly, verifies insurance, collects the documents, and books the assessment — end to end.',
  },

  'aba-intake-forms': {
    slug: 'aba-intake-forms',
    pill: 'Guide · Intake Forms',
    h1: 'ABA intake forms: what to include (+ free template).',
    metaTitle: 'ABA Intake Forms: What to Include + Free Template | Carelu',
    metaDescription:
      'Everything an ABA intake packet should cover — client and caregiver details, insurance, clinical history, availability, and consents — plus a free printable template.',
    intro: [
      'A good intake form collects everything your clinical and billing teams need to start services — without exhausting a family that is already stretched thin. Most packets fail in one of two directions: so short that staff spend a week chasing missing details, or so long that parents abandon them halfway.',
      'Here\'s what actually belongs in an ABA intake packet, section by section — and a free template you can adapt.',
    ],
    sections: [
      {
        h2: 'The seven sections every packet needs',
        list: [
          { title: '1 · Client information', desc: 'Child\'s legal name, date of birth, address, primary language, school/daycare placement.' },
          { title: '2 · Caregiver & contacts', desc: 'Parent/guardian names, relationship, phone, email, preferred contact method and times, emergency contact.' },
          { title: '3 · Insurance & funding', desc: 'Payer, member and group IDs, subscriber details, secondary coverage, and a photo of the card — enough to run verification without a follow-up call.' },
          { title: '4 · Diagnosis & clinical history', desc: 'Diagnosis, date, diagnosing provider, and the report itself; current and past therapies (ABA, OT, speech); medications; medical conditions relevant to care.' },
          { title: '5 · Goals & concerns', desc: 'What the family most wants help with, in their own words — behaviors of concern, safety issues, skills to build. This is clinical gold for the assessment.' },
          { title: '6 · Availability & logistics', desc: 'Days and times the child is available, preferred setting (home, center, school), transportation constraints.' },
          { title: '7 · Consents & policies', desc: 'Consent to treat, HIPAA acknowledgment, release of information for records requests, financial policy, and cancellation policy — each a separate signature.' },
        ],
      },
      {
        h2: 'The mistakes that kill completion',
        list: [
          { title: 'One giant PDF', desc: 'A 15-page packet emailed as an attachment gets printed, half-finished, and lost. Break it into short digital steps a parent can finish on a phone.' },
          { title: 'Asking twice', desc: 'If the family gave a detail on the first call, it should be pre-filled in the packet. Every repeated question erodes trust.' },
          { title: 'No follow-up', desc: 'Most incomplete packets just need a nudge. Automatic reminders at day 2 and day 5 recover a large share of stalled families.' },
          { title: 'Collecting everything before saying anything', desc: 'Don\'t gate a first conversation behind the full packet. Qualify with five questions, then collect the rest while verification runs in parallel.' },
        ],
      },
      {
        h2: 'Paper, PDF, or digital?',
        body: [
          'Digital, always — with paper as the exception for families who need it. Digital forms can be completed on a phone, validated as they\'re filled (no missing member IDs), fed straight into your systems without retyping, and chased automatically when they stall. Whatever tool you use, it must be HIPAA-compliant with a BAA — intake data is PHI from the first field.',
        ],
      },
      {
        h2: 'Beyond the form',
        body: [
          'The form is one step of a larger funnel — what happens around it (response speed, verification, reminders, scheduling) decides whether the family ever reaches a first session. Carelu turns the whole packet into a conversation: families answer naturally by chat, phone, or text; the record fills itself; and nothing is ever asked twice.',
        ],
      },
    ],
    download: {
      label: 'Download the free ABA intake form template (PDF)',
      file: '/downloads/aba-intake-form-template.pdf',
      blurb: 'All seven sections, ready to print or rebuild in your forms tool. Free to adapt for your practice.',
    },
    faq: [
      {
        q: 'How long should an ABA intake form be?',
        a: 'Long enough to cover the seven core sections, short enough to finish in 15–20 minutes on a phone. Anything the family already told you should be pre-filled.',
      },
      {
        q: 'Do intake forms need to be HIPAA-compliant?',
        a: 'Yes. Intake responses are PHI, so the collection tool needs HIPAA compliance and a signed BAA — a standard web-form builder without one doesn\'t qualify.',
      },
      {
        q: 'Can I use this template as-is?',
        a: 'Yes — it\'s free to use and adapt. Have your compliance or legal reviewer confirm the consent language matches your state and payer requirements.',
      },
    ],
    ctaHeadline: 'Forms that fill themselves.',
    ctaSub: 'Carelu collects the whole packet conversationally — phone, chat, or text — and never asks a family the same question twice.',
  },

  'aba-intake-drop-off': {
    slug: 'aba-intake-drop-off',
    pill: 'Guide · Intake Drop-Off',
    h1: 'ABA intake drop-off: why families disappear, and the fix.',
    metaTitle: 'ABA Intake Drop-Off: Why Families Disappear (and the Fix) | Carelu',
    metaDescription:
      'ABA providers lose 40–85% of families between first inquiry and first session. Where the drop-off happens, why, and the playbook for fixing each leak.',
    intro: [
      'Run the numbers on your own funnel and the result is usually a shock: of every ten families who reach out, somewhere between four and eight never make it to a first session. That\'s not a marketing problem — those families already found you, chose to contact you, and then fell out of a process you control.',
      'Drop-off clusters at four specific moments. Here\'s each one, why it happens, and what fixes it.',
    ],
    sections: [
      {
        h2: 'Leak 1 — The unanswered first contact',
        body: [
          'A large share of inquiries arrive after hours, on weekends, or while your coordinator is on another call. A parent who reaches voicemail doesn\'t leave a message and wait — they dial the next provider on their list. This is the single largest leak in most funnels, and the least visible: the families lost here never appear in your CRM at all.',
          'The fix: answer every channel, instantly, at every hour. Whether that\'s staffing or software, "first to respond" is the strongest predictor of who the family starts with.',
        ],
      },
      {
        h2: 'Leak 2 — The verification black hole',
        body: [
          'The family had a great first call — then heard nothing for two weeks while someone got around to checking benefits. From the parent\'s side, the process simply stopped. The fix: run insurance verification within 24–48 hours of first contact, and tell the family exactly what\'s happening while they wait. Silence, not the wait itself, is what loses them.',
        ],
      },
      {
        h2: 'Leak 3 — The paperwork stall',
        body: [
          'A 15-page packet lands in an inbox, gets half-finished on a Sunday night, and dies. No reminder ever comes. The fix: small digital steps a parent can finish on a phone, pre-filled with everything they\'ve already told you, with automatic nudges on day 2 and day 5. Most stalled packets just need a tap on the shoulder.',
        ],
      },
      {
        h2: 'Leak 4 — The long wait to start',
        body: [
          'Verified, documented families still evaporate when the gap to a first appointment stretches from days into months. Some wait is structural (staffing, auths) — but unmanaged wait is fatal. The fix is the waitlist playbook: rank by readiness, touch every family every 2–3 weeks, and fill every opening from a start-ready pool within days.',
        ],
      },
      {
        h2: 'The compounding math',
        body: [
          'These leaks multiply. Answer 70% of inquiries, verify 80% of those, complete packets with 75%, and start 80% of the remainder — and you\'re admitting only a third of the families who wanted you. Fix each leak to 95% and the same inquiry volume yields more than double the admissions, with zero additional marketing spend. That\'s why intake, not lead generation, is usually an ABA practice\'s cheapest growth lever.',
        ],
      },
      {
        h2: 'What fixing it takes',
        body: [
          'Every leak has the same shape: a rote, time-sensitive task that a busy human didn\'t get to in time. Which is why the durable fix is rarely "try harder" — it\'s making the first response, verification, document collection, reminders, and waitlist touches happen automatically, with your team focusing on the conversations that actually need a person. That\'s precisely what Carelu was built to do.',
        ],
      },
    ],
    download: {
      label: 'Download the free ABA intake checklist (PDF)',
      file: '/downloads/aba-intake-checklist.pdf',
      blurb: 'Map your own funnel against the full process and find where your families are leaking.',
    },
    faq: [
      {
        q: 'What is a normal intake conversion rate for ABA?',
        a: 'Many practices convert only 15–60% of inquiries into started clients. Well-run funnels — instant response, fast verification, digital paperwork, managed waitlists — reach 80%+.',
      },
      {
        q: 'What\'s the single highest-impact fix?',
        a: 'Answering every inquiry instantly, around the clock. It\'s the largest leak, the least visible, and the one fix that improves every downstream step.',
      },
      {
        q: 'How do I measure my own drop-off?',
        a: 'Count four numbers each month: inquiries, verified families, completed packets, and first sessions. The step with the biggest percentage fall is your leak — fix that one first.',
      },
    ],
    ctaHeadline: 'Stop the leaks.',
    ctaSub: 'Carelu answers instantly, verifies fast, chases every document, and keeps every family warm — so the families who found you actually start with you.',
  },
};
