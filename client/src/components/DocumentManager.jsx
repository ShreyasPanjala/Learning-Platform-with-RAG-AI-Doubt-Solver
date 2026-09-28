import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { 
  UploadCloud, FileText, CheckCircle2, AlertTriangle, Trash2, RefreshCw, 
  BookOpen, FileCode, File, Sparkles, FolderPlus, Info, Compass 
} from 'lucide-react';
import { ScholarisIcon } from './ScholarisLogo';

export default function DocumentManager({ onAskAI }) {
  const { user } = useAuth();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const fileInputRef = useRef(null);

  const fetchDocuments = async (showLoading = false) => {
    if (showLoading) setLoading(true);
    try {
      const data = await api.getDocuments();
      setDocuments(data.documents || []);
    } catch (err) {
      setError('Failed to load course materials.');
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments(true);
  }, []);

  // Poll status every 4 seconds if any document is processing
  useEffect(() => {
    const hasProcessingDocs = documents.some(
      (doc) => doc.status === 'uploaded' || doc.status === 'processing'
    );

    if (hasProcessingDocs) {
      const interval = setInterval(() => {
        fetchDocuments(false);
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [documents]);

  // Contextual time-of-day greeting (Preserves Alex test assertion)
  const getGreeting = () => {
    const hour = new Date().getHours();
    let timeWord = 'Welcome back';
    if (hour < 12) timeWord = 'Good morning';
    else if (hour < 18) timeWord = 'Good afternoon';
    else timeWord = 'Good evening';

    const firstName = user?.name ? user.name.split(' ')[0] : '';
    return firstName ? `${timeWord}, ${firstName} 👋` : `${timeWord} 👋`;
  };

  const handleFileUpload = async (file) => {
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please upload a PDF document (.pdf format only).');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('Payload exceeds the 10 MB file size limit.');
      return;
    }

    setError('');
    setSuccessMsg('');
    setUploading(true);

    try {
      await api.uploadDocument(file);
      setSuccessMsg(`"${file.name}" uploaded successfully! Vectorizing chunks...`);
      fetchDocuments(false);
    } catch (err) {
      setError(err.message || 'Failed to upload document to vault.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"? Vector embeddings will be permanently removed.`)) {
      return;
    }

    try {
      await api.deleteDocument(id);
      setSuccessMsg(`"${name}" removed from vault.`);
      setDocuments(documents.filter((d) => d._id !== id));
    } catch (err) {
      setError(err.message || 'Failed to delete document.');
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  const getFileBadge = (filename) => {
    const ext = filename?.split('.').pop()?.toLowerCase();
    if (ext === 'pdf') return { label: 'PDF', bg: 'bg-[#0D0D0D] text-[#ECE8E3]', icon: FileText };
    if (ext === 'docx' || ext === 'doc') return { label: 'DOC', bg: 'bg-[#2B2925] text-[#ECE8E3]', icon: File };
    if (ext === 'txt') return { label: 'TXT', bg: 'bg-[#5C5853] text-[#ECE8E3]', icon: FileCode };
    return { label: 'DOC', bg: 'bg-[#0D0D0D] text-[#ECE8E3]', icon: FileText };
  };

  const getStatusBadge = (status, chunks) => {
    switch (status) {
      case 'processed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-emerald-800 bg-emerald-100 border border-emerald-300">
            <CheckCircle2 className="w-3 h-3 text-emerald-700" /> Vectorized ({chunks || 0})
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-amber-800 bg-amber-100 border border-amber-300 animate-pulse">
            <RefreshCw className="w-3 h-3 text-amber-700 animate-spin" /> Embedding...
          </span>
        );
      case 'uploaded':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-blue-800 bg-blue-100 border border-blue-300">
            Queued
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase text-red-800 bg-red-100 border border-red-300">
            <AlertTriangle className="w-3 h-3 text-[#991B1B]" /> Processing Error
          </span>
        );
      default:
        return <span className="inline-flex items-center px-2 py-0.5 text-[10px] font-bold text-[#5C5853] bg-[#E2DED8] border border-[#C8C4BD]">{status}</span>;
    }
  };

  const totalChunks = documents.reduce((acc, d) => acc + (d.chunksCount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-[#0D0D0D]">
      
      {/* Header & Dynamic Greeting */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#0D0D0D] pb-6 text-left">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#5C5853]">
            <Compass className="w-3.5 h-3.5 text-[#0D0D0D]" />
            <span>COURSE REPOSITORY // KNOWLEDGE VAULT</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold uppercase tracking-tight text-[#0D0D0D] font-display">
            {getGreeting()}
          </h2>
          <p className="text-xs sm:text-sm text-[#5C5853] font-editorial italic">
            Keep your textbooks, lecture notes, and syllabi vectorized and ready for doubt resolution.
          </p>
        </div>
        
        {/* Academic Vault Metrics */}
        <div className="flex items-center gap-3">
          <div className="px-5 py-3 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#0D0D0D] text-left">
            <div className="text-[9px] text-[#5C5853] uppercase tracking-[0.2em] font-bold">Course Documents</div>
            <div className="text-base sm:text-lg font-extrabold text-[#0D0D0D] font-display">{documents.length} Files</div>
          </div>
          <div className="px-5 py-3 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#0D0D0D] text-left">
            <div className="text-[9px] text-[#5C5853] uppercase tracking-[0.2em] font-bold">Vectorized Chunks</div>
            <div className="text-base sm:text-lg font-extrabold text-[#0D0D0D] font-display">{totalChunks} Chunks</div>
          </div>
          <button 
            onClick={() => fetchDocuments(true)} 
            className="p-3.5 bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
            title="Refresh Course Materials"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* RAG Grounded Architecture Banner */}
      <div className="flex items-center gap-3 p-4 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#0D0D0D] text-left text-xs text-[#0D0D0D]">
        <Sparkles className="w-4 h-4 text-[#0D0D0D] flex-shrink-0" />
        <span className="font-editorial italic leading-normal text-xs sm:text-sm">
          <strong>Grounded RAG Pipeline:</strong> All uploaded study materials are parsed with PyMuPDF and indexed into Pinecone vector memory. Click <strong>Ask AI Tutor</strong> on any document to query its contents with exact page-level citations.
        </span>
      </div>

      {/* Alerts */}
      {error && (
        <div className="flex items-center gap-3 p-4 bg-[#FEE2E2] border-2 border-[#991B1B] text-[#991B1B] text-xs font-bold text-left">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="flex items-center gap-3 p-4 bg-[#D1FAE5] border-2 border-[#059669] text-[#065F46] text-xs font-bold text-left">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Upload Dropzone Section (Preserves 'Upload your study material' test assertion) */}
      <div className="bg-[#F5F2ED] border-2 border-[#0D0D0D] p-6 sm:p-8 shadow-[6px_6px_0px_#0D0D0D] text-left space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#C8C4BD] pb-3">
          <div>
            <h3 className="text-lg font-extrabold uppercase tracking-tight text-[#0D0D0D] font-display">
              Upload your study material
            </h3>
            <p className="text-xs text-[#5C5853] font-editorial italic">
              Transmit course materials, textbooks, or assignments to vector space
            </p>
          </div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#5C5853] bg-[#E2DED8] px-2.5 py-1 border border-[#C8C4BD] self-start sm:self-auto">
            10 MB Max • PDF Format
          </span>
        </div>

        {/* Dropzone Card */}
        <div 
          onClick={() => fileInputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              handleFileUpload(e.dataTransfer.files[0]);
            }
          }}
          className={`border-2 border-dashed border-[#0D0D0D] p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
            uploading ? 'bg-[#E2DED8] opacity-60 pointer-events-none' : 'hover:bg-[#EFECE6]'
          }`}
        >
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={(e) => e.target.files && handleFileUpload(e.target.files[0])} 
            accept=".pdf" 
            className="hidden" 
          />

          <div className="w-12 h-12 bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] rounded-sm shadow-[3px_3px_0px_#5C5853]">
            {uploading ? (
              <RefreshCw className="w-6 h-6 animate-spin text-[#ECE8E3]" />
            ) : (
              <UploadCloud className="w-6 h-6 text-[#ECE8E3]" />
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold uppercase tracking-wider text-[#0D0D0D] font-display">
              {uploading ? 'Extracting text & computing embeddings...' : 'Click to select or drag and drop course PDF'}
            </p>
            <p className="text-xs text-[#5C5853] font-editorial italic">
              Documents are indexed with user isolation into Pinecone Vector Database
            </p>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              fileInputRef.current?.click();
            }}
            className="px-6 py-2.5 text-xs font-bold uppercase tracking-[0.18em] bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            Browse files
          </button>
        </div>

        <div className="text-xs text-[#5C5853] font-editorial italic pt-1">
          <strong className="text-[#0D0D0D]">Scholaris Study Tip:</strong> Uploaded materials are chunked into 500-character segments. You can ask queries against single documents or synthesize across the entire syllabus archive.
        </div>
      </div>

      {/* Main Study Library Section */}
      <div className="space-y-4 text-left">
        <div className="flex items-center justify-between border-b-2 border-[#0D0D0D] pb-3">
          <h3 className="text-lg font-extrabold uppercase tracking-tight text-[#0D0D0D] font-display flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#0D0D0D]" />
            <span>Study Library ({documents.length})</span>
          </h3>
        </div>

        {loading ? (
          <div className="bg-[#F5F2ED] border-2 border-[#0D0D0D] py-16 flex flex-col items-center justify-center space-y-3">
            <div className="animate-spin">
              <ScholarisIcon className="w-8 h-8 text-[#0D0D0D]" />
            </div>
            <p className="text-xs font-bold uppercase tracking-wider text-[#5C5853]">Querying Pinecone Vector Index...</p>
          </div>
        ) : documents.length === 0 ? (
          /* Clean Archival Empty State */
          <div className="bg-[#F5F2ED] border-2 border-[#0D0D0D] p-10 text-center flex flex-col items-center justify-center space-y-4 max-w-lg mx-auto shadow-[6px_6px_0px_#0D0D0D]">
            <div className="w-14 h-14 bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] rounded-sm">
              <FolderPlus className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-base font-extrabold uppercase tracking-tight text-[#0D0D0D] font-display">
                Your study space is empty
              </h4>
              <p className="text-xs text-[#5C5853] font-editorial italic max-w-sm">
                Upload your notes, textbook, or assignment. Scholaris will vectorize the content so you can query it with zero hallucinations.
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2"
            >
              <FolderPlus className="w-4 h-4" />
              <span>Upload your first document</span>
            </button>
          </div>
        ) : (
          /* Archival Study Cards Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => {
              const fileBadge = getFileBadge(doc.originalName);
              const FileIconComp = fileBadge.icon;
              return (
                <div 
                  key={doc._id}
                  className="bg-[#F5F2ED] border-2 border-[#0D0D0D] p-5 shadow-[5px_5px_0px_#0D0D0D] hover:shadow-[2px_2px_0px_#0D0D0D] hover:translate-x-[3px] hover:translate-y-[3px] transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Top Row: File Format Badge & Status */}
                    <div className="flex items-center justify-between gap-2 border-b border-[#C8C4BD] pb-2.5">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[9px] font-bold tracking-widest uppercase ${fileBadge.bg}`}>
                        <FileIconComp className="w-3 h-3" />
                        <span>{fileBadge.label}</span>
                      </div>
                      <div>{getStatusBadge(doc.status, doc.chunksCount)}</div>
                    </div>

                    {/* Title & Metadata */}
                    <div>
                      <h4 className="text-sm font-bold text-[#0D0D0D] line-clamp-2 leading-snug font-display" title={doc.originalName}>
                        {doc.originalName}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#5C5853] mt-2 font-mono">
                        <span>{formatFileSize(doc.fileSize)}</span>
                        <span>•</span>
                        <span>{new Date(doc.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Bottom Action Bar */}
                  <div className="pt-3 border-t border-[#C8C4BD] flex items-center justify-between">
                    <button
                      onClick={() => onAskAI && onAskAI(doc._id)}
                      disabled={doc.status !== 'processed'}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                        doc.status === 'processed'
                          ? 'bg-[#0D0D0D] text-[#ECE8E3] border border-[#0D0D0D] hover:bg-[#2B2A27]'
                          : 'bg-[#E2DED8] text-[#8A857E] border border-[#C8C4BD] cursor-not-allowed'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Ask AI Tutor</span>
                    </button>

                    <button
                      onClick={() => handleDelete(doc._id, doc.originalName)}
                      className="p-2 text-[#0D0D0D] hover:bg-[#FEE2E2] hover:text-[#991B1B] border border-[#0D0D0D] transition-colors"
                      title="Delete Document"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
