import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OwnerLayout } from '../../components/OwnerLayout';
import { Ticket, Plus, Trash2 } from 'lucide-react';

export const OwnerCoupons: React.FC = () => {
  const { coupons } = useStore();
  const [code, setCode] = useState('');
  const [type, setType] = useState<'fixed' | 'percentage'>('percentage');
  const [val, setVal] = useState<number>(10);
  const [minOrder, setMinOrder] = useState<number>(999);

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div className="border-b border-[#111111]/15 pb-4">
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
            Promotions &amp; Discounts
          </span>
          <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
            Promo Coupon Codes
          </h1>
        </div>

        <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
          <h3 className="font-space font-bold text-xs uppercase flex items-center gap-2 border-b border-[#111111]/10 pb-3">
            <Ticket size={16} /> Active Promo Codes ({coupons.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {coupons.map((c) => (
              <div key={c.id} className="p-4 bg-[#C7F464]/20 border border-[#111111] space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-mono font-extrabold text-lg text-[#111111]">{c.code}</span>
                  <span className="px-2 py-0.5 bg-[#111111] text-[#C7F464] font-space text-[10px] font-bold uppercase">
                    ACTIVE
                  </span>
                </div>
                <p className="text-xs font-space font-bold text-[#111111]">
                  Discount: {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `₹${c.discount_value} OFF`}
                </p>
                <p className="text-[11px] text-[#111111]/70 font-sans">
                  Min order amount: ₹{c.min_order_amount} • Used {c.times_used} times
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </OwnerLayout>
  );
};
