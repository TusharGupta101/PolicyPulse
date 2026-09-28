import React from 'react';

export default function StatCard({ title, value, icon: Icon, description, color = 'civic' }) {
  const colorMap = {
    civic: 'bg-[#E8F3EE] text-[#246B55] border-[#246B55]/20',
    emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    blue: 'bg-[#E8F3EE] text-[#246B55] border-[#246B55]/20',
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-[#E5E0D8] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider">{title}</p>
        {Icon && (
          <div className={`p-2 rounded-xl border ${colorMap[color] || colorMap.civic}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>
      <div className="mt-3">
        <h3 className="text-2xl font-bold text-[#173B32] tracking-tight">{value}</h3>
        {description && (
          <p className="mt-1 text-xs text-[#6B7280]">{description}</p>
        )}
      </div>
    </div>
  );
}
