/* ============================================================
   SEGMENT PAGE CONFIGS
   One object per vertical. Template renders them all identically.
   Add a new segment in 5 minutes — just add an object here + a route.
   ============================================================ */

export interface SegmentConfig {
  slug: string;
  label: string;
  pill: string;
  headline: string;
  headlineAccent: string;
  sub: string;
  painLabel: string;
  painHeadline: string;
  pains: { title: string; desc: string }[];
  solutionLabel: string;
  solutionHeadline: string;
  solutions: { title: string; desc: string }[];
  stats: { value: string; label: string }[];
  testimonial: {
    quote: string;
    name: string;
    role: string;
    company: string;
    initials: string;
  };
  ctaHeadline: string;
  ctaSub: string;
}

export const segments: Record<string, SegmentConfig> = {
  'aba-therapy': {
    slug: 'aba-therapy',
    label: 'ABA Therapy',
    pill: 'ABA Therapy Providers',
    headline: 'Stop losing families between diagnosis and',
    headlineAccent: 'first session.',
    sub: 'Parents are overwhelmed. Forms are long. Follow-up is slow. Carelu captures every ABA inquiry — chat, phone, text — and turns it into a scheduled assessment. 24/7.',
    painLabel: 'The challenge',
    painHeadline: 'ABA intake is broken from the inside out.',
    pains: [
      { title: '70% of families drop off', desc: 'They get a diagnosis, search for ABA, fill out part of a form, and give up. By the time your team follows up, they\'ve called someone else.' },
      { title: '5+ tools that don\'t talk', desc: 'Web forms, phone systems, email, CRM, fax — none of them connected. Your intake coordinator is the integration layer.' },
      { title: 'Insurance is a guessing game', desc: 'Families don\'t know if they\'re covered. Your team spends hours on verification calls that could happen in 14 seconds.' },
      { title: 'Nights and weekends go dark', desc: 'A parent searches "ABA therapy near me" at 10pm. Your office is closed. That lead is gone.' },
    ],
    solutionLabel: 'How Carelu helps',
    solutionHeadline: 'Built from the ground up for ABA intake.',
    solutions: [
      { title: 'AI that talks to families like a person', desc: 'Carelu guides parents through intake via chat, phone, or text — collecting child info, diagnosis details, insurance, and documents. In English and Spanish.' },
      { title: 'Insurance verified in 14 seconds', desc: 'Eligibility, ABA coverage (CPT 97153), in-network status, and referral requirements — checked automatically during the conversation.' },
      { title: 'Documents collected via text', desc: 'Insurance cards, diagnosis reports, consent forms, HIPAA authorization — families upload them conversationally. No portals.' },
    ],
    stats: [
      { value: '3×', label: 'More families admitted per month' },
      { value: '<10 min', label: 'First contact to intake-ready' },
      { value: '85%', label: 'Increase in intake completion' },
    ],
    testimonial: {
      quote: 'We were losing 60% of families before they ever completed intake. Carelu brought that number under 15% in the first month.',
      name: 'Maria C.',
      role: 'Clinical Director',
      company: 'Bright Horizons ABA',
      initials: 'MC',
    },
    ctaHeadline: 'Your ABA families are reaching out right now.',
    ctaSub: 'See how Carelu captures every inquiry and turns it into an admitted patient — without adding headcount.',
  },

  'home-care': {
    slug: 'home-care',
    label: 'Home Care',
    pill: 'Home Care Agencies',
    headline: 'Every missed referral is a family',
    headlineAccent: 'without care.',
    sub: 'Hospital discharge planners, physicians, and families are calling. If you don\'t answer in minutes, they move to the next agency. Carelu makes sure you never miss one.',
    painLabel: 'The challenge',
    painHeadline: 'Home care referrals don\'t wait.',
    pains: [
      { title: 'Referrals die in voicemail', desc: 'A discharge planner calls with a patient going home tomorrow. If you don\'t pick up, they call the next agency on the list.' },
      { title: 'Eligibility is a bottleneck', desc: 'Medicare, Medicaid, private insurance — each has different home care coverage rules. Manual verification takes hours.' },
      { title: 'Intake paperwork stalls care', desc: 'Physician orders, insurance authorizations, patient consent — collecting them from multiple sources delays start of care.' },
      { title: 'After-hours referrals go cold', desc: 'Hospitals discharge around the clock. Your intake team works 9–5. The gap costs you patients.' },
    ],
    solutionLabel: 'How Carelu helps',
    solutionHeadline: 'Referral-to-admission, fully automated.',
    solutions: [
      { title: 'Instant referral capture', desc: 'Carelu answers every call, text, fax, and web referral instantly — collecting patient details, diagnosis, and insurance before your team even sees it.' },
      { title: 'Real-time eligibility checks', desc: 'Medicare, Medicaid, and private insurance verified automatically. Coverage confirmed, authorization requirements flagged.' },
      { title: 'Automated document collection', desc: 'Physician orders, insurance cards, and consent forms collected from referring providers and families via text and email.' },
    ],
    stats: [
      { value: '< 3 sec', label: 'Referral response time' },
      { value: '24/7', label: 'Referrals captured around the clock' },
      { value: '0', label: 'Referrals lost to voicemail' },
    ],
    testimonial: {
      quote: 'We used to lose 30% of our hospital referrals because we couldn\'t respond fast enough. Now every referral gets an immediate response, even at 2am.',
      name: 'David K.',
      role: 'Director of Operations',
      company: 'Summit Home Health',
      initials: 'DK',
    },
    ctaHeadline: 'A referral just came in. Are you ready?',
    ctaSub: 'See how Carelu captures every home care referral and turns it into a patient — before the competition.',
  },

  'addiction-treatment': {
    slug: 'addiction-treatment',
    label: 'Addiction Treatment',
    pill: 'Addiction Treatment Centers',
    headline: 'When someone asks for help,',
    headlineAccent: 'every second matters.',
    sub: 'A person in crisis won\'t call back tomorrow. They won\'t fill out a four-page form. They need a response — now. Carelu makes sure they get one.',
    painLabel: 'The challenge',
    painHeadline: 'Addiction leads are the most time-sensitive in healthcare.',
    pains: [
      { title: 'The window is minutes, not days', desc: 'Someone searching "rehab near me" at 2am is ready right now. If they hit voicemail, they either call the next center or don\'t call at all.' },
      { title: 'Insurance verification delays admission', desc: 'Verifying behavioral health coverage, detox authorization, and out-of-network benefits manually can take hours — hours the patient doesn\'t have.' },
      { title: 'High call volume, low conversion', desc: 'Your team handles hundreds of inquiries. Most don\'t convert — not because they\'re unqualified, but because follow-up takes too long.' },
      { title: 'Bed availability changes by the hour', desc: 'By the time intake is complete, the bed might be gone. Speed from first contact to admission is everything.' },
    ],
    solutionLabel: 'How Carelu helps',
    solutionHeadline: 'From crisis call to admitted patient — in minutes.',
    solutions: [
      { title: 'Instant response, 24/7', desc: 'Carelu answers every call, text, and web inquiry immediately — no hold music, no voicemail, no "we\'ll call you back." The conversation starts now.' },
      { title: 'Insurance verified during the call', desc: 'Behavioral health coverage, detox authorization, in-network status — confirmed in real time while the person is still on the line.' },
      { title: 'Automated intake and follow-up', desc: 'Documents, consent forms, and clinical information collected conversationally. If something\'s missing, Carelu follows up automatically.' },
    ],
    stats: [
      { value: '< 3 sec', label: 'Average response time' },
      { value: '85%', label: 'Inquiry-to-admission rate' },
      { value: '24/7', label: 'Crisis response coverage' },
    ],
    testimonial: {
      quote: 'We were losing people in crisis because we couldn\'t answer fast enough. Carelu responds before the second ring. Our admission rate doubled in 60 days.',
      name: 'Sarah L.',
      role: 'VP of Admissions',
      company: 'New Horizons Recovery',
      initials: 'SL',
    },
    ctaHeadline: 'Someone is searching for help right now.',
    ctaSub: 'See how Carelu turns every inquiry into an admission — before the moment passes.',
  },

  'mental-health': {
    slug: 'mental-health',
    label: 'Mental Health',
    pill: 'Mental Health Providers',
    headline: 'They finally reached out.',
    headlineAccent: 'Don\'t lose them to a form.',
    sub: 'For someone struggling with anxiety or depression, calling a therapist is one of the hardest things they\'ll do. The last thing they need is a four-page intake form and a week-long wait.',
    painLabel: 'The challenge',
    painHeadline: 'Mental health intake wasn\'t designed for the patient.',
    pains: [
      { title: 'The courage to call is fragile', desc: 'A potential patient works up the nerve to reach out. They get a voicemail, a long form, or a "we\'ll get back to you in 3–5 days." They don\'t try again.' },
      { title: 'Wait lists create drop-off', desc: 'Long intake processes and slow follow-up turn a motivated patient into a no-show. By the time you\'re ready, they\'ve lost momentum.' },
      { title: 'Insurance confusion blocks access', desc: 'Patients don\'t know what\'s covered. Checking mental health parity, session limits, and copays manually takes your staff hours per patient.' },
      { title: 'Therapists spend time on admin, not care', desc: 'Your clinicians became therapists to help people — not to chase insurance cards and consent forms.' },
    ],
    solutionLabel: 'How Carelu helps',
    solutionHeadline: 'Intake that feels like care, not paperwork.',
    solutions: [
      { title: 'Warm, conversational intake', desc: 'Carelu guides patients through intake like a human conversation — collecting what\'s needed without making it feel clinical. Available 24/7 in English and Spanish.' },
      { title: 'Insurance verified instantly', desc: 'Mental health coverage, session limits, copays, in-network status — checked in real time during the conversation. No phone trees.' },
      { title: 'Automated scheduling and follow-up', desc: 'Once intake is complete, Carelu can trigger scheduling. If documents are missing, it follows up gently by text — no staff time required.' },
    ],
    stats: [
      { value: '85%', label: 'Increase in intake completion' },
      { value: '< 10 min', label: 'Intake to scheduled appointment' },
      { value: '0', label: 'Patients lost to intake friction' },
    ],
    testimonial: {
      quote: 'Our patients are anxious enough without a complicated intake process. Carelu made it feel like a conversation, not a burden. Completion rates went from 30% to over 80%.',
      name: 'Dr. Amy R.',
      role: 'Practice Owner',
      company: 'Mindbridge Therapy',
      initials: 'AR',
    },
    ctaHeadline: 'They finally asked for help. Be ready.',
    ctaSub: 'See how Carelu turns every inquiry into a scheduled session — with zero friction for the patient.',
  },

  'hospice': {
    slug: 'hospice',
    label: 'Hospice',
    pill: 'Hospice Providers',
    headline: 'Families in their hardest moment deserve',
    headlineAccent: 'an immediate answer.',
    sub: 'A family just learned their loved one is eligible for hospice. They\'re scared, overwhelmed, and looking for help now — not in 24–48 hours. Carelu ensures they find it.',
    painLabel: 'The challenge',
    painHeadline: 'Hospice referrals can\'t wait for business hours.',
    pains: [
      { title: 'Hospital referrals need same-day response', desc: 'A discharge planner calls at 4:30pm on a Friday. If you can\'t respond by Monday, the patient and family have already chosen another provider.' },
      { title: 'Families are in crisis', desc: 'This isn\'t a shopping decision. A family just learned their loved one is dying. They need compassion, clarity, and speed — not a callback form.' },
      { title: 'Eligibility verification is complex', desc: 'Medicare hospice benefit, Medicaid waivers, private insurance palliative care coverage — each case is different and manual verification is slow.' },
      { title: 'Intake paperwork delays start of care', desc: 'Physician certifications, DNR orders, advance directives, insurance authorizations — collecting them from hospitals and families takes days.' },
    ],
    solutionLabel: 'How Carelu helps',
    solutionHeadline: 'Compassionate intake, automated with care.',
    solutions: [
      { title: 'Immediate, 24/7 referral response', desc: 'Every call, fax, and web referral gets an instant response — collecting patient details, diagnosis, and family contact information around the clock.' },
      { title: 'Eligibility confirmed in real time', desc: 'Medicare hospice benefit, Medicaid, and private insurance coverage verified automatically. Certification requirements flagged before your team takes over.' },
      { title: 'Document collection from all parties', desc: 'Physician orders, insurance authorizations, advance directives, and consent forms collected from hospitals, physicians, and families via text and email.' },
    ],
    stats: [
      { value: '< 3 sec', label: 'Referral response time' },
      { value: '24/7', label: 'Family and hospital support' },
      { value: '2×', label: 'Faster referral-to-admission' },
    ],
    testimonial: {
      quote: 'Hospice families are going through the worst time of their lives. The fact that Carelu responds with warmth and immediately — at any hour — has changed how families experience our organization.',
      name: 'Linda P.',
      role: 'Director of Patient Services',
      company: 'Compassion Hospice',
      initials: 'LP',
    },
    ctaHeadline: 'A family needs you right now.',
    ctaSub: 'See how Carelu ensures every hospice referral gets an immediate, compassionate response.',
  },

  'single-site': {
    slug: 'single-site',
    label: 'Single-Site Providers',
    pill: 'Single-Site Practices',
    headline: 'One location. Every family',
    headlineAccent: 'accounted for.',
    sub: 'You don\'t have a 10-person intake team. You need a system that does the work of one — capturing leads, verifying insurance, and following up automatically so you can focus on clinical care.',
    painLabel: 'The challenge',
    painHeadline: 'Small team, big intake volume.',
    pains: [
      { title: 'Your intake coordinator is maxed out', desc: 'One person handling calls, forms, follow-ups, and insurance verification. When they\'re on the phone, everything else stops.' },
      { title: 'After-hours inquiries go nowhere', desc: 'A family finds you at 9pm. Your office is closed. By morning, they\'ve already scheduled elsewhere.' },
      { title: 'You can\'t afford to lose a single lead', desc: 'Every family matters when you\'re running one location. One lost referral is real revenue and a real child who doesn\'t get care.' },
      { title: 'Tools built for enterprise don\'t fit', desc: 'You don\'t need a 50-seat CRM. You need something that works on day one without an IT department.' },
    ],
    solutionLabel: 'How Carelu helps',
    solutionHeadline: 'Enterprise-grade intake at single-site pricing.',
    solutions: [
      { title: 'AI handles intake 24/7', desc: 'Carelu answers every call, text, and web inquiry — day or night. Your intake coordinator focuses on admitted patients, not chasing leads.' },
      { title: 'Live in days, not months', desc: 'No engineering, no IT team, no complex setup. Most single-site providers go live within a week.' },
      { title: 'Every lead tracked and followed up', desc: 'Insurance verified, documents collected, follow-ups automated. Nothing falls through the cracks even when your team is busy.' },
    ],
    stats: [
      { value: '3×', label: 'More families admitted without adding headcount' },
      { value: '< 1 week', label: 'Average time to go live' },
      { value: '0', label: 'Leads lost to after-hours gaps' },
    ],
    testimonial: {
      quote: 'We\'re a single-location ABA practice. Carelu gave us the intake capacity of a multi-site company without hiring anyone. Our admissions tripled in two months.',
      name: 'Dr. Sarah K.',
      role: 'Practice Owner',
      company: 'Key Autism Services',
      initials: 'SK',
    },
    ctaHeadline: 'Every family that reaches out deserves a response.',
    ctaSub: 'See how Carelu gives your single-site practice enterprise-level intake — at a price that makes sense.',
  },

  'multi-site': {
    slug: 'multi-site',
    label: 'Multi-Site Providers',
    pill: 'Multi-Site Practices',
    headline: 'Multiple locations.',
    headlineAccent: 'One intake system.',
    sub: 'You\'re growing across locations but your intake process doesn\'t scale. Each site does it differently. Leads get lost between offices. Carelu gives every location the same 24/7 AI intake — centrally managed.',
    painLabel: 'The challenge',
    painHeadline: 'Growth breaks intake before anything else.',
    pains: [
      { title: 'Inconsistent intake across locations', desc: 'Each office handles inquiries differently. Some respond fast, some don\'t. The family experience depends on which number they called.' },
      { title: 'No visibility across the pipeline', desc: 'You don\'t know how many leads came in yesterday across all locations — let alone how many converted. Reporting is manual and late.' },
      { title: 'Hiring intake staff for every new location', desc: 'Every new office needs a coordinator. That\'s salary, training, and months of ramp time before they\'re effective.' },
      { title: 'Leads routed to the wrong location', desc: 'A family in Tampa ends up in the Miami office\'s queue. By the time it\'s rerouted, they\'ve gone elsewhere.' },
    ],
    solutionLabel: 'How Carelu helps',
    solutionHeadline: 'Scale intake without scaling headcount.',
    solutions: [
      { title: 'One system, every location', desc: 'Carelu provides the same AI-powered intake across all your sites. Every inquiry gets the same quality response — 24/7, in English and Spanish.' },
      { title: 'Centralized dashboard', desc: 'See every lead, every location, in real time. Track conversion rates, response times, and pipeline health across your entire organization.' },
      { title: 'Smart routing', desc: 'Families are automatically matched to the nearest location with availability. No manual transfers, no lost leads.' },
    ],
    stats: [
      { value: '3×', label: 'More families admitted per location' },
      { value: '1 dashboard', label: 'For every location in your network' },
      { value: '0', label: 'New intake hires needed per location' },
    ],
    testimonial: {
      quote: 'We opened three new locations last quarter. With Carelu, we didn\'t hire a single new intake coordinator. Every site was live on day one.',
      name: 'James T.',
      role: 'VP of Operations',
      company: 'Cross River Therapy',
      initials: 'JT',
    },
    ctaHeadline: 'Growing shouldn\'t mean losing families.',
    ctaSub: 'See how Carelu scales your intake across every location — without scaling your team.',
  },

  'enterprise': {
    slug: 'enterprise',
    label: 'Enterprise',
    pill: 'Enterprise Organizations',
    headline: 'Intake infrastructure that',
    headlineAccent: 'scales with you.',
    sub: 'Enterprise behavioral health organizations need more than a chatbot. You need HIPAA-compliant AI that integrates with your EHR, CRM, and billing systems — with the security and reporting your board expects.',
    painLabel: 'The challenge',
    painHeadline: 'At scale, intake becomes infrastructure.',
    pains: [
      { title: 'Thousands of inquiries, no single source of truth', desc: 'Leads come in through dozens of channels across hundreds of locations. No one has a complete picture of the pipeline.' },
      { title: 'Compliance risk multiplies with scale', desc: 'Every location, every channel, every conversation is a potential compliance exposure. Manual oversight can\'t keep up.' },
      { title: 'Integration complexity', desc: 'Your EHR, CRM, billing system, and phone infrastructure all need to talk to each other. Most tools create more silos, not fewer.' },
      { title: 'Board-level reporting doesn\'t exist', desc: 'Your leadership needs real-time visibility into admission rates, lead sources, and conversion funnels — not spreadsheets assembled weekly.' },
    ],
    solutionLabel: 'How Carelu helps',
    solutionHeadline: 'Built for enterprise behavioral health.',
    solutions: [
      { title: 'Enterprise-grade security', desc: 'SOC 2 Type II certified, HIPAA compliant, BAAs signed. Your data is encrypted at rest and in transit with role-based access controls.' },
      { title: 'Deep integrations', desc: 'Connects to your EHR, CRM, billing platform, and phone systems via API. Carelu fits into your stack — it doesn\'t replace it.' },
      { title: 'Dedicated success team', desc: 'White-glove onboarding, custom configuration, and a dedicated customer success manager. We build it around your workflows.' },
    ],
    stats: [
      { value: '35,000+', label: 'Families connected to care' },
      { value: '80+', label: 'Providers on the platform' },
      { value: '12', label: 'States and growing' },
    ],
    testimonial: {
      quote: 'We needed something that could handle 500+ inquiries a day across 30 locations without adding staff. Carelu delivered in the first month.',
      name: 'Robert H.',
      role: 'Chief Operating Officer',
      company: 'National ABA Network',
      initials: 'RH',
    },
    ctaHeadline: 'Ready to scale intake across your organization?',
    ctaSub: 'See how Carelu provides enterprise-grade intake infrastructure for behavioral health organizations.',
  },
};
