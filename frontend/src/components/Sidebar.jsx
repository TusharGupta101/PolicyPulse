import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  CheckSquare, 
  FileText, 
  UploadCloud, 
  UserCircle2, 
  Settings 
} from 'lucide-react';

export default function Sidebar() {
  const menuItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Scheme Catalog', path: '/schemes', icon: Compass },
    { name: 'Eligibility Check', path: '/eligibility', icon: CheckSquare },
    { name: 'My Applications', path: '/applications', icon: FileText },
    { name: 'Document Vault', path: '/documents', icon: UploadCloud },
    { name: 'Citizen Profile', path: '/profile', icon: UserCircle2 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <aside className="w-16 md:w-64 bg-[#173B32] text-white flex flex-col border-r border-[#246B55] transition-all duration-300 min-h-screen">
      <div className="p-4 border-b border-[#246B55] flex items-center justify-center md:justify-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#246B55] flex items-center justify-center text-[#D9A441] font-bold text-sm">
          PP
        </div>
        <div className="hidden md:block">
          <h2 className="text-sm font-bold tracking-tight text-white leading-none">Citizen Portal</h2>
          <p className="text-[10px] text-emerald-300/80 mt-0.5">Welfare Engine v1.0</p>
        </div>
      </div>

      <nav className="flex-1 px-2 md:px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-[#246B55] text-white shadow-sm'
                    : 'text-gray-300 hover:bg-[#1E4D40] hover:text-white'
                }`
              }
              title={item.name}
            >
              <Icon className="w-5 h-5 text-[#D9A441] shrink-0" />
              <span className="hidden md:inline truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="p-3 border-t border-[#246B55] hidden md:block">
        <div className="p-3 bg-[#122F28] rounded-xl border border-[#246B55]/60">
          <p className="text-[11px] font-semibold text-emerald-200">Govt. Direct Matching</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Rules auto-applied via state registries.</p>
        </div>
      </div>
    </aside>
  );
}
