import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../config';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('admin', JSON.stringify(data.admin));
        navigate('/');
      } else {
        setError(data.message || 'Invalid credentials');
      }
    } catch (err) {
      setError('Connection error. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white/70 backdrop-blur-md p-8 rounded-2xl border border-white/80 shadow-lg shadow-black/5">
        <div>
          <h2 className="mt-6 text-center text-4xl font-serif font-bold text-[#1a1c1a] tracking-widest uppercase">
            Shivsai 360
          </h2>
          <p className="mt-2 text-center text-sm font-sans text-[#7c766d]">
            Sign in to access the admin portal
          </p>
        </div>
        
        <form className="mt-8 space-y-6 font-sans" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50/80 border border-red-200 text-red-600 text-sm p-3 rounded-xl text-center backdrop-blur-sm">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#4b463e] mb-1" htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-white/80 border border-[#cdc6ba] text-[#1a1c1a] placeholder-[#7c766d] rounded-xl focus:outline-none focus:ring-0 focus:border-[#775a19] sm:text-sm transition-colors"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#4b463e] mb-1" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                className="appearance-none relative block w-full px-4 py-3 bg-white/80 border border-[#cdc6ba] text-[#1a1c1a] placeholder-[#7c766d] rounded-xl focus:outline-none focus:ring-0 focus:border-[#775a19] sm:text-sm transition-colors"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-[#775a19] hover:bg-[#5d4201] shadow-md transition-colors disabled:opacity-70"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
