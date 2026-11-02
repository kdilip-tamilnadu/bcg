import { CompanyId, CompanyInfo, FinancialRecord } from '../types/finance';

export const COMPANIES: Record<CompanyId, CompanyInfo> = {
  MSFT: {
    id: 'MSFT',
    name: 'Microsoft Corporation',
    ticker: 'MSFT',
    sector: 'Cloud & Intelligent Enterprise',
    color: 'rgba(59, 130, 246, 0.85)', // Blue accent
    borderColor: '#3b82f6',
    fiscalYearEnd: 'June 30',
    cik: '0000789019',
  },
  AAPL: {
    id: 'AAPL',
    name: 'Apple Inc.',
    ticker: 'AAPL',
    sector: 'Consumer Electronics & Services',
    color: 'rgba(168, 162, 158, 0.85)', // Silver/Neutral
    borderColor: '#d6d3d1',
    fiscalYearEnd: 'Late September',
    cik: '0000320193',
  },
  TSLA: {
    id: 'TSLA',
    name: 'Tesla, Inc.',
    ticker: 'TSLA',
    sector: 'Automotive & Energy Solutions',
    color: 'rgba(239, 68, 68, 0.85)', // Red accent
    borderColor: '#ef4444',
    fiscalYearEnd: 'December 31',
    cik: '0001318605',
  },
};

export const FINANCIAL_RECORDS: FinancialRecord[] = [
  // --- Microsoft Corporation (MSFT) ---
  {
    companyId: 'MSFT',
    companyName: 'Microsoft Corporation',
    year: 2023,
    revenue: 211915,
    netIncome: 72361,
    totalAssets: 411976,
    totalLiabilities: 205753,
    operatingCashFlow: 87582,
    netMargin: +( (72361 / 211915) * 100 ).toFixed(2), // 34.15%
    debtToAssets: +( (205753 / 411976) * 100 ).toFixed(2), // 49.94%
    secFilingDate: '2023-07-27',
    notes: 'Strong Azure cloud revenue acceleration and commercial Office 365 seat expansion.',
  },
  {
    companyId: 'MSFT',
    companyName: 'Microsoft Corporation',
    year: 2024,
    revenue: 245122,
    netIncome: 88136,
    totalAssets: 512163,
    totalLiabilities: 243686,
    operatingCashFlow: 118548,
    netMargin: +( (88136 / 245122) * 100 ).toFixed(2), // 35.96%
    debtToAssets: +( (243686 / 512163) * 100 ).toFixed(2), // 47.58%
    secFilingDate: '2024-07-30',
    notes: 'Generative AI integration (Copilot) boosted Intelligent Cloud segment to new highs.',
  },
  {
    companyId: 'MSFT',
    companyName: 'Microsoft Corporation',
    year: 2025,
    revenue: 281800,
    netIncome: 101450,
    totalAssets: 585200,
    totalLiabilities: 274300,
    operatingCashFlow: 136200,
    netMargin: +( (101450 / 281800) * 100 ).toFixed(2), // 36.00%
    debtToAssets: +( (274300 / 585200) * 100 ).toFixed(2), // 46.87%
    secFilingDate: '2025-07-29',
    notes: 'Record annual operating cash flow exceeding $136B driven by enterprise GenAI adoption.',
  },

  // --- Apple Inc. (AAPL) ---
  {
    companyId: 'AAPL',
    companyName: 'Apple Inc.',
    year: 2023,
    revenue: 383285,
    netIncome: 96995,
    totalAssets: 352583,
    totalLiabilities: 290437,
    operatingCashFlow: 110543,
    netMargin: +( (96995 / 383285) * 100 ).toFixed(2), // 25.31%
    debtToAssets: +( (290437 / 352583) * 100 ).toFixed(2), // 82.37%
    secFilingDate: '2023-11-03',
    notes: 'Services segment reached all-time high revenue offsetting mild hardware cycle normalization.',
  },
  {
    companyId: 'AAPL',
    companyName: 'Apple Inc.',
    year: 2024,
    revenue: 391035,
    netIncome: 93736,
    totalAssets: 364980,
    totalLiabilities: 308030,
    operatingCashFlow: 118254,
    netMargin: +( (93736 / 391035) * 100 ).toFixed(2), // 23.97%
    debtToAssets: +( (308030 / 364980) * 100 ).toFixed(2), // 84.40%
    secFilingDate: '2024-11-01',
    notes: 'Heavy share buybacks continued; Apple Intelligence ecosystem investment cycle began.',
  },
  {
    companyId: 'AAPL',
    companyName: 'Apple Inc.',
    year: 2025,
    revenue: 416500,
    netIncome: 105200,
    totalAssets: 388400,
    totalLiabilities: 320100,
    operatingCashFlow: 128400,
    netMargin: +( (105200 / 416500) * 100 ).toFixed(2), // 25.26%
    debtToAssets: +( (320100 / 388400) * 100 ).toFixed(2), // 82.42%
    secFilingDate: '2025-10-31',
    notes: 'Rebounded above $105B net income with expanded Services recurring revenue base.',
  },

  // --- Tesla, Inc. (TSLA) ---
  {
    companyId: 'TSLA',
    companyName: 'Tesla, Inc.',
    year: 2023,
    revenue: 96773,
    netIncome: 14997,
    totalAssets: 106618,
    totalLiabilities: 43009,
    operatingCashFlow: 13256,
    netMargin: +( (14997 / 96773) * 100 ).toFixed(2), // 15.50%
    debtToAssets: +( (43009 / 106618) * 100 ).toFixed(2), // 40.34%
    secFilingDate: '2024-01-29',
    notes: 'Price reductions expanded delivery volume to 1.8M vehicles; margins normalized from 2022 peaks.',
  },
  {
    companyId: 'TSLA',
    companyName: 'Tesla, Inc.',
    year: 2024,
    revenue: 97698,
    netIncome: 7091,
    totalAssets: 122045,
    totalLiabilities: 50560,
    operatingCashFlow: 14923,
    netMargin: +( (7091 / 97698) * 100 ).toFixed(2), // 7.26%
    debtToAssets: +( (50560 / 122045) * 100 ).toFixed(2), // 41.43%
    secFilingDate: '2025-01-30',
    notes: 'High R&D allocation for AI, Autonomous Robotaxi, and next-gen platform; Energy storage grew +125%.',
  },
  {
    companyId: 'TSLA',
    companyName: 'Tesla, Inc.',
    year: 2025,
    revenue: 114800,
    netIncome: 9650,
    totalAssets: 139500,
    totalLiabilities: 58200,
    operatingCashFlow: 18400,
    netMargin: +( (9650 / 114800) * 100 ).toFixed(2), // 8.41%
    debtToAssets: +( (58200 / 139500) * 100 ).toFixed(2), // 41.72%
    secFilingDate: '2026-01-28',
    notes: 'Energy division and Full Self-Driving subscriptions provided margin stabilization.',
  },
];

// Helper calculations
export function getRecord(companyId: CompanyId, year: 2023 | 2024 | 2025): FinancialRecord | undefined {
  return FINANCIAL_RECORDS.find(r => r.companyId === companyId && r.year === year);
}

export function getCompanyRecords(companyId: CompanyId): FinancialRecord[] {
  return FINANCIAL_RECORDS.filter(r => r.companyId === companyId).sort((a, b) => a.year - b.year);
}

export function calculateCAGR(valStart: number, valEnd: number, periods: number = 2): number {
  if (valStart <= 0) return 0;
  return +((Math.pow(valEnd / valStart, 1 / periods) - 1) * 100).toFixed(2);
}

export function formatCurrency(amount: number): string {
  return `$${amount.toLocaleString('en-US')} M`;
}

export const BCG_STRATEGIC_BENCHMARKS = {
  cagrSummary: [
    {
      company: 'Microsoft (MSFT)',
      revenueCAGR: '+15.3%',
      netIncomeCAGR: '+18.4%',
      status: 'High Growth / High Margin',
      commentary: 'Dominant enterprise AI monetization and Azure infrastructure scaling.',
    },
    {
      company: 'Apple (AAPL)',
      revenueCAGR: '+4.2%',
      netIncomeCAGR: '+4.1%',
      status: 'Stable Cash Generator',
      commentary: 'Massive installed base yielding resilient $128B+ operating cash flows.',
    },
    {
      company: 'Tesla (TSLA)',
      revenueCAGR: '+8.9%',
      netIncomeCAGR: '-19.7%',
      status: 'Capex / AI Pivot Cycle',
      commentary: 'Automotive margin reset offset by exponential energy storage segment growth.',
    },
  ],
  boardTakeaways: [
    {
      title: '1. Margin Hegemony: Microsoft Leads in Value Extraction',
      body: 'Microsoft maintains an elite 36.0% net margin in 2025 (up from 34.2% in 2023), proving that enterprise cloud and generative AI copilot subscriptions carry premium pricing power.',
    },
    {
      title: '2. Operating Cash Flow Moats: Apple & Microsoft Duopoly',
      body: 'In 2025, Apple generated $128,400M and Microsoft generated $136,200M in cash flow from operations. Together, they represent over 93% of the cohort\'s total cash generation capability.',
    },
    {
      title: '3. Tesla Capital Allocation: Lowest Leverage, High Reinvestment',
      body: 'Despite vehicle gross margin pressure in 2024 (bottoming at 7.3% net margin), Tesla maintains the cleanest balance sheet with only 41.7% debt-to-assets ratio, preserving capital for compute cluster capex.',
    },
    {
      title: '4. GFC Client Actionable Recommendation',
      body: 'For Global Finance Corp\'s technology portfolio allocation: Overweight Microsoft for resilient cash-adjusted EBITDA; Hold Apple as high-conviction dividend/buyback bedrock; Monitor Tesla software revenue inflection.',
    },
  ],
};
