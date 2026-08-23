import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import './index.css'
import Landing from './pages/Landing'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Verify from './pages/Verify'
import Demo from './pages/Demo'
import SegmentPage from './pages/SegmentPage'
import BrandProposal from './pages/BrandProposal'
import Gateway from './pages/Gateway'
import SolutionsPage from './pages/SolutionsPage'
import TermsPage from './pages/TermsPage'
import PrivacyPolicy from './pages/PrivacyPolicy'
import { PartnerPrivacy, PartnerTerms } from './pages/PartnerPolicy'
import CookiePolicy from './pages/CookiePolicy'
import LeadTrapPrivacy from './pages/LeadTrapPrivacy'
import LeadTrapTerms from './pages/LeadTrapTerms'
import Company from './pages/Company'
import CareluCompany from './pages/CareluCompany'
import CookieConsent from './components/CookieConsent'
import ResourcePage from './pages/ResourcePage'
import ReferralContactsPage from './pages/ReferralContactsPage'
import ReferralContactsStatePage from './pages/ReferralContactsStatePage'
import IntakeGapReport from './pages/IntakeGapReport'
import RoiCalculator from './pages/RoiCalculator'
import PayerPage from './pages/PayerPage'
import IntegrationPage from './pages/IntegrationPage'
import PayersDirectory from './pages/PayersDirectory'
import IntegrationsDirectory from './pages/IntegrationsDirectory'
import CrmComparison from './pages/CrmComparison'
import CrmVsPage from './pages/CrmVsPage'
import ZapierMakeRisk from './pages/ZapierMakeRisk'
import FrontOfficeRisks from './pages/FrontOfficeRisks'
import SourcesApp from './pages/SourcesApp'
import News from './pages/News'
import { CRM_SLUGS } from './data/crms'
// --- V2 sandbox (radically different direction; fully isolated from the originals above) ---
import GatewayV2 from './pages/GatewayV2'
import LandingV2 from './pages/LandingV2'
import CompanyV2 from './pages/CompanyV2'

// On carelu.com the root IS the Carelu landing page; the Gateway chooser only
// renders elsewhere (local dev, previews, and eventually leadtrap.com).
const isCareluDomain = /(^|\.)carelu\.com$/i.test(window.location.hostname);

// Client-side navigations keep the scroll position by default — reset to top on
// route change (hash links scroll themselves via the target page's mount effect).
function CompareRedirect() {
  const { pathname } = useLocation();
  return <Navigate to={pathname.replace('/compare/', '/integrations/')} replace />;
}

function ScrollReset() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ScrollReset />
      <Routes>
        <Route path="/" element={isCareluDomain ? <Landing /> : <Gateway />} />
        <Route path="/carelu" element={<Landing />} />
        <Route path="/carelu/company" element={<CareluCompany />} />
        <Route path="/company" element={<Company />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/for/:slug" element={<SegmentPage />} />
        <Route path="/solutions/:slug" element={<SolutionsPage />} />
        {/* Static resource pages must precede the :slug catch-all (static wins in v6 ranking anyway) */}
        <Route path="/resources/pediatrician-referral-contacts" element={<ReferralContactsPage />} />
        <Route path="/resources/pediatrician-referral-contacts/:state" element={<ReferralContactsStatePage />} />
        <Route path="/resources/:slug" element={<ResourcePage />} />
        <Route path="/research/the-intake-gap" element={<IntakeGapReport />} />
        <Route path="/tools/intake-leak-calculator" element={<RoiCalculator />} />
        <Route path="/payers" element={<PayersDirectory />} />
        <Route path="/payers/:slug" element={<PayerPage />} />
        <Route path="/integrations" element={<IntegrationsDirectory />} />
        <Route path="/integrations/:slug" element={<IntegrationPage />} />
        <Route path="/carelu-vs-crm" element={<CrmComparison />} />
        <Route path="/news" element={<News />} />
        <Route path="/zapier-make-hipaa-risk" element={<ZapierMakeRisk />} />
        <Route path="/aba-front-office-risks" element={<FrontOfficeRisks />} />
        {/* Standalone document-upload app (no marketing nav, noindex, not in sitemap) */}
        <Route path="/sources" element={<SourcesApp />} />
        {CRM_SLUGS.map((slug) => (
          <Route key={slug} path={`/carelu-vs-${slug}`} element={<CrmVsPage />} />
        ))}
        {/* legacy /compare URLs 301 into integrations */}
        <Route path="/compare/:slug" element={<CompareRedirect />} />
        {/* Per-company default policy pages the intake platform links to (no nav, noindex) */}
        <Route path="/privacy/:company" element={<PartnerPrivacy />} />
        <Route path="/terms/:company" element={<PartnerTerms />} />
        <Route path="/terms" element={isCareluDomain ? <TermsPage /> : <LeadTrapTerms />} />
        <Route path="/privacy" element={isCareluDomain ? <PrivacyPolicy /> : <LeadTrapPrivacy />} />
        <Route path="/cookies" element={<CookiePolicy />} />
        <Route path="/brand" element={<BrandProposal />} />
        {/* --- V2 sandbox routes --- */}
        <Route path="/v2" element={<GatewayV2 />} />
        <Route path="/v2/carelu" element={<LandingV2 />} />
        <Route path="/v2/company" element={<CompanyV2 />} />
      </Routes>
      {isCareluDomain && <CookieConsent />}
    </BrowserRouter>
  </StrictMode>,
)
