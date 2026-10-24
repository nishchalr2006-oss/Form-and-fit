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
      <div className="max-w-4xl mx-auto my-20 p-8 bg-white border border-[#111111] text-center space-y-4">
        <h2 className="font-space font-bold text-2xl uppercase">Product Not Found</h2>
        <p className="text-xs text-[#111111]/60 font-sans">
          The requested fashion item does not exist or has been unpublished by the store owner.
        </p>
        <Link
          to="/shop"
          className="inline-block px-6 py-3 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
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
      <div className="text-xs font-space font-semibold text-[#111111]/50 uppercase flex items-center gap-2">
        <Link to="/" className="hover:text-[#111111]">Home</Link>
        <span>/</span>
        <Link to="/shop" className="hover:text-[#111111]">Shop</Link>
        <span>/</span>
        <span className="text-[#111111] truncate">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left Gallery */}
        <div className="space-y-4">
          <div className="aspect-[3/4] bg-[#E8E8E8] border border-[#111111]/10 relative overflow-hidden">
            <img
              src={currentImage}
              alt={product.name}
              className="w-full h-full object-cover transition-opacity duration-300"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackUrl;
              }}
            />

            {isSale && (
              <span className="absolute top-4 left-4 bg-[#111111] text-[#C7F464] font-space font-bold text-xs uppercase px-3 py-1">
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
                  className={`w-20 aspect-[3/4] bg-[#E8E8E8] border shrink-0 overflow-hidden cursor-pointer ${
                    selectedImageIndex === idx ? 'border-2 border-[#111111]' : 'border-[#111111]/20 opacity-70'
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
          <div className="space-y-2 border-b border-[#111111]/10 pb-6">
            <span className="text-xs font-space font-bold uppercase tracking-widest text-[#111111]/50">
              {product.category?.name || product.gender_collection}
            </span>
            <h1 className="font-space font-extrabold text-3xl sm:text-4xl uppercase tracking-tight text-[#111111]">
              {product.name}
            </h1>
            {product.sku && (
              <p className="text-[11px] font-mono text-[#111111]/50 uppercase">SKU: {product.sku}</p>
            )}

            {/* Price */}
            <div className="pt-3 flex items-baseline gap-3">
              <span className="font-space font-bold text-2xl text-[#111111]">
                ₹{currentPrice.toLocaleString('en-IN')}
              </span>
              {isSale && (
                <span className="font-space text-sm text-[#111111]/40 line-through">
                  ₹{originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              <span className="text-xs text-[#111111]/60 font-sans">Inclusive of all taxes</span>
            </div>
          </div>

          {/* Variant Selectors */}
          <div className="space-y-4">
            {/* Colors */}
            {colors.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                  Color:{' '}
                  <span className="font-normal text-[#111111]/70">
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
                        className={`px-3 py-1.5 text-xs font-space uppercase border cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] text-[#C7F464] border-[#111111] font-bold'
                            : 'bg-white text-[#111111] border-[#111111]/30 hover:border-[#111111]'
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
                  <label className="font-bold uppercase text-[#111111]">
                    Size:{' '}
                    <span className="font-normal text-[#111111]/70">
                      {selectedVariant?.size || 'Select Size'}
                    </span>
                  </label>
                  <Link
                    to="/size-guide"
                    className="flex items-center gap-1 text-[#111111] underline hover:text-[#C7F464] font-semibold"
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
                        className={`py-2 text-xs font-mono border transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-[#111111] text-[#C7F464] border-[#111111] font-bold'
                            : isAvailable
                            ? 'bg-white text-[#111111] border-[#111111]/30 hover:border-[#111111]'
                            : 'bg-[#E8E8E8] text-[#111111]/30 border-transparent cursor-not-allowed line-through'
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
                <span className="inline-block bg-red-100 text-red-800 text-xs font-space font-bold uppercase px-2.5 py-1">
                  Out of Stock
                </span>
              ) : currentStock <= 5 ? (
                <span className="inline-block bg-amber-100 text-amber-900 text-xs font-space font-bold uppercase px-2.5 py-1">
                  ⚡ Only {currentStock} Left in Stock - Order Soon
                </span>
              ) : (
                <span className="inline-block bg-[#C7F464]/30 text-[#111111] text-xs font-space font-bold uppercase px-2.5 py-1">
                  ✓ In Stock ({currentStock} available)
                </span>
              )}
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="pt-4 space-y-3">
              <div className="flex gap-4 items-center">
                <div className="flex items-center border border-[#111111] bg-white">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-3 text-sm hover:bg-[#E8E8E8] font-bold cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-4 py-3 text-sm font-mono font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(currentStock || 1, quantity + 1))}
                    className="px-3 py-3 text-sm hover:bg-[#E8E8E8] font-bold cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <button
                  disabled={isOutOfStock || !selectedVariant}
                  onClick={handleAddToCart}
                  className="flex-1 py-3.5 bg-[#111111] text-[#F7F6F2] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors disabled:bg-[#E8E8E8] disabled:text-[#111111]/40 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ShoppingBag size={16} /> Add To Bag
                </button>

                <button
                  onClick={() => toggleWishlist(product)}
                  className="p-3.5 border border-[#111111] hover:bg-[#111111] hover:text-[#C7F464] transition-colors cursor-pointer"
                  title="Save to Wishlist"
                >
                  <Heart size={18} fill={inWishlist ? '#111111' : 'none'} />
                </button>
              </div>

              {!isOutOfStock && selectedVariant && (
                <button
                  onClick={handleBuyNow}
                  className="w-full py-3.5 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-[#C7F464] transition-colors cursor-pointer"
                >
                  Buy It Now
                </button>
              )}
            </div>
          </div>

          {/* Value Prop Badges */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-[#111111]/10 text-center text-[11px] font-space">
            <div className="p-2 bg-white border border-[#111111]/10">
              <Truck size={16} className="mx-auto mb-1 text-[#111111]" />
              <span>Fast Shipping</span>
            </div>
            <div className="p-2 bg-white border border-[#111111]/10">
              <RotateCcw size={16} className="mx-auto mb-1 text-[#111111]" />
              <span>7 Day Return</span>
            </div>
            <div className="p-2 bg-white border border-[#111111]/10">
              <Shield size={16} className="mx-auto mb-1 text-[#111111]" />
              <span>Verified Quality</span>
            </div>
          </div>

          {/* Product Specifications & Tabs */}
          <div className="border-t border-[#111111]/10 pt-6 space-y-4 font-sans text-xs">
            <div className="flex border-b border-[#111111]/10">
              <button
                onClick={() => setActiveTab('details')}
                className={`pb-2 px-4 font-space font-bold uppercase text-xs border-b-2 cursor-pointer ${
                  activeTab === 'details' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#111111]/50'
                }`}
              >
                Fabric &amp; Specs
              </button>
              <button
                onClick={() => setActiveTab('care')}
                className={`pb-2 px-4 font-space font-bold uppercase text-xs border-b-2 cursor-pointer ${
                  activeTab === 'care' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#111111]/50'
                }`}
              >
                Care Guide
              </button>
              <button
                onClick={() => setActiveTab('shipping')}
                className={`pb-2 px-4 font-space font-bold uppercase text-xs border-b-2 cursor-pointer ${
                  activeTab === 'shipping' ? 'border-[#111111] text-[#111111]' : 'border-transparent text-[#111111]/50'
                }`}
              >
                Delivery Policies
              </button>
            </div>

            <div className="pt-2 leading-relaxed text-[#111111]/80">
              {activeTab === 'details' && (
                <div className="space-y-2">
                  <p>{product.description || 'Crafted with attention to detail and modern fit.'}</p>
                  {product.fabric_material && (
                    <p>
                      <strong className="text-[#111111]">Fabric:</strong> {product.fabric_material}
                    </p>
                  )}
                  {product.fit && (
                    <p>
                      <strong className="text-[#111111]">Fit Profile:</strong> {product.fit}
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
      <div className="bg-white border border-[#111111]/15 p-8 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-[#111111]/10 pb-4">
          <div>
            <h3 className="font-space font-bold text-xl uppercase text-[#111111]">
              Verified Customer Reviews
            </h3>
            <p className="text-xs text-[#111111]/60 font-sans">Real ratings from confirmed buyers</p>
          </div>

          <button
            onClick={() => setShowReviewModal(true)}
            className="px-5 py-2 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors cursor-pointer"
          >
            Write A Review
          </button>
        </div>

        {/* Review Form Modal */}
        {showReviewModal && (
          <form onSubmit={handleReviewSubmit} className="p-4 bg-[#F7F6F2] border border-[#111111] space-y-4">
            <h4 className="font-space font-bold text-xs uppercase">Submit Product Review</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                placeholder="Your Full Name"
                value={reviewerName}
                onChange={(e) => setReviewerName(e.target.value)}
                className="bg-white border border-[#111111] p-2 text-xs focus:outline-none"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs font-space font-bold uppercase">Rating:</span>
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                  className="bg-white border border-[#111111] p-2 text-xs font-space"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                  <option value={3}>⭐⭐⭐ (3/5)</option>
                  <option value={2}>⭐⭐ (2/5)</option>
                  <option value={1}>⭐ (1/5)</option>
                </select>
              </div>
            </div>
            <textarea
              required
              rows={3}
              placeholder="Write your honest feedback on fabric, sizing, comfort, and print durability..."
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              className="w-full bg-white border border-[#111111] p-2 text-xs focus:outline-none"
            />
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="px-4 py-2 bg-gray-200 text-xs font-space uppercase"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#111111] text-[#C7F464] text-xs font-space uppercase font-bold"
              >
                Post Review
              </button>
            </div>
          </form>
        )}

        <div className="text-xs text-[#111111]/70 font-sans italic">
          No reviews yet. Be the first to share your Form &amp; Fit experience!
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="space-y-6 pt-6 border-t border-[#111111]/15">
          <h3 className="font-space font-bold text-xl uppercase tracking-tight text-[#111111]">
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
