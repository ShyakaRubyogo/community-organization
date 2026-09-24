import React, { useState } from 'react';
import { Mail, ArrowRight, ShieldCheck, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { sendMagicLink } from '../../lib/cmsClient';
import { isSupabaseConfigured } from '../../lib/supabase';
import { useCms } from '../../context/CmsContext';
import { Button } from '../common/Button';

export const AdminLogin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
  const { loginAsDemoAdmin } = useCms();

  const isConfigured = Boolean(isSupabaseConfigured);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !isConfigured) return;

    setLoading(true);
    setResult(null);

    const res = await sendMagicLink(email);
    setResult(res);
    setLoading(false);
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
          Direct-to-database content management layer for Roots & Canopy
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-[#FFFFFF] py-8 px-6 sm:px-10 rounded-2xl shadow-sm border border-[#E4DCC8] space-y-6">
          {!isConfigured ? (
            <div className="space-y-5">
              <div className="rounded-xl bg-amber-50/80 border border-amber-200/80 p-4 space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-semibold text-amber-900 uppercase tracking-wider">
                      Supabase Environment Notice
                    </h4>
                    <p className="text-xs text-amber-800 mt-1 leading-relaxed">
                      Live credentials (<code className="font-mono text-amber-950 font-bold">VITE_SUPABASE_URL</code> & <code className="font-mono text-amber-950 font-bold">VITE_SUPABASE_ANON_KEY</code>) are not yet configured for passwordless magic-link sign in.
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-[#FAF7F0] border border-[#E4DCC8] rounded-xl p-4 text-center space-y-3">
                <div className="flex items-center justify-center gap-1.5 text-xs font-semibold text-[#2C5745] uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Preview & Review Ready</span>
                </div>
                <p className="text-xs text-[#6B6350] leading-relaxed">
                  You can explore and test the entire Admin Dashboard immediately using built-in read-only seed data.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  onClick={loginAsDemoAdmin}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <span>Enter CMS Studio (Preview Mode)</span>
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSend} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#211C0D] uppercase tracking-wider mb-2">
                  Admin Email Address
                </label>
                <div className="relative">
                  <Mail className="w-5 h-5 text-[#9C8B5E] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@rootsandcanopy.org"
                    className="w-full pl-11 pr-4 py-2.5 text-sm bg-[#FAF7F0] border border-[#E4DCC8] rounded-lg text-[#211C0D] placeholder-[#9C8B5E] focus:outline-none focus:ring-2 focus:ring-[#2C5745]/30 focus:border-[#2C5745]"
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
                className="w-full flex items-center justify-center gap-2"
              >
                {loading ? 'Sending Magic Link...' : 'Send Magic Link'}
                <ArrowRight className="w-4 h-4" />
              </Button>

              <div className="flex items-center gap-2 pt-2 text-xs text-[#6B6350] justify-center">
                <ShieldCheck className="w-4 h-4 text-[#2C5745]" />
                Passwordless authentication powered by Supabase Auth
              </div>

              <div className="pt-3 border-t border-[#E4DCC8]">
                <button
                  type="button"
                  onClick={loginAsDemoAdmin}
                  className="w-full text-center text-xs font-medium text-[#2C5745] hover:underline"
                >
                  Or enter in Demo Preview mode →
                </button>
              </div>
            </form>
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
