import React, { useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles, Plus, Minus, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getFashionFallbackImage } from '../lib/imageOptimization';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, storeSettings } = useStore();

  // Escape key & Body scroll lock for instant response
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  // Memoized subtotal calculation
  const subtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const itemPrice = item.custom_design_data?.total_price
        ? item.custom_design_data.total_price
        : item.variant.price_override || item.product.sale_price || item.product.regular_price;
      return acc + itemPrice * item.quantity;
    }, 0);
  }, [cart]);

  const totalQuantity = useMemo(() => {
    return cart.reduce((acc, item) => acc + item.quantity, 0);
  }, [cart]);

  const freeShippingThreshold = storeSettings.free_shipping_threshold || 1999;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex justify-end animate-fadeIn select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Bag Drawer"
    >
      {/* High-performance Solid Backdrop (Zero GPU blur overhead) */}
      <div
        className="fixed inset-0 bg-black/75 transition-opacity duration-200 cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Container (Sliding in from Right) */}
      <div className="relative w-full max-w-md bg-[#121216] border-l border-white/10 flex flex-col h-full shadow-[0_0_50px_rgba(0,0,0,0.9)] z-10 animate-slideLeft">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0E0E12]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#C7F464]/10 border border-[#C7F464]/30 flex items-center justify-center text-[#C7F464]">
              <ShoppingBag size={18} />
            </div>
            <div>
              <h2 className="font-space font-extrabold uppercase text-sm tracking-wider text-white">
                Shopping Bag
              </h2>
              <p className="text-[10px] font-space text-[#C7F464] font-bold uppercase">
                {totalQuantity} {totalQuantity === 1 ? 'Item' : 'Items'} Selected
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-white/60 hover:text-white hover:bg-white/10 transition-colors rounded-xs cursor-pointer touch-manipulation active:scale-90"
            aria-label="Close Shopping Bag"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        <div className="bg-[#181820] border-b border-white/5 p-3 text-xs">
          {remainingForFreeShipping > 0 ? (
            <p className="mb-1.5 text-center text-[11px] font-space text-white/80">
              Add <span className="font-bold text-[#C7F464]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more for <span className="text-[#C7F464] font-bold">FREE Express Delivery</span>
            </p>
          ) : (
            <p className="mb-1.5 text-center text-[#C7F464] font-space font-bold text-xs flex items-center justify-center gap-1.5">
              <Sparkles size={14} className="text-[#C7F464]" /> You unlocked FREE Express Courier Shipping!
            </p>
          )}
          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-[#C7F464] h-full transition-all duration-300 shadow-[0_0_8px_#C7F464]"
              style={{ width: `${freeShippingProgress}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
              <div className="w-16 h-16 rounded-full bg-[#181822] border border-white/10 flex items-center justify-center text-[#C7F464]">
                <ShoppingBag size={28} />
              </div>
              <div className="space-y-1">
                <p className="font-space font-extrabold uppercase text-sm tracking-wider text-white">Your Bag is Empty</p>
                <p className="text-xs text-white/60 max-w-xs font-sans">
                  Explore our modern 240 GSM tees, statement apparel, and custom prints.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 px-6 py-3 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-all cursor-pointer rounded-xs shadow-[0_0_15px_rgba(199,244,100,0.3)] touch-manipulation active:scale-95"
              >
                Shop New Arrivals
              </button>
            </div>
          ) : (
            cart.map((item) => {
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
                <div
                  key={item.id}
                  className="flex gap-3 sm:gap-4 p-3 bg-[#181822] border border-white/10 hover:border-[#C7F464]/50 transition-colors rounded-xs relative group"
                >
                  <div className="w-20 h-24 bg-[#0E0E12] border border-white/10 shrink-0 overflow-hidden relative rounded-xs">
                    <img
                      src={imageSrc}
                      alt={item.product?.name || 'Product'}
                      className="w-full h-full object-cover transition-opacity duration-300"
                      loading="lazy"
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = fallbackImg;
                      }}
                    />
                    {item.custom_design_data && (
                      <span className="absolute top-1 left-1 bg-[#C7F464] text-[#111111] text-[9px] font-space font-extrabold uppercase px-1 py-0.5 rounded-xs">
                        Custom
                      </span>
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-space font-bold text-sm text-white line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id)}
                          className="text-white/40 hover:text-red-400 p-1 transition-colors cursor-pointer touch-manipulation"
                          aria-label="Remove item"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-1.5 text-xs text-white/70 mt-1">
                        {item.variant.size && (
                          <span className="bg-[#121216] px-1.5 py-0.5 border border-white/10 font-mono text-[10px] text-[#C7F464]">
                            Size: {item.variant.size}
                          </span>
                        )}
                        {item.variant.color && (
                          <span className="bg-[#121216] px-1.5 py-0.5 border border-white/10 text-[10px] text-white/80">
                            {item.variant.color}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex justify-between items-center mt-3">
                      {/* Quantity Controls */}
                      <div className="flex items-center border border-white/20 bg-[#121216] rounded-xs">
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-white/70 hover:text-white hover:bg-white/10 cursor-pointer touch-manipulation active:scale-90"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="w-8 text-center text-xs font-mono font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 flex items-center justify-center text-xs text-white/70 hover:text-white hover:bg-white/10 cursor-pointer touch-manipulation active:scale-90"
                          aria-label="Increase quantity"
                        >
                          <Plus size={12} />
                        </button>
                      </div>

                      <span className="font-space font-extrabold text-sm text-[#C7F464]">
                        ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Subtotal & Actions */}
        {cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-white/10 bg-[#0E0E12] space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="text-white/70 font-space uppercase tracking-wider text-xs">Estimated Subtotal</span>
              <span className="font-space font-extrabold text-lg text-[#C7F464]">
                ₹{subtotal.toLocaleString('en-IN')}
              </span>
            </div>

            <p className="text-[11px] text-white/50 font-sans">
              Taxes calculated at checkout. Free shipping on orders over ₹{freeShippingThreshold.toLocaleString('en-IN')}.
            </p>

            <div className="space-y-2 pt-1">
              <Link
                to="/checkout"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-all cursor-pointer rounded-xs shadow-[0_0_15px_rgba(199,244,100,0.3)] touch-manipulation active:scale-98"
              >
                Proceed to Checkout <ArrowRight size={16} />
              </Link>

              <Link
                to="/cart"
                onClick={onClose}
                className="w-full flex items-center justify-center gap-2 py-2.5 bg-transparent border border-white/20 text-white font-space font-bold text-xs uppercase tracking-wider hover:bg-white/10 transition-colors cursor-pointer rounded-xs touch-manipulation"
              >
                View Full Cart
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
};
