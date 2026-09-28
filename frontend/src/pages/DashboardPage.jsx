import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CheckCircle2, 
  Clock, 
  FileText, 
  Compass, 
  ArrowUpRight, 
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();

  const metrics = [
    { title: 'Schemes Eligible', value: '14', icon: CheckCircle2, note: 'Based on profile criteria', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    { title: 'Active Applications', value: '3', icon: Clock, note: '2 currently in review', color: 'text-amber-700 bg-amber-50 border-amber-200' },
    { title: 'Verified Documents', value: '5', icon: FileText, note: 'All mandatory KYC clear', color: 'text-sky-700 bg-sky-50 border-sky-200' },
  ];

  const recentSchemes = [
    { id: 1, name: 'PM-KISAN Samman Nidhi', ministry: 'Ministry of Agriculture', benefit: '₹6,000 / year', category: 'Agriculture' },
    { id: 2, name: 'Ayushman Bharat (PM-JAY)', ministry: 'Ministry of Health', benefit: '₹5,00,000 cover', category: 'Healthcare' },
    { id: 3, name: 'Post-Matric Scholarship Scheme', ministry: 'Ministry of Social Justice', benefit: '100% tuition support', category: 'Education' },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-2 sm:px-4">
      <div className="bg-[#173B32] text-white p-5 sm:p-7 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#246B55]">
        <div>
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#246B55] text-emerald-200">
            Citizen Dashboard
          </span>
          <h1 className="text-xl sm:text-2xl font-bold mt-2">
            Welcome back, {user?.full_name || 'Citizen'}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-xl">
            Track your welfare claims, check algorithmically matched entitlements, and verify submission deadlines.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/eligibility"
            className="px-4 py-2 bg-[#D9A441] hover:bg-[#C59235] text-[#173B32] text-xs sm:text-sm font-bold rounded-xl transition-colors shadow-sm flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>Run Eligibility Check</span>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.title} className="bg-white rounded-2xl border border-[#E5E0D8] p-5 shadow-sm flex items-start justify-between">
              <div>
                <p className="text-xs font-semibold text-[#6B7280]">{metric.title}</p>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-[#173B32] mt-1">{metric.value}</h3>
                <p className="text-[11px] text-[#6B7280] mt-1">{metric.note}</p>
              </div>
              <div className={`p-3 rounded-xl border ${metric.color}`}>
                <Icon className="w-5 h-5" />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-[#E5E0D8] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#246B55]" />
              <h2 className="text-base font-bold text-[#173B32]">Recommended Schemes</h2>
            </div>
            <Link to="/schemes" className="text-xs font-semibold text-[#246B55] hover:underline flex items-center gap-1">
              <span>View all</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentSchemes.map((scheme) => (
              <div key={scheme.id} className="p-4 rounded-xl border border-[#E5E0D8] bg-[#FAF9F5] hover:bg-white hover:border-[#246B55]/40 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {scheme.category}
                    </span>
                    <span className="text-[11px] text-[#6B7280]">{scheme.ministry}</span>
                  </div>
                  <h4 className="text-sm font-bold text-[#173B32]">{scheme.name}</h4>
                  <p className="text-xs font-semibold text-[#246B55]">Benefit: {scheme.benefit}</p>
                </div>
                <Link
                  to="/schemes"
                  className="self-start sm:self-center px-3 py-1.5 rounded-lg border border-[#246B55] text-xs font-semibold text-[#246B55] hover:bg-[#246B55] hover:text-white transition-colors"
                >
                  Apply Now
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#E5E0D8] p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-[#E5E0D8]">
            <ShieldAlert className="w-5 h-5 text-[#D9A441]" />
            <h2 className="text-base font-bold text-[#173B32]">Action Required</h2>
          </div>

          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
            <h4 className="text-xs font-bold text-amber-900">Aadhaar e-KYC Renewal</h4>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Periodic validation required for active subsidy disbursements. Takes under 2 minutes.
            </p>
            <Link
              to="/documents"
              className="inline-block mt-1 text-xs font-bold text-amber-900 underline hover:text-amber-950"
            >
              Verify document &rarr;
            </Link>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] space-y-2">
            <h4 className="text-xs font-bold text-[#173B32]">Income Certificate</h4>
            <p className="text-[11px] text-[#6B7280]">
              State portal linked. Valid through financial year end.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
