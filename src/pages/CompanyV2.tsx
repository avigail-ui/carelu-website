import { Link } from 'react-router-dom';
import '../styles/retro96.css';

/* ================================================================
   COMPANY — 1996 edition. Same words, Web 1.0 presentation.
   ================================================================ */
export default function CompanyV2() {
  return (
    <div className="r96">
      <div className="r96-page">

        <div className="topnav">
          <Link to="/v2">[ HOME ]</Link>
          <Link to="/v2/carelu">[ CARELU ]</Link>
          <a href="mailto:hello@leadtrap.com">[ CONTACT ]</a>
        </div>

        <hr />
        <span className="wa wa-md wa-chrome">LeadTrap</span>
        <span className="eyebrow">The Company</span>
        <span className="wa wa-lg wa-purple">Vertical AI</span>
        <p className="lead"><b>for the businesses built on intake.</b></p>
        <hr />

        <p>
          Every service business <span className="c-red ital">lives or dies</span> on the first conversation
          &mdash; the inquiry that comes in and either becomes a customer or quietly disappears. LeadTrap builds
          the <span className="c-blue">AI front office</span> that makes sure none of them slip away: capturing
          every lead, qualifying it against the rules that matter, and carrying it all the way to a{' '}
          <span className="c-green">complete, ready record.</span>
        </p>

        <hr />

        {/* The three principles, as a 1996 list of bordered panels */}
        <div className="panel">
          <h3 style={{ margin: '0 0 6px', color: '#0000cc' }}>1. We go deep, not wide</h3>
          Generic AI is shallow everywhere. We build vertical AI that knows one industry cold &mdash; its rules,
          its language, its workflows &mdash; so it actually <span className="c-green">does the work</span> instead
          of describing it.
        </div>
        <div className="panel">
          <h3 style={{ margin: '0 0 6px', color: '#0000cc' }}>2. The data compounds</h3>
          Every conversation makes the system sharper for the next provider. That flywheel is something a
          horizontal tool can <span className="c-red">never catch up to.</span>
        </div>
        <div className="panel">
          <h3 style={{ margin: '0 0 6px', color: '#0000cc' }}>3. Software that does the job</h3>
          Not a dashboard that reminds you to do the work &mdash; a system that <span className="c-orange ital">does it</span>,
          so your people spend their time on the human part.
        </div>

        <hr />

        {/* Flagship product callout */}
        <span className="eyebrow">Our Flagship Product</span>
        <span className="wa wa-lg wa-green">Carelu</span>
        <p>
          The AI intake and lead-generation system for ABA and behavioral health providers &mdash; answering every
          family across every channel, qualifying them on contact, and completing the intake your coordinators used
          to <span className="c-red ital">chase for weeks.</span>
        </p>
        <p><Link to="/v2/carelu" className="btn95 go">Visit Carelu &raquo;</Link></p>

        <hr />

        <div className="marquee">
          <span>&nbsp;&nbsp; ★ Building something for your industry? ★ &nbsp; Drop us a line! &nbsp; ★ &nbsp; hello@leadtrap.com &nbsp; ★ &nbsp;</span>
        </div>

        <span className="wa wa-md wa-gold">Get In Touch</span>
        <p><b>Building something for your industry?</b></p>
        <p><a href="mailto:hello@leadtrap.com" className="btn95">✉ Get in touch</a></p>

        <hr />
        <div className="construction"><span>🚧 UNDER CONSTRUCTION 🚧</span></div>

        <div className="badges">
          <span className="badge netscape">NETSCAPE<br />NOW!</span>
          <span className="badge">MADE WITH<br />NOTEPAD</span>
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
