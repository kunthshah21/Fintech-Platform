import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import Login from './pages/Login';
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
import Community from './pages/Community';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useApp();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-alt">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-border border-t-accent" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<Onboarding />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="opportunity/:id" element={<OpportunityDetail />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="community" element={<Community />} />
        <Route path="transactions" element={<Transactions />} />
        <Route path="kyc" element={<KYC />} />
        <Route path="profile" element={<Profile />} />
        <Route path="support" element={<Support />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
}
