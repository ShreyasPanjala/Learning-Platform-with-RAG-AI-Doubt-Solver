import React from 'react';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Sparkles, LogOut, CheckCircle2 } from 'lucide-react';
import { ScholarisIcon } from './ScholarisLogo';

export default function Navbar({ activeTab, setActiveTab, onGoHome }) {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#ECE8E3]/95 backdrop-blur-md border-b-2 border-[#0D0D0D] shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        
        {/* Brand & Wordmark */}
        <div 
          onClick={onGoHome} 
          className={`flex items-center gap-3.5 group transition-opacity ${onGoHome ? 'cursor-pointer hover:opacity-85' : ''}`}
        >
          <div className="w-10 h-10 rounded-lg bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] shadow-[2px_2px_0px_#5C5853] group-hover:scale-105 transition-transform">
            <ScholarisIcon className="w-5 h-5 text-[#ECE8E3]" />
          </div>
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-[0.14em] text-[#0D0D0D] uppercase font-display">
                SCHOLARIS
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-[#0D0D0D] text-[#ECE8E3] rounded-sm">
                RAG v1.0
              </span>
            </div>
            <p className="text-[10px] text-[#5C5853] font-bold tracking-[0.18em] uppercase hidden sm:block">
              AI-Powered Academic Doubt Solver &amp; Vault
            </p>
          </div>
        </div>

        {/* Navigation Tabs (Course Documents & AI Doubt Solver) */}
        {user && (
          <nav className="flex items-center gap-1.5 p-1.5 bg-[#E2DED8] border-2 border-[#0D0D0D] shadow-[2px_2px_0px_#0D0D0D]">
            <button
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'documents'
                  ? 'bg-[#0D0D0D] text-[#ECE8E3] shadow-sm'
                  : 'text-[#5C5853] hover:text-[#0D0D0D] hover:bg-[#ECE8E3]/70'
              }`}
              onClick={() => setActiveTab('documents')}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Documents</span>
            </button>
            <button
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider transition-all ${
                activeTab === 'chat'
                  ? 'bg-[#0D0D0D] text-[#ECE8E3] shadow-sm'
                  : 'text-[#5C5853] hover:text-[#0D0D0D] hover:bg-[#ECE8E3]/70'
              }`}
              onClick={() => setActiveTab('chat')}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Doubt Solver</span>
            </button>
          </nav>
        )}

        {/* User Profile & Session Controls */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3 pl-3.5 py-1.5 pr-1.5 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#0D0D0D]">
              <div className="w-7 h-7 bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] font-bold text-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'S'}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-bold text-[#0D0D0D] leading-tight truncate max-w-[120px]">{user.name}</span>
                <span className="text-[9px] text-[#5C5853] font-bold tracking-wider uppercase">
                  {user.role === 'instructor' ? 'Faculty Mentor' : 'Student Scholar'}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-1.5 text-[#5C5853] hover:text-[#0D0D0D] hover:bg-[#E2DED8] transition-colors ml-1"
                title="Sign Out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[2px_2px_0px_#0D0D0D] text-xs font-bold uppercase tracking-wider text-[#0D0D0D]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>RAG Engine Online</span>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
