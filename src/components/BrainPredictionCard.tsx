/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrainPrediction } from '../types.js';
import {
  TrendingUp,
  TrendingDown,
  Cpu,
  Layers,
  Sparkles,
  Info,
  Flame,
  Zap,
  Activity,
} from 'lucide-react';

interface BrainPredictionCardProps {
  prediction: BrainPrediction | null;
  isLoading: boolean;
}

export const BrainPredictionCard: React.FC<BrainPredictionCardProps> = ({
  prediction,
  isLoading,
}) => {
  if (isLoading || !prediction) {
    return (
      <div className="w-full glass-card rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-6 h-6 bg-neutral-200 rounded-lg"></div>
          <div className="w-64 h-6 bg-neutral-200 rounded-lg"></div>
        </div>
        <div className="w-full h-24 bg-neutral-100/70 rounded-xl mb-4"></div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 bg-neutral-100/70 rounded-xl"></div>
          ))}
        </div>
      </div>
    );
  }

  const isUp = prediction.direction === 'UP';
  const factors = prediction.brainFactors;
  const candle = prediction.predictedCandle;

  return (
    <div className="w-full glass-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-neutral-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
            <Cpu className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-black text-black font-sans tracking-tight">
              Inside Calculation Brain • Today's Candle Direction
            </h2>
            <p className="text-[11px] text-neutral-500 font-mono">
              Multi-factor AI order book, technical trend & sentiment synthesis engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-black text-white font-black rounded-lg text-[11px] tracking-wide uppercase">
            CONFIDENCE: {prediction.confidence}
          </span>
          <span className="text-neutral-400 font-semibold">{prediction.timestamp}</span>
        </div>
      </div>

      {/* Primary Direction Verdict Banner with Glassmorphism */}
      <div
        className={`p-5 rounded-xl border flex flex-col md:flex-row md:items-center justify-between gap-5 transition-all ${
          isUp ? 'glass-emerald text-emerald-950 shadow-xs' : 'glass-rose text-rose-950 shadow-xs'
        }`}
      >
        <div className="flex items-start sm:items-center gap-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white shrink-0 shadow-md ${
              isUp ? 'bg-emerald-600 ring-4 ring-emerald-500/20' : 'bg-rose-600 ring-4 ring-rose-500/20'
            }`}
          >
            {isUp ? <TrendingUp className="w-8 h-8 stroke-[2.5]" /> : <TrendingDown className="w-8 h-8 stroke-[2.5]" />}
          </div>

          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs uppercase font-mono tracking-wider font-extrabold text-neutral-800">
                Today's Daily Candle Forecast
              </span>
              <span className={`px-3 py-1 rounded-lg text-xs font-mono font-black shadow-2xs tracking-wide flex items-center gap-1.5 ${
                isUp ? 'bg-emerald-700 text-white' : 'bg-rose-700 text-white'
              }`}>
                {isUp ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                <span>{isUp ? 'BUY / LONG SIGNAL' : 'SELL / SHORT SIGNAL'}</span>
              </span>

              {/* Candle Movement Scale */}
              <span className="px-2.5 py-1 rounded-lg text-[11px] font-mono font-black bg-neutral-950 text-amber-300 border border-neutral-800 shadow-2xs flex items-center gap-1">
                {Math.abs(candle.predictedChangePercent) >= 3.0 ? (
                  <>
                    <Flame className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>BIG MOVEMENT (STRONG SPIKE)</span>
                  </>
                ) : Math.abs(candle.predictedChangePercent) >= 1.2 ? (
                  <>
                    <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>MODERATE MOVEMENT (GROWTH)</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-3.5 h-3.5 text-blue-400" />
                    <span>SMALL MOVEMENT (CONSOLIDATION)</span>
                  </>
                )}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-black flex items-center gap-2">
              {isUp ? <TrendingUp className="w-7 h-7 text-emerald-600" /> : <TrendingDown className="w-7 h-7 text-rose-600" />}
              <span>{isUp ? 'CLOSES UP (GREEN CANDLE)' : 'CLOSES DOWN (RED CANDLE)'}</span>
            </div>

            <div className="text-xs sm:text-sm font-medium text-neutral-800 flex flex-wrap items-center gap-2 pt-0.5">
              <span>Target EOD Close: <strong className="font-mono font-black text-black text-sm sm:text-base">${candle.predictedClose}</strong></span>
              <span className="text-neutral-400 font-bold">·</span>
              <span className={`font-mono font-black text-sm px-2 py-0.5 rounded ${
                candle.predictedChangePercent >= 0 ? 'bg-emerald-200/80 text-emerald-900' : 'bg-rose-200/80 text-rose-900'
              }`}>
                {candle.predictedChangePercent >= 0 ? '+' : ''}{candle.predictedChangePercent}% EOD Target
              </span>
              <span className="text-neutral-400 font-bold">·</span>
              <span className="text-neutral-600 font-mono font-bold">
                Range: ${candle.predictedLow} – ${candle.predictedHigh}
              </span>
            </div>
          </div>
        </div>

        {/* Direction Probability Metric */}
        <div className="text-left md:text-right shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-neutral-300/60 bg-white/60 md:bg-transparent p-3 md:p-0 rounded-xl">
          <div className="text-xs font-mono font-black uppercase text-neutral-600 tracking-wider">
            DIRECTION PROBABILITY
          </div>
          <div className="text-4xl sm:text-5xl font-black font-mono tracking-tight tabular-nums text-black my-0.5">
            {isUp ? prediction.upProbability : prediction.downProbability}%
          </div>
          <div className="text-xs font-mono font-bold text-neutral-700">
            {isUp ? `Downside buffer: ${prediction.downProbability}%` : `Upside potential: ${prediction.upProbability}%`}
          </div>
        </div>
      </div>

      {/* Visual Glass Probability Split Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono font-bold">
          <span className="text-emerald-700 flex items-center gap-1 font-black">
            ▲ Up (Green Candle): {prediction.upProbability}%
          </span>
          <span className="text-rose-700 flex items-center gap-1 font-black">
            ▼ Down (Red Candle): {prediction.downProbability}%
          </span>
        </div>
        <div className="w-full h-3 bg-neutral-100 rounded-full overflow-hidden flex p-0.5 border border-neutral-200/80 shadow-inner">
          <div
            className="h-full bg-emerald-600 rounded-l-full transition-all duration-500"
            style={{ width: `${prediction.upProbability}%` }}
          ></div>
          <div
            className="h-full bg-rose-600 rounded-r-full transition-all duration-500"
            style={{ width: `${prediction.downProbability}%` }}
          ></div>
        </div>
      </div>

      {/* Session Range & Invalidation Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
        <div className="p-3.5 glass-panel rounded-xl">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans font-bold">Session Open</span>
          <span className="text-base font-black text-black tabular-nums">${candle.open}</span>
        </div>

        <div className="p-3.5 glass-panel rounded-xl">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans font-bold">Predicted High</span>
          <span className="text-base font-black text-emerald-700 tabular-nums">${candle.predictedHigh}</span>
        </div>

        <div className="p-3.5 glass-panel rounded-xl">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans font-bold">Predicted Low</span>
          <span className="text-base font-black text-rose-700 tabular-nums">${candle.predictedLow}</span>
        </div>

        <div className="p-3.5 glass-panel rounded-xl">
          <span className="text-neutral-500 block text-[10px] uppercase font-sans font-bold">Invalidation Level</span>
          <span className="text-base font-black text-black tabular-nums">${prediction.tradeSetup.invalidationLevel}</span>
        </div>
      </div>

      {/* 4 Inside Calculation Brain Drivers */}
      <div className="space-y-2">
        <div className="flex items-center gap-1.5 text-xs font-black text-black uppercase tracking-wider font-mono">
          <Layers className="w-4 h-4 text-black" /> Inside Calculation Brain Breakdown
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          {/* News Sentiment */}
          <div className="p-3.5 glass-panel rounded-xl">
            <div className="flex justify-between items-center text-neutral-700">
              <span className="font-sans font-bold">News Sentiment</span>
              <span className={`font-black text-sm tabular-nums ${factors.newsSentimentScore >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {factors.newsSentimentScore >= 0 ? '+' : ''}{factors.newsSentimentScore}
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200/80 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${factors.newsSentimentScore >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}
                style={{ width: `${Math.min(100, Math.abs(factors.newsSentimentScore))}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-neutral-500 font-bold mt-1.5 truncate">
              {prediction.newsSentiments.length} reports verified
            </div>
          </div>

          {/* Technical Trend */}
          <div className="p-3.5 glass-panel rounded-xl">
            <div className="flex justify-between items-center text-neutral-700">
              <span className="font-sans font-bold">Technical Trend</span>
              <span className={`font-black text-sm tabular-nums ${factors.technicalMomentumScore >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {factors.technicalMomentumScore >= 0 ? '+' : ''}{factors.technicalMomentumScore}
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200/80 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${factors.technicalMomentumScore >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}
                style={{ width: `${Math.min(100, Math.abs(factors.technicalMomentumScore))}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-neutral-500 font-bold mt-1.5 truncate">
              RSI: {prediction.technicals.rsi14} · {prediction.technicals.trend}
            </div>
          </div>

          {/* Google Trends Index */}
          <div className="p-3.5 glass-panel rounded-xl">
            <div className="flex justify-between items-center text-neutral-700">
              <span className="font-sans font-bold">Google Trend Index</span>
              <span className="font-black text-sm text-black tabular-nums">
                {factors.googleTrendsScore}/100
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200/80 rounded-full mt-2 overflow-hidden">
              <div
                className="h-full bg-black"
                style={{ width: `${factors.googleTrendsScore}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-neutral-500 font-bold mt-1.5 truncate">
              Velocity: {prediction.googleTrends?.searchVelocityPct}
            </div>
          </div>

          {/* Order Flow / Liquidity Ratio */}
          <div className="p-3.5 glass-panel rounded-xl">
            <div className="flex justify-between items-center text-neutral-700">
              <span className="font-sans font-bold">Order Flow Ratio</span>
              <span className={`font-black text-sm tabular-nums ${factors.orderFlowScore >= 0 ? 'text-emerald-700' : 'text-rose-700'}`}>
                {factors.orderFlowScore >= 0 ? '+' : ''}{factors.orderFlowScore}
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200/80 rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full ${factors.orderFlowScore >= 0 ? 'bg-emerald-600' : 'bg-rose-600'}`}
                style={{ width: `${Math.min(100, Math.abs(factors.orderFlowScore))}%` }}
              ></div>
            </div>
            <div className="text-[10px] text-neutral-500 font-bold mt-1.5 truncate">
              {prediction.googleTrade?.bidAskPressure.ratio}
            </div>
          </div>
        </div>
      </div>

      {/* Synthesis Reasoning Box */}
      <div className="p-4 glass-panel rounded-xl text-xs text-neutral-900 leading-relaxed font-sans border border-neutral-200/90">
        <div className="font-black text-black mb-1.5 flex items-center gap-2 text-xs font-mono uppercase tracking-wide">
          <Info className="w-4 h-4 text-black" />
          <span>Brain Synthesis & Core Rationale:</span>
        </div>
        <p className="font-medium text-neutral-800 leading-relaxed">{factors.summaryText}</p>
        {factors.catalysts && factors.catalysts.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5 items-center">
            <span className="text-[10px] text-neutral-500 uppercase font-mono font-bold">Primary Catalysts:</span>
            {factors.catalysts.map((cat, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 bg-white border border-neutral-300/80 rounded-lg text-[11px] font-mono font-bold text-neutral-950 shadow-2xs"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
