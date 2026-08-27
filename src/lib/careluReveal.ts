/* Carelu is in stealth on the public LeadTrap site until this date.
   On/after it, the homepage product card and the Company page reveal the
   real Carelu branding + carelu.com link automatically — the check runs
   client-side on every visit, so no deploy is needed on the day.
   To change the reveal date, edit CARELU_REVEAL here (one source of truth). */
export const CARELU_REVEAL = new Date('2026-09-08T00:00:00-04:00'); // Sep 8, 2026 (ET)

export const careluRevealed = () => new Date() >= CARELU_REVEAL;

/* The homepage "Request demo" button is a plain "Coming soon" pill (no link)
   until this date. On/after it, it links to /demo again — same client-side
   check as the reveal above, so no deploy is needed on the day. */
export const DEMO_LIVE = new Date('2026-09-07T00:00:00-04:00'); // Sep 7, 2026 (ET)

export const demoLive = () => new Date() >= DEMO_LIVE;
