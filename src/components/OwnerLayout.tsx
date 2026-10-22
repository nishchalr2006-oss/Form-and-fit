import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useStore } from '../context/StoreContext';
import { SupabaseBanner } from './SupabaseBanner';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  Boxes,
  FolderTree,
  ShoppingBag,
  Ticket,
  Sliders,
  ExternalLink,
  ShieldCheck,
  LogOut,
  PlusCircle,
  Menu,
  X,
  ChevronRight,
  AlertTriangle,
} from 'lucide-react';

export const OwnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { logout, user } = useAuth();
  const { products, orders } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Products Catalog', path: '/owner/products', icon: Package, badge: products.length },
    { label: 'Inventory Stock', path: '/owner/inventory', icon: Boxes },
    { label: 'Categories', path: '/owner/categories', icon: FolderTree },
    { label: 'Orders & Fulfillment', path: '/owner/orders', icon: ShoppingBag, badge: orders.filter((o) => o.status === 'pending').length },
    { label: 'Promo Coupons', path: '/owner/coupons', icon: Ticket },
    { label: 'Content & Settings', path: '/owner/settings', icon: Sliders },
  ];

  const pendingOrdersCount = orders.filter((o) => o.status === 'pending').length;
  const lowStockCount = products
    .flatMap((p) => p.variants || [])
    .filter((v) => v.stock_quantity <= 5).length;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111111] font-sans flex flex-col">
      {/* Supabase status header */}
      <SupabaseBanner />

      {/* Top Header */}
      <header className="bg-[#111111] text-[#F7F6F2] border-b border-[#111111] sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              {/* Mobile Sidebar Toggle */}
              <button
                onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
                className="lg:hidden p-1.5 text-white hover:text-[#C7F464] cursor-pointer"
                aria-label="Toggle navigation"
              >
                {isMobileSidebarOpen ? <X size={22} /> : <Menu size={22} />}
              </button>

              <Link to="/owner/dashboard" className="flex items-center gap-2 font-space font-extrabold text-base sm:text-lg uppercase tracking-wider text-[#C7F464]">
                <ShieldCheck size={22} />
                <span>FORM &amp; FIT ADMIN</span>
              </Link>
            </div>

            {/* Quick Metrics & Actions */}
            <div className="flex items-center gap-3 text-xs font-space">
              {pendingOrdersCount > 0 && (
                <Link
                  to="/owner/orders"
                  className="hidden sm:flex items-center gap-1.5 bg-amber-400 text-black px-2.5 py-1 font-bold uppercase text-[10px]"
                >
                  <ShoppingBag size={12} /> {pendingOrdersCount} Pending Order(s)
                </Link>
              )}

              {lowStockCount > 0 && (
                <Link
                  to="/owner/inventory"
                  className="hidden sm:flex items-center gap-1.5 bg-red-600 text-white px-2.5 py-1 font-bold uppercase text-[10px]"
                >
                  <AlertTriangle size={12} /> {lowStockCount} Stock Alert(s)
                </Link>
              )}

              <Link
                to="/owner/products/new"
                className="px-3 py-1.5 bg-[#C7F464] text-[#111111] font-extrabold uppercase flex items-center gap-1.5 hover:bg-white transition-colors cursor-pointer"
              >
                <PlusCircle size={14} /> New Product
              </Link>

              <Link
                to="/"
                target="_blank"
                className="hidden md:flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#F7F6F2] font-bold uppercase transition-colors"
                title="Open customer storefront in new tab"
              >
                <ExternalLink size={13} /> View Store
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/owner/login');
                }}
                className="p-1.5 hover:text-red-400 transition-colors cursor-pointer text-white/80"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Body with Sidebar + Content */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 space-y-4">
          <div className="bg-white border border-[#111111]/15 p-4 space-y-2">
            <div className="px-2 py-1 bg-[#111111] text-[#C7F464] font-space font-extrabold text-[10px] uppercase tracking-widest flex items-center justify-between">
              <span>ADMIN NAVIGATION</span>
              <ShieldCheck size={12} />
            </div>

            <nav className="space-y-1 font-space text-xs font-bold uppercase">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center justify-between px-3 py-2.5 transition-colors ${
                      isActive
                        ? 'bg-[#111111] text-[#C7F464]'
                        : 'text-[#111111]/80 hover:bg-[#F7F6F2]'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon size={16} /> {link.label}
                    </span>
                    {link.badge !== undefined && link.badge > 0 && (
                      <span className={`px-1.5 py-0.2 font-mono text-[10px] font-bold ${
                        isActive ? 'bg-[#C7F464] text-[#111111]' : 'bg-[#111111] text-white'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="bg-white border border-[#111111]/15 p-4 space-y-2 text-xs font-sans">
            <p className="font-space font-bold uppercase text-[10px] text-[#111111]/50">Store Status</p>
            <p className="text-xs font-bold text-[#111111]">Form &amp; Fit Live Catalog</p>
            <p className="text-[11px] text-[#111111]/60">
              {products.filter((p) => p.status === 'published').length} published products online.
            </p>
            <Link
              to="/"
              target="_blank"
              className="inline-block text-[11px] font-space font-bold uppercase text-[#111111] underline hover:text-[#C7F464]"
            >
              Open Customer Storefront →
            </Link>
          </div>
        </aside>

        {/* Mobile Nav Drawer */}
        {isMobileSidebarOpen && (
          <div className="lg:hidden col-span-12 bg-white border border-[#111111] p-4 space-y-2 font-space text-xs font-bold uppercase">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2.5 ${
                    isActive ? 'bg-[#111111] text-[#C7F464]' : 'bg-[#F7F6F2] text-[#111111]'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Icon size={16} /> {link.label}
                  </span>
                  <ChevronRight size={14} />
                </Link>
              );
            })}
          </div>
        )}

        {/* Content Panel */}
        <motion.main
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="col-span-12 lg:col-span-9"
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
};
