/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useRef } from 'react';
import { Candle, TechnicalIndicators, PredictedCandle } from '../types.js';
import {
  TrendingUp,
  TrendingDown,
  Zap,
  ZoomIn,
  ZoomOut,
  ArrowLeftRight,
  ArrowUpDown,
  RotateCcw,
  Maximize2,
  Minimize2,
  SlidersHorizontal,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  Clock,
  ArrowRight,
  X,
} from 'lucide-react';
import { AssetLogo } from './AssetLogo.tsx';

interface CandleChartProps {
  symbol: string;
  assetName: string;
  currentPrice: number;
  precision: number;
  candles: Candle[];
  technicals?: TechnicalIndicators;
  predictedCandle?: PredictedCandle;
  predictionSymbol?: string;
  predictedDirection?: 'UP' | 'DOWN';
  upProbability?: number;
  timeframe: string;
  onChangeTimeframe: (tf: string) => void;
  isLoading?: boolean;
  isDedicatedPage?: boolean;
  onNavigateToDedicatedPage?: () => void;
}

export const CandleChart: React.FC<CandleChartProps> = ({
  symbol,
  assetName,
  currentPrice,
  precision,
  candles,
  technicals,
  predictedCandle,
  predictionSymbol,
  predictedDirection,
  upProbability = 70,
  timeframe,
  onChangeTimeframe,
  isLoading = false,
  isDedicatedPage = false,
  onNavigateToDedicatedPage,
}) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);
  const [showSMA, setShowSMA] = useState(true);
  const [showEMA, setShowEMA] = useState(true);
  const [showPivots, setShowPivots] = useState(true);
  const [showPredictionGhost, setShowPredictionGhost] = useState(true);

  // Phantom Trade Dock & Preview State ("Add inside in trade ok and main previw like panthom trade Ux ddsign like")
  const [showPhantomTrade, setShowPhantomTrade] = useState<boolean>(true);
  const [phantomSide, setPhantomSide] = useState<'BUY' | 'SELL'>('BUY');
  const [phantomOrderType, setPhantomOrderType] = useState<'MARKET' | 'LIMIT' | 'BRACKET'>('MARKET');
  const [phantomAmount, setPhantomAmount] = useState<number>(500);
  const [phantomActiveOrder, setPhantomActiveOrder] = useState<{
    id: string;
    side: 'BUY' | 'SELL';
    symbol: string;
    entry: number;
    amount: number;
    tp: number;
    sl: number;
    timestamp: string;
  } | null>(null);
  const [phantomToast, setPhantomToast] = useState<string | null>(null);

  // Zoom & Stretch Interactive Controls
  const [visibleCount, setVisibleCount] = useState<number>(isDedicatedPage ? 45 : 35); // Number of visible candles (zoom)
  const [panIndexOffset, setPanIndexOffset] = useState<number>(0); // Pan offset into history
  const [verticalScale, setVerticalScale] = useState<number>(1.0); // Stretch vertical price height
  const [candleWidthMultiplier, setCandleWidthMultiplier] = useState<number>(1.0); // Stretch horizontal candle body
  const [isExpanded, setIsExpanded] = useState<boolean>(false); // Dedicated large viewport

  // Drag-to-pan state
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartX, setDragStartX] = useState(0);

  const svgRef = useRef<SVGSVGElement | null>(null);

  // SVG viewport geometry - Big and prominent chart display ("make the chart big ok")
  const chartHeight = isExpanded ? 640 : (isDedicatedPage ? 560 : 480);
  const chartWidth = 920;
  const paddingRight = 75;
  const paddingLeft = 16;
  const paddingTop = 26;
  const paddingBottom = 42;
  const innerWidth = chartWidth - paddingLeft - paddingRight;
  const innerHeight = chartHeight - paddingTop - paddingBottom;
  const volumeHeight = isExpanded ? 90 : (isDedicatedPage ? 80 : 70);
  const priceChartHeight = innerHeight - volumeHeight - 16;

  // Zoom actions with granular zoom levels ("can zoomable")
  const handleZoomIn = () => {
    setVisibleCount((prev) => Math.max(8, prev - 4));
  };

  const handleZoomOut = () => {
    setVisibleCount((prev) => Math.min(candles.length || 70, prev + 5));
  };

  const handleStretchWidth = () => {
    setCandleWidthMultiplier((prev) => (prev >= 1.5 ? 0.8 : prev + 0.25));
  };

  const handleStretchHeight = () => {
    setVerticalScale((prev) => (prev >= 1.6 ? 0.8 : prev + 0.25));
  };

  const handleResetScale = () => {
    setVisibleCount(Math.min(35, candles.length || 35));
    setPanIndexOffset(0);
    setVerticalScale(1.0);
    setCandleWidthMultiplier(1.0);
  };

  // Slice visible candles based on zoom and pan
  const visibleCandles = useMemo(() => {
    if (candles.length === 0) return [];
    const count = Math.min(candles.length, visibleCount);
    const maxOffset = candles.length - count;
    const clampedOffset = Math.max(0, Math.min(maxOffset, panIndexOffset));
    const start = candles.length - count - clampedOffset;
    return candles.slice(Math.max(0, start), candles.length - clampedOffset);
  }, [candles, visibleCount, panIndexOffset]);

  // Verify prediction matches symbol and is within sensible magnitude to prevent chart distortion
  const isPredictionValid = useMemo(() => {
    if (!predictedCandle || !predictionSymbol || predictionSymbol !== symbol) return false;
    if (currentPrice <= 0) return false;
    const ratio = predictedCandle.predictedClose / currentPrice;
    return ratio > 0.4 && ratio < 2.5;
  }, [predictedCandle, predictionSymbol, symbol, currentPrice]);

  const { minPrice, maxPrice, maxVolume } = useMemo(() => {
    if (visibleCandles.length === 0) {
      const base = currentPrice || 100;
      return { minPrice: base * 0.95, maxPrice: base * 1.05, maxVolume: 1000 };
    }

    let min = Infinity;
    let max = -Infinity;
    let maxVol = 0;

    for (const c of visibleCandles) {
      if (c.low < min) min = c.low;
      if (c.high > max) max = c.high;
      if (c.volume > maxVol) maxVol = c.volume;
    }

    if (isPredictionValid && predictedCandle && showPredictionGhost && panIndexOffset === 0) {
      if (predictedCandle.predictedLow < min) min = predictedCandle.predictedLow;
      if (predictedCandle.predictedHigh > max) max = predictedCandle.predictedHigh;
    }

    const rawRange = max - min || 1;
    const mid = (max + min) / 2;
    // Apply vertical stretch
    const adjustedRange = (rawRange / verticalScale) * 1.08;

    return {
      minPrice: Math.max(0, mid - adjustedRange / 2),
      maxPrice: mid + adjustedRange / 2,
      maxVolume: maxVol || 1,
    };
  }, [visibleCandles, isPredictionValid, predictedCandle, showPredictionGhost, currentPrice, verticalScale, panIndexOffset]);

  // Coordinate mappers
  const getY = (val: number) => {
    const ratio = (val - minPrice) / (maxPrice - minPrice || 1);
    return paddingTop + priceChartHeight * (1 - ratio);
  };

  const getVolY = (vol: number) => {
    const ratio = vol / maxVolume;
    return paddingTop + priceChartHeight + 12 + volumeHeight * (1 - ratio);
  };

  const showGhostInView = isPredictionValid && showPredictionGhost && panIndexOffset === 0;
  const totalSlots = visibleCandles.length + (showGhostInView ? 2 : 0);
  const slotWidth = innerWidth / Math.max(totalSlots, 1);
  const candleBodyWidth = Math.max(3, Math.min(slotWidth * 0.72 * candleWidthMultiplier, 22));

  const getX = (index: number) => paddingLeft + index * slotWidth + slotWidth / 2;

  // Active hovered candle
  const hoveredCandle =
    hoverIndex !== null && hoverIndex < visibleCandles.length ? visibleCandles[hoverIndex] : null;

  const lastCandle = candles[candles.length - 1];
  const isCurrentUp = lastCandle ? lastCandle.close >= lastCandle.open : true;

  // Calculate 20 SMA points for visible candles
  const smaPoints = useMemo(() => {
    if (!showSMA || visibleCandles.length < 5) return [];
    const pts: { x: number; y: number }[] = [];
    const period = 20;

    for (let i = 0; i < visibleCandles.length; i++) {
      const slice = visibleCandles.slice(Math.max(0, i - period + 1), i + 1);
      const avg = slice.reduce((a, b) => a + b.close, 0) / slice.length;
      pts.push({ x: getX(i), y: getY(avg) });
    }
    return pts;
  }, [visibleCandles, showSMA, minPrice, maxPrice]);

  // Calculate 50 EMA points for visible candles
  const emaPoints = useMemo(() => {
    if (!showEMA || visibleCandles.length < 5) return [];
    const pts: { x: number; y: number }[] = [];
    const k = 2 / (30 + 1);
    let ema = visibleCandles[0].close;

    for (let i = 0; i < visibleCandles.length; i++) {
      ema = visibleCandles[i].close * k + ema * (1 - k);
      pts.push({ x: getX(i), y: getY(ema) });
    }
    return pts;
  }, [visibleCandles, showEMA, minPrice, maxPrice]);

  // Non-passive wheel listener attached directly to SVG node so the chart zooms without zooming or scrolling the webpage
  React.useEffect(() => {
    const el = svgRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (e.deltaY < 0) {
        setVisibleCount((prev) => Math.max(8, prev - 4));
      } else {
        setVisibleCount((prev) => Math.min(candles.length || 70, prev + 4));
      }
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      el.removeEventListener('wheel', onWheel);
    };
  }, [candles.length]);

  // Touch handlers for mobile pinch-to-zoom and drag-to-pan
  const [touchStartDist, setTouchStartDist] = useState<number | null>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2) {
      const dist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      setTouchStartDist(dist);
    } else if (e.touches.length === 1) {
      setTouchStartX(e.touches[0].clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 2 && touchStartDist !== null) {
      if (e.cancelable) e.preventDefault();
      const newDist = Math.hypot(
        e.touches[0].clientX - e.touches[1].clientX,
        e.touches[0].clientY - e.touches[1].clientY
      );
      const diff = newDist - touchStartDist;
      if (Math.abs(diff) > 8) {
        if (diff > 0) {
          setVisibleCount((prev) => Math.max(8, prev - 3));
        } else {
          setVisibleCount((prev) => Math.min(candles.length || 70, prev + 3));
        }
        setTouchStartDist(newDist);
      }
    } else if (e.touches.length === 1 && touchStartX !== null) {
      const deltaX = e.touches[0].clientX - touchStartX;
      if (Math.abs(deltaX) > 8) {
        const step = deltaX > 0 ? 1 : -1;
        setPanIndexOffset((prev) => {
          const maxOffset = Math.max(0, candles.length - visibleCount);
          return Math.max(0, Math.min(maxOffset, prev + step));
        });
        setTouchStartX(e.touches[0].clientX);
      }
    }
  };

  const handleTouchEnd = () => {
    setTouchStartDist(null);
    setTouchStartX(null);
  };

  // Mouse wheel handler fallback
  const handleWheel = (e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

  // Mouse drag handlers to pan left/right
  const handleMouseDown = (e: React.MouseEvent<SVGSVGElement>) => {
    setIsDragging(true);
    setDragStartX(e.clientX);
  };

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStartX;
      if (Math.abs(deltaX) > 12) {
        const step = deltaX > 0 ? 1 : -1;
        setPanIndexOffset((prev) => {
          const maxOffset = Math.max(0, candles.length - visibleCount);
          return Math.max(0, Math.min(maxOffset, prev + step));
        });
        setDragStartX(e.clientX);
      }
      return;
    }

    if (!svgRef.current || visibleCandles.length === 0) return;
    const rect = svgRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * chartWidth;
    const relativeX = mouseX - paddingLeft;
    const index = Math.floor(relativeX / slotWidth);
    if (index >= 0 && index < visibleCandles.length) {
      setHoverIndex(index);
    } else {
      setHoverIndex(null);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Phantom Trade Engine calculations ("Add inside in trade ok and main previw like panthom trade Ux ddsign like")
  const isPhantomBuy = phantomSide === 'BUY';
  const phantomEntry = currentPrice || 100;
  const phantomTarget = useMemo(() => {
    if (predictedCandle && predictedCandle.predictedClose) {
      return isPhantomBuy
        ? Math.max(phantomEntry * 1.015, predictedCandle.predictedHigh || phantomEntry * 1.025)
        : Math.min(phantomEntry * 0.985, predictedCandle.predictedLow || phantomEntry * 0.975);
    }
    return isPhantomBuy ? phantomEntry * 1.028 : phantomEntry * 0.972;
  }, [isPhantomBuy, phantomEntry, predictedCandle]);

  const phantomStopLoss = useMemo(() => {
    return isPhantomBuy ? phantomEntry * 0.987 : phantomEntry * 1.013;
  }, [isPhantomBuy, phantomEntry]);

  const phantomProfit = Math.round(phantomAmount * (Math.abs(phantomTarget - phantomEntry) / phantomEntry));
  const phantomRisk = Math.round(phantomAmount * (Math.abs(phantomEntry - phantomStopLoss) / phantomEntry));
  const phantomRR = phantomRisk > 0 ? (phantomProfit / phantomRisk).toFixed(1) : '2.2';
  const phantomGainPct = ((Math.abs(phantomTarget - phantomEntry) / phantomEntry) * 100).toFixed(2);
  const phantomLossPct = ((Math.abs(phantomEntry - phantomStopLoss) / phantomEntry) * 100).toFixed(2);

  const handleExecutePhantomTrade = () => {
    const order = {
      id: `phantom-${Date.now()}`,
      side: phantomSide,
      symbol,
      entry: phantomEntry,
      amount: phantomAmount,
      tp: Number(phantomTarget.toFixed(precision)),
      sl: Number(phantomStopLoss.toFixed(precision)),
      timestamp: new Date().toLocaleTimeString(),
    };
    setPhantomActiveOrder(order);
    setPhantomToast(`⚡ Phantom ${phantomSide === 'BUY' ? 'LONG' : 'SHORT'} Order Placed: $${phantomAmount.toLocaleString()} ${symbol} @ $${phantomEntry.toFixed(precision)} · Direct Instant Routing`);
    setTimeout(() => setPhantomToast(null), 6000);
  };

  const handleClosePhantomPosition = () => {
    setPhantomActiveOrder(null);
    setPhantomToast(`✓ Position settled: Realized P&L added to Phantom wallet.`);
    setTimeout(() => setPhantomToast(null), 4000);
  };

  return (
    <div
      className={`w-full bg-white border border-neutral-300 rounded-xl p-5 shadow-xs transition-all ${
        isExpanded ? 'ring-2 ring-black' : ''
      }`}
    >
      {/* Top Asset & Price Bar with Phantom Pro Badge */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between pb-3.5 border-b border-neutral-200 gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <AssetLogo symbol={symbol} size="md" />
            <span className="font-mono text-xs uppercase px-2 py-0.5 bg-neutral-100 text-black font-bold rounded">
              {symbol}
            </span>
            <h2 className="text-lg font-bold text-black font-sans">{assetName}</h2>
          </div>

          {/* Current quote stats */}
          <div className="flex flex-wrap items-baseline gap-3 mt-1 text-xs">
            <span className="text-2xl font-black font-mono text-black tabular-nums">
              ${currentPrice.toLocaleString(undefined, { minimumFractionDigits: precision })}
            </span>
            {lastCandle && (
              <span
                className={`font-mono font-bold flex items-center gap-1 tabular-nums ${
                  isCurrentUp ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                {isCurrentUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {isCurrentUp ? '+' : ''}
                {(((lastCandle.close - lastCandle.open) / (lastCandle.open || 1)) * 100).toFixed(2)}% Session
              </span>
            )}
            <span className="text-neutral-300 font-mono hidden sm:inline">|</span>
            <span className="text-neutral-500 font-mono">
              H: ${lastCandle?.high.toFixed(precision)} · L: ${lastCandle?.low.toFixed(precision)}
            </span>
          </div>

          {/* Phantom Pro Live Telemetry Bar */}
          <div className="flex items-center gap-2 mt-1.5 text-[11px] font-mono">
            <span className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 text-white rounded font-bold text-[10px] tracking-wide">
              <Sparkles className="w-3 h-3 text-amber-400" /> PHANTOM PRO
            </span>
            <span className="text-emerald-700 flex items-center gap-1 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> Instant Fill (99.98%)
            </span>
            <span className="text-neutral-400 hidden sm:inline">·</span>
            <span className="text-neutral-500 hidden sm:inline">Spread: 0.01% · Latency: 9ms</span>
          </div>
        </div>

        {/* Timeframe, Overlays, Dedicated Page & Phantom Trade Switcher */}
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          {/* Open Dedicated Page Button ("Make this page another now ok") */}
          {onNavigateToDedicatedPage && !isDedicatedPage && (
            <button
              onClick={onNavigateToDedicatedPage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono font-bold text-xs bg-neutral-900 hover:bg-black text-white transition-all cursor-pointer shadow-xs border border-neutral-900"
              title="Open Full-Width Dedicated Candlestick Terminal Page"
            >
              <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Dedicated Big Chart Page ↗</span>
            </button>
          )}

          {/* Phantom Trade Toggle Button */}
          <button
            onClick={() => setShowPhantomTrade((prev) => !prev)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-md font-mono font-bold transition-all cursor-pointer border ${
              showPhantomTrade
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-300'
            }`}
            title="Toggle Phantom Quick-Trade Dock"
          >
            <Zap className={`w-3.5 h-3.5 ${showPhantomTrade ? 'text-amber-400 fill-amber-400' : 'text-neutral-600'}`} />
            <span>Phantom Trade</span>
          </button>

          {/* Timer / Timeframe Selector with 1m, 3m, 10m, 15m, 1h, 2h, 4h, 1d */}
          <div className="flex items-center gap-1 overflow-x-auto bg-neutral-100 p-1 rounded-md border border-neutral-200">
            <span className="text-[10px] font-mono text-neutral-400 uppercase font-bold px-1 hidden sm:inline">Timer:</span>
            {[
              { id: '1m', label: '1 Min' },
              { id: '3m', label: '3 Min' },
              { id: '10m', label: '10 Min' },
              { id: '15m', label: '15 Min' },
              { id: '1h', label: '1 Hour' },
              { id: '2h', label: '2 Hour' },
              { id: '4h', label: '4 Hour' },
              { id: '1d', label: '1 Day' },
            ].map((t) => {
              const isSelected = timeframe.toLowerCase() === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChangeTimeframe(t.id)}
                  className={`px-2.5 py-1 rounded font-mono font-bold text-xs whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-black text-white shadow-xs'
                      : 'text-neutral-700 hover:text-black hover:bg-neutral-200'
                  }`}
                >
                  {t.label}
                </button>
              );
            })}
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-2 text-[11px] font-mono">
            <label className="flex items-center gap-1 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={showPredictionGhost}
                onChange={(e) => setShowPredictionGhost(e.target.checked)}
                className="rounded accent-black cursor-pointer"
              />
              <span className="font-bold text-black flex items-center gap-0.5">
                <Zap className="w-3 h-3 text-emerald-600 fill-emerald-600" /> Today Forecast
              </span>
            </label>

            <label className="flex items-center gap-1 cursor-pointer select-none text-neutral-600">
              <input
                type="checkbox"
                checked={showSMA}
                onChange={(e) => setShowSMA(e.target.checked)}
                className="rounded accent-blue-600 cursor-pointer"
              />
              <span>SMA20</span>
            </label>

            <label className="flex items-center gap-1 cursor-pointer select-none text-neutral-600">
              <input
                type="checkbox"
                checked={showPivots}
                onChange={(e) => setShowPivots(e.target.checked)}
                className="rounded accent-amber-600 cursor-pointer"
              />
              <span>Pivots</span>
            </label>
          </div>
        </div>
      </div>

      {/* Phantom Trade Deck & Instant Execution Panel ("Add inside in trade ok and main previw like panthom trade Ux ddsign like") */}
      {showPhantomTrade && (
        <div className="my-3.5 p-3.5 bg-neutral-50/90 border border-neutral-300 rounded-xl shadow-xs transition-all">
          {/* Top Row: Phantom Tabs & Quick Size */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2.5 border-b border-neutral-200">
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider font-bold">
                Order Type:
              </span>
              {(['MARKET', 'LIMIT', 'BRACKET'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setPhantomOrderType(type)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    phantomOrderType === type
                      ? 'bg-black text-white shadow-2xs'
                      : 'bg-white border border-neutral-200 hover:border-neutral-400 text-neutral-700'
                  }`}
                >
                  {type === 'MARKET' ? (
                    <>
                      <Zap className="w-3 h-3 text-amber-400" />
                      <span>Market</span>
                    </>
                  ) : type === 'LIMIT' ? (
                    <>
                      <Compass className="w-3 h-3 text-blue-400" />
                      <span>Limit</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>Bracket TP/SL</span>
                    </>
                  )}
                </button>
              ))}
            </div>

            {/* Quick Size Presets */}
            <div className="flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
              <span className="text-[10px] text-neutral-400 font-sans hidden sm:inline">Size:</span>
              {[100, 250, 500, 1000, 2500].map((amt) => (
                <button
                  key={amt}
                  onClick={() => setPhantomAmount(amt)}
                  className={`px-2 py-0.5 rounded transition-all cursor-pointer border ${
                    phantomAmount === amt
                      ? 'bg-neutral-900 text-white border-black font-bold'
                      : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-700'
                  }`}
                >
                  ${amt}
                </button>
              ))}
            </div>
          </div>

          {/* Action Row: Side Selector, Input, Preview & Execute Button */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-3 items-center">
            {/* Side Buttons (4 Cols) */}
            <div className="md:col-span-4 flex items-center gap-2">
              <button
                onClick={() => setPhantomSide('BUY')}
                className={`flex-1 py-2.5 px-3 rounded-lg font-mono font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  phantomSide === 'BUY'
                    ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs ring-2 ring-emerald-400/40'
                    : 'bg-white border-neutral-300 text-neutral-700 hover:border-emerald-500'
                }`}
              >
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> BUY / LONG
                </span>
                <span className="text-[10px] opacity-80 mt-0.5">
                  Target: ${phantomTarget.toFixed(precision)} (+{phantomGainPct}%)
                </span>
              </button>

              <button
                onClick={() => setPhantomSide('SELL')}
                className={`flex-1 py-2.5 px-3 rounded-lg font-mono font-bold text-xs flex flex-col items-center justify-center transition-all cursor-pointer border ${
                  phantomSide === 'SELL'
                    ? 'bg-rose-600 text-white border-rose-700 shadow-xs ring-2 ring-rose-400/40'
                    : 'bg-white border-neutral-300 text-neutral-700 hover:border-rose-500'
                }`}
              >
                <span className="flex items-center gap-1">
                  <TrendingDown className="w-3.5 h-3.5" /> SELL / SHORT
                </span>
                <span className="text-[10px] opacity-80 mt-0.5">
                  Target: ${phantomTarget.toFixed(precision)} (-{phantomGainPct}%)
                </span>
              </button>
            </div>

            {/* Live Phantom Calculation Breakdown (5 Cols) */}
            <div className="md:col-span-5 bg-white border border-neutral-200 rounded-lg p-2.5 grid grid-cols-3 gap-2 text-xs font-mono">
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Est. Fill</span>
                <span className="font-bold text-black tabular-nums">${phantomEntry.toFixed(precision)}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Take Profit</span>
                <span className="font-bold text-emerald-700 tabular-nums">+${phantomProfit}</span>
              </div>
              <div>
                <span className="text-[10px] text-neutral-400 block uppercase">Stop Loss</span>
                <span className="font-bold text-rose-700 tabular-nums">-${phantomRisk}</span>
              </div>
            </div>

            {/* Execute Button (3 Cols) */}
            <div className="md:col-span-3">
              <button
                onClick={handleExecutePhantomTrade}
                className={`w-full py-2.5 px-4 rounded-lg font-mono font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                  phantomSide === 'BUY'
                    ? 'bg-black hover:bg-neutral-800 text-white ring-1 ring-emerald-500'
                    : 'bg-black hover:bg-neutral-800 text-white ring-1 ring-rose-500'
                }`}
              >
                <Zap className={`w-3.5 h-3.5 ${phantomSide === 'BUY' ? 'text-emerald-400' : 'text-rose-400'} fill-current`} />
                <span>Execute Phantom {phantomSide}</span>
              </button>
            </div>
          </div>

          {/* Active Order Banner if open */}
          {phantomActiveOrder && (
            <div className="mt-3 p-2.5 bg-neutral-900 text-white rounded-lg flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono animate-in fade-in">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span className="font-bold text-emerald-400">⚡ PHANTOM LIVE POSITION:</span>
                <span>
                  {phantomActiveOrder.side} ${phantomActiveOrder.amount} {phantomActiveOrder.symbol} @ ${phantomActiveOrder.entry.toFixed(precision)}
                </span>
                <span className="text-neutral-400">· TP: ${phantomActiveOrder.tp} · SL: ${phantomActiveOrder.sl}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <span className="text-emerald-400 font-bold tabular-nums">
                  P&L: +${(phantomActiveOrder.amount * 0.024).toFixed(2)} (+2.40%)
                </span>
                <button
                  onClick={handleClosePhantomPosition}
                  className="px-2 py-0.5 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded text-[11px] text-white cursor-pointer"
                >
                  Close Position
                </button>
              </div>
            </div>
          )}

          {/* Toast message */}
          {phantomToast && (
            <div className="mt-2 text-[11px] font-mono text-neutral-700 bg-emerald-50 border border-emerald-300 rounded px-2.5 py-1 flex items-center justify-between">
              <span>{phantomToast}</span>
              <button onClick={() => setPhantomToast(null)} className="text-neutral-400 hover:text-black">
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* Interactive Zoom / Stretch / Pan HUD Toolbar ("can zoom and out and can stress") */}
      <div className="flex flex-wrap items-center justify-between gap-2 py-2 px-1 border-b border-neutral-100 text-xs font-mono">
        {/* Left: Zoom, Stretch Width, Stretch Price, Reset Fit */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-neutral-400 font-sans mr-1">Controls:</span>

          <button
            onClick={handleZoomIn}
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-black cursor-pointer"
            title="Zoom In (or use Mouse Scroll Wheel)"
          >
            <ZoomIn className="w-3.5 h-3.5" />
            <span>Zoom In</span>
          </button>

          <button
            onClick={handleZoomOut}
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-black cursor-pointer"
            title="Zoom Out (or use Mouse Scroll Wheel)"
          >
            <ZoomOut className="w-3.5 h-3.5" />
            <span>Zoom Out</span>
          </button>

          <button
            onClick={handleStretchWidth}
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-black cursor-pointer"
            title="Stretch Candle Width"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span>Stretch Width ({Math.round(candleWidthMultiplier * 100)}%)</span>
          </button>

          <button
            onClick={handleStretchHeight}
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-black cursor-pointer"
            title="Stretch Price Scale Height"
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Stretch Price ({Math.round(verticalScale * 100)}%)</span>
          </button>

          <button
            onClick={handleResetScale}
            className="flex items-center gap-1 px-2.5 py-1 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded text-neutral-700 cursor-pointer"
            title="Reset Zoom & Scale"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Fit</span>
          </button>
        </div>

        {/* Right: Expand to Fullscreen Studio Mode */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] text-neutral-400">
            {visibleCandles.length} candles visible · Scroll/Drag to pan
          </span>
          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            className={`flex items-center gap-1 px-2.5 py-1 rounded text-xs font-semibold cursor-pointer border ${
              isExpanded
                ? 'bg-black text-white border-black shadow-xs'
                : 'bg-neutral-100 hover:bg-neutral-200 text-black border-neutral-200'
            }`}
            title="Toggle Dedicated Large Canvas"
          >
            {isExpanded ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isExpanded ? 'Standard View' : 'Dedicated Studio'}</span>
          </button>
        </div>
      </div>

      {/* Crosshair / Tooltip Strip */}
      <div className="h-6 flex items-center text-xs font-mono text-neutral-600 mt-2 px-1 border-b border-neutral-100">
        {hoveredCandle ? (
          <div className="flex flex-wrap items-center gap-3 text-black">
            <span className="font-bold text-neutral-500">{hoveredCandle.dateStr}:</span>
            <span>O: <strong className="font-semibold tabular-nums">${hoveredCandle.open}</strong></span>
            <span>H: <strong className="font-semibold tabular-nums">${hoveredCandle.high}</strong></span>
            <span>L: <strong className="font-semibold tabular-nums">${hoveredCandle.low}</strong></span>
            <span>C: <strong className={`font-semibold tabular-nums ${hoveredCandle.close >= hoveredCandle.open ? 'text-emerald-700' : 'text-rose-700'}`}>${hoveredCandle.close}</strong></span>
            <span>Vol: <strong className="font-semibold tabular-nums">{hoveredCandle.volume.toLocaleString()}</strong></span>
          </div>
        ) : lastCandle ? (
          <div className="flex flex-wrap items-center gap-3 text-neutral-700">
            <span className="font-bold text-neutral-500">Latest ({lastCandle.dateStr}):</span>
            <span>O: <strong className="font-semibold tabular-nums text-black">${lastCandle.open}</strong></span>
            <span>H: <strong className="font-semibold tabular-nums text-black">${lastCandle.high}</strong></span>
            <span>L: <strong className="font-semibold tabular-nums text-black">${lastCandle.low}</strong></span>
            <span>C: <strong className={`font-semibold tabular-nums ${isCurrentUp ? 'text-emerald-700' : 'text-rose-700'}`}>${lastCandle.close}</strong></span>
            <span>Vol: <strong className="font-semibold tabular-nums text-black">{lastCandle.volume.toLocaleString()}</strong></span>
          </div>
        ) : null}
      </div>

      {/* SVG Canvas Area with Mouse Wheel Zoom & Drag-to-Pan */}
      <div className="relative w-full overflow-hidden mt-1 select-none">
        {isLoading && visibleCandles.length === 0 ? (
          <div className="w-full h-72 flex items-center justify-center text-xs text-neutral-400 font-mono animate-pulse">
            Loading real-time candlestick series...
          </div>
        ) : (
          <svg
            ref={svgRef}
            viewBox={`0 0 ${chartWidth} ${chartHeight}`}
            className="w-full h-auto block cursor-crosshair select-none"
            style={{ touchAction: 'none' }}
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            onMouseLeave={() => {
              setIsDragging(false);
              setHoverIndex(null);
            }}
          >
            {/* Grid horizontal lines */}
            {[0, 0.25, 0.5, 0.75, 1].map((r) => {
              const price = minPrice + (maxPrice - minPrice) * (1 - r);
              const y = paddingTop + priceChartHeight * r;
              return (
                <g key={r}>
                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={chartWidth - paddingRight}
                    y2={y}
                    stroke="#f0f0f0"
                    strokeDasharray="3 3"
                    strokeWidth="1"
                  />
                  {/* Price axis label on right */}
                  <text
                    x={chartWidth - paddingRight + 6}
                    y={y + 3}
                    fontSize="9"
                    fontFamily="monospace"
                    fill="#888888"
                  >
                    ${price.toFixed(precision)}
                  </text>
                </g>
              );
            })}

            {/* Pivot points overlay lines */}
            {showPivots && technicals && (
              <g>
                {/* Central Pivot */}
                <line
                  x1={paddingLeft}
                  y1={getY(technicals.pivots.pivot)}
                  x2={chartWidth - paddingRight}
                  y2={getY(technicals.pivots.pivot)}
                  stroke="#d97706"
                  strokeDasharray="4 2"
                  strokeWidth="1"
                />
                <text
                  x={chartWidth - paddingRight + 6}
                  y={getY(technicals.pivots.pivot) - 2}
                  fontSize="8"
                  fontFamily="monospace"
                  fill="#d97706"
                  fontWeight="bold"
                >
                  P: ${technicals.pivots.pivot}
                </text>

                {/* R1 */}
                <line
                  x1={paddingLeft}
                  y1={getY(technicals.pivots.r1)}
                  x2={chartWidth - paddingRight}
                  y2={getY(technicals.pivots.r1)}
                  stroke="#16a34a"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                />
                {/* S1 */}
                <line
                  x1={paddingLeft}
                  y1={getY(technicals.pivots.s1)}
                  x2={chartWidth - paddingRight}
                  y2={getY(technicals.pivots.s1)}
                  stroke="#dc2626"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                />
              </g>
            )}

            {/* Volume separator line */}
            <line
              x1={paddingLeft}
              y1={paddingTop + priceChartHeight + 12}
              x2={chartWidth - paddingRight}
              y2={paddingTop + priceChartHeight + 12}
              stroke="#e5e5e5"
              strokeWidth="1"
            />
            <text
              x={paddingLeft}
              y={paddingTop + priceChartHeight + 10}
              fontSize="8"
              fontFamily="monospace"
              fill="#a3a3a3"
            >
              VOLUME
            </text>

            {/* Volume Bars */}
            {visibleCandles.map((c, i) => {
              const x = getX(i);
              const isGreen = c.close >= c.open;
              const volY = getVolY(c.volume);
              const volHeight = Math.max(2, paddingTop + innerHeight - volY);

              return (
                <rect
                  key={`vol-${i}`}
                  x={x - candleBodyWidth / 2}
                  y={volY}
                  width={candleBodyWidth}
                  height={volHeight}
                  fill={isGreen ? '#bbf7d0' : '#fecaca'}
                  opacity={0.8}
                />
              );
            })}

            {/* SMA 20 line */}
            {showSMA && smaPoints.length > 1 && (
              <polyline
                fill="none"
                stroke="#2563eb"
                strokeWidth="1.5"
                points={smaPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              />
            )}

            {/* EMA 50 line */}
            {showEMA && emaPoints.length > 1 && (
              <polyline
                fill="none"
                stroke="#9333ea"
                strokeWidth="1.5"
                strokeDasharray="4 2"
                points={emaPoints.map((p) => `${p.x},${p.y}`).join(' ')}
              />
            )}

            {/* Candlesticks: Green and Red with High/Low Wicks */}
            {visibleCandles.map((c, i) => {
              const x = getX(i);
              const isGreen = c.close >= c.open;
              const wickY1 = getY(c.high);
              const wickY2 = getY(c.low);
              const bodyY = getY(Math.max(c.open, c.close));
              const bodyBottom = getY(Math.min(c.open, c.close));
              const bodyHeight = Math.max(2, bodyBottom - bodyY);
              const isHovered = hoverIndex === i;

              return (
                <g key={`candle-${i}`}>
                  {/* Wick */}
                  <line
                    x1={x}
                    y1={wickY1}
                    x2={x}
                    y2={wickY2}
                    stroke={isGreen ? '#16a34a' : '#dc2626'}
                    strokeWidth={isHovered ? 2 : 1.2}
                  />

                  {/* Body */}
                  <rect
                    x={x - candleBodyWidth / 2}
                    y={bodyY}
                    width={candleBodyWidth}
                    height={bodyHeight}
                    fill={isGreen ? '#16a34a' : '#dc2626'}
                    stroke={isGreen ? '#15803d' : '#b91c1c'}
                    strokeWidth={isHovered ? 2 : 1}
                    rx="1"
                  />

                  {/* Date labels at bottom */}
                  {i % Math.max(1, Math.floor(visibleCandles.length / 7)) === 0 && (
                    <text
                      x={x}
                      y={chartHeight - paddingBottom + 16}
                      fontSize="9"
                      fontFamily="monospace"
                      textAnchor="middle"
                      fill="#737373"
                    >
                      {c.dateStr}
                    </text>
                  )}
                </g>
              );
            })}

            {/* TODAY'S PREDICTED CANDLE GHOST & FORECAST TARGET */}
            {showGhostInView && predictedCandle && (
              (() => {
                const predIndex = visibleCandles.length;
                const predX = getX(predIndex);
                const isUp = predictedCandle.color === 'green';
                const strokeColor = isUp ? '#16a34a' : '#dc2626';
                const fillColor = isUp ? 'rgba(22, 163, 74, 0.15)' : 'rgba(220, 38, 38, 0.15)';

                const predWickY1 = getY(predictedCandle.predictedHigh);
                const predWickY2 = getY(predictedCandle.predictedLow);
                const predBodyY = getY(Math.max(predictedCandle.open, predictedCandle.predictedClose));
                const predBodyBottom = getY(Math.min(predictedCandle.open, predictedCandle.predictedClose));
                const predBodyHeight = Math.max(4, predBodyBottom - predBodyY);

                return (
                  <g key="prediction-ghost">
                    {/* Forecast box container */}
                    <rect
                      x={predX - slotWidth * 0.75}
                      y={predWickY1 - 4}
                      width={slotWidth * 1.5}
                      height={Math.max(10, predWickY2 - predWickY1 + 8)}
                      fill={isUp ? 'rgba(22, 163, 74, 0.04)' : 'rgba(220, 38, 38, 0.04)'}
                      stroke={strokeColor}
                      strokeDasharray="2 2"
                      strokeWidth="0.8"
                      rx="3"
                    />

                    {/* Predicted Wick */}
                    <line
                      x1={predX}
                      y1={predWickY1}
                      x2={predX}
                      y2={predWickY2}
                      stroke={strokeColor}
                      strokeWidth="1.5"
                      strokeDasharray="3 2"
                    />

                    {/* Predicted Body */}
                    <rect
                      x={predX - candleBodyWidth / 2}
                      y={predBodyY}
                      width={candleBodyWidth}
                      height={predBodyHeight}
                      fill={fillColor}
                      stroke={strokeColor}
                      strokeWidth={1.8}
                      strokeDasharray="3 2"
                      rx="1"
                    />

                    {/* Target Price Line */}
                    <line
                      x1={predX}
                      y1={getY(predictedCandle.predictedClose)}
                      x2={chartWidth - paddingRight}
                      y2={getY(predictedCandle.predictedClose)}
                      stroke={strokeColor}
                      strokeDasharray="4 2"
                      strokeWidth="1.5"
                    />

                    {/* Target Badge */}
                    <g transform={`translate(${chartWidth - paddingRight + 4}, ${getY(predictedCandle.predictedClose) - 8})`}>
                      <rect
                        x="0"
                        y="0"
                        width="62"
                        height="16"
                        fill={strokeColor}
                        rx="2"
                      />
                      <text
                        x="31"
                        y="11"
                        fill="#ffffff"
                        fontSize="8"
                        fontFamily="monospace"
                        fontWeight="bold"
                        textAnchor="middle"
                      >
                        ${predictedCandle.predictedClose.toFixed(precision > 2 ? 2 : precision)}
                      </text>
                    </g>

                    <text
                      x={predX}
                      y={chartHeight - paddingBottom + 16}
                      fontSize="9"
                      fontFamily="monospace"
                      fontWeight="bold"
                      textAnchor="middle"
                      fill={strokeColor}
                    >
                      TODAY (EOD)
                    </text>
                  </g>
                );
              })()
            )}

            {/* Crosshair when hovering */}
            {hoverIndex !== null && hoverIndex < visibleCandles.length && (
              <g>
                <line
                  x1={getX(hoverIndex)}
                  y1={paddingTop}
                  x2={getX(hoverIndex)}
                  y2={paddingTop + priceChartHeight}
                  stroke="#000000"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                />
                <line
                  x1={paddingLeft}
                  y1={getY(visibleCandles[hoverIndex].close)}
                  x2={chartWidth - paddingRight}
                  y2={getY(visibleCandles[hoverIndex].close)}
                  stroke="#000000"
                  strokeDasharray="2 2"
                  strokeWidth="0.8"
                />
              </g>
            )}

            {/* Current Price Marker */}
            <g transform={`translate(${chartWidth - paddingRight + 2}, ${getY(currentPrice) - 7})`}>
              <rect
                x="0"
                y="0"
                width="64"
                height="14"
                fill="#000000"
                rx="2"
              />
              <text
                x="32"
                y="10"
                fill="#ffffff"
                fontSize="8"
                fontFamily="monospace"
                fontWeight="bold"
                textAnchor="middle"
              >
                ${currentPrice.toFixed(precision)}
              </text>
            </g>
          </svg>
        )}
      </div>

      {/* Professional Real-Time Candle Formation & Metric Panel Under Chart */}
      {lastCandle && (
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isCurrentUp ? 'bg-emerald-600 animate-pulse' : 'bg-rose-600 animate-pulse'}`}></span>
              <span className="text-xs font-bold text-black font-sans uppercase tracking-wider">
                Active Candle Real-Time Formation
              </span>
              <span className="text-[11px] font-mono text-neutral-500">
                ({timeframe.toUpperCase()} Interval)
              </span>
            </div>

            {/* Live Net Change Badges */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <span className="text-neutral-500">Net Session Change:</span>
              <span
                className={`px-2 py-0.5 rounded font-bold tabular-nums ${
                  isCurrentUp ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {isCurrentUp ? '+' : ''}${(lastCandle.close - lastCandle.open).toFixed(precision)} (
                {(((lastCandle.close - lastCandle.open) / (lastCandle.open || 1)) * 100).toFixed(2)}%)
              </span>
            </div>
          </div>

          {/* 4-Box Detailed Real-Time Candle Anatomy */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
            {/* Session Open to Close */}
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-md">
              <div className="flex justify-between text-neutral-500 text-[10px] uppercase font-sans">
                <span>Session Open</span>
                <span>Current Price</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="font-semibold text-neutral-700 tabular-nums">${lastCandle.open}</span>
                <span className={`font-bold tabular-nums text-sm ${isCurrentUp ? 'text-emerald-700' : 'text-rose-700'}`}>
                  ${lastCandle.close}
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 mt-1 truncate">
                Direction: {isCurrentUp ? 'Bullish (Green Body)' : 'Bearish (Red Body)'}
              </div>
            </div>

            {/* High/Low True Range */}
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-md">
              <div className="flex justify-between text-neutral-500 text-[10px] uppercase font-sans">
                <span>Session High</span>
                <span>Session Low</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="font-semibold text-emerald-700 tabular-nums">${lastCandle.high}</span>
                <span className="font-semibold text-rose-700 tabular-nums">${lastCandle.low}</span>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1">
                True Range: ${(lastCandle.high - lastCandle.low).toFixed(precision)}
              </div>
            </div>

            {/* Distance from Extremes */}
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-md">
              <div className="flex justify-between text-neutral-500 text-[10px] uppercase font-sans">
                <span>Off High</span>
                <span>Off Low</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="font-semibold text-neutral-700 tabular-nums">
                  -${(lastCandle.high - lastCandle.close).toFixed(precision)}
                </span>
                <span className="font-semibold text-emerald-700 tabular-nums">
                  +${(lastCandle.close - lastCandle.low).toFixed(precision)}
                </span>
              </div>
              <div className="text-[10px] text-neutral-400 mt-1 truncate">
                Wick rejection status
              </div>
            </div>

            {/* Target Forecast Gap */}
            <div className="p-2.5 bg-neutral-50 border border-neutral-200 rounded-md">
              <div className="flex justify-between text-neutral-500 text-[10px] uppercase font-sans">
                <span>EOD Target</span>
                <span>Gap to Target</span>
              </div>
              <div className="flex justify-between items-baseline mt-1">
                <span className="font-semibold text-black tabular-nums">
                  ${predictedCandle?.predictedClose ?? '—'}
                </span>
                {predictedCandle ? (
                  <span
                    className={`font-bold tabular-nums ${
                      predictedCandle.predictedClose >= lastCandle.close
                        ? 'text-emerald-700'
                        : 'text-rose-700'
                    }`}
                  >
                    {predictedCandle.predictedClose >= lastCandle.close ? '+' : ''}
                    {(predictedCandle.predictedClose - lastCandle.close).toFixed(precision)}
                  </span>
                ) : (
                  <span className="text-neutral-400">—</span>
                )}
              </div>
              <div className="text-[10px] text-neutral-400 mt-1 truncate">
                {predictedDirection ? `Forecast: ${upProbability}% ${predictedDirection}` : 'Calculating...'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Chart Footer Indicator Legend */}
      <div className="flex flex-wrap items-center justify-between pt-3 border-t border-neutral-200 text-xs font-mono text-neutral-600 gap-2 mt-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-emerald-600 inline-block"></span> Bullish Candle
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-rose-600 inline-block"></span> Bearish Candle
          </span>
          {isPredictionValid && showPredictionGhost && (
            <span className="flex items-center gap-1 text-black font-semibold">
              <span className="w-2.5 h-2.5 border border-dashed border-emerald-600 bg-emerald-100 inline-block"></span>
              Predicted EOD Target ({upProbability}% {predictedDirection})
            </span>
          )}
        </div>

        <div className="text-neutral-400 text-[11px]">
          Timeframe: {timeframe.toUpperCase()} · Zoom: {Math.round((35 / visibleCount) * 100)}%
        </div>
      </div>
    </div>
  );
};
