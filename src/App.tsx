/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  MarketAsset, 
  BrainPrediction, 
  UserTrade 
} from './types.js';
import { AssetLogo } from './components/AssetLogo.tsx';
import { AITradeHubModal } from './components/AITradeHubModal.tsx';
import {
  TrendingUp,
  TrendingDown,
  ArrowLeft,
  Search,
  Activity,
  ShieldCheck,
  DollarSign
} from 'lucide-react';

export default function App() {
  const [markets, setMarkets] = useState<MarketAsset[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USD');
  const [userTrades, setUserTrades] = useState<UserTrade[]>([]);
  const [activeStudies] = useState<string[]>(['BOL', 'RSI']);
  const [isDemoTrade, setIsDemoTrade] = useState<boolean>(true);
  const [tradeAmount, setTradeAmount] = useState<number>(500);
  const [prediction, setPrediction] = useState<BrainPrediction | null>(null);
  const [isLoadingMarkets, setIsLoadingMarkets] = useState<boolean>(true);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(false);
  const [orderFeedback, setOrderFeedback] = useState<string | null>(null);

  const activeAsset = useMemo(() => 
    markets.find((m) => m.symbol === selectedSymbol) || markets[0], 
    [markets, selectedSymbol]
  );

  const loadMarkets = useCallback(async (isInitial: boolean = false) => {
    try {
      if (isInitial) setIsLoadingMarkets(true);
      const res = await fetch('/api/markets');
      if (!res.ok) throw new Error('Failed to load market data');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMarkets(data.data);
      }
    } catch (err) {
      console.error('Markets fetch error:', err);
    } finally {
      if (isInitial) setIsLoadingMarkets(false);
    }
  }, []);

  const loadPrediction = useCallback(async (symbol: string) => {
    try {
      setIsLoadingPrediction(true);
      const res = await fetch('/api/brain/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symbol }),
      });
      if (!res.ok) throw new Error('Failed to load prediction');
      const data = await res.json();
      if (data.success && data.prediction) {
        setPrediction(data.prediction);
      }
    } catch (err) {
      console.error('Prediction fetch error:', err);
    } finally {
      setIsLoadingPrediction(false);
    }
  }, []);

  useEffect(() => {
    loadMarkets(true);
    const timer = setInterval(() => loadMarkets(false), 800);
    return () => clearInterval(timer);
  }, [loadMarkets]);

  const [lastPrice, setLastPrice] = useState<number>(0);
  const [priceTickDir, setPriceTickDir] = useState<'UP' | 'DOWN' | null>(null);

  useEffect(() => {
    if (activeAsset && activeAsset.price !== lastPrice) {
      setPriceTickDir(activeAsset.price > lastPrice ? 'UP' : 'DOWN');
      setLastPrice(activeAsset.price);
      const timer = setTimeout(() => setPriceTickDir(null), 500);
      return () => clearTimeout(timer);
    }
  }, [activeAsset, lastPrice]);

  useEffect(() => {
    if (selectedSymbol) {
      loadPrediction(selectedSymbol);
      const pTimer = setInterval(() => loadPrediction(selectedSymbol), 25000);
      return () => clearInterval(pTimer);
    }
  }, [selectedSymbol, loadPrediction]);

  const handleAction = (type: 'LONG' | 'SHORT' | 'BUY' | 'SELL') => {
    if (!activeAsset) return;
    
    const units = tradeAmount / activeAsset.price;
    const newTrade: UserTrade = {
      id: Math.random().toString(36).substring(7),
      symbol: selectedSymbol,
      type,
      price: activeAsset.price,
      amount: Number(units.toFixed(4)),
      time: new Date().toLocaleString(),
      status: 'OPEN',
      isDemo: isDemoTrade,
    };

    setUserTrades([newTrade, ...userTrades]);
    setOrderFeedback(`${isDemoTrade ? '[DEMO]' : '[REAL]'} ${type} Order Executed: $${tradeAmount} (${units.toFixed(4)} ${selectedSymbol.split('/')[0]}) @ $${activeAsset.price}`);
    setTimeout(() => setOrderFeedback(null), 4000);
  };

  const getStudiesParam = () => {
    const studyMap: Record<string, string> = {
      BOL: 'BollingerBands@tv-basicstudies',
      RSI: 'RSI@tv-basicstudies',
      MACD: 'MACD@tv-basicstudies',
    };
    const studies = activeStudies.map((s) => studyMap[s]).filter(Boolean);
    return encodeURIComponent(JSON.stringify(studies));
  };

  const getTradingViewSymbol = (sym: string, asset?: MarketAsset) => {
    if (sym === 'BTC/USD') return 'BINANCE:BTCUSDT';
    if (sym === 'ETH/USD') return 'BINANCE:ETHUSDT';
    if (sym === 'SOL/USD') return 'BINANCE:SOLUSDT';
    if (sym === 'BNB/USD') return 'BINANCE:BNBUSDT';
    if (sym === 'XRP/USD') return 'BINANCE:XRPUSDT';
    if (sym === 'OIL_WTI') return 'NYMEX:CL1!';
    if (sym === 'OIL_BRENT') return 'TVC:UKOIL';
    if (sym === 'GOLD') return 'COMEX:GC1!';
    if (sym === 'SILVER') return 'COMEX:SI1!';
    if (sym === 'NATGAS') return 'NYMEX:NG1!';
    if (asset?.category === 'forex') return 'FX_IDC:' + sym.replace('/', '');
    if (sym.startsWith('^')) return 'INDEX:' + sym.replace('^', '');
    return sym;
  };

  if (isLoadingMarkets || !activeAsset) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  const isPriceUp = activeAsset.change24hPercent >= 0;

  return (
    <div className="bg-black text-white antialiased min-h-screen flex flex-col font-sans selection:bg-emerald-400 selection:text-black">
      
      {/* Toast Notification */}
      {orderFeedback && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-widest rounded-lg shadow-2xl animate-in fade-in slide-in-from-top-4">
          {orderFeedback}
        </div>
      )}

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 pb-20">
        
        {/* Navigation & Asset Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-6">
            <button className="text-neutral-500 hover:text-white transition-colors cursor-pointer">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <div className="flex items-center gap-4">
              <AssetLogo symbol={selectedSymbol} size="lg" />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-black tracking-tighter uppercase">{selectedSymbol.split('/')[0]}</h1>
                  <ShieldCheck className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest">{activeAsset.name} ({activeAsset.category})</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
             <button 
              onClick={() => setIsDemoTrade(!isDemoTrade)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${isDemoTrade ? 'border-amber-500/30 text-amber-500 bg-amber-500/5' : 'border-emerald-500/30 text-emerald-500 bg-emerald-500/5'}`}
             >
               {isDemoTrade ? 'Demo Mode' : 'Live Mode'}
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Data & Chart */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Price Overview - Always White */}
            <div className="flex items-baseline gap-4">
              <span className="text-6xl font-black tracking-tighter tabular-nums text-white">
                ${activeAsset.price.toLocaleString(undefined, { minimumFractionDigits: activeAsset.precision })}
              </span>
              <div className="flex flex-col">
                <span className={`text-lg font-black font-mono ${isPriceUp ? 'text-emerald-400' : 'text-rose-500'}`}>
                  {isPriceUp ? '▲' : '▼'} {Math.abs(activeAsset.change24hPercent).toFixed(2)}%
                </span>
                <div className="flex items-center gap-1">
                   <div className={`w-2 h-2 rounded-full animate-pulse ${priceTickDir === 'UP' ? 'bg-emerald-500' : priceTickDir === 'DOWN' ? 'bg-rose-500' : 'bg-neutral-800'}`}></div>
                   <span className="text-[8px] font-black text-neutral-600 uppercase tracking-widest">Live Tick</span>
                </div>
              </div>
            </div>

            {/* Pressure Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500">
                <span className="text-emerald-400">Demand: {isPriceUp ? 58 : 42}%</span>
                <span className="text-rose-500">Distribution: {isPriceUp ? 42 : 58}%</span>
              </div>
              <div className="w-full h-1.5 bg-neutral-900 rounded-full overflow-hidden flex">
                <div className="h-full bg-emerald-400 transition-all duration-1000" style={{ width: `${isPriceUp ? 58 : 42}%` }}></div>
                <div className="h-full bg-rose-500 transition-all duration-1000" style={{ width: `${isPriceUp ? 42 : 58}%` }}></div>
              </div>
            </div>

            {/* TradingView Chart - Real Mapped Symbols */}
            <div className="w-full aspect-[9/16] lg:aspect-video bg-neutral-950 border border-neutral-900 overflow-hidden relative group">
              <iframe
                key={selectedSymbol}
                title="TradingView Chart"
                src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_762c4&symbol=${encodeURIComponent(getTradingViewSymbol(selectedSymbol, activeAsset))}&interval=1&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=0&saveimage=0&toolbarbg=000000&theme=dark&style=1&timezone=Etc%2FUTC&studies=${getStudiesParam()}&locale=en&utm_source=onpiks.com&allow_symbol_change=0`}
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
              />
            </div>

            {/* SIGNAL BOX AREA - Skeleton Loading & Profit UI */}
            {isLoadingPrediction ? (
              <div className="p-8 bg-neutral-900/50 rounded-2xl border border-white/5 animate-pulse flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <div className="w-14 h-14 bg-neutral-800 rounded-xl"></div>
                  <div className="space-y-3">
                    <div className="h-6 w-32 bg-neutral-800 rounded"></div>
                    <div className="h-3 w-48 bg-neutral-800 rounded"></div>
                  </div>
                </div>
                <div className="space-y-2">
                   <div className="h-2 w-16 bg-neutral-800 rounded ml-auto"></div>
                   <div className="h-6 w-24 bg-neutral-800 rounded"></div>
                </div>
              </div>
            ) : prediction ? (
              <div className={`p-6 rounded-3xl flex items-center justify-between border-2 shadow-2xl transition-all duration-500 ${prediction.direction === 'UP' ? 'border-emerald-500/20 bg-emerald-500/5' : 'border-rose-500/20 bg-rose-500/5'}`}>
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${prediction.direction === 'UP' ? 'bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)]' : 'bg-rose-500 shadow-[0_0_30px_rgba(244,63,94,0.3)]'}`}>
                    {prediction.direction === 'UP' ? <TrendingUp className="w-8 h-8 text-black" /> : <TrendingDown className="w-8 h-8 text-white" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                       <span className={`w-2 h-2 rounded-full animate-pulse ${prediction.direction === 'UP' ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                       <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">AI Signal Analysis</span>
                    </div>
                    <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
                      {prediction.direction === 'UP' ? 'BUY SIGNAL' : 'SELL SIGNAL'}
                    </h2>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Conf: {prediction.confidence}</span>
                       <span className="w-1 h-1 rounded-full bg-neutral-700"></span>
                       <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Expected Profit: +{Math.abs(prediction.predictedCandle.predictedChangePercent).toFixed(2)}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">Profit Projection</p>
                  <p className="text-2xl font-black font-mono text-white tabular-nums">
                    +${(tradeAmount * (Math.abs(prediction.predictedCandle.predictedChangePercent) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </p>
                  <div className="text-[9px] font-bold text-neutral-600 uppercase tracking-tighter mt-1">For ${tradeAmount} Position</div>
                </div>
              </div>
            ) : null}
          </div>

          {/* Right Column: Actions & Watchlist */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Instant Execution & Amount Selector */}
            <div className="p-6 bg-neutral-900/50 rounded-2xl border border-neutral-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-neutral-400">Position Amount ($)</h3>
                <span className="text-xs font-mono text-emerald-400 font-bold">{(tradeAmount / activeAsset.price).toFixed(4)} {selectedSymbol.split('/')[0]}</span>
              </div>

              {/* Amount Selector Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[100, 500, 1000, 5000].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setTradeAmount(amt)}
                    className={`py-2 rounded-xl text-xs font-black font-mono transition-all cursor-pointer border ${tradeAmount === amt ? 'bg-white text-black border-white shadow-lg' : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'}`}
                  >
                    ${amt}
                  </button>
                ))}
              </div>

              {/* Custom Amount Input */}
              <div className="relative flex items-center">
                <DollarSign className="absolute left-4 w-4 h-4 text-neutral-500" />
                <input
                  type="number"
                  value={tradeAmount}
                  onChange={(e) => setTradeAmount(Math.max(1, Number(e.target.value)))}
                  className="w-full pl-10 pr-4 py-3 bg-black border border-neutral-800 rounded-xl text-white font-mono font-black text-sm focus:outline-none focus:border-white transition-colors"
                  placeholder="Enter custom amount"
                />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <button 
                  onClick={() => handleAction('BUY')}
                  className="p-6 bg-white hover:bg-neutral-200 text-black font-black text-lg uppercase tracking-[0.25em] rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-4 cursor-pointer shadow-2xl border border-white/20"
                >
                  <TrendingUp className="w-6 h-6" />
                  BUY
                </button>
                <button 
                  onClick={() => handleAction('SELL')}
                  className="p-6 bg-black hover:bg-neutral-900 text-white font-black text-lg uppercase tracking-[0.25em] rounded-[2rem] transition-all active:scale-95 flex items-center justify-center gap-4 cursor-pointer shadow-2xl border border-white/10"
                >
                  <TrendingDown className="w-6 h-6" />
                  SELL
                </button>
              </div>
            </div>

            {/* Asset Pulse Watchlist */}
            <div className="space-y-4">
              <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-neutral-500 px-2">
                <div className="flex items-center gap-2">
                  <Search className="w-3 h-3" />
                  <span>Market Pulse</span>
                </div>
                <span>{markets.length} Assets</span>
              </div>
              <div className="space-y-2">
                {markets.slice(0, 15).map((m) => (
                  <div 
                    key={m.symbol}
                    onClick={() => {
                      setSelectedSymbol(m.symbol);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className={`p-4 rounded-xl border flex items-center justify-between transition-all cursor-pointer group ${m.symbol === selectedSymbol ? 'bg-white text-black border-white' : 'bg-neutral-900/30 border-neutral-800 hover:border-neutral-700'}`}
                  >
                    <div className="flex items-center gap-3">
                      <AssetLogo symbol={m.symbol} size="sm" />
                      <div>
                        <div className="text-xs font-black uppercase tracking-tight">{m.symbol.split('/')[0]}</div>
                        <div className="text-[7px] font-black text-neutral-500 uppercase tracking-widest">{m.category}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-black font-mono">${m.price.toLocaleString(undefined, { minimumFractionDigits: m.precision })}</div>
                      <div className={`text-[9px] font-black ${m.symbol === selectedSymbol ? 'text-neutral-500' : (m.change24hPercent >= 0 ? 'text-emerald-400' : 'text-rose-400')}`}>
                        {m.change24hPercent >= 0 ? '+' : ''}{m.change24hPercent.toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Simplified Footer Info */}
      <footer className="w-full px-8 py-6 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-neutral-600">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[10px] font-black uppercase tracking-widest">Network: Live</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-3.5 h-3.5" />
            <span className="text-[10px] font-black uppercase tracking-widest">Feed Latency: 24ms</span>
          </div>
        </div>
        <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-widest">
           <span>Terms</span>
           <span>Privacy</span>
           <span>© 2026 Onpiks Terminal</span>
        </div>
      </footer>
    </div>
  );
}
