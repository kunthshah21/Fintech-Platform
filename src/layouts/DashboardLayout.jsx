import { Outlet } from 'react-router-dom';
import Sidebar from '../components/dashboard/Sidebar';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import MobileTabBar from '../components/dashboard/MobileTabBar';
import WelcomeTour from '../components/dashboard/WelcomeTour';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-bg-alt">
      <Sidebar />
      <div className="lg:pl-60 flex flex-col min-h-screen">
        <DashboardHeader />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8">
          <Outlet />
        </main>
      </div>
      <MobileTabBar />
      <WelcomeTour />
    </div>
  );
}
