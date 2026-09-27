import React from 'react';

export default function LoadingSpinner({ text = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-8 h-8 border-3 border-[#246B55] border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm text-[#6B7280] font-medium">{text}</p>
    </div>
  );
}
