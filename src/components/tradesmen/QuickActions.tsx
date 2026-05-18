'use client';

import Link from 'next/link';

interface Project {
  id: number;
  title: string;
}

interface QuickActionsProps {
  projects: Project[];
  isClockedIn: boolean;
}

export default function QuickActions({ projects, isClockedIn }: QuickActionsProps) {
  const firstProject = projects[0];

  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      {/* Quick Photo Upload */}
      {firstProject && (
        <Link
          href={`/tradesmen/project/${firstProject.id}`}
          className="bg-linear-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
        >
          <div className="flex flex-col items-center gap-2">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 019.07 4h5.86a2 2 0 011.664.89l.812 1.22A2 2 0 0019 6h.93a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span className="font-bold text-sm">Quick Photo</span>
            <span className="text-xs opacity-90">Upload now</span>
          </div>
        </Link>
      )}

      {/* Daily Report */}
      <Link
        href="/tradesmen/reports"
        className="bg-linear-to-br from-green-500 to-green-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
      >
        <div className="flex flex-col items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-bold text-sm">Daily Report</span>
          <span className="text-xs opacity-90">Submit today</span>
        </div>
      </Link>

      {/* Time Tracking */}
      <Link
        href="/tradesmen/time"
        className={`p-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all ${
          isClockedIn
            ? 'bg-linear-to-br from-amber-500 to-orange-600'
            : 'bg-linear-to-br from-blue-500 to-blue-600'
        } text-white`}
      >
        <div className="flex flex-col items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="font-bold text-sm">{isClockedIn ? 'Clock Out' : 'Clock In'}</span>
          <span className="text-xs opacity-90">{isClockedIn ? 'End shift' : 'Start shift'}</span>
        </div>
      </Link>

      {/* Materials Request */}
      <Link
        href="/tradesmen/materials"
        className="bg-linear-to-br from-indigo-500 to-indigo-600 text-white p-4 rounded-xl shadow-lg hover:shadow-xl active:scale-95 transition-all"
      >
        <div className="flex flex-col items-center gap-2">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <span className="font-bold text-sm">Materials</span>
          <span className="text-xs opacity-90">Request</span>
        </div>
      </Link>
    </div>
  );
}
