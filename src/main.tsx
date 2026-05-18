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

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/demo" element={<Demo />} />
        <Route path="/for/:slug" element={<SegmentPage />} />
        <Route path="/brand" element={<BrandProposal />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
