import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SupabaseBanner } from './SupabaseBanner';
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
} from 'lucide-react';

export const OwnerLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isOwner, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { label: 'Overview', path: '/owner/dashboard', icon: LayoutDashboard },
    { label: 'Products', path: '/owner/products', icon: Package },
    { label: 'Inventory Stock', path: '/owner/inventory', icon: Boxes },
    { label: 'Categories', path: '/owner/categories', icon: FolderTree },
    { label: 'Orders & Fulfillment', path: '/owner/orders', icon: ShoppingBag },
    { label: 'Coupons', path: '/owner/coupons', icon: Ticket },
    { label: 'Store Content & Settings', path: '/owner/settings', icon: Sliders },
  ];

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111111] font-sans flex flex-col">
      {/* Top Banner */}
      <SupabaseBanner />

      {/* Admin Navigation Header */}
      <header className="bg-[#111111] text-[#F7F6F2] border-b border-[#111111]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Link to="/owner/dashboard" className="flex items-center gap-2 font-space font-bold text-lg uppercase tracking-wider text-[#C7F464]">
                <ShieldCheck size={20} />
                <span>FORM &amp; FIT OWNER DASHBOARD</span>
              </Link>
            </div>

            <div className="flex items-center gap-4 text-xs font-space">
              <Link
                to="/owner/products/new"
                className="px-3 py-1.5 bg-[#C7F464] text-[#111111] font-bold uppercase flex items-center gap-1.5 hover:bg-white transition-colors"
              >
                <PlusCircle size={14} /> New Product
              </Link>

              <Link
                to="/"
                target="_blank"
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-[#F7F6F2] uppercase font-bold flex items-center gap-1.5 transition-colors"
              >
                <ExternalLink size={13} /> View Customer Store
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/owner/login');
                }}
                className="p-1.5 hover:text-red-400 transition-colors cursor-pointer"
                title="Sign Out"
              >
                <LogOut size={16} />
              </button>
            </div>
          </div>

          {/* Sub Navigation Tabs */}
          <nav className="flex overflow-x-auto space-x-1 py-2 text-xs font-space font-bold uppercase tracking-wider border-t border-white/10">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-2 flex items-center gap-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#C7F464] text-[#111111]'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon size={14} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Admin Page Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
