import { Link } from 'react-router-dom';
import '../styles/retro96.css';

/* ================================================================
   GATEWAY — rendered like it's November 1996.
   All copy preserved from the modern Gateway; only the century changed.
   ================================================================ */
export default function GatewayV2() {
  return (
    <div className="r96">
      <div className="r96-page">

        <hr />
        {/* Big WordArt company logo, INTERCOM-ONLINE style */}
        <span className="wa wa-xl wa-chrome">LeadTrap</span>
        <div className="sky" />
        <span className="wa wa-md wa-gold">~ Online ~</span>
        <hr />

        <div className="marquee fast">
          <span>
            &nbsp;&nbsp; ★ WELCOME to LeadTrap Online! ★ &nbsp; You are visitor #
            <b>0042591</b> &nbsp; ★ &nbsp; Now serving Vertical A.I. over a 10 Megabit pipe! &nbsp; ★
            &nbsp; This site is best experienced with Netscape Navigator 3.0 &nbsp; ★ &nbsp;
          </span>
        </div>

        {/* Headline + sub (verbatim) */}
        <p className="lead">
          <b>LeadTrap</b> is the <span className="c-blue ital big">agentic infrastructure</span> company for{' '}
          <span className="c-red big">growth.</span>
        </p>
        <p>
          Vertical AI that <span className="c-green">captures</span>, <span className="c-orange">qualifies</span>, and{' '}
          <span className="c-purple">completes</span> every inquiry &mdash; for the industries that run on intake.
        </p>

        <p className="badges">
          <Link to="/v2/carelu" className="btn95 go">Enter Carelu &raquo;</Link>
          <a href="/demo" className="btn95">Request a Demo!</a>
        </p>

        <hr />

        {/* ===== Two products, as bordered 1996 panels ===== */}

        {/* THE PRODUCT — Carelu */}
        <span className="eyebrow">The Product</span>
        <span className="wa wa-lg wa-green">Carelu</span>
        <p><b>AI intake for ABA &amp; behavioral health</b></p>
        <p>
          Captures, qualifies, and completes every family's intake across every channel &mdash;
          built to <span className="c-red ital">never miss a lead.</span>
        </p>

        <div className="ss">
          <div className="ss-bar"><span>carelu.exe &mdash; Intake Chat</span><span className="x">X</span></div>
          <div className="ss-body">
            <span className="chat-bot">Hi! Welcome to Bright Horizons ABA &mdash; what's your child's name?</span>
            <span className="chat-me">Lucas. He has an autism diagnosis.</span>
            <span className="chat-bot">Wonderful. I can check your insurance coverage right now.</span>
          </div>
        </div>
        <p><Link to="/v2/carelu">Explore Carelu &rarr;</Link></p>

        <hr />

        {/* THE COMPANY — LeadTrap Suite */}
        <span className="eyebrow">The Company</span>
        <span className="wa wa-lg wa-purple">LeadTrap Suite</span>
        <p><b>Vertical AI front offices</b></p>
        <p>
          The company behind Carelu &mdash; building vertical AI for every industry that{' '}
          <span className="c-blue ital">lives or dies on intake.</span>
        </p>

        <div className="ss" style={{ maxWidth: 460 }}>
          <div className="ss-bar"><span>Intake Pipeline &mdash; Today</span><span className="x">X</span></div>
          <table className="grid96" style={{ width: '100%', margin: 0 }}>
            <thead>
              <tr><th align="left">Family</th><th>Channel</th><th>Status</th></tr>
            </thead>
            <tbody>
              <tr><td>Thompson family</td><td align="center">Phone</td><td align="center"><span className="c-blue">New</span></td></tr>
              <tr><td>Garcia family</td><td align="center">Web</td><td align="center"><span className="c-green">Qualified</span></td></tr>
              <tr><td>Lee family</td><td align="center">Text</td><td align="center"><span className="c-green">Completed</span></td></tr>
              <tr><td>Okafor family</td><td align="center">Fax</td><td align="center"><span className="c-green">Qualified</span></td></tr>
            </tbody>
          </table>
          <div className="ss-body" style={{ textAlign: 'center' }}>
            <span className="c-blue">128</span> captured &nbsp;&middot;&nbsp;
            <span className="c-green">96</span> qualified &nbsp;&middot;&nbsp;
            <span className="c-green">84</span> completed
          </div>
        </div>
        <p><Link to="/v2/company">Explore LeadTrap Suite &rarr;</Link></p>

        <hr />

        {/* ===== 1996 footer furniture ===== */}
        <div className="construction"><span>🚧 THIS SITE IS UNDER CONSTRUCTION &mdash; PLEASE PARDON OUR DUST 🚧</span></div>

        <p className="footer96">
          <span className="blink c-red">NEW!</span> &nbsp; You are visitor number:<br />
          <span className="counter">0042591</span>
        </p>

        <div className="badges">
          <span className="badge netscape">BEST VIEWED IN<br />NETSCAPE NAVIGATOR</span>
          <span className="badge">MADE WITH<br />NOTEPAD</span>
          <span className="badge email"><a href="/demo" style={{ color: '#fff' }}>✉ REQUEST DEMO</a></span>
        </div>

        <hr className="thin" />
        <p className="small">
          Copyright LeadTrap Inc. 1996<br />
          Email: <a href="mailto:hello@leadtrap.com">hello@leadtrap.com</a><br />
          Last Updated: November 12, 1996
        </p>

      </div>
    </div>
  );
}
