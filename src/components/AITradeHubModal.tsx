/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MarketAsset } from '../types.js';
import {
  Sparkles,
  X,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Globe,
  Zap,
  ChevronRight,
  ShieldCheck,
  TrendingUp,
  TrendingDown
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

  const currentAsset = markets?.find((m) => m.symbol === selectedSym) || (markets?.length > 0 ? markets[0] : null);

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
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-2xl p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden bg-[#050505] rounded-[2.5rem] border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,1)] flex flex-col">
        
        {/* Modal Header - Fixed */}
        <div className="px-8 pt-8 pb-6 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-[1.25rem] bg-neonGreen text-black flex items-center justify-center font-bold shadow-[0_0_20px_rgba(216,252,34,0.4)]">
              <Zap className="w-6 h-6 fill-black" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white font-sans tracking-tighter">
                AI Deep Intelligence
              </h2>
              <p className="text-[10px] text-neutral-500 font-mono uppercase tracking-[0.3em]">
                Synthesis Engine v4.2.0
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-3 rounded-2xl bg-neutral-900 border border-white/5 hover:border-white/20 text-white cursor-pointer transition-all active:scale-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-8 py-6 space-y-8 no-scrollbar">
          
          {/* Asset Quick Switch */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
              <Globe className="w-3.5 h-3.5" />
              <span>Select High-Alpha Asset</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {markets.slice(0, 8).map((m) => {
                const isSelected = selectedSym === m.symbol;
                return (
                  <button
                    key={m.symbol}
                    onClick={() => handleSelectAndAnalyze(m.symbol)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 active:scale-95 ${
                      isSelected
                        ? 'bg-white text-black border-white shadow-xl'
                        : 'bg-neutral-900/50 border-white/5 text-neutral-400 hover:border-white/10'
                    }`}
                  >
                    <AssetLogo symbol={m.symbol} size="sm" />
                    <span className="text-[11px] font-black uppercase tracking-tight truncate">{m.symbol.split('/')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Analysis Viewport */}
          <div className="space-y-6">
             <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-[10px] font-black text-neutral-500 uppercase tracking-widest">
                  <BarChart3 className="w-3.5 h-3.5" />
                  <span>Real-time Synthesis Output</span>
                </div>
                {aiReport && (
                   <span className="text-[9px] font-mono text-neutral-600 uppercase tracking-widest">Generated: {aiReport.timestamp}</span>
                )}
             </div>

             {isAnalyzing ? (
               <div className="p-16 text-center space-y-6 bg-neutral-900/20 rounded-[2.5rem] border border-white/5 border-dashed">
                 <div className="relative w-16 h-16 mx-auto">
                    <div className="absolute inset-0 rounded-full border-4 border-neonGreen/20"></div>
                    <div className="absolute inset-0 rounded-full border-4 border-neonGreen border-t-transparent animate-spin"></div>
                    <Zap className="absolute inset-0 m-auto w-6 h-6 text-neonGreen fill-neonGreen animate-pulse" />
                 </div>
                 <div className="space-y-2">
                    <p className="text-sm font-black text-white uppercase tracking-widest">AI Thinking...</p>
                    <p className="text-[10px] font-mono text-neutral-500 uppercase tracking-[0.2em]">Analyzing Order Books & Sentiment Catalysts</p>
                 </div>
               </div>
             ) : aiReport ? (
               <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="p-6 bg-gradient-to-br from-neutral-900 to-black rounded-[2rem] border border-white/5 shadow-2xl space-y-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-neonGreen/5 blur-3xl pointer-events-none"></div>
                    
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-xl bg-neonGreen/10 flex items-center justify-center text-neonGreen">
                           <ShieldCheck className="w-6 h-6" />
                         </div>
                         <div>
                            <div className="text-[10px] font-black text-neutral-500 uppercase tracking-widest">Decision Status</div>
                            <div className="text-sm font-black text-white uppercase">High Confidence Signal</div>
                         </div>
                      </div>
                      <div className="flex gap-2">
                         <div className="px-3 py-1 rounded-lg bg-neutral-800 text-[10px] font-black text-neutral-300 uppercase">VOLATILE</div>
                         <div className="px-3 py-1 rounded-lg bg-neonGreen/10 text-[10px] font-black text-neonGreen uppercase border border-neonGreen/20">BULLISH</div>
                      </div>
                    </div>

                    <div className="text-sm font-medium text-neutral-300 leading-relaxed whitespace-pre-wrap font-sans">
                      {aiReport.analysisText}
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4">
                       <button className="p-4 bg-neonGreen rounded-2xl flex items-center justify-center gap-2 text-black font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform cursor-pointer">
                          <TrendingUp className="w-4 h-4" />
                          Execute Long
                       </button>
                       <button className="p-4 bg-neutral-800 rounded-2xl flex items-center justify-center gap-2 text-white font-black text-xs uppercase tracking-widest hover:scale-[1.02] transition-transform cursor-pointer">
                          <TrendingDown className="w-4 h-4" />
                          Execute Short
                       </button>
                    </div>
                 </div>
               </div>
             ) : (
               <div className="p-20 text-center space-y-4 bg-neutral-900/10 rounded-[2.5rem] border border-white/5 border-dashed">
                 <Sparkles className="w-12 h-12 text-neutral-800 mx-auto" />
                 <p className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.4em]">Initialize Deep Asset Analysis</p>
                 <button 
                  onClick={() => handleRunAIAnalysis(selectedSym)}
                  className="px-8 py-3 bg-white text-black rounded-full font-black text-[11px] uppercase tracking-widest hover:scale-110 transition-all cursor-pointer shadow-xl"
                 >
                   Synthesize {selectedSym.split('/')[0]}
                 </button>
               </div>
             )}

             {errorMessage && (
               <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-[11px] font-black text-rose-500 flex items-center gap-3 uppercase tracking-widest">
                 <AlertCircle className="w-5 h-5 shrink-0" />
                 <span>{errorMessage}</span>
               </div>
             )}
          </div>
        </div>

        {/* Modal Footer - Fixed */}
        <div className="px-8 py-6 bg-black border-t border-white/5 flex items-center justify-between">
           <div className="flex items-center gap-4 text-neutral-600">
              <div className="flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-neonGreen"></div>
                 <span className="text-[9px] font-black uppercase tracking-widest">API Status: OK</span>
              </div>
              <div className="flex items-center gap-1">
                 <div className="w-1 h-1 rounded-full bg-blue-500"></div>
                 <span className="text-[9px] font-black uppercase tracking-widest">GenAI Pro: Active</span>
              </div>
           </div>
           <button 
            onClick={onClose}
            className="text-[10px] font-black text-neutral-500 uppercase tracking-widest hover:text-white transition-colors cursor-pointer"
           >
             Dismiss
           </button>
        </div>
      </div>
    </div>
  );
};
