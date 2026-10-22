import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import { ShieldCheck, KeyRound, Eye, EyeOff, ArrowRight, Lock, Sparkles } from 'lucide-react';

export const OwnerLogin: React.FC = () => {
  const { setOwnerSession, isOwner } = useAuth();
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState('');
  const [showPasscode, setShowPasscode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOwner) {
      navigate('/owner/dashboard', { replace: true });
    }
  }, [isOwner, navigate]);

  const handleOwnerAccess = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    // Enable direct store owner authentication session
    setTimeout(() => {
      setOwnerSession();
      setLoading(false);
      navigate('/owner/dashboard');
    }, 400);
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
            FORM &amp; FIT MANAGEMENT PORTAL
          </span>
          <h1 className="font-space font-extrabold text-2xl uppercase tracking-tight text-[#111111]">
            Store Owner Sign In
          </h1>
          <p className="text-xs text-[#111111]/60 font-sans leading-relaxed">
            Authorized administrative gateway to control products, pricing, inventory stock, customer orders, and store content.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-100 border border-red-400 text-red-800 text-xs font-space font-bold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleOwnerAccess} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-space font-bold uppercase text-[#111111]">
              Owner Access Passcode
            </label>
            <div className="relative">
              <input
                type={showPasscode ? 'text' : 'password'}
                placeholder="Enter store owner passcode..."
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
              <span className="animate-pulse">Verifying Credentials...</span>
            ) : (
              <>
                Access Owner Dashboard <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="pt-4 border-t border-[#111111]/10 text-center space-y-3">
          <button
            type="button"
            onClick={() => {
              setOwnerSession();
              navigate('/owner/dashboard');
            }}
            className="w-full py-2.5 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-wider border border-[#111111] hover:bg-[#111111] hover:text-[#C7F464] transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={14} /> Quick-Login as Store Owner
          </button>

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
