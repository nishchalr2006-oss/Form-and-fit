import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, KeyRound, Eye, EyeOff, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export const OwnerLogin: React.FC = () => {
  const { authenticateOwner, isOwner } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('admin@formandfit.in');
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOwner) {
      navigate('/owner/dashboard', { replace: true });
    }
  }, [isOwner, navigate]);

  const handleOwnerAccess = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !passcode.trim()) {
      setErrorMsg('Please enter both Admin Email and Passcode.');
      return;
    }

    setLoading(true);
    setErrorMsg('');

    const res = await authenticateOwner(email.trim(), passcode.trim());
    setLoading(false);

    if (res.success) {
      navigate('/owner/dashboard');
    } else {
      setErrorMsg(res.message || 'Access Denied: Invalid Admin Credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111111] font-sans flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-md w-full bg-white border-2 border-[#111111] p-8 shadow-2xl space-y-6 relative overflow-hidden"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-[#111111] text-[#C7F464] flex items-center justify-center shadow-lg">
            <ShieldCheck size={32} />
          </div>
          <span className="font-space font-extrabold text-[10px] uppercase tracking-widest text-[#111111]/50 block">
            FORM &amp; FIT SECURE ADMIN PORTAL
          </span>
          <h1 className="font-space font-extrabold text-2xl uppercase tracking-tight text-[#111111]">
            Store Admin Authentication
          </h1>
          <p className="text-xs text-[#111111]/60 font-sans leading-relaxed">
            Restricted access. Only approved store administrators with valid credentials can access store management controls.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-800 text-xs font-space font-bold flex items-center gap-2">
            <AlertCircle size={16} className="shrink-0 text-red-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleOwnerAccess} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-space font-bold uppercase text-[#111111]">
              Admin Username / Email
            </label>
            <div className="relative">
              <input
                type="email"
                required
                placeholder="admin@formandfit.in"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 pl-9 text-xs focus:outline-none focus:ring-1 focus:ring-[#111111]"
              />
              <Mail size={16} className="absolute left-2.5 top-3 text-[#111111]/40" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-space font-bold uppercase text-[#111111]">
              Admin Passcode
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                required
                placeholder="Enter Admin Passcode..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 pl-9 pr-10 text-xs focus:outline-none focus:ring-1 focus:ring-[#111111]"
              />
              <KeyRound size={16} className="absolute left-2.5 top-3 text-[#111111]/40" />
              <button
                type="button"
                onClick={() => setShowPasscode(!showPasscode)}
                className="absolute right-2.5 top-3 text-[#111111]/50 hover:text-[#111111] cursor-pointer"
              >
                {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-[#111111] text-[#C7F464] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {loading ? (
              <span className="animate-pulse">Authenticating Admin...</span>
            ) : (
              <>
                Log In To Admin Panel <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#111111]/10 text-center">
          <Link
            to="/"
            className="text-xs font-space font-bold uppercase text-[#111111]/60 hover:text-[#111111] block"
          >
            ← Return To Customer Storefront
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
