import DemoModalHost from '../components/DemoModal';
import { Nav } from './Landing';

/* ================================================================
   TERMS OF SERVICE — LeadTrap, Inc. dba Carelu
   Text sourced from LeadTrap_Terms_of_Service.pdf (Last updated
   April 27, 2026). Plain legal document page; not linked in the nav.
   ================================================================ */

const INK = '#1A1A1A';
const BONE = '#FAF8F3';
const MUTED = 'rgba(43,42,38,0.72)';

function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{
      fontFamily: 'var(--font-display)', fontSize: 26, fontWeight: 400,
      color: INK, letterSpacing: '-0.02em', margin: '44px 0 14px',
    }}>{children}</h2>
  );
}

function P({ children }: { children: React.ReactNode }) {
  return <p style={{ fontSize: 15, color: MUTED, lineHeight: 1.75, margin: '0 0 14px' }}>{children}</p>;
}

function B({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: INK, fontWeight: 600 }}>{children}</strong>;
}

export default function TermsPage() {
  return (
    <div className="session-light" style={{ background: BONE, color: '#2B2A26', minHeight: '100vh' }}>
      <DemoModalHost />
      <Nav base="/carelu" />

      <main style={{ maxWidth: 760, margin: '0 auto', padding: 'clamp(140px, 16vw, 190px) clamp(20px, 5vw, 40px) 90px' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(36px, 4.5vw, 54px)', fontWeight: 400,
          color: INK, letterSpacing: '-0.025em', lineHeight: 1.1, margin: 0,
        }}>
          Terms of Service
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(43,42,38,0.55)', margin: '14px 0 0' }}>
          LeadTrap, Inc. dba Carelu &middot; Last updated: April 27, 2026
        </p>

        <div style={{ height: 1, background: 'rgba(43,42,38,0.12)', margin: '36px 0 8px' }} />

        <P>
          These Terms of Service (the &ldquo;Terms&rdquo;) govern access to and use of the services provided by
          LeadTrap, Inc., a Delaware corporation doing business as Carelu (&ldquo;LeadTrap,&rdquo; &ldquo;Carelu,&rdquo;
          &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;), by the customer identified in an executed Service Order Form
          (&ldquo;Customer&rdquo; or &ldquo;you&rdquo;). These Terms are incorporated by reference into each Service Order Form
          executed between LeadTrap and Customer (each, an &ldquo;Order Form&rdquo;). Together, these Terms and the
          applicable Order Form constitute the agreement between the parties (the &ldquo;Agreement&rdquo;).
        </P>
        <P>
          In the event of any conflict between these Terms and an Order Form, the Order Form shall prevail with respect
          to the subject matter of that conflict. Capitalized terms used but not defined in these Terms have the meanings
          given in the applicable Order Form.
        </P>
        <P>
          By executing an Order Form, accessing the Services, or otherwise indicating acceptance of these Terms,
          Customer agrees to be bound by these Terms.
        </P>

        <H2>1. Services</H2>
        <P>
          LeadTrap provides AI-powered lead capture, intake automation, and related front-office services for healthcare
          and other businesses (collectively, the &ldquo;Services&rdquo;). The Services may include, without limitation,
          AI-powered chatbot functionality for lead capture, qualification, and response; automated intake conversation
          management; documentation collection (such as insurance cards and referral records); third-party integrations;
          and such other front-office automation features as the parties may agree upon in writing from time to time.
        </P>
        <P>
          The specific configuration, integrations, and scope of Services applicable to Customer are set forth in the
          Order Form. LeadTrap may, from time to time, update, modify, or enhance the Services, provided that such changes
          do not materially diminish the core functionality of the Services.
        </P>

        <H2>2. Customer Accounts and Access</H2>
        <P>
          <B>Account Registration.</B> Customer is responsible for providing accurate and complete information when
          establishing an account and for keeping such information current. Customer is responsible for all activity that
          occurs under its account.
        </P>
        <P>
          <B>Authorized Users.</B> Customer may permit its employees, contractors, and agents (&ldquo;Authorized
          Users&rdquo;) to use the Services on Customer&rsquo;s behalf, provided that Customer remains responsible for
          each Authorized User&rsquo;s compliance with the Agreement.
        </P>
        <P>
          <B>Credentials.</B> Customer is responsible for maintaining the confidentiality of all account credentials and
          for notifying LeadTrap promptly of any unauthorized use or suspected security breach.
        </P>

        <H2>3. Acceptable Use</H2>
        <P>Customer shall not, and shall not permit any Authorized User or third party to:</P>
        <ul style={{ margin: '0 0 14px', paddingLeft: 22 }}>
          {[
            'use the Services in violation of any applicable law, regulation, or third-party right;',
            'use the Services to send unsolicited communications, spam, or other prohibited messaging;',
            'attempt to reverse engineer, decompile, disassemble, or otherwise derive the source code of the Services, except to the extent such restriction is prohibited by applicable law;',
            'interfere with, disrupt, or attempt to gain unauthorized access to the Services or any related systems or networks;',
            'use the Services to develop, train, or improve any competing product or service, or any artificial intelligence or machine learning model intended to compete with LeadTrap;',
            'upload or transmit any content that is unlawful, infringing, harmful, or that violates the privacy rights of any third party; or',
            'resell, sublicense, or otherwise make the Services available to any third party except as expressly permitted by the Agreement.',
          ].map((li) => (
            <li key={li} style={{ fontSize: 15, color: MUTED, lineHeight: 1.75, marginBottom: 6 }}>{li}</li>
          ))}
        </ul>

        <H2>4. Customer Data</H2>
        <P>
          <B>Definition.</B> &ldquo;Customer Data&rdquo; means all data and content submitted to, processed by, or
          generated through the Services by or on behalf of Customer, including data collected from Customer&rsquo;s
          prospective patients, clients, or end users.
        </P>
        <P>
          <B>Ownership.</B> As between the parties, Customer retains all right, title, and interest in and to the
          Customer Data. Customer grants LeadTrap a non-exclusive, worldwide, royalty-free license to access, use,
          process, transmit, and display the Customer Data solely as necessary to provide the Services and to perform
          LeadTrap&rsquo;s obligations under the Agreement.
        </P>
        <P>
          <B>Customer Responsibilities.</B> Customer represents and warrants that it has all necessary rights, consents,
          and authorizations to provide the Customer Data to LeadTrap and to permit LeadTrap to process such data as
          contemplated by the Agreement, including any required notices to and consents from end users.
        </P>
        <P>
          <B>Aggregated and De-Identified Data.</B> LeadTrap may collect, use, and disclose aggregated and de-identified
          data derived from the operation of the Services for any lawful purpose, including to operate, improve, and
          develop the Services, provided that such data does not identify Customer or any individual and is handled in
          accordance with applicable law, including HIPAA where applicable.
        </P>

        <H2>5. HIPAA and Protected Health Information</H2>
        <P>
          To the extent LeadTrap creates, receives, maintains, or transmits Protected Health Information
          (&ldquo;PHI&rdquo;), as defined under the Health Insurance Portability and Accountability Act of 1996, as
          amended (&ldquo;HIPAA&rdquo;), on behalf of Customer, the parties agree that the business associate provisions
          set forth in the applicable Order Form (or in a separately executed Business Associate Agreement) shall govern
          such PHI. Customer is responsible for ensuring that its use of the Services complies with HIPAA and all other
          applicable laws governing the privacy and security of health information.
        </P>

        <H2>6. Fees and Payment</H2>
        <P>
          Customer shall pay all fees set forth in the Order Form in accordance with the payment terms specified therein.
          Except as expressly provided in the Order Form or these Terms, all fees are non-refundable. Fees are exclusive
          of taxes, and Customer is responsible for all applicable taxes (other than taxes based on LeadTrap&rsquo;s net
          income). Late payments may accrue interest at the lesser of 1.5% per month or the maximum rate permitted by law.
          LeadTrap may suspend the Services upon at least ten (10) days&rsquo; prior written notice if Customer fails to
          pay undisputed amounts when due and does not cure such failure within the notice period.
        </P>

        <H2>7. Term and Termination</H2>
        <P>
          The term, renewal, and termination provisions for the Services are set forth in the applicable Order Form. In
          addition to any termination rights set forth in the Order Form, either party may terminate the Agreement
          immediately upon written notice if the other party becomes insolvent, makes an assignment for the benefit of
          creditors, files for bankruptcy, or has a receiver appointed for substantially all of its assets.
        </P>
        <P>
          Upon expiration or termination of the Agreement: (a) Customer&rsquo;s right to access and use the Services will
          cease; (b) Customer shall pay all fees accrued through the effective date of termination; and (c) LeadTrap
          shall make Customer Data available for export in accordance with the applicable Order Form. Sections that by
          their nature should survive termination (including, without limitation, Confidentiality, Customer Data
          ownership, Fees and Payment for amounts accrued, Limitation of Liability, Indemnification, and Governing Law)
          shall survive.
        </P>

        <H2>8. Confidentiality</H2>
        <P>
          Each party (the &ldquo;Receiving Party&rdquo;) shall maintain the confidentiality of the other party&rsquo;s
          (the &ldquo;Disclosing Party&rdquo;) Confidential Information and shall not use such Confidential Information
          except as necessary to perform under the Agreement or disclose it to any third party except as expressly
          permitted herein. &ldquo;Confidential Information&rdquo; means any non-public information disclosed by the
          Disclosing Party that is designated as confidential or that reasonably should be understood to be confidential
          given the nature of the information and the circumstances of disclosure, including the terms and pricing of any
          Order Form.
        </P>
        <P>
          Confidential Information does not include information that: (a) is or becomes publicly available through no
          fault of the Receiving Party; (b) was rightfully known to the Receiving Party prior to disclosure; (c) is
          rightfully obtained from a third party without a duty of confidentiality; or (d) is independently developed by
          the Receiving Party without use of or reference to the Disclosing Party&rsquo;s Confidential Information. The
          Receiving Party may disclose Confidential Information to the extent required by law, provided that it gives the
          Disclosing Party reasonable advance notice (where legally permitted) so that the Disclosing Party may seek a
          protective order.
        </P>

        <H2>9. Intellectual Property</H2>
        <P>
          LeadTrap and its licensors retain all right, title, and interest in and to the Services, including all
          software, technology, documentation, know-how, and intellectual property rights therein. Subject to the
          Agreement, LeadTrap grants Customer a limited, non-exclusive, non-transferable, non-sublicensable right during
          the term to access and use the Services solely for Customer&rsquo;s internal business purposes.
        </P>
        <P>
          Customer may, but is not obligated to, provide LeadTrap with feedback, suggestions, or comments regarding the
          Services (&ldquo;Feedback&rdquo;). Customer grants LeadTrap a perpetual, irrevocable, worldwide, royalty-free
          license to use and incorporate such Feedback into the Services and other LeadTrap products and services without
          any obligation to Customer.
        </P>

        <H2>10. Warranties and Disclaimers</H2>
        <P>
          LeadTrap warrants that the Services will perform substantially in accordance with any applicable documentation.
          EXCEPT AS EXPRESSLY SET FORTH IN THE AGREEMENT, THE SERVICES ARE PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
          AVAILABLE,&rdquo; AND LEADTRAP DISCLAIMS ALL WARRANTIES, EXPRESS OR IMPLIED, INCLUDING THE IMPLIED WARRANTIES OF
          MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT, AND ANY WARRANTIES ARISING FROM COURSE OF
          DEALING OR USAGE OF TRADE. LEADTRAP DOES NOT WARRANT THAT THE SERVICES WILL BE UNINTERRUPTED, ERROR-FREE, OR
          FREE FROM HARMFUL COMPONENTS, OR THAT ANY CONTENT GENERATED BY AI FEATURES WILL BE ACCURATE, COMPLETE, OR FIT
          FOR ANY PARTICULAR PURPOSE.
        </P>
        <P>
          <B>AI-Generated Output.</B> Customer acknowledges that the Services include artificial intelligence and machine
          learning features that generate output based on inputs and probabilistic models. Such output may contain
          errors, omissions, or inaccuracies. Customer is responsible for reviewing AI-generated output before relying on
          it and for ensuring that any clinical, financial, or operational decisions are made by qualified human
          personnel. The Services are not a substitute for professional medical, legal, or financial advice.
        </P>

        <H2>11. Limitation of Liability</H2>
        <P>
          TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER FOR ANY
          INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY, OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF PROFITS,
          REVENUES, DATA, OR BUSINESS OPPORTUNITIES, ARISING OUT OF OR RELATED TO THE AGREEMENT, REGARDLESS OF THE FORM OF
          ACTION OR THEORY OF LIABILITY, AND WHETHER OR NOT SUCH PARTY HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH
          DAMAGES.
        </P>
        <P>
          EACH PARTY&rsquo;S TOTAL AGGREGATE LIABILITY UNDER THE AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE
          BY CUSTOMER TO LEADTRAP DURING THE TWELVE (12) MONTH PERIOD IMMEDIATELY PRECEDING THE EVENT GIVING RISE TO THE
          CLAIM.
        </P>
        <P>
          The foregoing limitations shall not apply to: (a) Customer&rsquo;s payment obligations; (b) either party&rsquo;s
          indemnification obligations; (c) either party&rsquo;s breach of its confidentiality obligations; or (d)
          liability that cannot be limited under applicable law.
        </P>

        <H2>12. Indemnification</H2>
        <P>
          <B>By LeadTrap.</B> LeadTrap shall defend Customer against any third-party claim alleging that the Services,
          when used in accordance with the Agreement, infringe such third party&rsquo;s intellectual property rights, and
          shall indemnify Customer for amounts finally awarded by a court of competent jurisdiction or paid in settlement
          of such claim. The foregoing obligation does not apply to claims arising from: (i) Customer Data; (ii)
          modifications to the Services not made by LeadTrap; (iii) use of the Services in combination with materials not
          provided by LeadTrap; or (iv) use of the Services in violation of the Agreement.
        </P>
        <P>
          <B>By Customer.</B> Customer shall defend LeadTrap against any third-party claim arising from or relating to:
          (i) Customer Data; (ii) Customer&rsquo;s use of the Services in violation of the Agreement or applicable law;
          or (iii) Customer&rsquo;s breach of its representations or warranties under the Agreement, and shall indemnify
          LeadTrap for amounts finally awarded or paid in settlement of such claim.
        </P>
        <P>
          <B>Procedure.</B> The indemnified party shall: (a) promptly notify the indemnifying party of the claim; (b)
          grant the indemnifying party sole control over the defense and settlement of the claim (provided that no
          settlement that imposes liability or admission of fault on the indemnified party shall be entered without its
          prior written consent); and (c) provide reasonable cooperation in the defense at the indemnifying party&rsquo;s
          expense.
        </P>

        <H2>13. Third-Party Services and Integrations</H2>
        <P>
          The Services may integrate with or rely upon third-party products, services, or platforms (&ldquo;Third-Party
          Services&rdquo;). LeadTrap is not responsible for the availability, accuracy, or operation of any Third-Party
          Services, and Customer&rsquo;s use of any Third-Party Services is governed by the terms and policies of the
          applicable third-party provider. Customer is responsible for obtaining and maintaining any subscriptions,
          licenses, or accounts required to use Third-Party Services in connection with the Services.
        </P>

        <H2>14. Modifications to the Terms</H2>
        <P>
          LeadTrap may update these Terms from time to time by posting an updated version at this URL or otherwise
          notifying Customer. Material changes will be communicated to Customer at the email address on file or through
          the Services at least thirty (30) days before they take effect. Customer&rsquo;s continued use of the Services
          after the effective date of any updated Terms constitutes acceptance of those updated Terms. If Customer does
          not agree to the updated Terms, Customer may terminate the Agreement in accordance with the
          termination-for-convenience provision of the applicable Order Form.
        </P>

        <H2>15. Governing Law and Disputes</H2>
        <P>
          The Agreement shall be governed by and construed in accordance with the laws of the State of Delaware, without
          regard to its conflict of laws principles. Any disputes arising under or related to the Agreement shall be
          resolved exclusively in the state or federal courts located in the State of Delaware, and each party consents
          to the personal jurisdiction of such courts and waives any objection based on forum non conveniens. The parties
          waive any right to a jury trial in any such proceeding.
        </P>

        <H2>16. General Provisions</H2>
        <P>
          <B>Entire Agreement.</B> The Agreement constitutes the entire understanding between the parties with respect to
          its subject matter and supersedes all prior or contemporaneous agreements, representations, and communications.
        </P>
        <P>
          <B>Amendments.</B> Except as expressly permitted in Section 14, no modification of the Agreement shall be
          effective unless in writing and signed by both parties.
        </P>
        <P>
          <B>Assignment.</B> Neither party may assign the Agreement without the prior written consent of the other party,
          except in connection with a merger, acquisition, reorganization, or sale of all or substantially all of its
          assets. Any purported assignment in violation of this section is void.
        </P>
        <P>
          <B>Force Majeure.</B> Neither party shall be liable for any delay or failure to perform (other than payment
          obligations) due to causes beyond its reasonable control, including acts of God, natural disasters, war,
          terrorism, civil unrest, labor disputes, internet or telecommunications failures, or governmental action.
        </P>
        <P>
          <B>Independent Contractors.</B> The parties are independent contractors. Nothing in the Agreement shall be
          construed as creating any agency, partnership, joint venture, or employment relationship.
        </P>
        <P>
          <B>Notices.</B> All notices under the Agreement shall be in writing and sent to the email addresses set forth
          in the applicable Order Form, or to such other address as a party may designate in writing.
        </P>
        <P>
          <B>Severability.</B> If any provision of the Agreement is held invalid or unenforceable, the remaining
          provisions shall continue in full force and effect, and the invalid provision shall be reformed to the minimum
          extent necessary to make it enforceable while preserving the parties&rsquo; original intent.
        </P>
        <P>
          <B>Waiver.</B> No failure or delay by either party in exercising any right under the Agreement shall constitute
          a waiver of that right.
        </P>
        <P>
          <B>Publicity.</B> LeadTrap may identify Customer by name and logo as a customer of LeadTrap on its website and
          in marketing materials, subject to any reasonable usage guidelines provided by Customer. Customer may revoke
          such permission upon written notice.
        </P>

        <H2>17. Contact</H2>
        <P>
          Questions about these Terms may be directed to LeadTrap, Inc. at the contact information provided in the
          applicable Order Form.
        </P>
      </main>

      <footer style={{ borderTop: '1px solid rgba(43,42,38,0.08)', padding: '28px 0' }}>
        <div style={{
          maxWidth: 760, margin: '0 auto', padding: '0 clamp(20px, 5vw, 40px)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12,
        }}>
          <a href="/carelu" style={{ textDecoration: 'none' }}>
            <img src="/carelu-logo.svg" alt="Carelu" style={{ height: 22, width: 'auto', display: 'block', opacity: 0.85 }} />
          </a>
          <span style={{ fontSize: 12.5, color: 'rgba(43,42,38,0.5)' }}>
            © {new Date().getFullYear()} LeadTrap, Inc. dba Carelu
          </span>
        </div>
      </footer>
    </div>
  );
}
