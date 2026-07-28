import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', label: 'Dashboard', icon: 'dashboard' },
  { path: '/treatments', label: 'Treatments', icon: 'spa' },
  { path: '/doctors', label: 'Doctors', icon: 'stethoscope' },
  { path: '/case-studies', label: 'Case Studies', icon: 'photo_library' },
  { path: '/bookings', label: 'Bookings', icon: 'calendar_month' },
  { path: '/callbacks', label: 'Callbacks', icon: 'call' },
];

export default function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('admin');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-transparent overflow-hidden text-[#1a1c1a]">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/10 backdrop-blur-sm z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed md:static inset-y-0 left-0 z-30
        w-64 bg-white/60 backdrop-blur-xl border-r border-white/60 shadow-sm
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
      `}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-white/60">
          <h1 className="font-serif text-xl font-bold tracking-wider text-[#1a1c1a]">SHIVSAI 360</h1>
          <button 
            className="md:hidden text-[#4b463e] hover:text-[#1a1c1a]"
            onClick={() => setSidebarOpen(false)}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <nav className="p-4 space-y-2 overflow-y-auto h-[calc(100vh-4rem)]">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) => `
                flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 font-sans
                ${isActive 
                  ? 'bg-[#775a19]/10 text-[#775a19] font-semibold' 
                  : 'text-[#4b463e] hover:bg-white/60 hover:text-[#1a1c1a]'
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span className={isActive ? "font-semibold" : "font-medium"}>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 bg-white/60 backdrop-blur-xl border-b border-white/60 shadow-sm">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden text-[#4b463e] hover:text-[#1a1c1a]"
              onClick={() => setSidebarOpen(true)}
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
            <h2 className="text-lg font-serif font-bold hidden sm:block text-[#1a1c1a]">Admin Portal</h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium font-sans text-[#4b463e] hover:text-[#1a1c1a] hover:bg-white/60 rounded-xl transition-colors"
            >
              <span className="material-symbols-outlined text-sm">logout</span>
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 font-sans">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
