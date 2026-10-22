import React from 'react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { Heart, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';

export const WishlistPage: React.FC = () => {
  const { wishlist } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="border-b border-[#111111]/15 pb-4 flex justify-between items-end">
        <div>
          <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
            Saved Preferences
          </span>
          <h1 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
            My Wishlist ({wishlist.length})
          </h1>
        </div>
      </div>

      {wishlist.length === 0 ? (
        <div className="max-w-2xl mx-auto my-12 p-12 bg-white border border-[#111111] text-center space-y-4">
          <Heart size={48} className="mx-auto text-[#111111]/30" />
          <h2 className="font-space font-bold text-xl uppercase">Your Wishlist is Empty</h2>
          <p className="text-xs text-[#111111]/60 font-sans max-w-sm mx-auto">
            Save your favorite statement pieces, custom tees, and footwear to review them later.
          </p>
          <Link
            to="/shop"
            className="inline-block px-6 py-3 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((item) => (
            <ProductCard key={item.id} product={item.product} />
          ))}
        </div>
      )}
    </div>
  );
};
