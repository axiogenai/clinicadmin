import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '', title: '', degree: '', experience: '', specialties: '', image: ''
  });

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/doctors`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setDoctors(data);
      }
    } catch (error) {
      console.error('Failed to fetch doctors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (doctor = null) => {
    if (doctor) {
      setEditingDoctor(doctor);
      setFormData({
        name: doctor.name,
        title: doctor.title,
        degree: doctor.degree,
        experience: doctor.experience,
        specialties: Array.isArray(doctor.specialties) ? doctor.specialties.join(', ') : doctor.specialties,
        image: doctor.image || ''
      });
    } else {
      setEditingDoctor(null);
      setFormData({ name: '', title: '', degree: '', experience: '', specialties: '', image: '' });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this doctor profile?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/doctors/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchDoctors();
    } catch (error) {
      console.error('Failed to delete doctor:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingDoctor ? 'PUT' : 'POST';
      const url = editingDoctor 
        ? `http://localhost:3001/api/doctors/${editingDoctor.id || editingDoctor._id}`
        : `${API_BASE_URL}/api/doctors`;

      const payload = {
        ...formData,
        specialties: formData.specialties.split(',').map(s => s.trim()).filter(Boolean)
      };

      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsModalOpen(false);
        fetchDoctors();
      }
    } catch (error) {
      console.error('Failed to save doctor:', error);
    }
  };

  if (loading) return <div className="text-[#7c766d]">Loading doctors...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1a1c1a] mb-1">Medical Team</h1>
          <p className="text-[#7c766d] text-sm">Manage doctor profiles and specialists</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#775a19] hover:bg-[#775a19]-dark text-[#0f0f0f] rounded-lg font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Doctor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {doctors.length === 0 ? (
          <div className="text-[#7c766d] py-8 text-center col-span-full">No doctors found. Add one to get started.</div>
        ) : doctors.map((doc) => (
          <div key={doc.id || doc._id} className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl overflow-hidden hover:border-white/60 transition-colors flex flex-col">
            <div className="aspect-[4/5] bg-white/50 relative">
              {doc.image ? (
                <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-600">
                  <span className="material-symbols-outlined text-6xl">person</span>
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-lg font-serif text-[#1a1c1a] font-medium">{doc.name}</h3>
              <p className="text-[#775a19] text-sm font-medium mb-1">{doc.title}</p>
              <p className="text-xs text-[#7c766d] mb-3">{doc.degree} • {doc.experience}</p>
              
              <div className="mt-auto pt-4 border-t border-white/80 shadow-lg shadow-black/5 flex items-center justify-between">
                <button onClick={() => handleOpenModal(doc)} className="text-sm text-[#7c766d] hover:text-[#1a1c1a] transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">edit</span> Edit
                </button>
                <button onClick={() => handleDelete(doc.id || doc._id)} className="text-sm text-[#7c766d] hover:text-red-400 transition-colors flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">delete</span> Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl w-full max-w-lg overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/80 shadow-lg shadow-black/5">
              <h2 className="text-xl font-serif text-[#1a1c1a]">
                {editingDoctor ? 'Edit Doctor Profile' : 'Add New Doctor'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#7c766d] hover:text-[#1a1c1a]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="doctor-form" onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#4b463e] mb-1">Full Name</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                    className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">Title/Designation</label>
                    <input required type="text" placeholder="e.g. Chief Dermatologist" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">Degree</label>
                    <input required type="text" placeholder="e.g. MD, DNB" value={formData.degree} onChange={e => setFormData({...formData, degree: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4b463e] mb-1">Experience</label>
                  <input required type="text" placeholder="e.g. 15+ Years" value={formData.experience} onChange={e => setFormData({...formData, experience: e.target.value})}
                    className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4b463e] mb-1">Specialties (comma separated)</label>
                  <input required type="text" placeholder="Laser Surgery, Clinical Dermatology" value={formData.specialties} onChange={e => setFormData({...formData, specialties: e.target.value})}
                    className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4b463e] mb-1">Profile Image URL</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})}
                    className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                </div>
              </form>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-white/80 shadow-lg shadow-black/5 bg-white/70 backdrop-blur-md">
              <button type="button" onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#4b463e] hover:text-[#1a1c1a] transition-colors">
                Cancel
              </button>
              <button type="submit" form="doctor-form"
                className="px-4 py-2 text-sm font-medium bg-[#775a19] hover:bg-[#775a19]-dark text-[#0f0f0f] rounded-lg transition-colors">
                {editingDoctor ? 'Save Changes' : 'Add Doctor'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
