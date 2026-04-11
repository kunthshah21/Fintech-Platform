import { Outlet } from 'react-router-dom';
import StaffSidebar from '../components/staff/StaffSidebar';
import StaffHeader from '../components/staff/StaffHeader';

export default function StaffLayout() {
  return (
    <div className="min-h-screen bg-bg-alt">
      <StaffSidebar />
      <div className="lg:pl-56 flex flex-col min-h-screen">
        <StaffHeader />
        <main className="flex-1 p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
