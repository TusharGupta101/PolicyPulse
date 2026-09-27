import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Menu, 
  X, 
  ShieldCheck, 
  Compass, 
  CheckSquare, 
  FileText, 
  User, 
  LogOut, 
  LogIn, 
  UserPlus 
} from 'lucide-react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const navLinks = [
    { name: 'Schemes', path: '/schemes', icon: Compass },
    { name: 'Eligibility', path: '/eligibility', icon: CheckSquare },
    { name: 'Applications', path: '/applications', icon: FileText },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-[#173B32] text-white border-b border-[#246B55] sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <Link 
            to="/" 
            className="flex items-center gap-2.5 group"
            onClick={() => setMobileMenuOpen(false)}
          >
            <div className="w-9 h-9 rounded-xl bg-[#246B55] flex items-center justify-center border border-[#3E8B73] shadow-sm">
              <ShieldCheck className="w-5 h-5 text-[#D9A441]" />
            </div>
            <div>
              <span className="text-lg font-black tracking-tight text-white group-hover:text-[#D9A441] transition-colors">
                PolicyPulse
              </span>
              <span className="hidden sm:inline-block ml-1.5 px-1.5 py-0.2 rounded text-[9px] font-bold uppercase tracking-wider bg-[#246B55] text-emerald-200">
                Civic Tech
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-3">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive(link.path)
                      ? 'bg-[#246B55] text-white shadow-inner'
                      : 'text-gray-200 hover:bg-[#1E4D40] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D9A441]" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Right Auth Actions */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/profile"
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-[#246B55] transition-colors ${
                    isActive('/profile')
                      ? 'bg-[#246B55] text-white'
                      : 'bg-[#122F28] hover:bg-[#1E4D40] text-gray-200'
                  }`}
                >
                  <User className="w-3.5 h-3.5 text-[#D9A441]" />
                  <span>{user.full_name || 'My Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="p-1.5 rounded-lg text-gray-300 hover:text-white hover:bg-rose-900/40 transition-colors"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-gray-200 hover:text-white hover:bg-[#1E4D40] transition-colors flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#D9A441] text-[#173B32] hover:bg-[#C59235] transition-colors flex items-center gap-1.5 shadow-sm"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-gray-200 hover:text-white hover:bg-[#246B55] focus:outline-none transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#122F28] border-b border-[#246B55] px-4 pt-2 pb-4 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive(link.path)
                      ? 'bg-[#246B55] text-white'
                      : 'text-gray-200 hover:bg-[#1E4D40] hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4 text-[#D9A441]" />
                  <span>{link.name}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-[#246B55] space-y-2">
            {user ? (
              <>
                <Link
                  to="/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-gray-200 hover:bg-[#1E4D40]"
                >
                  <User className="w-4 h-4 text-[#D9A441]" />
                  <span>{user.full_name || 'My Profile'}</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-semibold text-rose-300 hover:bg-rose-950/40 text-left transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border border-[#246B55] text-xs font-semibold text-gray-200 hover:bg-[#1E4D40]"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-[#D9A441] text-[#173B32] text-xs font-bold hover:bg-[#C59235]"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
