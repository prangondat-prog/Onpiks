/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GoogleTrendAnalytics } from '../types.js';
import { LineChart, Search, Globe2, Flame, Users, ArrowUp, ExternalLink } from 'lucide-react';

interface GoogleAnalyticsTrendsCardProps {
  analytics?: GoogleTrendAnalytics;
  symbol: string;
}

export const GoogleAnalyticsTrendsCard: React.FC<GoogleAnalyticsTrendsCardProps> = ({
  analytics,
  symbol,
}) => {
  if (!analytics) {
    return (
      <div className="w-full glass-card rounded-2xl p-6 shadow-sm animate-pulse">
        <div className="h-6 bg-neutral-200 rounded-lg w-1/2 mb-3"></div>
        <div className="h-24 bg-neutral-100 rounded-xl"></div>
      </div>
    );
  }

  return (
    <div className="w-full glass-card rounded-2xl p-6 shadow-sm hover:shadow-md transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-200/80 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-black text-white flex items-center justify-center font-bold shadow-xs">
            <LineChart className="w-4 h-4" />
          </div>
          <h2 className="text-base font-black text-black font-sans tracking-tight">
            Google Trends & Search Query Analytics
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="px-3 py-1 bg-black text-white font-black rounded-lg text-[11px] tracking-wide uppercase">
            STATUS: {analytics.sentimentStatus}
          </span>
        </div>
      </div>

      {/* Top 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 my-4">
        {/* Search Interest Meter */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span className="flex items-center gap-1 font-medium font-sans">
              <Search className="w-3.5 h-3.5" /> Search Volume
            </span>
            <span className="font-mono text-[10px]">Google Search</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-black tabular-nums">
              {analytics.searchInterestScore}
            </span>
            <span className="text-xs text-neutral-500 font-mono">/ 100</span>
          </div>
          <div className="w-full h-1.5 bg-neutral-200 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-black"
              style={{ width: `${analytics.searchInterestScore}%` }}
            ></div>
          </div>
        </div>

        {/* 24h Search Velocity */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span className="flex items-center gap-1 font-medium font-sans">
              <Flame className="w-3.5 h-3.5 text-amber-600" /> Search Velocity (24h)
            </span>
            <span className="font-mono text-[10px]">Surge</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black font-mono text-emerald-700 tabular-nums">
              {analytics.searchVelocityPct}
            </span>
            <span className="text-xs text-neutral-600 font-sans">Growth</span>
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 font-mono truncate">
            Retail search curiosity accelerating
          </div>
        </div>

        {/* Investor Classification */}
        <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-md">
          <div className="flex items-center justify-between text-xs text-neutral-600 mb-1">
            <span className="flex items-center gap-1 font-medium font-sans">
              <Users className="w-3.5 h-3.5" /> Market Flow Profile
            </span>
            <span className="font-mono text-[10px]">Flow</span>
          </div>
          <div className="text-sm font-bold text-black font-mono mt-1">
            {analytics.retailVsInstitutional}
          </div>
          <div className="text-[11px] text-neutral-500 mt-2 font-mono">
            Direct correlation to intraday volume
          </div>
        </div>
      </div>

      {/* Breakout Queries & Regional Demand */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Breakout Queries */}
        <div>
          <div className="text-xs font-bold text-black uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
            <Search className="w-3.5 h-3.5 text-black" />
            Top Google Search Breakout Queries Today
          </div>
          <div className="space-y-1.5">
            {analytics.breakoutQueries.map((query, idx) => (
              <a
                key={idx}
                href={`https://www.google.com/search?q=${encodeURIComponent(query)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2.5 rounded-md bg-neutral-50 border border-neutral-200 text-xs hover:border-black transition-colors group cursor-pointer"
              >
                <span className="font-mono text-neutral-800 truncate group-hover:text-black">
                  "{query}"
                </span>
                <span className="text-emerald-700 font-mono text-[11px] font-bold flex items-center gap-1 shrink-0">
                  <ArrowUp className="w-2.5 h-2.5" />
                  <span>Breakout</span>
                  <ExternalLink className="w-2.5 h-2.5 text-neutral-400 opacity-0 group-hover:opacity-100" />
                </span>
              </a>
            ))}
          </div>
        </div>

        {/* Regional Search Demand */}
        <div>
          <div className="text-xs font-bold text-black uppercase tracking-wider font-mono mb-2 flex items-center gap-1.5">
            <Globe2 className="w-3.5 h-3.5 text-black" />
            Regional Search Demand Hotspots
          </div>
          <div className="space-y-2">
            {analytics.topRegions.map((region, idx) => (
              <div key={idx} className="text-xs font-mono">
                <div className="flex justify-between items-center text-neutral-700 mb-1">
                  <span>{region.country}</span>
                  <span className="font-semibold text-black tabular-nums">{region.interest}%</span>
                </div>
                <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-800"
                    style={{ width: `${region.interest}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 7-Day Trajectory Mini-Graph */}
      <div className="mt-4 pt-3.5 border-t border-neutral-200">
        <div className="text-xs font-bold text-black uppercase tracking-wider font-mono mb-2">
          7-Day Search Interest Trajectory (Leading Indicator for Price Direction)
        </div>
        <div className="grid grid-cols-7 gap-2">
          {analytics.searchHistory.map((item, idx) => (
            <div key={idx} className="text-center font-mono">
              <div className="h-14 bg-neutral-100 rounded-md flex items-end p-1">
                <div
                  className="w-full bg-black rounded-xs transition-all duration-300"
                  style={{ height: `${item.value}%` }}
                  title={`${item.label}: ${item.value}`}
                ></div>
              </div>
              <div className="text-[10px] text-neutral-500 mt-1 truncate">{item.label}</div>
              <div className="text-[10px] font-bold text-black tabular-nums">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
