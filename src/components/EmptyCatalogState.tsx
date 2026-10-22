import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, PlusCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface EmptyCatalogStateProps {
  title?: string;
  description?: string;
}

export const EmptyCatalogState: React.FC<EmptyCatalogStateProps> = ({
  title = 'Catalog Under Curation',
  description = 'Our store owner is uploading our inaugural collection. Products will appear here as soon as they are published by the store owner.',
}) => {
  const { isAdmin } = useAuth();

  return (
    <div className="max-w-3xl mx-auto my-12 p-8 sm:p-12 bg-white border border-[#111111] text-center shadow-lg">
      <div className="w-16 h-16 mx-auto mb-4 bg-[#111111] text-[#C7F464] flex items-center justify-center rounded-none">
        <ShoppingBag size={32} />
      </div>

      <span className="font-space font-extrabold tracking-widest text-xs uppercase text-[#111111]/50 block mb-1">
        FORM &amp; FIT STORE
      </span>

      <h3 className="font-space font-bold text-2xl uppercase tracking-tight text-[#111111] mb-3">
        {title}
      </h3>

      <p className="text-sm text-[#111111]/70 max-w-lg mx-auto leading-relaxed mb-6 font-sans">
        {description}
      </p>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        {isAdmin ? (
          <Link
            to="/owner/products/new"
            className="w-full sm:w-auto px-6 py-3 bg-[#111111] text-[#C7F464] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center justify-center gap-2"
          >
            <PlusCircle size={16} /> Upload First Product Now
          </Link>
        ) : (
          <Link
            to="/owner/login"
            className="w-full sm:w-auto px-6 py-3 bg-[#111111] text-[#F7F6F2] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center justify-center gap-2"
          >
            <ShieldCheck size={16} /> Owner Login to Add Products
          </Link>
        )}

        <Link
          to="/custom-studio"
          className="w-full sm:w-auto px-6 py-3 bg-[#E8E8E8] text-[#111111] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-[#F7F6F2] transition-colors border border-[#111111]"
        >
          Try Custom T-Shirt Studio
        </Link>
      </div>
    </div>
  );
};
