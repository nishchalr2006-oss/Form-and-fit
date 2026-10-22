import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { OwnerLayout } from '../../components/OwnerLayout';
import { OrderStatus, PaymentStatus } from '../../types';
import { ShoppingBag, Truck, CheckCircle2, Search, ExternalLink } from 'lucide-react';

export const OwnerOrders: React.FC = () => {
  const { orders, updateOrderStatus, updatePaymentStatus } = useStore();
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [trackingInputs, setTrackingInputs] = useState<{ [orderId: string]: string }>({});

  const filteredOrders = orders.filter((o) => {
    if (filterStatus && o.status !== filterStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.order_number.toLowerCase().includes(q);
      const matchEmail = o.customer_email.toLowerCase().includes(q);
      const matchName = o.shipping_address.full_name.toLowerCase().includes(q);
      if (!matchNum && !matchEmail && !matchName) return false;
    }
    return true;
  });

  const handleTrackingUpdate = (orderId: string, currentStatus: OrderStatus) => {
    const trackingNum = trackingInputs[orderId] || '';
    updateOrderStatus(orderId, currentStatus === 'pending' ? 'shipped' : currentStatus, trackingNum);
  };

  return (
    <OwnerLayout>
      <div className="space-y-6">
        <div className="border-b border-[#111111]/15 pb-4">
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
            Fulfillment Center
          </span>
          <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
            Customer Order Management ({orders.length})
          </h1>
        </div>

        {/* Filter Controls */}
        <div className="bg-white border border-[#111111]/15 p-4 flex flex-col sm:flex-row gap-4 justify-between items-center text-xs">
          <div className="relative flex-1 w-full max-w-md">
            <input
              type="text"
              placeholder="Search order number, customer email, name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#F7F6F2] border border-[#111111] px-3 py-2 pl-8 text-xs focus:outline-none"
            />
            <Search size={14} className="absolute left-2.5 top-2.5 text-[#111111]/40" />
          </div>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-white border border-[#111111] px-3 py-2 font-space uppercase text-xs focus:outline-none cursor-pointer"
          >
            <option value="">All Fulfillment Statuses</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Orders Table */}
        <div className="bg-white border border-[#111111]/15">
          {filteredOrders.length === 0 ? (
            <div className="text-center py-16 text-xs text-[#111111]/60 font-sans p-6">
              <ShoppingBag size={36} className="mx-auto text-[#111111]/30 mb-2" />
              No customer orders match your search filters.
            </div>
          ) : (
            <div className="divide-y divide-[#111111]/10">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="p-6 space-y-4 hover:bg-[#F7F6F2]/50 transition-colors">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-[#111111]/10 pb-3">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-space font-extrabold text-base text-[#111111]">
                          Order #{ord.order_number}
                        </span>
                        <span className="text-xs font-mono text-[#111111]/60">
                          {new Date(ord.created_at).toLocaleString('en-IN')}
                        </span>
                      </div>
                      <p className="text-xs text-[#111111]/70 font-sans">
                        Customer: <strong className="text-[#111111]">{ord.shipping_address.full_name}</strong> ({ord.customer_email}) • Phone: {ord.customer_phone}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="font-space font-extrabold text-lg text-[#111111]">
                        ₹{ord.total_amount.toLocaleString('en-IN')}
                      </span>
                      <span className="block text-[10px] font-mono text-[#111111]/50 uppercase">
                        Method: {ord.payment_method}
                      </span>
                    </div>
                  </div>

                  {/* Address & Line Items Summary */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-sans">
                    <div className="bg-[#F7F6F2] p-3 border border-[#111111]/10 space-y-1">
                      <span className="font-space font-bold uppercase text-[10px] text-[#111111]/60 block">
                        Shipping Address:
                      </span>
                      <p>{ord.shipping_address.line1}, {ord.shipping_address.city}, {ord.shipping_address.state} - {ord.shipping_address.postal_code}</p>
                    </div>

                    <div className="bg-[#F7F6F2] p-3 border border-[#111111]/10 space-y-1">
                      <span className="font-space font-bold uppercase text-[10px] text-[#111111]/60 block">
                        Ordered Items ({ord.items?.length || 0}):
                      </span>
                      <div className="space-y-0.5 max-h-24 overflow-y-auto">
                        {ord.items?.map((item, idx) => (
                          <p key={idx} className="font-medium truncate">
                            {item.quantity}x {item.product_name} {item.size ? `(${item.size})` : ''} - ₹{item.total_price}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <span className="text-xs font-space font-bold uppercase">Status:</span>
                      <select
                        value={ord.status}
                        onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                        className="bg-white border border-[#111111] px-3 py-1.5 font-space text-xs font-bold uppercase cursor-pointer"
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>

                      <select
                        value={ord.payment_status}
                        onChange={(e) => updatePaymentStatus(ord.id, e.target.value as PaymentStatus)}
                        className={`border px-3 py-1.5 font-space text-xs font-bold uppercase cursor-pointer ${
                          ord.payment_status === 'paid' ? 'bg-green-100 border-green-400 text-green-900' : 'bg-amber-100 border-amber-400 text-amber-900'
                        }`}
                      >
                        <option value="unpaid">UNPAID</option>
                        <option value="paid">PAID</option>
                        <option value="refunded">REFUNDED</option>
                      </select>
                    </div>

                    {/* Courier Tracking */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <input
                        type="text"
                        placeholder="Courier Tracking #"
                        defaultValue={ord.tracking_number || ''}
                        onChange={(e) =>
                          setTrackingInputs((prev) => ({ ...prev, [ord.id]: e.target.value }))
                        }
                        className="bg-[#F7F6F2] border border-[#111111] px-2.5 py-1 text-xs font-mono w-40"
                      />
                      <button
                        onClick={() => handleTrackingUpdate(ord.id, ord.status)}
                        className="px-3 py-1 bg-[#111111] text-[#C7F464] font-space text-xs uppercase font-bold hover:bg-[#C7F464] hover:text-[#111111] transition-colors cursor-pointer"
                      >
                        Save Courier Info
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </OwnerLayout>
  );
};
