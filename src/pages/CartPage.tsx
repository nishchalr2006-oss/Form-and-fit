import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Trash2, ArrowRight, ShoppingBag, ShieldCheck, Tag } from 'lucide-react';
import { getFashionFallbackImage } from '../lib/imageOptimization';

export const CartPage: React.FC = () => {
  const { cart, updateCartQuantity, removeFromCart, applyCoupon, appliedCoupon, removeCoupon, storeSettings } = useStore();
  const [couponInput, setCouponInput] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const navigate = useNavigate();

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

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponInput('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto my-20 p-12 bg-[#14141A] border border-white/10 text-center space-y-4">
        <ShoppingBag size={48} className="mx-auto text-white/30" />
        <h2 className="font-space font-bold text-2xl uppercase text-white">Your Shopping Bag is Empty</h2>
        <p className="text-xs text-white/60 font-sans max-w-md mx-auto">
          Explore our collection of modern clothing, structured outerwear, and bespoke t-shirt designs.
        </p>
        <Link
          to="/shop"
          className="inline-block px-8 py-3.5 bg-[#C7F464] text-[#111111] font-space font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
        >
          Browse Collection Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-white/10 pb-4">
        <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-white">
          Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Items Table */}
        <div className="lg:col-span-8 bg-[#14141A] border border-white/10 divide-y divide-white/10">
          {cart.map((item) => {
            const itemPrice = item.custom_design_data?.total_price
              ? item.custom_design_data.total_price
              : item.variant.price_override || item.product.sale_price || item.product.regular_price;
            const fallbackImg = getFashionFallbackImage(item.product?.name, item.product?.category?.name);
            const imageSrc =
              item.variant?.variant_image_url ||
              item.product?.images?.find((i) => i.is_main)?.url ||
              item.product?.images?.[0]?.url ||
              fallbackImg;

            return (
              <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                <div className="flex gap-4 items-center flex-1">
                  <div className="w-20 h-24 bg-[#0E0E12] shrink-0 overflow-hidden relative border border-white/10">
                    <img
                      src={imageSrc}
                      alt={item.product?.name || 'Product'}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = fallbackImg;
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-space font-bold text-sm text-white">{item.product.name}</h3>
                    <div className="flex flex-wrap gap-2 text-xs text-white/70">
                      {item.variant.size && (
                        <span className="bg-[#181822] text-[#C7F464] px-1.5 py-0.5 border border-white/10 font-mono text-[11px]">
                          Size: {item.variant.size}
                        </span>
                      )}
                      {item.variant.color && (
                        <span className="bg-[#181822] text-white/90 px-1.5 py-0.5 border border-white/10 text-[11px]">
                          Color: {item.variant.color}
                        </span>
                      )}
                    </div>
                    {item.custom_design_data && (
                      <span className="inline-block bg-[#C7F464] text-[#111111] text-[10px] font-bold uppercase px-2 py-0.5">
                        Custom Design
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto gap-6 pt-2 sm:pt-0">
                  {/* Quantity */}
                  <div className="flex items-center border border-white/20 bg-[#181822]">
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                      className="px-2.5 py-1 text-xs text-white hover:bg-white/10 hover:text-[#C7F464] font-bold cursor-pointer transition-colors"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-mono font-bold text-white min-w-[2rem] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                      className="px-2.5 py-1 text-xs text-white hover:bg-white/10 hover:text-[#C7F464] font-bold cursor-pointer transition-colors"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="text-right">
                    <span className="font-space font-bold text-base text-white block">
                      ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-white/50">₹{itemPrice} each</span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="text-white/40 hover:text-red-400 transition-colors p-1 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-4 bg-[#14141A] border border-white/10 p-6 space-y-6 text-white">
          <h3 className="font-space font-bold text-base uppercase tracking-wider border-b border-white/10 pb-3 text-white">
            Order Summary
          </h3>

          {/* Promo Code Input */}
          <div className="space-y-2">
            <label className="block text-xs font-space font-bold uppercase flex items-center gap-1 text-white/90">
              <Tag size={13} className="text-[#C7F464]" /> Promo Code / Coupon
            </label>
            {appliedCoupon ? (
              <div className="flex justify-between items-center bg-[#C7F464] text-[#111111] p-2.5 text-xs font-space font-bold">
                <span>Code {appliedCoupon.code} Applied</span>
                <button type="button" onClick={removeCoupon} className="text-xs underline hover:text-red-600 cursor-pointer">
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  placeholder="e.g. FORM10"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  className="flex-1 bg-[#1A1A24] border border-white/20 text-white placeholder:text-white/40 px-3 py-2 text-xs focus:outline-none focus:border-[#C7F464] uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C7F464] text-[#111111] font-space text-xs uppercase font-extrabold hover:bg-white transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}

            {couponMessage && (
              <p
                className={`text-[11px] font-space ${
                  couponMessage.type === 'success' ? 'text-[#C7F464]' : 'text-red-400'
                }`}
              >
                {couponMessage.text}
              </p>
            )}
          </div>

          <div className="space-y-3 pt-3 border-t border-white/10 text-xs font-space">
            <div className="flex justify-between text-white/70">
              <span>Bag Subtotal</span>
              <span className="font-bold text-white">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {discount > 0 && (
              <div className="flex justify-between text-[#C7F464] font-bold">
                <span>Discount</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
            )}

            <div className="flex justify-between text-white/70">
              <span>Estimated Shipping</span>
              <span>
                {shippingFee === 0 ? (
                  <span className="text-[#111111] bg-[#C7F464] px-1.5 py-0.5 font-bold uppercase text-[10px]">FREE</span>
                ) : (
                  `₹${shippingFee}`
                )}
              </span>
            </div>

            <div className="flex justify-between text-base font-bold text-white pt-3 border-t border-white/10">
              <span>Total Payable</span>
              <span className="text-2xl text-[#C7F464] font-extrabold">₹{finalTotal.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="w-full py-4 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(199,244,100,0.25)]"
          >
            Proceed to Checkout <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};
