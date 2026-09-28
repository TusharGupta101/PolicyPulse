import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { applicationService } from '../services/applicationService';
import { schemeService } from '../services/schemeService';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  PlusCircle,
  X,
  FileCheck2,
  FileText,
  ShieldCheck,
  Building,
  Coins
} from 'lucide-react';

export default function ApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [schemes, setSchemes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedSchemeId, setSelectedSchemeId] = useState('');
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchApplications = async () => {
    try {
      const [appsData, schemesData] = await Promise.all([
        applicationService.getApplications(),
        schemeService.getSchemes()
      ]);
      setApplications(appsData || []);
      setSchemes(schemesData || []);
      if (schemesData && schemesData.length > 0) {
        setSelectedSchemeId(schemesData[0].id);
      }
    } catch (err) {
      console.error('Failed loading applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const handleCreateApplication = async (e) => {
    e.preventDefault();
    if (!selectedSchemeId) return;

    setSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      await applicationService.submitApplication({
        scheme_id: parseInt(selectedSchemeId, 10),
        notes: notes.trim() || undefined
      });
      setMessage({ type: 'success', text: 'Application created and tracking code generated successfully!' });
      setShowModal(false);
      setNotes('');
      await fetchApplications();
    } catch (err) {
      setMessage({ type: 'error', text: err.response?.data?.detail || 'Failed to submit application.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving submitted applications..." />;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-2xl border border-[#E5E0D8] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/20">
              Citizen Tracking System
            </span>
          </div>
          <h1 className="text-2xl font-bold text-[#173B32]">Application Tracking & Workflow</h1>
          <p className="text-xs sm:text-sm text-[#6B7280] mt-1">
            Monitor submission status, acknowledgment tracking references, and welfare disbursement stages.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="self-start sm:self-auto px-4 py-2.5 bg-[#246B55] hover:bg-[#1B5241] text-white text-xs font-semibold rounded-xl shadow-sm transition-all flex items-center gap-1.5"
        >
          <PlusCircle className="w-4 h-4 text-[#D9A441]" />
          Submit Scheme Application
        </button>
      </div>

      {message.text && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2 text-sm border ${
            message.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-rose-50 text-rose-800 border-rose-200'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Applications List */}
      {applications.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E5E0D8] text-center shadow-sm space-y-3">
          <Send className="w-12 h-12 text-[#9CA3AF] mx-auto" />
          <h3 className="text-base font-bold text-[#173B32]">No active applications found</h3>
          <p className="text-xs text-[#6B7280] max-w-sm mx-auto">
            You haven't applied for any government schemes yet. Explore verified programs and check your eligibility to begin.
          </p>
          <div className="pt-2">
            <Link
              to="/schemes"
              className="px-4 py-2 bg-[#246B55] text-white text-xs font-semibold rounded-lg hover:bg-[#1B5241] inline-block transition-colors"
            >
              Browse Schemes Catalog
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="bg-white rounded-2xl border border-[#E5E0D8] p-5 sm:p-6 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono text-xs font-bold text-[#173B32] bg-[#FAF9F5] border border-[#E5E0D8] px-2 py-0.5 rounded">
                    {app.application_reference_number}
                  </span>
                  <h3 className="text-base font-bold text-[#173B32]">{app.scheme?.name || `Scheme #${app.scheme_id}`}</h3>
                </div>
                
                <div className="flex items-center gap-4 text-xs text-[#6B7280] pt-1">
                  <span>Submitted on: <strong className="text-[#173B32]">{new Date(app.submitted_at || app.created_at).toLocaleDateString()}</strong></span>
                  {app.notes && (
                    <span>Notes: <strong className="text-[#173B32]">{app.notes}</strong></span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8F3EE] text-[#173B32] border border-[#246B55]/30">
                  {app.status || 'SUBMITTED'}
                </span>
                <Link
                  to={`/schemes/${app.scheme_id}`}
                  className="p-2 text-[#6B7280] hover:text-[#173B32] hover:bg-[#FAF9F5] rounded-lg transition-colors border border-transparent hover:border-[#E5E0D8]"
                  title="View Scheme Details"
                >
                  <ExternalLink className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Application Submission Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-[#E5E0D8] shadow-2xl max-w-lg w-full p-6 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E0D8]">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-[#246B55]" />
                <h3 className="text-base font-bold text-[#173B32]">Submit Scheme Application</h3>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-[#6B7280] hover:text-[#173B32] p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateApplication} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#173B32] uppercase tracking-wide mb-1.5">
                  Select Target Scheme <span className="text-rose-500">*</span>
                </label>
                <select
                  value={selectedSchemeId}
                  onChange={(e) => setSelectedSchemeId(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 border border-[#D1C7B7] rounded-xl text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white font-medium"
                >
                  {schemes.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.category})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#173B32] uppercase tracking-wide mb-1.5">
                  Application Notes / Beneficiary Remarks (Optional)
                </label>
                <textarea
                  rows="3"
                  placeholder="e.g. Applied via son's ration card / Jan Seva Kendra token"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-[#D1C7B7] rounded-xl text-sm focus:ring-2 focus:ring-[#246B55] outline-none bg-white placeholder:text-[#9CA3AF]"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#E5E0D8] text-xs text-[#6B7280] space-y-1">
                <span className="font-bold text-[#173B32] block">Tracking Code Guarantee</span>
                <p>
                  A unique alphanumeric reference (e.g. <code className="font-mono text-[#246B55]">APP-2026-XXXXX</code>) will be allocated upon submission.
                </p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#6B7280] hover:text-[#173B32]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-[#246B55] hover:bg-[#1B5241] text-white text-xs font-semibold rounded-xl shadow-sm transition-all disabled:opacity-60 flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5 text-[#D9A441]" />
                  {submitting ? 'Generating...' : 'Confirm Submission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
