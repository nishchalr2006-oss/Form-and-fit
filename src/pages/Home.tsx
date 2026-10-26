import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/ProductCard';
import { EmptyCatalogState } from '../components/EmptyCatalogState';
import { fetchFashionImages, FashionPhoto } from '../services/fashionImageService';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  RefreshCw,
  Truck,
  Palette,
  ChevronRight,
  Zap,
} from 'lucide-react';

export const Home: React.FC = () => {
  const { products, categories, storeSettings } = useStore();

  // State for Pexels Editorial Fashion Images
  const [heroPhotos, setHeroPhotos] = useState<FashionPhoto[]>([]);
  const [categoryPhotos, setCategoryPhotos] = useState<Record<string, string>>({});
  const [loadingHero, setLoadingHero] = useState<boolean>(true);

  useEffect(() => {
    async function loadCampaignPhotography() {
      // 1. Load Hero Campaign Photos
      const heroRes = await fetchFashionImages('hero-campaign', 4);
      if (heroRes.photos && heroRes.photos.length > 0) {
        setHeroPhotos(heroRes.photos);
      }

      // 2. Load Category Banner Photos
      const categoryKeys = [
        'mens-fashion',
        'womens-fashion',
        'kids-fashion',
        'unisex',
        'tshirts',
        'hoodies',
        'bottom-wear',
        'custom-studio',
      ];

      const photoMap: Record<string, string> = {};
      for (const key of categoryKeys) {
        const res = await fetchFashionImages(key, 1);
        if (res.photos && res.photos[0]?.url) {
          photoMap[key] = res.photos[0].url;
        }
      }
      setCategoryPhotos(photoMap);
      setLoadingHero(false);
    }

    loadCampaignPhotography();
  }, []);

  const publishedProducts = products.filter((p) => p.status === 'published');
  const featuredProducts = publishedProducts.filter((p) => p.featured);
  const newArrivals = publishedProducts.slice(0, 8);

  // Category Cards Configuration
  const categoryCards = [
    {
      id: 'mens',
      title: "Men's Fashion",
      desc: 'Structured jackets, tailored shirts, and modern essentials.',
      link: '/shop?gender=Men',
      imageKey: 'mens-fashion',
      fallbackImg: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'womens',
      title: "Women's Fashion",
      desc: 'Editorial coats, chic tops, and contemporary co-ords.',
      link: '/shop?gender=Women',
      imageKey: 'womens-fashion',
      fallbackImg: 'https://images.pexels.com/photos/1462637/pexels-photo-1462637.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'unisex',
      title: 'Unisex Streetwear',
      desc: 'Heavyweight oversized tees, relaxed fits, and urban essentials.',
      link: '/shop?gender=Unisex',
      imageKey: 'unisex',
      fallbackImg: 'https://images.pexels.com/photos/1018911/pexels-photo-1018911.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'kids',
      title: "Kids' Clothing",
      desc: 'Comfortable, durable cotton apparel for young style icons.',
      link: '/shop?category=cat-1',
      imageKey: 'kids-fashion',
      fallbackImg: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'tshirts',
      title: 'T-Shirts & Tops',
      desc: '240 GSM combed cotton tees and elevated everyday basewear.',
      link: '/shop?category=cat-4',
      imageKey: 'tshirts',
      fallbackImg: 'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'hoodies',
      title: 'Hoodies & Sweatshirts',
      desc: '380 GSM fleece pullover hoodies and structured outerwear.',
      link: '/shop?category=cat-5',
      imageKey: 'hoodies',
      fallbackImg: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'bottoms',
      title: 'Jeans & Bottom Wear',
      desc: 'Tailored trousers, cargo pants, and raw denim jeans.',
      link: '/shop?category=cat-6',
      imageKey: 'bottom-wear',
      fallbackImg: 'https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
    {
      id: 'custom',
      title: 'Custom T-Shirt Studio',
      desc: 'Design personalized graphics, text prints, and bespoke tees.',
      link: '/custom-studio',
      imageKey: 'custom-studio',
      fallbackImg: 'https://images.pexels.com/photos/2294342/pexels-photo-2294342.jpeg?auto=compress&cs=tinysrgb&w=800',
    },
  ];

  return (
    <div className="space-y-12 sm:space-y-16 pb-16 font-sans text-[#111111]">
      {/* Hero Campaign Section */}
      <section className="relative bg-[#F2EFE9] border-b border-[#E5E3DD] text-[#111111] overflow-hidden min-h-[85vh] flex items-center pt-4 lg:pt-0">
        {/* Soft Background Ambient Light Glows */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#C7F464]/25 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-[#C8B9FF]/20 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20 relative z-10 w-full">
          {/* Outer Illuminated Campaign Card Container */}
          <div className="bg-white border border-[#111111]/15 p-5 sm:p-8 lg:p-10 rounded-xs shadow-xl backdrop-blur-md relative overflow-hidden">
            {/* Corner Decorative Accent Lines */}
            <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#111111] pointer-events-none" />
            <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-[#111111] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-[#111111] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#111111] pointer-events-none" />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Copy Column */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-6 space-y-5 sm:space-y-6"
              >
                <div className="inline-flex items-center gap-2 bg-[#C7F464] text-[#111111] font-space font-extrabold text-[10px] sm:text-[11px] uppercase tracking-widest px-3 py-1 border border-[#111111]/20 shadow-sm">
                  <Zap size={13} /> 2026 EDITORIAL CAMPAIGN
                </div>

                <h1 className="font-space font-extrabold text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter leading-none text-[#111111]">
                  FIND YOUR <span className="text-[#C7F464] bg-[#111111] px-2.5 py-0.5 inline-block rounded-xs">FIT</span>.<br />
                  DEFINE YOUR <span className="text-[#C7F464] bg-[#111111] px-2.5 py-0.5 inline-block rounded-xs">FORM</span>.
                </h1>

                <p className="text-xs sm:text-base text-[#111111]/80 max-w-lg leading-relaxed font-sans font-medium">
                  {storeSettings.hero_subtitle ||
                    'Everyday essentials, statement pieces, and custom creations designed around your style.'}
                </p>

                {/* Mobile Above-The-Fold Editorial Model Spotlight Card (Visible on Mobile Screens) */}
                <div className="lg:hidden block relative aspect-[16/9] sm:aspect-[21/9] bg-[#EAE6E1] border border-[#111111]/20 overflow-hidden shadow-md rounded-xs my-3">
                  <img
                    src={
                      storeSettings.hero_image_url ||
                      heroPhotos[0]?.url ||
                      'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800'
                    }
                    alt="Editorial Model Fashion"
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-2 left-3 right-3 flex justify-between items-end">
                    <div>
                      <span className="bg-[#111111] text-[#C7F464] text-[9px] font-space font-bold uppercase px-2 py-0.5 border border-[#C7F464]/40">
                        ATELIER COLLECTION
                      </span>
                      <p className="font-space font-extrabold text-xs text-white uppercase mt-0.5">240 GSM Combed Cotton</p>
                    </div>
                    <span className="text-[10px] font-space text-[#C7F464] font-bold">2026 DROP</span>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="pt-1 flex flex-col sm:flex-row gap-3 sm:gap-4">
                  <Link
                    to="/shop"
                    className="bg-[#C7F464] text-[#111111] hover:bg-[#b8ea4e] px-6 sm:px-8 py-3.5 sm:py-4 flex items-center justify-center gap-2 cursor-pointer shadow-md text-xs font-space font-extrabold tracking-wider uppercase border border-[#111111]/20 rounded-xs transition-all hover:translate-y-[-1px]"
                  >
                    SHOP THE COLLECTION <ArrowRight size={16} />
                  </Link>
                  <Link
                    to="/custom-studio"
                    className="px-6 sm:px-8 py-3.5 sm:py-4 bg-white text-[#111111] border border-[#111111] font-space font-bold text-xs uppercase tracking-widest hover:bg-[#111111] hover:text-[#C7F464] transition-all flex items-center justify-center gap-2 cursor-pointer rounded-xs shadow-sm"
                  >
                    <Palette size={16} /> CREATE CUSTOM T-SHIRT
                  </Link>
                </div>

                {/* Micro spec tags */}
                <div className="flex items-center gap-2 pt-2 text-[10px] font-space text-[#111111]/70 uppercase tracking-wider font-bold">
                  <span className="text-[#111111] bg-[#C7F464] px-1.5 py-0.5 font-extrabold">✓ 100% INSPECTED FIT</span>
                  <span>·</span>
                  <span>240 GSM COTTON</span>
                  <span>·</span>
                  <span>EXPRESS DISPATCH</span>
                </div>
              </motion.div>

              {/* Right Fashion Model Photography Display (Desktop & Tablet) */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="hidden lg:grid col-span-6 grid-cols-2 gap-4 relative"
              >
                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-[#16161B] border border-white/20 overflow-hidden relative shadow-2xl group rounded-xs hover:border-[#C7F464] transition-all">
                    <img
                      src={
                        storeSettings.hero_image_url ||
                        heroPhotos[0]?.url ||
                        'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800'
                      }
                      alt="Editorial Model Fashion"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <span className="bg-[#111111] text-[#C7F464] text-[9px] font-space font-bold uppercase px-2 py-0.5 border border-[#C7F464]/30">
                        EDITORIAL
                      </span>
                      <p className="font-space font-bold text-xs text-white uppercase mt-1">Structured Outerwear</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-8">
                  <div className="aspect-[3/4] bg-[#16161B] border border-white/20 overflow-hidden relative shadow-2xl group rounded-xs hover:border-[#C7F464] transition-all">
                    <img
                      src={
                        heroPhotos[1]?.url ||
                        'https://images.pexels.com/photos/157675/fashion-men-s-individuality-black-and-white-157675.jpeg?auto=compress&cs=tinysrgb&w=800'
                      }
                      alt="Monochrome Fashion"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-80" />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                      <span className="bg-[#C8B9FF] text-[#111111] text-[9px] font-space font-bold uppercase px-2 py-0.5">
                        MONOCHROME
                      </span>
                      <p className="font-space font-bold text-xs text-white uppercase mt-1">240 GSM Cottons</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive High-Fashion Marquee Ticker */}
      <div className="bg-[#111116] border-y border-[#C7F464]/30 py-3 overflow-hidden select-none">
        <div className="flex space-x-8 whitespace-nowrap animate-marquee font-space text-xs font-black uppercase tracking-widest text-[#C7F464]">
          <span className="flex items-center gap-2">★ FORM &amp; FIT ATELIER</span>
          <span className="text-white/40">·</span>
          <span>240 GSM HEAVYWEIGHT COMBED COTTON</span>
          <span className="text-white/40">·</span>
          <span className="text-white">INTERACTIVE 2D CUSTOM STUDIO</span>
          <span className="text-white/40">·</span>
          <span>EXPRESS COURIER DISPATCH INDIA</span>
          <span className="text-white/40">·</span>
          <span>7-DAY EASY SIZE EXCHANGE</span>
          <span className="text-white/40">·</span>
          <span className="flex items-center gap-2">★ FORM &amp; FIT ATELIER</span>
          <span className="text-white/40">·</span>
          <span>240 GSM HEAVYWEIGHT COMBED COTTON</span>
          <span className="text-white/40">·</span>
          <span className="text-white">INTERACTIVE 2D CUSTOM STUDIO</span>
        </div>
      </div>

      {/* Value Guarantee Badges */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 p-4 sm:p-6 bg-white border border-[#111111]/15 text-center shadow-md rounded-xs hover:border-[#111111] transition-all">
          <div className="space-y-1.5 p-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#C7F464] border border-[#111111]/20 flex items-center justify-center text-[#111111] shadow-xs">
              <Truck size={20} />
            </div>
            <h4 className="font-space font-bold text-xs uppercase text-[#111111]">Express Shipping</h4>
            <p className="text-[11px] text-[#111111]/70 font-sans font-medium">Free on orders over ₹1,999</p>
          </div>
          <div className="space-y-1.5 p-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#C7F464] border border-[#111111]/20 flex items-center justify-center text-[#111111] shadow-xs">
              <RefreshCw size={20} />
            </div>
            <h4 className="font-space font-bold text-xs uppercase text-[#111111]">Hassle-Free Exchanges</h4>
            <p className="text-[11px] text-[#111111]/70 font-sans font-medium">7-day fit replacement guarantee</p>
          </div>
          <div className="space-y-1.5 p-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#C7F464] border border-[#111111]/20 flex items-center justify-center text-[#111111] shadow-xs">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-space font-bold text-xs uppercase text-[#111111]">Inspected Quality</h4>
            <p className="text-[11px] text-[#111111]/70 font-sans font-medium">100% verified fabrics &amp; stitching</p>
          </div>
          <div className="space-y-1.5 p-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-[#C7F464] border border-[#111111]/20 flex items-center justify-center text-[#111111] shadow-xs">
              <Sparkles size={20} />
            </div>
            <h4 className="font-space font-bold text-xs uppercase text-[#111111]">Custom T-Shirt Studio</h4>
            <p className="text-[11px] text-[#111111]/70 font-sans font-medium">Bespoke artwork &amp; typography</p>
          </div>
        </div>
      </section>

      {/* Image-Led Fashion Category Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-[#111111]/15 pb-4">
          <div>
            <span className="text-[10px] font-space font-extrabold uppercase tracking-widest text-[#111111] bg-[#C7F464] px-2 py-0.5">
              CURATED WARDROBE
            </span>
            <h2 className="font-space font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#111111] mt-1">
              Explore Fashion Categories
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-space font-bold uppercase tracking-wider text-[#111111] hover:text-[#76C400] transition-colors flex items-center gap-1"
          >
            View All Categories <ChevronRight size={14} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryCards.map((card, idx) => {
            const bgImage = categoryPhotos[card.imageKey] || card.fallbackImg;

            return (
              <motion.div
                key={card.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
              >
                <Link
                  to={card.link}
                  className="group relative block aspect-[3/4] bg-[#121216] overflow-hidden border border-[#111111]/20 hover:border-[#111111] transition-all shadow-md rounded-xs"
                >
                  {/* Image */}
                  <img
                    src={bgImage}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Card Content */}
                  <div className="absolute inset-0 p-5 flex flex-col justify-between text-white z-10">
                    <div className="flex justify-between items-start">
                      <span className="bg-[#111111] text-[#C7F464] font-space font-bold text-[10px] uppercase px-2.5 py-0.5 border border-[#C7F464]/40">
                        {card.title.split(' ')[0]}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-[#C7F464] group-hover:text-[#111111] flex items-center justify-center transition-colors">
                        <ArrowRight size={16} />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-space font-extrabold text-xl uppercase tracking-tight text-white group-hover:text-[#C7F464] transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs text-white/80 font-sans line-clamp-2 leading-relaxed">
                        {card.desc}
                      </p>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Custom T-Shirt Studio Highlight Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111111] border border-[#111111] p-8 lg:p-12 text-[#F7F6F2] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl rounded-xs relative overflow-hidden">
          {/* Subtle Backlight */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#C7F464]/15 rounded-full blur-[80px] pointer-events-none" />

          <div className="space-y-4 max-w-xl z-10">
            <span className="bg-[#C7F464] text-[#111111] font-space font-extrabold text-[10px] uppercase tracking-widest px-3 py-1">
              INTERACTIVE 2D CUSTOM STUDIO
            </span>
            <h3 className="font-space font-extrabold text-3xl sm:text-4xl uppercase tracking-tight leading-none text-white">
              DESIGN YOUR PERSONAL <span className="text-[#C7F464]">CUSTOM T-SHIRT</span>
            </h3>
            <p className="text-xs sm:text-sm text-[#F7F6F2]/80 font-sans leading-relaxed">
              Upload custom artwork, add personalized typography, select shirt colors, and order custom printed tees crafted from 100% premium combed cotton.
            </p>
          </div>

          <Link
            to="/custom-studio"
            className="shrink-0 px-8 py-4 bg-[#C7F464] text-[#111111] font-space font-extrabold text-xs uppercase tracking-widest hover:bg-white hover:text-[#111111] transition-all shadow-md cursor-pointer flex items-center gap-2 rounded-xs z-10"
          >
            <Palette size={18} /> LAUNCH CUSTOM STUDIO <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Product Catalog Grid / Empty State */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex justify-between items-end border-b border-[#111111]/15 pb-4">
          <div>
            <span className="text-[10px] font-space font-extrabold uppercase tracking-widest text-[#111111] bg-[#C7F464] px-2 py-0.5">
              CURATED WARDROBE
            </span>
            <h2 className="font-space font-extrabold text-2xl sm:text-3xl uppercase tracking-tight text-[#111111] mt-1">
              New Arrivals &amp; Drops
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-xs font-space font-bold uppercase tracking-wider text-[#111111] hover:text-[#76C400] transition-colors flex items-center gap-1"
          >
            Shop Full Catalog <ChevronRight size={14} />
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
      <section className="bg-white border-y border-[#111111]/15 py-16 text-[#111111]">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <span className="font-space font-bold text-xs uppercase tracking-widest text-[#111111] bg-[#C7F464] px-2 py-0.5">
            THE FORM &amp; FIT PHILOSOPHY
          </span>
          <h2 className="font-space font-extrabold text-3xl uppercase tracking-tight text-[#111111]">
            WEAR YOUR IDENTITY WITH CONFIDENCE
          </h2>
          <p className="text-sm text-[#111111]/80 leading-relaxed font-sans max-w-2xl mx-auto font-medium">
            Every garment in our owner-managed store is inspected for fabric density, stitching endurance, and ergonomic fit. Whether you choose our ready-to-wear essentials or custom prints, Form &amp; Fit gives you control over your personal presentation.
          </p>
        </div>
      </section>
    </div>
  );
};
