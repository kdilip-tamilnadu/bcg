import React from 'react';
import { X, Sparkles, Building2, TrendingUp, CheckCircle, ShieldAlert, FileText, Download } from 'lucide-react';
import { BCG_STRATEGIC_BENCHMARKS } from '../data/financialData';

interface ExecutiveBriefModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveBriefModal: React.FC<ExecutiveBriefModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl flex flex-col"
        role="dialog"
        aria-modal="true"
        aria-labelledby="brief-title"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-neutral-800 flex items-start justify-between bg-neutral-950/80 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-emerald-950/70 border border-emerald-800 flex items-center justify-center text-emerald-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                BCG GenAI Consulting Practice · Executive Brief
              </span>
              <h3 id="brief-title" className="text-xl font-bold text-white">
                Global Finance Corp (GFC) Client Engagement Synthesis
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white p-1 rounded-md hover:bg-neutral-800 transition-colors cursor-pointer"
            aria-label="Close executive brief modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6 text-neutral-300 text-sm">
          {/* Executive Overview */}
          <div className="bg-neutral-950/90 border border-neutral-800 rounded-xl p-4">
            <h4 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Engagement Context
            </h4>
            <p className="leading-relaxed text-neutral-200">
              This financial analysis suite has been engineered by BCG GenAI Consulting for the C-Suite and Investment Committee of <strong>Global Finance Corp (GFC)</strong>. It provides an automated, rule-based SEC Form 10-K benchmarking framework across three technology leaders: <strong>Microsoft (MSFT)</strong>, <strong>Apple (AAPL)</strong>, and <strong>Tesla (TSLA)</strong> across fiscal years 2023, 2024, and 2025.
            </p>
          </div>

          {/* 3 Strategic Pillars */}
          <div>
            <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Strategic Takeaways by Entity
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-neutral-950 border border-blue-900/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Microsoft</span>
                  <span className="text-[11px] font-mono text-blue-400">MSFT</span>
                </div>
                <div className="text-xs space-y-1.5 text-neutral-300">
                  <p><strong className="text-white">+15.3%</strong> Rev CAGR (Highest)</p>
                  <p><strong className="text-emerald-400">36.00%</strong> Net Margin (Peak)</p>
                  <p><strong className="text-white">$136.2B</strong> Operating Cash Flow</p>
                  <p className="text-neutral-400 pt-2 border-t border-neutral-800 text-[11px]">
                    Enterprise GenAI monetization driving software operating leverage.
                  </p>
                </div>
              </div>

              <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Apple</span>
                  <span className="text-[11px] font-mono text-neutral-400">AAPL</span>
                </div>
                <div className="text-xs space-y-1.5 text-neutral-300">
                  <p><strong className="text-white">$416.5B</strong> 2025 Revenue (Largest)</p>
                  <p><strong className="text-stone-300">25.26%</strong> Net Margin</p>
                  <p><strong className="text-white">$128.4B</strong> Operating Cash Flow</p>
                  <p className="text-neutral-400 pt-2 border-t border-neutral-800 text-[11px]">
                    Monolithic consumer hardware base with resilient Services expansion.
                  </p>
                </div>
              </div>

              <div className="bg-neutral-950 border border-red-900/40 rounded-xl p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-white">Tesla</span>
                  <span className="text-[11px] font-mono text-red-400">TSLA</span>
                </div>
                <div className="text-xs space-y-1.5 text-neutral-300">
                  <p><strong className="text-white">+8.9%</strong> Rev CAGR</p>
                  <p><strong className="text-red-400">8.41%</strong> Net Margin (Lowest)</p>
                  <p><strong className="text-white">41.72%</strong> Debt-to-Assets (Lowest)</p>
                  <p className="text-neutral-400 pt-2 border-t border-neutral-800 text-[11px]">
                    Automotive price cuts compressed margins; offset by Energy Storage and AI capex.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actionable Recommendations for GFC Board */}
          <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              GFC Board Action Items
            </h4>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Overweight Microsoft:</strong> High cash-flow conversion and sustained 36% margin make MSFT the premier risk-adjusted enterprise asset.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Hold Apple for Capital Return:</strong> Generates $128B+ operating cash flows annually; prime defensive anchor for institutional yields.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Maintain Tesla Watchlist:</strong> Rebounding margins in 2025 demonstrate product mix shift towards high-margin energy storage and software.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-neutral-500">
            <FileText className="w-3.5 h-3.5" />
            <span>Document Reference: BCG-GFC-10K-2026-SYNTHESIS</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Close Brief
          </button>
        </div>
      </div>
    </div>
  );
};
