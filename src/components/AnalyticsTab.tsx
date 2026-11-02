import React, { useState, useEffect, useRef } from 'react';
import { 
  Chart as ChartJS, 
  registerables
} from 'chart.js';
import { 
  TrendingUp, 
  Percent, 
  DollarSign, 
  ShieldCheck, 
  ArrowUpRight, 
  ArrowDownRight, 
  BarChart2, 
  Activity,
  Award,
  Sparkles,
  Layers
} from 'lucide-react';
import { COMPANIES, BCG_STRATEGIC_BENCHMARKS } from '../data/financialData';

// Register all Chart.js components and controllers
ChartJS.register(...registerables);

export const AnalyticsTab: React.FC = () => {
  const [chartType, setChartType] = useState<'bar' | 'line'>('bar');
  const [activeMetricTab, setActiveMetricTab] = useState<'revenue' | 'margin' | 'cashFlow'>('revenue');

  const revenueChartRef = useRef<HTMLCanvasElement | null>(null);
  const marginChartRef = useRef<HTMLCanvasElement | null>(null);
  const revenueChartInstance = useRef<ChartJS | null>(null);
  const marginChartInstance = useRef<ChartJS | null>(null);

  // Initialize or update Revenue Chart
  useEffect(() => {
    if (!revenueChartRef.current) return;

    if (revenueChartInstance.current) {
      revenueChartInstance.current.destroy();
    }

    const ctx = revenueChartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = ['FY2023', 'FY2024', 'FY2025'];

    const datasets = [
      {
        label: 'Microsoft (MSFT)',
        data: [211915, 245122, 281800],
        backgroundColor: chartType === 'bar' ? 'rgba(59, 130, 246, 0.8)' : 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3b82f6',
        borderWidth: 2,
        tension: 0.3,
        fill: chartType === 'line',
      },
      {
        label: 'Apple (AAPL)',
        data: [383285, 391035, 416500],
        backgroundColor: chartType === 'bar' ? 'rgba(168, 162, 158, 0.8)' : 'rgba(168, 162, 158, 0.2)',
        borderColor: '#d6d3d1',
        borderWidth: 2,
        tension: 0.3,
        fill: chartType === 'line',
      },
      {
        label: 'Tesla (TSLA)',
        data: [96773, 97698, 114800],
        backgroundColor: chartType === 'bar' ? 'rgba(239, 68, 68, 0.8)' : 'rgba(239, 68, 68, 0.2)',
        borderColor: '#ef4444',
        borderWidth: 2,
        tension: 0.3,
        fill: chartType === 'line',
      },
    ];

    revenueChartInstance.current = new ChartJS(ctx, {
      type: chartType,
      data: {
        labels,
        datasets,
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#d4d4d4',
              font: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
              padding: 16,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: '#171717',
            titleColor: '#ffffff',
            bodyColor: '#e5e5e5',
            borderColor: '#383838',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: $${(item.raw as number).toLocaleString()} M`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#a3a3a3', font: { family: "'Plus Jakarta Sans', sans-serif" } },
          },
          y: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#a3a3a3',
              font: { family: "'Plus Jakarta Sans', sans-serif" },
              callback: (value) => `$${(Number(value) / 1000).toFixed(0)}B`,
            },
            title: {
              display: true,
              text: 'Total Revenue ($ Millions)',
              color: '#737373',
              font: { size: 11 },
            },
          },
        },
      },
    });

    return () => {
      if (revenueChartInstance.current) {
        revenueChartInstance.current.destroy();
      }
    };
  }, [chartType]);

  // Initialize or update Margin Chart
  useEffect(() => {
    if (!marginChartRef.current) return;

    if (marginChartInstance.current) {
      marginChartInstance.current.destroy();
    }

    const ctx = marginChartRef.current.getContext('2d');
    if (!ctx) return;

    const labels = ['FY2023', 'FY2024', 'FY2025'];

    marginChartInstance.current = new ChartJS(ctx, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Microsoft Margin (%)',
            data: [34.15, 35.96, 36.00],
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.15)',
            borderWidth: 3,
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#3b82f6',
            fill: false,
          },
          {
            label: 'Apple Margin (%)',
            data: [25.31, 23.97, 25.26],
            borderColor: '#d6d3d1',
            backgroundColor: 'rgba(214, 211, 209, 0.15)',
            borderWidth: 3,
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#d6d3d1',
            fill: false,
          },
          {
            label: 'Tesla Margin (%)',
            data: [15.50, 7.26, 8.41],
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.15)',
            borderWidth: 3,
            tension: 0.3,
            pointRadius: 5,
            pointHoverRadius: 7,
            pointBackgroundColor: '#ef4444',
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#d4d4d4',
              font: { size: 12, family: "'Plus Jakarta Sans', sans-serif" },
              padding: 16,
              usePointStyle: true,
            },
          },
          tooltip: {
            backgroundColor: '#171717',
            titleColor: '#ffffff',
            bodyColor: '#e5e5e5',
            borderColor: '#383838',
            borderWidth: 1,
            padding: 12,
            callbacks: {
              label: (item) => ` ${item.dataset.label}: ${(item.raw as number).toFixed(2)}%`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: { color: '#a3a3a3' },
          },
          y: {
            min: 0,
            max: 42,
            grid: { color: 'rgba(255, 255, 255, 0.05)' },
            ticks: {
              color: '#a3a3a3',
              callback: (val) => `${val}%`,
            },
            title: {
              display: true,
              text: 'Net Profit Margin (%)',
              color: '#737373',
              font: { size: 11 },
            },
          },
        },
      },
    });

    return () => {
      if (marginChartInstance.current) {
        marginChartInstance.current.destroy();
      }
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* Executive Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Activity className="w-3.5 h-3.5" />
            <span>Executive Analytics & SEC Benchmarking</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Financial Performance & Margin Comparison (2023–2025)
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Multi-year cross-sectional analysis comparing revenue trajectory, net profit conversion, and operational cash generation across Microsoft, Apple, and Tesla.
          </p>
        </div>

        {/* View toggles */}
        <div className="flex items-center gap-2 self-start md:self-auto bg-neutral-900 border border-neutral-800 p-1 rounded-lg">
          <span className="text-xs text-neutral-400 px-2 font-medium">Chart Type:</span>
          <button
            onClick={() => setChartType('bar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              chartType === 'bar'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Grouped Bar
          </button>
          <button
            onClick={() => setChartType('line')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              chartType === 'line'
                ? 'bg-neutral-800 text-white shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Multi-Line
          </button>
        </div>
      </div>

      {/* Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Revenue CAGR Leader */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Top 2-Yr Revenue CAGR
            </span>
            <div className="w-7 h-7 rounded-md bg-blue-950/60 border border-blue-800/60 flex items-center justify-center text-blue-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">+15.3%</span>
              <span className="text-xs text-blue-400 font-semibold">Microsoft (MSFT)</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              $211.9B (2023) → $281.8B (2025)
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex justify-between">
            <span>Tesla: +8.9% CAGR</span>
            <span>Apple: +4.2% CAGR</span>
          </div>
        </div>

        {/* Card 2: Highest Net Profit Margin */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Peak Net Profit Margin
            </span>
            <div className="w-7 h-7 rounded-md bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-center text-emerald-400">
              <Percent className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">36.00%</span>
              <span className="text-xs text-emerald-400 font-semibold">Microsoft (2025)</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              +$101.4B Net Income on $281.8B Rev
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex justify-between">
            <span>Apple: 25.26%</span>
            <span>Tesla: 8.41%</span>
          </div>
        </div>

        {/* Card 3: Operating Cash Flow Duopoly */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Cash Flow Leadership
            </span>
            <div className="w-7 h-7 rounded-md bg-amber-950/60 border border-amber-800/60 flex items-center justify-center text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">$136.2B</span>
              <span className="text-xs text-amber-400 font-semibold">MSFT OCF 2025</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Overtook Apple ($128.4B) in FY2025
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex justify-between">
            <span>Combined OCF: $283.0B</span>
            <span>Tesla: $18.4B</span>
          </div>
        </div>

        {/* Card 4: Balance Sheet Solvency */}
        <div className="bg-neutral-900/90 border border-neutral-800 rounded-xl p-5 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-400 uppercase tracking-wide">
              Lowest Leverage Ratio
            </span>
            <div className="w-7 h-7 rounded-md bg-purple-950/60 border border-purple-800/60 flex items-center justify-center text-purple-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-white">41.72%</span>
              <span className="text-xs text-purple-400 font-semibold">Tesla (TSLA)</span>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Debt-to-Assets ratio in 2025
            </p>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-800/80 text-[11px] text-neutral-500 flex justify-between">
            <span>MSFT: 46.87%</span>
            <span>AAPL: 82.42%</span>
          </div>
        </div>
      </div>

      {/* Main Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Total Revenue */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-emerald-400" />
                Total Revenue by Company (2023 – 2025)
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Amounts in $ Millions USD (SEC Form 10-K reported)
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
              SEC Item 8
            </span>
          </div>

          <div className="h-72 w-full">
            <canvas ref={revenueChartRef} />
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/70 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-2">
            <span>• Apple leads in total scale ($416.5B)</span>
            <span>• Microsoft leads in absolute dollar expansion (+$69.9B)</span>
          </div>
        </div>

        {/* Chart 2: Net Profit Margins */}
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <div className="flex items-center justify-between pb-3 border-b border-neutral-800 mb-4">
            <div>
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Percent className="w-4 h-4 text-blue-400" />
                Net Profit Margin Trajectory (%)
              </h3>
              <p className="text-xs text-neutral-400 mt-0.5">
                Net Income as percentage of Total Revenue
              </p>
            </div>
            <span className="text-xs font-mono text-neutral-400 bg-neutral-950 px-2 py-1 rounded border border-neutral-800">
              Margin Spread: 27.6%
            </span>
          </div>

          <div className="h-72 w-full">
            <canvas ref={marginChartRef} />
          </div>

          <div className="mt-4 pt-3 border-t border-neutral-800/70 text-xs text-neutral-400 flex flex-wrap items-center justify-between gap-2">
            <span>• MSFT: 34.2% → 36.0% (software moat)</span>
            <span>• TSLA: reset to 7.3% in '24, rebounded to 8.4% in '25</span>
          </div>
        </div>
      </div>

      {/* Detailed Strategic BCG Takeaways for GFC */}
      <div className="bg-neutral-900/60 border border-neutral-800 rounded-xl p-6">
        <div className="flex items-center gap-2.5 pb-4 border-b border-neutral-800 mb-5">
          <div className="w-8 h-8 rounded bg-emerald-950/60 border border-emerald-800 flex items-center justify-center text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              BCG GenAI Consulting | Executive Key Takeaways for GFC Client
            </h3>
            <p className="text-xs text-neutral-400">
              Synthesis of audited SEC Form 10-K data for corporate portfolio strategy
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BCG_STRATEGIC_BENCHMARKS.boardTakeaways.map((takeaway, idx) => (
            <div
              key={idx}
              className="bg-neutral-950/80 border border-neutral-800/90 rounded-lg p-4 hover:border-neutral-700 transition-colors"
            >
              <h4 className="text-sm font-semibold text-emerald-400 mb-1.5 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {takeaway.title}
              </h4>
              <p className="text-xs leading-relaxed text-neutral-300">
                {takeaway.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CAGR & Multi-Year Financial Benchmark Table */}
      <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-neutral-800 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">
              2-Year Compound Annual Growth & Margin Matrix (2023 → 2025)
            </h3>
            <p className="text-xs text-neutral-400">
              Formulas: Revenue CAGR = ((Rev25 / Rev23)^(1/2) - 1); Margin = Net Income / Revenue
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
              <tr>
                <th className="py-3 px-4 font-semibold">Company / Ticker</th>
                <th className="py-3 px-4 font-semibold">2023 Revenue</th>
                <th className="py-3 px-4 font-semibold">2025 Revenue</th>
                <th className="py-3 px-4 font-semibold">2-Yr Rev CAGR</th>
                <th className="py-3 px-4 font-semibold">2023 Margin</th>
                <th className="py-3 px-4 font-semibold">2025 Margin</th>
                <th className="py-3 px-4 font-semibold">2-Yr NI CAGR</th>
                <th className="py-3 px-4 font-semibold">Strategic Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/70 text-neutral-200">
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  Microsoft (MSFT)
                </td>
                <td className="py-3 px-4 font-mono">$211,915 M</td>
                <td className="py-3 px-4 font-mono">$281,800 M</td>
                <td className="py-3 px-4 font-semibold text-emerald-400">+15.3%</td>
                <td className="py-3 px-4">34.15%</td>
                <td className="py-3 px-4 font-semibold text-blue-400">36.00%</td>
                <td className="py-3 px-4 text-emerald-400 font-semibold">+18.4%</td>
                <td className="py-3 px-4 text-neutral-300">Enterprise AI Monetization Leader</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                  Apple (AAPL)
                </td>
                <td className="py-3 px-4 font-mono">$383,285 M</td>
                <td className="py-3 px-4 font-mono">$416,500 M</td>
                <td className="py-3 px-4 font-semibold text-neutral-200">+4.2%</td>
                <td className="py-3 px-4">25.31%</td>
                <td className="py-3 px-4 font-semibold text-stone-300">25.26%</td>
                <td className="py-3 px-4 text-neutral-200 font-semibold">+4.1%</td>
                <td className="py-3 px-4 text-neutral-300">High-Durability Consumer Cash Cow</td>
              </tr>
              <tr className="hover:bg-neutral-800/30">
                <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  Tesla (TSLA)
                </td>
                <td className="py-3 px-4 font-mono">$96,773 M</td>
                <td className="py-3 px-4 font-mono">$114,800 M</td>
                <td className="py-3 px-4 font-semibold text-neutral-200">+8.9%</td>
                <td className="py-3 px-4">15.50%</td>
                <td className="py-3 px-4 font-semibold text-red-400">8.41%</td>
                <td className="py-3 px-4 text-red-400 font-semibold">-19.7%</td>
                <td className="py-3 px-4 text-neutral-300">High Capex / AI Compute Pivot</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
