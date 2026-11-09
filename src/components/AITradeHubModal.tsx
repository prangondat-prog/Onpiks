/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MarketAsset, Candle, TechnicalIndicators } from '../types.js';
import {
  Sparkles,
  X,
  Zap,
  TrendingUp,
  TrendingDown,
  Compass,
  Building2,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  FileText,
  BarChart2,
  Clock,
  Layers,
} from 'lucide-react';
import { AssetLogo } from './AssetLogo.tsx';

interface AITradeHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  markets: MarketAsset[];
  initialSymbol?: string;
  onSelectSymbol: (symbol: string) => void;
}

export const AITradeHubModal: React.FC<AITradeHubModalProps> = ({
  isOpen,
  onClose,
  markets,
  initialSymbol = 'BTC/USD',
  onSelectSymbol,
}) => {
  const [selectedSym, setSelectedSym] = useState<string>(initialSymbol);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [aiReport, setAiReport] = useState<{
    symbol: string;
    price: number;
    analysisText: string;
    timestamp: string;
  } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentAsset = markets.find((m) => m.symbol === selectedSym) || markets[0];

  const handleRunAIAnalysis = async (symToAnalyze: string) => {
    try {
      setIsAnalyzing(true);
      setErrorMessage(null);

      const res = await fetch('/api/ai/trade-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol: symToAnalyze }),
      });

      if (!res.ok) {
        throw new Error(`AI Analysis request returned status ${res.status}`);
      }

      const data = await res.json();
      if (data.success) {
        setAiReport({
          symbol: data.symbol,
          price: data.price,
          analysisText: data.analysisText,
          timestamp: data.timestamp,
        });
      } else {
        throw new Error(data.error || 'Failed to generate AI trade analysis.');
      }
    } catch (err: any) {
      console.error('AI Analyze error:', err);
      setErrorMessage(err.message || 'Unable to connect to Free AI Trade Intelligence model.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectAndAnalyze = (sym: string) => {
    setSelectedSym(sym);
    onSelectSymbol(sym);
    handleRunAIAnalysis(sym);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-4xl max-h-[90vh] overflow-y-auto glass-card rounded-2xl p-6 shadow-2xl space-y-5 border border-neutral-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-black font-sans tracking-tight">
                Advanced Free AI Trade Intelligence Model
              </h2>
              <p className="text-xs text-neutral-500 font-mono">
                Trained on global stock shares, crude oil, commodities, crypto & forex markets
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-black cursor-pointer transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Asset Switcher Strip */}
        <div className="space-y-2">
          <div className="text-xs font-mono font-bold text-neutral-600 uppercase">
            Select Asset / Share for Instant Real-Time AI Analysis:
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs font-mono">
            {[
              { sym: 'NVDA', label: 'NVIDIA Share' },
              { sym: 'AAPL', label: 'Apple Share' },
              { sym: 'TSLA', label: 'Tesla Share' },
              { sym: 'BTC/USD', label: 'Bitcoin Crypto' },
              { sym: 'OIL_WTI', label: 'Crude Oil WTI' },
              { sym: 'EUR/USD', label: 'EUR/USD Forex' },
            ].map((item) => {
              const isSelected = selectedSym === item.sym;
              return (
                <button
                  key={item.sym}
                  onClick={() => handleSelectAndAnalyze(item.sym)}
                  className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex items-center gap-2 ${
                    isSelected
                      ? 'bg-black text-white border-black font-black shadow-xs ring-2 ring-neutral-400'
                      : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-900'
                  }`}
                >
                  <AssetLogo symbol={item.sym} size="sm" />
                  <div className="truncate">
                    <div className="font-bold">{item.sym}</div>
                    <div className={`text-[9px] truncate ${isSelected ? 'text-neutral-300' : 'text-neutral-500'}`}>
                      {item.label}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Asset Header Box */}
        {currentAsset && (
          <div className="p-4 glass-panel rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <AssetLogo symbol={currentAsset.symbol} size="md" />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-black font-sans">{currentAsset.name}</h3>
                  <span className="px-2 py-0.5 bg-neutral-900 text-white rounded text-[10px] font-mono font-bold uppercase">
                    {currentAsset.symbol}
                  </span>
                </div>
                <div className="text-xs text-neutral-500 font-mono mt-0.5">
                  Sector: {currentAsset.sector || currentAsset.category} · Region: {currentAsset.region || 'Global'}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono">
                <div className="text-lg font-black text-black tabular-nums">
                  ${currentAsset.price.toLocaleString(undefined, { minimumFractionDigits: currentAsset.precision })}
                </div>
                <div
                  className={`text-xs font-bold tabular-nums ${
                    currentAsset.change24hPercent >= 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {currentAsset.change24hPercent >= 0 ? '+' : ''}
                  {currentAsset.change24hPercent.toFixed(2)}% (24h)
                </div>
              </div>

              <button
                onClick={() => handleRunAIAnalysis(selectedSym)}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-black text-white hover:bg-neutral-800 rounded-xl text-xs font-mono font-bold transition-all cursor-pointer disabled:opacity-50 flex items-center gap-1.5 shadow-xs"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                <span>{isAnalyzing ? 'Analyzing AI...' : 'Run Real-Time AI Model'}</span>
              </button>
            </div>
          </div>
        )}

        {/* Error alert if any */}
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs font-mono text-rose-900 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* AI Report Result Display */}
        {isAnalyzing ? (
          <div className="p-8 text-center glass-panel rounded-xl space-y-3 animate-pulse">
            <div className="w-8 h-8 rounded-full bg-black text-white mx-auto flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            </div>
            <div className="text-xs font-mono font-bold text-black">
              Running Advanced Free Gemini AI Trade Model on {selectedSym}...
            </div>
            <div className="text-[11px] font-mono text-neutral-500">
              Analyzing real-time order books, technical momentum & global financial news catalysts...
            </div>
          </div>
        ) : aiReport ? (
          <div className="space-y-4 font-sans animate-in fade-in">
            <div className="p-4 glass-panel rounded-xl border border-neutral-200/90 space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                <span className="text-xs font-mono font-black text-black uppercase flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  Real-Time AI Trade Intelligence Output
                </span>
                <span className="text-[11px] font-mono text-neutral-400">{aiReport.timestamp}</span>
              </div>

              <div className="text-xs font-mono text-neutral-800 leading-relaxed whitespace-pre-wrap font-medium">
                {aiReport.analysisText}
              </div>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center glass-panel rounded-xl text-xs font-mono text-neutral-500 space-y-2">
            <Sparkles className="w-6 h-6 text-amber-500 mx-auto" />
            <p>Click "Run Real-Time AI Model" to generate full stock, commodity, crypto or forex analysis.</p>
          </div>
        )}
      </div>
    </div>
  );
};
