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
import Company from './pages/Company'
import CareluCompany from './pages/CareluCompany'
import CookieConsent from './components/CookieConsent'
import ResourcePage from './pages/ResourcePage'
import IntakeGapReport from './pages/IntakeGapReport'
import LeakCalculator from './pages/LeakCalculator'
import PayerPage from './pages/PayerPage'
import IntegrationPage from './pages/IntegrationPage'
import PayersDirectory from './pages/PayersDirectory'
import IntegrationsDirectory from './pages/IntegrationsDirectory'
import CrmComparison from './pages/CrmComparison'
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
        <Route path="/resources/:slug" element={<ResourcePage />} />
        <Route path="/research/the-intake-gap" element={<IntakeGapReport />} />
        <Route path="/tools/intake-leak-calculator" element={<LeakCalculator />} />
        <Route path="/payers" element={<PayersDirectory />} />
        <Route path="/payers/:slug" element={<PayerPage />} />
        <Route path="/integrations" element={<IntegrationsDirectory />} />
        <Route path="/integrations/:slug" element={<IntegrationPage />} />
        <Route path="/carelu-vs-crm" element={<CrmComparison />} />
        {/* legacy /compare URLs 301 into integrations */}
        <Route path="/compare/:slug" element={<CompareRedirect />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/brand" element={<BrandProposal />} />
        {/* --- V2 sandbox routes --- */}
        <Route path="/v2" element={<GatewayV2 />} />
        <Route path="/v2/carelu" element={<LandingV2 />} />
        <Route path="/v2/company" element={<CompanyV2 />} />
      </Routes>
      <CookieConsent />
    </BrowserRouter>
  </StrictMode>,
)
