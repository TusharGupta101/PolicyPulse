import React from 'react';
import { FolderOpen } from 'lucide-react';

export default function EmptyState({ title, description, actionText, onAction, icon: Icon = FolderOpen }) {
  return (
    <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-[#E5E0D8] bg-[#FAF9F5]">
      <div className="w-12 h-12 mx-auto rounded-full bg-[#E8F3EE] flex items-center justify-center text-[#246B55] mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-[#173B32]">{title}</h3>
      <p className="mt-1 text-xs sm:text-sm text-[#6B7280] max-w-sm mx-auto">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-xs font-semibold rounded-lg shadow-sm text-white bg-[#246B55] hover:bg-[#1B5241] transition-colors"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}
