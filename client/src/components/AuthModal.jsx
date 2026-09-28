import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, LogIn, UserPlus, AlertCircle, Lock, Mail, User, GraduationCap } from 'lucide-react';
import { ScholarisIcon } from './ScholarisLogo';

export default function AuthModal({ isOpen, onClose, initialMode = 'login' }) {
  const [isRegister, setIsRegister] = useState(initialMode === 'signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  useEffect(() => {
    setIsRegister(initialMode === 'signup');
    setError('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Full name is required');
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#0D0D0D]/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-md bg-[#F5F2ED] border-2 border-[#0D0D0D] p-6 sm:p-8 shadow-[8px_8px_0px_#0D0D0D] space-y-6 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button 
          className="absolute top-5 right-5 p-1.5 text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-[#ECE8E3] border border-[#0D0D0D] transition-colors"
          onClick={onClose} 
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Brand Stamp Header */}
        <div className="space-y-2 border-b-2 border-[#0D0D0D] pb-5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3] rounded-sm">
              <ScholarisIcon className="w-5 h-5 text-[#ECE8E3]" />
            </div>
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#5C5853]">
                SCHOLARIS ACADEMIC GATEWAY
              </div>
              <h2 className="text-xl font-extrabold uppercase tracking-tight text-[#0D0D0D] font-display">
                {isRegister ? 'Create Scholar Account' : 'Log Into Scholaris'}
              </h2>
            </div>
          </div>
          <p className="text-xs text-[#5C5853] font-editorial italic leading-normal">
            {isRegister 
              ? 'Register to upload course textbooks, index syllabi, and resolve doubts with grounded AI.' 
              : 'Sign in with your academic credentials to access your document vault and saved doubt chats.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="flex items-center gap-2 p-3 text-xs text-[#0D0D0D] bg-[#FEE2E2] border-2 border-[#991B1B]">
            <AlertCircle className="w-4 h-4 text-[#991B1B] flex-shrink-0" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-3 w-4 h-4 text-[#5C5853]" />
                <input
                  type="text"
                  placeholder="e.g. Alex Johnson"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={isRegister}
                  className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#ECE8E3] border-2 border-[#0D0D0D] text-[#0D0D0D] placeholder-[#8A857E] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0D0D0D] transition-all font-mono"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]">Institutional / Academic Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 w-4 h-4 text-[#5C5853]" />
              <input
                type="email"
                placeholder="scholar@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#ECE8E3] border-2 border-[#0D0D0D] text-[#0D0D0D] placeholder-[#8A857E] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0D0D0D] transition-all font-mono"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 w-4 h-4 text-[#5C5853]" />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-[#ECE8E3] border-2 border-[#0D0D0D] text-[#0D0D0D] placeholder-[#8A857E] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0D0D0D] transition-all font-mono"
              />
            </div>
          </div>

          {isRegister && (
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]">Academic Role</label>
              <select 
                value={role} 
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#ECE8E3] border-2 border-[#0D0D0D] text-[#0D0D0D] focus:outline-none shadow-[2px_2px_0px_#0D0D0D] font-mono"
              >
                <option value="student">Student Scholar</option>
                <option value="instructor">Faculty Mentor / Instructor</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-3 px-4 text-xs font-bold uppercase tracking-[0.2em] bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 mt-4"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-[#ECE8E3]/30 border-t-[#ECE8E3] rounded-full animate-spin"></span>
            ) : isRegister ? (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Scholar Account</span>
              </>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In To Workspace</span>
              </>
            )}
          </button>
        </form>

        {/* Switch mode */}
        <div className="text-center pt-3 border-t border-[#C8C4BD] text-xs text-[#5C5853]">
          <span>{isRegister ? 'Already registered? ' : 'New to Scholaris? '}</span>
          <button
            type="button"
            className="font-bold text-[#0D0D0D] uppercase tracking-wider underline hover:text-[#5C5853] ml-1"
            onClick={() => {
              setIsRegister(!isRegister);
              setError('');
            }}
          >
            {isRegister ? 'Sign in' : 'Create an account'}
          </button>
        </div>

      </div>
    </div>
  );
}
