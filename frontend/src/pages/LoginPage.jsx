import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, AlertCircle, KeyRound } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(email.trim(), password);
      navigate(from, { replace: true });
      if (!err.response) {
        setError('Unable to connect to the PolicyPulse server. Please check your connection and ensure the backend is running.');
      } else if (err.response.status === 404) {
        setError('API endpoint not found (404). Please ensure the backend is running and VITE_API_URL is set in environment configuration.');
      } else {
        setError(err.response.data?.detail || 'Invalid email or password.');
      }
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('demo@example.com');
    setPassword('DemoPassword123!');
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
            <h2 className="text-2xl font-bold text-[#173B32]">Sign in to PolicyPulse</h2>
            <p className="mt-1 text-xs sm:text-sm text-[#6B7280]">Access your dashboard and scheme eligibility</p>
          </div>

          {/* 1-Click Demo Login Helper */}
          <div className="mt-5 p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-[#173B32] block">Evaluator Demo Account</span>
              <span className="text-[11px] font-mono text-[#246B55]">demo@example.com &bull; DemoPassword123!</span>
            </div>
            <button
              type="button"
              onClick={fillDemoAccount}
              className="px-3 py-1.5 bg-[#246B55] hover:bg-[#1B5241] text-white text-xs font-semibold rounded-lg shadow-sm transition-colors flex items-center gap-1"
            >
              <KeyRound className="w-3.5 h-3.5 text-[#D9A441]" />
              Auto Fill
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-800 text-xs sm:text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#173B32] uppercase tracking-wide mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#9CA3AF] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="demo@example.com"
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
                  placeholder="••••••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-[#D1C7B7] rounded-lg text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 px-4 bg-[#246B55] hover:bg-[#1B5241] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors disabled:opacity-60"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-[#6B7280]">
            Don't have an account yet?{' '}
            <Link to="/register" className="font-semibold text-[#246B55] hover:underline">
              Register here
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
