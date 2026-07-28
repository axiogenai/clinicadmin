import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';

export default function TreatmentsPage() {
  const [activeTab, setActiveTab] = useState('skin');
  const [treatments, setTreatments] = useState({ skin: [], hair: [], makeup: [] });
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTreatment, setEditingTreatment] = useState(null);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '', description: '', category: 'skin', duration: '', price: '', image: ''
  });

  useEffect(() => {
    fetchTreatments();
  }, []);

  const fetchTreatments = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/treatments`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setTreatments(data);
      }
    } catch (error) {
      console.error('Failed to fetch treatments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (treatment = null) => {
    if (treatment) {
      setEditingTreatment(treatment);
      setFormData({
        name: treatment.name,
        description: treatment.description,
        category: treatment.category || activeTab,
        duration: treatment.duration,
        price: treatment.price,
        image: treatment.image || ''
      });
    } else {
      setEditingTreatment(null);
      setFormData({
        name: '', description: '', category: activeTab, duration: '', price: '', image: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this treatment?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/treatments/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchTreatments();
    } catch (error) {
      console.error('Failed to delete treatment:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingTreatment ? 'PUT' : 'POST';
      const url = editingTreatment 
        ? `${API_BASE_URL}/api/treatments/${editingTreatment.id || editingTreatment._id}`
        : `${API_BASE_URL}/api/treatments`;

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchTreatments();
      }
    } catch (error) {
      console.error('Failed to save treatment:', error);
    }
  };

  const renderTreatmentsGrid = (categoryTreatments) => {
    if (categoryTreatments.length === 0) {
      return <div className="text-[#7c766d] py-8 text-center col-span-full">No treatments found for this category.</div>;
    }
    return categoryTreatments.map((t) => (
      <div key={t.id || t._id} className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl overflow-hidden hover:border-white/60 transition-colors group">
        <div className="h-48 bg-white/50 relative">
          {t.image ? (
            <img src={t.image} alt={t.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-600">
              <span className="material-symbols-outlined text-4xl">spa</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex gap-2">
            <button onClick={() => handleOpenModal(t)} className="p-2 bg-black/50 hover:bg-black/80 rounded-lg text-[#4b463e] hover:text-[#1a1c1a] backdrop-blur-sm transition-colors">
              <span className="material-symbols-outlined text-sm">edit</span>
            </button>
            <button onClick={() => handleDelete(t.id || t._id)} className="p-2 bg-black/50 hover:bg-black/80 rounded-lg text-[#4b463e] hover:text-red-400 backdrop-blur-sm transition-colors">
              <span className="material-symbols-outlined text-sm">delete</span>
            </button>
          </div>
        </div>
        <div className="p-5">
          <h3 className="text-lg font-serif text-[#1a1c1a] font-medium mb-2">{t.name}</h3>
          <p className="text-sm text-[#7c766d] line-clamp-2 mb-4">{t.description}</p>
          <div className="flex items-center justify-between text-sm">
            <span className="text-[#7c766d] flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">schedule</span> {t.duration}
            </span>
            <span className="text-[#775a19] font-medium">{t.price}</span>
          </div>
        </div>
      </div>
    ));
  };

  if (loading) return <div className="text-[#7c766d]">Loading treatments...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1a1c1a] mb-1">Treatments Management</h1>
          <p className="text-[#7c766d] text-sm">Manage your service offerings across categories</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#775a19] hover:bg-[#775a19]-dark text-[#0f0f0f] rounded-lg font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Treatment
        </button>
      </div>

      <div className="flex border-b border-white/80 shadow-lg shadow-black/5">
        {['skin', 'hair', 'makeup'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium capitalize border-b-2 transition-colors ${
              activeTab === tab 
                ? 'border-[#775a19] text-[#775a19]' 
                : 'border-transparent text-[#7c766d] hover:text-[#1a1c1a]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {renderTreatmentsGrid(treatments[activeTab] || [])}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/80 shadow-lg shadow-black/5">
              <h2 className="text-xl font-serif text-[#1a1c1a]">
                {editingTreatment ? 'Edit Treatment' : 'Add New Treatment'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#7c766d] hover:text-[#1a1c1a]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#4b463e] mb-1">Name</label>
                <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                  className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-[#4b463e] mb-1">Category</label>
                <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]">
                  <option value="skin">Skin</option>
                  <option value="hair">Hair</option>
                  <option value="makeup">Makeup</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4b463e] mb-1">Description</label>
                <textarea required rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19] resize-none" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[#4b463e] mb-1">Duration</label>
                  <input required type="text" placeholder="e.g., 60 mins" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})}
                    className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#4b463e] mb-1">Price</label>
                  <input required type="text" placeholder="e.g., ₹2,500" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                    className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#4b463e] mb-1">Image URL</label>
                <input type="text" placeholder="https://..." value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                  className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/80 shadow-lg shadow-black/5 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-[#4b463e] hover:text-[#1a1c1a] transition-colors">
                  Cancel
                </button>
                <button type="submit"
                  className="px-4 py-2 text-sm font-medium bg-[#775a19] hover:bg-[#775a19]-dark text-[#0f0f0f] rounded-lg transition-colors">
                  {editingTreatment ? 'Save Changes' : 'Create Treatment'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
