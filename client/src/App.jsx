import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import LandingPage from './components/LandingPage';
import DocumentManager from './components/DocumentManager';
import ChatInterface from './components/ChatInterface';
import { ScholarisIcon } from './components/ScholarisLogo';
import './index.css';

function MainApp() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('documents');
  const [showLanding, setShowLanding] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#ECE8E3] flex flex-col items-center justify-center space-y-4 text-[#0D0D0D]">
        <div className="w-12 h-12 rounded-xl bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] shadow-md animate-pulse">
          <ScholarisIcon className="w-6 h-6 text-[#ECE8E3]" />
        </div>
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#5C5853]">
          Initializing Scholaris Knowledge Engine...
        </p>
      </div>
    );
  }

  // Unauthenticated users see the landing page
  if (!user || showLanding) {
    return <LandingPage onNavigateToApp={() => setShowLanding(false)} />;
  }

  const handleAskAI = (docId) => {
    setSelectedDocId(docId || '');
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-[#ECE8E3] flex flex-col text-[#0D0D0D]">
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onGoHome={() => setShowLanding(true)}
      />
      <main className="flex-1">
        {activeTab === 'documents' ? (
          <DocumentManager onAskAI={handleAskAI} />
        ) : (
          <ChatInterface initialDocId={selectedDocId} />
        )}
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
