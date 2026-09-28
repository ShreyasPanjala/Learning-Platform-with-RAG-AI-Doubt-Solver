import React from 'react';
import { FileText, Sparkles, CheckCircle2, BookOpen, Search, ArrowRight, CornerDownRight } from 'lucide-react';
import { ScholarisIcon } from './ScholarisLogo';

export default function HeroVisual() {
  return (
    <div className="relative w-full max-w-xl mx-auto h-[480px] sm:h-[520px] flex items-center justify-center select-none">
      
      {/* Background Deep Academic Pitch Black Organic Archival Void */}
      <div className="absolute w-[94%] h-[94%] bg-[#0D0D0D] border-2 border-[#0D0D0D] shadow-[8px_8px_0px_#5C5853] p-5 flex flex-col justify-between overflow-hidden">
        
        {/* Subtle Archival Grid */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#ECE8E3_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none"></div>

        {/* Ambient Subtle Amber/Teal Glow */}
        <div className="absolute -top-10 -right-10 w-52 h-52 bg-amber-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-emerald-400/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Bar inside the void */}
        <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#2B2925] text-[10px] font-mono tracking-widest text-[#ECE8E3]/70 uppercase">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>RAG PIPELINE // PINECONE VECTOR DB + GROQ LLM</span>
          </div>
          <span className="hidden sm:inline-block">EMBEDDING DIM: 384</span>
        </div>

        {/* Dynamic Visual Content: Student Doubt -> RAG Vector Retrieval -> Grounded Answer */}
        <div className="relative z-10 space-y-4 my-auto">
          
          {/* Card 1: Student Academic Doubt */}
          <div className="bg-[#1A1A1A] border border-[#3D3A35] p-3.5 shadow-lg space-y-2 transform transition-transform hover:-translate-y-0.5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-[#0D0D0D] border border-[#3D3A35] text-[9px] font-mono uppercase text-amber-300">
                <Search className="w-2.5 h-2.5" />
                Student Academic Doubt
              </span>
              <span className="text-[9px] font-mono text-[#8C8880]">Context Scope: Data Structures</span>
            </div>
            <p className="text-xs text-[#ECE8E3] font-sans font-medium leading-snug">
              "Why does Dijkstra's Algorithm fail with negative edge weights?"
            </p>
          </div>

          {/* Connection Step: Vector Extraction & Chunking */}
          <div className="flex items-center justify-center gap-3 py-0.5">
            <div className="h-px bg-gradient-to-r from-transparent via-[#5C5853] to-transparent flex-1"></div>
            <div className="px-2.5 py-1 bg-[#0D0D0D] border border-[#3D3A35] text-[9px] font-mono text-emerald-400 uppercase tracking-wider flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3 h-3 text-emerald-400 animate-spin" />
              <span>Vector Similarity Match: 99.4%</span>
            </div>
            <div className="h-px bg-gradient-to-r from-transparent via-[#5C5853] to-transparent flex-1"></div>
          </div>

          {/* Card 2: Grounded Solution with Exact Page Citation */}
          <div className="bg-[#F5F2ED] border-2 border-[#ECE8E3] p-4 text-[#0D0D0D] shadow-[4px_4px_0px_#2B2925] space-y-2.5 text-left">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#C8C4BD]">
              <span className="inline-flex items-center gap-1.5 text-[9px] font-bold font-mono uppercase tracking-wider text-[#0D0D0D]">
                <CheckCircle2 className="w-3 h-3 text-emerald-700" />
                Verified Grounded Resolution
              </span>
              <span className="text-[9px] font-mono font-bold bg-[#0D0D0D] text-[#ECE8E3] px-2 py-0.5">
                NO HALLUCINATION
              </span>
            </div>

            <p className="text-xs text-[#2B2925] font-editorial italic leading-relaxed">
              "Dijkstra greedily assumes that once a vertex is marked finalized, its shortest distance cannot decrease. Negative edges violate this subproblem optimality, creating cycles or shorter alternative paths."
            </p>

            {/* Document Citation Badge */}
            <div className="flex items-center justify-between p-2 bg-[#0D0D0D] text-[#ECE8E3] text-[10px] font-mono">
              <div className="flex items-center gap-1.5 truncate">
                <FileText className="w-3 h-3 text-amber-300 shrink-0" />
                <span className="truncate">Source: Algorithms_CLRS_Ch24.pdf</span>
              </div>
              <span className="text-amber-300 font-bold ml-2 shrink-0">Page 658</span>
            </div>
          </div>

        </div>

        {/* Bottom Technical Status Bar inside the void */}
        <div className="relative z-10 pt-2 border-t border-[#2B2925] flex items-center justify-between text-[9px] font-mono text-[#8C8880] uppercase">
          <span>Syllabus Parsing: PyMuPDF</span>
          <span>Chunk Size: 500 Chars</span>
          <span>Inference: Groq Llama 3</span>
        </div>

      </div>

      {/* Floating Exterior Badge 1 (Top Right) */}
      <div className="absolute -top-3 -right-2 sm:-right-4 z-20 px-3 py-1.5 bg-[#F5F2ED] border-2 border-[#0D0D0D] text-[10px] font-bold uppercase tracking-[0.2em] text-[#0D0D0D] shadow-[3px_3px_0px_#0D0D0D]">
        100% GROUNDED
      </div>

      {/* Floating Exterior Badge 2 (Bottom Left) */}
      <div className="absolute -bottom-3 -left-2 sm:-left-4 z-20 px-3 py-1.5 bg-[#0D0D0D] border-2 border-[#0D0D0D] text-[10px] font-bold uppercase tracking-[0.2em] text-[#ECE8E3] shadow-[3px_3px_0px_#5C5853] flex items-center gap-1.5">
        <ScholarisIcon className="w-3.5 h-3.5 text-[#ECE8E3]" />
        <span>SCHOLARIS INTELLIGENCE</span>
      </div>

    </div>
  );
}
