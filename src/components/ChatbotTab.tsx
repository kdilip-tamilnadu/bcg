import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  RotateCcw, 
  Bot, 
  User, 
  Sparkles, 
  Copy, 
  Check, 
  FileText, 
  ChevronRight,
  TrendingUp,
  Building,
  Info
} from 'lucide-react';
import { ChatMessage, ChatContext } from '../types/finance';
import { generateBotResponse } from '../utils/nlpEngine';
import { COMPANIES } from '../data/financialData';

interface ChatbotTabProps {
  onNavigateToTab?: (tab: 'analytics' | 'explorer') => void;
}

const DEFAULT_SUGGESTIONS = [
  "What was Microsoft's revenue in 2024?",
  "Compare Apple and Tesla net income 2025",
  "Show cash flow trends",
  "What is Microsoft's profit margin in 2025?",
  "Rank companies by total assets 2024",
  "Which company had the highest revenue growth?",
  "Tesla total liabilities 2023 to 2025",
  "Summarize key findings for GFC executive board",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome-1',
    sender: 'assistant',
    timestamp: 'Just now',
    text: `Welcome to the **BCG GenAI Financial Assistant** for **Global Finance Corp (GFC)**.\n\nI have been preloaded with SEC Form 10-K audited filings for **Microsoft (MSFT)**, **Apple (AAPL)**, and **Tesla (TSLA)** across **FY2023, FY2024, and FY2025**.\n\nYou can ask natural language questions regarding **Total Revenue**, **Net Income**, **Total Assets**, **Total Liabilities**, **Cash Flow from Operations**, profit margins, CAGR, and peer comparisons.`,
    structuredData: {
      type: 'board-brief',
      companies: ['MSFT', 'AAPL', 'TSLA'],
      highlights: [
        { label: 'Audited Coverage', value: '3 Tech Leaders', detail: 'MSFT · AAPL · TSLA' },
        { label: 'Time Horizon', value: 'FY 2023 – 2025', detail: 'SEC 10-K Filings' },
        { label: 'Core Metrics', value: '5 Fundamental Items', detail: 'Rev, NI, Assets, Liab, OCF' },
      ],
      strategicInsight: 'Tip: Click any suggestion pill below or ask contextual follow-up questions. The assistant retains state across conversation turns.',
    },
    suggestions: [
      "What was Microsoft's revenue in 2024?",
      "Compare Apple and Tesla net income 2025",
      "Show cash flow trends",
    ],
  },
];

export const ChatbotTab: React.FC<ChatbotTabProps> = ({ onNavigateToTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // State awareness tracking
  const [context, setContext] = useState<ChatContext>({
    conversationTurnCount: 0,
    activeCompany: undefined,
    activeYear: undefined,
    lastMetric: undefined,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMsg: ChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      text: query,
    };

    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate natural processing delay (300ms)
    setTimeout(() => {
      const { message: botMsg, newContext } = generateBotResponse(query, context);
      setMessages(prev => [...prev, botMsg]);
      setContext(newContext);
      setIsTyping(false);
    }, 350);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleClearChat = () => {
    setMessages(INITIAL_MESSAGES);
    setContext({
      conversationTurnCount: 0,
      activeCompany: undefined,
      activeYear: undefined,
      lastMetric: undefined,
    });
    if (inputRef.current) inputRef.current.focus();
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] min-h-[600px] max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      {/* Top Controller Bar */}
      <div className="flex flex-wrap items-center justify-between pb-3 border-b border-neutral-800 gap-2">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-white flex items-center gap-2">
              Rule-Based & Keyword Financial Assistant
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-emerald-950/70 text-emerald-400 border border-emerald-800">
                Active NLP Engine
              </span>
            </h2>
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <span>State Memory:</span>
              {context.activeCompany ? (
                <span className="text-emerald-400 font-medium">
                  {COMPANIES[context.activeCompany].name} ({context.activeCompany})
                </span>
              ) : (
                <span className="text-neutral-500">No active company</span>
              )}
              {context.activeYear && (
                <>
                  <span className="text-neutral-600">·</span>
                  <span className="text-emerald-400 font-medium">FY{context.activeYear}</span>
                </>
              )}
              {context.lastMetric && (
                <>
                  <span className="text-neutral-600">·</span>
                  <span className="text-neutral-300 font-mono text-[11px]">{context.lastMetric}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {context.activeCompany && (
            <button
              onClick={() => setContext(prev => ({ ...prev, activeCompany: undefined, activeYear: undefined }))}
              className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
              title="Reset current conversation context focus"
            >
              Reset Focus
            </button>
          )}
          <button
            onClick={handleClearChat}
            className="flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white px-2.5 py-1.5 rounded bg-neutral-900 border border-neutral-800 hover:border-neutral-700 transition-colors cursor-pointer"
            aria-label="Clear chat history"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Clear Chat</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] sm:max-w-[78%] rounded-xl p-4 transition-all ${
                msg.sender === 'user'
                  ? 'bg-neutral-800 text-neutral-100 border border-neutral-700'
                  : 'bg-neutral-900/90 text-neutral-200 border border-neutral-800 shadow-lg'
              }`}
            >
              {/* Message Header */}
              <div className="flex items-center justify-between text-xs text-neutral-400 mb-2 pb-1.5 border-b border-neutral-800/60">
                <span className="font-semibold text-neutral-300">
                  {msg.sender === 'user' ? 'You (GFC Analyst)' : 'BCG GenAI Consultant'}
                </span>
                <div className="flex items-center gap-2">
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy response text"
                      aria-label="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Message Body */}
              <div className="text-sm leading-relaxed whitespace-pre-line text-neutral-200 space-y-2">
                {msg.text.split('\n\n').map((paragraph, idx) => (
                  <p key={idx}>
                    {/* Render bold tags simply */}
                    {paragraph.split('**').map((chunk, cIdx) => 
                      cIdx % 2 === 1 ? <strong key={cIdx} className="text-white font-semibold">{chunk}</strong> : chunk
                    )}
                  </p>
                ))}
              </div>

              {/* Structured Financial Data Render */}
              {msg.structuredData && (
                <div className="mt-4 pt-3 border-t border-neutral-800 space-y-3">
                  {/* Highlights / Metric stats */}
                  {msg.structuredData.highlights && msg.structuredData.highlights.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      {msg.structuredData.highlights.map((hl, hIdx) => (
                        <div
                          key={hIdx}
                          className="bg-neutral-950/80 border border-neutral-800 rounded-lg p-2.5 text-left"
                        >
                          <span className="block text-[11px] text-neutral-400 font-medium">
                            {hl.label}
                          </span>
                          <span className="block text-base font-bold text-white mt-0.5 tracking-tight">
                            {hl.value}
                          </span>
                          {hl.detail && (
                            <span className="block text-[11px] text-emerald-400 mt-0.5">
                              {hl.detail}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Formatted Table */}
                  {msg.structuredData.table && (
                    <div className="overflow-x-auto rounded-lg border border-neutral-800 bg-neutral-950/60 mt-2">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-neutral-900 border-b border-neutral-800 text-neutral-400">
                          <tr>
                            {msg.structuredData.table.headers.map((hdr, hdrIdx) => (
                              <th key={hdrIdx} className="py-2 px-3 font-semibold">
                                {hdr}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                          {msg.structuredData.table.rows.map((row, rIdx) => (
                            <tr key={rIdx} className="hover:bg-neutral-900/50 transition-colors">
                              {row.map((cell, cIdx) => (
                                <td
                                  key={cIdx}
                                  className={`py-2 px-3 ${
                                    cIdx === 0
                                      ? 'font-medium text-white'
                                      : typeof cell === 'string' && cell.startsWith('$')
                                      ? 'font-mono text-neutral-200'
                                      : ''
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* BCG Strategic Insight Callout */}
                  {msg.structuredData.strategicInsight && (
                    <div className="bg-neutral-950 border border-emerald-900/40 rounded-lg p-3 text-xs text-neutral-300 flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-emerald-400 block mb-0.5">
                          BCG GenAI Strategic Insight:
                        </span>
                        <span>{msg.structuredData.strategicInsight}</span>
                      </div>
                    </div>
                  )}

                  {/* SEC Source Citation */}
                  {msg.structuredData.secSource && (
                    <div className="text-[11px] text-neutral-500 flex items-center gap-1.5 pt-1">
                      <FileText className="w-3.5 h-3.5 text-neutral-600" />
                      <span>{msg.structuredData.secSource}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Contextual Suggestions for this turn */}
              {msg.suggestions && msg.suggestions.length > 0 && (
                <div className="mt-3 pt-3 border-t border-neutral-800/70">
                  <span className="text-[11px] text-neutral-400 block mb-1.5 font-medium">
                    Suggested Follow-Ups:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {msg.suggestions.map((sug, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => handleSendMessage(sug)}
                        className="text-xs text-left px-2.5 py-1 rounded bg-neutral-950 border border-neutral-800 hover:border-emerald-700/60 hover:text-emerald-300 text-neutral-300 transition-colors cursor-pointer"
                      >
                        {sug}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-8 h-8 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-300 flex-shrink-0 mt-1">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isTyping && (
          <div className="flex gap-3 justify-start">
            <div className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-700 flex items-center justify-center text-emerald-400 flex-shrink-0 mt-1">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-3.5 text-xs text-neutral-400 flex items-center gap-2 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>Analyzing 10-K filings and matching keywords...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Suggestion Pills Carousel */}
      <div className="py-2 border-t border-neutral-800/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] text-neutral-400 font-medium flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-emerald-400" />
            Quick-Action Suggestions:
          </span>
          <span className="text-[11px] text-neutral-500 hidden sm:inline">
            Click to auto-query financial database
          </span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
          {DEFAULT_SUGGESTIONS.map((pill, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(pill)}
              className="whitespace-nowrap px-3 py-1.5 text-xs bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-md border border-neutral-800 hover:border-neutral-700 transition-all flex items-center gap-1.5 cursor-pointer flex-shrink-0"
            >
              <span>{pill}</span>
              <ChevronRight className="w-3 h-3 text-neutral-500" />
            </button>
          ))}
        </div>
      </div>

      {/* Input Area */}
      <div className="mt-2 relative">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <div className="relative flex-1">
            <input
              ref={inputRef}
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything: 'What was Microsoft revenue in 2024?', 'Compare Apple and Tesla profit 2025'..."
              className="w-full bg-neutral-900/90 text-white placeholder-neutral-500 text-sm px-4 py-3 rounded-lg border border-neutral-700 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all pr-10"
              aria-label="Financial query input"
            />
            {inputQuery && (
              <button
                type="button"
                onClick={() => setInputQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300 text-xs cursor-pointer"
              >
                Clear
              </button>
            )}
          </div>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className={`px-5 py-3 rounded-lg text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer ${
              inputQuery.trim() && !isTyping
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md'
                : 'bg-neutral-800 text-neutral-500 cursor-not-allowed border border-neutral-700/50'
            }`}
            aria-label="Send financial query"
          >
            <span>Send</span>
            <Send className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center justify-between text-[11px] text-neutral-500 mt-2 px-1">
          <span>Supported entities: Microsoft (MSFT) · Apple (AAPL) · Tesla (TSLA)</span>
          <span>SEC Form 10-K (2023–2025) · Amounts in $ Millions</span>
        </div>
      </div>
    </div>
  );
};
