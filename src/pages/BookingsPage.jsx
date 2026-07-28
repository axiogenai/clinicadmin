import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';

export default function BookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    // Optimistic UI update for instant feedback
    setBookings(prev => prev.map(b => (b.id === id || b._id === id) ? { ...b, status: newStatus } : b))

    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      if (!res.ok) {
        fetchBookings(); // Rollback if server error
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      fetchBookings();
    }
  };

  const filteredBookings = bookings.filter(b => {
    const bStatus = (b.status || 'pending').toLowerCase();
    const fStatus = filter.toLowerCase();
    const matchesFilter = filter === 'All' || bStatus === fStatus;
    const matchesSearch = b.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.phone?.includes(searchQuery) ||
                          b.email?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    const st = (status || 'pending').toLowerCase();
    switch (st) {
      case 'confirmed': return 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30';
      case 'pending': return 'bg-amber-500/15 text-amber-800 border-amber-500/30';
      case 'completed': return 'bg-blue-500/10 text-blue-700 border-blue-500/30';
      case 'cancelled': return 'bg-rose-500/10 text-rose-600 border-rose-500/30';
      default: return 'bg-neutral-500/10 text-neutral-600 border-neutral-500/20';
    }
  };

  if (loading) return <div className="text-[#7c766d] py-8 text-center font-medium">Loading bookings...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1a1c1a] mb-1">Appointment Bookings</h1>
          <p className="text-[#7c766d] text-sm">Manage patient consultation requests</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-white/70 backdrop-blur-md p-4 rounded-xl border border-white/80 shadow-lg shadow-black/5">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {['All', 'Pending', 'Confirmed', 'Completed', 'Cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-[#775a19]/10 text-[#775a19] border border-[#775a19]/20 font-semibold' 
                  : 'text-[#7c766d] hover:text-[#1a1c1a] border border-transparent hover:bg-white/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[#7c766d] text-sm">search</span>
          <input
            type="text"
            placeholder="Search name, phone, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#f4f3f1]/80 border border-white/60 rounded-lg text-sm text-[#1a1c1a] focus:outline-none focus:border-[#775a19] w-full sm:w-64"
          />
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#f4f3f1]/80 text-left text-xs uppercase tracking-wider text-[#7c766d]">
                <th className="px-6 py-4 font-medium">Patient Details</th>
                <th className="px-6 py-4 font-medium">Interest / Doctor</th>
                <th className="px-6 py-4 font-medium">Schedule</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#cdc6ba]/20">
              {filteredBookings.length > 0 ? filteredBookings.map((b) => {
                const bStatus = (b.status || 'pending').toLowerCase();
                const displayStatus = bStatus.charAt(0).toUpperCase() + bStatus.slice(1);
                const bId = b.id || b._id;

                return (
                  <tr key={bId} className="hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-[#1a1c1a]">{b.name}</div>
                      <div className="text-xs text-[#7c766d] mt-1">{b.phone}</div>
                      <div className="text-xs text-[#7c766d]">{b.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#4b463e]">{b.interest || 'General Consultation'}</div>
                      {b.doctor && <div className="text-xs text-[#775a19] mt-1 font-medium">{b.doctor}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-[#4b463e]">
                        {b.date ? new Date(b.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : 'Pending Scheduling'}
                      </div>
                      {b.time && <div className="text-xs text-[#7c766d] mt-1">{b.time}</div>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full border ${getStatusColor(bStatus)}`}>
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        {(bStatus === 'pending' || bStatus === 'pending scheduling') && (
                          <>
                            <button
                              onClick={() => updateStatus(bId, 'confirmed')}
                              className="px-3 py-1.5 bg-emerald-600/10 text-emerald-700 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-sm border border-emerald-600/20"
                            >
                              ✓ Confirm
                            </button>
                            <button
                              onClick={() => updateStatus(bId, 'cancelled')}
                              className="px-3 py-1.5 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-sm border border-rose-500/20"
                            >
                              ✕ Cancel
                            </button>
                          </>
                        )}

                        {bStatus === 'confirmed' && (
                          <>
                            <button
                              onClick={() => updateStatus(bId, 'completed')}
                              className="px-3 py-1.5 bg-blue-600/10 text-blue-700 hover:bg-blue-600 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-sm border border-blue-600/20"
                            >
                              ✓ Mark Complete
                            </button>
                            <button
                              onClick={() => updateStatus(bId, 'cancelled')}
                              className="px-3 py-1.5 bg-rose-500/10 text-rose-600 hover:bg-rose-600 hover:text-white rounded-lg text-xs font-semibold transition-all shadow-sm border border-rose-500/20"
                            >
                              ✕ Cancel
                            </button>
                          </>
                        )}

                        {(bStatus === 'completed' || bStatus === 'cancelled') && (
                          <button
                            onClick={() => updateStatus(bId, 'pending')}
                            className="px-3 py-1.5 bg-gray-500/10 text-gray-700 hover:bg-gray-700 hover:text-white rounded-lg text-xs font-semibold transition-all border border-gray-500/20"
                          >
                            ↺ Re-open
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#7c766d]">
                    No bookings found matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card List View */}
      <div className="md:hidden space-y-4">
        {filteredBookings.length > 0 ? (
          filteredBookings.map((b) => {
            const bStatus = (b.status || 'pending').toLowerCase();
            const displayStatus = bStatus.charAt(0).toUpperCase() + bStatus.slice(1);
            const bId = b.id || b._id;

            return (
              <div key={bId} className="bg-white/80 backdrop-blur-md border border-white/90 shadow-md rounded-2xl p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-[16px] text-[#1a1c1a]">{b.name}</h3>
                    <p className="text-xs text-[#7c766d]">{b.phone} • {b.email}</p>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${getStatusColor(bStatus)}`}>
                    {displayStatus}
                  </span>
                </div>

                <div className="bg-[#faf9f6] border border-[#cdc6ba]/30 rounded-xl p-3 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-[#7c766d]">Interest / Package:</span>
                    <span className="font-medium text-[#1a1c1a]">{b.interest || 'General Consultation'}</span>
                  </div>
                  {b.doctor && (
                    <div className="flex justify-between">
                      <span className="text-[#7c766d]">Doctor Assigned:</span>
                      <span className="font-semibold text-[#775a19]">{b.doctor}</span>
                    </div>
                  )}
                  <div className="flex justify-between pt-1 border-t border-[#cdc6ba]/20">
                    <span className="text-[#7c766d]">Scheduled Date:</span>
                    <span className="font-medium text-[#1a1c1a]">
                      {b.date ? new Date(b.date).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' }) : 'Pending Scheduling'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  {(bStatus === 'pending' || bStatus === 'pending scheduling') && (
                    <>
                      <button
                        onClick={() => updateStatus(bId, 'confirmed')}
                        className="flex-1 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold shadow-sm text-center"
                      >
                        ✓ Confirm
                      </button>
                      <button
                        onClick={() => updateStatus(bId, 'cancelled')}
                        className="flex-1 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold text-center"
                      >
                        ✕ Cancel
                      </button>
                    </>
                  )}

                  {bStatus === 'confirmed' && (
                    <>
                      <button
                        onClick={() => updateStatus(bId, 'completed')}
                        className="flex-1 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold shadow-sm text-center"
                      >
                        ✓ Mark Complete
                      </button>
                      <button
                        onClick={() => updateStatus(bId, 'cancelled')}
                        className="flex-1 py-2 bg-rose-50 text-rose-600 border border-rose-200 rounded-xl text-xs font-semibold text-center"
                      >
                        ✕ Cancel
                      </button>
                    </>
                  )}

                  {(bStatus === 'completed' || bStatus === 'cancelled') && (
                    <button
                      onClick={() => updateStatus(bId, 'pending')}
                      className="w-full py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-xl text-xs font-semibold text-center"
                    >
                      ↺ Re-open Booking
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="bg-white/80 rounded-2xl p-8 text-center text-[#7c766d] text-sm">
            No bookings found.
          </div>
        )}
      </div>
    </div>
  );
}
