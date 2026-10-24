import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { ShippingAddress, PaymentMethod } from '../types';
import { ShieldCheck, Truck, CreditCard, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';

export const Checkout: React.FC = () => {
  const { cart, createOrder, appliedCoupon, storeSettings } = useStore();
  const { user } = useAuth();
  const navigate = useNavigate();

  // Form states
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [fullName, setFullName] = useState(user?.full_name || '');

  // Address
  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('upi');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto my-20 p-8 bg-[#14141A] border border-white/10 text-center space-y-4">
        <h2 className="font-space font-bold text-2xl uppercase text-white">No Items to Checkout</h2>
        <p className="text-xs text-white/60 font-sans">
          Your shopping bag is empty. Please add items before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#C7F464] text-[#111111] font-space font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.custom_design_data?.total_price
      ? item.custom_design_data.total_price
      : item.variant.price_override || item.product.sale_price || item.product.regular_price;
    return acc + itemPrice * item.quantity;
  }, 0);

  let discount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.discount_type === 'percentage') {
      discount = (subtotal * appliedCoupon.discount_value) / 100;
    } else {
      discount = appliedCoupon.discount_value;
    }
  }

  const shippingFee = subtotal >= storeSettings.free_shipping_threshold ? 0 : storeSettings.shipping_fee_flat;
  const finalTotal = Math.max(0, subtotal - discount + shippingFee);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim() || !customerPhone.trim() || !fullName.trim() || !line1.trim() || !city.trim() || !postalCode.trim()) {
      setErrorMsg('Please fill in all required contact and shipping address fields.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg('');

    const shippingAddress: ShippingAddress = {
      full_name: fullName.trim(),
      phone: customerPhone.trim(),
      line1: line1.trim(),
      line2: line2.trim(),
      city: city.trim(),
      state: state.trim() || 'Maharashtra',
      postal_code: postalCode.trim(),
      country: 'India',
    };

    const res = await createOrder({
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      shippingAddress,
      paymentMethod,
    });

    setIsSubmitting(false);

    if (res.success && res.orderNumber) {
      navigate(`/account/orders/${res.orderNumber}`, { state: { newOrder: true } });
    } else {
      setErrorMsg(res.message || 'Failed to place order. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-white/10 pb-4">
        <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#C7F464]">
          Form &amp; Fit Checkout
        </span>
        <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-white">
          Express Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-8">
          {errorMsg && (
            <div className="p-4 bg-red-950/60 border border-red-500/40 text-red-300 text-xs font-space font-bold">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Contact Details */}
          <div className="bg-[#14141A] border border-white/10 p-6 space-y-4">
            <h3 className="font-space font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3 text-white">
              1. Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-white/90">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464] focus:ring-1 focus:ring-[#C7F464] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-white/90">
                  Phone Number (for Courier SMS) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464] focus:ring-1 focus:ring-[#C7F464] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-[#14141A] border border-white/10 p-6 space-y-4">
            <h3 className="font-space font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3 text-white">
              <Truck size={16} className="text-[#C7F464]" /> 2. Shipping Address Across India
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-white/90">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464] focus:ring-1 focus:ring-[#C7F464] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-white/90">
                  Flat / House / Building Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Sunshine Heights"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464] focus:ring-1 focus:ring-[#C7F464] transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-white/90">
                  Street / Area / Landmark
                </label>
                <input
                  type="text"
                  placeholder="Near Metro Station"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="w-full bg-[#1A1A24] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464] focus:ring-1 focus:ring-[#C7F464] transition-colors"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-white/90">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mumbai / Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#1A1A24] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464] focus:ring-1 focus:ring-[#C7F464] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-white/90">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#1A1A24] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464] focus:ring-1 focus:ring-[#C7F464] transition-colors"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-white/90">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="400001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#1A1A24] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464] focus:ring-1 focus:ring-[#C7F464] font-mono transition-colors"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-[#14141A] border border-white/10 p-6 space-y-4">
            <h3 className="font-space font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-white/10 pb-3 text-white">
              <CreditCard size={16} className="text-[#C7F464]" /> 3. Payment Method
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                  paymentMethod === 'upi'
                    ? 'border-[#C7F464] bg-[#C7F464]/10 font-bold shadow-[0_0_12px_rgba(199,244,100,0.15)]'
                    : 'border-white/10 hover:border-white/25 bg-[#181822]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-[#C7F464]"
                  />
                  <div>
                    <span className="font-space text-xs uppercase block text-white">
                      UPI / QR (Google Pay, PhonePe, Paytm)
                    </span>
                    <span className="text-[10px] text-white/60">Instant payment verification</span>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase bg-[#C7F464] text-[#111111] px-2 py-0.5">FAST</span>
              </label>

              <label
                className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                  paymentMethod === 'razorpay'
                    ? 'border-[#C7F464] bg-[#C7F464]/10 font-bold shadow-[0_0_12px_rgba(199,244,100,0.15)]'
                    : 'border-white/10 hover:border-white/25 bg-[#181822]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="accent-[#C7F464]"
                  />
                  <div>
                    <span className="font-space text-xs uppercase block text-white">
                      Razorpay Gateway (Cards &amp; NetBanking)
                    </span>
                    <span className="text-[10px] text-white/60">Visa, Mastercard, RuPay &amp; NetBanking</span>
                  </div>
                </div>
              </label>

              {storeSettings.cod_enabled && (
                <label
                  className={`flex items-center justify-between p-3.5 border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#C7F464] bg-[#C7F464]/10 font-bold shadow-[0_0_12px_rgba(199,244,100,0.15)]'
                      : 'border-white/10 hover:border-white/25 bg-[#181822]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#C7F464]"
                    />
                    <div>
                      <span className="font-space text-xs uppercase block text-white">Cash On Delivery (COD)</span>
                      <span className="text-[10px] text-white/60">Pay cash upon delivery to courier agent</span>
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Order Review Column */}
        <div className="lg:col-span-5 bg-[#14141A] border border-white/10 p-6 space-y-6 text-white">
          <h3 className="font-space font-bold text-base uppercase tracking-wider border-b border-white/10 pb-3 text-white">
            Review Bag Items ({cart.reduce((a, b) => a + b.quantity, 0)})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs justify-between items-center border-b border-white/10 pb-2.5">
                <div className="flex gap-2 items-center">
                  <span className="font-mono font-bold bg-[#C7F464] text-[#111111] px-1.5 py-0.5 text-[10px]">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="font-space font-bold line-clamp-1 text-white">{item.product.name}</p>
                    <p className="text-[10px] text-white/60">
                      {item.variant.size ? `Size: ${item.variant.size}` : ''} {item.variant.color ? `• ${item.variant.color}` : ''}
                    </p>
                  </div>
                </div>
                <span className="font-space font-bold text-white">
                  ₹{(
                    (item.custom_design_data?.total_price ||
                      item.variant.price_override ||
                      item.product.sale_price ||
                      item.product.regular_price) * item.quantity
                  ).toLocaleString('en-IN')}
                </span>
              </div>
            ))}
          </div>

          <div className="space-y-2 pt-2 text-xs font-space">
            <div className="flex justify-between text-white/70">
              <span>Subtotal</span>
              <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-[#C7F464] font-bold">
                <span>Discount</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-white/70">
              <span>Shipping Fee</span>
              <span>{shippingFee === 0 ? <span className="text-[#C7F464] font-bold">FREE</span> : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-white pt-3 border-t border-white/10">
              <span>Final Total</span>
              <span className="text-2xl text-[#C7F464] font-extrabold">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 shadow-[0_0_20px_rgba(199,244,100,0.25)]"
          >
            {isSubmitting ? 'Processing Order...' : 'Place Order & Pay Now'} <ArrowRight size={16} />
          </button>

          <div className="text-center text-[10px] text-white/50 space-y-1">
            <p className="flex items-center justify-center gap-1 text-white/60">
              <Lock size={12} className="text-[#C7F464]" /> 256-Bit Encrypted Secure Checkout
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
