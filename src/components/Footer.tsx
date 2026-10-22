import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook, ArrowRight, Check } from 'lucide-react';

export const Footer: React.FC = () => {
  const { storeSettings, categories } = useStore();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#111111] text-[#F7F6F2] pt-16 pb-12 border-t border-[#111111]/20 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-white/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-space font-extrabold text-2xl uppercase tracking-tighter text-[#F7F6F2]">
                FORM &amp; FIT
              </span>
              <span className="block text-[10px] font-space tracking-widest text-[#C7F464] uppercase">
                Modern Apparel &amp; Personalization
              </span>
            </Link>
            <p className="text-xs text-[#E8E8E8]/70 leading-relaxed max-w-sm">
              Form &amp; Fit blends high-grade materials with contemporary tailoring. Designed for modern living, college lifestyle, and individual expression.
            </p>

            <div className="pt-2 flex items-center space-x-4 text-[#E8E8E8]">
              <a href="#" className="hover:text-[#C7F464] transition-colors" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="#" className="hover:text-[#C7F464] transition-colors" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="#" className="hover:text-[#C7F464] transition-colors" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Categories Col */}
          <div className="space-y-3">
            <h4 className="font-space font-bold uppercase text-xs tracking-wider text-[#C7F464]">
              Collections
            </h4>
            <ul className="space-y-2 text-xs text-[#E8E8E8]/80">
              <li>
                <Link to="/shop?gender=Men" className="hover:text-[#F7F6F2] transition-colors">
                  Men's Fashion
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Women" className="hover:text-[#F7F6F2] transition-colors">
                  Women's Fashion
                </Link>
              </li>
              <li>
                <Link to="/shop?gender=Unisex" className="hover:text-[#F7F6F2] transition-colors">
                  Unisex Essentials
                </Link>
              </li>
              <li>
                <Link to="/custom-studio" className="hover:text-[#C7F464] transition-colors font-semibold">
                  Custom T-Shirt Studio
                </Link>
              </li>
              {categories.slice(0, 3).map((cat) => (
                <li key={cat.id}>
                  <Link to={`/shop?category=${cat.id}`} className="hover:text-[#F7F6F2] transition-colors">
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Care Col */}
          <div className="space-y-3">
            <h4 className="font-space font-bold uppercase text-xs tracking-wider text-[#C7F464]">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-[#E8E8E8]/80">
              <li>
                <Link to="/size-guide" className="hover:text-[#F7F6F2] transition-colors">
                  Size Guide &amp; Fit
                </Link>
              </li>
              <li>
                <Link to="/policies/shipping" className="hover:text-[#F7F6F2] transition-colors">
                  Shipping &amp; Delivery
                </Link>
              </li>
              <li>
                <Link to="/policies/returns" className="hover:text-[#F7F6F2] transition-colors">
                  Returns &amp; Exchanges
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#F7F6F2] transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-[#F7F6F2] transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-[#F7F6F2] transition-colors">
                  Terms &amp; Conditions
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter Col */}
          <div className="space-y-3">
            <h4 className="font-space font-bold uppercase text-xs tracking-wider text-[#C7F464]">
              Newsletter
            </h4>
            <p className="text-xs text-[#E8E8E8]/70">
              Subscribe to get special drop alerts, VIP access, and promo codes.
            </p>

            {subscribed ? (
              <div className="bg-[#C7F464] text-[#111111] p-3 text-xs font-space font-bold flex items-center gap-2">
                <Check size={16} /> Subscribed to Form &amp; Fit drops!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="flex border border-white/20 focus-within:border-[#C7F464]">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-transparent px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none w-full"
                  />
                  <button
                    type="submit"
                    className="bg-[#C7F464] text-[#111111] px-3 hover:bg-white transition-colors cursor-pointer"
                    aria-label="Subscribe"
                  >
                    <ArrowRight size={16} />
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#E8E8E8]/50 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} Form &amp; Fit. All rights reserved. All prices in INR (₹).</p>
          <div className="flex items-center space-x-6">
            <Link to="/owner/login" className="hover:text-[#C7F464] transition-colors font-space uppercase">
              Owner Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
