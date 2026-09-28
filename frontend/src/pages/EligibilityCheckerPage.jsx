import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { eligibilityService } from '../services/eligibilityService';
import { schemeService } from '../services/schemeService';
import { profileService } from '../services/profileService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FileCheck2,
  ShieldCheck,
  Cpu,
  ArrowRight,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  UserCircle2,
  Scale
} from 'lucide-react';

export default function EligibilityCheckerPage() {
  const navigate = useNavigate();
  const [schemes, setSchemes] = useState([]);
  const [selectedSchemeId, setSelectedSchemeId] = useState('');
  const [loading, setLoading] = useState(true);
  const [evaluating, setEvaluating] = useState(false);
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    async function loadData() {
      try {
        const [schemesData, profileData] = await Promise.all([
          schemeService.getSchemes(),
          profileService.getProfile()
        ]);
        setSchemes(schemesData || []);
        setProfile(profileData);
      } catch (err) {
        console.error('Failed to load checker prerequisites:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleRunEvaluation = async () => {
    setEvaluating(true);
    setError('');
    try {
      const schemeId = selectedSchemeId ? parseInt(selectedSchemeId, 10) : null;
      await eligibilityService.checkEligibility(schemeId);
      navigate('/results');
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to execute rule evaluation.');
    } finally {
      setEvaluating(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Preparing deterministic evaluation engine..." />;
  }

  const profileIncomplete = !profile?.annual_income || !profile?.age || !profile?.occupation;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm">
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
            Rule-Based Audit Engine
          </span>
        </div>
        <h1 className="text-2xl font-bold text-[#173B32]">Deterministic Eligibility Checker</h1>
        <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
          Compute your legal qualification for central and state schemes using exact mathematical rule evaluation.
        </p>
      </div>

      {profileIncomplete && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-xs uppercase tracking-wide">Incomplete Profile Advisory</h4>
            <p className="mt-0.5 text-xs text-amber-800">
              Some core demographic or financial fields (Income, Age, Occupation) are currently blank in your profile.
              Schemes requiring these parameters may return <strong className="font-semibold">INSUFFICIENT_INFORMATION</strong>.
            </p>
            <Link
              to="/profile"
              className="text-xs font-bold text-[#173B32] hover:underline mt-1.5 inline-block"
            >
              Complete Profile Parameters &rarr;
            </Link>
          </div>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-center gap-2">
          <AlertCircle className="w-5 h-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Main Execution Card */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[#E8F3EE] border border-[#246B55]/20 rounded-xl text-[#246B55] flex-shrink-0">
            <Scale className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[#173B32]">Configure Evaluation Scope</h2>
            <p className="text-xs text-[#6B7280] mt-1">
              Select whether to assess your eligibility for all active national policies or target a specific program.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-semibold text-[#173B32] uppercase tracking-wide mb-1.5">
              Target Welfare Scheme
            </label>
            <select
              value={selectedSchemeId}
              onChange={(e) => setSelectedSchemeId(e.target.value)}
              className="w-full px-3.5 py-2.5 border border-[#D1C7B7] rounded-xl text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white font-medium"
            >
              <option value="">Evaluate All Available Schemes ({schemes.length} Programs)</option>
              {schemes.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} ({s.category})
                </option>
              ))}
            </select>
          </div>

          <div className="p-4 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] space-y-2 text-xs text-[#4B5563]">
            <h4 className="font-bold text-[#173B32] uppercase tracking-wide text-[11px]">Deterministic Engine Guarantees</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#246B55] flex-shrink-0" />
                <span>Deterministic boolean logic (==, !=, &gt;, &lt;, &gt;=, &lt;=, IN)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#246B55] flex-shrink-0" />
                <span>Zero arbitrary AI model hallucinations</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#246B55] flex-shrink-0" />
                <span>Document evidence cross-referencing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-[#246B55] flex-shrink-0" />
                <span>Official gazette clause grounding</span>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handleRunEvaluation}
              disabled={evaluating}
              className="w-full py-3.5 px-6 bg-[#246B55] hover:bg-[#1B5241] text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-60"
            >
              {evaluating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Evaluating Rules Against Profile Parameters...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
                  <span>Execute Deterministic Eligibility Check</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
