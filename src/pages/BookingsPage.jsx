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

  const updateStatus = async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/bookings/${id}/status`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify({ status })
      });
      
      if (res.ok) {
        fetchBookings(); // refresh list
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredBookings = bookings.filter(b => {
    const matchesFilter = filter === 'All' || b.status === filter;
    const matchesSearch = b.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          b.phone?.includes(searchQuery);
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return 'bg-green-500/10 text-green-600 border-green-500/20';
      case 'Pending': return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
      case 'Completed': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'Cancelled': return 'bg-red-500/10 text-red-400 border-red-500/20';
      default: return 'bg-gray-600/10 text-[#7c766d] border-gray-600/20';
    }
  };

  if (loading) return <div className="text-[#7c766d]">Loading bookings...</div>;

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
                  ? 'bg-[#775a19]/10 text-[#775a19] border border-[#775a19]/20' 
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
            placeholder="Search name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 bg-[#f4f3f1]/80 border border-white/60 rounded-lg text-sm text-[#1a1c1a] focus:outline-none focus:border-[#775a19] w-full sm:w-64"
          />
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl overflow-hidden">
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
              {filteredBookings.length > 0 ? filteredBookings.map((b) => (
                <tr key={b.id || b._id} className="hover:bg-white/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-[#1a1c1a]">{b.name}</div>
                    <div className="text-xs text-[#7c766d] mt-1">{b.phone}</div>
                    <div className="text-xs text-[#7c766d]">{b.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#4b463e]">{b.interest || 'General Consultation'}</div>
                    {b.doctor && <div className="text-xs text-[#775a19] mt-1">{b.doctor}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-[#4b463e]">
                      {b.date ? new Date(b.date).toLocaleDateString() : 'Pending Scheduling'}
                    </div>
                    {b.time && <div className="text-xs text-[#7c766d] mt-1">{b.time}</div>}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-medium rounded-full border ${getStatusColor(b.status || 'Pending')}`}>
                      {b.status || 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      {(!b.status || b.status === 'Pending') && (
                        <>
                          <button onClick={() => updateStatus(b.id || b._id, 'Confirmed')} className="px-3 py-1 bg-green-500/10 text-green-600 hover:bg-green-500/20 rounded transition-colors">Confirm</button>
                          <button onClick={() => updateStatus(b.id || b._id, 'Cancelled')} className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded transition-colors">Cancel</button>
                        </>
                      )}
                      {b.status === 'Confirmed' && (
                        <button onClick={() => updateStatus(b.id || b._id, 'Completed')} className="px-3 py-1 bg-blue-500/10 text-blue-600 hover:bg-blue-500/20 rounded transition-colors">Mark Complete</button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
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
    </div>
  );
}
