import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingCallbacks: 0,
    totalTreatments: 0,
    monthlyRevenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };
      
      const statsRes = await fetch(`${API_BASE_URL}/api/stats`, { headers });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      const bookingsRes = await fetch(`${API_BASE_URL}/api/bookings`, { headers });
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json();
        setRecentBookings(bookingsData.slice(0, 10)); // Just the 10 most recent
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    { label: 'Total Bookings', value: stats.totalBookings, icon: 'calendar_month', color: 'text-blue-600', bg: 'bg-blue-600/10' },
    { label: 'Pending Callbacks', value: stats.pendingCallbacks, icon: 'call_missed', color: 'text-orange-600', bg: 'bg-orange-600/10' },
    { label: 'Active Treatments', value: stats.totalTreatments, icon: 'spa', color: 'text-green-600', bg: 'bg-green-600/10' },
    { label: 'Monthly Revenue', value: `₹${stats.monthlyRevenue.toLocaleString()}`, icon: 'payments', color: 'text-[#775a19]', bg: 'bg-[#775a19]/10' },
  ];

  if (loading) return <div className="text-[#7c766d]">Loading dashboard...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-serif text-[#1a1c1a] mb-1">Dashboard Overview</h1>
        <p className="text-[#7c766d] text-sm">Welcome back to Shivsai 360 Admin</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <div key={idx} className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[#7c766d]">{stat.label}</p>
              <p className="text-2xl font-bold text-[#1a1c1a] mt-2">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <span className={`material-symbols-outlined ${stat.color}`}>{stat.icon}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Bookings */}
        <div className="lg:col-span-2 bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-white/80 shadow-lg shadow-black/5">
            <h2 className="text-lg font-medium text-[#1a1c1a]">Recent Bookings</h2>
            <button 
              onClick={() => navigate('/bookings')}
              className="text-sm text-[#775a19] hover:text-[#5d4201] transition-colors"
            >
              View all
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#f4f3f1]/80 text-left text-xs uppercase tracking-wider text-[#7c766d]">
                  <th className="px-6 py-3 font-medium">Patient</th>
                  <th className="px-6 py-3 font-medium">Interest</th>
                  <th className="px-6 py-3 font-medium">Date</th>
                  <th className="px-6 py-3 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#cdc6ba]/20">
                {recentBookings.length > 0 ? recentBookings.map((booking) => (
                  <tr key={booking.id || booking._id} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-[#1a1c1a]">{booking.name}</div>
                      <div className="text-xs text-[#7c766d]">{booking.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4b463e]">
                      {booking.interest || 'General Consultation'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-[#4b463e]">
                      {booking.date ? new Date(booking.date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${booking.status === 'Confirmed' ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 
                          booking.status === 'Pending' ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20' : 
                          'bg-gray-600/10 text-[#7c766d] border border-gray-600/20'}`}>
                        {booking.status || 'Pending'}
                      </span>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="px-6 py-8 text-center text-[#7c766d]">
                      No recent bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions / Alerts */}
        <div className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl p-6">
          <h2 className="text-lg font-medium text-[#1a1c1a] mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button 
              onClick={() => navigate('/treatments')}
              className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/50 hover:bg-white/60 border border-white/60 transition-colors text-left"
            >
              <div className="p-2 bg-[#775a19]/10 rounded-lg text-[#775a19]">
                <span className="material-symbols-outlined text-sm">add</span>
              </div>
              <div>
                <div className="text-sm font-medium text-[#1a1c1a]">Add Treatment</div>
                <div className="text-xs text-[#7c766d]">Create new service offering</div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/case-studies')}
              className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/50 hover:bg-white/60 border border-white/60 transition-colors text-left"
            >
              <div className="p-2 bg-blue-500/10 rounded-lg text-blue-600">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
              </div>
              <div>
                <div className="text-sm font-medium text-[#1a1c1a]">Upload Case Study</div>
                <div className="text-xs text-[#7c766d]">Add before/after photos</div>
              </div>
            </button>
            <button 
              onClick={() => navigate('/callbacks')}
              className="w-full flex items-center gap-3 p-4 rounded-lg bg-white/50 hover:bg-white/60 border border-white/60 transition-colors text-left"
            >
              <div className="p-2 bg-orange-500/10 rounded-lg text-orange-600">
                <span className="material-symbols-outlined text-sm">phone_callback</span>
              </div>
              <div>
                <div className="text-sm font-medium text-[#1a1c1a]">View Callbacks</div>
                <div className="text-xs text-[#7c766d]">{stats.pendingCallbacks} pending requests</div>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
