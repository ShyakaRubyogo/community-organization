import React, { useState } from 'react';
import { useCms } from '../../context/CmsContext';
import { useRouter } from '../../context/RouterContext';
import { SettingsEditor } from './SettingsEditor';
import { HomePageEditor } from './HomePageEditor';
import { AboutPageEditor } from './AboutPageEditor';
import { ArticlesManager } from './ArticlesManager';
import { InitiativesManager } from './InitiativesManager';
import { TeamManager } from './TeamManager';
import { logoutCmsAdmin } from '../../lib/cmsClient';
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
  Radio
} from 'lucide-react';

type AdminTab = 'settings' | 'home' | 'about' | 'articles' | 'initiatives' | 'team';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AdminTab>('settings');
  const { adminUser, isPreviewMode, togglePreviewMode, isSupabaseConnected, logoutAdmin } = useCms();
  const { navigate } = useRouter();

  const handleLogout = async () => {
    await logoutAdmin();
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
            <div className="font-['Fraunces'] font-semibold text-base text-[#211C0D] leading-tight">
              Alliance Studio CMS
            </div>
            <div className="text-[11px] text-[#6B6350] flex items-center gap-1.5">
              <span>{adminUser?.email || 'Authenticated Admin'}</span>
              <span className="text-[#E4DCC8]">|</span>
              <span className="inline-flex items-center gap-1 text-emerald-800 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                {isSupabaseConnected ? 'Postgres Direct' : 'Local Fallback'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Preview Mode Toggle */}
          <button
            type="button"
            onClick={togglePreviewMode}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors border ${
              isPreviewMode
                ? 'bg-amber-100 text-amber-900 border-amber-300'
                : 'bg-[#FAF7F0] text-[#6B6350] border-[#E4DCC8] hover:text-[#211C0D]'
            }`}
            title="When active, browsing the public site displays your saved unpublished drafts."
          >
            <Radio className={`w-3.5 h-3.5 ${isPreviewMode ? 'text-amber-700 animate-pulse' : ''}`} />
            {isPreviewMode ? 'Draft Preview Active' : 'Preview Drafts'}
          </button>

          {/* View Live Site */}
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-3 py-1.5 bg-[#FAF7F0] hover:bg-[#E4DCC8]/40 border border-[#E4DCC8] rounded-lg text-xs font-semibold text-[#211C0D] flex items-center gap-1.5 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#2C5745]" />
            Live Site
          </a>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="p-1.5 text-[#6B6350] hover:text-red-700 transition-colors"
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
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold transition-colors text-left ${
                    isActive
                      ? 'bg-[#2C5745] text-[#FAF7F0] shadow-xs'
                      : 'text-[#4A4437] hover:bg-[#FAF7F0] hover:text-[#211C0D]'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#FAF7F0]' : 'text-[#2C5745]'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="mt-8 p-3 rounded-lg bg-[#FAF7F0] border border-[#E4DCC8]/80 text-[11px] text-[#6B6350] space-y-1">
            <div className="font-semibold text-[#211C0D] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2C5745]" /> Direct Architecture
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
    </div>
  );
};
