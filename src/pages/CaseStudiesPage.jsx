import { API_BASE_URL } from '../config';
import React, { useState, useEffect } from 'react';

export default function CaseStudiesPage() {
  const [caseStudies, setCaseStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCase, setEditingCase] = useState(null);
  
  const [formData, setFormData] = useState({
    title: '', subtitle: '', category: 'skin', protocol: '', 
    sessions: '', recovery: '', doctor: '', beforeImage: '', afterImage: ''
  });

  useEffect(() => {
    fetchCaseStudies();
  }, []);

  const fetchCaseStudies = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/case-studies`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCaseStudies(data);
      }
    } catch (error) {
      console.error('Failed to fetch case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (caseStudy = null) => {
    if (caseStudy) {
      setEditingCase(caseStudy);
      setFormData({
        title: caseStudy.title,
        subtitle: caseStudy.subtitle,
        category: caseStudy.category,
        protocol: caseStudy.protocol,
        sessions: caseStudy.sessions,
        recovery: caseStudy.recovery,
        doctor: caseStudy.doctor,
        beforeImage: caseStudy.beforeImage || '',
        afterImage: caseStudy.afterImage || ''
      });
    } else {
      setEditingCase(null);
      setFormData({
        title: '', subtitle: '', category: 'skin', protocol: '', 
        sessions: '', recovery: '', doctor: '', beforeImage: '', afterImage: ''
      });
    }
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this case study?')) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:3001/api/case-studies/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) fetchCaseStudies();
    } catch (error) {
      console.error('Failed to delete case study:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const method = editingCase ? 'PUT' : 'POST';
      const url = editingCase 
        ? `http://localhost:3001/api/case-studies/${editingCase.id || editingCase._id}`
        : `${API_BASE_URL}/api/case-studies`;

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
        fetchCaseStudies();
      }
    } catch (error) {
      console.error('Failed to save case study:', error);
    }
  };

  if (loading) return <div className="text-[#7c766d]">Loading case studies...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif text-[#1a1c1a] mb-1">Clinical Outcomes</h1>
          <p className="text-[#7c766d] text-sm">Manage before & after case studies</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-[#775a19] hover:bg-[#775a19]-dark text-[#0f0f0f] rounded-lg font-medium transition-colors"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          Add Case Study
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {caseStudies.length === 0 ? (
          <div className="text-[#7c766d] py-8 text-center col-span-full">No case studies found.</div>
        ) : caseStudies.map((item) => (
          <div key={item.id || item._id} className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl overflow-hidden hover:border-white/60 transition-colors">
            <div className="flex aspect-video bg-white/50 relative">
              <div className="w-1/2 relative border-r border-white/80 shadow-lg shadow-black/5">
                {item.beforeImage ? (
                  <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#7c766d] text-sm">Before</div>
                )}
                <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-[#1a1c1a] uppercase tracking-wider">Before</div>
              </div>
              <div className="w-1/2 relative">
                {item.afterImage ? (
                  <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[#7c766d] text-sm">After</div>
                )}
                <div className="absolute bottom-2 right-2 px-2 py-1 bg-black/60 backdrop-blur-md rounded text-[10px] text-[#1a1c1a] uppercase tracking-wider">After</div>
              </div>
            </div>
            <div className="p-5">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] text-[#775a19] uppercase tracking-wider border border-[#775a19]/30 px-2 py-0.5 rounded-full">{item.category}</span>
                  <h3 className="text-lg font-serif text-[#1a1c1a] font-medium mt-2">{item.title}</h3>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleOpenModal(item)} className="text-[#7c766d] hover:text-[#1a1c1a]"><span className="material-symbols-outlined text-[18px]">edit</span></button>
                  <button onClick={() => handleDelete(item.id || item._id)} className="text-[#7c766d] hover:text-red-400"><span className="material-symbols-outlined text-[18px]">delete</span></button>
                </div>
              </div>
              <p className="text-sm text-[#7c766d] mb-4">{item.subtitle}</p>
              <div className="grid grid-cols-2 gap-y-2 text-xs text-[#4b463e]">
                <div><span className="text-[#7c766d]">Protocol:</span> {item.protocol}</div>
                <div><span className="text-[#7c766d]">Sessions:</span> {item.sessions}</div>
                <div><span className="text-[#7c766d]">Recovery:</span> {item.recovery}</div>
                <div><span className="text-[#7c766d]">Doctor:</span> {item.doctor}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="bg-white/70 backdrop-blur-md border border-white/80 shadow-lg shadow-black/5 rounded-xl w-full max-w-2xl overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-white/80 shadow-lg shadow-black/5">
              <h2 className="text-xl font-serif text-[#1a1c1a]">
                {editingCase ? 'Edit Case Study' : 'Add Case Study'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-[#7c766d] hover:text-[#1a1c1a]">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="overflow-y-auto p-6">
              <form id="case-form" onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">Title</label>
                    <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">Category</label>
                    <select value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]">
                      <option value="skin">Skin</option>
                      <option value="hair">Hair</option>
                      <option value="body">Body</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#4b463e] mb-1">Subtitle / Brief Description</label>
                  <input required type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})}
                    className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">Protocol / Treatment</label>
                    <input required type="text" value={formData.protocol} onChange={e => setFormData({...formData, protocol: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">Number of Sessions</label>
                    <input required type="text" value={formData.sessions} onChange={e => setFormData({...formData, sessions: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">Recovery Time</label>
                    <input required type="text" value={formData.recovery} onChange={e => setFormData({...formData, recovery: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">Treating Doctor</label>
                    <input required type="text" value={formData.doctor} onChange={e => setFormData({...formData, doctor: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">Before Image URL</label>
                    <input type="text" value={formData.beforeImage} onChange={e => setFormData({...formData, beforeImage: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[#4b463e] mb-1">After Image URL</label>
                    <input type="text" value={formData.afterImage} onChange={e => setFormData({...formData, afterImage: e.target.value})}
                      className="w-full px-3 py-2 border border-white/60 bg-[#f4f3f1]/80 text-[#1a1c1a] rounded-lg focus:outline-none focus:border-[#775a19]" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="flex justify-end gap-3 p-6 border-t border-white/80 shadow-lg shadow-black/5 bg-white/70 backdrop-blur-md">
              <button type="button" onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-[#4b463e] hover:text-[#1a1c1a] transition-colors">
                Cancel
              </button>
              <button type="submit" form="case-form"
                className="px-4 py-2 text-sm font-medium bg-[#775a19] hover:bg-[#775a19]-dark text-[#0f0f0f] rounded-lg transition-colors">
                {editingCase ? 'Save Changes' : 'Upload Case Study'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
