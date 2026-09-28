import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { LogIn, UserPlus, AlertCircle, Lock, Mail, User, Compass, Orbit } from 'lucide-react';
import { VoyagerSpiralMark, AstronautIllustration } from './SpaceArt';

export default function AuthView() {
  const [isRegister, setIsRegister] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('student');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) throw new Error('Cadet/Officer full name is required');
        await register(name, email, password, role);
      } else {
        await login(email, password);
      }
    } catch (err) {
      setError(err.message || 'Mission authentication failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ECE8E3] py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center text-[#0D0D0D]">
      <div className="max-w-4xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Informational Column */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#0D0D0D] flex items-center justify-center text-[#ECE8E3]">
              <VoyagerSpiralMark className="w-6 h-6 text-[#ECE8E3]" />
            </div>
            <div>
              <span className="text-2xl font-extrabold tracking-[0.15em] text-[#0D0D0D] uppercase font-display">
                VOYAGER
              </span>
              <p className="text-[10px] text-[#5C5853] font-bold tracking-[0.2em] uppercase">
                Space Science &amp; Knowledge Archive
              </p>
            </div>
          </div>

          <h2 className="text-4xl font-extrabold uppercase tracking-tight text-[#0D0D0D] font-display leading-tight">
            Orbital Clearance &amp; Research Access
          </h2>

          <p className="text-sm text-[#33312E] font-editorial italic leading-relaxed">
            "Upload astronomical research, textbooks, and syllabus notes. Voyager indexes your universe and answers with millimeter-precise page citations."
          </p>

          <div className="p-4 bg-[#F5F2ED] border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#0D0D0D] space-y-2">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#5C5853]">System Status</div>
            <div className="text-xs font-bold text-[#0D0D0D]">384-DIMENSIONAL SENTENCE EMBEDDINGS ACTIVE</div>
            <div className="text-[11px] text-[#5C5853]">Vector Indexing Node: Pinecone Serverless Cluster</div>
          </div>
        </div>

        {/* Right Auth Card */}
        <div className="lg:col-span-6">
          <div className="bg-[#F5F2ED] border-2 border-[#0D0D0D] p-6 sm:p-8 shadow-[8px_8px_0px_#0D0D0D] space-y-5 text-left">
            <div className="space-y-1 border-b-2 border-[#0D0D0D] pb-3">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#5C5853]">MISSION PASS TERMINAL</span>
              <h3 className="text-xl font-bold uppercase tracking-tight text-[#0D0D0D] font-display">
                {isRegister ? 'Register Flight Credentials' : 'Enter Mission Key'}
              </h3>
            </div>

            {error && (
              <div className="p-3 bg-[#FEE2E2] border-2 border-[#991B1B] text-xs font-semibold text-[#991B1B]">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {isRegister && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]">Officer Full Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Sally Ride"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={isRegister}
                    className="w-full px-3.5 py-2.5 text-xs bg-[#ECE8E3] border-2 border-[#0D0D0D] text-[#0D0D0D] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0D0D0D] font-mono"
                  />
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]">Call-Sign (Email)</label>
                <input
                  type="email"
                  placeholder="explorer@voyager.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 text-xs bg-[#ECE8E3] border-2 border-[#0D0D0D] text-[#0D0D0D] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0D0D0D] font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]">Passcode</label>
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={6}
                  className="w-full px-3.5 py-2.5 text-xs bg-[#ECE8E3] border-2 border-[#0D0D0D] text-[#0D0D0D] focus:outline-none focus:bg-white shadow-[2px_2px_0px_#0D0D0D] font-mono"
                />
              </div>

              {isRegister && (
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-[#0D0D0D]">Role</label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-[#ECE8E3] border-2 border-[#0D0D0D] font-mono"
                  >
                    <option value="student">Flight Cadet</option>
                    <option value="instructor">Lead Commander</option>
                  </select>
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full py-3 px-4 text-xs font-bold uppercase tracking-[0.2em] bg-[#0D0D0D] text-[#ECE8E3] border-2 border-[#0D0D0D] shadow-[4px_4px_0px_#5C5853] hover:shadow-[1px_1px_0px_#5C5853] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2 mt-4"
              >
                {loading ? 'Verifying...' : isRegister ? 'Register Mission Pass' : 'Enter Observatory'}
              </button>
            </form>

            <div className="text-center pt-3 border-t border-[#C8C4BD] text-xs text-[#5C5853]">
              <button
                type="button"
                className="font-bold text-[#0D0D0D] uppercase tracking-wider underline"
                onClick={() => {
                  setIsRegister(!isRegister);
                  setError('');
                }}
              >
                {isRegister ? 'Log in with existing pass' : 'Create new mission clearance'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
