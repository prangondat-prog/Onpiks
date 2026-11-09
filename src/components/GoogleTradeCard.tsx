/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { GoogleTradeExecution, TradeSetup, TradeHistoryItem, PendingOrderItem } from '../types.js';
import {
  Compass,
  CheckCircle2,
  XCircle,
  Calculator,
  Clock,
  Hourglass,
  Search,
  BarChart2,
  History,
  TrendingUp,
  TrendingDown,
  Layers,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Sparkles,
  FileSpreadsheet,
} from 'lucide-react';

interface GoogleTradeCardProps {
  tradeSetup?: TradeSetup;
  googleTrade?: GoogleTradeExecution;
  tradeHistory?: TradeHistoryItem[];
  pendingOrders?: PendingOrderItem[];
  currentPrice: number;
  precision: number;
  onOpenAITradeHub?: () => void;
}

export const GoogleTradeCard: React.FC<GoogleTradeCardProps> = ({
  tradeSetup,
  googleTrade,
  tradeHistory = [],
  pendingOrders = [],
  currentPrice,
  precision,
  onOpenAITradeHub,
}) => {
  const [positionAmount, setPositionAmount] = useState<number>(1000);
  const [activeLedgerTab, setActiveLedgerTab] = useState<'history' | 'pending'>('history');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // CSV Export logic for Trade History and Pending Orders
  const handleDownloadCSV = () => {
    const headers = [
      'Record Type',
      'ID',
      'Symbol',
      'Side / Order Type',
      'Entry / Target Price',
      'Exit / Take Profit Price',
      'Stop Loss / PnL ($)',
      'PnL %',
      'Hold Duration / Expiry',
      'Timestamp / Status',
    ];

    const historyRows = tradeHistory.map((item) => [
      'EXECUTED_TRADE',
      item.id,
      item.symbol,
      item.side,
      item.entryPrice,
      item.exitPrice,
      item.pnl,
      `${item.pnlPercent}%`,
      item.holdTimeStr,
      `${item.executedTime} (${item.status})`,
    ]);

    const pendingRows = pendingOrders.map((item) => [
      'PENDING_LIMIT_ORDER',
      item.id,
      item.symbol,
      item.type,
      item.targetEntry,
      item.tp,
      item.sl,
      'N/A',
      item.expiresIn,
      item.status,
    ]);

    const csvContent = [
      headers.join(','),
      ...historyRows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
      ...pendingRows.map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `onpiks_trade_performance_history_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Position Calculator: estimates profit at TP1/TP2 and risk at SL
  const calculatedPnL = useMemo(() => {
    if (!googleTrade || !googleTrade.entryPrice || currentPrice <= 0) {
      return { profitTp1: 0, profitTp2: 0, profitTp3: 0, maxLoss: 0 };
    }

    const entry = googleTrade.entryPrice;
    const tp1Pct = Math.abs(googleTrade.target1 - entry) / entry;
    const tp2Pct = Math.abs(googleTrade.target2 - entry) / entry;
    const tp3Pct = Math.abs(googleTrade.target3 - entry) / entry;
    const slPct = Math.abs(entry - googleTrade.stopLoss) / entry;

    return {
      profitTp1: Math.round(positionAmount * tp1Pct),
      profitTp2: Math.round(positionAmount * tp2Pct),
      profitTp3: Math.round(positionAmount * tp3Pct),
      maxLoss: Math.round(positionAmount * slPct),
    };
  }, [googleTrade, positionAmount, currentPrice]);

  // Filter trade history by search query
  const filteredHistory = useMemo(() => {
    if (!searchQuery.trim()) return tradeHistory;
    const q = searchQuery.toLowerCase().trim();
    return tradeHistory.filter(
      (item) =>
        item.symbol.toLowerCase().includes(q) ||
        item.side.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [tradeHistory, searchQuery]);

  // Filter pending orders by search query
  const filteredPending = useMemo(() => {
    if (!searchQuery.trim()) return pendingOrders;
    const q = searchQuery.toLowerCase().trim();
    return pendingOrders.filter(
      (item) =>
        item.symbol.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [pendingOrders, searchQuery]);

  const [selectedTimer, setSelectedTimer] = useState<string>('15m');
  const [timerSecondsLeft, setTimerSecondsLeft] = useState<number>(900);

  // Handle timer change and live countdown tick
  React.useEffect(() => {
    let secs = 900;
    if (selectedTimer === '1m') secs = 60;
    else if (selectedTimer === '3m') secs = 180;
    else if (selectedTimer === '10m') secs = 600;
    else if (selectedTimer === '15m') secs = 900;
    else if (selectedTimer === '1h') secs = 3600;
    else if (selectedTimer === '2h') secs = 7200;
    else if (selectedTimer === '4h') secs = 14400;

    setTimerSecondsLeft(secs);

    const timer = setInterval(() => {
      setTimerSecondsLeft((prev) => (prev <= 1 ? secs : prev - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedTimer]);

  const formatTimerClock = (totalSecs: number) => {
    const hrs = Math.floor(totalSecs / 3600);
    const mins = Math.floor((totalSecs % 3600) / 60);
    const secs = totalSecs % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (!googleTrade || !tradeSetup) {
    return (
      <div className="w-full glass-card rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-neutral-200 rounded-lg w-1/3 mb-4"></div>
        <div className="h-28 bg-neutral-100 rounded-xl mb-3"></div>
      </div>
    );
  }

  const isBuy = googleTrade.signal.includes('BUY') || googleTrade.signal.includes('LONG');
  const demand = googleTrade.demandForecast;

  return (
    <div className="w-full glass-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-5">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200/80 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
            <Compass className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-black font-sans tracking-tight">
            Google Trade • Real-Time Automated Execution Engine
          </h2>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          {onOpenAITradeHub && (
            <button
              onClick={onOpenAITradeHub}
              className="px-3 py-1 bg-black text-white hover:bg-neutral-800 rounded-lg font-mono font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-xs border border-neutral-700"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Free AI Trade Hub</span>
            </button>
          )}
          <span
            className={`px-3 py-1 rounded-lg font-black uppercase tracking-wider text-xs shadow-2xs ${
              isBuy ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {googleTrade.signal}
          </span>
          <span className="text-neutral-700 font-sans font-bold">Order: {googleTrade.orderType}</span>
        </div>
      </div>

      {/* Interactive Timer Selector Bar (1 Min, 3 Min, 10 Min, 15 Min, 1 Hour, 2 Hour, 4 Hour) */}
      <div className="p-3.5 bg-neutral-50 border border-neutral-300 rounded-xl space-y-2.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-black shrink-0" />
            <span className="text-xs font-bold text-black font-sans">
              Execution & Target Hold Duration Timer Selector:
            </span>
          </div>

          {/* Live Ticking Countdown Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 bg-black text-white rounded-lg font-mono font-black text-xs shadow-2xs">
            <Clock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Timer: {formatTimerClock(timerSecondsLeft)} remaining</span>
          </div>
        </div>

        {/* Timer Selection Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono pt-1">
          {[
            { id: '1m', label: '1 Min' },
            { id: '3m', label: '3 Min' },
            { id: '10m', label: '10 Min' },
            { id: '15m', label: '15 Min' },
            { id: '1h', label: '1 Hour' },
            { id: '2h', label: '2 Hour' },
            { id: '4h', label: '4 Hour' },
          ].map((t) => {
            const isSelected = selectedTimer === t.id;
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTimer(t.id)}
                className={`px-3 py-1.5 rounded-lg font-mono font-bold text-xs whitespace-nowrap transition-all cursor-pointer border flex items-center gap-1 ${
                  isSelected
                    ? 'bg-black text-white border-black shadow-xs ring-2 ring-neutral-400'
                    : 'bg-white border-neutral-300 hover:border-black text-neutral-800'
                }`}
              >
                <Clock className="w-3 h-3 text-neutral-500" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Execution Price Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 font-mono text-xs">
        {/* Entry */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans">Optimal Entry</span>
          <span className="text-sm font-bold text-black tabular-nums">
            ${googleTrade.entryPrice.toLocaleString(undefined, { minimumFractionDigits: precision })}
          </span>
          <span className="text-[10px] text-neutral-500 block truncate">{tradeSetup.entryZone}</span>
        </div>

        {/* Target 1 */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans">Target 1 (TP1)</span>
          <span className="text-sm font-bold text-emerald-700 tabular-nums">
            ${googleTrade.target1.toLocaleString(undefined, { minimumFractionDigits: precision })}
          </span>
          <span className="text-[10px] text-emerald-600 block">Quick Target</span>
        </div>

        {/* Target 2 */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans">Target 2 (TP2)</span>
          <span className="text-sm font-bold text-emerald-700 tabular-nums">
            ${googleTrade.target2.toLocaleString(undefined, { minimumFractionDigits: precision })}
          </span>
          <span className="text-[10px] text-emerald-600 block">Daily Target</span>
        </div>

        {/* Target 3 */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans">Target 3 (TP3)</span>
          <span className="text-sm font-bold text-emerald-700 tabular-nums">
            ${googleTrade.target3.toLocaleString(undefined, { minimumFractionDigits: precision })}
          </span>
          <span className="text-[10px] text-emerald-600 block">Extended Runner</span>
        </div>

        {/* Stop Loss */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans">Stop Loss (SL)</span>
          <span className="text-sm font-bold text-rose-700 tabular-nums">
            ${googleTrade.stopLoss.toLocaleString(undefined, { minimumFractionDigits: precision })}
          </span>
          <span className="text-[10px] text-rose-600 block">Hard Invalidation</span>
        </div>

        {/* Risk / Reward */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans">Risk / Reward</span>
          <span className="text-sm font-bold text-black tabular-nums">{googleTrade.riskReward}</span>
          <span className="text-[10px] text-neutral-500 block">R:R Ratio</span>
        </div>
      </div>

      {/* Interactive Trade Position Calculator */}
      <div className="p-3.5 border border-neutral-200 rounded-md bg-neutral-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2.5 border-b border-neutral-200">
          <div className="flex items-center gap-2">
            <Calculator className="w-4 h-4 text-black" />
            <span className="text-xs font-bold text-black font-sans">
              Interactive Position P&L Calculator
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-neutral-600 font-sans">Position Size:</span>
            <div className="relative">
              <span className="absolute left-2 top-1 text-neutral-400 font-mono text-xs">$</span>
              <input
                type="number"
                min="10"
                step="100"
                value={positionAmount}
                onChange={(e) => setPositionAmount(Math.max(10, Number(e.target.value) || 0))}
                className="w-24 pl-5 pr-2 py-0.5 bg-white border border-neutral-300 rounded text-xs font-mono font-bold text-black focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Calculated Dollar Returns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-2.5 text-xs font-mono">
          <div className="p-2 bg-white rounded border border-neutral-200">
            <span className="text-[10px] text-neutral-500 block">Est. Profit @ TP1</span>
            <span className="font-bold text-emerald-700 tabular-nums">+${calculatedPnL.profitTp1}</span>
          </div>

          <div className="p-2 bg-white rounded border border-neutral-200">
            <span className="text-[10px] text-neutral-500 block">Est. Profit @ TP2</span>
            <span className="font-bold text-emerald-700 tabular-nums">+${calculatedPnL.profitTp2}</span>
          </div>

          <div className="p-2 bg-white rounded border border-neutral-200">
            <span className="text-[10px] text-neutral-500 block">Est. Profit @ TP3</span>
            <span className="font-bold text-emerald-700 tabular-nums">+${calculatedPnL.profitTp3}</span>
          </div>

          <div className="p-2 bg-white rounded border border-neutral-200">
            <span className="text-[10px] text-neutral-500 block">Max Risk @ Stop Loss</span>
            <span className="font-bold text-rose-700 tabular-nums">-${calculatedPnL.maxLoss}</span>
          </div>
        </div>
      </div>

      {/* Today's Bidding Demand vs Future Projected Demand Index */}
      {demand && (
        <div className="p-3.5 border border-neutral-200 rounded-md bg-white">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <BarChart2 className="w-4 h-4 text-black" />
              <span className="text-xs font-bold text-black font-sans">
                Today's Bidding Demand vs Future Projected Demand Index
              </span>
            </div>
            <span className="text-[11px] font-mono font-semibold text-neutral-600">
              Outlook: <strong className="text-black">{demand.demandOutlook}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 text-xs font-mono">
            {/* Today's Demand */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 font-sans">Today's Live Order Book Bidding:</span>
                <span className="font-bold text-black tabular-nums">{demand.todayDemandScore}/100</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-black transition-all duration-300"
                  style={{ width: `${demand.todayDemandScore}%` }}
                ></div>
              </div>
            </div>

            {/* Future Demand */}
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-neutral-600 font-sans">Future Projected Demand (EOD):</span>
                <span className="font-bold text-emerald-700 tabular-nums">{demand.futureDemandScore}/100</span>
              </div>
              <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-600 transition-all duration-300"
                  style={{ width: `${demand.futureDemandScore}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bid / Ask Order Book Imbalance */}
      <div className="p-3 border border-neutral-200 rounded-md bg-white">
        <div className="flex justify-between items-center text-xs font-mono mb-2">
          <span className="text-neutral-600">
            Order Book Imbalance Ratio: <strong className="text-black">{googleTrade.bidAskPressure.ratio}</strong>
          </span>
          <div className="flex gap-3 text-xs">
            <span className="text-emerald-700 font-bold tabular-nums">
              Bids: {googleTrade.bidAskPressure.buyPressurePct}%
            </span>
            <span className="text-rose-700 font-bold tabular-nums">
              Asks: {googleTrade.bidAskPressure.sellPressurePct}%
            </span>
          </div>
        </div>

        <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-emerald-600 transition-all duration-300"
            style={{ width: `${googleTrade.bidAskPressure.buyPressurePct}%` }}
          ></div>
          <div
            className="h-full bg-rose-600 transition-all duration-300"
            style={{ width: `${googleTrade.bidAskPressure.sellPressurePct}%` }}
          ></div>
        </div>
      </div>

      {/* 5-Rule Checklist */}
      <div className="space-y-1.5">
        <div className="text-xs font-bold text-black uppercase tracking-wider font-mono">
          5-Point Automated Execution Verification
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
          {googleTrade.checklist.map((item, idx) => (
            <div
              key={idx}
              className="flex items-start gap-2 p-2.5 rounded-md bg-neutral-50 border border-neutral-200"
            >
              {item.passed ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-semibold text-black block">{item.rule}</span>
                <span className="text-neutral-600 text-[11px] font-mono">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Interactive Trade History & Future Pending Orders Ledger */}
      <div className="pt-4 border-t border-neutral-200 space-y-3">
        {/* Ledger Header & Search Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-md">
            <button
              onClick={() => setActiveLedgerTab('history')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeLedgerTab === 'history'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Past Executed Trades ({tradeHistory.length})</span>
            </button>

            <button
              onClick={() => setActiveLedgerTab('pending')}
              className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1.5 ${
                activeLedgerTab === 'pending'
                  ? 'bg-white text-black font-bold shadow-xs'
                  : 'text-neutral-600 hover:text-black'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Future Pending Orders ({pendingOrders.length})</span>
            </button>
          </div>

          {/* Instant Search Filter & CSV Export */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadCSV}
              className="px-3 py-1 bg-black text-white hover:bg-neutral-800 rounded text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap"
              title="Export Trade History & Metrics to CSV File"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Download CSV</span>
            </button>

            <div className="relative w-full sm:w-56">
              <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search old & new trade..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-neutral-50 border border-neutral-300 rounded text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black"
              />
            </div>
          </div>
        </div>

        {/* Tab 1: Past Executed Trades Ledger */}
        {activeLedgerTab === 'history' && (
          <div className="overflow-x-auto border border-neutral-200 rounded-md">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-100 text-neutral-600 border-b border-neutral-200 text-[10px] uppercase font-sans font-semibold">
                <tr>
                  <th className="p-2.5">Symbol</th>
                  <th className="p-2.5">Side</th>
                  <th className="p-2.5">Entry Price</th>
                  <th className="p-2.5">Exit Price</th>
                  <th className="p-2.5">PnL ($ / %)</th>
                  <th className="p-2.5">Hold Duration</th>
                  <th className="p-2.5">Executed Time</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-900 bg-white">
                {filteredHistory.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-4 text-center text-neutral-400">
                      No past executed trades match search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredHistory.map((item) => {
                    const isProfit = item.pnl >= 0;
                    return (
                      <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="p-2.5 font-bold">{item.symbol}</td>
                        <td className="p-2.5">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              item.side === 'BUY'
                                ? 'bg-emerald-100 text-emerald-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.side}
                          </span>
                        </td>
                        <td className="p-2.5 tabular-nums">${item.entryPrice.toLocaleString()}</td>
                        <td className="p-2.5 tabular-nums">${item.exitPrice.toLocaleString()}</td>
                        <td className="p-2.5 tabular-nums">
                          <span
                            className={`font-bold flex items-center gap-0.5 ${
                              isProfit ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {isProfit ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                            {isProfit ? '+' : ''}${item.pnl} ({isProfit ? '+' : ''}
                            {item.pnlPercent.toFixed(2)}%)
                          </span>
                        </td>
                        <td className="p-2.5 text-neutral-600">{item.holdTimeStr}</td>
                        <td className="p-2.5 text-neutral-500 text-[11px]">{item.executedTime}</td>
                        <td className="p-2.5">
                          <span className="px-1.5 py-0.5 bg-neutral-100 border border-neutral-200 rounded text-[10px] font-semibold text-neutral-700">
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Tab 2: Future Pending Limit Orders Ledger */}
        {activeLedgerTab === 'pending' && (
          <div className="overflow-x-auto border border-neutral-200 rounded-md">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-neutral-100 text-neutral-600 border-b border-neutral-200 text-[10px] uppercase font-sans font-semibold">
                <tr>
                  <th className="p-2.5">Symbol</th>
                  <th className="p-2.5">Order Type</th>
                  <th className="p-2.5">Target Entry</th>
                  <th className="p-2.5">Take Profit</th>
                  <th className="p-2.5">Stop Loss</th>
                  <th className="p-2.5">Expiration</th>
                  <th className="p-2.5">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 text-neutral-900 bg-white">
                {filteredPending.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-neutral-400">
                      No future pending orders match search criteria.
                    </td>
                  </tr>
                ) : (
                  filteredPending.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="p-2.5 font-bold">{item.symbol}</td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 bg-neutral-100 text-black border border-neutral-300 rounded text-[10px] font-bold">
                          {item.type}
                        </span>
                      </td>
                      <td className="p-2.5 font-bold text-black tabular-nums">
                        ${item.targetEntry.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-emerald-700 font-bold tabular-nums">
                        ${item.tp.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-rose-700 font-bold tabular-nums">
                        ${item.sl.toLocaleString()}
                      </td>
                      <td className="p-2.5 text-neutral-600">{item.expiresIn}</td>
                      <td className="p-2.5">
                        <span className="px-1.5 py-0.5 bg-amber-50 text-amber-800 border border-amber-200 rounded text-[10px] font-semibold">
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Strategy Summary */}
      <div className="mt-4 pt-3 border-t border-neutral-200 text-xs text-neutral-700 font-sans">
        <strong className="text-black">Execution Strategy: </strong>
        {tradeSetup.strategySummary} (Sizing: {googleTrade.suggestedRisk})
      </div>
    </div>
  );
};

