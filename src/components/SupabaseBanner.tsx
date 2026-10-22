import React, { useState } from 'react';
import { isSupabaseConfigured } from '../lib/supabase';
import { Database, CheckCircle2, AlertCircle, X, ExternalLink } from 'lucide-react';

export const SupabaseBanner: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const configured = isSupabaseConfigured();

  if (dismissed) return null;

  return (
    <>
      <div className={`text-xs py-2 px-4 flex items-center justify-between transition-colors ${
        configured ? 'bg-[#111111] text-[#C7F464]' : 'bg-[#111111] text-[#F7F6F2]'
      }`}>
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <Database size={14} className="shrink-0" />
          <span className="font-medium truncate">
            {configured ? (
              <span className="flex items-center gap-1.5">
                <CheckCircle2 size={13} className="text-[#C7F464]" />
                Connected to Live Supabase Backend &amp; Storage
              </span>
            ) : (
              <span className="flex items-center gap-1.5">
                <AlertCircle size={13} className="text-[#C8B9FF]" />
                Running in Browser-Database Mode. Connect Supabase for PostgreSQL &amp; Cloud Storage.
              </span>
            )}
          </span>
          <button
            onClick={() => setShowModal(true)}
            className="underline underline-offset-2 ml-2 hover:opacity-80 font-semibold cursor-pointer shrink-0"
          >
            {configured ? 'Database Info' : 'Setup Supabase'}
          </button>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:opacity-70 cursor-pointer ml-2"
          aria-label="Dismiss banner"
        >
          <X size={14} />
        </button>
      </div>

      {/* Instructions Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-[#111111]/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#F7F6F2] border border-[#111111] max-w-2xl w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 hover:bg-[#111111]/10 rounded-full cursor-pointer"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Database className="text-[#111111]" size={28} />
              <div>
                <h3 className="font-space font-bold text-xl uppercase tracking-wider text-[#111111]">
                  Supabase Integration
                </h3>
                <p className="text-xs text-[#111111]/60">
                  Form &amp; Fit Backend Configuration Status
                </p>
              </div>
            </div>

            <div className="space-y-4 text-sm text-[#111111]">
              <div className="p-3 bg-white border border-[#111111]/20 rounded-none">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs uppercase tracking-wider text-[#111111]/60">Status</span>
                  <span className={`px-2 py-0.5 text-xs font-bold uppercase tracking-widest ${
                    configured ? 'bg-[#C7F464] text-[#111111]' : 'bg-[#C8B9FF] text-[#111111]'
                  }`}>
                    {configured ? 'LIVE CONNECTED' : 'LOCAL TESTING MODE'}
                  </span>
                </div>
                <p className="text-xs text-[#111111]/80">
                  {configured
                    ? 'All products, storage uploads, orders, and authentication are syncing directly to your Supabase PostgreSQL cloud database.'
                    : 'Currently saving products and orders locally in your browser so you can test immediately! Add your keys below to enable cloud sync.'}
                </p>
              </div>

              <div>
                <h4 className="font-space font-bold uppercase text-xs tracking-wider mb-2">
                  To connect your Supabase project:
                </h4>
                <ol className="list-decimal list-inside space-y-2 text-xs leading-relaxed text-[#111111]/80">
                  <li>Run <code className="bg-[#E8E8E8] px-1 py-0.5 rounded font-mono">supabase/schema.sql</code> in your Supabase SQL Editor.</li>
                  <li>Create a public storage bucket named <code className="bg-[#E8E8E8] px-1 py-0.5 rounded font-mono">product-images</code>.</li>
                  <li>Set your environment variables in <code className="bg-[#E8E8E8] px-1 py-0.5 rounded font-mono">.env</code>:</li>
                </ol>
                <div className="mt-2 bg-[#111111] text-[#C7F464] p-3 font-mono text-xs overflow-x-auto">
                  VITE_SUPABASE_URL="https://your-project.supabase.co"<br />
                  VITE_SUPABASE_ANON_KEY="your-anon-public-key"
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors cursor-pointer"
                >
                  Close &amp; Continue
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
