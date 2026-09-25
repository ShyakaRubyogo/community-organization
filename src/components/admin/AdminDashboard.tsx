import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { useRouter } from '../../context/RouterContext';
import { SettingsEditor } from './SettingsEditor';
import { HomePageEditor } from './HomePageEditor';
import { AboutPageEditor } from './AboutPageEditor';
import { ArticlesManager } from './ArticlesManager';
import { InitiativesManager } from './InitiativesManager';
import { TeamManager } from './TeamManager';
import { logoutCmsAdmin, updateAdminPassword } from '../../lib/cmsClient';
import { Button } from '../common/Button';
import {
  Settings,
  Home,
  Info,
  BookOpen,
  Sparkles,
  Users,
  Eye,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Radio,
  KeyRound,
  X,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

type AdminTab = 'settings' | 'home' | 'about' | 'articles' | 'initiatives' | 'team';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('settings');
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [pwResult, setPwResult] = useState<{ success: boolean; message: string } | null>(null);

  const { adminUser, isPreviewMode, togglePreviewMode, isSupabaseConnected, logoutAdmin } = useCms();
  const { navigate } = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword !== confirmPassword) {
      setPwResult({ success: false, message: 'Passwords do not match.' });
      return;
    }
    if (newPassword.length < 6) {
      setPwResult({ success: false, message: 'Password must be at least 6 characters long.' });
      return;
    }

    setPwLoading(true);
    setPwResult(null);

    const res = await updateAdminPassword(newPassword);
    setPwResult(res);
    setPwLoading(false);

    if (res.success) {
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setNewPassword('');
        setConfirmPassword('');
        setPwResult(null);
      }, 1500);
    }
  };

  const navItems: { id: AdminTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'settings', label: 'Site Settings & Theme', icon: Settings },
    { id: 'home', label: 'Home Page', icon: Home },
    { id: 'about', label: 'About Page', icon: Info },
    { id: 'initiatives', label: 'Initiatives', icon: Sparkles },
    { id: 'articles', label: 'Articles & Stories', icon: BookOpen },
    { id: 'team', label: 'Team Members', icon: Users }
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F0] flex flex-col font-['Karla'] text-[#211C0D]">
      {/* Top Application Bar */}
      <header className="bg-[#FFFFFF] border-b border-[#E4DCC8] sticky top-0 z-40 px-4 sm:px-8 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-[#2C5745] text-[#FAF7F0] flex items-center justify-center font-['Fraunces'] font-semibold text-base shadow-xs">
            A
          </div>
          <div>
            <div className="font-['Fraunces'] font-semibold text-base text-[#211C0D] leading-tight flex items-center gap-2">
              <span>Alliance CMS Studio</span>
              <span className="text-[11px] font-['Karla'] font-normal px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                Live PostgreSQL RLS
              </span>
            </div>
            <div className="text-[11px] text-[#6B6350]">
              Logged in as <strong className="text-[#211C0D] font-medium">{adminUser?.email || 'admin@community.org'}</strong>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          {/* Preview Mode Toggle */}
          <button
            type="button"
            onClick={togglePreviewMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border cursor-pointer ${
              isPreviewMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-[#FAF7F0] text-[#6B6350] border-[#E4DCC8] hover:text-[#211C0D]'
            }`}
            title="When active, browsing the public site displays your saved unpublished drafts."
          >
            <Radio className={`w-3.5 h-3.5 ${isPreviewMode ? 'text-amber-700 animate-pulse' : ''}`} />
            {isPreviewMode ? 'Draft Preview Active' : 'Preview Drafts'}
          </button>

          {/* Change Password Button */}
          <button
            type="button"
            onClick={() => {
              setIsPasswordModalOpen(true);
              setPwResult(null);
            }}
            className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#E4DCC8]/40 border border-[#E4DCC8] rounded-lg text-xs font-semibold text-[#211C0D] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Update Administrator Password"
          >
            <KeyRound className="w-3.5 h-3.5 text-[#2C5745]" />
            <span className="hidden sm:inline">Password</span>
          </button>

          {/* View Live Site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#E4DCC8]/40 border border-[#E4DCC8] rounded-lg text-xs font-semibold text-[#211C0D] flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#2C5745]" />
            <span className="hidden sm:inline">Live Site</span>
          </a>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-[#6B6350] hover:text-red-700 transition-colors cursor-pointer"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Main Studio Body: Sidebar + Editor Panel */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Navigation Sidebar */}
        <aside className="w-64 border-r border-[#E4DCC8] p-4 hidden md:block shrink-0 bg-[#FFFFFF]">
          <div className="text-[11px] font-semibold text-[#9C8B5E] uppercase tracking-wider px-3 mb-2">
            Content Controls
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer ${
                    isActive
                      ? 'bg-[#2C5745] text-[#FAF7F0]'
                      : 'text-[#6B6350] hover:bg-[#FAF7F0] hover:text-[#211C0D]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-3 rounded-lg bg-[#FAF7F0] border border-[#E4DCC8]/60 text-[11px] text-[#6B6350] space-y-1.5">
            <div className="font-semibold text-[#211C0D] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2C5745]" />
              Draft / Publish Safe
            </div>
            <p>
              Auto-saves write safely to private draft columns. Explicit "Publish" promotes drafts atomically to the public views.
            </p>
          </div>
        </aside>

        {/* Mobile Tab Picker */}
        <div className="md:hidden w-full border-b border-[#E4DCC8] p-2 bg-[#FFFFFF] overflow-x-auto flex gap-1 sticky top-[57px] z-30">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`px-3 py-1.5 rounded text-xs font-medium whitespace-nowrap ${
                activeTab === item.id
                  ? 'bg-[#2C5745] text-[#FAF7F0]'
                  : 'bg-[#FAF7F0] text-[#6B6350]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content Workspace */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          {activeTab === 'settings' && <SettingsEditor />}
          {activeTab === 'home' && <HomePageEditor />}
          {activeTab === 'about' && <AboutPageEditor />}
          {activeTab === 'articles' && <ArticlesManager />}
          {activeTab === 'initiatives' && <InitiativesManager />}
          {activeTab === 'team' && <TeamManager />}
        </main>
      </div>

      {/* Change Password Modal */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FFFFFF] border border-[#E4DCC8] rounded-2xl max-w-sm w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-['Fraunces'] font-semibold text-lg text-[#211C0D]">
                Change Password
              </h3>
              <button
                type="button"
                onClick={() => setIsPasswordModalOpen(false)}
                className="text-[#6B6350] hover:text-[#211C0D] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-[#6B6350]">
              Update the password for <strong className="text-[#211C0D]">{adminUser?.email}</strong>.
            </p>

            <form onSubmit={handlePasswordUpdate} className="space-y-3">
              <div>
                <label className="block text-[11px] font-semibold text-[#211C0D] uppercase mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D] focus:outline-none focus:ring-1 focus:ring-[#2C5745]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#211C0D] uppercase mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password"
                  className="w-full text-xs px-3 py-2 bg-[#FAF7F0] border border-[#E4DCC8] rounded-md text-[#211C0D] focus:outline-none focus:ring-1 focus:ring-[#2C5745]"
                />
              </div>

              {pwResult && (
                <div
                  className={`p-2.5 rounded-lg text-xs flex items-start gap-1.5 ${
                    pwResult.success
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : 'bg-red-50 text-red-800 border border-red-200'
                  }`}
                >
                  {pwResult.success ? (
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-red-600 shrink-0 mt-0.5" />
                  )}
                  <span>{pwResult.message}</span>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPasswordModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={pwLoading}
                >
                  {pwLoading ? 'Saving...' : 'Update Password'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
