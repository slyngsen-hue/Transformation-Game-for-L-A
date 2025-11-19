import React from 'react';

export const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
);

export const RefreshCw = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>
);

export const CheckCircle = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m22 4-10 10-5-5"/></svg>
);

export const BrainCircuit = ({ className }: { className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/><path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/><path d="M15 13a4.5 4.5 0 0 1-3-4 4.5 4.5 0 0 1-3 4"/><path d="M17.599 6.5a3 3 0 0 0 .399-1.375"/><path d="M6.003 5.125A3 3 0 0 0 6.401 6.5"/><path d="M3.477 10.896a4 4 0 0 1 .585-.396"/><path d="M19.938 10.5a4 4 0 0 1 .585.396"/><path d="M6 18a4 4 0 0 1-1.97-3.284"/><path d="M17.969 14.716A4 4 0 0 1 16 18"/></svg>
);

export const LALogo = ({ className }: { className?: string }) => (
  <div className={`flex flex-col items-center ${className}`}>
    <div className="relative w-12 h-10 mb-1">
      {/* Serif L&A */}
      <span className="absolute top-0 left-0 font-serif text-2xl font-bold tracking-tighter text-slate-100" style={{ fontFamily: 'Merriweather' }}>
        L<span className="italic font-light text-amber-500 text-xl mx-0.5">&</span>A
      </span>
    </div>
    {/* Book Icon */}
    <svg viewBox="0 0 100 40" className="w-12 h-5 fill-amber-600">
        <path d="M50 25 C 30 25, 20 10, 5 15 L 5 35 C 20 30, 40 40, 50 35 C 60 40, 80 30, 95 35 L 95 15 C 80 10, 70 25, 50 25 Z" opacity="0.8" />
        <path d="M50 25 L 50 35" stroke="currentColor" strokeWidth="2" className="text-slate-900"/>
    </svg>
    <div className="text-[6px] tracking-[0.1em] text-slate-300 uppercase mt-1 font-serif font-bold">
      Lynnerup & Ansell
    </div>
  </div>
);