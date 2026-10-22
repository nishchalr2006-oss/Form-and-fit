import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  Home,
  ShoppingBag,
  Palette,
  Heart,
  User,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { cart, wishlist } = useStore();
  const { user, isAdmin } = useAuth();

  const totalCartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const navItems = [
    {
      id: 'home',
      label: 'Home',
      path: '/',
      icon: Home,
      exact: true,
    },
    {
      id: 'shop',
      label: 'Shop',
      path: '/shop',
      icon: ShoppingBag,
      badge: null,
    },
    {
      id: 'custom',
      label: 'Custom',
      path: '/custom-studio',
      icon: Palette,
      highlight: true,
    },
    {
      id: 'wishlist',
      label: 'Wishlist',
      path: '/wishlist',
      icon: Heart,
      badge: wishlist.length > 0 ? wishlist.length : null,
    },
    {
      id: 'account',
      label: user ? 'Account' : 'Sign In',
      path: isAdmin ? '/owner/dashboard' : '/account',
      icon: isAdmin ? ShieldCheck : User,
      badge: null,
    },
  ];

  const isActivePath = (path: string, exact?: boolean) => {
    if (exact) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0C0C0E]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.9)] pb-[env(safe-area-inset-bottom,8px)]">
      {/* Top subtle lime glowing border line */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#C7F464]/40 to-transparent" />

      <div className="grid grid-cols-5 h-16 items-center px-1">
        {navItems.map((item) => {
          const active = isActivePath(item.path, item.exact);
          const Icon = item.icon;

          return (
            <Link
              key={item.id}
              to={item.path}
              className="relative flex flex-col items-center justify-center h-full w-full py-1 text-center group cursor-pointer"
            >
              {/* Active Tab Glow Indicator */}
              {active && (
                <motion.div
                  layoutId="mobileNavGlow"
                  className="absolute -top-1 w-8 h-1 rounded-full bg-[#C7F464] shadow-[0_0_12px_#C7F464]"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="relative">
                <motion.div
                  whileTap={{ scale: 0.88 }}
                  className={`p-1.5 rounded-xl transition-all ${
                    active
                      ? item.highlight
                        ? 'bg-[#C7F464] text-[#111111] shadow-[0_0_15px_rgba(199,244,100,0.5)]'
                        : 'text-[#C7F464]'
                      : item.highlight
                      ? 'bg-[#C7F464]/15 text-[#C7F464] border border-[#C7F464]/30'
                      : 'text-[#F7F6F2]/60 group-hover:text-[#F7F6F2]'
                  }`}
                >
                  <Icon size={19} />
                </motion.div>

                {/* Badge Count Overlay */}
                {item.badge !== null && (
                  <span className="absolute -top-1 -right-1.5 bg-[#C7F464] text-[#111111] text-[9px] font-mono font-extrabold w-4 h-4 rounded-full flex items-center justify-center border border-[#111111]">
                    {item.badge}
                  </span>
                )}
              </div>

              <span
                className={`text-[10px] font-space font-bold uppercase tracking-wider mt-0.5 transition-colors ${
                  active ? 'text-[#C7F464]' : 'text-[#F7F6F2]/50'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
