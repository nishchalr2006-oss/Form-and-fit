import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CustomerAuth } from './CustomerAuth';
import { ShippingAddress } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  ShoppingBag,
  Truck,
  MapPin,
  Heart,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ChevronRight,
  LogOut,
  Edit2,
  Plus,
  Trash2,
  Save,
  Lock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

export const CustomerAccount: React.FC = () => {
  const { id: orderNumberParam } = useParams<{ id?: string }>();
  const { orders, wishlist, addToCart, removeFromCart } = useStore();
  const { user, logout, updateProfile, isOwner } = useAuth();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'addresses' | 'wishlist'>('orders');

  // Edit Profile Form
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMessage, setProfileMessage] = useState<string | null>(null);

  // Address State
  const [savedAddresses, setSavedAddresses] = useState<ShippingAddress[]>([
    {
      full_name: user?.full_name || 'Valued Member',
      phone: user?.phone || '+91 98765 43210',
      line1: 'Flat 402, Sunshine Heights',
      line2: 'Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      postal_code: '400050',
      country: 'India',
    },
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    full_name: user?.full_name || '',
    phone: user?.phone || '',
    line1: '',
    line2: '',
    city: '',
    state: 'Maharashtra',
    postal_code: '',
    country: 'India',
  });

  if (!user) {
    return <CustomerAuth />;
  }

  // Filter user orders
  const userOrders = orders.filter(
    (o) => o.customer_email.toLowerCase() === user.email.toLowerCase() || o.user_id === user.id
  );

  // Selected single order detail view
  const singleOrder = orderNumberParam
    ? orders.find((o) => o.order_number === orderNumberParam || o.id === orderNumberParam)
    : null;

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile({ full_name: fullName.trim(), phone: phone.trim() });
    setProfileMessage('Profile updated successfully!');
    setTimeout(() => setProfileMessage(null), 3000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.line1 || !newAddress.city || !newAddress.postal_code) return;
    setSavedAddresses((prev) => [...prev, newAddress]);
    setShowAddressForm(false);
    setNewAddress({
      full_name: user.full_name || '',
      phone: user.phone || '',
      line1: '',
      line2: '',
      city: '',
      state: 'Maharashtra',
      postal_code: '',
      country: 'India',
    });
  };

  if (singleOrder) {
    const statusSteps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentStepIndex = Math.max(0, statusSteps.indexOf(singleOrder.status));

    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
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
            className="text-xs font-space font-bold uppercase underline hover:text-[#C7F464] flex items-center gap-1"
          >
            ← Back To Orders
          </Link>
        </div>

        {/* Status Banner */}
        <div className="bg-[#111111] text-[#F7F6F2] p-6 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
            <div>
              <span className="text-[10px] uppercase font-space tracking-widest text-[#C7F464]">
                Fulfillment Status
              </span>
              <h2 className="font-space font-bold text-xl uppercase text-white">
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
            <div className="p-3 bg-white/10 text-xs font-mono flex items-center justify-between border border-white/20">
              <span>Courier Tracking ID: <strong>{singleOrder.tracking_number}</strong></span>
              <span className="text-[#C7F464] uppercase text-[10px] font-bold flex items-center gap-1">
                <Sparkles size={12} /> Live Tracked
              </span>
            </div>
          )}
        </div>

        {/* Address & Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white border border-[#111111]/15 p-5 space-y-3">
            <h3 className="font-space font-bold text-xs uppercase border-b border-[#111111]/10 pb-2 flex items-center gap-2">
              <MapPin size={14} /> Shipping Destination
            </h3>
            <div className="text-xs text-[#111111]/80 space-y-1">
              <p className="font-bold text-[#111111]">{singleOrder.shipping_address.full_name}</p>
              <p>{singleOrder.shipping_address.line1}</p>
              {singleOrder.shipping_address.line2 && <p>{singleOrder.shipping_address.line2}</p>}
              <p>
                {singleOrder.shipping_address.city}, {singleOrder.shipping_address.state} -{' '}
                <span className="font-mono">{singleOrder.shipping_address.postal_code}</span>
              </p>
              <p className="pt-1 font-mono text-[#111111]/60">Phone: {singleOrder.customer_phone}</p>
            </div>
          </div>

          <div className="bg-white border border-[#111111]/15 p-5 space-y-3">
            <h3 className="font-space font-bold text-xs uppercase border-b border-[#111111]/10 pb-2">
              Payment Breakdown
            </h3>
            <div className="text-xs space-y-1.5 font-space">
              <div className="flex justify-between">
                <span>Payment Method:</span>
                <span className="font-bold uppercase">{singleOrder.payment_method}</span>
              </div>
              <div className="flex justify-between">
                <span>Payment Status:</span>
                <span
                  className={`font-bold uppercase ${
                    singleOrder.payment_status === 'paid' ? 'text-green-700' : 'text-amber-700'
                  }`}
                >
                  {singleOrder.payment_status}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-[#111111]/10 text-sm font-bold text-[#111111]">
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
                <span className="font-space font-bold text-sm text-[#111111]">
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 font-sans">
      {/* Editorial Header */}
      <div className="border-b border-[#111111]/15 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
            Form &amp; Fit Member Portal
          </span>
          <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
            Welcome, {user.full_name || 'Valued Member'}
          </h1>
        </div>

        {isOwner && (
          <Link
            to="/owner/dashboard"
            className="px-4 py-2 bg-[#111111] text-[#C7F464] font-space text-xs uppercase font-bold flex items-center gap-2 hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
          >
            <ShieldCheck size={16} /> Owner Admin Panel
          </Link>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <div className="md:col-span-3 bg-white border border-[#111111]/15 p-5 space-y-4">
          <div className="border-b border-[#111111]/10 pb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-[#111111] text-[#C7F464] flex items-center justify-center font-space font-bold text-sm uppercase">
                {(user.full_name || user.email).charAt(0)}
              </div>
              <div className="truncate">
                <p className="font-space font-bold text-sm text-[#111111] truncate">{user.full_name || 'Member'}</p>
                <p className="text-[11px] text-[#111111]/60 truncate font-mono">{user.email}</p>
              </div>
            </div>
          </div>

          <div className="space-y-1 font-space text-xs font-bold uppercase">
            <button
              onClick={() => setActiveTab('orders')}
              className={`w-full text-left py-2.5 px-3 flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'orders'
                  ? 'bg-[#111111] text-[#C7F464]'
                  : 'text-[#111111]/80 hover:bg-[#F7F6F2]'
              }`}
            >
              <span className="flex items-center gap-2">
                <ShoppingBag size={15} /> My Orders ({userOrders.length})
              </span>
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full text-left py-2.5 px-3 flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#111111] text-[#C7F464]'
                  : 'text-[#111111]/80 hover:bg-[#F7F6F2]'
              }`}
            >
              <span className="flex items-center gap-2">
                <User size={15} /> Profile &amp; Contact
              </span>
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`w-full text-left py-2.5 px-3 flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'addresses'
                  ? 'bg-[#111111] text-[#C7F464]'
                  : 'text-[#111111]/80 hover:bg-[#F7F6F2]'
              }`}
            >
              <span className="flex items-center gap-2">
                <MapPin size={15} /> Saved Addresses
              </span>
              <ChevronRight size={14} />
            </button>

            <button
              onClick={() => setActiveTab('wishlist')}
              className={`w-full text-left py-2.5 px-3 flex items-center justify-between transition-colors cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-[#111111] text-[#C7F464]'
                  : 'text-[#111111]/80 hover:bg-[#F7F6F2]'
              }`}
            >
              <span className="flex items-center gap-2">
                <Heart size={15} /> Wishlist ({wishlist.length})
              </span>
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="pt-3 border-t border-[#111111]/10">
            <button
              onClick={logout}
              className="w-full py-2.5 bg-red-50 text-red-700 font-space text-xs uppercase font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <LogOut size={14} /> Sign Out Session
            </button>
          </div>
        </div>

        {/* Content Panel */}
        <div className="md:col-span-9 space-y-6">
          <AnimatePresence mode="wait">
            {/* Orders Tab */}
            {activeTab === 'orders' && (
              <motion.div
                key="orders"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-[#111111]/15 p-6 space-y-6"
              >
                <div className="flex justify-between items-center border-b border-[#111111]/10 pb-3">
                  <h3 className="font-space font-bold text-sm uppercase tracking-wider text-[#111111]">
                    My Orders &amp; Fulfillment
                  </h3>
                  <span className="text-xs font-mono text-[#111111]/50">
                    {userOrders.length} Order(s) Record
                  </span>
                </div>

                {userOrders.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <ShoppingBag size={40} className="mx-auto text-[#111111]/30" />
                    <h4 className="font-space font-bold uppercase text-base">No Orders Placed Yet</h4>
                    <p className="text-xs text-[#111111]/60 font-sans max-w-xs mx-auto">
                      Explore our tailored cotton garments and custom printing studio to place your first order.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block px-6 py-2.5 bg-[#111111] text-[#C7F464] font-space text-xs uppercase font-bold tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
                    >
                      Shop Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="divide-y divide-[#111111]/10">
                    {userOrders.map((ord) => (
                      <div
                        key={ord.id}
                        className="py-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-[#F7F6F2]/50 p-2 transition-colors"
                      >
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
                            Placed: {new Date(ord.created_at).toLocaleDateString('en-IN')} • {ord.items?.length || 0} Item(s)
                          </p>
                        </div>

                        <div className="flex items-center gap-4">
                          <span className="font-space font-extrabold text-base text-[#111111]">
                            ₹{ord.total_amount.toLocaleString('en-IN')}
                          </span>
                          <Link
                            to={`/account/orders/${ord.order_number}`}
                            className="px-4 py-2 bg-[#F7F6F2] border border-[#111111] text-[#111111] font-space text-xs uppercase font-bold hover:bg-[#111111] hover:text-[#F7F6F2] transition-colors flex items-center gap-1"
                          >
                            View Details <ArrowRight size={13} />
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-[#111111]/15 p-6 space-y-6"
              >
                <div className="border-b border-[#111111]/10 pb-3">
                  <h3 className="font-space font-bold text-sm uppercase tracking-wider text-[#111111]">
                    Profile &amp; Contact Details
                  </h3>
                </div>

                {profileMessage && (
                  <div className="p-3 bg-[#C7F464]/30 border border-[#111111] text-xs font-space font-bold text-[#111111] flex items-center gap-2">
                    <CheckCircle2 size={16} /> {profileMessage}
                  </div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-4 max-w-md text-xs">
                  <div className="space-y-1">
                    <label className="block font-space font-bold uppercase text-[#111111]">Full Name</label>
                    <input
                      type="text"
                      required
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-space font-bold uppercase text-[#111111]">Email Address</label>
                    <input
                      type="email"
                      disabled
                      value={user.email}
                      className="w-full bg-[#E8E8E8] border border-[#111111]/30 p-2.5 text-[#111111]/60 font-mono cursor-not-allowed"
                    />
                    <p className="text-[10px] text-[#111111]/40">Email address is linked to your account credentials.</p>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-space font-bold uppercase text-[#111111]">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 focus:outline-none font-mono"
                    />
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-3 bg-[#111111] text-[#C7F464] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center gap-2 cursor-pointer"
                  >
                    <Save size={15} /> Save Profile Changes
                  </button>
                </form>
              </motion.div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <motion.div
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-[#111111]/15 p-6 space-y-6"
              >
                <div className="flex justify-between items-center border-b border-[#111111]/10 pb-3">
                  <h3 className="font-space font-bold text-sm uppercase tracking-wider text-[#111111]">
                    Saved Shipping Addresses
                  </h3>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="px-3 py-1.5 bg-[#111111] text-[#C7F464] font-space text-xs font-bold uppercase flex items-center gap-1 cursor-pointer"
                  >
                    <Plus size={14} /> Add Address
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="p-4 bg-[#F7F6F2] border border-[#111111] space-y-3 text-xs">
                    <h4 className="font-space font-bold uppercase text-xs">New Delivery Address</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="Recipient Name"
                        value={newAddress.full_name}
                        onChange={(e) => setNewAddress({ ...newAddress, full_name: e.target.value })}
                        className="bg-white border border-[#111111] p-2"
                      />
                      <input
                        type="tel"
                        required
                        placeholder="Phone Number"
                        value={newAddress.phone}
                        onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                        className="bg-white border border-[#111111] p-2"
                      />
                    </div>
                    <input
                      type="text"
                      required
                      placeholder="Flat, House / Building Name"
                      value={newAddress.line1}
                      onChange={(e) => setNewAddress({ ...newAddress, line1: e.target.value })}
                      className="w-full bg-white border border-[#111111] p-2"
                    />
                    <div className="grid grid-cols-3 gap-3">
                      <input
                        type="text"
                        required
                        placeholder="City"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="bg-white border border-[#111111] p-2"
                      />
                      <input
                        type="text"
                        required
                        placeholder="State"
                        value={newAddress.state}
                        onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                        className="bg-white border border-[#111111] p-2"
                      />
                      <input
                        type="text"
                        required
                        placeholder="PIN Code"
                        value={newAddress.postal_code}
                        onChange={(e) => setNewAddress({ ...newAddress, postal_code: e.target.value })}
                        className="bg-white border border-[#111111] p-2 font-mono"
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-4 py-2 bg-gray-200 font-space text-xs uppercase"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-[#111111] text-[#C7F464] font-space text-xs uppercase font-bold"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {savedAddresses.map((addr, idx) => (
                    <div key={idx} className="p-4 bg-[#F7F6F2] border border-[#111111]/15 space-y-1 text-xs">
                      <div className="flex justify-between items-start">
                        <span className="font-space font-bold uppercase text-[#111111]">{addr.full_name}</span>
                        {idx === 0 && (
                          <span className="bg-[#111111] text-[#C7F464] font-space text-[9px] font-bold uppercase px-1.5 py-0.5">
                            DEFAULT
                          </span>
                        )}
                      </div>
                      <p>{addr.line1}</p>
                      {addr.line2 && <p>{addr.line2}</p>}
                      <p>{addr.city}, {addr.state} - <span className="font-mono">{addr.postal_code}</span></p>
                      <p className="font-mono text-[#111111]/60 pt-1">Phone: {addr.phone}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Wishlist Tab */}
            {activeTab === 'wishlist' && (
              <motion.div
                key="wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-white border border-[#111111]/15 p-6 space-y-6"
              >
                <div className="border-b border-[#111111]/10 pb-3">
                  <h3 className="font-space font-bold text-sm uppercase tracking-wider text-[#111111]">
                    My Saved Wishlist ({wishlist.length})
                  </h3>
                </div>

                {wishlist.length === 0 ? (
                  <div className="text-center py-12 space-y-3">
                    <Heart size={40} className="mx-auto text-[#111111]/30" />
                    <h4 className="font-space font-bold uppercase text-base">Your Wishlist is Empty</h4>
                    <p className="text-xs text-[#111111]/60 font-sans max-w-xs mx-auto">
                      Save items while browsing to compare styles and sizes.
                    </p>
                    <Link
                      to="/shop"
                      className="inline-block px-6 py-2.5 bg-[#111111] text-[#C7F464] font-space text-xs uppercase font-bold tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
                    >
                      Explore Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {wishlist.map((item) => (
                      <div key={item.id} className="bg-[#F7F6F2] border border-[#111111]/10 p-3 space-y-2">
                        <Link to={`/product/${item.product.slug}`} className="block font-space font-bold text-xs truncate hover:underline">
                          {item.product.name}
                        </Link>
                        <p className="font-space font-bold text-xs text-[#111111]">
                          ₹{(item.product.sale_price || item.product.regular_price).toLocaleString('en-IN')}
                        </p>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="block text-center py-1.5 bg-[#111111] text-[#F7F6F2] font-space text-[10px] font-bold uppercase hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
                        >
                          View Product
                        </Link>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
