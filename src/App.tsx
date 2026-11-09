/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MarketAsset, Candle, TechnicalIndicators, BrainPrediction, AssetCategory, ActiveTaskView } from './types.js';
import { Header } from './components/Header.tsx';
import { TaskBar } from './components/TaskBar.tsx';
import { MarketBar } from './components/MarketBar.tsx';
import { CandleChart } from './components/CandleChart.tsx';
import { BrainPredictionCard } from './components/BrainPredictionCard.tsx';
import { GoogleTradeCard } from './components/GoogleTradeCard.tsx';
import { AITradeHubModal } from './components/AITradeHubModal.tsx';
import { GoogleAnalyticsTrendsCard } from './components/GoogleAnalyticsTrendsCard.tsx';
import { NewsSentimentsCard } from './components/NewsSentimentsCard.tsx';
import { TechnicalsCard } from './components/TechnicalsCard.tsx';
import { AssetLogo } from './components/AssetLogo.tsx';
import {
  Globe,
  AlertCircle,
  TrendingUp,
  Compass,
  BarChart3,
  Home as HomeIcon,
  Layers,
  ArrowRight,
  Search,
  Zap,
  Building2,
} from 'lucide-react';

export default function App() {
  const [markets, setMarkets] = useState<MarketAsset[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('BTC/USD');
  const [selectedCategory, setSelectedCategory] = useState<AssetCategory>('all');
  const [timeframe, setTimeframe] = useState<string>('1d');
  const [activeTask, setActiveTask] = useState<ActiveTaskView>('home');
  const [fastSearchQuery, setFastSearchQuery] = useState<string>('');
  const [isAITradeHubOpen, setIsAITradeHubOpen] = useState<boolean>(false);

  const [candles, setCandles] = useState<Candle[]>([]);
  const [technicals, setTechnicals] = useState<TechnicalIndicators | undefined>();
  const [prediction, setPrediction] = useState<BrainPrediction | null>(null);

  const [isLoadingMarkets, setIsLoadingMarkets] = useState<boolean>(true);
  const [isLoadingCandles, setIsLoadingCandles] = useState<boolean>(true);
  const [isLoadingPrediction, setIsLoadingPrediction] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Active selected asset
  const activeAsset = markets.find((m) => m.symbol === selectedSymbol) || markets[0];

  // Fetch live market assets
  const loadMarkets = useCallback(async (isInitial: boolean = false) => {
    try {
      if (isInitial) setIsLoadingMarkets(true);
      const res = await fetch('/api/markets');
      if (!res.ok) throw new Error('Failed to load market data');
      const data = await res.json();
      if (data.success && Array.isArray(data.data)) {
        setMarkets(data.data);
        setLastUpdated(new Date().toLocaleTimeString());
      }
    } catch (err: any) {
      console.error('Markets fetch error:', err);
      if (isInitial) setErrorMessage('Unable to reach real-time market data API.');
    } finally {
      if (isInitial) setIsLoadingMarkets(false);
    }
  }, []);

  // Fetch candles & technical indicators
  const loadCandles = useCallback(async (symbol: string, tf: string) => {
    try {
      setIsLoadingCandles(true);
      const res = await fetch(`/api/candles?symbol=${encodeURIComponent(symbol)}&timeframe=${tf}`);
      if (!res.ok) throw new Error('Failed to load candles');
      const data = await res.json();
      if (data.success) {
        setCandles(data.candles || []);
        setTechnicals(data.technicals);
      }
    } catch (err: any) {
      console.error('Candles fetch error:', err);
    } finally {
      setIsLoadingCandles(false);
    }
  }, []);

  // Fetch Inside Calculation Brain Prediction & News Sentiment
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
    } catch (err: any) {
      console.error('Prediction fetch error:', err);
    } finally {
      setIsLoadingPrediction(false);
    }
  }, []);

  // Handle asset switch cleanly
  const handleSelectSymbol = (newSymbol: string) => {
    if (newSymbol === selectedSymbol) return;
    setSelectedSymbol(newSymbol);
    setPrediction(null); // Clear old prediction immediately so chart scale never gets distorted
  };

  // Handle page/task change
  const handleTaskChange = (task: ActiveTaskView) => {
    setActiveTask(task);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Initial load
  useEffect(() => {
    loadMarkets(true);
  }, [loadMarkets]);

  // Load candles & prediction when selected symbol or timeframe changes
  useEffect(() => {
    if (selectedSymbol) {
      loadCandles(selectedSymbol, timeframe);
      loadPrediction(selectedSymbol);
    }
  }, [selectedSymbol, timeframe, loadCandles, loadPrediction]);

  // Polling for live real-time market prices every 15 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      loadMarkets(false);
    }, 15000);
    return () => clearInterval(timer);
  }, [loadMarkets]);

  // Manual refresh handler
  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    await Promise.all([
      loadMarkets(false),
      loadCandles(selectedSymbol, timeframe),
      loadPrediction(selectedSymbol),
    ]);
    setIsRefreshing(false);
  };

  // Find US Dollar Index (DXY) asset for live header gauge
  const dxyAsset = markets.find((m) => m.symbol === 'DXY');

  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white flex flex-col">
      {/* Top Header */}
      <Header
        lastUpdated={lastUpdated}
        isRefreshing={isRefreshing}
        onRefresh={handleManualRefresh}
        activeAssetCount={markets.length}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        dxyAsset={dxyAsset}
      />

      {/* Task Navigation Bar: Home, Trade, Up Down, Analyze */}
      <TaskBar
        activeTask={activeTask}
        onChangeTask={handleTaskChange}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
        onSelectSymbol={handleSelectSymbol}
      />

      {/* Market Bar with Instant Search & Round Small Logo Ticker Cards */}
      <MarketBar
        markets={markets}
        selectedSymbol={selectedSymbol}
        onSelectSymbol={handleSelectSymbol}
        selectedCategory={selectedCategory}
        onSelectCategory={(cat) => setSelectedCategory(cat)}
      />

      {/* Main Content Viewport (pb-24 on mobile so sticky bottom task bar never overlaps content) */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 pb-24 md:pb-8 space-y-6">
        {errorMessage && (
          <div className="p-3 bg-rose-50 border border-rose-300 rounded-md text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ============================================================ */}
        {/* PAGE 1: HOME OVERVIEW (Fast Product & Shares Tracker + Summary) */}
        {/* ============================================================ */}
        {activeTask === 'home' && (
          <div className="space-y-6">
            {/* Quick Page Jump Banner */}
            <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <h1 className="text-base font-bold text-black font-sans flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                  Onpiks Fast Market & Company Share Intelligence
                </h1>
                <p className="text-xs text-neutral-500 font-mono mt-0.5">
                  Track 50+ company shares, oil, commodities, forex & crypto in sub-seconds.
                </p>
              </div>

              {/* Fast links to other pages */}
              <div className="flex items-center gap-2 flex-wrap text-xs font-mono">
                <button
                  onClick={() => handleTaskChange('trade')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-black text-white hover:bg-neutral-800 rounded-md font-semibold transition-colors cursor-pointer shadow-xs"
                >
                  <Compass className="w-3.5 h-3.5 text-blue-400" />
                  <span>Open Interactive Chart (Trade) ↗</span>
                </button>

                <button
                  onClick={() => handleTaskChange('updown')}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-neutral-300 hover:border-black rounded-md text-black font-semibold transition-colors cursor-pointer"
                >
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Up Down Page</span>
                </button>
              </div>
            </div>

            {/* Fast Product & Company Share Search Console ("make a Fast And Can Trake any product and sheres of every company in few second") */}
            <div className="w-full bg-white border border-neutral-300 rounded-xl p-4 shadow-xs space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-neutral-200">
                <div className="flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-black" />
                  <span className="text-xs font-bold text-black font-sans">
                    Fast Track Any Product, Share & Currency (Sub-Second Lookup)
                  </span>
                </div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase">
                  {markets.length} Tickers Verified Live
                </span>
              </div>

              {/* Search Bar Input */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Fast search any company share (NVDA, Apple, Tesla...), crude oil, gold, EUR/USD..."
                  value={fastSearchQuery}
                  onChange={(e) => setFastSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-neutral-50 border border-neutral-300 rounded-lg text-xs font-mono text-black placeholder:text-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-all"
                />
              </div>

              {/* Quick Filtered Company Share & Product Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 text-xs font-mono pt-1 max-h-60 overflow-y-auto">
                {markets
                  .filter((m) => {
                    if (!fastSearchQuery.trim()) return true;
                    const q = fastSearchQuery.toLowerCase().trim();
                    return (
                      m.symbol.toLowerCase().includes(q) ||
                      m.name.toLowerCase().includes(q) ||
                      (m.sector && m.sector.toLowerCase().includes(q)) ||
                      m.category.toLowerCase().includes(q)
                    );
                  })
                  .slice(0, 18)
                  .map((asset) => {
                    const isUp = asset.change24hPercent >= 0;
                    const isCurrent = asset.symbol === selectedSymbol;

                    return (
                      <div
                        key={asset.symbol}
                        onClick={() => {
                          handleSelectSymbol(asset.symbol);
                        }}
                        className={`p-2.5 rounded-lg border cursor-pointer flex flex-col justify-between transition-all ${
                          isCurrent
                            ? 'bg-black text-white border-black font-bold shadow-xs'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-900'
                        }`}
                      >
                        <div className="flex items-center gap-1.5">
                          <AssetLogo symbol={asset.symbol} size="sm" />
                          <div className="truncate">
                            <div className="font-bold">{asset.symbol}</div>
                            <div
                              className={`text-[9px] truncate ${
                                isCurrent ? 'text-neutral-300' : 'text-neutral-500'
                              }`}
                            >
                              {asset.name}
                            </div>
                          </div>
                        </div>

                        <div className="mt-2 pt-1 border-t border-neutral-200/40 flex items-center justify-between text-[11px]">
                          <span className="tabular-nums font-bold">
                            ${asset.price.toLocaleString(undefined, {
                              minimumFractionDigits: asset.precision > 2 ? asset.precision : 2,
                            })}
                          </span>
                          <span
                            className={`font-bold tabular-nums text-[10px] ${
                              isCurrent
                                ? isUp ? 'text-emerald-400' : 'text-rose-400'
                                : isUp ? 'text-emerald-700' : 'text-rose-700'
                            }`}
                          >
                            {isUp ? '+' : ''}{asset.change24hPercent.toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* 2-Column Responsive Dashboard Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left / Main Column (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                {/* 1. Inside Calculation Brain - Today's Candle Direction (Up / Down) */}
                <BrainPredictionCard
                  prediction={prediction}
                  isLoading={isLoadingPrediction}
                />

                {/* 2. Google Trade - Automated Real-Time Execution Engine & P&L Calculator */}
                <GoogleTradeCard
                  tradeSetup={prediction?.tradeSetup}
                  googleTrade={prediction?.googleTrade}
                  tradeHistory={prediction?.tradeHistory}
                  pendingOrders={prediction?.pendingOrders}
                  currentPrice={activeAsset?.price || 0}
                  precision={activeAsset?.precision || 2}
                  onOpenAITradeHub={() => setIsAITradeHubOpen(true)}
                />
              </div>

              {/* Right Column (4 Cols) */}
              <div className="lg:col-span-4 space-y-6">
                {/* 1. World Markets Pulse Watchlist with Round Small Logos */}
                <div className="w-full bg-white border border-neutral-200 rounded-lg p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-black" />
                      <h3 className="text-sm font-bold text-black font-sans">
                        World Markets Pulse
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      {markets.length} Assets Live
                    </span>
                  </div>

                  <div className="divide-y divide-neutral-100 text-xs font-mono mt-1 max-h-96 overflow-y-auto">
                    {markets.slice(0, 12).map((asset) => {
                      const isUp = asset.change24hPercent >= 0;
                      const isCurrent = asset.symbol === selectedSymbol;

                      return (
                        <div
                          key={asset.symbol}
                          onClick={() => handleSelectSymbol(asset.symbol)}
                          className={`py-2 px-1.5 flex items-center justify-between cursor-pointer rounded transition-colors ${
                            isCurrent ? 'bg-neutral-100 font-bold' : 'hover:bg-neutral-50'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <AssetLogo symbol={asset.symbol} size="sm" />
                            <div>
                              <div className="font-bold text-black">{asset.symbol}</div>
                              <div className="text-[10px] text-neutral-500 truncate max-w-[110px]">
                                {asset.name}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold text-black tabular-nums">
                              ${asset.price.toLocaleString(undefined, {
                                minimumFractionDigits: asset.precision > 2 ? asset.precision : 2,
                              })}
                            </div>
                            <div
                              className={`text-[11px] font-bold tabular-nums ${
                                isUp ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {isUp ? '+' : ''}
                              {asset.change24hPercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. Google Trends Search Surge */}
                <GoogleAnalyticsTrendsCard
                  analytics={prediction?.googleTrends}
                  symbol={selectedSymbol}
                />

                {/* 3. News Sentiments Summary */}
                <NewsSentimentsCard
                  news={prediction?.newsSentiments || []}
                  symbol={selectedSymbol}
                  assetName={activeAsset?.name || selectedSymbol}
                />
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PAGE 2: TRADE (Dedicated Interactive Chart & Execution Station) */}
        {/* ============================================================ */}
        {activeTask === 'trade' && (
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-black text-white flex items-center justify-center">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-black tracking-tight font-sans">
                    Trade Station • Interactive Candlestick Chart & Execution Engine
                  </h1>
                  <p className="text-xs text-neutral-500 font-mono">
                    Real-time Candlestick Chart, Phantom Quick-Trade Dock, Target Levels (TP1/TP2/TP3) & Position P&L
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-neutral-500">Active Trading Symbol:</span>
                <span className="font-bold text-black px-2.5 py-1 bg-neutral-100 rounded border border-neutral-200">
                  {selectedSymbol} (${activeAsset?.price.toFixed(activeAsset?.precision || 2)})
                </span>
              </div>
            </div>

            {/* 1. Main Interactive Candlestick Chart rendered inside Trade button ("make the chart in Trade buttton pliz not add in home ok") */}
            <CandleChart
              symbol={selectedSymbol}
              assetName={activeAsset?.name || selectedSymbol}
              currentPrice={activeAsset?.price || 0}
              precision={activeAsset?.precision || 2}
              candles={candles}
              technicals={technicals}
              predictedCandle={prediction?.predictedCandle}
              predictionSymbol={prediction?.symbol}
              predictedDirection={prediction?.direction}
              upProbability={prediction?.upProbability}
              timeframe={timeframe}
              onChangeTimeframe={(tf) => setTimeframe(tf)}
              isLoading={isLoadingCandles}
              isDedicatedPage={true}
            />

            {/* Main Google Trade Execution Plan & Position P&L */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              <div className="lg:col-span-8 space-y-6">
                <GoogleTradeCard
                  tradeSetup={prediction?.tradeSetup}
                  googleTrade={prediction?.googleTrade}
                  tradeHistory={prediction?.tradeHistory}
                  pendingOrders={prediction?.pendingOrders}
                  currentPrice={activeAsset?.price || 0}
                  precision={activeAsset?.precision || 2}
                  onOpenAITradeHub={() => setIsAITradeHubOpen(true)}
                />

                {/* Technical Pivots Confluence */}
                <TechnicalsCard
                  technicals={technicals}
                  precision={activeAsset?.precision || 2}
                />
              </div>

              {/* Right Side: Direction Verdict & Watchlist */}
              <div className="lg:col-span-4 space-y-6">
                <BrainPredictionCard
                  prediction={prediction}
                  isLoading={isLoadingPrediction}
                />

                {/* Quick Switcher for Trades */}
                <div className="bg-white border border-neutral-200 rounded-lg p-4 shadow-xs">
                  <h4 className="text-xs font-bold font-mono text-black uppercase mb-3">
                    Fast Trade Symbol Switcher
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                    {[
                      { sym: 'BTC/USD', name: 'Bitcoin' },
                      { sym: 'OIL_WTI', name: 'Oil WTI' },
                      { sym: 'NVDA', name: 'NVIDIA' },
                      { sym: 'AAPL', name: 'Apple' },
                      { sym: 'MSFT', name: 'Microsoft' },
                      { sym: 'TSLA', name: 'Tesla' },
                      { sym: 'GOLD', name: 'Gold' },
                      { sym: 'EUR/USD', name: 'EUR/USD' },
                    ].map((item) => (
                      <button
                        key={item.sym}
                        onClick={() => handleSelectSymbol(item.sym)}
                        className={`p-2 rounded border text-left transition-colors cursor-pointer ${
                          selectedSymbol === item.sym
                            ? 'bg-black text-white border-black font-bold'
                            : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                        }`}
                      >
                        <div className="flex items-center gap-1.5 truncate">
                          <AssetLogo symbol={item.sym} size="sm" />
                          <span className="truncate">{item.sym}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* PAGE 3: UP DOWN (Dedicated Candlestick Section & Prediction) */}
        {/* ============================================================ */}
        {activeTask === 'updown' && (
          <div className="space-y-6">
            {/* Page Header Banner */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-black tracking-tight font-sans">
                    Up Down • Candlestick Direction Prediction Terminal
                  </h1>
                  <p className="text-xs text-neutral-500 font-mono">
                    Interactive Zoom In/Out & Stretchable Chart · Scroll down for Inside Calculation Brain Up/Down Forecast
                  </p>
                </div>
              </div>

              {/* Fast Ticker Jump Strip */}
              <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
                {['BTC/USD', 'OIL_WTI', 'NVDA', 'AAPL', 'EUR/USD', 'GOLD'].map((sym) => (
                  <button
                    key={sym}
                    onClick={() => handleSelectSymbol(sym)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-mono cursor-pointer border ${
                      selectedSymbol === sym
                        ? 'bg-black text-white border-black font-bold'
                        : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-800'
                    }`}
                  >
                    <AssetLogo symbol={sym} size="sm" />
                    <span>{sym.split('/')[0]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 1. Full-Width Candlestick Trading Station with Zoom In, Zoom Out, Stretch Controls */}
            <CandleChart
              symbol={selectedSymbol}
              assetName={activeAsset?.name || selectedSymbol}
              currentPrice={activeAsset?.price || 0}
              precision={activeAsset?.precision || 2}
              candles={candles}
              technicals={technicals}
              predictedCandle={prediction?.predictedCandle}
              predictionSymbol={prediction?.symbol}
              predictedDirection={prediction?.direction}
              upProbability={prediction?.upProbability}
              timeframe={timeframe}
              onChangeTimeframe={(tf) => setTimeframe(tf)}
              isLoading={isLoadingCandles}
              isDedicatedPage={true}
            />

            {/* Scroll Down Indicator */}
            <div className="flex items-center justify-center gap-2 py-1 text-xs font-mono text-neutral-400">
              <span>▼ Scroll down to inspect Inside Calculation Brain breakdown, forecast targets & technicals</span>
            </div>

            {/* 2. Directly Underneath: Today's Daily Candle Forecast & Inside Calculation Brain Breakdown */}
            <BrainPredictionCard
              prediction={prediction}
              isLoading={isLoadingPrediction}
            />

            {/* 3. Deep Technical Indicators & Floor Pivot Points */}
            <TechnicalsCard
              technicals={technicals}
              precision={activeAsset?.precision || 2}
            />

            {/* 4. Google Trade Automated Execution Signals */}
            <GoogleTradeCard
              tradeSetup={prediction?.tradeSetup}
              googleTrade={prediction?.googleTrade}
              tradeHistory={prediction?.tradeHistory}
              pendingOrders={prediction?.pendingOrders}
              currentPrice={activeAsset?.price || 0}
              precision={activeAsset?.precision || 2}
              onOpenAITradeHub={() => setIsAITradeHubOpen(true)}
            />
          </div>
        )}

        {/* ============================================================ */}
        {/* PAGE 4: ANALYZE (Market Research, Sentiments, & Trends Suite) */}
        {/* ============================================================ */}
        {activeTask === 'analyze' && (
          <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center">
                  <BarChart3 className="w-5 h-5" />
                </div>
                <div>
                  <h1 className="text-xl font-black text-black tracking-tight font-sans">
                    Market Research & Sentiment Analysis Suite
                  </h1>
                  <p className="text-xs text-neutral-500 font-mono">
                    Google Trends Search Interest Velocity, News Sentiment Web Extraction & Technical Confluence
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs font-mono">
                <span className="text-neutral-500">Analyzing:</span>
                <span className="font-bold text-black px-2.5 py-1 bg-neutral-100 rounded border border-neutral-200">
                  {selectedSymbol}
                </span>
              </div>
            </div>

            {/* 2-Column Deep Analysis Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Google Trends Search Analytics & Technicals */}
              <div className="lg:col-span-6 space-y-6">
                <GoogleAnalyticsTrendsCard
                  analytics={prediction?.googleTrends}
                  symbol={selectedSymbol}
                />

                <TechnicalsCard
                  technicals={technicals}
                  precision={activeAsset?.precision || 2}
                />
              </div>

              {/* Right Column: News Sentiments & World Watchlist */}
              <div className="lg:col-span-6 space-y-6">
                <NewsSentimentsCard
                  news={prediction?.newsSentiments || []}
                  symbol={selectedSymbol}
                  assetName={activeAsset?.name || selectedSymbol}
                />

                {/* World Markets Pulse */}
                <div className="w-full bg-white border border-neutral-200 rounded-lg p-5 shadow-xs">
                  <div className="flex items-center justify-between pb-3.5 border-b border-neutral-200">
                    <div className="flex items-center gap-2">
                      <Globe className="w-4 h-4 text-black" />
                      <h3 className="text-sm font-bold text-black font-sans">
                        Cross-Asset Confluence Watchlist
                      </h3>
                    </div>
                    <span className="text-[10px] font-mono text-neutral-400 uppercase">
                      {markets.length} Real-Time Feeds
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3 text-xs font-mono">
                    {markets.slice(0, 8).map((asset) => {
                      const isUp = asset.change24hPercent >= 0;
                      const isCurrent = asset.symbol === selectedSymbol;

                      return (
                        <div
                          key={asset.symbol}
                          onClick={() => handleSelectSymbol(asset.symbol)}
                          className={`p-2 rounded border cursor-pointer flex items-center justify-between transition-colors ${
                            isCurrent
                              ? 'bg-black text-white border-black font-bold'
                              : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <AssetLogo symbol={asset.symbol} size="sm" />
                            <div>
                              <div className="font-bold">{asset.symbol}</div>
                              <div className={`text-[10px] truncate max-w-[80px] ${isCurrent ? 'text-neutral-300' : 'text-neutral-500'}`}>
                                {asset.name}
                              </div>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="font-semibold tabular-nums">
                              ${asset.price.toLocaleString(undefined, {
                                minimumFractionDigits: asset.precision > 2 ? asset.precision : 2,
                              })}
                            </div>
                            <div
                              className={`text-[10px] font-bold tabular-nums ${
                                isCurrent
                                  ? isUp ? 'text-emerald-400' : 'text-rose-400'
                                  : isUp ? 'text-emerald-700' : 'text-rose-700'
                              }`}
                            >
                              {isUp ? '+' : ''}{asset.change24hPercent.toFixed(2)}%
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Advanced Free AI Model Trade Intelligence Hub Modal */}
      <AITradeHubModal
        isOpen={isAITradeHubOpen}
        onClose={() => setIsAITradeHubOpen(false)}
        markets={markets}
        initialSymbol={selectedSymbol}
        onSelectSymbol={handleSelectSymbol}
      />

      {/* Clean Minimalist Footer */}
      <footer className="w-full bg-white border-t border-neutral-200 py-3 px-4 sm:px-6 text-center text-xs font-mono text-neutral-500 hidden md:block">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            <strong className="text-black font-sans">Onpiks</strong> · Real-Time Market Candle Prediction & Trade Engine
          </div>
          <div className="text-neutral-400 text-[11px]">
            Public Data Feeds: Binance API • Yahoo Finance V8 • Google Trends • Google News RSS
          </div>
        </div>
      </footer>
    </div>
  );
}
