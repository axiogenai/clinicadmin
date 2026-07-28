import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';

export default function CallbacksPage() {
  const [callbacks, setCallbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');

  useEffect(() => {
    fetchCallbacks();
  }, []);

  const fetchCallbacks = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/callbacks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Sort by timestamp descending
        data.sort((a, b) => new Date(b.createdAt || Date.now()) - new Date(a.createdAt || Date.now()));
        setCallbacks(data);
      }
    } catch (error) {
      console.error('Failed to fetch callbacks:', error);
    } finally {
      setLoading(false);
    }
  };

  const resolveCallback = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/callbacks/${id}/resolve`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCallbacks();
    } catch (error) {
      console.error('Failed to resolve callback:', error);
    }
  };

  const getTimeElapsed = (timestamp) => {
    if (!timestamp) return 'Unknown';
    const seconds = Math.floor((new Date() - new Date(timestamp)) / 1000);
    
    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';
    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';
    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';
    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';
    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';
    return Math.floor(seconds) + ' seconds ago';
  };

  const filteredCallbacks = callbacks.filter(c => 
    filter === 'Pending' ? c.status !== 'Resolved' : c.status === 'Resolved'
  );

  if (loading) return <div className="text-[#7c766d]">Loading callbacks...</div>;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1a1c1a] mb-1">Callback Queue</h1>
          <p className="text-[#7c766d] text-sm">Manage urgent patient callback requests</p>
        </div>
        
        <div className="flex bg-white/70 backdrop-blur-md p-1 rounded-lg border border-white/80 shadow-lg shadow-black/5">
          <button
            onClick={() => setFilter('Pending')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'Pending' ? 'bg-[#775a19]/20 text-[#775a19]' : 'text-[#7c766d] hover:text-[#1a1c1a]'
            }`}
          >
            Pending
          </button>
          <button
            onClick={() => setFilter('Resolved')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              filter === 'Resolved' ? 'bg-gray-700 text-[#1a1c1a]' : 'text-[#7c766d] hover:text-[#1a1c1a]'
            }`}
          >
            Resolved
          </button>
        </div>
      </div>

      <div className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl overflow-hidden">
        {filteredCallbacks.length > 0 ? (
          <ul className="divide-y divide-[#cdc6ba]/20">
            {filteredCallbacks.map((cb) => (
              <li key={cb.id || cb._id} className="p-6 hover:bg-white/50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-full mt-1 ${cb.status === 'Resolved' ? 'bg-green-500/10 text-green-600' : 'bg-orange-500/10 text-orange-600'}`}>
                    <span className="material-symbols-outlined">{cb.status === 'Resolved' ? 'check_circle' : 'phone_in_talk'}</span>
                  </div>
                  <div>
                    <div className="text-lg font-medium text-[#1a1c1a] mb-1">{cb.phone}</div>
                    <div className="flex items-center gap-3 text-sm text-[#7c766d]">
                      <span className="flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">schedule</span>
                        {getTimeElapsed(cb.createdAt || cb.timestamp)}
                      </span>
                      {cb.name && <span>• {cb.name}</span>}
                    </div>
                  </div>
                </div>
                
                {cb.status !== 'Resolved' && (
                  <button 
                    onClick={() => resolveCallback(cb.id || cb._id)}
                    className="self-start sm:self-center px-4 py-2 bg-[#775a19]/10 hover:bg-[#775a19]/20 text-[#775a19] border border-[#775a19]/20 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    Mark Resolved
                  </button>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-12 text-center">
            <span className="material-symbols-outlined text-4xl text-gray-600 mb-3">done_all</span>
            <p className="text-[#7c766d]">No {filter.toLowerCase()} callback requests.</p>
          </div>
        )}
      </div>
    </div>
  );
}
