import { useState, useEffect } from 'react';
import '../styles/retro96.css';

/* ================================================================
   CARELU LANDING — as it would have shipped in November 1996.
   Every word of the modern landing page is preserved; only the
   decade changed. Tiled background, WordArt, <hr>s, rainbow
   keywords, a hit counter, and a blinking NEW! — the works.
   ================================================================ */

const BASELINE_DATE = new Date('2026-04-16T00:00:00Z').getTime();
const BASELINE_COUNT = 35000;
const GROWTH_PER_MS = 500 / (24 * 60 * 60 * 1000);
function getLiveCount() {
  return Math.floor(BASELINE_COUNT + Math.max(0, Date.now() - BASELINE_DATE) * GROWTH_PER_MS);
}

/* live "families admitted" hit-counter */
function LiveCounter() {
  const [count, setCount] = useState(getLiveCount);
  useEffect(() => { const i = setInterval(() => setCount(getLiveCount()), 10000); return () => clearInterval(i); }, []);
  const padded = count.toLocaleString('en-US').padStart(9, '0');
  return <span className="counter">{padded}</span>;
}

export default function LandingV2() {
  return (
    <div className="r96">
      <div className="r96-page">

        {/* ===== NAV ===== */}
        <div className="topnav">
          <a href="#how-it-works">[ PRODUCT ]</a>
          <a href="/v2/company">[ COMPANY ]</a>
          <a href="/login">[ LOG IN ]</a>
          <a href="/demo">[ REQUEST DEMO ]</a>
        </div>

        <hr />

        {/* ===== HERO ===== */}
        <span className="eyebrow blink">The very first care enablement platform</span>
        <span className="wa wa-xl wa-green">Carelu</span>
        <div className="sky" />
        <span className="wa wa-lg wa-chrome">The Future of Intake is HERE!</span>

        <p className="lead">
          Carelu runs your <span className="c-blue ital">entire intake operation</span> &mdash; from first contact
          to <span className="c-green">admitted patient.</span> Built for <span className="c-red">ABA therapy</span>{' '}
          and <span className="c-purple">behavioral health.</span>
        </p>

        <p>
          <a href="/demo" className="btn95 go">Get a Demo!</a>
          <a href="#how-it-works" className="btn95">See How It Works</a>
        </p>

        <div className="marquee fast">
          <span>
            &nbsp;&nbsp; ★ Answered in 8 SECONDS, day or night ★ &nbsp; Even at 11pm on a Saturday &mdash; no
            voicemail, no wait! &nbsp; ★ &nbsp; English &amp; Español &nbsp; ★ &nbsp; HIPAA compliant &nbsp; ★ &nbsp;
          </span>
        </div>

        <hr />

        {/* ===== LOGO BAR ===== */}
        <p><b>Trusted by 100+ of the fastest growing ABA providers</b></p>
        <p className="small">
          <span className="c-blue">Strive ABA</span> &nbsp;&bull;&nbsp;
          <span className="c-green">Golden Care</span> &nbsp;&bull;&nbsp;
          <span className="c-red">Grateful Care</span> &nbsp;&bull;&nbsp;
          <span className="c-purple">Supportive Care</span> &nbsp;&bull;&nbsp;
          <span className="c-orange">Cross River</span> &nbsp;&bull;&nbsp;
          <span className="c-blue">Total Care</span> &nbsp;&bull;&nbsp;
          <span className="c-green">Above &amp; Beyond</span> &nbsp;&bull;&nbsp;
          <span className="c-red">Blossom ABA</span> &nbsp;&bull;&nbsp;
          <span className="c-purple">Links ABA</span>
        </p>

        <hr />

        {/* ===== THE PROBLEM ===== */}
        <span className="eyebrow">The Problem</span>
        <span className="wa wa-md wa-red">Browser Chaos</span>
        <p className="lead">
          You're juggling multiple systems for <span className="c-blue">inquiries</span>,{' '}
          <span className="c-orange">forms</span>, <span className="c-green">insurance</span>, and{' '}
          <span className="c-purple">scheduling.</span>
        </p>
        <p>Creating a messy intake process that <span className="c-red ital">loses families</span> before they ever get to care.</p>

        <div className="ss">
          <div className="ss-bar"><span>Netscape &mdash; 17 windows open</span><span className="x">X</span></div>
          <div className="ss-body small">
            Monday.com &middot; DocuSign &middot; IntakeQ &middot; Gmail (47 unread) &middot; Google Voice &middot;
            eFax (3 incoming) &middot; Outlook &middot; Scheduling &middot; Insurance&hellip; &middot; Sheets &middot;
            Slack &middot; RingCentral (7 missed) &middot; Jotform &middot; Calendly (waitlist: 9) &middot;
            CentralReach &middot; Zoho &middot; PandaDoc &middot; WhatsApp Web &middot; Microsoft Teams &middot;
            Notion (<span className="c-red">!! Nobody follows this !!</span>)
          </div>
        </div>

        <hr />

        <span className="eyebrow">The Solution</span>
        <span className="wa wa-lg wa-green">Carelu Does It For You</span>
        <p>
          Every channel, instant qualification, document and signature collection, and follow-up that
          <span className="c-red ital"> never quits</span> &mdash; all handled by one AI built for ABA intake.
        </p>
        <p className="lead">
          <span className="c-blue">Phone</span> + <span className="c-green">Text</span> +{' '}
          <span className="c-purple">Email</span> + <span className="c-orange">Web</span> +{' '}
          <span className="c-red">Fax</span> &nbsp;&raquo;&raquo;&raquo;&nbsp;{' '}
          <b className="c-green big">✓ Completed Intake</b>
        </p>

        <hr />

        {/* ===== HOW IT WORKS ===== */}
        <a id="how-it-works" />
        <span className="eyebrow">How It Works</span>
        <span className="wa wa-lg wa-chrome">Scale Your Practice On Your Terms</span>
        <p>Carelu runs intake end-to-end, so you grow your caseload without growing your team.</p>

        {/* Step 1 */}
        <div className="panel">
          <h3 style={{ margin: '0 0 8px', color: '#0000cc', fontSize: 24 }}>1. They reach out. We pick up.</h3>
          <p style={{ margin: '0 0 10px' }}>
            Families reach out from everywhere &mdash; phone, text, email, web forms, your chat. Carelu answers
            every one <span className="c-green ital">instantly, around the clock</span>, in English and Spanish, so
            no family slips away before anyone's even at their desk.
          </p>
          <ul className="r96list">
            <li><b className="c-blue">Every channel, one inbox</b> &mdash; Phone, text, email, web, fax, and chat all land in a single view. Nothing gets lost.</li>
            <li><b className="c-blue">Answered in seconds</b> &mdash; Every family gets an instant response, day or night, not a voicemail they never return to.</li>
            <li><b className="c-blue">English &amp; Spanish</b> &mdash; Meets every family in their language from the first word.</li>
          </ul>
          <div className="ss" style={{ maxWidth: 360 }}>
            <div className="ss-bar"><span>Answered automatically &mdash; 24/7</span><span className="x">X</span></div>
            <div className="ss-body" style={{ textAlign: 'center' }}>
              <span className="wa wa-md wa-green" style={{ display: 'inline-block' }}>8s</span>
              <div className="small">average first response</div>
              <div className="small c-green">Even at 11pm on a Saturday &mdash; no voicemail, no wait.</div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="panel">
          <h3 style={{ margin: '0 0 8px', color: '#0000cc', fontSize: 24 }}>2. Qualified on contact.</h3>
          <p style={{ margin: '0 0 10px' }}>
            The moment a family reaches out, our agents check them against your clinic's rules &mdash; location,
            age, diagnosis, service type, insurance &mdash; and give a clear answer on the spot, so your team never
            spends a day on a family you <span className="c-red ital">can't serve.</span>
          </p>
          <ul className="r96list">
            <li><b className="c-orange">Your rules, one config</b> &mdash; Set your Service Areas once; every channel reads from the same rules and gives the same answer.</li>
            <li><b className="c-orange">Insurance, checked</b> &mdash; In-network, case-by-case, or not accepted &mdash; sorted automatically, per plan.</li>
            <li><b className="c-orange">Pre-approved on the spot</b> &mdash; Families see a clear yes or no in minutes, not after days of back-and-forth.</li>
          </ul>
          <table className="grid96">
            <caption>Insurance &mdash; checked per plan</caption>
            <thead><tr><th align="left">Plan</th><th>Status</th></tr></thead>
            <tbody>
              <tr><td>Blue Cross PPO</td><td align="center"><span className="c-green">In-network</span></td></tr>
              <tr><td>Aetna HMO</td><td align="center"><span className="c-orange">Case-by-case</span></td></tr>
              <tr><td>Cigna Open Access</td><td align="center"><span className="c-orange">Case-by-case</span></td></tr>
              <tr><td>Out-of-state Medicaid</td><td align="center"><span className="c-red">Not accepted</span></td></tr>
            </tbody>
          </table>
        </div>

        {/* Step 3 */}
        <div className="panel">
          <h3 style={{ margin: '0 0 8px', color: '#0000cc', fontSize: 24 }}>3. Intake, completed.</h3>
          <p style={{ margin: '0 0 10px' }}>
            Once a family qualifies, our agents keep going &mdash; collecting every document, gathering
            e-signatures, and following up on anything missing until the case is a complete intake. Your
            coordinators stop chasing leads and start <span className="c-green ital">building trust with families.</span>
          </p>
          <ul className="r96list">
            <li><b className="c-green">Documents &amp; e-signatures</b> &mdash; Collected in conversation, not chased over weeks of calls and texts.</li>
            <li><b className="c-green">Follow-up, handled</b> &mdash; The relentless chasing intake used to require, done for you.</li>
            <li><b className="c-green">A complete intake</b> &mdash; Qualified, documents in, consent signed &mdash; the case ready for your team to take on.</li>
          </ul>
          <div className="ss" style={{ maxWidth: 360 }}>
            <div className="ss-bar"><span>Jake Torres &mdash; Complete</span><span className="x">X</span></div>
            <div className="ss-body small">
              ✓ Qualified &mdash; Blue Cross PPO<br />
              ✓ Consent to Treat signed<br />
              ✓ HIPAA authorized<br />
              ✓ Insurance card on file<br />
              ✓ Diagnosis report on file<br />
              <span className="c-green"><b>Ready for your team to take on</b></span>
            </div>
          </div>
        </div>

        <hr />

        {/* ===== TESTIMONIALS ===== */}
        <span className="eyebrow">Customer Stories</span>
        <span className="wa wa-md wa-purple">Trusted by the Fastest-Growing ABA Providers</span>

        <div className="panel">
          &ldquo;Our intake coordinator was spending 6 hours a day on follow-ups. Now she spends that time helping
          families get started with care.&rdquo;<br />
          <span className="small">&mdash; <b>Maria C.</b>, Clinical Director, <span className="c-green">Golden Care</span></span>
        </div>
        <div className="panel">
          &ldquo;We opened three new locations last quarter. We didn't hire a single new intake coordinator. Every
          site was live on day one.&rdquo;<br />
          <span className="small">&mdash; <b>James T.</b>, VP of Operations, <span className="c-orange">Cross River Therapy</span></span>
        </div>
        <div className="panel">
          &ldquo;A parent texted us at 11pm on a Saturday. By Monday morning, their child was already scheduled for
          an assessment.&rdquo;<br />
          <span className="small">&mdash; <b>Rachel M.</b>, Director of Admissions, <span className="c-blue">Strive ABA</span></span>
        </div>
        <div className="panel">
          &ldquo;We went from losing 60% of families during intake to retaining 85%. The ROI was obvious within two
          weeks.&rdquo;<br />
          <span className="small">&mdash; <b>David K.</b>, Ops Manager, <span className="c-purple">Supportive Care ABA</span></span>
        </div>
        <div className="panel">
          &ldquo;We used to lose families over the weekend. Now Carelu handles Saturday and Sunday the same as
          Tuesday at 10am.&rdquo;<br />
          <span className="small">&mdash; <b>Sarah L.</b>, Intake Manager, <span className="c-green">Above &amp; Beyond</span></span>
        </div>
        <div className="panel">
          &ldquo;The follow-up alone saved us 20 hours a week. Parents get nudged for missing documents
          automatically.&rdquo;<br />
          <span className="small">&mdash; <b>Michael R.</b>, Regional Director, <span className="c-red">Blossom ABA</span></span>
        </div>

        <hr />

        {/* ===== RESULTS ===== */}
        <span className="eyebrow">Proven Results</span>
        <span className="wa wa-md wa-gold">The Results Speak Louder Than We Can</span>

        <p className="footer96">
          <span className="blink c-red">★ LIVE ★</span><br />
          <LiveCounter /><br />
          <span className="ital big">families admitted through Carelu</span>
        </p>

        <table className="grid96">
          <thead><tr><th>Stat</th><th>Result</th><th align="left">What it means</th></tr></thead>
          <tbody>
            <tr><td className="num">3&times;</td><td>More families admitted</td><td align="left">Same team. Same hours. Triple the output.</td></tr>
            <tr><td className="num">&lt;10 min</td><td>First contact to intake-ready</td><td align="left">What used to take 3-5 days.</td></tr>
            <tr><td className="num">85%</td><td>Family completion rate</td><td align="left">Industry average is under 30%.</td></tr>
            <tr><td className="num">0</td><td>Manual follow-ups</td><td align="left">Your team focuses on care, not chasing.</td></tr>
          </tbody>
        </table>

        <hr />

        {/* ===== COMPLIANCE ===== */}
        <span className="eyebrow">Security &amp; Compliance</span>
        <span className="wa wa-md wa-chrome">Your Compliance Team Will Love Us</span>
        <p><b>Built for healthcare from day one. Not retrofitted.</b></p>
        <table className="grid96">
          <tbody>
            <tr><td><b className="c-blue">HIPAA</b></td><td align="left">End-to-end encryption, signed BAAs, annual audits</td></tr>
            <tr><td><b className="c-blue">SOC 2</b></td><td align="left">Type II certified, continuous monitoring</td></tr>
            <tr><td><b className="c-blue">AES-256</b></td><td align="left">Encrypted at rest and in transit</td></tr>
            <tr><td><b className="c-blue">US Only</b></td><td align="left">HIPAA-eligible data centers</td></tr>
            <tr><td><b className="c-blue">RBAC</b></td><td align="left">Role-based access, full audit trail</td></tr>
            <tr><td><b className="c-blue">BAA</b></td><td align="left">Signed before you go live, every time</td></tr>
          </tbody>
        </table>

        <hr />

        {/* ===== FAQ ===== */}
        <span className="eyebrow">FAQ</span>
        <span className="wa wa-md wa-purple">Let's Clear Things Up</span>
        <p>Still have questions? <a href="mailto:hello@leadtrap.ai">We're real humans -- just ask.</a></p>

        <div className="panel">
          <p style={{ margin: 0 }}><b className="c-red">Q:</b> How does Carelu keep patient data safe?</p>
          <p style={{ margin: '6px 0 0' }}><b className="c-green">A:</b> End-to-end encryption, signed BAAs with every provider, annual SOC 2 Type II audits, and all data stored in HIPAA-eligible US data centers.</p>
        </div>
        <div className="panel">
          <p style={{ margin: 0 }}><b className="c-red">Q:</b> Will this replace our intake team?</p>
          <p style={{ margin: '6px 0 0' }}><b className="c-green">A:</b> No -- Carelu handles the repetitive parts (eligibility, documents, follow-ups) so your team focuses on clinical work and complex cases.</p>
        </div>
        <div className="panel">
          <p style={{ margin: 0 }}><b className="c-red">Q:</b> How long until we're live?</p>
          <p style={{ margin: '6px 0 0' }}><b className="c-green">A:</b> Most providers go live within 1-2 weeks. We handle setup, configure your insurance rules and conversation flows, and train your team.</p>
        </div>
        <div className="panel">
          <p style={{ margin: 0 }}><b className="c-red">Q:</b> What if a family needs a real person?</p>
          <p style={{ margin: '6px 0 0' }}><b className="c-green">A:</b> Carelu hands off to your team with full context -- everything collected, the family's preferences, and a conversation summary.</p>
        </div>
        <div className="panel">
          <p style={{ margin: 0 }}><b className="c-red">Q:</b> What does this actually cost?</p>
          <p style={{ margin: '6px 0 0' }}><b className="c-green">A:</b> Pricing is based on volume and channels. Most providers see positive ROI within the first month. Book a demo for your specific setup.</p>
        </div>

        <hr />

        {/* ===== CTA ===== */}
        <span className="wa wa-lg wa-red">Stop Losing Families.</span>
        <span className="wa wa-lg wa-green">Start Growing.</span>
        <p className="lead">Carelu handles intake end-to-end so your team delivers care, not paperwork.</p>
        <p className="small"><b>GO LIVE IN DAYS</b> &mdash; See how it works for your practice.</p>
        <p><a href="/demo" className="btn95 go">Get a Demo!</a></p>

        <hr />

        {/* ===== FOOTER SITEMAP ===== */}
        <span className="wa wa-md wa-chrome">carelu</span>
        <table className="sitemap">
          <thead>
            <tr><th>By Industry</th><th>The Product</th><th>Company</th></tr>
          </thead>
          <tbody>
            <tr>
              <td><a href="/for/aba-therapy">ABA Therapy</a></td>
              <td><a href="#how-it-works">How It Works</a></td>
              <td><a href="/v2/company">About LeadTrap</a></td>
            </tr>
            <tr>
              <td><a href="/for/mental-health">Mental Health</a></td>
              <td><a href="#how-it-works">Results</a></td>
              <td><a href="/demo">Request a Demo</a></td>
            </tr>
            <tr>
              <td><a href="/for/home-care">Home Care</a></td>
              <td><a href="#faq">FAQ</a></td>
              <td><a href="/login">Log in</a></td>
            </tr>
          </tbody>
        </table>

        <div className="construction"><span>🚧 THIS SITE IS UNDER CONSTRUCTION 🚧</span></div>

        <div className="badges">
          <span className="badge netscape">BEST VIEWED IN<br />NETSCAPE NAVIGATOR 3.0</span>
          <span className="badge">800 &times; 600</span>
          <span className="badge email"><a href="mailto:hello@leadtrap.ai" style={{ color: '#fff' }}>✉ hello@leadtrap.ai</a></span>
        </div>

        <hr className="thin" />
        <p className="small">
          &copy; 2026 Carelu, Inc.<br />
          Email: <a href="mailto:hello@leadtrap.ai">hello@leadtrap.ai</a><br />
          Last Updated: November 12, 1996
        </p>

      </div>
    </div>
  );
}
