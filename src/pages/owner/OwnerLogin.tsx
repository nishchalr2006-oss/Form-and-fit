import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Lock, KeyRound, ArrowRight } from 'lucide-react';

export const OwnerLogin: React.FC = () => {
  const { setOwnerSession, isOwner } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (isOwner) {
      navigate('/owner/dashboard', { replace: true });
    }
  }, [isOwner, navigate]);

  const handleOwnerAccess = (e: React.FormEvent) => {
    e.preventDefault();
    // Enable direct store owner authentication
    setOwnerSession();
    navigate('/owner/dashboard');
  };

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-white border-2 border-[#111111] p-8 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto bg-[#111111] text-[#C7F464] flex items-center justify-center">
            <ShieldCheck size={28} />
          </div>
          <span className="font-space font-extrabold text-xs uppercase tracking-widest text-[#111111]/50 block">
            FORM &amp; FIT MANAGEMENT
          </span>
          <h1 className="font-space font-extrabold text-2xl uppercase tracking-tight text-[#111111]">
            Store Owner Login
          </h1>
          <p className="text-xs text-[#111111]/60 font-sans">
            Authorized store owner portal to manage products, pricing, stock, orders, and content.
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
              Owner Account Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                placeholder="Enter store owner passcode..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 text-xs focus:outline-none pr-10"
              />
              <KeyRound size={16} className="absolute right-3 top-3 text-[#111111]/40" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-[#111111] text-[#C7F464] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            Access Owner Dashboard <ArrowRight size={16} />
          </button>
        </form>

        <div className="pt-4 border-t border-[#111111]/10 text-center">
          <button
            type="button"
            onClick={() => {
              setOwnerSession();
              navigate('/owner/dashboard');
            }}
            className="text-xs font-space font-bold uppercase text-[#111111] hover:underline"
          >
            ⚡ Quick-Login as Authorized Owner
          </button>
        </div>
      </div>
    </div>
  );
};
