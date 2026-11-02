import React from 'react';
import { Bot, BarChart3, Database, Building2, Sparkles, FileSpreadsheet } from 'lucide-react';

export type ActiveTab = 'chat' | 'analytics' | 'explorer';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenExecutiveModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenExecutiveModal,
}) => {
  return (
    <header className="border-b border-neutral-800 bg-neutral-950/90 backdrop-blur-md sticky top-0 z-40 transition-colors">
      {/* Top Advisory Bar */}
      <div className="border-b border-neutral-800/60 px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between text-xs text-neutral-400">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 font-semibold text-emerald-400 tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            BCG GenAI Practice
          </span>
          <span className="text-neutral-600" aria-hidden="true">|</span>
          <span className="text-neutral-300 font-medium">Client Engagement: Global Finance Corp (GFC)</span>
          <span className="text-neutral-600 hidden sm:inline" aria-hidden="true">·</span>
          <span className="hidden sm:inline text-neutral-500">SEC 10-K Audited Financial Benchmarking</span>
        </div>

        <div className="flex items-center gap-3 mt-1 sm:mt-0">
          <span className="text-neutral-400">Coverage: MSFT · AAPL · TSLA (FY2023–2025)</span>
          <button
            onClick={onOpenExecutiveModal}
            className="flex items-center gap-1.5 text-neutral-300 hover:text-white px-2.5 py-1 rounded border border-neutral-700 bg-neutral-900 hover:bg-neutral-800 transition-colors text-xs font-medium cursor-pointer"
            aria-label="View GFC Executive Board Briefing"
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span>Executive Brief</span>
          </button>
        </div>
      </div>

      {/* Main Header & Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-4 gap-4">
          {/* Brand Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 shadow-inner">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                  BCG GenAI Consulting
                </h1>
                <span className="text-neutral-600 text-lg">/</span>
                <span className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">
                  GFC Project
                </span>
              </div>
              <p className="text-xs text-neutral-400 mt-0.5">
                Financial Chatbot & Strategic Analytics Suite for C-Suite Decision Making
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav 
            className="flex items-center gap-1.5 p-1 bg-neutral-900 border border-neutral-800 rounded-lg self-start md:self-auto"
            aria-label="Application Sections"
          >
            <button
              onClick={() => onTabChange('chat')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'chat'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
              }`}
              aria-current={activeTab === 'chat' ? 'page' : undefined}
            >
              <Bot className="w-4 h-4 text-emerald-400" />
              <span>💬 AI Financial Chatbot</span>
            </button>

            <button
              onClick={() => onTabChange('analytics')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'analytics'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
              }`}
              aria-current={activeTab === 'analytics' ? 'page' : undefined}
            >
              <BarChart3 className="w-4 h-4 text-blue-400" />
              <span>📊 Financial Analytics Dashboard</span>
            </button>

            <button
              onClick={() => onTabChange('explorer')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all cursor-pointer ${
                activeTab === 'explorer'
                  ? 'bg-neutral-800 text-white shadow-sm border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800/40'
              }`}
              aria-current={activeTab === 'explorer' ? 'page' : undefined}
            >
              <Database className="w-4 h-4 text-amber-400" />
              <span>📁 10-K Data Explorer</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
