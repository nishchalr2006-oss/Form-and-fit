import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { CartDrawer } from './CartDrawer';
import { SupabaseBanner } from './SupabaseBanner';
import {
  ShoppingBag,
  Heart,
  User,
  Search,
  Menu,
  X,
  ShieldCheck,
  Palette,
  ChevronRight,
  LogOut,
  Zap,
  Sparkles,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { cart, wishlist, storeSettings, categories } = useStore();
  const { user, isOwner, isAdmin, logout } = useAuth();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-[#0A0A0C]/95 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
      {/* Supabase status indicator banner */}
      <SupabaseBanner />

      {/* LINE 1: Multi-color animated stream line moving from LEFT to RIGHT in dashboard theme colors */}
      <div className="header-line-stream-ltr" />

      {/* THE OFFER LINE: Animated marquee ticker moving in the OPPOSITE direction (RIGHT to LEFT) */}
      <div className="bg-[#0E0E14] border-b border-white/5 py-1.5 px-3 overflow-hidden select-none relative">
        <div className="animate-marquee-rtl flex items-center space-x-8 text-[11px] font-space font-extrabold uppercase tracking-widest text-[#F7F6F2]">
          <span className="flex items-center gap-1.5 text-[#C7F464] shrink-0">
            <Zap size={12} className="text-[#C7F464] animate-pulse" />
            {storeSettings.announcement_text || "FLASH OFFER: USE CODE 'FORM10' FOR 10% OFF"}
          </span>
          <span className="text-[#C8B9FF]/40">✦</span>
          <span className="text-[#C8B9FF] flex items-center gap-1 shrink-0">
            <Sparkles size={12} /> FREE EXPRESS COURIER SHIPPING OVER ₹1,999
          </span>
          <span className="text-[#C7F464]/40">✦</span>
          <span className="text-[#70FFB8] shrink-0">240 GSM HEAVYWEIGHT COMBED COTTON DROP</span>
          <span className="text-white/30">✦</span>
          <span className="text-white shrink-0">INTERACTIVE 2D CUSTOM STUDIO LIVE</span>
          <span className="text-[#C8B9FF]/40">✦</span>
          <span className="text-[#C7F464] shrink-0">7-DAY HASSLE-FREE FIT &amp; SIZE EXCHANGE</span>
          <span className="text-[#70FFB8]/40">✦</span>

          {/* Duplicate segment for continuous seamless infinite loop */}
          <span className="flex items-center gap-1.5 text-[#C7F464] shrink-0">
            <Zap size={12} className="text-[#C7F464] animate-pulse" />
            {storeSettings.announcement_text || "FLASH OFFER: USE CODE 'FORM10' FOR 10% OFF"}
          </span>
          <span className="text-[#C8B9FF]/40">✦</span>
          <span className="text-[#C8B9FF] flex items-center gap-1 shrink-0">
            <Sparkles size={12} /> FREE EXPRESS COURIER SHIPPING OVER ₹1,999
          </span>
          <span className="text-[#C7F464]/40">✦</span>
          <span className="text-[#70FFB8] shrink-0">240 GSM HEAVYWEIGHT COMBED COTTON DROP</span>
          <span className="text-white/30">✦</span>
          <span className="text-white shrink-0">INTERACTIVE 2D CUSTOM STUDIO LIVE</span>
          <span className="text-[#C8B9FF]/40">✦</span>
          <span className="text-[#C7F464] shrink-0">7-DAY HASSLE-FREE FIT &amp; SIZE EXCHANGE</span>
          <span className="text-[#70FFB8]/40">✦</span>
        </div>
      </div>

      {/* LINE 2: Multi-color animated stream line moving from RIGHT to LEFT in dashboard theme colors */}
      <div className="header-line-stream-rtl" />

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#F7F6F2] hover:text-[#C7F464] transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link to="/" className="inline-block group">
              <span className="font-space font-extrabold text-xl sm:text-2xl uppercase tracking-tighter text-[#F7F6F2] group-hover:text-[#C7F464] transition-colors">
                FORM &amp; FIT
              </span>
              <span className="block text-[9px] font-space tracking-widest text-[#C7F464]/80 uppercase -mt-1">
                Fashion &amp; Custom Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-space font-semibold uppercase tracking-wider text-[#F7F6F2]">
            <Link to="/" className="hover:text-[#C7F464] transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-[#C7F464] transition-colors">
              Shop All
            </Link>
            <Link to="/shop?gender=Men" className="hover:text-[#C7F464] transition-colors">
              Men
            </Link>
            <Link to="/shop?gender=Women" className="hover:text-[#C7F464] transition-colors">
              Women
            </Link>
            <Link to="/shop?gender=Unisex" className="hover:text-[#C7F464] transition-colors">
              Unisex
            </Link>
            <Link
              to="/custom-studio"
              className="flex items-center gap-1 text-[#111111] bg-[#C7F464] px-3 py-1.5 font-extrabold hover:bg-white hover:shadow-[0_0_15px_#C7F464] transition-all cursor-pointer rounded-xs"
            >
              <Palette size={13} /> Custom Studio
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#F7F6F2] hover:text-[#C7F464] transition-colors cursor-pointer"
              aria-label="Search store"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-[#F7F6F2] hover:text-[#C7F464] transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#C7F464] text-[#111111] text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#F7F6F2] hover:text-[#C7F464] transition-colors relative cursor-pointer"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C7F464] text-[#111111] text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-[0_0_8px_#C7F464]">
                  {totalCartCount}
                </span>
              )}
            </button>

            {/* Account / Admin Menu Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className={`p-2 transition-colors cursor-pointer border rounded-none ${
                  isAdmin
                    ? 'border-[#C7F464] bg-[#111116] text-[#C7F464] shadow-[0_0_10px_rgba(199,244,100,0.3)]'
                    : 'border-transparent text-[#F7F6F2] hover:text-[#C7F464]'
                }`}
                title={user ? `${user.full_name || user.email}` : 'Account'}
              >
                {isAdmin ? <ShieldCheck size={20} /> : <User size={20} />}
              </button>

              {/* User Menu Popup */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-[#121216] border border-white/20 shadow-2xl py-2 z-50 text-xs font-space text-[#F7F6F2]"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {isAdmin && (
                    <div className="px-3 py-1.5 bg-[#C7F464] text-[#111111] font-bold uppercase tracking-wider text-[10px] flex items-center justify-between mb-1">
                      <span>Store Owner Privileges</span>
                      <ShieldCheck size={12} />
                    </div>
                  )}

                  {user ? (
                    <div className="px-3 py-2 border-b border-white/10">
                      <p className="font-bold text-[#F7F6F2] truncate">{user.full_name || 'Customer'}</p>
                      <p className="text-[11px] text-[#F7F6F2]/60 truncate">{user.email}</p>
                    </div>
                  ) : null}

                  {isAdmin && (
                    <Link
                      to="/owner/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 bg-[#1A1A22] hover:bg-[#C7F464] hover:text-[#111111] font-bold text-[#C7F464] uppercase tracking-wider transition-colors"
                    >
                      <span>Owner Dashboard</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}

                  <Link
                    to="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-white/10 text-[#F7F6F2] uppercase tracking-wider"
                  >
                    My Account &amp; Orders
                  </Link>

                  {!user && (
                    <Link
                      to="/owner/login"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-[#C7F464] hover:text-[#111111] font-bold text-[#C7F464] uppercase tracking-wider"
                    >
                      Owner / Admin Login
                    </Link>
                  )}

                  {user && (
                    <button
                      onClick={() => {
                        logout();
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-400 hover:bg-red-950/40 font-semibold uppercase tracking-wider border-t border-white/10 mt-1 cursor-pointer"
                    >
                      <LogOut size={14} /> Sign Out
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Search Input Bar */}
      {isSearchOpen && (
        <div className="border-t border-white/10 bg-[#121216]/95 backdrop-blur-md p-4 shadow-2xl">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Search products by title, fabric, category, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-[#1A1A22] border border-white/20 px-4 py-2 text-sm text-white placeholder-white/40 focus:outline-none focus:border-[#C7F464] rounded-xs"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#C7F464] text-[#111111] font-space text-xs font-extrabold uppercase tracking-widest hover:bg-white transition-colors cursor-pointer rounded-xs"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-white/10 bg-[#0E0E12]/95 backdrop-blur-xl px-4 pt-4 pb-6 space-y-3 font-space text-sm uppercase tracking-wider text-[#F7F6F2]">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 border-b border-white/10 text-white font-bold hover:text-[#C7F464] transition-colors"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 border-b border-white/10 text-[#F7F6F2]/80 hover:text-[#C7F464] transition-colors"
          >
            Shop All Catalog
          </Link>
          <Link
            to="/custom-studio"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-[#111111] bg-[#C7F464] px-3 font-extrabold rounded-xs shadow-[0_0_15px_rgba(199,244,100,0.3)]"
          >
            <Palette size={16} /> Custom T-Shirt Studio
          </Link>

          <div className="pt-2 text-xs text-[#C7F464] font-bold">Categories</div>
          <div className="grid grid-cols-2 gap-2 text-xs uppercase">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-2 bg.121216 bg-[#16161E] border border-white/10 text-[#F7F6F2] hover:border-[#C7F464] hover:text-[#C7F464] transition-colors rounded-xs"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-2">
            <Link
              to="/owner/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 bg-[#161620] text-[#C7F464] border border-[#C7F464]/30 font-bold text-center text-xs uppercase tracking-widest flex items-center justify-center gap-2 rounded-xs hover:bg-[#C7F464] hover:text-[#111111] transition-colors"
            >
              <ShieldCheck size={16} /> Owner Admin Panel
            </Link>
          </div>
        </div>
      )}

      {/* Cart Slide-over */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Bottom Header Animated Stream Line (Dashboard Theme: Left to Right) */}
      <div className="header-line-stream-ltr opacity-80" />
    </header>
  );
};
