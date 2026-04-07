import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell, Wallet, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function DashboardHeader() {
  const { user, walletBalance, notifications, unreadCount, markNotificationRead, markAllNotificationsRead } = useApp();
  const [showNotifications, setShowNotifications] = useState(false);
  const panelRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    function handleClick(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <header className="h-16 border-b border-border bg-white flex items-center justify-between px-4 sm:px-6 lg:px-8">
      <h2 className="text-sm font-medium text-text-secondary">
        {greeting}, <span className="text-text-primary">{user.name}</span>
      </h2>

      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate('/dashboard/transactions')}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-bg-alt border border-border text-sm font-medium text-text-primary hover:bg-accent-soft transition-colors"
        >
          <Wallet className="h-4 w-4 text-text-secondary" />
          ₹{walletBalance.toLocaleString('en-IN')}
        </button>

        <div className="relative" ref={panelRef}>
          <button
            onClick={() => setShowNotifications((v) => !v)}
            className="relative p-2 rounded-lg hover:bg-bg-alt transition-colors"
          >
            <Bell className="h-5 w-5 text-text-secondary" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red text-[10px] font-semibold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-12 w-80 sm:w-96 bg-white border border-border rounded-xl shadow-lg z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-text-primary">Notifications</span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs font-medium text-text-muted hover:text-text-secondary transition-colors"
                  >
                    Mark all as read
                  </button>
                )}
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-border-light">
                {notifications.map((n) => (
                  <button
                    key={n.id}
                    onClick={() => markNotificationRead(n.id)}
                    className={`w-full text-left px-4 py-3 hover:bg-bg-alt transition-colors ${!n.read ? 'bg-blue-soft/30' : ''}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                        n.read ? 'bg-bg-alt' : 'bg-accent-soft'
                      }`}>
                        {n.read ? (
                          <Check className="h-3 w-3 text-text-muted" />
                        ) : (
                          <div className="h-2 w-2 rounded-full bg-accent" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-text-primary">{n.title}</p>
                        <p className="text-xs text-text-secondary mt-0.5 line-clamp-2">{n.message}</p>
                        <p className="text-xs text-text-muted mt-1">{n.time}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
