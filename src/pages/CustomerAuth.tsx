import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  Sparkles,
  KeyRound,
} from 'lucide-react';

export const CustomerAuth: React.FC = () => {
  const { signInWithPassword, signUp, user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Mode: 'signin' | 'register'
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'signin';
  const [mode, setMode] = useState<'signin' | 'register'>(initialMode);

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [banner, setBanner] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/account');
    }
  }, [user, navigate]);

  // Password strength logic
  const getPasswordStrength = (pass: string) => {
    if (!pass) return { score: 0, label: '', color: 'bg-gray-200' };
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    if (score <= 1) return { score: 25, label: 'Weak', color: 'bg-red-500' };
    if (score <= 3) return { score: 60, label: 'Medium', color: 'bg-amber-500' };
    return { score: 100, label: 'Strong', color: 'bg-[#C7F464]' };
  };

  const strength = getPasswordStrength(password);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    if (!email.trim() || !password) {
      setBanner({ type: 'error', message: 'Please enter both your email address and password.' });
      return;
    }

    setLoading(true);
    const res = await signInWithPassword(email.trim(), password);
    setLoading(false);

    if (res.success) {
      setBanner({ type: 'success', message: 'Welcome back! Redirecting to your account...' });
      setTimeout(() => navigate('/account'), 600);
    } else {
      setBanner({ type: 'error', message: res.message || 'Invalid email or password.' });
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setBanner(null);

    if (!fullName.trim() || !email.trim() || !password) {
      setBanner({ type: 'error', message: 'Please fill in all required registration fields.' });
      return;
    }

    if (password.length < 6) {
      setBanner({ type: 'error', message: 'Password must be at least 6 characters long.' });
      return;
    }

    if (password !== confirmPassword) {
      setBanner({ type: 'error', message: 'Passwords do not match. Please verify.' });
      return;
    }

    setLoading(true);
    const res = await signUp(email.trim(), password, fullName.trim(), phone.trim());
    setLoading(false);

    if (res.success) {
      setBanner({ type: 'success', message: res.message || 'Account created successfully! Redirecting...' });
      setTimeout(() => navigate('/account'), 600);
    } else {
      setBanner({ type: 'error', message: res.message || 'Registration failed. Please try again.' });
    }
  };

  return (
    <div className="max-w-md mx-auto my-12 px-4 font-sans text-[#111111]">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white border border-[#111111]/20 p-8 shadow-xl space-y-6 relative overflow-hidden rounded-xs"
      >
        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-[#F7F6F2] p-1 border border-[#111111]/20 font-space text-xs font-bold uppercase rounded-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setBanner(null);
            }}
            className={`py-2 transition-all cursor-pointer rounded-xs ${
              mode === 'signin'
                ? 'bg-[#111111] text-[#C7F464] font-extrabold shadow-sm'
                : 'text-[#111111]/60 hover:text-[#111111]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setBanner(null);
            }}
            className={`py-2 transition-all cursor-pointer rounded-xs ${
              mode === 'register'
                ? 'bg-[#111111] text-[#C7F464] font-extrabold shadow-sm'
                : 'text-[#111111]/60 hover:text-[#111111]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Feedback Alert Banner */}
        <AnimatePresence mode="wait">
          {banner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-3 text-xs font-space font-bold flex items-center gap-2 border rounded-xs ${
                banner.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-500'
                  : 'bg-red-50 text-red-900 border-red-500'
              }`}
            >
              {banner.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              ) : (
                <AlertCircle size={16} className="shrink-0 text-red-600" />
              )}
              <span>{banner.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign In Form */}
        {mode === 'signin' && (
          <motion.form
            key="signin"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleSignIn}
            className="space-y-4 text-[#111111]"
          >
            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 pl-9 text-xs rounded-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#111111]"
                />
                <Mail size={16} className="absolute left-2.5 top-3 text-[#111111]/40" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-space">
                <label className="font-bold uppercase text-[#111111]">Password *</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 pl-9 pr-10 text-xs rounded-xs text-[#111111] focus:outline-none focus:bg-white focus:ring-1 focus:ring-[#111111]"
                />
                <Lock size={16} className="absolute left-2.5 top-3 text-[#111111]/40" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-[#111111]/50 hover:text-[#111111] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#111111] text-[#C7F464] font-space font-bold text-xs uppercase tracking-wider hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-xs shadow-md"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  Sign In To Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* Registration Form */}
        {mode === 'register' && (
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleRegister}
            className="space-y-4 text-[#111111]"
          >
            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 pl-9 text-xs rounded-xs text-[#111111] focus:outline-none focus:bg-white"
                />
                <User size={16} className="absolute left-2.5 top-3 text-[#111111]/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 pl-9 text-xs rounded-xs text-[#111111] focus:outline-none focus:bg-white"
                />
                <Mail size={16} className="absolute left-2.5 top-3 text-[#111111]/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 pl-9 text-xs rounded-xs text-[#111111] focus:outline-none focus:bg-white"
                />
                <Phone size={16} className="absolute left-2.5 top-3 text-[#111111]/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 pl-9 pr-10 text-xs rounded-xs text-[#111111] focus:outline-none focus:bg-white"
                />
                <Lock size={16} className="absolute left-2.5 top-3 text-[#111111]/40" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-[#111111]/50 hover:text-[#111111] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#111111]/70">
                    <span>Password Strength:</span>
                    <span className="font-bold text-[#111111]">{strength.label}</span>
                  </div>
                  <div className="w-full bg-gray-200 h-1.5 overflow-hidden rounded-xs">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#111111]">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-[#F7F6F2] border border-[#111111] p-2.5 pl-9 pr-10 text-xs rounded-xs text-[#111111] focus:outline-none focus:bg-white"
                />
                <Lock size={16} className="absolute left-2.5 top-3 text-[#111111]/40" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-3 text-[#111111]/50 hover:text-[#111111] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#111111] text-[#C7F464] font-space font-bold text-xs uppercase tracking-wider hover:bg-[#C7F464] hover:text-[#111111] transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-xs shadow-md"
            >
              {loading ? (
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                <>
                  Register New Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* Footer Admin Switcher Link */}
        <div className="pt-4 border-t border-[#111111]/10 text-center">
          <Link
            to="/owner/login"
            className="text-xs font-space font-bold uppercase text-[#111111] hover:text-[#76C400] flex items-center justify-center gap-1.5"
          >
            <ShieldCheck size={14} /> Store Owner / Admin Portal Access
          </Link>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 bg-[#0A0A0C] p-1 border border-white/10 font-space text-xs font-bold uppercase rounded-xs">
          <button
            type="button"
            onClick={() => {
              setMode('signin');
              setBanner(null);
            }}
            className={`py-2 transition-all cursor-pointer rounded-xs ${
              mode === 'signin'
                ? 'bg-[#C7F464] text-[#111111] shadow-[0_0_10px_rgba(199,244,100,0.3)] font-extrabold'
                : 'text-[#F7F6F2]/60 hover:text-[#F7F6F2]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setBanner(null);
            }}
            className={`py-2 transition-all cursor-pointer rounded-xs ${
              mode === 'register'
                ? 'bg-[#C7F464] text-[#111111] shadow-[0_0_10px_rgba(199,244,100,0.3)] font-extrabold'
                : 'text-[#F7F6F2]/60 hover:text-[#F7F6F2]'
            }`}
          >
            Register
          </button>
        </div>

        {/* Feedback Alert Banner */}
        <AnimatePresence mode="wait">
          {banner && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`p-3 text-xs font-space font-bold flex items-center gap-2 border rounded-xs ${
                banner.type === 'success'
                  ? 'bg-[#C7F464]/20 text-[#C7F464] border-[#C7F464]'
                  : 'bg-red-950/60 text-red-200 border-red-500'
              }`}
            >
              {banner.type === 'success' ? (
                <CheckCircle2 size={16} className="shrink-0 text-[#C7F464]" />
              ) : (
                <AlertCircle size={16} className="shrink-0 text-red-400" />
              )}
              <span>{banner.message}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sign In Form */}
        {mode === 'signin' && (
          <motion.form
            key="signin"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 10 }}
            onSubmit={handleSignIn}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#F7F6F2]">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glow-input w-full p-2.5 pl-9 text-xs rounded-xs"
                />
                <Mail size={16} className="absolute left-2.5 top-3 text-[#F7F6F2]/40" />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-space">
                <label className="font-bold uppercase text-[#F7F6F2]">Password *</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glow-input w-full p-2.5 pl-9 pr-10 text-xs rounded-xs"
                />
                <Lock size={16} className="absolute left-2.5 top-3 text-[#F7F6F2]/40" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-[#F7F6F2]/50 hover:text-[#C7F464] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glow-btn-primary light-sweep w-full py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-xs"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  Sign In To Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* Registration Form */}
        {mode === 'register' && (
          <motion.form
            key="register"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -10 }}
            onSubmit={handleRegister}
            className="space-y-4"
          >
            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#F7F6F2]">
                Full Name *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Rahul Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="glow-input w-full p-2.5 pl-9 text-xs rounded-xs"
                />
                <User size={16} className="absolute left-2.5 top-3 text-[#F7F6F2]/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#F7F6F2]">
                Email Address *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="glow-input w-full p-2.5 pl-9 text-xs rounded-xs"
                />
                <Mail size={16} className="absolute left-2.5 top-3 text-[#F7F6F2]/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#F7F6F2]">
                Phone Number (Optional)
              </label>
              <div className="relative">
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="glow-input w-full p-2.5 pl-9 text-xs rounded-xs"
                />
                <Phone size={16} className="absolute left-2.5 top-3 text-[#F7F6F2]/40" />
              </div>
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#F7F6F2]">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="At least 6 characters..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="glow-input w-full p-2.5 pl-9 pr-10 text-xs rounded-xs"
                />
                <Lock size={16} className="absolute left-2.5 top-3 text-[#F7F6F2]/40" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-3 text-[#F7F6F2]/50 hover:text-[#C7F464] cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Password strength bar */}
              {password && (
                <div className="pt-1.5 space-y-1">
                  <div className="flex justify-between items-center text-[10px] font-mono uppercase text-[#F7F6F2]/70">
                    <span>Password Strength:</span>
                    <span className="font-bold text-[#C7F464]">{strength.label}</span>
                  </div>
                  <div className="w-full bg-white/10 h-1.5 overflow-hidden rounded-xs">
                    <div
                      className={`h-full transition-all duration-300 ${strength.color}`}
                      style={{ width: `${strength.score}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-space font-bold uppercase text-[#F7F6F2]">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter your password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="glow-input w-full p-2.5 pl-9 pr-10 text-xs rounded-xs"
                />
                <Lock size={16} className="absolute left-2.5 top-3 text-[#F7F6F2]/40" />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2.5 top-3 text-[#F7F6F2]/50 hover:text-[#C7F464] cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="glow-btn-primary light-sweep w-full py-3.5 text-xs flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 rounded-xs"
            >
              {loading ? (
                <span className="animate-pulse">Creating Account...</span>
              ) : (
                <>
                  Register New Account <ArrowRight size={16} />
                </>
              )}
            </button>
          </motion.form>
        )}

        {/* Footer Admin Switcher Link */}
        <div className="pt-4 border-t border-white/10 text-center">
          <Link
            to="/owner/login"
            className="text-xs font-space font-bold uppercase text-[#C7F464] hover:underline flex items-center justify-center gap-1.5"
          >
            <ShieldCheck size={14} /> Store Owner / Admin Portal Access
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
