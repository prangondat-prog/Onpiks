/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { RefreshCw, Activity, Clock, ShieldCheck } from 'lucide-react';
import { MarketAsset, AssetCategory } from '../types.js';

interface HeaderProps {
  lastUpdated: string;
  isRefreshing: boolean;
  onRefresh: () => void;
  activeAssetCount: number;
  selectedCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
  dxyAsset?: MarketAsset;
}

export const Header: React.FC<HeaderProps> = ({
  lastUpdated,
  isRefreshing,
  onRefresh,
  activeAssetCount,
  selectedCategory,
  onSelectCategory,
  dxyAsset,
}) => {
  const [utcTime, setUtcTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setUtcTime(
        now.toLocaleTimeString('en-US', {
          timeZone: 'UTC',
          hour12: false,
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        }) + ' UTC'
      );
    };
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories: { key: AssetCategory; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'crypto', label: 'Crypto' },
    { key: 'commodity', label: 'Oil' },
    { key: 'stock', label: 'Shares' },
    { key: 'forex', label: 'Forex' },
  ];

  const isDxyUp = dxyAsset ? dxyAsset.change24hPercent >= 0 : true;

  return (
    <header className="w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/80 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-4">
        {/* Zone 1: Brand title & subtitle */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="flex items-baseline gap-2">
            <span className="text-xl font-black tracking-tight text-black font-sans">
              Onpiks
            </span>
            <span className="hidden md:inline text-xs text-neutral-500 font-mono font-semibold">
              / Candle Direction & Trade Intelligence
            </span>
          </div>
        </div>

        {/* Clean Top Bar Header Navigation */}

        {/* Zone 2: Category Filter Tabs */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-mono">
          {categories.map((cat) => (
            <button
              key={cat.key}
              onClick={() => onSelectCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer font-bold ${
                selectedCategory === cat.key
                  ? 'bg-black text-white shadow-xs'
                  : 'text-neutral-700 hover:text-black hover:bg-neutral-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>

        {/* Zone 3: Live telemetry & primary Refresh button */}
        <div className="flex items-center gap-3 shrink-0 text-xs font-mono">
          {/* Live indicator */}
          <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 glass-panel rounded-lg text-neutral-900 border border-neutral-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            <span className="text-[11px] font-black text-emerald-800 tracking-wider">LIVE FEED</span>
          </div>

          {/* UTC Clock */}
          <div className="hidden md:flex items-center gap-1 text-neutral-600 font-bold text-[11px]">
            <Clock className="w-3.5 h-3.5" />
            <span>{utcTime}</span>
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white hover:bg-neutral-800 transition-all rounded-lg text-xs font-bold cursor-pointer disabled:opacity-50 shadow-xs"
            title="Refresh real-time market data"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span>{isRefreshing ? 'Updating...' : 'Refresh'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
