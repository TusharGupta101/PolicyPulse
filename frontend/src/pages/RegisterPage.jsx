import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, Mail, Lock, AlertCircle } from 'lucide-react';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(fullName, email, password);
      navigate('/profile');
    } catch (err) {
      if (!err.response) {
        setError('Unable to connect to the PolicyPulse server. Please check your connection and ensure the backend is running.');
      } else {
        setError(err.response.data?.detail || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#F7F5EF] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="flex-1 flex items-center justify-center">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-[#E5E0D8]">
          <div className="text-center">
            <Link to="/" className="inline-block">
              <div className="w-12 h-12 rounded-xl bg-[#246B55] mx-auto flex items-center justify-center text-[#D9A441] font-bold shadow-sm mb-3">
                <ShieldCheck className="w-7 h-7" />
              </div>
            </Link>
            <h2 className="text-2xl font-bold text-[#173B32]">Create Citizen Account</h2>
            <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">Start discovering welfare schemes tailored to you</p>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B32] uppercase tracking-wide mb-1">Full Legal Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full pl-9 pr-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B32] uppercase tracking-wide mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="citizen@example.com"
                  className="w-full pl-9 pr-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#173B32] uppercase tracking-wide mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="w-full pl-9 pr-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#246B55] hover:bg-[#1B5241] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Creating Account...' : 'Register as Citizen'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6B7280]">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-[#246B55] hover:underline">
              Sign in here
            </Link>
          </p>
        </div>
      </div>

      <div className="text-center text-xs text-[#6B7280] pt-6">
        © 2026 PolicyPulse. Built for accessible public-service discovery.
      </div>
    </div>
  );
}
