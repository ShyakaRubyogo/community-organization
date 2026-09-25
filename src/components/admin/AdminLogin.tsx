import React, { useState, useEffect } from 'react';
import { Mail, Lock, ArrowRight, ShieldCheck, AlertCircle, CheckCircle, Eye, EyeOff, KeyRound, ArrowLeft } from 'lucide-react';
import { signInWithPassword, sendMagicLink, sendPasswordResetEmail, updateAdminPassword } from '../../lib/cmsClient';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useCms } from '../../context/CmsContext';
import { Button } from '../common/Button';

export const AdminLogin: React.FC = () => {
  const [authMode, setAuthMode] = useState<'password' | 'magic-link' | 'forgot-password' | 'set-new-password'>('password');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const { setAdminUser } = useCms();
  const isConfigured = Boolean(isSupabaseConfigured);

  // Detect recovery or password reset hash in URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash || '';
      if (hash.includes('type=recovery') || hash.includes('reset-password')) {
        setAuthMode('set-new-password');
      }
    }
  }, []);

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setResult(null);

    const res = await signInWithPassword(email.trim(), password);
    setResult(res);
    setLoading(false);

    if (res.success && res.user) {
      setAdminUser(res.user);
    }
  };

  const handleMagicLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setResult(null);

    const res = await sendMagicLink(email.trim());
    setResult(res);
    setLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setResult(null);

    const res = await sendPasswordResetEmail(email.trim());
    setResult(res);
    setLoading(false);
  };

  const handleSetNewPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setResult({ success: false, message: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setResult({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    setLoading(true);
    setResult(null);

    const res = await updateAdminPassword(newPassword);
    setResult(res);
    setLoading(false);

    if (res.success) {
      setTimeout(() => {
        setAuthMode('password');
        setResult({ success: true, message: 'Password updated! You can now sign in with your new password.' });
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 rounded-xl bg-[#2C5745] text-[#FAF7F0] mx-auto flex items-center justify-center font-['Fraunces'] font-semibold text-xl mb-4 shadow-sm">
          A
        </div>
        <h2 className="font-['Fraunces'] font-semibold text-3xl text-[#211C0D] tracking-tight">
          Alliance CMS Studio
        </h2>
        <p className="font-['Karla'] text-sm text-[#6B6350] mt-2">
          Administrator login for content management & site settings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-[#E4DCC8] space-y-6">
          {!isConfigured ? (
            <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-4 space-y-2">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                    Supabase Configuration Required
                  </h4>
                  <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                    Please provide <code className="font-mono text-amber-950 font-bold">VITE_SUPABASE_URL</code> and <code className="font-mono text-amber-950 font-bold">VITE_SUPABASE_ANON_KEY</code> in your environment variables to sign in.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Tab Selector (only shown if not in reset mode) */}
              {authMode !== 'set-new-password' && (
                <div className="flex p-1 bg-[#FAF7F0] rounded-xl border border-[#E4DCC8]">
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('password');
                      setResult(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMode === 'password'
                        ? 'bg-white text-[#211C0D] shadow-xs'
                        : 'text-[#6B6350] hover:text-[#211C0D]'
                    }`}
                  >
                    Password Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthMode('magic-link');
                      setResult(null);
                    }}
                    className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      authMode === 'magic-link'
                        ? 'bg-white text-[#211C0D] shadow-xs'
                        : 'text-[#6B6350] hover:text-[#211C0D]'
                    }`}
                  >
                    Magic Link
                  </button>
                </div>
              )}

              {/* 1. Password Form */}
              {authMode === 'password' && (
                <form onSubmit={handlePasswordLogin} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1.5">
                      Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#9C8B5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@community.org"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF7F0] border border-[#E4DCC8] rounded-lg text-[#211C0D] placeholder-[#9C8B5E] focus:outline-none focus:ring-2 focus:ring-[#2C5745]/30 focus:border-[#2C5745]"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setAuthMode('forgot-password');
                          setResult(null);
                        }}
                        className="text-xs text-[#2C5745] hover:underline font-medium cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#9C8B5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FAF7F0] border border-[#E4DCC8] rounded-lg text-[#211C0D] placeholder-[#9C8B5E] focus:outline-none focus:ring-2 focus:ring-[#2C5745]/30 focus:border-[#2C5745]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {result && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                        result.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <span>{result.message}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Authenticating...' : 'Sign In to CMS'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              {/* 2. Magic Link Form */}
              {authMode === 'magic-link' && (
                <form onSubmit={handleMagicLink} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1.5">
                      Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#9C8B5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@community.org"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF7F0] border border-[#E4DCC8] rounded-lg text-[#211C0D] placeholder-[#9C8B5E] focus:outline-none focus:ring-2 focus:ring-[#2C5745]/30 focus:border-[#2C5745]"
                      />
                    </div>
                    <p className="text-[11px] text-[#6B6350] mt-1.5">
                      Only authorized admin emails registered in the database can receive magic links.
                    </p>
                  </div>

                  {result && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                        result.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <span>{result.message}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              {/* 3. Forgot Password Form */}
              {authMode === 'forgot-password' && (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div className="flex items-center gap-2 mb-2">
                    <button
                      type="button"
                      onClick={() => {
                        setAuthMode('password');
                        setResult(null);
                      }}
                      className="text-xs text-[#6B6350] hover:text-[#211C0D] flex items-center gap-1"
                    >
                      <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
                    </button>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1.5">
                      Enter your Admin Email
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-[#9C8B5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="admin@community.org"
                        className="w-full pl-10 pr-4 py-2.5 text-sm bg-[#FAF7F0] border border-[#E4DCC8] rounded-lg text-[#211C0D] placeholder-[#9C8B5E] focus:outline-none focus:ring-2 focus:ring-[#2C5745]/30 focus:border-[#2C5745]"
                      />
                    </div>
                    <p className="text-[11px] text-[#6B6350] mt-1.5">
                      We will email you a secure link to reset your administrator password.
                    </p>
                  </div>

                  {result && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                        result.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <span>{result.message}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Sending Reset Link...' : 'Send Password Reset Link'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              {/* 4. Set New Password Form */}
              {authMode === 'set-new-password' && (
                <form onSubmit={handleSetNewPassword} className="space-y-4">
                  <div className="text-center mb-3">
                    <h3 className="text-sm font-semibold text-[#211C0D]">Set New Password</h3>
                    <p className="text-xs text-[#6B6350] mt-0.5">Enter and confirm your new password below.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1.5">
                      New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#9C8B5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="At least 6 characters"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FAF7F0] border border-[#E4DCC8] rounded-lg text-[#211C0D] placeholder-[#9C8B5E] focus:outline-none focus:ring-2 focus:ring-[#2C5745]/30 focus:border-[#2C5745]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer p-1"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-1.5">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-[#9C8B5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm password"
                        className="w-full pl-10 pr-10 py-2.5 text-sm bg-[#FAF7F0] border border-[#E4DCC8] rounded-lg text-[#211C0D] placeholder-[#9C8B5E] focus:outline-none focus:ring-2 focus:ring-[#2C5745]/30 focus:border-[#2C5745]"
                      />
                    </div>
                  </div>

                  {result && (
                    <div
                      className={`p-3 rounded-lg text-xs flex items-start gap-2 ${
                        result.success
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-red-50 text-red-800 border border-red-200'
                      }`}
                    >
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      )}
                      <span>{result.message}</span>
                    </div>
                  )}

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {loading ? 'Updating Password...' : 'Save New Password'}
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              )}

              <div className="flex items-center gap-2 pt-1 text-xs text-[#6B6350] justify-center">
                <ShieldCheck className="w-4 h-4 text-[#2C5745]" />
                <span>Protected by Supabase Auth and Row Level Security</span>
              </div>
            </>
          )}

          <div className="border-t border-[#E4DCC8] pt-4 text-center">
            <a
              href="/"
              className="text-xs font-medium text-[#2C5745] hover:text-[#211C0D] transition-colors"
            >
              ← Return to public website
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
