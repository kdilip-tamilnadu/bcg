import { 
  CompanyId, 
  FinancialMetricKey, 
  ChatMessage, 
  ChatContext,
  FinancialRecord 
} from '../types/finance';
import { 
  COMPANIES, 
  FINANCIAL_RECORDS, 
  formatCurrency, 
  getCompanyRecords, 
  getRecord,
  BCG_STRATEGIC_BENCHMARKS
} from '../data/financialData';

export interface ParseResult {
  intent: 
    | 'single-metric'
    | 'comparison'
    | 'company-summary'
    | 'trend'
    | 'ranking'
    | 'cagr'
    | 'margin'
    | 'board-brief'
    | 'clarification'
    | 'unsupported-company'
    | 'fallback';
  companies: CompanyId[];
  years: (2023 | 2024 | 2025)[];
  metrics: FinancialMetricKey[];
  isTrendQuery: boolean;
  isRankingQuery: boolean;
  unsupportedEntity?: string;
  confidence: number;
}

// Synonyms mapping for companies
const COMPANY_SYNONYMS: Record<CompanyId, string[]> = {
  MSFT: ['microsoft', 'msft', 'windows', 'azure', 'satya', 'nadella'],
  AAPL: ['apple', 'aapl', 'iphone', 'tim cook', 'macbook', 'ipad'],
  TSLA: ['tesla', 'tsla', 'elon', 'musk', 'ev', 'automotive', 'supercharger'],
};

// Synonyms mapping for financial metrics
const METRIC_SYNONYMS: Record<FinancialMetricKey, string[]> = {
  revenue: ['revenue', 'sales', 'topline', 'top line', 'turnover', 'gross revenue', 'revenues'],
  netIncome: ['net income', 'profit', 'profits', 'net profit', 'earnings', 'bottom line', 'net earnings'],
  totalAssets: ['assets', 'total assets', 'asset', 'balance sheet assets'],
  totalLiabilities: ['liabilities', 'total liabilities', 'debt', 'obligations', 'liability'],
  operatingCashFlow: ['cash flow', 'operating cash flow', 'ocf', 'cash from operations', 'operations cash', 'cashflow', 'operating cash'],
};

const METRIC_LABELS: Record<FinancialMetricKey, string> = {
  revenue: 'Total Revenue',
  netIncome: 'Net Income',
  totalAssets: 'Total Assets',
  totalLiabilities: 'Total Liabilities',
  operatingCashFlow: 'Cash Flow from Operations',
};

// Unsupported popular companies to provide polite guidance
const UNSUPPORTED_COMPANIES = [
  'amazon', 'amzn', 'google', 'alphabet', 'googl', 'goog', 
  'meta', 'facebook', 'nvidia', 'nvda', 'netflix', 'nflx',
  'jpmorgan', 'goldman', 'morgan stanley', 'berkshire'
];

/**
 * Normalizes input text and extracts entities
 */
export function parseQuery(query: string, context: ChatContext): ParseResult {
  const lower = query.toLowerCase().trim();

  // Check for unsupported companies first
  for (const uns of UNSUPPORTED_COMPANIES) {
    if (new RegExp(`\\b${uns}\\b`, 'i').test(lower)) {
      return {
        intent: 'unsupported-company',
        companies: [],
        years: [],
        metrics: [],
        isTrendQuery: false,
        isRankingQuery: false,
        unsupportedEntity: uns.toUpperCase(),
        confidence: 0.95,
      };
    }
  }

  // Check for Executive / Board Brief intent
  if (
    lower.includes('executive board') ||
    lower.includes('executive summary') ||
    lower.includes('key findings') ||
    lower.includes('board brief') ||
    lower.includes('strategic insight') ||
    lower.includes('takeaway') ||
    lower.includes('recommendation')
  ) {
    return {
      intent: 'board-brief',
      companies: ['MSFT', 'AAPL', 'TSLA'],
      years: [2023, 2024, 2025],
      metrics: ['revenue', 'netIncome'],
      isTrendQuery: true,
      isRankingQuery: false,
      confidence: 1.0,
    };
  }

  // Detect Companies
  const detectedCompanies: CompanyId[] = [];
  (Object.keys(COMPANY_SYNONYMS) as CompanyId[]).forEach((cid) => {
    const matched = COMPANY_SYNONYMS[cid].some((syn) => {
      const reg = new RegExp(`\\b${syn}\\b`, 'i');
      return reg.test(lower);
    });
    if (matched) {
      detectedCompanies.push(cid);
    }
  });

  // Detect "all", "peers", "compare all", "three companies"
  const mentionsAll = 
    lower.includes('all companies') || 
    lower.includes('all three') || 
    lower.includes('everyone') || 
    lower.includes('peers') ||
    lower.includes('cohort');
  
  if (mentionsAll && detectedCompanies.length === 0) {
    detectedCompanies.push('MSFT', 'AAPL', 'TSLA');
  }

  // Detect Years
  const detectedYears: (2023 | 2024 | 2025)[] = [];
  if (lower.includes('2023')) detectedYears.push(2023);
  if (lower.includes('2024')) detectedYears.push(2024);
  if (lower.includes('2025')) detectedYears.push(2025);

  // Detect trend / multi-year words
  const isTrendQuery = 
    lower.includes('trend') || 
    lower.includes('growth') || 
    lower.includes('over time') || 
    lower.includes('history') || 
    lower.includes('progression') ||
    lower.includes('trajectory') ||
    lower.includes('yoy') ||
    lower.includes('all years');

  // Detect ranking words
  const isRankingQuery = 
    lower.includes('rank') || 
    lower.includes('highest') || 
    lower.includes('lowest') || 
    lower.includes('biggest') || 
    lower.includes('largest') || 
    lower.includes('most') || 
    lower.includes('least') || 
    lower.includes('best') || 
    lower.includes('top');

  // Detect CAGR words
  const isCagrQuery = lower.includes('cagr') || lower.includes('compound');

  // Detect Margin query
  const isMarginQuery = lower.includes('margin') || lower.includes('profitability');

  // Detect Metrics
  const detectedMetrics: FinancialMetricKey[] = [];
  (Object.keys(METRIC_SYNONYMS) as FinancialMetricKey[]).forEach((mKey) => {
    const matched = METRIC_SYNONYMS[mKey].some((syn) => {
      const reg = new RegExp(`\\b${syn}\\b`, 'i');
      return reg.test(lower);
    });
    if (matched) {
      detectedMetrics.push(mKey);
    }
  });

  // Multi-turn State Inheritance:
  // If no company mentioned, inherit from previous context if available
  let resolvedCompanies = [...detectedCompanies];
  if (resolvedCompanies.length === 0 && context.activeCompany) {
    resolvedCompanies.push(context.activeCompany);
  }

  // If no metric mentioned but margin query
  if (detectedMetrics.length === 0 && isMarginQuery) {
    detectedMetrics.push('netIncome');
  }

  // If no metric mentioned, inherit previous metric or default to revenue
  let resolvedMetrics = [...detectedMetrics];
  if (resolvedMetrics.length === 0 && context.lastMetric) {
    resolvedMetrics.push(context.lastMetric);
  }

  // If no year mentioned, and it's not a trend query, inherit or default to 2024/2025
  let resolvedYears = [...detectedYears];
  if (resolvedYears.length === 0) {
    if (isTrendQuery || isCagrQuery) {
      resolvedYears = [2023, 2024, 2025];
    } else if (context.activeYear) {
      resolvedYears = [context.activeYear];
    } else {
      resolvedYears = [2024]; // Standard recent audited benchmark year
    }
  }

  // Determine Intent
  if (isRankingQuery) {
    return {
      intent: 'ranking',
      companies: resolvedCompanies.length > 0 ? resolvedCompanies : ['MSFT', 'AAPL', 'TSLA'],
      years: resolvedYears.length > 0 ? [resolvedYears[0]] : [2024],
      metrics: resolvedMetrics.length > 0 ? resolvedMetrics : ['revenue'],
      isTrendQuery: false,
      isRankingQuery: true,
      confidence: 0.9,
    };
  }

  if (isCagrQuery) {
    return {
      intent: 'cagr',
      companies: resolvedCompanies.length > 0 ? resolvedCompanies : ['MSFT', 'AAPL', 'TSLA'],
      years: [2023, 2024, 2025],
      metrics: resolvedMetrics.length > 0 ? resolvedMetrics : ['revenue'],
      isTrendQuery: true,
      isRankingQuery: false,
      confidence: 0.95,
    };
  }

  if (isMarginQuery) {
    return {
      intent: 'margin',
      companies: resolvedCompanies.length > 0 ? resolvedCompanies : ['MSFT', 'AAPL', 'TSLA'],
      years: resolvedYears,
      metrics: ['netIncome'],
      isTrendQuery: isTrendQuery || resolvedYears.length > 1,
      isRankingQuery: false,
      confidence: 0.9,
    };
  }

  const isComparisonQuery = 
    lower.includes('compare') || 
    lower.includes('versus') || 
    lower.includes(' vs ') || 
    lower.includes(' vs. ') || 
    lower.includes('difference') ||
    resolvedCompanies.length >= 2;

  if (isComparisonQuery) {
    return {
      intent: 'comparison',
      companies: resolvedCompanies.length >= 2 ? resolvedCompanies : ['MSFT', 'AAPL', 'TSLA'],
      years: resolvedYears,
      metrics: resolvedMetrics.length > 0 ? resolvedMetrics : ['revenue', 'netIncome'],
      isTrendQuery,
      isRankingQuery: false,
      confidence: 0.9,
    };
  }

  if (isTrendQuery) {
    return {
      intent: 'trend',
      companies: resolvedCompanies.length > 0 ? resolvedCompanies : ['MSFT', 'AAPL', 'TSLA'],
      years: [2023, 2024, 2025],
      metrics: resolvedMetrics.length > 0 ? resolvedMetrics : ['operatingCashFlow'],
      isTrendQuery: true,
      isRankingQuery: false,
      confidence: 0.85,
    };
  }

  // If user only gave a company name like "Tesla" or "Apple overview"
  if (detectedCompanies.length === 1 && detectedMetrics.length === 0 && detectedYears.length === 0) {
    return {
      intent: 'company-summary',
      companies: detectedCompanies,
      years: [2023, 2024, 2025],
      metrics: ['revenue', 'netIncome', 'totalAssets', 'totalLiabilities', 'operatingCashFlow'],
      isTrendQuery: true,
      isRankingQuery: false,
      confidence: 0.9,
    };
  }

  // Single metric check
  if (resolvedCompanies.length === 1 && resolvedMetrics.length >= 1 && resolvedYears.length >= 1) {
    return {
      intent: 'single-metric',
      companies: resolvedCompanies,
      years: resolvedYears,
      metrics: resolvedMetrics,
      isTrendQuery: false,
      isRankingQuery: false,
      confidence: 0.85,
    };
  }

  // Clarification fallback
  if (resolvedCompanies.length === 0 && resolvedMetrics.length === 0) {
    return {
      intent: 'fallback',
      companies: [],
      years: [],
      metrics: [],
      isTrendQuery: false,
      isRankingQuery: false,
      confidence: 0.3,
    };
  }

  return {
    intent: 'single-metric',
    companies: resolvedCompanies.length > 0 ? resolvedCompanies : ['MSFT'],
    years: resolvedYears.length > 0 ? resolvedYears : [2024],
    metrics: resolvedMetrics.length > 0 ? resolvedMetrics : ['revenue'],
    isTrendQuery: false,
    isRankingQuery: false,
    confidence: 0.7,
  };
}

/**
 * Generates an executive-grade consulting response based on parsed intent
 */
export function generateBotResponse(
  query: string, 
  context: ChatContext
): { message: ChatMessage; newContext: ChatContext } {
  const parsed = parseQuery(query, context);
  const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const msgId = 'msg-' + Math.random().toString(36).substring(2, 9);

  // Update context state
  const newContext: ChatContext = {
    ...context,
    conversationTurnCount: context.conversationTurnCount + 1,
    activeCompany: parsed.companies[0] || context.activeCompany,
    activeYear: parsed.years[0] || context.activeYear,
    lastMetric: parsed.metrics[0] || context.lastMetric,
  };

  // 1. Board / Executive Brief
  if (parsed.intent === 'board-brief') {
    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `Here is the executive financial synthesis prepared by BCG GenAI Consulting for the **Global Finance Corp (GFC)** client project, reviewing audited SEC 10-K filings (2023–2025):`,
        structuredData: {
          type: 'board-brief',
          companies: ['MSFT', 'AAPL', 'TSLA'],
          highlights: [
            { label: 'Highest Margin', value: 'Microsoft (36.0%)', detail: 'Elite cloud pricing power' },
            { label: 'Cash Flow Leader', value: 'Microsoft ($136.2B)', detail: 'Surpassed Apple in 2025' },
            { label: 'Lowest Leverage', value: 'Tesla (41.7% D/A)', detail: 'Minimal long-term debt load' },
          ],
          table: {
            headers: ['Company', '2025 Revenue', '2025 Net Income', 'Margin', '2-Yr Rev CAGR'],
            rows: [
              ['Microsoft (MSFT)', '$281,800 M', '$101,450 M', '36.00%', '+15.3%'],
              ['Apple (AAPL)', '$416,500 M', '$105,200 M', '25.26%', '+4.2%'],
              ['Tesla (TSLA)', '$114,800 M', '$9,650 M', '8.41%', '+8.9%'],
            ],
          },
          strategicInsight: 'Key Takeaway for GFC: Microsoft represents the strongest risk-adjusted compounding profile with ~15.3% CAGR and expanding 36% net margins. Apple remains a tier-1 cash cow, while Tesla is navigating an aggressive R&D/AI Capex cycle.',
          secSource: 'SEC Form 10-K Filings (FY2023 - FY2025) across MSFT, AAPL, and TSLA.',
        },
        suggestions: [
          'What was Microsoft\'s revenue in 2024?',
          'Compare Apple and Tesla net income 2025',
          'Show cash flow trends',
        ],
      },
      newContext,
    };
  }

  // 2. Unsupported company
  if (parsed.intent === 'unsupported-company') {
    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `**Company Scope Notice:** The Global Finance Corp (GFC) engagement scope is currently configured to analyze SEC Form 10-K filings for **Microsoft (MSFT)**, **Apple (AAPL)**, and **Tesla (TSLA)** across 2023, 2024, and 2025.\n\nData for **${parsed.unsupportedEntity}** is not present in the current GFC extracted filing data set. Would you like to analyze one of the benchmark peers?`,
        suggestions: [
          'What was Microsoft\'s revenue in 2024?',
          'Compare Apple and Tesla net income 2025',
          'Rank companies by total assets 2024',
        ],
      },
      newContext,
    };
  }

  // 3. Fallback / Guidance
  if (parsed.intent === 'fallback') {
    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `I can assist with executive financial queries on **Microsoft**, **Apple**, and **Tesla** for fiscal years **2023, 2024, and 2025**.\n\nYou can query:\n• **Specific metrics**: Total Revenue, Net Income, Total Assets, Total Liabilities, Operating Cash Flow.\n• **Comparative queries**: Net margin rankings, multi-firm comparisons, peer head-to-heads.\n• **Trends & CAGR**: 3-year historical trajectories, cash flow trends, balance sheet leverage.`,
        suggestions: [
          'What was Microsoft\'s revenue in 2024?',
          'Compare Apple and Tesla net income 2025',
          'Show cash flow trends',
          'What is Microsoft\'s profit margin in 2025?',
        ],
      },
      newContext,
    };
  }

  // 4. Ranking intent
  if (parsed.intent === 'ranking') {
    const metric = parsed.metrics[0] || 'revenue';
    const metricLabel = METRIC_LABELS[metric];
    const year = parsed.years[0] || 2024;

    const records = (['MSFT', 'AAPL', 'TSLA'] as CompanyId[])
      .map(cid => getRecord(cid, year))
      .filter((r): r is FinancialRecord => !!r)
      .sort((a, b) => b[metric] - a[metric]);

    const winner = records[0];

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `**${metricLabel} Ranking for FY${year}:**\n**${winner.companyName}** ranks #1 with **${formatCurrency(winner[metric])}**. Here is the peer comparison:`,
        structuredData: {
          type: 'ranking',
          metric: metricLabel,
          years: [year],
          table: {
            headers: ['Rank', 'Company', 'Ticker', metricLabel, '% of Cohort'],
            rows: records.map((r, idx) => {
              const totalCohort = records.reduce((sum, item) => sum + item[metric], 0);
              const pct = ((r[metric] / totalCohort) * 100).toFixed(1) + '%';
              return [`#${idx + 1}`, r.companyName, r.companyId, formatCurrency(r[metric]), pct];
            }),
          },
          strategicInsight: `In FY${year}, ${winner.companyName} accounted for the highest share of ${metricLabel.toLowerCase()} within the benchmark group.`,
          secSource: `SEC Form 10-K Filings for FY${year}.`,
        },
        suggestions: [
          `Compare Apple and Tesla net income 2025`,
          `Show cash flow trends`,
          `What was Microsoft\'s revenue in 2024?`,
        ],
      },
      newContext,
    };
  }

  // 5. Margin intent
  if (parsed.intent === 'margin') {
    const year = parsed.years[0] || 2024;
    const records = (['MSFT', 'AAPL', 'TSLA'] as CompanyId[])
      .map(cid => getRecord(cid, year))
      .filter((r): r is FinancialRecord => !!r)
      .sort((a, b) => b.netMargin - a.netMargin);

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `**Net Profit Margin Analysis (FY${year}):**\nMicrosoft commands the highest net profit margin in the cohort at **${records.find(r => r.companyId === 'MSFT')?.netMargin}%**, demonstrating superior software economics compared to hardware (Apple) and automotive/manufacturing (Tesla).`,
        structuredData: {
          type: 'comparison',
          years: [year],
          table: {
            headers: ['Company', 'Revenue', 'Net Income', 'Net Profit Margin (%)', 'Operational Efficiency'],
            rows: records.map(r => [
              r.companyName,
              formatCurrency(r.revenue),
              formatCurrency(r.netIncome),
              `${r.netMargin.toFixed(2)}%`,
              r.netMargin > 30 ? 'Premium Software Moat' : r.netMargin > 20 ? 'Strong Ecosystem' : 'Capital-Intensive Reinvestment'
            ]),
          },
          strategicInsight: 'Software-as-a-Service and Cloud infrastructure allow Microsoft to maintain >35% net margin, whereas Tesla\'s margins fell in 2024 due to aggressive vehicle price cuts and compute investments.',
          secSource: `SEC Form 10-K, Item 8 Financial Statements, FY${year}.`,
        },
        suggestions: [
          'Show cash flow trends',
          'What was Microsoft\'s revenue in 2024?',
          'Summarize key findings for GFC executive board',
        ],
      },
      newContext,
    };
  }

  // 6. CAGR / Compound Growth intent
  if (parsed.intent === 'cagr') {
    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `**2-Year Compound Annual Growth Rate (CAGR) (2023 → 2025):**\nMicrosoft generated the strongest revenue compound annual growth at **+15.3%**, followed by Tesla at **+8.9%**, and Apple at **+4.2%**.`,
        structuredData: {
          type: 'trend',
          table: {
            headers: ['Company', 'Revenue CAGR (23-25)', 'Net Income CAGR (23-25)', 'Strategic Assessment'],
            rows: BCG_STRATEGIC_BENCHMARKS.cagrSummary.map(c => [
              c.company,
              c.revenueCAGR,
              c.netIncomeCAGR,
              c.commentary,
            ]),
          },
          strategicInsight: 'Microsoft\'s enterprise AI commercialization has translated directly into double-digit revenue and earnings CAGR, outperforming consumer hardware replacement cycle timelines.',
          secSource: 'SEC Form 10-K historical comparison 2023 through 2025.',
        },
        suggestions: [
          'What was Microsoft\'s revenue in 2024?',
          'Compare Apple and Tesla net income 2025',
          'Show cash flow trends',
        ],
      },
      newContext,
    };
  }

  // 7. Trend intent (e.g. "Show cash flow trends")
  if (parsed.intent === 'trend') {
    const metric = parsed.metrics[0] || 'operatingCashFlow';
    const metricLabel = METRIC_LABELS[metric];

    const rows = (['MSFT', 'AAPL', 'TSLA'] as CompanyId[]).map(cid => {
      const recs = getCompanyRecords(cid);
      const v23 = recs.find(r => r.year === 2023)?.[metric] || 0;
      const v24 = recs.find(r => r.year === 2024)?.[metric] || 0;
      const v25 = recs.find(r => r.year === 2025)?.[metric] || 0;
      const delta23to25 = (((v25 - v23) / v23) * 100).toFixed(1);
      return [
        COMPANIES[cid].name,
        formatCurrency(v23),
        formatCurrency(v24),
        formatCurrency(v25),
        `${+delta23to25 > 0 ? '+' : ''}${delta23to25}%`,
      ];
    });

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `**${metricLabel} Multi-Year Trend Analysis (2023 - 2025):**\nHere is the trajectory across Microsoft, Apple, and Tesla:`,
        structuredData: {
          type: 'trend',
          metric: metricLabel,
          years: [2023, 2024, 2025],
          table: {
            headers: ['Company', '2023', '2024', '2025', '2-Yr Change'],
            rows,
          },
          strategicInsight: metric === 'operatingCashFlow'
            ? 'Remarkable dynamic: Microsoft overtook Apple in Operating Cash Flow in 2025 ($136,200M vs $128,400M), driven by sticky cloud margins and B2B contract durability.'
            : `All three companies expanded ${metricLabel.toLowerCase()} over the period, led by Microsoft\'s rapid scale.`,
          secSource: 'Consolidated Statement of Cash Flows & Income, SEC Form 10-K (2023-2025).',
        },
        suggestions: [
          'What was Microsoft\'s revenue in 2024?',
          'Compare Apple and Tesla net income 2025',
          'What is Microsoft\'s profit margin in 2025?',
        ],
      },
      newContext,
    };
  }

  // 8. Company Summary intent (e.g. "Tell me about Tesla")
  if (parsed.intent === 'company-summary') {
    const cid = parsed.companies[0] || 'TSLA';
    const comp = COMPANIES[cid];
    const recs = getCompanyRecords(cid);

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `**${comp.name} (${comp.ticker}) Executive Financial Profile:**\nSector: ${comp.sector} | CIK: ${comp.cik} | FY End: ${comp.fiscalYearEnd}\n\nHere is the complete extracted SEC 10-K dataset across 2023–2025:`,
        structuredData: {
          type: 'company-summary',
          companies: [cid],
          years: [2023, 2024, 2025],
          table: {
            headers: ['Fiscal Year', 'Revenue', 'Net Income', 'Net Margin', 'Assets', 'Liabilities', 'Operating Cash Flow'],
            rows: recs.map(r => [
              r.year.toString(),
              formatCurrency(r.revenue),
              formatCurrency(r.netIncome),
              `${r.netMargin}%`,
              formatCurrency(r.totalAssets),
              formatCurrency(r.totalLiabilities),
              formatCurrency(r.operatingCashFlow),
            ]),
          },
          strategicInsight: cid === 'MSFT'
            ? 'Microsoft exhibits textbook cloud software operating leverage: revenue grew from $211.9B to $281.8B while net margins expanded from 34.2% to 36.0%.'
            : cid === 'TSLA'
            ? 'Tesla experienced gross margin compression in 2024 due to EV price reductions, but returned to growth in 2025 bolstered by energy storage (+125% volume) and software monetization.'
            : 'Apple delivers unparalleled stability with >$100B annual net income and massive capital returns via share repurchases.',
          secSource: `SEC Form 10-K Filings for ${comp.name}.`,
        },
        suggestions: [
          `Compare ${comp.ticker} and MSFT net income 2025`,
          'Show cash flow trends',
          'Rank companies by total assets 2024',
        ],
      },
      newContext,
    };
  }

  // 9. Comparison intent (e.g. "Compare Apple and Tesla net income 2025")
  if (parsed.intent === 'comparison') {
    const year = parsed.years[0] || 2025;
    const comps: CompanyId[] = parsed.companies.length >= 2 ? parsed.companies : ['AAPL', 'TSLA'];
    const metric = parsed.metrics[0] || 'netIncome';
    const metricLabel = METRIC_LABELS[metric];

    const records = comps.map(cid => getRecord(cid, year)).filter((r): r is FinancialRecord => !!r);

    const diff = records.length === 2 ? Math.abs(records[0][metric] - records[1][metric]) : 0;
    const leader = records.length === 2 ? (records[0][metric] > records[1][metric] ? records[0] : records[1]) : records[0];

    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `**Comparative Analysis for FY${year} (${comps.map(c => COMPANIES[c].ticker).join(' vs ')}):**\n${records.length === 2 ? `${leader.companyName} generated **${formatCurrency(diff)}** more in ${metricLabel} than its peer in FY${year}.` : `Comparing ${comps.join(', ')} across key SEC figures:`}`,
        structuredData: {
          type: 'comparison',
          companies: comps,
          years: [year],
          table: {
            headers: ['Company', metricLabel, 'Total Revenue', 'Net Margin (%)', 'Cash Flow Operations'],
            rows: records.map(r => [
              r.companyName,
              formatCurrency(r[metric]),
              formatCurrency(r.revenue),
              `${r.netMargin}%`,
              formatCurrency(r.operatingCashFlow),
            ]),
          },
          strategicInsight: `While ${records[0].companyName} and ${records[1]?.companyName || 'peers'} serve different end-markets, their cash conversion ratio highlights differing capital intensity profiles.`,
          secSource: `SEC Form 10-K filings for FY${year}.`,
        },
        suggestions: [
          'What was Microsoft\'s revenue in 2024?',
          'Show cash flow trends',
          'Summarize key findings for GFC executive board',
        ],
      },
      newContext,
    };
  }

  // 10. Single-metric exact response (e.g. "What was Microsoft's revenue in 2024?")
  const cid = parsed.companies[0] || 'MSFT';
  const year = parsed.years[0] || 2024;
  const metric = parsed.metrics[0] || 'revenue';
  const metricLabel = METRIC_LABELS[metric];
  const comp = COMPANIES[cid];
  const record = getRecord(cid, year);

  if (!record) {
    return {
      message: {
        id: msgId,
        sender: 'assistant',
        timestamp: now,
        text: `Could not retrieve ${metricLabel} for ${comp.name} in FY${year}. Data is verified for 2023, 2024, and 2025.`,
        suggestions: [
          'What was Microsoft\'s revenue in 2024?',
          'Compare Apple and Tesla net income 2025',
          'Show cash flow trends',
        ],
      },
      newContext,
    };
  }

  const prevYearRec = getRecord(cid, (year - 1) as any);
  let yoyText = '';
  if (prevYearRec) {
    const yoy = (((record[metric] - prevYearRec[metric]) / prevYearRec[metric]) * 100).toFixed(1);
    yoyText = ` (${+yoy >= 0 ? '+' : ''}${yoy}% YoY vs FY${year - 1})`;
  }

  const valFormatted = formatCurrency(record[metric]);

  return {
    message: {
      id: msgId,
      sender: 'assistant',
      timestamp: now,
      text: `In fiscal year **${year}**, **${comp.name}** (${comp.ticker}) reported **${metricLabel}** of **${valFormatted}**${yoyText}.`,
      structuredData: {
        type: 'single-metric',
        companies: [cid],
        metric: metricLabel,
        years: [year],
        highlights: [
          { label: `${year} ${metricLabel}`, value: valFormatted, detail: yoyText || 'Base year' },
          { label: 'Net Profit Margin', value: `${record.netMargin}%`, detail: `${formatCurrency(record.netIncome)} Net Income` },
          { label: 'Operating Cash Flow', value: formatCurrency(record.operatingCashFlow), detail: 'Operational cash generation' },
        ],
        table: {
          headers: ['Metric', `FY${year} Value`, 'Unit / Context'],
          rows: [
            ['Total Revenue', formatCurrency(record.revenue), 'SEC Form 10-K'],
            ['Net Income', formatCurrency(record.netIncome), `${record.netMargin}% Net Margin`],
            ['Total Assets', formatCurrency(record.totalAssets), 'Balance Sheet Item'],
            ['Total Liabilities', formatCurrency(record.totalLiabilities), `${record.debtToAssets}% Debt-to-Assets`],
            ['Operating Cash Flow', formatCurrency(record.operatingCashFlow), 'Statement of Cash Flows'],
          ],
        },
        strategicInsight: record.notes || `${comp.name} demonstrated consistent operational execution during FY${year}.`,
        secSource: `SEC Form 10-K filed ${record.secFilingDate || 'Annual Report'}.`,
      },
      suggestions: [
        `What about ${comp.ticker} in ${year === 2024 ? '2025' : '2023'}?`,
        `Compare with ${cid === 'MSFT' ? 'Apple' : 'Microsoft'} in ${year}`,
        'Show cash flow trends',
      ],
    },
    newContext,
  };
}
