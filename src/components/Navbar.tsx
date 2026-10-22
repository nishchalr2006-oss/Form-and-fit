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
    <header className="sticky top-0 z-40 bg-[#F7F6F2] border-b border-[#111111]/15">
      {/* Supabase status indicator banner */}
      <SupabaseBanner />

      {/* Top Announcement Bar */}
      {storeSettings.announcement_enabled && storeSettings.announcement_text && (
        <div className="bg-[#111111] text-[#F7F6F2] text-[11px] font-space font-medium tracking-wider uppercase py-1.5 px-4 text-center overflow-hidden">
          <p className="truncate">{storeSettings.announcement_text}</p>
        </div>
      )}

      {/* Main Header Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Mobile Menu Toggle */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-[#111111] hover:text-[#111111]/70 transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-1 lg:flex-none text-center lg:text-left">
            <Link to="/" className="inline-block group">
              <span className="font-space font-extrabold text-xl sm:text-2xl uppercase tracking-tighter text-[#111111] group-hover:text-[#111111]/80 transition-colors">
                FORM &amp; FIT
              </span>
              <span className="block text-[9px] font-space tracking-widest text-[#111111]/50 uppercase -mt-1">
                Fashion &amp; Custom Studio
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 text-xs font-space font-semibold uppercase tracking-wider text-[#111111]">
            <Link to="/" className="hover:text-[#111111]/60 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="hover:text-[#111111]/60 transition-colors">
              Shop All
            </Link>
            <Link to="/shop?gender=Men" className="hover:text-[#111111]/60 transition-colors">
              Men
            </Link>
            <Link to="/shop?gender=Women" className="hover:text-[#111111]/60 transition-colors">
              Women
            </Link>
            <Link to="/shop?gender=Unisex" className="hover:text-[#111111]/60 transition-colors">
              Unisex
            </Link>
            <Link
              to="/custom-studio"
              className="flex items-center gap-1 text-[#111111] bg-[#C7F464] px-2.5 py-1 font-bold hover:bg-[#111111] hover:text-[#C7F464] transition-colors"
            >
              <Palette size={13} /> Custom Studio
            </Link>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Toggle */}
            <button
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-2 text-[#111111] hover:text-[#111111]/70 transition-colors cursor-pointer"
              aria-label="Search store"
            >
              <Search size={20} />
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="p-2 text-[#111111] hover:text-[#111111]/70 transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute top-1 right-1 bg-[#111111] text-[#F7F6F2] text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>

            {/* Shopping Bag Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 text-[#111111] hover:text-[#111111]/70 transition-colors relative cursor-pointer"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} />
              {totalCartCount > 0 && (
                <span className="absolute top-1 right-1 bg-[#C7F464] text-[#111111] text-[10px] font-mono font-bold w-4 h-4 rounded-full flex items-center justify-center">
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
                    ? 'border-[#111111] bg-[#111111] text-[#C7F464]'
                    : 'border-transparent text-[#111111] hover:text-[#111111]/70'
                }`}
                title={user ? `${user.full_name || user.email}` : 'Account'}
              >
                {isAdmin ? <ShieldCheck size={20} /> : <User size={20} />}
              </button>

              {/* User Menu Popup */}
              {isUserMenuOpen && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-[#111111] shadow-xl py-2 z-50 text-xs font-space"
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  {isAdmin && (
                    <div className="px-3 py-1.5 bg-[#111111] text-[#C7F464] font-bold uppercase tracking-wider text-[10px] flex items-center justify-between mb-1">
                      <span>Store Owner Privileges</span>
                      <ShieldCheck size={12} />
                    </div>
                  )}

                  {user ? (
                    <div className="px-3 py-2 border-b border-[#111111]/10">
                      <p className="font-bold text-[#111111] truncate">{user.full_name || 'Customer'}</p>
                      <p className="text-[11px] text-[#111111]/60 truncate">{user.email}</p>
                    </div>
                  ) : null}

                  {isAdmin && (
                    <Link
                      to="/owner/dashboard"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="flex items-center justify-between px-3 py-2 hover:bg-[#C7F464] hover:text-[#111111] font-bold text-[#111111] uppercase tracking-wider"
                    >
                      <span>Owner Dashboard</span>
                      <ChevronRight size={14} />
                    </Link>
                  )}

                  <Link
                    to="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-[#F7F6F2] text-[#111111] uppercase tracking-wider"
                  >
                    My Account &amp; Orders
                  </Link>

                  {!user && (
                    <Link
                      to="/owner/login"
                      onClick={() => setIsUserMenuOpen(false)}
                      className="block px-3 py-2 hover:bg-[#111111] hover:text-[#C7F464] font-bold text-[#111111] uppercase tracking-wider"
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
                      className="w-full text-left flex items-center gap-2 px-3 py-2 text-red-600 hover:bg-red-50 font-semibold uppercase tracking-wider border-t border-[#111111]/10 mt-1 cursor-pointer"
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
        <div className="border-t border-[#111111]/20 bg-white p-4">
          <form onSubmit={handleSearchSubmit} className="max-w-2xl mx-auto flex gap-2">
            <input
              type="text"
              placeholder="Search products by title, fabric, category, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-[#F7F6F2] border border-[#111111] px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#111111]"
              autoFocus
            />
            <button
              type="submit"
              className="px-6 py-2 bg-[#111111] text-[#F7F6F2] font-space text-xs uppercase tracking-widest hover:bg-[#C7F464] hover:text-[#111111] transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-[#111111]/20 bg-[#F7F6F2] px-4 pt-4 pb-6 space-y-3 font-space text-sm uppercase tracking-wider">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 border-b border-[#111111]/10 text-[#111111] font-bold"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsMobileMenuOpen(false)}
            className="block py-2 border-b border-[#111111]/10 text-[#111111]"
          >
            Shop All Catalog
          </Link>
          <Link
            to="/custom-studio"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-[#111111] bg-[#C7F464] px-3 font-bold"
          >
            <Palette size={16} /> Custom T-Shirt Studio
          </Link>

          <div className="pt-2 text-xs text-[#111111]/60 font-semibold">Categories</div>
          <div className="grid grid-cols-2 gap-2 text-xs uppercase">
            {categories.slice(0, 8).map((cat) => (
              <Link
                key={cat.id}
                to={`/shop?category=${cat.id}`}
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1.5 px-2 bg-white border border-[#111111]/10 text-[#111111]"
              >
                {cat.name}
              </Link>
            ))}
          </div>

          <div className="pt-4 border-t border-[#111111]/20 flex flex-col gap-2">
            <Link
              to="/owner/dashboard"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-2.5 bg-[#111111] text-[#C7F464] font-bold text-center text-xs uppercase tracking-widest flex items-center justify-center gap-2"
            >
              <ShieldCheck size={16} /> Owner Admin Panel
            </Link>
          </div>
        </div>
      )}

      {/* Cart Slide-over */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
};
