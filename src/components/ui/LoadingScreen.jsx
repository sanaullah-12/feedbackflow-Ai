import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
      <div className="flex flex-col items-center gap-4">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-2xl" style={{ background: 'var(--brand)' }} />
          <div className="absolute inset-0 rounded-2xl animate-ping opacity-30" style={{ background: 'var(--brand)' }} />
          <div className="relative flex items-center justify-center h-full">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" fill="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <p className="text-sm font-medium" style={{ color: 'var(--text-3)' }}>Loading FeedbackFlow...</p>
      </div>
    </div>
  );
}
