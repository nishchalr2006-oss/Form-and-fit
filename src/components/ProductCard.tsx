import React from 'react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useStore } from '../context/StoreContext';
import { ImagePlaceholder } from './ImagePlaceholder';
import { Heart } from 'lucide-react';
import { getFashionFallbackImage } from '../lib/imageOptimization';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { toggleWishlist, isInWishlist } = useStore();
  const inWishlist = isInWishlist(product.id);

  // Main & hover images
  const fallbackUrl = getFashionFallbackImage(product.name, product.category?.name);
  const mainImage =
    product.images?.find((i) => i.is_main)?.url ||
    product.images?.[0]?.url ||
    product.variants?.find((v) => v.variant_image_url)?.variant_image_url ||
    fallbackUrl;
  const secondaryImage = product.images?.[1]?.url;

  // Available stock
  const totalStock = product.variants?.reduce((acc, v) => acc + (v.is_active ? v.stock_quantity : 0), 0) || 0;
  const isOutOfStock = totalStock === 0;

  // Sizes available
  const availableSizes = Array.from(
    new Set(product.variants?.filter((v) => v.is_active && v.stock_quantity > 0 && v.size).map((v) => v.size))
  );

  return (
    <div className="group relative bg-white border border-[#111111]/15 hover:border-[#111111] transition-all duration-300 flex flex-col justify-between rounded-xs overflow-hidden shadow-sm hover:shadow-md">
      <div>
        {/* Image Container */}
        <div className="relative aspect-[3/4] bg-[#F2EFE9] overflow-hidden">
          <Link to={`/product/${product.slug}`} className="block w-full h-full">
            <img
              src={mainImage}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 ${
                secondaryImage ? 'group-hover:opacity-0' : ''
              }`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackUrl;
              }}
            />

            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} preview`}
                className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-500"
              />
            )}
          </Link>

          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
            {product.sale_price && product.sale_price < product.regular_price && (
              <span className="bg-[#C7F464] text-[#111111] text-[10px] font-space font-extrabold uppercase tracking-wider px-2 py-0.5 shadow-xs border border-[#111111]/20">
                SALE
              </span>
            )}
            {isOutOfStock && (
              <span className="bg-red-600 text-white text-[10px] font-space font-bold uppercase tracking-wider px-2 py-0.5">
                SOLD OUT
              </span>
            )}
            {product.featured && !isOutOfStock && (
              <span className="bg-[#111111] text-[#C7F464] text-[10px] font-space font-bold uppercase tracking-wider px-2 py-0.5">
                FEATURED
              </span>
            )}
          </div>

          {/* Wishlist Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist(product);
            }}
            className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-[#111111] text-[#111111] hover:text-[#C7F464] transition-colors rounded-full z-10 cursor-pointer border border-[#111111]/20 shadow-xs"
            aria-label="Save to Wishlist"
          >
            <Heart size={16} fill={inWishlist ? '#111111' : 'none'} className={inWishlist ? 'text-[#111111]' : ''} />
          </button>

          {/* Quick sizes overlay on hover */}
          {availableSizes.length > 0 && !isOutOfStock && (
            <div className="absolute bottom-0 inset-x-0 bg-[#111111]/95 text-white p-2 text-[10px] font-mono flex items-center justify-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span className="uppercase text-[#C7F464] mr-1 font-space font-bold">Sizes:</span>
              {availableSizes.map((sz) => (
                <span key={sz} className="border border-white/30 px-1 py-0.2">
                  {sz}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="p-4 space-y-1 bg-white">
          <div className="text-[10px] font-space font-bold uppercase tracking-wider text-[#111111]/60">
            {product.category?.name || product.gender_collection}
          </div>

          <Link
            to={`/product/${product.slug}`}
            className="font-space font-extrabold text-sm text-[#111111] group-hover:text-[#76C400] transition-colors line-clamp-1 block"
          >
            {product.name}
          </Link>

          {product.fabric_material && (
            <p className="text-[11px] text-[#111111]/70 truncate font-sans font-medium">
              {product.fabric_material}
            </p>
          )}

          {/* Price */}
          <div className="pt-2 flex items-baseline gap-2">
            {product.sale_price ? (
              <>
                <span className="font-space font-extrabold text-sm text-[#111111]">
                  ₹{product.sale_price.toLocaleString('en-IN')}
                </span>
                <span className="font-space text-xs text-[#111111]/40 line-through">
                  ₹{product.regular_price.toLocaleString('en-IN')}
                </span>
              </>
            ) : (
              <span className="font-space font-extrabold text-sm text-[#111111]">
                ₹{product.regular_price.toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
