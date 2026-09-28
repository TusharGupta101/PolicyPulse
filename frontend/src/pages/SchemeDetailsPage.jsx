import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { schemeService } from '../services/schemeService';
import { eligibilityService } from '../services/eligibilityService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  ShieldCheck,
  Tag,
  Coins,
  FileText,
  CheckCircle2,
  ExternalLink,
  ArrowLeft,
  BookOpen,
  ListOrdered,
  Users,
  Globe,
  Building,
  HelpCircle
} from 'lucide-react';

export default function SchemeDetailsPage() {
  const { schemeId } = useParams();
  const navigate = useNavigate();
  const [scheme, setScheme] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await schemeService.getScheme(schemeId);
        setScheme(data);
      } catch (err) {
        console.error('Failed to load scheme:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [schemeId]);

  const handleCheckEligibility = async () => {
    setChecking(true);
    try {
      await eligibilityService.checkEligibility(parseInt(schemeId, 10));
      navigate('/results');
    } catch (err) {
      console.error('Eligibility check error:', err);
      navigate('/results');
    } finally {
      setChecking(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving official scheme specification..." />;
  }

  if (!scheme) {
    return (
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-12 text-center max-w-xl mx-auto space-y-3">
        <h2 className="text-lg font-bold text-[#173B32]">Scheme not found</h2>
        <p className="text-xs text-[#6B7280]">The requested government welfare policy could not be found or has expired.</p>
        <Link
          to="/schemes"
          className="px-4 py-2 bg-[#246B55] text-white text-xs font-semibold rounded-lg inline-block hover:bg-[#1B5241] transition-colors"
        >
          &larr; Back to Schemes Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Back Link */}
      <Link
        to="/schemes"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] hover:text-[#173B32] transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Schemes Directory
      </Link>

      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
              {scheme.category}
            </span>
            <span className="text-xs font-mono text-[#6B7280]">{scheme.code}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#173B32] leading-snug">{scheme.name}</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] max-w-2xl">
            Target Group: <strong className="text-[#173B32]">{scheme.target_users}</strong> &bull; Applicable Region: <strong className="text-[#173B32]">{scheme.state_applicability}</strong>
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleCheckEligibility}
            disabled={checking}
            className="px-5 py-2.5 bg-[#246B55] hover:bg-[#1B5241] text-white text-xs sm:text-sm font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#D9A441]" />
            {checking ? 'Evaluating Rules...' : 'Check My Eligibility'}
          </button>

          {scheme.official_source_url && (
            <a
              href={scheme.official_source_url}
              target="_blank"
              rel="noreferrer"
              className="px-4 py-2.5 bg-[#FAF9F5] hover:bg-[#E8F3EE] text-[#173B32] text-xs sm:text-sm font-semibold rounded-xl border border-[#D1C7B7] transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Gazette Portal</span>
              <ExternalLink className="w-3.5 h-3.5 text-[#6B7280]" />
            </a>
          )}
        </div>
      </div>

      {/* Main Grid: Policy Details & Statutory Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Details & Overview */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Policy Objective */}
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E0D8]">
              <BookOpen className="w-4 h-4 text-[#246B55]" />
              <h2 className="text-base font-bold text-[#173B32]">Policy Objective & Scope</h2>
            </div>
            <p className="text-sm text-[#4B5563] leading-relaxed">
              {scheme.description}
            </p>
          </div>

          {/* Statutory Eligibility Conditions */}
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#E5E0D8]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#246B55]" />
                <h2 className="text-base font-bold text-[#173B32]">Statutory Eligibility Rules</h2>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#FAF9F5] text-[#6B7280] border border-[#E5E0D8]">
                Deterministic Checks
              </span>
            </div>

            {scheme.rules && scheme.rules.length > 0 ? (
              <div className="space-y-3">
                {scheme.rules.map((rule, idx) => (
                  <div
                    key={rule.id || idx}
                    className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] flex items-start justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-full bg-[#E8F3EE] text-[#173B32] font-bold text-[10px] flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-xs font-bold text-[#173B32]">
                          Attribute: <code className="text-[#246B55] font-mono">{rule.field}</code>
                        </span>
                      </div>
                      <p className="text-xs text-[#6B7280] pl-7">
                        Condition: <span className="font-semibold text-[#173B32]">{rule.operator}</span> {rule.value}
                      </p>
                    </div>
                    {rule.is_mandatory && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Mandatory
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6B7280]">
                Standard national demographic conditions apply.
              </p>
            )}
          </div>

          {/* Application Steps */}
          {scheme.application_steps && scheme.application_steps.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-[#E5E0D8]">
                <ListOrdered className="w-4 h-4 text-[#246B55]" />
                <h2 className="text-base font-bold text-[#173B32]">Official Application Procedure</h2>
              </div>
              <ol className="space-y-2 text-xs sm:text-sm text-[#4B5563] leading-relaxed">
                {Array.isArray(scheme.application_steps) ? (
                  scheme.application_steps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#E8F3EE] text-[#173B32] font-bold text-[11px] flex items-center justify-center flex-shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))
                ) : (
                  <li className="whitespace-pre-line">{scheme.application_steps}</li>
                )}
              </ol>
            </div>
          )}

        </div>

        {/* Right 1 Col: Summary & Required Documents */}
        <div className="space-y-6">
          
          {/* Benefit Snapshot Card */}
          <div className="bg-gradient-to-br from-[#173B32] to-[#102B24] rounded-2xl p-6 text-white shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-[#D9A441] uppercase tracking-wider">Entitled Benefit</span>
              <Coins className="w-5 h-5 text-[#D9A441]" />
            </div>
            <div>
              <span className="text-2xl font-extrabold text-white">
                {scheme.benefit_amount ? `₹${scheme.benefit_amount.toLocaleString('en-IN')}` : 'Direct Assistance'}
              </span>
              <p className="text-xs text-[#A3BFB7] mt-1">{scheme.benefit_description}</p>
            </div>
            <div className="pt-3 border-t border-[#1F4D42] text-xs text-[#A3BFB7] space-y-1.5">
              <div>Sponsoring Ministry: <strong className="text-white">{scheme.ministry || 'Government of India'}</strong></div>
              <div>State Scope: <strong className="text-white">{scheme.state_applicability}</strong></div>
            </div>
          </div>

          {/* Required Documents Checklist */}
          <div className="bg-white rounded-2xl border border-[#E5E0D8] p-6 shadow-sm space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-[#E5E0D8]">
              <FileText className="w-4 h-4 text-[#246B55]" />
              <h2 className="text-base font-bold text-[#173B32]">Evidence Checklist</h2>
            </div>
            
            {scheme.required_documents && scheme.required_documents.length > 0 ? (
              <ul className="space-y-2.5">
                {scheme.required_documents.map((doc, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs text-[#4B5563]">
                    <CheckCircle2 className="w-4 h-4 text-[#246B55] flex-shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-xs text-[#6B7280]">
                Standard identity verification (Aadhaar / Voter ID) required.
              </p>
            )}

            <div className="pt-3 border-t border-[#E5E0D8]">
              <Link
                to="/documents"
                className="w-full text-center py-2 px-3 bg-[#FAF9F5] hover:bg-[#E8F3EE] text-[#173B32] border border-[#D1C7B7] rounded-lg text-xs font-semibold block transition-colors"
              >
                Upload Supporting Evidence &rarr;
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
