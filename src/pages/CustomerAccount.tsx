import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import {
  User,
  ShoppingBag,
  Truck,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

export const CustomerAccount: React.FC = () => {
  const { id: orderNumberParam } = useParams<{ id?: string }>();
  const { orders, wishlist } = useStore();
  const { user, logout, isOwner } = useAuth();

  const [activeTab, setActiveTab] = useState<'orders' | 'profile'>('orders');

  // Filter orders by email if user is logged in
  const userOrders = user
    ? orders.filter((o) => o.customer_email.toLowerCase() === user.email.toLowerCase() || o.user_id === user.id)
    : orders;

  // Selected single order detail view
  const singleOrder = orderNumberParam
    ? orders.find((o) => o.order_number === orderNumberParam || o.id === orderNumberParam)
    : null;

  if (singleOrder) {
    const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = statusSteps.indexOf(singleOrder.status);

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        <div className="flex justify-between items-center border-b border-[#111111]/15 pb-4">
          <div>
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
              Order Confirmation &amp; Tracking
            </span>
            <h1 className="font-space font-extrabold text-2xl uppercase text-[#111111]">
              Order #{singleOrder.order_number}
            </h1>
          </div>
          <Link
            to="/account"
            className="text-xs font-space font-bold uppercase underline hover:text-[#C7F464]"
          >
            ← Back To All Orders
          </Link>
        </div>

        {/* Order Status Timeline Banner */}
        <div className="bg-[#111111] text-[#F7F6F2] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] uppercase font-space tracking-widest text-[#C7F464]">
                Fulfillment Status
              </span>
              <h2 className="font-space font-bold text-lg uppercase text-white">
                {singleOrder.status.toUpperCase()}
              </h2>
            </div>
            <div className="text-right text-xs">
              <p className="text-white/60">Placed on:</p>
              <p className="font-mono">{new Date(singleOrder.created_at).toLocaleDateString('en-IN')}</p>
            </div>
          </div>

          {/* Timeline Bar */}
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-space uppercase pt-2">
            {statusSteps.map((step, idx) => {
              const isCompleted = idx <= currentStepIndex;
              return (
                <div key={step} className="space-y-1">
                  <div
                    className={`h-2 transition-colors ${
                      isCompleted ? 'bg-[#C7F464]' : 'bg-white/20'
                    }`}
                  />
                  <span className={isCompleted ? 'text-[#C7F464] font-bold' : 'text-white/40'}>
                    {step}
                  </span>
                </div>
              );
            })}
          </div>

          {singleOrder.tracking_number && (
            <div className="p-3 bg-white/10 text-xs font-mono flex items-center justify-between">
              <span>Courier Tracking ID: <strong>{singleOrder.tracking_number}</strong></span>
              <span className="text-[#C7F464] uppercase text-[10px]">Tracked Live</span>
            </div>
          )}
        </div>

        {/* Order Summary & Delivery Address */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#111111]/15 p-5 space-y-3">
            <h3 className="font-space font-bold text-xs uppercase border-b border-[#111111]/10 pb-2 flex items-center gap-2">
              <MapPin size={14} /> Shipping Address
            </h3>
            <div className="text-xs text-[#111111]/80 space-y-1 font-sans">
              <p className="font-bold">{singleOrder.shipping_address.full_name}</p>
              <p>{singleOrder.shipping_address.line1}</p>
              {singleOrder.shipping_address.line2 && <p>{singleOrder.shipping_address.line2}</p>}
              <p>
                {singleOrder.shipping_address.city}, {singleOrder.shipping_address.state} -{' '}
                <span className="font-mono">{singleOrder.shipping_address.postal_code}</span>
              </p>
              <p className="pt-1 font-mono">Phone: {singleOrder.customer_phone}</p>
            </div>
          </div>

          <div className="bg-white border border-[#111111]/15 p-5 space-y-3">
            <h3 className="font-space font-bold text-xs uppercase border-b border-[#111111]/10 pb-2">
              Payment &amp; Financials
            </h3>
            <div className="text-xs space-y-1.5 font-space">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold uppercase">{singleOrder.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span className={`font-bold uppercase ${singleOrder.payment_status === 'paid' ? 'text-green-700' : 'text-amber-700'}`}>
                  {singleOrder.payment_status}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#111111]/10 text-sm font-bold">
                <span>Total Amount Paid:</span>
                <span>₹{singleOrder.total_amount.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Line Items */}
        <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
          <h3 className="font-space font-bold text-sm uppercase tracking-wider border-b border-[#111111]/10 pb-3">
            Purchased Apparel Items ({singleOrder.items?.length || 0})
          </h3>

          <div className="divide-y divide-[#111111]/10">
            {singleOrder.items?.map((item) => (
              <div key={item.id} className="py-3 flex justify-between items-center text-xs">
                <div>
                  <p className="font-space font-bold text-sm text-[#111111]">{item.product_name}</p>
                  <p className="text-[#111111]/60 font-mono text-[11px]">
                    {item.size ? `Size: ${item.size}` : ''} {item.color ? `• Color: ${item.color}` : ''} • Qty: {item.quantity}
                  </p>
                </div>
                <span className="font-space font-bold text-sm">
                  ₹{item.total_price.toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#111111]/15 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
            Form &amp; Fit Customer Portal
          </span>
          <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
            My Account &amp; Order History
          </h1>
        </div>

        {isOwner && (
          <Link
            to="/owner/dashboard"
            className="px-4 py-2 bg-[#111111] text-[#C7F464] font-space text-xs uppercase font-bold flex items-center gap-2"
          >
            <ShieldCheck size={16} /> Switch to Owner Admin Panel
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Account Sidebar Navigation */}
        <div className="bg-white border border-[#111111]/15 p-5 space-y-4 self-start">
          <div className="border-b border-[#111111]/10 pb-3">
            <p className="font-space font-bold text-sm text-[#111111]">{user?.full_name || 'Valued Customer'}</p>
            <p className="text-xs text-[#111111]/60 truncate font-sans">{user?.email || 'Guest Session'}</p>
          </div>

          <div className="space-y-1 text-xs font-space uppercase">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left py-2 px-3 flex items-center justify-between cursor-pointer ${
                activeTab === 'orders' ? 'bg-[#111111] text-[#C7F464] font-bold' : 'hover:bg-[#F7F6F2] text-[#111111]'
              }`}
            >
              <span>My Orders ({userOrders.length})</span>
              <ChevronRight size={14} />
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left py-2 px-3 flex items-center justify-between cursor-pointer ${
                activeTab === 'profile' ? 'bg-[#111111] text-[#C7F464] font-bold' : 'hover:bg-[#F7F6F2] text-[#111111]'
              }`}
            >
              <span>Profile Details</span>
              <ChevronRight size={14} />
            </button>
            <Link
              to="/wishlist"
              className="w-full text-left py-2 px-3 flex items-center justify-between hover:bg-[#F7F6F2] text-[#111111] cursor-pointer"
            >
              <span>My Saved Wishlist ({wishlist.length})</span>
              <ChevronRight size={14} />
            </Link>
          </div>

          {user && (
            <button
              onClick={logout}
              className="w-full mt-4 py-2 bg-red-50 text-red-700 font-space text-xs uppercase font-bold hover:bg-red-100 transition-colors cursor-pointer"
            >
              Log Out Session
            </button>
          )}
        </div>

        {/* Main Panel */}
        <div className="md:col-span-3 space-y-6">
          {activeTab === 'orders' && (
            <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
              <h3 className="font-space font-bold text-sm uppercase tracking-wider border-b border-[#111111]/10 pb-3">
                Order History &amp; Live Tracking
              </h3>

              {userOrders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <ShoppingBag size={36} className="mx-auto text-[#111111]/30" />
                  <p className="font-space font-bold uppercase text-sm">No Recent Orders Found</p>
                  <p className="text-xs text-[#111111]/60 font-sans max-w-xs mx-auto">
                    You haven't placed any orders yet. Discover our collection of apparel and custom prints.
                  </p>
                  <Link
                    to="/shop"
                    className="inline-block px-6 py-2.5 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
                  >
                    Shop Collection
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[#111111]/10">
                  {userOrders.map((ord) => (
                    <div key={ord.id} className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-space font-extrabold text-sm text-[#111111]">
                            Order #{ord.order_number}
                          </span>
                          <span className="px-2 py-0.5 bg-[#111111] text-[#C7F464] font-space text-[10px] font-bold uppercase">
                            {ord.status}
                          </span>
                        </div>
                        <p className="text-xs text-[#111111]/60 font-mono">
                          Placed: {new Date(ord.created_at).toLocaleDateString('en-IN')} • {ord.items?.length || 0} item(s)
                        </p>
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="font-space font-bold text-base text-[#111111]">
                          ₹{ord.total_amount.toLocaleString('en-IN')}
                        </span>
                        <Link
                          to={`/account/orders/${ord.order_number}`}
                          className="px-4 py-2 bg-[#F7F6F2] border border-[#111111] text-[#111111] font-space text-xs uppercase font-bold hover:bg-[#111111] hover:text-[#F7F6F2] transition-colors"
                        >
                          View Tracking
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
              <h3 className="font-space font-bold text-sm uppercase tracking-wider border-b border-[#111111]/10 pb-3">
                Profile Preferences
              </h3>

              <div className="space-y-3 text-xs font-sans">
                <div>
                  <label className="font-space font-bold uppercase text-[#111111]/60 block">Full Name</label>
                  <p className="font-semibold text-sm text-[#111111]">{user?.full_name || 'Not provided'}</p>
                </div>
                <div>
                  <label className="font-space font-bold uppercase text-[#111111]/60 block">Email Address</label>
                  <p className="font-semibold text-sm text-[#111111]">{user?.email || 'Not provided'}</p>
                </div>
                <div>
                  <label className="font-space font-bold uppercase text-[#111111]/60 block">Account Role</label>
                  <span className="inline-block bg-[#111111] text-[#C7F464] font-space font-bold text-[10px] uppercase px-2 py-0.5 mt-1">
                    {user?.role || 'Customer'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
