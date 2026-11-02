/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header, ActiveTab } from './components/Header';
import { ChatbotTab } from './components/ChatbotTab';
import { AnalyticsTab } from './components/AnalyticsTab';
import { DataExplorerTab } from './components/DataExplorerTab';
import { ExecutiveBriefModal } from './components/ExecutiveBriefModal';
import { Building2, ShieldCheck, FileCheck, Layers } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('chat');
  const [isExecutiveModalOpen, setIsExecutiveModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Header */}
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenExecutiveModal={() => setIsExecutiveModalOpen(true)}
      />

      {/* Main Tab Content */}
      <main className="flex-1 w-full">
        {activeTab === 'chat' && (
          <ChatbotTab onNavigateToTab={(tab) => setActiveTab(tab)} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsTab />
        )}

        {activeTab === 'explorer' && (
          <DataExplorerTab />
        )}
      </main>

      {/* Corporate BCG Footer */}
      <footer className="border-t border-neutral-900 bg-neutral-950/80 mt-auto py-6 px-4 sm:px-6 lg:px-8 text-xs text-neutral-500">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-neutral-400">BCG GenAI Consulting</span>
            <span className="text-neutral-700" aria-hidden="true">|</span>
            <span>Client: Global Finance Corp (GFC)</span>
            <span className="text-neutral-700 hidden sm:inline" aria-hidden="true">·</span>
            <span className="hidden sm:inline">Project Code: GFC-SEC-10K-BENCHMARK</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-neutral-400">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              Audited US GAAP Data
            </span>
            <span className="flex items-center gap-1">
              <FileCheck className="w-3.5 h-3.5 text-neutral-500" />
              SEC Form 10-K Filings
            </span>
            <span>FY2023 – FY2025</span>
          </div>
        </div>
      </footer>

      {/* Executive Briefing Modal */}
      <ExecutiveBriefModal
        isOpen={isExecutiveModalOpen}
        onClose={() => setIsExecutiveModalOpen(false)}
      />
    </div>
  );
}
