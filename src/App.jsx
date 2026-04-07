import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import Landing from './pages/Landing';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Marketplace from './pages/Marketplace';
import OpportunityDetail from './pages/OpportunityDetail';
import Portfolio from './pages/Portfolio';
import Transactions from './pages/Transactions';
import KYC from './pages/KYC';
import Profile from './pages/Profile';
import Support from './pages/Support';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="opportunity/:id" element={<OpportunityDetail />} />
            <Route path="portfolio" element={<Portfolio />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="kyc" element={<KYC />} />
            <Route path="profile" element={<Profile />} />
            <Route path="support" element={<Support />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
