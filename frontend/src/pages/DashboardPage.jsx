import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { profileService } from '../services/profileService';
import { eligibilityService } from '../services/eligibilityService';
import { applicationService } from '../services/applicationService';
import { schemeService } from '../services/schemeService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  CheckCircle2,
  AlertTriangle,
  FileUp,
  Coins,
  ArrowRight,
  User,
  Compass,
  FileCheck2,
  Calendar,
  Send,
  ShieldCheck,
  Building,
  UserCircle2,
  Clock
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [results, setResults] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [profData, resData, schemesData, appsData] = await Promise.all([
          profileService.getProfile(),
          eligibilityService.getResults(),
          schemeService.getSchemes(),
          applicationService.getApplications()
        ]);
        setProfile(profData);
        setResults(resData || []);
        setSchemes(schemesData || []);
        setApplications(appsData || []);
      } catch (err) {
        console.error('Failed loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner text="Compiling citizen dashboard & metrics..." />;
  }

  const eligibleCount = results.filter((r) => r.status === 'ELIGIBLE').length;
  const potentialCount = results.filter((r) => r.status === 'POTENTIALLY_ELIGIBLE').length;
  const totalBenefit = results
    .filter((r) => r.status === 'ELIGIBLE' || r.status === 'POTENTIALLY_ELIGIBLE')
    .reduce((sum, r) => sum + (r.estimated_benefit || 0), 0);

  // Profile completion calculation
  const calculateCompletion = () => {
    if (!profile) return 0;
    const essentialFields = [
      profile.age !== null,
      profile.gender,
      profile.marital_status,
      profile.annual_income !== null,
      profile.occupation,
      profile.state,
      profile.caste_category,
      profile.land_ownership_acres !== null
    ];
    const completedCount = essentialFields.filter(Boolean).length;
    return Math.round((completedCount / essentialFields.length) * 100);
  };

  const profileCompletion = calculateCompletion();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#173B32] via-[#1E5644] to-[#102B24] rounded-2xl p-6 sm:p-8 text-white shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#102B24] border border-[#235346] text-[#D9A441] text-xs font-semibold mb-2">
            <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse"></span>
            Citizen Portal Active
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">
            Welcome back, {user?.full_name || 'Citizen'}
          </h1>
          <p className="text-xs sm:text-sm text-[#A3BFB7] mt-1 max-w-xl leading-relaxed">
            Your demographic profile is mapped to state and central statutory regulations. Review your eligible benefits and track submitted applications.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            to="/eligibility"
            className="px-4 py-2.5 bg-[#246B55] hover:bg-[#1B5241] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-2 border border-[#37856D]"
          >
            <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
            Check Eligibility
          </Link>
          <Link
            to="/schemes"
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-medium rounded-xl backdrop-blur transition-all flex items-center gap-2 border border-white/20"
          >
            <Compass className="w-4 h-4 text-[#D9A441]" />
            Browse Catalog
          </Link>
        </div>
      </div>

      {/* Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Available Schemes */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
              Available Schemes
            </span>
            <span className="text-2xl font-bold text-[#173B32] mt-1 block">
              {schemes.length}
            </span>
            <span className="text-[11px] text-[#246B55] font-medium mt-0.5 block">
              In active national registry
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#E8F3EE] border border-[#246B55]/20 flex items-center justify-center text-[#246B55]">
            <Compass className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Eligible Schemes */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
              Eligible Schemes
            </span>
            <span className="text-2xl font-bold text-[#059669] mt-1 block">
              {eligibleCount}
            </span>
            <span className="text-[11px] text-[#6B7280] mt-0.5 block">
              {potentialCount} need document upload
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: Tracked Applications */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
              Applications
            </span>
            <span className="text-2xl font-bold text-[#173B32] mt-1 block">
              {applications.length}
            </span>
            <span className="text-[11px] text-[#6B7280] mt-0.5 block">
              Submitted & tracked
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] flex items-center justify-center text-[#246B55]">
            <Send className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Profile Completion */}
        <div className="bg-white p-5 rounded-2xl border border-[#E5E0D8] shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">
              Profile Completion
            </span>
            <span className="text-2xl font-bold text-[#D97706] mt-1 block">
              {profileCompletion}%
            </span>
            <span className="text-[11px] text-[#6B7280] mt-0.5 block">
              {profileCompletion === 100 ? 'Fully configured' : 'Update missing criteria'}
            </span>
          </div>
          <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700">
            <UserCircle2 className="w-5 h-5" />
          </div>
        </div>

      </div>

      {/* Quick Action Hub */}
      <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-4">
        <h2 className="text-base font-bold text-[#173B32]">Citizen Quick Actions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          <Link
            to="/schemes"
            className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] hover:border-[#246B55]/50 hover:bg-[#E8F3EE]/40 transition-all flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E8F3EE] text-[#246B55] flex items-center justify-center">
              <Compass className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#173B32] block">Find Schemes</span>
              <span className="text-[10px] text-[#6B7280] block">Explore government catalog</span>
            </div>
          </Link>

          <Link
            to="/eligibility"
            className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] hover:border-[#246B55]/50 hover:bg-[#E8F3EE]/40 transition-all flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E8F3EE] text-[#246B55] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#173B32] block">Check Eligibility</span>
              <span className="text-[10px] text-[#6B7280] block">Run deterministic engine</span>
            </div>
          </Link>

          <Link
            to="/profile"
            className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] hover:border-[#246B55]/50 hover:bg-[#E8F3EE]/40 transition-all flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E8F3EE] text-[#246B55] flex items-center justify-center">
              <UserCircle2 className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#173B32] block">Update Profile</span>
              <span className="text-[10px] text-[#6B7280] block">Edit demographic parameters</span>
            </div>
          </Link>

          <Link
            to="/applications"
            className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] hover:border-[#246B55]/50 hover:bg-[#E8F3EE]/40 transition-all flex items-center gap-3"
          >
            <div className="w-9 h-9 rounded-lg bg-[#E8F3EE] text-[#246B55] flex items-center justify-center">
              <Send className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#173B32] block">View Applications</span>
              <span className="text-[10px] text-[#6B7280] block">Track submitted reference IDs</span>
            </div>
          </Link>

        </div>
      </div>

      {/* Main 2-Column: Recent Applications & Top Matched Schemes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Applications */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
            <div className="flex items-center gap-2">
              <Send className="w-4 h-4 text-[#246B55]" />
              <h2 className="text-base font-bold text-[#173B32]">Recent Applications</h2>
            </div>
            <Link to="/applications" className="text-xs font-semibold text-[#246B55] hover:text-[#173B32]">
              View All ({applications.length}) &rarr;
            </Link>
          </div>

          {applications.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Send className="w-8 h-8 text-[#9CA3AF] mx-auto" />
              <p className="text-xs text-[#6B7280]">No submitted applications yet.</p>
              <Link
                to="/schemes"
                className="text-xs font-semibold text-[#246B55] hover:underline inline-block"
              >
                Explore schemes to apply &rarr;
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#173B32] block">{app.scheme?.name || `Scheme #${app.scheme_id}`}</span>
                    <span className="text-[10px] font-mono text-[#6B7280]">Ref: {app.application_reference_number}</span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Matched Schemes */}
        <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#246B55]" />
              <h2 className="text-base font-bold text-[#173B32]">Eligibility Status Summary</h2>
            </div>
            <Link to="/results" className="text-xs font-semibold text-[#246B55] hover:text-[#173B32]">
              Full Results Audit &rarr;
            </Link>
          </div>

          {results.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-[#9CA3AF] mx-auto text-[#D9A441]" />
              <p className="text-xs text-[#6B7280]">No eligibility check performed yet.</p>
              <Link
                to="/eligibility"
                className="px-3 py-1.5 bg-[#246B55] text-white text-xs font-semibold rounded-lg inline-block hover:bg-[#1B5241] transition-colors"
              >
                Run Eligibility Check
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {results.slice(0, 3).map((res) => (
                <div
                  key={res.id}
                  className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-[#173B32] block">{res.scheme?.name || `Scheme #${res.scheme_id}`}</span>
                    <span className="text-[10px] text-[#6B7280]">
                      Entitled Benefit: ₹{(res.estimated_benefit || 0).toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      res.status === 'ELIGIBLE'
                        ? 'bg-emerald-100 text-emerald-800'
                        : res.status === 'POTENTIALLY_ELIGIBLE'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-rose-100 text-rose-800'
                    }`}
                  >
                    {res.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
