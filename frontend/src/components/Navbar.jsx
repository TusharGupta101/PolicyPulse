import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, LogOut, User, Menu, X, Compass, FileCheck2, Send, LayoutDashboard } from 'lucide-react';

export default function Navbar({ toggleSidebar }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isPublicLanding = location.pathname === '/';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-white border-b border-[#E5E0D8] sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tagline */}
          <div className="flex items-center gap-3">
            {toggleSidebar && user && (
              <button
                onClick={toggleSidebar}
                className="md:hidden p-2 rounded-lg text-[#173B32] hover:bg-[#F7F5EF] transition-colors"
                aria-label="Toggle Navigation"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}

            <Link to={user ? "/dashboard" : "/"} className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#246B55] border border-[#1E5644] flex items-center justify-center text-[#D9A441] font-bold shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <span className="font-bold text-[#173B32] text-lg leading-tight block">
                  Policy<span className="text-[#D9A441]">Pulse</span>
                </span>
                <span className="text-[9px] text-[#6B7280] font-semibold tracking-wider uppercase block">
                  Understand. Discover. Access.
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className={`text-sm font-medium transition-colors ${
                location.pathname === '/' ? 'text-[#246B55] font-semibold' : 'text-[#4B5563] hover:text-[#173B32]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/schemes"
              className={`text-sm font-medium transition-colors ${
                location.pathname.startsWith('/schemes') ? 'text-[#246B55] font-semibold' : 'text-[#4B5563] hover:text-[#173B32]'
              }`}
            >
              Schemes
            </Link>
            {isPublicLanding ? (
              <>
                <a href="#how-it-works" className="text-sm font-medium text-[#4B5563] hover:text-[#173B32] transition-colors">
                  How It Works
                </a>
                <a href="#about" className="text-sm font-medium text-[#4B5563] hover:text-[#173B32] transition-colors">
                  About
                </a>
              </>
            ) : (
              <>
                {user && (
                  <>
                    <Link
                      to="/eligibility"
                      className={`text-sm font-medium transition-colors ${
                        location.pathname === '/eligibility' ? 'text-[#246B55] font-semibold' : 'text-[#4B5563] hover:text-[#173B32]'
                      }`}
                    >
                      Eligibility
                    </Link>
                    <Link
                      to="/applications"
                      className={`text-sm font-medium transition-colors ${
                        location.pathname === '/applications' ? 'text-[#246B55] font-semibold' : 'text-[#4B5563] hover:text-[#173B32]'
                      }`}
                    >
                      Applications
                    </Link>
                  </>
                )}
              </>
            )}
          </nav>

          {/* Auth Controls */}
          <div className="hidden sm:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-lg hover:bg-[#F7F5EF] transition-colors border border-transparent hover:border-[#E5E0D8]"
                >
                  <div className="w-8 h-8 rounded-full bg-[#E8F3EE] border border-[#246B55]/30 flex items-center justify-center text-[#246B55] font-bold text-xs">
                    {user.full_name ? user.full_name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <div className="text-left leading-tight hidden lg:block">
                    <span className="text-xs font-semibold text-[#173B32] block truncate max-w-[120px]">{user.full_name}</span>
                    <span className="text-[10px] text-[#6B7280] block">Citizen Account</span>
                  </div>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Sign out"
                  className="p-2 text-[#6B7280] hover:text-[#DC2626] hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-1.5 text-xs font-semibold text-[#173B32] hover:text-[#246B55] transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#246B55] hover:bg-[#1B5241] rounded-lg shadow-sm transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile hamburger for landing/public */}
          <div className="md:hidden flex items-center gap-2">
            {!toggleSidebar && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg text-[#173B32] hover:bg-[#F7F5EF]"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && !toggleSidebar && (
        <div className="md:hidden border-t border-[#E5E0D8] bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-[#173B32] hover:bg-[#F7F5EF]"
          >
            Home
          </Link>
          <Link
            to="/schemes"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-[#173B32] hover:bg-[#F7F5EF]"
          >
            Schemes
          </Link>
          <a
            href="#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-[#4B5563] hover:bg-[#F7F5EF]"
          >
            How It Works
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-md text-sm font-medium text-[#4B5563] hover:bg-[#F7F5EF]"
          >
            About
          </a>
          <div className="pt-2 border-t border-[#E5E0D8] flex flex-col gap-2">
            {user ? (
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-[#246B55] rounded-lg"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-medium text-[#173B32] bg-[#F7F5EF] rounded-lg"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center px-4 py-2 text-sm font-semibold text-white bg-[#246B55] rounded-lg"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
