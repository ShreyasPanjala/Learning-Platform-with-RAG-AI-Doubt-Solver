import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { 
  Bot, Send, Plus, Trash2, BookOpen, FileText, Sparkles, ChevronDown, ChevronUp, User, 
  Lightbulb, Target, HelpCircle, Copy, Check, MessageSquare, Compass 
} from 'lucide-react';
import { ScholarisIcon } from './ScholarisLogo';

export default function ChatInterface({ initialDocId }) {
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [selectedDocId, setSelectedDocId] = useState(initialDocId || '');
  const [inputQuestion, setInputQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetchingChats, setFetchingChats] = useState(true);
  const [expandedSources, setExpandedSources] = useState({});
  const [copiedMsgIdx, setCopiedMsgIdx] = useState(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    loadInitialData();
  }, []);

  useEffect(() => {
    if (initialDocId) {
      setSelectedDocId(initialDocId);
    }
  }, [initialDocId]);

  const loadInitialData = async () => {
    setFetchingChats(true);
    try {
      const [chatData, docData] = await Promise.all([
        api.getUserChats(),
        api.getDocuments()
      ]);
      setChats(chatData.chats || []);
      const processedDocs = (docData.documents || []).filter(d => d.status === 'processed');
      setDocuments(processedDocs);

      if (chatData.chats && chatData.chats.length > 0) {
        loadChatDetails(chatData.chats[0]._id);
      }
    } catch (err) {
      console.error('Failed to load chat history:', err);
    } finally {
      setFetchingChats(false);
    }
  };

  const loadChatDetails = async (id) => {
    try {
      setActiveChatId(id);
      const data = await api.getChatById(id);
      setMessages(data.chat.messages || []);
    } catch (err) {
      console.error('Failed to load chat session:', err);
    }
  };

  const handleNewChat = () => {
    setActiveChatId(null);
    setMessages([]);
    setInputQuestion('');
  };

  const handleDeleteChat = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this doubt session?')) return;
    try {
      await api.deleteChat(id);
      const remainingChats = chats.filter(c => c._id !== id);
      setChats(remainingChats);
      if (activeChatId === id) {
        if (remainingChats.length > 0) {
          loadChatDetails(remainingChats[0]._id);
        } else {
          handleNewChat();
        }
      }
    } catch (err) {
      console.error('Failed to delete chat:', err);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendQuestion = async (customPrompt) => {
    const questionText = customPrompt || inputQuestion;
    if (!questionText.trim() || loading) return;

    const userMessage = {
      sender: 'user',
      content: questionText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputQuestion('');
    setLoading(true);

    try {
      const assistantPlaceholder = {
        sender: 'assistant',
        content: '',
        sources: [],
        timestamp: new Date(),
        isStreaming: true
      };

      setMessages(prev => [...prev, assistantPlaceholder]);

      const response = await api.askQuestion(
        questionText,
        activeChatId || null, 
        selectedDocId ? [selectedDocId] : []
      );

      if (!activeChatId) {
        setActiveChatId(response.chatId);
        setChats(prev => [{ _id: response.chatId, title: response.title, documentIds: selectedDocId ? [selectedDocId] : [] }, ...prev]);
      }

      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0 && updated[lastIdx].sender === 'assistant') {
          updated[lastIdx] = {
            ...updated[lastIdx],
            content: response.answer,
            sources: response.sources || [],
            isStreaming: false
          };
        }
        return updated;
      });

    } catch (err) {
      console.error('Query failed:', err);
      setMessages(prev => {
        const updated = [...prev];
        const lastIdx = updated.length - 1;
        if (lastIdx >= 0 && updated[lastIdx].isStreaming) {
          updated[lastIdx] = {
            sender: 'assistant',
            content: `Apologies, unable to resolve doubt: ${err.message || 'Check if RAG service is reachable.'}`,
            sources: [],
            isStreaming: false,
            isError: true
          };
        } else {
          updated.push({
            sender: 'assistant',
            content: `Apologies, unable to resolve doubt: ${err.message || 'Check if RAG service is reachable.'}`,
            sources: [],
            isError: true
          });
        }
        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSources = (msgIndex) => {
    setExpandedSources(prev => ({
      ...prev,
      [msgIndex]: !prev[msgIndex]
    }));
  };

  const handleCopyText = (content, index) => {
    navigator.clipboard.writeText(content);
    setCopiedMsgIdx(index);
    setTimeout(() => setCopiedMsgIdx(null), 2000);
  };

  const studyModes = [
    {
      id: 'explain',
      title: 'Concept Explanation',
      icon: Lightbulb,
      desc: 'Deconstruct complex academic principles into clear, intuitive models.',
      prompt: 'Explain the core concepts from my study material in simple, clear terms.'
    },
    {
      id: 'summarize',
      title: 'Chapter Summary',
      icon: FileText,
      desc: 'Condense dense readings into structured study summaries.',
      prompt: 'Provide a structured summary of the key takeaways from this material.'
    },
    {
      id: 'exam_prep',
      title: 'Exam Preparation',
      icon: Target,
      desc: 'Identify critical exam concepts, formulas, and theorems.',
      prompt: 'What are the top 5 most important exam concepts covered in this material?'
    },
    {
      id: 'practice',
      title: 'Practice Questions',
      icon: HelpCircle,
      desc: 'Test retention with verified practice questions and answers.',
      prompt: 'Generate 3 practice questions with answers based on this study material.'
    },
    {
      id: 'ask_ai',
      title: 'Targeted Doubt',
      icon: MessageSquare,
      desc: 'Query specific chapters, pages, or theoretical concepts.',
      prompt: ''
    }
  ];

  const suggestionChips = [
    'Explain the core mechanism with an example',
    'Summarize this chapter and key theorems',
    'Generate flashcard questions with page sources',
    'Compare opposing theoretical models',
    'Provide practice questions with step-by-step solutions'
  ];

  const selectedDocObj = documents.find(d => d._id === selectedDocId);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 h-[calc(100vh-5.5rem)] flex gap-6 overflow-hidden text-[#0D0D0D]">
      
      {/* Sidebar: Sessions & Scope */}
      <aside className="w-80 flex-shrink-0 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[5px_5px_0px_#0D0D0D] flex flex-col p-4 space-y-4 overflow-hidden text-left hidden md:flex">
        
        {/* New Session Button */}
        <button
          onClick={handleNewChat}
          className="w-full py-2.5 px-4 bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[2px] hover:translate-y-[2px] text-xs font-bold uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Doubt Session</span>
        </button>

        {/* Selected Document Scope Dropdown */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-bold uppercase tracking-widest text-[#5C5853]">
            Document Context Scope
          </label>
          <select
            value={selectedDocId}
            onChange={(e) => setSelectedDocId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-[#ECE8E3] border-2 border-[#0D0D0D] text-[#0D0D0D] font-mono focus:outline-none shadow-[2px_2px_0px_#0D0D0D] transition-all truncate"
          >
            <option value="" className="bg-[#ECE8E3]">All Course Documents ({documents.length} files)</option>
            {documents.map((doc) => (
              <option key={doc._id} value={doc._id} className="bg-[#ECE8E3]">
                {doc.originalName}
              </option>
            ))}
          </select>
        </div>

        {/* Recent Doubt Sessions */}
        <div className="flex-1 flex flex-col overflow-hidden space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-widest text-[#5C5853] border-b border-[#C8C4BD] pb-1">
            Doubt History
          </span>
          
          <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
            {fetchingChats ? (
              <div className="text-xs text-[#5C5853] p-2 font-mono">Loading saved sessions...</div>
            ) : chats.length === 0 ? (
              <div className="text-xs text-[#8A857E] p-2 font-editorial italic">No recent doubts recorded</div>
            ) : (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => loadChatDetails(chat._id)}
                  className={`group flex items-center justify-between p-2.5 rounded-sm border-2 cursor-pointer text-xs transition-all ${
                    activeChatId === chat._id
                      ? 'bg-[#0D0D0D] text-[#ECE8E3] border-[#0D0D0D] shadow-[2px_2px_0px_#5C5853]'
                      : 'bg-[#ECE8E3] text-[#0D0D0D] border-[#C8C4BD] hover:border-[#0D0D0D]'
                  }`}
                >
                  <div className="flex items-center gap-2 overflow-hidden font-mono text-[11px]">
                    <MessageSquare className="w-3.5 h-3.5 flex-shrink-0" />
                    <span className="truncate">{chat.title}</span>
                  </div>
                  <button
                    onClick={(e) => handleDeleteChat(e, chat._id)}
                    className="opacity-0 group-hover:opacity-100 p-1 text-[#8A857E] hover:text-[#991B1B] transition-all"
                    title="Delete Chat"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

      </aside>

      {/* Main Doubt Solver Area */}
      <main className="flex-1 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[6px_6px_0px_#0D0D0D] flex flex-col overflow-hidden text-left">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b-2 border-[#0D0D0D] flex items-center justify-between bg-[#E2DED8]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] rounded-sm shadow-[2px_2px_0px_#5C5853]">
              <ScholarisIcon className="w-5 h-5 text-[#ECE8E3]" />
            </div>
            <div>
              <h2 className="text-base font-extrabold uppercase tracking-tight text-[#0D0D0D] font-display">
                Scholaris AI Doubt Solver
              </h2>
              <p className="text-xs text-[#5C5853] font-editorial italic">
                {selectedDocObj ? (
                  <span>Targeted Material: <strong className="text-[#0D0D0D]">{selectedDocObj.originalName}</strong></span>
                ) : (
                  <span>Synthesizing across all {documents.length} vectorized course documents</span>
                )}
              </p>
            </div>
          </div>

          <button
            onClick={handleNewChat}
            className="md:hidden px-3 py-1 bg-[#0D0D0D] text-[#ECE8E3] text-xs font-bold uppercase tracking-wider"
          >
            + New
          </button>
        </div>

        {/* Chat Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 ? (
            <div className="py-6 space-y-8 max-w-2xl mx-auto">
              
              {/* Mission Banner */}
              <div className="text-center space-y-2 border-b-2 border-[#0D0D0D] pb-6">
                <div className="inline-block px-3 py-1 bg-[#0D0D0D] text-[#ECE8E3] text-[9px] font-bold uppercase tracking-[0.25em]">
                  GROUNDED RAG PROTOCOL ACTIVE
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight text-[#0D0D0D] font-display">
                  What academic doubt do you want to resolve?
                </h3>
                <p className="text-xs text-[#5C5853] font-editorial italic max-w-md mx-auto">
                  Pose questions against your syllabus or uploaded materials. Answers are synthesized strictly from source documents with verifiable page citations.
                </p>
              </div>

              {/* Study Modes Grid */}
              <div className="space-y-3">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#5C5853] text-center">
                  Select Doubt Resolution Mode
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {studyModes.map((mode) => {
                    const IconComp = mode.icon;
                    return (
                      <button
                        key={mode.id}
                        onClick={() => {
                          if (mode.prompt) handleSendQuestion(mode.prompt);
                        }}
                        className="p-3.5 bg-[#ECE8E3] border-2 border-[#0D0D0D] text-left hover:bg-white hover:shadow-[3px_3px_0px_#0D0D0D] hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all flex flex-col justify-between space-y-2 group"
                      >
                        <div className="flex items-center gap-2 font-display text-xs font-bold uppercase text-[#0D0D0D]">
                          <IconComp className="w-4 h-4 text-[#0D0D0D]" />
                          <span>{mode.title}</span>
                        </div>
                        <p className="text-[11px] text-[#5C5853] font-editorial italic">
                          {mode.desc}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Prompt Chips */}
              <div className="space-y-2 pt-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5C5853] block text-center">
                  Quick Query Suggestions
                </span>
                <div className="flex flex-wrap gap-2 justify-center">
                  {suggestionChips.map((chip, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSendQuestion(chip)}
                      className="px-3 py-1.5 bg-[#ECE8E3] border border-[#0D0D0D] text-[11px] font-mono text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-[#ECE8E3] transition-colors"
                    >
                      {chip} →
                    </button>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 text-left ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'assistant' && (
                  <div className="w-8 h-8 bg-[#0D0D0D] text-[#ECE8E3] flex items-center justify-center rounded-sm flex-shrink-0 mt-1 shadow-[2px_2px_0px_#5C5853]">
                    <ScholarisIcon className="w-4 h-4 text-[#ECE8E3]" />
                  </div>
                )}

                <div
                  className={`max-w-2xl px-5 py-4 border-2 text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-[#0D0D0D] text-[#ECE8E3] border-[#0D0D0D] shadow-[3px_3px_0px_#5C5853] font-mono'
                      : 'bg-[#ECE8E3] text-[#0D0D0D] border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] space-y-3 font-editorial'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.content || (msg.isStreaming ? 'Searching vector space & generating grounded answer...' : '')}</div>

                  {/* Assistant response toolbar & Citations */}
                  {msg.sender === 'assistant' && (
                    <div className="pt-2.5 border-t border-[#C8C4BD] space-y-2">
                      <div className="flex items-center justify-between text-xs text-[#5C5853] font-mono">
                        {/* Source toggle */}
                        {msg.sources && msg.sources.length > 0 ? (
                          <button
                            onClick={() => toggleSources(index)}
                            className="flex items-center gap-1.5 text-[#0D0D0D] hover:underline font-bold uppercase tracking-wider"
                          >
                            <BookOpen className="w-3.5 h-3.5" />
                            <span>Document Citations ({msg.sources.length})</span>
                            {expandedSources[index] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wider text-[#5C5853]">100% Grounded Syllabus Attributions</span>
                        )}

                        {/* Copy button */}
                        <button
                          onClick={() => handleCopyText(msg.content, index)}
                          className="flex items-center gap-1 text-[#0D0D0D] hover:underline font-bold uppercase text-[10px]"
                          title="Copy Answer"
                        >
                          {copiedMsgIdx === index ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-[#059669]" />
                              <span className="text-[#059669]">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy</span>
                            </>
                          )}
                        </button>
                      </div>

                      {/* Expandable Citation Cards */}
                      {msg.sources && msg.sources.length > 0 && expandedSources[index] && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 font-mono">
                          {msg.sources.map((src, sIdx) => (
                            <div key={sIdx} className="p-2.5 bg-[#F5F2ED] border-2 border-[#0D0D0D] space-y-1">
                              <div className="text-[9px] text-[#5C5853] font-bold uppercase tracking-widest">Citation #{sIdx + 1}</div>
                              <div className="text-xs font-bold text-[#0D0D0D] truncate">{src.filename}</div>
                              <div className="text-[10px] text-[#5C5853]">
                                Page {src.page} {src.score && `• proximity ${(src.score * 100).toFixed(0)}%`}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {msg.sender === 'user' && (
                  <div className="w-8 h-8 bg-[#ECE8E3] border-2 border-[#0D0D0D] flex items-center justify-center text-[#0D0D0D] flex-shrink-0 mt-1 font-bold text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar Form */}
        <div className="p-4 border-t-2 border-[#0D0D0D] bg-[#E2DED8]">
          <form onSubmit={(e) => { e.preventDefault(); handleSendQuestion(); }} className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Ask an academic doubt based on your course documents..."
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              disabled={loading}
              className="flex-1 px-4 py-3 text-xs sm:text-sm bg-[#ECE8E3] border-2 border-[#0D0D0D] text-[#0D0D0D] placeholder-[#8A857E] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0D0D0D] font-mono transition-all"
            />
            <button
              type="submit"
              disabled={loading || !inputQuestion.trim()}
              className="px-6 py-3 bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[3px_3px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[2px] hover:translate-y-[2px] disabled:opacity-40 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider"
              title="Ask Doubt"
            >
              <span>Ask Doubt</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

      </main>

    </div>
  );
}
