import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { ImagePlaceholder } from '../components/ImagePlaceholder';
import { ProductVariant } from '../types';
import { getFashionFallbackImage } from '../lib/imageOptimization';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  Shield,
  Star,
  Sparkles,
  Ruler,
  Check,
} from 'lucide-react';

export const ProductDetail: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { products, addToCart, toggleWishlist, isInWishlist, addReview } = useStore();
  const navigate = useNavigate();

  const product = products.find((p) => p.slug === slug);

  // Active state
  const [selectedImageIndex, setSelectedImageIndex] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(() => {
    return product?.variants?.find((v) => v.is_active && v.stock_quantity > 0) || product?.variants?.[0] || null;
  });
  const [quantity, setQuantity] = useState<number>(1);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'shipping'>('details');

  // Review Modal State
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [reviewerName, setReviewerName] = useState('');
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto my-20 p-8 bg-[#14141A] border border-white/10 text-center space-y-4">
        <h2 className="font-space font-bold text-2xl uppercase text-white">Product Not Found</h2>
        <p className="text-xs text-white/60 font-sans">
          The requested fashion item does not exist or has been unpublished by the store owner.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#C7F464] text-[#111111] font-space font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors"
        >
          Return to Shop Catalog
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const images = product.images || [];
  const fallbackUrl = getFashionFallbackImage(product.name, product.category?.name);
  const currentImage = images[selectedImageIndex]?.url || selectedVariant?.variant_image_url || images[0]?.url || fallbackUrl;

  // Calculate pricing
  const currentPrice = selectedVariant?.price_override || product.sale_price || product.regular_price;
  const originalPrice = product.regular_price;
  const isSale = product.sale_price && product.sale_price < product.regular_price;

  const currentStock = selectedVariant?.stock_quantity || 0;
  const isOutOfStock = currentStock === 0;

  // Group variants by color and size
  const sizes = Array.from(new Set(product.variants?.map((v) => v.size).filter(Boolean)));
  const colors = Array.from(new Set(product.variants?.map((v) => v.color).filter(Boolean)));

  const handleAddToCart = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
  };

  const handleBuyNow = () => {
    if (!selectedVariant) return;
    addToCart(product, selectedVariant, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reviewerName.trim() && reviewComment.trim()) {
      addReview(product.id, reviewRating, reviewComment, reviewerName.trim());
      setShowReviewModal(false);
      setReviewerName('');
      setReviewComment('');
    }
  };

  // Related Products
  const relatedProducts = products
    .filter((p) => p.id !== product.id && p.status === 'published' && p.category_id === product.category_id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Breadcrumb */}
      <div className="text-xs font-space font-semibold text-white/60 uppercase flex items-center gap-2">
        <Link to="/" className="hover:text-[#C7F464] transition-colors">Home</Link>
        <span className="text-white/30">/</span>
        <Link to="/shop" className="hover:text-[#C7F464] transition-colors">Shop</Link>
        <span className="text-white/30">/</span>
        <span className="text-[#C7F464] truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-[#14141A] border border-white/10 relative overflow-hidden">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackUrl;
              }}
            />

            {isSale && (
              <span className="absolute top-4 left-4 bg-[#111111] text-[#C7F464] font-space font-extrabold text-xs uppercase px-3 py-1 border border-[#C7F464]/40 shadow-[0_0_10px_rgba(199,244,100,0.3)]">
                SALE
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={img.id || idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-20 aspect-[3/4] bg-[#14141A] border shrink-0 overflow-hidden cursor-pointer transition-all ${
                    selectedImageIndex === idx ? 'border-2 border-[#C7F464] shadow-[0_0_10px_rgba(199,244,100,0.3)]' : 'border-white/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img.url}
                    alt="Thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackUrl;
                    }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Product Summary & Actions */}
        <div className="space-y-6">
          <div className="space-y-2 border-b border-white/10 pb-6">
            <span className="text-xs font-space font-bold uppercase tracking-widest text-[#C7F464]">
              {product.category?.name || product.gender_collection}
            </span>
            <h1 className="font-space font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-white">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-[11px] font-mono text-white/40 uppercase">SKU: {product.sku}</p>
            )}

            {/* Price */}
            <div className="pt-3 flex items-baseline gap-3">
              <span className="font-space font-extrabold text-3xl text-white">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {isSale && (
                <span className="font-space text-base text-white/40 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-white/60 font-sans">Inclusive of all taxes</span>
            </div>
          </div>

          {/* Variant Selectors */}
          <div className="space-y-4">
            {/* Colors */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-space font-bold uppercase text-white">
                  Color:{' '}
                  <span className="font-normal text-[#C7F464]">
                    {selectedVariant?.color || 'Select Color'}
                  </span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {colors.map((color) => {
                    const matchingVariant = product.variants?.find((v) => v.color === color && v.is_active);
                    const isSelected = selectedVariant?.color === color;

                    return (
                      <button
                        key={color}
                        onClick={() => matchingVariant && setSelectedVariant(matchingVariant)}
                        className={`px-3.5 py-1.5 text-xs font-space uppercase border cursor-pointer transition-all ${
                          isSelected
                            ? 'bg-[#C7F464] text-[#111111] border-[#C7F464] font-extrabold shadow-[0_0_12px_rgba(199,244,100,0.3)]'
                            : 'bg-[#181822] text-white border-white/20 hover:border-[#C7F464] hover:text-[#C7F464]'
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {sizes.length > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-space">
                  <label className="font-bold uppercase text-white">
                    Size:{' '}
                    <span className="font-normal text-[#C7F464]">
                      {selectedVariant?.size || 'Select Size'}
                    </span>
                  </label>
                  <Link
                    to="/size-guide"
                    className="flex items-center gap-1 text-[#C7F464] hover:underline font-semibold"
                  >
                    <Ruler size={13} /> Size Guide
                  </Link>
                </div>

                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
                  {sizes.map((size) => {
                    const matchingVariant = product.variants?.find(
                      (v) => v.size === size && (selectedVariant ? v.color === selectedVariant.color : true)
                    );
                    const isSelected = selectedVariant?.size === size;
                    const isAvailable = matchingVariant && matchingVariant.stock_quantity > 0;

                    return (
                      <button
                        key={size}
                        disabled={!isAvailable}
                        onClick={() => matchingVariant && setSelectedVariant(matchingVariant)}
                        className={`py-2.5 text-xs font-mono border transition-all cursor-pointer font-bold ${
                          isSelected
                            ? 'bg-[#C7F464] text-[#111111] border-[#C7F464] shadow-[0_0_12px_rgba(199,244,100,0.3)]'
                            : isAvailable
                            ? 'bg-[#181822] text-white border-white/20 hover:border-[#C7F464] hover:text-[#C7F464]'
                            : 'bg-white/5 text-white/25 border-transparent cursor-not-allowed line-through'
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Stock status indicator */}
            <div className="pt-1">
              {isOutOfStock ? (
                <span className="inline-block bg-red-950/60 text-red-300 border border-red-500/30 text-xs font-space font-bold uppercase px-3 py-1">
                  Out of Stock
                </span>
              ) : currentStock <= 5 ? (
                <span className="inline-block bg-amber-950/60 text-amber-300 border border-amber-500/30 text-xs font-space font-bold uppercase px-3 py-1">
                  ⚡ Only {currentStock} Left in Stock - Order Soon
                </span>
              ) : (
                <span className="inline-block bg-[#C7F464]/15 text-[#C7F464] border border-[#C7F464]/30 text-xs font-space font-bold uppercase px-3 py-1">
                  ✓ In Stock ({currentStock} available)
                </span>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-4 space-y-3">
              <div className="flex gap-4 items-center">
                {/* Quantity Controls - High Contrast */}
                <div className="flex items-center border border-white/20 bg-[#181822] rounded-none">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3.5 py-3 text-base text-white hover:bg-white/10 hover:text-[#C7F464] font-bold cursor-pointer transition-colors"
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-sm font-mono font-bold text-white min-w-[2.5rem] text-center">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
                    className="px-3.5 py-3 text-base text-white hover:bg-white/10 hover:text-[#C7F464] font-bold cursor-pointer transition-colors"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={isOutOfStock || !selectedVariant}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-colors disabled:bg-white/10 disabled:text-white/30 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(199,244,100,0.2)]"
                >
                  <ShoppingBag size={16} /> Add To Bag
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product)}
                  className="p-3.5 border border-white/20 bg-[#181822] text-white hover:border-[#C7F464] hover:text-[#C7F464] transition-colors cursor-pointer"
                  title="Save to Wishlist"
                >
                  <Heart size={18} fill={inWishlist ? '#C7F464' : 'none'} className={inWishlist ? 'text-[#C7F464]' : 'text-white'} />
                </button>
              </div>

              {!isOutOfStock && selectedVariant && (
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-white text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-[#C7F464] transition-colors cursor-pointer shadow-[0_0_20px_rgba(255,255,255,0.15)]"
                >
                  Buy It Now
                </button>
              )}
            </div>
          </div>

          {/* Value Prop Badges - High Contrast Dark Cards */}
          <div className="grid grid-cols-3 gap-2.5 pt-4 border-t border-white/10 text-center text-[11px] font-space">
            <div className="p-3 bg-[#181822] border border-white/10 hover:border-[#C7F464]/30 transition-colors">
              <Truck size={18} className="mx-auto mb-1.5 text-[#C7F464]" />
              <span className="text-white font-medium block">Fast Shipping</span>
            </div>
            <div className="p-3 bg-[#181822] border border-white/10 hover:border-[#C7F464]/30 transition-colors">
              <RotateCcw size={18} className="mx-auto mb-1.5 text-[#C7F464]" />
              <span className="text-white font-medium block">7 Day Return</span>
            </div>
            <div className="p-3 bg-[#181822] border border-white/10 hover:border-[#C7F464]/30 transition-colors">
              <Shield size={18} className="mx-auto mb-1.5 text-[#C7F464]" />
              <span className="text-white font-medium block">Verified Quality</span>
            </div>
          </div>

          {/* Product Specifications & Tabs */}
          <div className="border-t border-white/10 pt-6 space-y-4 font-sans text-xs">
            <div className="flex border-b border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('details')}
                className={`pb-2.5 px-4 font-space font-bold uppercase text-xs border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'details' ? 'border-[#C7F464] text-[#C7F464]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                Fabric &amp; Specs
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('care')}
                className={`pb-2.5 px-4 font-space font-bold uppercase text-xs border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'care' ? 'border-[#C7F464] text-[#C7F464]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                Care Guide
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('shipping')}
                className={`pb-2.5 px-4 font-space font-bold uppercase text-xs border-b-2 cursor-pointer transition-colors ${
                  activeTab === 'shipping' ? 'border-[#C7F464] text-[#C7F464]' : 'border-transparent text-white/50 hover:text-white'
                }`}
              >
                Delivery Policies
              </button>
            </div>

            <div className="pt-2 leading-relaxed text-white/80">
              {activeTab === 'details' && (
                <div className="space-y-2">
                  <p>{product.description || 'Crafted with attention to detail and modern fit.'}</p>
                  {product.fabric_material && (
                    <p>
                      <strong className="text-white font-space font-bold uppercase tracking-wider text-[11px]">Fabric:</strong>{' '}
                      <span className="text-white/90">{product.fabric_material}</span>
                    </p>
                  )}
                  {product.fit && (
                    <p>
                      <strong className="text-white font-space font-bold uppercase tracking-wider text-[11px]">Fit Profile:</strong>{' '}
                      <span className="text-white/90">{product.fit}</span>
                    </p>
                  )}
                </div>
              )}

              {activeTab === 'care' && (
                <p>
                  {product.care_instructions ||
                    'Machine wash cold with like colors. Do not bleach. Tumble dry low. Cool iron if needed. Do not iron directly on prints.'}
                </p>
              )}

              {activeTab === 'shipping' && (
                <p>
                  Dispatched within 24-48 business hours. Delivered across India via Express Courier (Delhivery, BlueDart, XpressBees). Cash on Delivery and UPI available.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Customer Reviews Section */}
      <div className="bg-[#14141A] border border-white/10 p-6 sm:p-8 space-y-6 text-white">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
          <div>
            <h3 className="font-space font-bold text-xl uppercase text-white">
              Verified Customer Reviews
            </h3>
            <p className="text-xs text-white/60 font-sans">Real ratings from confirmed buyers</p>
          </div>

          <button
            type="button"
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2.5 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-white transition-colors cursor-pointer"
          >
            Write A Review
          </button>
        </div>

        {/* Review Form Modal */}
        {showReviewModal && (
          <form onSubmit={handleReviewSubmit} className="p-5 bg-[#181822] border border-white/20 space-y-4">
            <h4 className="font-space font-bold text-xs uppercase text-[#C7F464]">Submit Product Review</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[11px] font-space uppercase text-white/70 block">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Your Full Name"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  className="w-full bg-[#0A0A0C] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464]"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[11px] font-space uppercase text-white/70 block">Rating</label>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="w-full bg-[#0A0A0C] border border-white/20 text-white p-2.5 text-xs font-space focus:outline-none focus:border-[#C7F464]"
                >
                  <option value={5} className="bg-[#181822] text-white">⭐⭐⭐⭐⭐ (5/5) - Excellent</option>
                  <option value={4} className="bg-[#181822] text-white">⭐⭐⭐⭐ (4/5) - Very Good</option>
                  <option value={3} className="bg-[#181822] text-white">⭐⭐⭐ (3/5) - Average</option>
                  <option value={2} className="bg-[#181822] text-white">⭐⭐ (2/5) - Fair</option>
                  <option value={1} className="bg-[#181822] text-white">⭐ (1/5) - Poor</option>
                </select>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-[11px] font-space uppercase text-white/70 block">Feedback Details</label>
              <textarea
                required
                rows={3}
                placeholder="Write your honest feedback on fabric, sizing, comfort, and print durability..."
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-[#0A0A0C] border border-white/20 text-white placeholder:text-white/40 p-2.5 text-xs focus:outline-none focus:border-[#C7F464]"
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-white/10 text-white hover:bg-white/20 text-xs font-space uppercase transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#C7F464] text-[#111111] text-xs font-space uppercase font-bold hover:bg-white transition-colors"
              >
                Post Review
              </button>
            </div>
          </form>
        )}

        <div className="text-xs text-white/60 font-sans italic">
          No reviews yet. Be the first to share your Form &amp; Fit experience!
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-white/10">
          <h3 className="font-space font-bold text-xl uppercase tracking-tight text-white">
            You May Also Like
          </h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((rel) => (
              <ProductCard key={rel.id} product={rel} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
