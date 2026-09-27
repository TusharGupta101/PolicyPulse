import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle, HelpCircle } from 'lucide-react';

export default function StatusBadge({ status, className = '' }) {
  const normStatus = (status || '').toUpperCase();

  switch (normStatus) {
    case 'ELIGIBLE':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300 ${className}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          Eligible
        </span>
      );
    case 'INELIGIBLE':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300 ${className}`}>
          <XCircle className="w-3.5 h-3.5 text-rose-600" />
          Ineligible
        </span>
      );
    case 'POTENTIALLY_ELIGIBLE':
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300 ${className}`}>
          <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
          Potentially Eligible
        </span>
      );
    case 'INSUFFICIENT_INFORMATION':
    default:
      return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-300 ${className}`}>
          <HelpCircle className="w-3.5 h-3.5 text-slate-500" />
          Insufficient Information
        </span>
      );
  }
}
