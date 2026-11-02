import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Filter, 
  ArrowUpDown, 
  ArrowUp, 
  ArrowDown, 
  FileSpreadsheet, 
  FileText,
  Building,
  CheckCircle2,
  ExternalLink,
  Table as TableIcon
} from 'lucide-react';
import { CompanyId, FinancialRecord } from '../types/finance';
import { FINANCIAL_RECORDS, COMPANIES, formatCurrency } from '../data/financialData';

type SortField = 'companyName' | 'year' | 'revenue' | 'netIncome' | 'netMargin' | 'totalAssets' | 'totalLiabilities' | 'operatingCashFlow' | 'debtToAssets';
type SortDirection = 'asc' | 'desc';

export const DataExplorerTab: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompany, setSelectedCompany] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [sortField, setSortField] = useState<SortField>('year');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [viewMode, setViewMode] = useState<'flat' | 'pivot'>('flat');

  // Filter & Search
  const filteredRecords = useMemo(() => {
    return FINANCIAL_RECORDS.filter(record => {
      const matchCompany = selectedCompany === 'ALL' || record.companyId === selectedCompany;
      const matchYear = selectedYear === 'ALL' || record.year.toString() === selectedYear;

      if (!matchCompany || !matchYear) return false;

      if (!searchTerm.trim()) return true;

      const q = searchTerm.toLowerCase();
      return (
        record.companyName.toLowerCase().includes(q) ||
        record.companyId.toLowerCase().includes(q) ||
        record.year.toString().includes(q) ||
        record.revenue.toString().includes(q) ||
        record.netIncome.toString().includes(q) ||
        (record.notes && record.notes.toLowerCase().includes(q))
      );
    });
  }, [selectedCompany, selectedYear, searchTerm]);

  // Sort
  const sortedRecords = useMemo(() => {
    return [...filteredRecords].sort((a, b) => {
      let aVal = a[sortField];
      let bVal = b[sortField];

      if (typeof aVal === 'string') {
        return sortDirection === 'asc' 
          ? (aVal as string).localeCompare(bVal as string)
          : (bVal as string).localeCompare(aVal as string);
      }

      return sortDirection === 'asc' 
        ? (aVal as number) - (bVal as number)
        : (bVal as number) - (aVal as number);
    });
  }, [filteredRecords, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  // Export to CSV
  const handleExportCSV = () => {
    const headers = [
      'Company Name',
      'Ticker',
      'Fiscal Year',
      'Total Revenue ($ Millions)',
      'Net Income ($ Millions)',
      'Net Profit Margin (%)',
      'Total Assets ($ Millions)',
      'Total Liabilities ($ Millions)',
      'Cash Flow from Operations ($ Millions)',
      'Debt to Assets (%)',
      'SEC Filing Date',
      'SEC 10-K Notes',
    ];

    const rows = sortedRecords.map(r => [
      `"${r.companyName}"`,
      r.companyId,
      r.year,
      r.revenue,
      r.netIncome,
      r.netMargin,
      r.totalAssets,
      r.totalLiabilities,
      r.operatingCashFlow,
      r.debtToAssets,
      `"${r.secFilingDate || ''}"`,
      `"${(r.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GFC_SEC_10K_Benchmark_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Title & Description */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-neutral-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <FileSpreadsheet className="w-3.5 h-3.5" />
            <span>SEC Form 10-K Data Repository</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Raw SEC 10-K Filing Data Explorer
          </h2>
          <p className="text-sm text-neutral-400 mt-1 max-w-3xl">
            Directly extracted and verified figures from Item 8 (Consolidated Financial Statements) of official SEC 10-K annual reports. All dollar figures in Millions USD ($M).
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <div className="bg-neutral-900 border border-neutral-800 p-1 rounded-lg flex items-center">
            <button
              onClick={() => setViewMode('flat')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'flat' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Flat Table
            </button>
            <button
              onClick={() => setViewMode('pivot')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'pivot' ? 'bg-neutral-800 text-white' : 'text-neutral-400 hover:text-white'
              }`}
            >
              Multi-Year Pivot
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-sm transition-colors cursor-pointer"
            aria-label="Export filtered data to CSV"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-4 bg-neutral-900 border border-neutral-800 rounded-xl">
        {/* Search */}
        <div className="sm:col-span-6 relative">
          <label htmlFor="search-data" className="sr-only">Search data</label>
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="search-data"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search company, year, metric value, or notes..."
            className="w-full bg-neutral-950 text-white placeholder-neutral-500 text-xs sm:text-sm pl-9 pr-4 py-2.5 rounded-lg border border-neutral-800 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Company Filter */}
        <div className="sm:col-span-3">
          <label htmlFor="filter-company" className="sr-only">Filter by Company</label>
          <select
            id="filter-company"
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full bg-neutral-950 text-neutral-200 text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-neutral-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Companies (3)</option>
            <option value="MSFT">Microsoft (MSFT)</option>
            <option value="AAPL">Apple (AAPL)</option>
            <option value="TSLA">Tesla (TSLA)</option>
          </select>
        </div>

        {/* Year Filter */}
        <div className="sm:col-span-3">
          <label htmlFor="filter-year" className="sr-only">Filter by Year</label>
          <select
            id="filter-year"
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full bg-neutral-950 text-neutral-200 text-xs sm:text-sm px-3 py-2.5 rounded-lg border border-neutral-800 focus:outline-none focus:border-emerald-500 cursor-pointer"
          >
            <option value="ALL">All Years (2023 - 2025)</option>
            <option value="2025">FY2025</option>
            <option value="2024">FY2024</option>
            <option value="2023">FY2023</option>
          </select>
        </div>
      </div>

      {/* Main View Display */}
      {viewMode === 'flat' ? (
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="bg-neutral-950 text-neutral-400 border-b border-neutral-800">
                <tr>
                  <th
                    onClick={() => handleSort('companyName')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Company</span>
                      {sortField === 'companyName' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : <ArrowUpDown className="w-3 h-3 text-neutral-600" />}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('year')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Year</span>
                      {sortField === 'year' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : <ArrowUpDown className="w-3 h-3 text-neutral-600" />}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('revenue')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Total Revenue ($M)</span>
                      {sortField === 'revenue' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : <ArrowUpDown className="w-3 h-3 text-neutral-600" />}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('netIncome')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Net Income ($M)</span>
                      {sortField === 'netIncome' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : <ArrowUpDown className="w-3 h-3 text-neutral-600" />}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('netMargin')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Margin (%)</span>
                      {sortField === 'netMargin' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : <ArrowUpDown className="w-3 h-3 text-neutral-600" />}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('totalAssets')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Total Assets ($M)</span>
                      {sortField === 'totalAssets' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : <ArrowUpDown className="w-3 h-3 text-neutral-600" />}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('totalLiabilities')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Liabilities ($M)</span>
                      {sortField === 'totalLiabilities' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : <ArrowUpDown className="w-3 h-3 text-neutral-600" />}
                    </div>
                  </th>

                  <th
                    onClick={() => handleSort('operatingCashFlow')}
                    className="py-3 px-4 font-semibold cursor-pointer hover:text-white transition-colors select-none"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>Cash Flow Ops ($M)</span>
                      {sortField === 'operatingCashFlow' ? (
                        sortDirection === 'asc' ? <ArrowUp className="w-3.5 h-3.5 text-emerald-400" /> : <ArrowDown className="w-3.5 h-3.5 text-emerald-400" />
                      ) : <ArrowUpDown className="w-3 h-3 text-neutral-600" />}
                    </div>
                  </th>

                  <th className="py-3 px-4 font-semibold">SEC Notes & Drivers</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {sortedRecords.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-neutral-400">
                      No matching financial records found. Try adjusting your search term or filters.
                    </td>
                  </tr>
                ) : (
                  sortedRecords.map((r, idx) => (
                    <tr
                      key={`${r.companyId}-${r.year}`}
                      className="hover:bg-neutral-800/40 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-white flex items-center gap-2">
                        <span 
                          className="w-2 h-2 rounded-full" 
                          style={{ backgroundColor: COMPANIES[r.companyId].borderColor }} 
                        />
                        <span>{r.companyName}</span>
                        <span className="text-neutral-500 font-mono text-[11px]">({r.companyId})</span>
                      </td>

                      <td className="py-3 px-4 font-mono font-semibold text-neutral-200">
                        {r.year}
                      </td>

                      <td className="py-3 px-4 font-mono font-medium text-neutral-100 whitespace-nowrap">
                        {formatCurrency(r.revenue)}
                      </td>

                      <td className="py-3 px-4 font-mono text-emerald-400 font-medium whitespace-nowrap">
                        {formatCurrency(r.netIncome)}
                      </td>

                      <td className="py-3 px-4 font-mono whitespace-nowrap">
                        <span className={`font-semibold ${r.netMargin > 30 ? 'text-blue-400' : r.netMargin > 15 ? 'text-neutral-200' : 'text-amber-400'}`}>
                          {r.netMargin.toFixed(2)}%
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-neutral-300 whitespace-nowrap">
                        {formatCurrency(r.totalAssets)}
                      </td>

                      <td className="py-3 px-4 font-mono text-neutral-300 whitespace-nowrap">
                        {formatCurrency(r.totalLiabilities)}
                      </td>

                      <td className="py-3 px-4 font-mono text-blue-300 font-medium whitespace-nowrap">
                        {formatCurrency(r.operatingCashFlow)}
                      </td>

                      <td className="py-3 px-4 text-neutral-400 text-[11px] max-w-xs truncate" title={r.notes}>
                        {r.notes || 'Official SEC Form 10-K'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="px-4 py-3 bg-neutral-950 border-t border-neutral-800 flex flex-wrap items-center justify-between text-xs text-neutral-500">
            <span>Showing {sortedRecords.length} of {FINANCIAL_RECORDS.length} audited SEC filings</span>
            <span>Accounting Standard: US GAAP · Verified CIK Audits</span>
          </div>
        </div>
      ) : (
        /* Multi-Year Pivot View */
        <div className="space-y-6">
          {(['MSFT', 'AAPL', 'TSLA'] as CompanyId[])
            .filter(cid => selectedCompany === 'ALL' || selectedCompany === cid)
            .map((cid) => {
              const comp = COMPANIES[cid];
              const recs = FINANCIAL_RECORDS.filter(r => r.companyId === cid).sort((a, b) => a.year - b.year);

              return (
                <div key={cid} className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
                  <div className="px-5 py-3.5 bg-neutral-950 border-b border-neutral-800 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: comp.borderColor }} />
                      <h3 className="text-sm font-bold text-white">
                        {comp.name} ({comp.ticker})
                      </h3>
                      <span className="text-neutral-600">·</span>
                      <span className="text-xs text-neutral-400">{comp.sector}</span>
                    </div>
                    <span className="text-xs font-mono text-neutral-500">CIK: {comp.cik}</span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-neutral-900/60 text-neutral-400 border-b border-neutral-800">
                        <tr>
                          <th className="py-2.5 px-4 font-semibold">Financial Line Item</th>
                          <th className="py-2.5 px-4 font-semibold font-mono">FY 2023</th>
                          <th className="py-2.5 px-4 font-semibold font-mono">FY 2024</th>
                          <th className="py-2.5 px-4 font-semibold font-mono">FY 2025</th>
                          <th className="py-2.5 px-4 font-semibold">2-Yr Variance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                        <tr>
                          <td className="py-2.5 px-4 font-medium text-white">Total Revenue ($M)</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[0]?.revenue || 0)}</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[1]?.revenue || 0)}</td>
                          <td className="py-2.5 px-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">{formatCurrency(recs[2]?.revenue || 0)}</td>
                          <td className="py-2.5 px-4 font-medium text-emerald-400 whitespace-nowrap">
                            +{((( (recs[2]?.revenue || 0) - (recs[0]?.revenue || 1) ) / (recs[0]?.revenue || 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-medium text-white whitespace-nowrap">Net Income ($M)</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[0]?.netIncome || 0)}</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[1]?.netIncome || 0)}</td>
                          <td className="py-2.5 px-4 font-mono font-semibold text-emerald-400 whitespace-nowrap">{formatCurrency(recs[2]?.netIncome || 0)}</td>
                          <td className="py-2.5 px-4 font-medium whitespace-nowrap">
                            {((( (recs[2]?.netIncome || 0) - (recs[0]?.netIncome || 1) ) / (recs[0]?.netIncome || 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-medium text-white whitespace-nowrap">Net Profit Margin (%)</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{recs[0]?.netMargin}%</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{recs[1]?.netMargin}%</td>
                          <td className="py-2.5 px-4 font-mono font-semibold text-blue-400 whitespace-nowrap">{recs[2]?.netMargin}%</td>
                          <td className="py-2.5 px-4 whitespace-nowrap">
                            {(((recs[2]?.netMargin || 0) - (recs[0]?.netMargin || 0))).toFixed(2)} pts
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-medium text-white whitespace-nowrap">Total Assets ($M)</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[0]?.totalAssets || 0)}</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[1]?.totalAssets || 0)}</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[2]?.totalAssets || 0)}</td>
                          <td className="py-2.5 px-4 text-neutral-400 whitespace-nowrap">
                            +{((( (recs[2]?.totalAssets || 0) - (recs[0]?.totalAssets || 1) ) / (recs[0]?.totalAssets || 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-medium text-white whitespace-nowrap">Total Liabilities ($M)</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[0]?.totalLiabilities || 0)}</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[1]?.totalLiabilities || 0)}</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[2]?.totalLiabilities || 0)}</td>
                          <td className="py-2.5 px-4 text-neutral-400 whitespace-nowrap">
                            +{((( (recs[2]?.totalLiabilities || 0) - (recs[0]?.totalLiabilities || 1) ) / (recs[0]?.totalLiabilities || 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2.5 px-4 font-medium text-white whitespace-nowrap">Cash Flow from Operations ($M)</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[0]?.operatingCashFlow || 0)}</td>
                          <td className="py-2.5 px-4 font-mono whitespace-nowrap">{formatCurrency(recs[1]?.operatingCashFlow || 0)}</td>
                          <td className="py-2.5 px-4 font-mono font-semibold text-amber-400 whitespace-nowrap">{formatCurrency(recs[2]?.operatingCashFlow || 0)}</td>
                          <td className="py-2.5 px-4 font-medium text-emerald-400 whitespace-nowrap">
                            +{((( (recs[2]?.operatingCashFlow || 0) - (recs[0]?.operatingCashFlow || 1) ) / (recs[0]?.operatingCashFlow || 1)) * 100).toFixed(1)}%
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};
