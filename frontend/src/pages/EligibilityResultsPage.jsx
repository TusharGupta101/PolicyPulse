import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { eligibilityService } from '../services/eligibilityService';
import { aiService } from '../services/aiService';
import StatusBadge from '../components/StatusBadge';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FileSpreadsheet,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  HelpCircle,
  Coins,
  Bot,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  FileText,
  Send,
  Sparkles,
  Info,
  ShieldCheck,
  Scale
} from 'lucide-react';

export default function EligibilityResultsPage() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [aiExplanations, setAiExplanations] = useState({});
  const [loadingAi, setLoadingAi] = useState({});

  useEffect(() => {
    async function loadResults() {
      try {
        const data = await eligibilityService.getResults();
        setResults(data || []);
        if (data && data.length > 0) {
          setExpandedId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load eligibility results:', err);
      } finally {
        setLoading(false);
      }
    }
    loadResults();
  }, []);

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleRequestAiExplanation = async (res) => {
    setLoadingAi((prev) => ({ ...prev, [res.id]: true }));
    try {
      const data = await aiService.explainEligibility(res.scheme_id, res.id);
      setAiExplanations((prev) => ({ ...prev, [res.id]: data }));
    } catch (err) {
      console.error('Failed fetching AI explanation:', err);
    } finally {
      setLoadingAi((prev) => ({ ...prev, [res.id]: false }));
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving evaluated eligibility reports..." />;
  }

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
              Audit Audit Trail
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#173B32]">Explainable Eligibility Results</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1 max-w-2xl">
            Statutory rule determinations computed deterministically against your profile parameters with official citations.
          </p>
        </div>
        <Link
          to="/eligibility"
          className="self-start sm:self-auto px-4 py-2 bg-[#246B55] hover:bg-[#1B5241] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-[#D9A441]" />
          Re-run Evaluation
        </Link>
      </div>

      {results.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E5E0D8] text-center shadow-sm space-y-3">
          <Scale className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#173B32]">No evaluations on file</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            You haven't run an eligibility check yet. Click below to evaluate your profile against all active welfare policies.
          </p>
          <Link
            to="/eligibility"
            className="mt-2 inline-flex items-center px-4 py-2 bg-[#246B55] text-white text-xs font-semibold rounded-lg hover:bg-[#1B5241] transition-colors"
          >
            Launch Eligibility Checker
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((res) => {
            const isExpanded = expandedId === res.id;
            const aiData = aiExplanations[res.id];
            const isAiLoading = loadingAi[res.id];

            return (
              <div
                key={res.id}
                className="bg-white rounded-2xl border border-[#E5E0D8] shadow-sm overflow-hidden transition-all"
              >
                {/* Accordion Header */}
                <div
                  onClick={() => toggleExpand(res.id)}
                  className="p-5 sm:p-6 cursor-pointer hover:bg-[#FAF9F5] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 max-w-2xl">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="text-xs font-mono font-medium px-2 py-0.5 rounded bg-[#FAF9F5] border border-[#E5E0D8] text-[#173B32]">
                        {res.scheme?.code || `SCHEME-${res.scheme_id}`}
                      </span>
                      <h3 className="text-base font-bold text-[#173B32]">{res.scheme?.name || `Scheme #${res.scheme_id}`}</h3>
                      <StatusBadge status={res.status} />
                    </div>
                    <p className="text-xs text-[#6B7280] line-clamp-2">{res.explanation}</p>
                  </div>

                  <div className="flex items-center gap-4 sm:flex-col sm:items-end sm:gap-1">
                    {res.estimated_benefit > 0 && (
                      <div className="flex items-center gap-1 text-[#246B55] font-bold text-sm">
                        <Coins className="w-4 h-4 text-[#D9A441]" />
                        <span>₹{res.estimated_benefit.toLocaleString('en-IN')}/yr</span>
                      </div>
                    )}
                    <button className="text-[#6B7280] hover:text-[#173B32] p-1">
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Detailed Breakdown */}
                {isExpanded && (
                  <div className="p-5 sm:p-6 bg-[#FAF9F5] border-t border-[#E5E0D8] space-y-6">
                    {/* Criteria Evaluator Matrix */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Passed Criteria */}
                      <div className="bg-white rounded-xl p-4 border border-emerald-200 shadow-xs">
                        <div className="flex items-center gap-2 text-emerald-800 font-bold text-xs uppercase tracking-wide mb-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span>Criteria Satisfied ({res.passed_criteria?.length || 0})</span>
                        </div>
                        {res.passed_criteria && res.passed_criteria.length > 0 ? (
                          <ul className="space-y-2 text-xs">
                            {res.passed_criteria.map((item, idx) => (
                              <li key={idx} className="p-2 bg-emerald-50/60 rounded-lg border border-emerald-100 text-slate-800">
                                <p className="font-semibold text-emerald-950">{item.description}</p>
                                <p className="text-[11px] text-[#6B7280] mt-0.5">
                                  <strong>Profile:</strong> {String(item.actual_value)} &bull; <strong>Rule:</strong> {item.operator} {String(item.expected_value)}
                                </p>
                                {item.source_section && (
                                  <p className="text-[10px] text-[#9CA3AF] mt-0.5 italic">Ref: {item.source_section}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-[#9CA3AF] italic">No statutory criteria passed.</p>
                        )}
                      </div>

                      {/* Failed Criteria */}
                      <div className="bg-white rounded-xl p-4 border border-rose-200 shadow-xs">
                        <div className="flex items-center gap-2 text-rose-800 font-bold text-xs uppercase tracking-wide mb-3">
                          <XCircle className="w-4 h-4 text-rose-600" />
                          <span>Criteria Disqualified ({res.failed_criteria?.length || 0})</span>
                        </div>
                        {res.failed_criteria && res.failed_criteria.length > 0 ? (
                          <ul className="space-y-2 text-xs">
                            {res.failed_criteria.map((item, idx) => (
                              <li key={idx} className="p-2 bg-rose-50/60 rounded-lg border border-rose-100 text-slate-800">
                                <p className="font-semibold text-rose-950">{item.description}</p>
                                <p className="text-[11px] text-[#6B7280] mt-0.5">
                                  <strong>Profile:</strong> {String(item.actual_value)} &bull; <strong>Rule:</strong> {item.operator} {String(item.expected_value)}
                                </p>
                                <p className="text-[10px] text-rose-700 mt-0.5">{item.reason}</p>
                                {item.source_section && (
                                  <p className="text-[10px] text-[#9CA3AF] mt-0.5 italic">Ref: {item.source_section}</p>
                                )}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-[#9CA3AF] italic">No disqualifying criteria encountered.</p>
                        )}
                      </div>

                      {/* Missing Information / Docs */}
                      <div className="bg-white rounded-xl p-4 border border-amber-200 shadow-xs">
                        <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wide mb-3">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span>Pending Verification ({res.missing_information?.length || 0})</span>
                        </div>
                        {res.missing_information && res.missing_information.length > 0 ? (
                          <ul className="space-y-2 text-xs">
                            {res.missing_information.map((item, idx) => (
                              <li key={idx} className="p-2 bg-amber-50/60 rounded-lg border border-amber-100 text-slate-800">
                                <p className="font-semibold text-amber-950">{item.description}</p>
                                <p className="text-[10px] text-amber-800 mt-0.5">{item.reason}</p>
                              </li>
                            ))}
                          </ul>
                        ) : (
                          <p className="text-xs text-[#9CA3AF] italic">All required parameters & documents present.</p>
                        )}
                      </div>
                    </div>

                    {/* AI Policy Explanation Section */}
                    <div className="bg-white rounded-xl p-5 border border-[#E5E0D8] shadow-xs space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-1.5 rounded-lg bg-[#E8F3EE] text-[#246B55]">
                            <Bot className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-[#173B32] uppercase tracking-wide">
                              Grounded Legal & Policy Guidance
                            </h4>
                            <span className="text-[11px] text-[#6B7280]">Official gazette clauses & structured citations</span>
                          </div>
                        </div>

                        {!aiData && (
                          <button
                            onClick={() => handleRequestAiExplanation(res)}
                            disabled={isAiLoading}
                            className="px-3 py-1.5 bg-[#E8F3EE] hover:bg-[#D4E8DF] text-[#173B32] text-xs font-semibold rounded-lg border border-[#246B55]/30 transition-colors flex items-center gap-1.5"
                          >
                            <Sparkles className="w-3.5 h-3.5 text-[#D9A441]" />
                            {isAiLoading ? 'Synthesizing...' : 'Generate Grounded Explanation'}
                          </button>
                        )}
                      </div>

                      {aiData && (
                        <div className="mt-3 space-y-3 border-t border-[#E5E0D8] pt-3">
                          <p className="text-xs text-[#4B5563] leading-relaxed font-sans">{aiData.explanation}</p>

                          {aiData.citations && aiData.citations.length > 0 && (
                            <div>
                              <h5 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">
                                Policy Section Citations
                              </h5>
                              <ul className="space-y-1">
                                {aiData.citations.map((c, i) => (
                                  <li key={i} className="text-[11px] text-[#4B5563] bg-[#FAF9F5] p-2 rounded border border-[#E5E0D8]">
                                    &bull; {c}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {aiData.suggested_actions && aiData.suggested_actions.length > 0 && (
                            <div>
                              <h5 className="text-[11px] font-bold text-[#6B7280] uppercase tracking-wide mb-1">
                                Actionable Next Steps
                              </h5>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {aiData.suggested_actions.map((act, i) => (
                                  <div key={i} className="flex items-center gap-1.5 text-xs text-[#173B32] bg-[#E8F3EE]/50 p-2 rounded border border-[#246B55]/20">
                                    <span className="w-4 h-4 rounded-full bg-[#246B55] text-white text-[10px] flex items-center justify-center font-bold flex-shrink-0">
                                      {i + 1}
                                    </span>
                                    <span>{act}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Footer Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-[#6B7280]">
                        Evaluated on: {new Date(res.checked_at).toLocaleString()} &bull; Source: {res.source_reference || 'Official Guidelines'}
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          to={`/schemes/${res.scheme_id}`}
                          className="px-3.5 py-2 text-xs font-semibold text-[#173B32] hover:text-[#246B55] border border-[#D1C7B7] rounded-lg hover:bg-white transition-colors"
                        >
                          View Scheme Rules
                        </Link>
                        {res.status === 'ELIGIBLE' && (
                          <Link
                            to="/applications"
                            className="px-4 py-2 text-xs font-semibold text-white bg-[#059669] hover:bg-[#047857] rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                          >
                            <Send className="w-3.5 h-3.5" />
                            Proceed to Apply
                          </Link>
                        )}
                        {res.status === 'POTENTIALLY_ELIGIBLE' && (
                          <Link
                            to="/documents"
                            className="px-4 py-2 text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 border border-amber-300 rounded-lg transition-colors flex items-center gap-1.5"
                          >
                            <FileText className="w-3.5 h-3.5" />
                            Upload Missing Documents
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
