/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { TechnicalIndicators } from '../types.js';
import { SlidersHorizontal, ArrowUpDown } from 'lucide-react';

interface TechnicalsCardProps {
  technicals?: TechnicalIndicators;
  precision: number;
}

export const TechnicalsCard: React.FC<TechnicalsCardProps> = ({
  technicals,
  precision,
}) => {
  if (!technicals) return null;

  return (
    <div className="w-full glass-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-black font-sans tracking-tight">
            Technical Momentum & Floor Pivots
          </h2>
        </div>
        <span className="text-xs font-mono font-bold text-neutral-500">Automated Technicals</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-xs font-mono">
        {/* Left: RSI & Moving Averages */}
        <div className="space-y-3">
          {/* RSI 14 */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-neutral-700 font-sans font-semibold">Relative Strength Index (RSI 14)</span>
              <span
                className={`font-bold tabular-nums ${
                  technicals.rsi14 >= 70
                    ? 'text-rose-700'
                    : technicals.rsi14 <= 30
                    ? 'text-emerald-700'
                    : 'text-black'
                }`}
              >
                {technicals.rsi14} ({technicals.rsiSignal})
              </span>
            </div>
            <div className="w-full h-2 bg-neutral-200 rounded-full overflow-hidden flex">
              <div
                className={`h-full ${
                  technicals.rsi14 >= 70
                    ? 'bg-rose-600'
                    : technicals.rsi14 <= 30
                    ? 'bg-emerald-600'
                    : 'bg-black'
                }`}
                style={{ width: `${technicals.rsi14}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-neutral-400 mt-1">
              <span>0 (Oversold)</span>
              <span>50 (Neutral)</span>
              <span>100 (Overbought)</span>
            </div>
          </div>

          {/* Moving Averages Trend */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-neutral-700 font-sans font-semibold">Moving Averages Alignment</span>
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                  technicals.trend === 'BULLISH'
                    ? 'bg-emerald-100 text-emerald-800'
                    : technicals.trend === 'BEARISH'
                    ? 'bg-rose-100 text-rose-800'
                    : 'bg-neutral-200 text-neutral-800'
                }`}
              >
                {technicals.trend} TREND
              </span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-neutral-500 block text-[10px]">SMA 20 (Fast)</span>
                <span className="font-bold text-black tabular-nums">${technicals.sma20}</span>
              </div>
              <div>
                <span className="text-neutral-500 block text-[10px]">EMA 50 (Slow)</span>
                <span className="font-bold text-black tabular-nums">${technicals.ema50}</span>
              </div>
            </div>
          </div>

          {/* MACD */}
          <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
            <div className="flex justify-between items-center mb-1">
              <span className="text-neutral-700 font-sans font-semibold">MACD (12, 26, 9)</span>
              <span
                className={`font-bold tabular-nums ${
                  technicals.macd.histogram >= 0 ? 'text-emerald-700' : 'text-rose-700'
                }`}
              >
                Histogram: {technicals.macd.histogram}
              </span>
            </div>
            <div className="text-[11px] text-neutral-500">
              MACD: <strong className="text-black tabular-nums">{technicals.macd.macd}</strong> · Signal:{' '}
              <strong className="text-black tabular-nums">{technicals.macd.signal}</strong>
            </div>
          </div>
        </div>

        {/* Right: Floor Pivot Points */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <div className="font-sans font-semibold text-neutral-900 mb-2.5 flex items-center gap-1.5">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-700" />
            <span>Floor Pivot Key Levels</span>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between p-2 bg-white rounded border border-neutral-200">
              <span className="text-rose-700 font-bold">Resistance 2 (R2)</span>
              <span className="text-black font-semibold tabular-nums">${technicals.pivots.r2}</span>
            </div>

            <div className="flex justify-between p-2 bg-white rounded border border-neutral-200">
              <span className="text-rose-600 font-semibold">Resistance 1 (R1)</span>
              <span className="text-black font-semibold tabular-nums">${technicals.pivots.r1}</span>
            </div>

            <div className="flex justify-between p-2 bg-amber-50 rounded border border-amber-300">
              <span className="text-amber-800 font-bold">Daily Pivot (P)</span>
              <span className="text-black font-black tabular-nums">${technicals.pivots.pivot}</span>
            </div>

            <div className="flex justify-between p-2 bg-white rounded border border-neutral-200">
              <span className="text-emerald-600 font-semibold">Support 1 (S1)</span>
              <span className="text-black font-semibold tabular-nums">${technicals.pivots.s1}</span>
            </div>

            <div className="flex justify-between p-2 bg-white rounded border border-neutral-200">
              <span className="text-emerald-700 font-bold">Support 2 (S2)</span>
              <span className="text-black font-semibold tabular-nums">${technicals.pivots.s2}</span>
            </div>
          </div>

          <div className="text-[11px] text-neutral-500 mt-3 pt-2 border-t border-neutral-200 flex justify-between">
            <span>Average True Range (ATR 14):</span>
            <strong className="text-black tabular-nums">${technicals.atr}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
