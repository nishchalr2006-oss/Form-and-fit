import React from 'react';
import { useStore } from '../context/StoreContext';
import { X, Trash2, ShoppingBag, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { cart, updateCartQuantity, removeFromCart, storeSettings } = useStore();

  if (!isOpen) return null;

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.custom_design_data?.total_price
      ? item.custom_design_data.total_price
      : item.variant.price_override || item.product.sale_price || item.product.regular_price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const freeShippingThreshold = storeSettings.free_shipping_threshold || 1999;
  const freeShippingProgress = Math.min(100, (subtotal / freeShippingThreshold) * 100);
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#111111]/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F7F6F2] border-l border-[#111111] flex flex-col shadow-2xl">
          {/* Header */}
          <div className="p-5 border-b border-[#111111]/20 flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag size={20} className="text-[#111111]" />
              <h2 className="font-space font-bold uppercase text-base tracking-wider text-[#111111]">
                Shopping Bag ({cart.reduce((a, b) => a + b.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 hover:bg-[#E8E8E8] transition-colors rounded-none cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Free shipping progress */}
          <div className="bg-[#111111] text-[#F7F6F2] p-3 text-xs">
            {remainingForFreeShipping > 0 ? (
              <p className="mb-1 text-center">
                Add <span className="font-bold text-[#C7F464]">₹{remainingForFreeShipping.toLocaleString('en-IN')}</span> more for FREE Shipping
              </p>
            ) : (
              <p className="mb-1 text-center text-[#C7F464] font-semibold flex items-center justify-center gap-1">
                <Sparkles size={14} /> You unlocked FREE Shipping across India!
              </p>
            )}
            <div className="w-full bg-[#E8E8E8]/30 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#C7F464] h-full transition-all duration-300"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-[#E8E8E8] flex items-center justify-center text-[#111111]/40 mb-2">
                  <ShoppingBag size={28} />
                </div>
                <p className="font-space font-bold uppercase text-sm tracking-wider">Your Bag is Empty</p>
                <p className="text-xs text-[#111111]/60 max-w-xs">
                  Explore our modern apparel catalog and build your style statement.
                </p>
                <button
                  onClick={onClose}
                  className="mt-4 px-6 py-2.5 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors cursor-pointer"
                >
                  Shop Collection
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemPrice = item.custom_design_data?.total_price
                  ? item.custom_design_data.total_price
                  : item.variant.price_override || item.product.sale_price || item.product.regular_price;
                const imageSrc =
                  item.variant.variant_image_url ||
                  item.product.images?.find((i) => i.is_main)?.url ||
                  item.product.images?.[0]?.url;

                return (
                  <div
                    key={item.id}
                    className="flex gap-4 p-3 bg-white border border-[#111111]/10 relative group"
                  >
                    <div className="w-20 h-24 bg-[#E8E8E8] shrink-0 overflow-hidden relative">
                      {imageSrc ? (
                        <img
                          src={imageSrc}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[10px] uppercase font-space text-[#111111]/40 text-center p-1">
                          No Image
                        </div>
                      )}
                      {item.custom_design_data && (
                        <span className="absolute top-1 left-1 bg-[#C7F464] text-[#111111] text-[9px] font-bold uppercase px-1 py-0.5">
                          Custom
                        </span>
                      )}
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start gap-2">
                          <h4 className="font-space font-bold text-sm text-[#111111] line-clamp-1">
                            {item.product.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-[#111111]/40 hover:text-red-600 transition-colors cursor-pointer"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        <div className="flex flex-wrap gap-2 text-xs text-[#111111]/70 mt-1">
                          {item.variant.size && (
                            <span className="bg-[#F7F6F2] px-1.5 py-0.5 border border-[#111111]/20 font-mono text-[11px]">
                              Size: {item.variant.size}
                            </span>
                          )}
                          {item.variant.color && (
                            <span className="bg-[#F7F6F2] px-1.5 py-0.5 border border-[#111111]/20 text-[11px]">
                              Color: {item.variant.color}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3">
                        {/* Quantity controls */}
                        <div className="flex items-center border border-[#111111]">
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                            className="px-2 py-0.5 text-xs hover:bg-[#E8E8E8] cursor-pointer"
                          >
                            -
                          </button>
                          <span className="px-2 py-0.5 text-xs font-mono font-bold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                            className="px-2 py-0.5 text-xs hover:bg-[#E8E8E8] cursor-pointer"
                          >
                            +
                          </button>
                        </div>

                        <span className="font-space font-bold text-sm text-[#111111]">
                          ₹{(itemPrice * item.quantity).toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Subtotal & Checkout button */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-[#111111]/20 bg-white space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-[#111111]/70 font-space uppercase">Subtotal</span>
                <span className="font-space font-bold text-lg text-[#111111]">
                  ₹{subtotal.toLocaleString('en-IN')}
                </span>
              </div>
              <p className="text-[11px] text-[#111111]/60">
                Shipping and taxes calculated at checkout.
              </p>
              <div className="pt-2">
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#111111] text-[#F7F6F2] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors cursor-pointer"
                >
                  Proceed to Checkout <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
