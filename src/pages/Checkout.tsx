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
      <div className="max-w-2xl mx-auto my-20 p-8 bg-white border border-[#111111] text-center space-y-4">
        <h2 className="font-space font-bold text-2xl uppercase">No Items to Checkout</h2>
        <p className="text-xs text-[#111111]/60 font-sans">
          Your shopping bag is empty. Please add items before proceeding to checkout.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
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
      <div className="border-b border-[#111111]/15 pb-4">
        <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
          Form &amp; Fit Checkout
        </span>
        <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
          Express Checkout
        </h1>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form Column */}
        <div className="lg:col-span-7 space-y-8">
          {errorMsg && (
            <div className="p-4 bg-red-100 border border-red-400 text-red-800 text-xs font-space font-bold">
              {errorMsg}
            </div>
          )}

          {/* Section 1: Contact Details */}
          <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
            <h3 className="font-space font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-[#111111]/10 pb-3">
              1. Contact Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                  Phone Number (for Courier SMS) *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Shipping Address */}
          <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
            <h3 className="font-space font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-[#111111]/10 pb-3">
              <Truck size={16} /> 2. Shipping Address Across India
            </h3>

            <div className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                  Recipient Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                  Flat / House / Building Address *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Flat 402, Sunshine Heights"
                  value={line1}
                  onChange={(e) => setLine1(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                  Street / Area / Landmark
                </label>
                <input
                  type="text"
                  placeholder="Near Metro Station"
                  value={line2}
                  onChange={(e) => setLine2(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Mumbai / Delhi"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                    PIN Code *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="400001"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full bg-[#F7F6F2] border border-[#111111] p-2 text-xs focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 3: Payment Method Selection */}
          <div className="bg-white border border-[#111111]/15 p-6 space-y-4">
            <h3 className="font-space font-bold text-sm uppercase tracking-wider flex items-center gap-2 border-b border-[#111111]/10 pb-3">
              <CreditCard size={16} /> 3. Payment Method
            </h3>

            <div className="space-y-3">
              <label
                className={`flex items-center justify-between p-3 border cursor-pointer ${
                  paymentMethod === 'upi' ? 'border-[#111111] bg-[#C7F464]/20 font-bold' : 'border-[#111111]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-[#111111]"
                  />
                  <div>
                    <span className="font-space text-xs uppercase block">UPI / QR (Google Pay, PhonePe, Paytm)</span>
                    <span className="text-[10px] text-[#111111]/60">Instant payment verification</span>
                  </div>
                </div>
                <span className="text-xs font-bold uppercase bg-[#111111] text-[#C7F464] px-2 py-0.5">FAST</span>
              </label>

              <label
                className={`flex items-center justify-between p-3 border cursor-pointer ${
                  paymentMethod === 'razorpay' ? 'border-[#111111] bg-[#C7F464]/20 font-bold' : 'border-[#111111]/20'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="accent-[#111111]"
                  />
                  <div>
                    <span className="font-space text-xs uppercase block">Razorpay Gateway (Cards &amp; NetBanking)</span>
                    <span className="text-[10px] text-[#111111]/60">Visa, Mastercard, RuPay &amp; NetBanking</span>
                  </div>
                </div>
              </label>

              {storeSettings.cod_enabled && (
                <label
                  className={`flex items-center justify-between p-3 border cursor-pointer ${
                    paymentMethod === 'cod' ? 'border-[#111111] bg-[#C7F464]/20 font-bold' : 'border-[#111111]/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="payment"
                      value="cod"
                      checked={paymentMethod === 'cod'}
                      onChange={() => setPaymentMethod('cod')}
                      className="accent-[#111111]"
                    />
                    <div>
                      <span className="font-space text-xs uppercase block">Cash On Delivery (COD)</span>
                      <span className="text-[10px] text-[#111111]/60">Pay cash upon delivery to courier agent</span>
                    </div>
                  </div>
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Right Order Review Column */}
        <div className="lg:col-span-5 bg-white border border-[#111111]/15 p-6 space-y-6">
          <h3 className="font-space font-bold text-base uppercase tracking-wider border-b border-[#111111]/10 pb-3">
            Review Bag Items ({cart.reduce((a, b) => a + b.quantity, 0)})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-3 text-xs justify-between items-center border-b border-[#111111]/10 pb-2">
                <div className="flex gap-2 items-center">
                  <span className="font-mono font-bold bg-[#111111] text-white px-1.5 py-0.5 text-[10px]">
                    {item.quantity}x
                  </span>
                  <div>
                    <p className="font-space font-bold line-clamp-1">{item.product.name}</p>
                    <p className="text-[10px] text-[#111111]/60">
                      {item.variant.size ? `Size: ${item.variant.size}` : ''} {item.variant.color ? `• ${item.variant.color}` : ''}
                    </p>
                  </div>
                </div>
                <span className="font-space font-bold">
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
            <div className="flex justify-between text-[#111111]/70">
              <span>Subtotal</span>
              <span className="font-bold text-[#111111]">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-700 font-bold">
                <span>Discount</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-[#111111]/70">
              <span>Shipping Fee</span>
              <span>{shippingFee === 0 ? 'FREE' : `₹${shippingFee}`}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#111111] pt-2 border-t border-[#111111]/10">
              <span>Final Total</span>
              <span className="text-xl">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-4 bg-[#111111] text-[#C7F464] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isSubmitting ? 'Processing Order...' : 'Place Order & Pay Now'} <ArrowRight size={16} />
          </button>

          <div className="text-center text-[10px] text-[#111111]/50 space-y-1">
            <p className="flex items-center justify-center gap-1">
              <Lock size={12} /> 256-Bit Encrypted Secure Checkout
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
