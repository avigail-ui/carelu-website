import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
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
import Company from './pages/Company'
import CareluCompany from './pages/CareluCompany'
// --- V2 sandbox (radically different direction; fully isolated from the originals above) ---
import GatewayV2 from './pages/GatewayV2'
import LandingV2 from './pages/LandingV2'
import CompanyV2 from './pages/CompanyV2'

// On carelu.com the root IS the Carelu landing page; the Gateway chooser only
// renders elsewhere (local dev, previews, and eventually leadtrap.com).
const isCareluDomain = /(^|\.)carelu\.com$/i.test(window.location.hostname);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
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
        <Route path="/brand" element={<BrandProposal />} />
        {/* --- V2 sandbox routes --- */}
        <Route path="/v2" element={<GatewayV2 />} />
        <Route path="/v2/carelu" element={<LandingV2 />} />
        <Route path="/v2/company" element={<CompanyV2 />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
