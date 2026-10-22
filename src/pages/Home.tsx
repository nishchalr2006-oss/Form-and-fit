import React from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { EmptyCatalogState } from '../components/EmptyCatalogState';
import { ArrowRight, Sparkles, Shield, RefreshCw, Truck, Palette } from 'lucide-react';

export const Home: React.FC = () => {
  const { products, categories, storeSettings } = useStore();

  const publishedProducts = products.filter((p) => p.status === 'published');
  const featuredProducts = publishedProducts.filter((p) => p.featured);
  const newArrivals = publishedProducts.slice(0, 8);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative bg-[#111111] text-[#F7F6F2] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <span className="inline-block bg-[#C7F464] text-[#111111] font-space font-extrabold text-[11px] uppercase tracking-widest px-3 py-1">
                2026 EDITION
              </span>

              <h1 className="font-space font-extrabold text-4xl sm:text-5xl lg:text-6xl uppercase tracking-tighter leading-none text-[#F7F6F2]">
                {storeSettings.hero_headline || 'FIND YOUR FIT. DEFINE YOUR FORM.'}
              </h1>

              <p className="text-sm sm:text-base text-[#E8E8E8]/80 max-w-lg leading-relaxed font-sans">
                {storeSettings.hero_subtitle ||
                  'Everyday essentials, statement pieces, and custom creations designed around your style.'}
              </p>

              <div className="pt-2 flex flex-col sm:flex-row gap-4">
                <Link
                  to="/shop"
                  className="px-8 py-4 bg-[#C7F464] text-[#111111] font-space font-bold text-xs uppercase tracking-widest hover:bg-white transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  Shop The Collection <ArrowRight size={16} />
                </Link>
                <Link
                  to="/custom-studio"
                  className="px-8 py-4 bg-transparent text-[#F7F6F2] border border-[#F7F6F2]/40 font-space font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-[#111111] transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Palette size={16} /> Create Your Own T-Shirt
                </Link>
              </div>
            </div>

            {/* Hero Visual Area */}
            <div className="relative">
              {storeSettings.hero_image_url ? (
                <div className="aspect-[4/5] bg-[#E8E8E8] border border-white/20 overflow-hidden shadow-2xl">
                  <img
                    src={storeSettings.hero_image_url}
                    alt="Form & Fit Hero"
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[4/5] bg-[#1A1A1A] border border-white/10 p-8 flex flex-col justify-between relative">
                  <div className="border border-white/20 p-6 h-full flex flex-col justify-center items-center text-center space-y-4">
                    <span className="font-space text-xs uppercase tracking-widest text-[#C7F464]">
                      FORM &amp; FIT STUDIO
                    </span>
                    <h2 className="font-space font-bold text-3xl uppercase text-white tracking-tight">
                      NEW ARRIVALS
                    </h2>
                    <p className="text-xs text-white/60 max-w-xs font-sans">
                      Owner-curated collection of premium cotton tees, structured outerwear, and bespoke apparel.
                    </p>
                    <div className="pt-4">
                      <Link
                        to="/shop"
                        className="text-xs font-space font-bold uppercase underline underline-offset-4 text-[#C7F464]"
                      >
                        Explore Catalog
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 bg-white border border-[#111111]/10 text-center">
          <div className="space-y-1">
            <Truck size={24} className="mx-auto text-[#111111]" />
            <h4 className="font-space font-bold text-xs uppercase">Express Shipping</h4>
            <p className="text-[11px] text-[#111111]/60">Free on orders above ₹1,999</p>
          </div>
          <div className="space-y-1">
            <RefreshCw size={24} className="mx-auto text-[#111111]" />
            <h4 className="font-space font-bold text-xs uppercase">Hassle-Free Returns</h4>
            <p className="text-[11px] text-[#111111]/60">7-day replacement guarantee</p>
          </div>
          <div className="space-y-1">
            <Shield size={24} className="mx-auto text-[#111111]" />
            <h4 className="font-space font-bold text-xs uppercase">100% Authentic</h4>
            <p className="text-[11px] text-[#111111]/60">Owner-verified craftsmanship</p>
          </div>
          <div className="space-y-1">
            <Sparkles size={24} className="mx-auto text-[#111111]" />
            <h4 className="font-space font-bold text-xs uppercase">Custom Design Studio</h4>
            <p className="text-[11px] text-[#111111]/60">Create custom printed t-shirts</p>
          </div>
        </div>
      </section>

      {/* Featured Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b border-[#111111]/15 pb-4">
          <div>
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
              Browse By Category
            </span>
            <h2 className="font-space font-bold text-2xl uppercase tracking-tight text-[#111111]">
              Explore Collections
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-space font-bold uppercase tracking-wider underline hover:text-[#C7F464] transition-colors"
          >
            View All Categories
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.id}`}
              className="group relative bg-[#E8E8E8] border border-[#111111]/10 p-6 flex flex-col justify-between h-40 hover:bg-[#111111] hover:text-[#F7F6F2] transition-colors"
            >
              <div className="flex justify-between items-start">
                <span className="font-space font-bold text-lg uppercase group-hover:text-[#C7F464]">
                  {cat.name}
                </span>
                <ArrowRight size={18} className="opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[11px] text-[#111111]/60 group-hover:text-white/70 line-clamp-2 font-sans">
                {cat.description || 'Discover curated pieces'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Custom T-Shirt Banner CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#C8B9FF] border border-[#111111] p-8 lg:p-12 text-[#111111] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-3 max-w-xl">
            <span className="bg-[#111111] text-[#C8B9FF] font-space font-bold text-[10px] uppercase tracking-widest px-2.5 py-1">
              INTERACTIVE APPAREL STUDIO
            </span>
            <h3 className="font-space font-bold text-3xl uppercase tracking-tight">
              Design Your Personal Custom T-Shirt
            </h3>
            <p className="text-xs sm:text-sm text-[#111111]/80 font-sans leading-relaxed">
              Upload custom graphics, add personalized typography, pick colors, and order custom printed t-shirts crafted from 100% premium combed cotton.
            </p>
          </div>

          <Link
            to="/custom-studio"
            className="shrink-0 px-8 py-4 bg-[#111111] text-[#C7F464] font-space font-bold text-xs uppercase tracking-widest hover:bg-white hover:text-[#111111] transition-colors cursor-pointer"
          >
            Launch Studio <ArrowRight size={16} className="inline ml-1" />
          </Link>
        </div>
      </section>

      {/* Product Catalog Grid / Empty State */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex justify-between items-end border-b border-[#111111]/15 pb-4">
          <div>
            <span className="text-[10px] font-space font-bold uppercase tracking-widest text-[#111111]/50">
              Curated Catalog
            </span>
            <h2 className="font-space font-bold text-2xl uppercase tracking-tight text-[#111111]">
              New Arrivals &amp; Drops
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-space font-bold uppercase tracking-wider underline hover:text-[#C7F464] transition-colors"
          >
            Shop All Catalog
          </Link>
        </div>

        {publishedProducts.length === 0 ? (
          <EmptyCatalogState />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Brand Ethos */}
      <section className="bg-white border-y border-[#111111]/15 py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <span className="font-space font-bold text-xs uppercase tracking-widest text-[#111111]/50">
            THE FORM &amp; FIT PHILOSOPHY
          </span>
          <h2 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
            WEAR YOUR IDENTITY WITH CONFIDENCE
          </h2>
          <p className="text-sm text-[#111111]/70 leading-relaxed font-sans max-w-2xl mx-auto">
            Every garment in our owner-managed store is inspected for fabric density, stitching endurance, and ergonomic fit. Whether you choose our ready-to-wear essentials or custom prints, Form &amp; Fit gives you control over your personal presentation.
          </p>
        </div>
      </section>
    </div>
  );
};
