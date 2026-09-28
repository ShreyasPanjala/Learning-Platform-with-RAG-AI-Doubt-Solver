import React, { useState } from 'react';
import HeroVisual from './HeroVisual';
import AuthModal from './AuthModal';
import { ScholarisIcon } from './ScholarisLogo';
import { 
  ArrowRight, BookOpen, Sparkles, CheckCircle2, FileText, 
  Search, ShieldCheck, Database, Layers, GraduationCap 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function LandingPage({ onNavigateToApp }) {
  const { user } = useAuth();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');

  const handleOpenAuth = (mode) => {
    if (user) {
      onNavigateToApp();
    } else {
      setAuthMode(mode);
      setIsAuthOpen(true);
    }
  };

  const handleCtaClick = () => {
    if (user) {
      onNavigateToApp();
    } else {
      setAuthMode('signup');
      setIsAuthOpen(true);
    }
  };

  return (
    <div className="relative min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col justify-between bg-[#ECE8E3] text-[#0D0D0D] selection:bg-[#0D0D0D] selection:text-[#ECE8E3]">
      
      {/* Archival Container Frame */}
      <div className="relative w-full max-w-7xl mx-auto border-2 border-[#0D0D0D] bg-[#ECE8E3] p-6 sm:p-10 shadow-[8px_8px_0px_#0D0D0D] overflow-hidden space-y-12">
        
        {/* Navigation Bar */}
        <header className="relative z-20 flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b-2 border-[#0D0D0D]">
          
          {/* Logo Mark + Title */}
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] shadow-[2px_2px_0px_#5C5853]">
              <ScholarisIcon className="w-5 h-5 text-[#ECE8E3]" />
            </div>
            <div className="text-left">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-extrabold tracking-[0.14em] text-[#0D0D0D] uppercase font-display">
                  SCHOLARIS
                </span>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-[0.2em] bg-[#0D0D0D] text-[#ECE8E3] rounded-sm">
                  RAG AI
                </span>
              </div>
              <p className="text-[10px] text-[#5C5853] font-bold tracking-[0.18em] uppercase">
                Grounded Doubt Solver &amp; Academic Intelligence
              </p>
            </div>
          </div>

          {/* Academic Workflow Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs font-bold uppercase tracking-[0.18em] text-[#5C5853]">
            <span className="text-[#0D0D0D] hover:underline cursor-pointer">How RAG Works</span>
            <span className="hover:text-[#0D0D0D] cursor-pointer transition-colors">Document Vault</span>
            <span className="hover:text-[#0D0D0D] cursor-pointer transition-colors">Doubt Solver</span>
            <span className="hover:text-[#0D0D0D] cursor-pointer transition-colors">Page Citations</span>
            <span className="hover:text-[#0D0D0D] cursor-pointer transition-colors">Academic Integrity</span>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3 self-start md:self-auto">
            {user ? (
              <button
                onClick={onNavigateToApp}
                className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
              >
                <span>Open Scholaris Workspace</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => handleOpenAuth('login')}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#0D0D0D] hover:underline transition-all"
                >
                  Log In
                </button>
                <button
                  onClick={() => handleOpenAuth('signup')}
                  className="px-6 py-2.5 text-xs font-bold uppercase tracking-wider bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </header>

        {/* Hero Section: "RESOLVE EVERY ACADEMIC DOUBT" */}
        <section className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 pb-6">
          
          {/* Left Column: Headlines & Editorial Copy */}
          <div className="lg:col-span-6 space-y-6 text-left">
            
            {/* Category Stamp */}
            <div className="inline-flex items-center gap-2.5 px-3 py-1 border-2 border-[#0D0D0D] bg-[#F5F2ED] text-[10px] font-bold uppercase tracking-[0.25em] text-[#0D0D0D] shadow-[2px_2px_0px_#0D0D0D]">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
              <span>RETRIEVAL-AUGMENTED GENERATION // ACADEMIC DOUBT SOLVER</span>
            </div>

            {/* Giant 3D Extruded Title in same brutalist aesthetic */}
            <h1 className="voyager-display-3d text-5xl sm:text-7xl lg:text-8xl leading-[0.95] tracking-tight">
              RESOLVE<br />
              YOUR DOUBTS
            </h1>

            {/* Editorial Lead Paragraph */}
            <p className="text-base sm:text-lg text-[#33312E] leading-relaxed font-editorial font-normal italic">
              "Turn dense textbooks, lecture slides, and syllabus notes into instant, grounded comprehension. Scholaris indexes your course materials with vector embeddings and answers your exact doubts with page-level citations — zero guesswork, 100% academic integrity."
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={handleCtaClick}
                className="px-8 py-4 text-xs font-bold uppercase tracking-[0.2em] bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center gap-3"
              >
                <span>Ask A Doubt</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => handleOpenAuth('login')}
                className="px-6 py-4 text-xs font-bold uppercase tracking-[0.2em] bg-[#F5F2ED] text-[#0D0D0D] border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] hover:shadow-[1px_1px_0px_#0D0D0D] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex items-center gap-2"
              >
                <BookOpen className="w-4 h-4" />
                <span>Upload Materials</span>
              </button>
            </div>

            {/* Academic Grounding Metrics */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t-2 border-[#0D0D0D]/20">
              <div className="space-y-0.5">
                <div className="text-2xl font-extrabold font-display text-[#0D0D0D]">100%</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C5853]">Grounded Context</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-extrabold font-display text-[#0D0D0D]">Exact Page</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C5853]">Source Citations</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-2xl font-extrabold font-display text-[#0D0D0D]">Zero</div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#5C5853]">Hallucinations</div>
              </div>
            </div>

          </div>

          {/* Right Column: Tailored RAG AI Doubt Resolution Pipeline Graphic */}
          <div className="lg:col-span-6">
            <HeroVisual />
          </div>

        </section>

        {/* Clean, Scholarly RAG Pipeline Architecture Section (replaces the removed space journal & pillars from photo) */}
        <section className="relative z-10 pt-8 border-t-2 border-[#0D0D0D] text-left">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
            <div>
              <div className="inline-block px-3 py-1 bg-[#0D0D0D] text-[#ECE8E3] text-[9px] font-bold uppercase tracking-[0.25em] mb-2">
                RAG RESOLUTION ARCHITECTURE
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold font-display uppercase text-[#0D0D0D]">
                How Scholaris Resolves Doubts
              </h2>
            </div>
            <p className="text-xs text-[#5C5853] font-editorial italic max-w-md">
              A multi-tier retrieval-augmented pipeline ensuring every answer is directly derived and cited from your course syllabus.
            </p>
          </div>

          {/* 3 Academic Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Step 1 */}
            <div className="p-6 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] rounded-sm">
                  <FileText className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#0D0D0D] text-[#ECE8E3] px-2 py-0.5">
                  STAGE 01
                </span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D0D0D]">
                PDF Ingestion &amp; Chunking
              </h3>
              <p className="text-xs text-[#5C5853] leading-relaxed font-editorial">
                Upload your course syllabi, textbooks, and lecture handouts. PyMuPDF extracts text into 500-character segments while preserving exact chapter and page metadata.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] rounded-sm">
                  <Database className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#0D0D0D] text-[#ECE8E3] px-2 py-0.5">
                  STAGE 02
                </span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D0D0D]">
                Vector Proximity Search
              </h3>
              <p className="text-xs text-[#5C5853] leading-relaxed font-editorial">
                Document chunks are transformed into 384-dimensional dense vectors and stored in Pinecone with user and course isolation, enabling millisecond semantic matching.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] rounded-sm">
                  <Sparkles className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-mono font-bold bg-[#0D0D0D] text-[#ECE8E3] px-2 py-0.5">
                  STAGE 03
                </span>
              </div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-[#0D0D0D]">
                Grounded LLM Synthesis
              </h3>
              <p className="text-xs text-[#5C5853] leading-relaxed font-editorial">
                Groq LLM formulates clear, comprehensive doubt solutions strictly grounded in the retrieved passages, citing exact source files and page numbers.
              </p>
            </div>

          </div>

        </section>

        {/* Clean Scholarly Footer */}
        <footer className="relative z-10 pt-6 border-t-2 border-[#0D0D0D] flex flex-col sm:flex-row items-center justify-between text-xs font-bold uppercase tracking-[0.18em] text-[#5C5853]">
          <div className="flex items-center gap-2">
            <ScholarisIcon className="w-4 h-4 text-[#0D0D0D]" />
            <span>SCHOLARIS ACADEMIC INTELLIGENCE PLATFORM © 2026</span>
          </div>
          <div className="flex items-center gap-6 mt-4 sm:mt-0">
            <span className="hover:text-[#0D0D0D] cursor-pointer">RAG Pipeline</span>
            <span className="hover:text-[#0D0D0D] cursor-pointer">Academic Integrity</span>
            <span className="hover:text-[#0D0D0D] cursor-pointer">Groq &amp; Pinecone</span>
          </div>
        </footer>

      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        initialMode={authMode}
      />
    </div>
  );
}
