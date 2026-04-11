import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { StaffProvider, useStaff } from './context/StaffContext';
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
import StaffLogin from './pages/staff/StaffLogin';
import StaffLayout from './layouts/StaffLayout';
import StaffDashboard from './pages/staff/StaffDashboard';
import Clients from './pages/staff/Clients';
import ClientDetail from './pages/staff/ClientDetail';
import StaffTickets from './pages/staff/Tickets';
import CommunityModeration from './pages/staff/CommunityModeration';

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

function StaffRoute({ children }) {
  const { isStaff, loading } = useStaff();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg-alt">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-accent" />
      </div>
    );
  }
  if (!isStaff) return <Navigate to="/staff/login" replace />;
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
      <Route path="/staff/login" element={<StaffLogin />} />
      <Route path="/staff" element={<StaffRoute><StaffLayout /></StaffRoute>}>
        <Route index element={<StaffDashboard />} />
        <Route path="clients" element={<Clients />} />
        <Route path="clients/:id" element={<ClientDetail />} />
        <Route path="tickets" element={<StaffTickets />} />
        <Route path="community" element={<CommunityModeration />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <AppProvider>
      <StaffProvider>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </StaffProvider>
    </AppProvider>
  );
}
