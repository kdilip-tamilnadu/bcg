/**
 * Financial data types for SEC 10-K filings and analytics
 */

export type CompanyId = 'MSFT' | 'TSLA' | 'AAPL';

export interface CompanyInfo {
  id: CompanyId;
  name: string;
  ticker: string;
  sector: string;
  color: string;
  borderColor: string;
  fiscalYearEnd: string;
  cik: string;
}

export type FinancialMetricKey = 
  | 'revenue' 
  | 'netIncome' 
  | 'totalAssets' 
  | 'totalLiabilities' 
  | 'operatingCashFlow';

export interface FinancialRecord {
  companyId: CompanyId;
  companyName: string;
  year: 2023 | 2024 | 2025;
  revenue: number;           // in Millions USD
  netIncome: number;         // in Millions USD
  totalAssets: number;       // in Millions USD
  totalLiabilities: number;   // in Millions USD
  operatingCashFlow: number; // in Millions USD
  netMargin: number;         // calculated percentage
  debtToAssets: number;      // calculated percentage
  secFilingDate?: string;
  notes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  timestamp: string;
  text: string;
  structuredData?: {
    type: 'single-metric' | 'comparison' | 'company-summary' | 'trend' | 'ranking' | 'board-brief';
    companies?: CompanyId[];
    metric?: string;
    years?: number[];
    highlights?: { label: string; value: string; detail?: string }[];
    table?: {
      headers: string[];
      rows: (string | number)[][];
    };
    strategicInsight?: string;
    secSource?: string;
  };
  suggestions?: string[];
}

export interface ChatContext {
  activeCompany?: CompanyId;
  activeYear?: 2023 | 2024 | 2025;
  lastMetric?: FinancialMetricKey;
  conversationTurnCount: number;
}
