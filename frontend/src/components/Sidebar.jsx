import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Compass,
  FileCheck2,
  FileUp,
  FileSpreadsheet,
  Send,
  UserCircle2,
  Settings,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export default function Sidebar({ isOpen, closeSidebar }) {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Citizen Profile', href: '/profile', icon: UserCircle2 },
    { name: 'Scheme Discovery', href: '/schemes', icon: Compass },
    { name: 'Eligibility Checker', href: '/eligibility', icon: FileCheck2 },
    { name: 'Eligibility Results', href: '/results', icon: FileSpreadsheet },
    { name: 'Document Vault', href: '/documents', icon: FileUp },
    { name: 'Applications', href: '/applications', icon: Send },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-40 md:hidden"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`fixed md:sticky top-0 md:top-[65px] left-0 z-40 h-screen md:h-[calc(100vh-65px)] w-64 bg-[#173B32] text-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out md:translate-x-0 border-r border-[#1F4D42] ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 overflow-y-auto">
          <div className="md:hidden mb-6 flex items-center justify-between">
            <span className="text-white font-bold text-base flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#D9A441]" />
              PolicyPulse Menu
            </span>
            <button onClick={closeSidebar} className="text-slate-400 hover:text-white p-1">✕</button>
          </div>

          <div className="text-[11px] font-bold text-[#A3BFB7] uppercase tracking-wider px-3 mb-2.5">
            Citizen Workspace
          </div>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={closeSidebar}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-[#246B55] text-white shadow-sm border-l-4 border-[#D9A441]'
                      : 'text-[#C5D8D2] hover:text-white hover:bg-[#1E4A3F]'
                  }`
                }
              >
                <item.icon className="w-4 h-4 flex-shrink-0 text-[#D9A441]" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          <div className="mt-8 pt-6 border-t border-[#1F4D42]">
            <div className="text-[11px] font-bold text-[#A3BFB7] uppercase tracking-wider px-3 mb-2">
              Developer APIs
            </div>
            <a
              href={`${(import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000').replace(/\/+$/, '')}/docs`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-[#A3BFB7] hover:text-white hover:bg-[#1E4A3F] transition-colors"
            >
              <span>Swagger API Docs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="p-4 border-t border-[#1F4D42] bg-[#102B24]">
          <div className="flex items-center gap-2 text-xs text-[#E5E0D8]">
            <div className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></div>
            <span className="font-medium">Deterministic Rule Engine</span>
          </div>
          <p className="mt-1 text-[11px] text-[#A3BFB7]">Mathematical compliance verified.</p>
        </div>
      </aside>
    </>
  );
}
