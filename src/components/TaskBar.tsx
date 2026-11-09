/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AssetCategory, ActiveTaskView } from '../types.js';
import {
  TrendingUp,
  Compass,
  BarChart3,
  Home,
  Coins,
  Flame,
  Building2,
  Globe,
} from 'lucide-react';

interface TaskBarProps {
  activeTask: ActiveTaskView;
  onChangeTask: (task: ActiveTaskView) => void;
  selectedCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
  onSelectSymbol: (symbol: string) => void;
}

export const TaskBar: React.FC<TaskBarProps> = ({
  activeTask,
  onChangeTask,
  selectedCategory,
  onSelectCategory,
  onSelectSymbol,
}) => {
  return (
    <>
      {/* Top Task Navigation Bar (Desktop & Tablet) */}
      <div className="w-full bg-white/80 backdrop-blur-md border-b border-neutral-200/80 py-2 px-4 sm:px-6 sticky top-14 z-30 shadow-2xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Main 4 Pages: Home, Trade, Up Down, Analyze */}
          <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
            {/* Home Page */}
            <button
              onClick={() => onChangeTask('home')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeTask === 'home'
                  ? 'bg-black text-white shadow-sm ring-1 ring-black'
                  : 'bg-neutral-100/90 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </button>

            {/* Trade Page */}
            <button
              onClick={() => onChangeTask('trade')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeTask === 'trade'
                  ? 'bg-black text-white shadow-sm ring-1 ring-black'
                  : 'bg-neutral-100/90 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              <Compass className="w-4 h-4 text-blue-400" />
              <span>Trade</span>
            </button>

            {/* Up Down Page */}
            <button
              onClick={() => onChangeTask('updown')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeTask === 'updown'
                  ? 'bg-black text-white shadow-sm ring-1 ring-black'
                  : 'bg-neutral-100/90 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span>Up Down</span>
            </button>

            {/* Analyze Page */}
            <button
              onClick={() => onChangeTask('analyze')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-black transition-all whitespace-nowrap cursor-pointer ${
                activeTask === 'analyze'
                  ? 'bg-black text-white shadow-sm ring-1 ring-black'
                  : 'bg-neutral-100/90 hover:bg-neutral-200 text-neutral-800'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-amber-400" />
              <span>Analyze</span>
            </button>
          </div>

          {/* Short Category Quick Select: Crypto, Oil, Shares, Forex */}
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-mono">
            <span className="text-[11px] text-neutral-400 font-sans hidden lg:inline mr-1">Select:</span>

            {/* Crypto */}
            <button
              onClick={() => {
                onSelectCategory('crypto');
                onSelectSymbol('BTC/USD');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-bold ${
                selectedCategory === 'crypto'
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-800'
              }`}
              title="Crypto & Bitcoin"
            >
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span>Crypto</span>
            </button>

            {/* Oil */}
            <button
              onClick={() => {
                onSelectCategory('commodity');
                onSelectSymbol('OIL_WTI');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-bold ${
                selectedCategory === 'commodity'
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-800'
              }`}
              title="Oil & Energy"
            >
              <Flame className="w-3.5 h-3.5 text-amber-600" />
              <span>Oil</span>
            </button>

            {/* Shares */}
            <button
              onClick={() => {
                onSelectCategory('stock');
                onSelectSymbol('NVDA');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-bold ${
                selectedCategory === 'stock' || selectedCategory === 'world_stock'
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-800'
              }`}
              title="50+ Blue-chip Shares"
            >
              <Building2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Shares</span>
            </button>

            {/* Forex */}
            <button
              onClick={() => {
                onSelectCategory('forex');
                onSelectSymbol('EUR/USD');
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all cursor-pointer font-bold ${
                selectedCategory === 'forex'
                  ? 'bg-black text-white border-black shadow-xs'
                  : 'bg-white border-neutral-200 hover:border-neutral-400 text-neutral-800'
              }`}
              title="Forex Pairs"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>Forex</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Navigation Task Bar ("make like mobile under task button home,trade, up down and analyze section") */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-neutral-300 py-1.5 px-2 flex items-center justify-around shadow-lg">
        {/* Home */}
        <button
          onClick={() => {
            onChangeTask('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-all cursor-pointer ${
            activeTask === 'home'
              ? 'text-black font-bold'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Home className={`w-5 h-5 ${activeTask === 'home' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        {/* Trade */}
        <button
          onClick={() => {
            onChangeTask('trade');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-all cursor-pointer ${
            activeTask === 'trade'
              ? 'text-black font-bold'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          <Compass className={`w-5 h-5 ${activeTask === 'trade' ? 'text-black stroke-[2.5]' : 'text-neutral-500'}`} />
          <span className="text-[10px] mt-0.5">Trade</span>
        </button>

        {/* Up Down */}
        <button
          onClick={() => {
            onChangeTask('updown');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-all cursor-pointer ${
            activeTask === 'updown'
              ? 'text-emerald-700 font-bold'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          <div className="relative">
            <TrendingUp className={`w-5 h-5 ${activeTask === 'updown' ? 'stroke-[2.5]' : ''}`} />
            <span className="absolute -top-1 -right-1.5 w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          </div>
          <span className="text-[10px] mt-0.5">Up Down</span>
        </button>

        {/* Analyze */}
        <button
          onClick={() => {
            onChangeTask('analyze');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className={`flex flex-col items-center justify-center py-1 px-3 rounded-md transition-all cursor-pointer ${
            activeTask === 'analyze'
              ? 'text-black font-bold'
              : 'text-neutral-500 hover:text-black'
          }`}
        >
          <BarChart3 className={`w-5 h-5 ${activeTask === 'analyze' ? 'stroke-[2.5]' : ''}`} />
          <span className="text-[10px] mt-0.5">Analyze</span>
        </button>
      </nav>
    </>
  );
};
