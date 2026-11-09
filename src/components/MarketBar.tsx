/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { MarketAsset, AssetCategory } from '../types.js';
import { TrendingUp, TrendingDown, Search, X, Bell, Star, Check } from 'lucide-react';
import { AssetLogo } from './AssetLogo.tsx';

interface PriceAlert {
  symbol: string;
  targetPrice: number;
  condition: 'ABOVE' | 'BELOW';
}

interface MarketBarProps {
  markets: MarketAsset[];
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
  selectedCategory: AssetCategory;
  onSelectCategory: (category: AssetCategory) => void;
}

export const MarketBar: React.FC<MarketBarProps> = ({
  markets,
  selectedSymbol,
  onSelectSymbol,
  selectedCategory,
  onSelectCategory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [favorites, setFavorites] = useState<string[]>(['BTC/USD', 'OIL_WTI', 'NVDA', 'AAPL']);
  const [alerts, setAlerts] = useState<PriceAlert[]>([]);
  const [showAlertModal, setShowAlertModal] = useState<boolean>(false);
  const [alertSymbol, setAlertSymbol] = useState<string>('BTC/USD');
  const [alertPrice, setAlertPrice] = useState<string>('');
  const [alertCondition, setAlertCondition] = useState<'ABOVE' | 'BELOW'>('ABOVE');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Request browser notification permission on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'default') {
        Notification.requestPermission().catch(() => {});
      }
    }
  }, []);

  // Check live prices against active price alerts
  useEffect(() => {
    if (alerts.length === 0 || markets.length === 0) return;

    for (const alert of alerts) {
      const asset = markets.find((m) => m.symbol === alert.symbol);
      if (!asset) continue;

      const triggered =
        alert.condition === 'ABOVE'
          ? asset.price >= alert.targetPrice
          : asset.price <= alert.targetPrice;

      if (triggered) {
        setToastMessage(`🔔 Price Alert Triggered! ${alert.symbol} is now $${asset.price} (${alert.condition} $${alert.targetPrice})`);
        if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
          try {
            new Notification(`Onpiks Price Alert: ${alert.symbol}`, {
              body: `Target reached! Current price: $${asset.price}`,
            });
          } catch {}
        }
        // Remove triggered alert so it doesn't spam
        setAlerts((prev) => prev.filter((a) => a !== alert));
        setTimeout(() => setToastMessage(null), 8000);
      }
    }
  }, [markets, alerts]);

  const toggleFavorite = (sym: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) =>
      prev.includes(sym) ? prev.filter((s) => s !== sym) : [...prev, sym]
    );
  };

  const handleAddAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const num = parseFloat(alertPrice);
    if (isNaN(num) || num <= 0) return;

    setAlerts((prev) => [...prev, { symbol: alertSymbol, targetPrice: num, condition: alertCondition }]);
    setShowAlertModal(false);
    setAlertPrice('');
    setToastMessage(`✓ Browser Price Alert set for ${alertSymbol} @ $${num} (${alertCondition})`);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const filteredMarkets = useMemo(() => {
    let list = markets;

    if (selectedCategory === 'crypto') {
      list = markets.filter((m) => m.category === 'crypto');
    } else if (selectedCategory === 'commodity') {
      list = markets.filter((m) => m.category === 'commodity');
    } else if (selectedCategory === 'stock') {
      list = markets.filter((m) => m.category === 'stock' || m.category === 'world_stock');
    } else if (selectedCategory === 'world_stock') {
      list = markets.filter((m) => m.category === 'world_stock');
    } else if (selectedCategory === 'forex') {
      list = markets.filter((m) => m.category === 'forex');
    } else if (selectedCategory === 'financial') {
      list = markets.filter((m) => m.sector === 'Financials');
    } else if (selectedCategory === 'healthcare') {
      list = markets.filter((m) => m.sector === 'Healthcare');
    } else if (selectedCategory === 'consumer') {
      list = markets.filter((m) => m.sector === 'Consumer');
    } else if (selectedCategory === 'industrial') {
      list = markets.filter((m) => m.sector === 'Industrials' || m.sector === 'Energy');
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (m) =>
          m.symbol.toLowerCase().includes(q) ||
          m.name.toLowerCase().includes(q) ||
          (m.sector && m.sector.toLowerCase().includes(q)) ||
          (m.region && m.region.toLowerCase().includes(q))
      );
    }
    return list;
  }, [markets, selectedCategory, searchQuery]);

  return (
    <div className="w-full glass-panel border-b border-neutral-200/80 py-2.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-2.5">
        {/* Search Field & Price Alert Bell Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Quick Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              placeholder="Search crypto, oil, shares, forex..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-7 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-md text-black placeholder-neutral-400 focus:outline-none focus:border-black focus:bg-white transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2 text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Browser Price Notifications Button & Popular Fast Jumps */}
          <div className="flex items-center gap-2 text-xs font-mono text-neutral-500 overflow-x-auto">
            <button
              onClick={() => setShowAlertModal(true)}
              className="flex items-center gap-1.5 px-3 py-1 bg-black text-white hover:bg-neutral-800 rounded-md text-xs font-bold transition-colors cursor-pointer shadow-2xs shrink-0"
              title="Set Browser Price Notification Alert"
            >
              <Bell className="w-3.5 h-3.5 text-amber-400" />
              <span>Set Price Alert {alerts.length > 0 ? `(${alerts.length})` : ''}</span>
            </button>

            <span className="text-[11px] text-neutral-400 font-sans hidden sm:inline ml-2">Popular:</span>
            {[
              { sym: 'BTC/USD', label: 'BTC' },
              { sym: 'OIL_WTI', label: 'Oil WTI' },
              { sym: 'NVDA', label: 'NVDA' },
              { sym: 'AAPL', label: 'Apple' },
              { sym: '^N225', label: 'Nikkei' },
              { sym: 'EUR/USD', label: 'EUR' },
              { sym: 'GOLD', label: 'Gold' },
            ].map(({ sym, label }) => (
              <button
                key={sym}
                onClick={() => onSelectSymbol(sym)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer border ${
                  selectedSymbol === sym
                    ? 'bg-black text-white border-black font-bold shadow-xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-800 border-neutral-200'
                }`}
              >
                <AssetLogo symbol={sym} size="sm" />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Sector & Asset Class Filter Pills (Removed "Other") */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs font-mono scrollbar-none">
          {[
            { id: 'all' as AssetCategory, label: 'All' },
            { id: 'crypto' as AssetCategory, label: 'Crypto' },
            { id: 'commodity' as AssetCategory, label: 'Oil' },
            { id: 'stock' as AssetCategory, label: 'Shares' },
            { id: 'financial' as AssetCategory, label: 'Financials' },
            { id: 'healthcare' as AssetCategory, label: 'Healthcare' },
            { id: 'consumer' as AssetCategory, label: 'Consumer' },
            { id: 'industrial' as AssetCategory, label: 'Industrials' },
            { id: 'forex' as AssetCategory, label: 'Forex' },
          ].map(({ id, label }) => {
            const isActive = selectedCategory === id;
            return (
              <button
                key={id}
                onClick={() => onSelectCategory(id)}
                className={`px-2.5 py-1 rounded text-[11px] whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? 'bg-black text-white border-black font-bold shadow-2xs'
                    : 'bg-neutral-50 hover:bg-neutral-100 text-neutral-700 border-neutral-200'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Ticker Cards Grid with Round Small Logos & Favorite Star */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2 pt-0.5">
          {filteredMarkets.map((asset) => {
            const isSelected = asset.symbol === selectedSymbol;
            const isUp = asset.change24hPercent >= 0;
            const isFav = favorites.includes(asset.symbol);

            return (
              <div
                key={asset.symbol}
                onClick={() => onSelectSymbol(asset.symbol)}
                className={`p-2.5 rounded-md border text-left bg-white transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'border-black ring-1 ring-black shadow-xs bg-neutral-50/70'
                    : 'border-neutral-200 hover:border-neutral-400'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5">
                    <div className="flex items-center gap-1.5 truncate">
                      {/* Round small logo */}
                      <AssetLogo symbol={asset.symbol} size="sm" />
                      <span className="font-bold text-xs text-black font-mono truncate">
                        {asset.symbol}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => toggleFavorite(asset.symbol, e)}
                        className={`text-neutral-300 hover:text-amber-500 cursor-pointer ${
                          isFav ? 'text-amber-500' : ''
                        }`}
                        title="Bookmark Favorite Asset"
                      >
                        <Star className={`w-3.5 h-3.5 ${isFav ? 'fill-amber-500' : ''}`} />
                      </button>
                      <span className="text-[10px] text-neutral-400 font-mono">
                        {asset.region ? asset.region.split('/')[0] : asset.category}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] text-neutral-500 truncate mt-1 pl-6">
                    {asset.name}
                  </div>
                </div>

                <div className="mt-2 flex items-baseline justify-between pt-1 border-t border-neutral-100">
                  <span className="font-mono text-xs font-bold text-black tabular-nums">
                    ${asset.price.toLocaleString(undefined, {
                      minimumFractionDigits: asset.precision > 2 ? asset.precision : 2,
                    })}
                  </span>
                  <span
                    className={`font-mono text-[11px] font-semibold flex items-center gap-0.5 tabular-nums ${
                      isUp ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {isUp ? <TrendingUp className="w-2.5 h-2.5" /> : <TrendingDown className="w-2.5 h-2.5" />}
                    {isUp ? '+' : ''}
                    {asset.change24hPercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMarkets.length === 0 && (
          <div className="py-6 text-center text-xs text-neutral-500 font-mono">
            No assets match "{searchQuery}". Try searching "BTC", "Oil", "Shares", "Forex".
          </div>
        )}

        {/* Toast Notification Banner */}
        {toastMessage && (
          <div className="p-2.5 bg-neutral-900 text-white rounded-lg flex items-center justify-between text-xs font-mono animate-in fade-in">
            <span className="text-emerald-400 font-bold">{toastMessage}</span>
            <button onClick={() => setToastMessage(null)} className="text-neutral-400 hover:text-white">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Set Price Alert Modal */}
      {showAlertModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white border border-neutral-300 rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-black font-sans">
                  Set Browser Price Notification Alert
                </h3>
              </div>
              <button
                onClick={() => setShowAlertModal(false)}
                className="text-neutral-400 hover:text-black cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleAddAlert} className="space-y-4 pt-4 text-xs font-mono">
              <div>
                <label className="block text-neutral-600 font-sans font-semibold mb-1">Select Asset</label>
                <select
                  value={alertSymbol}
                  onChange={(e) => setAlertSymbol(e.target.value)}
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-md text-black font-mono focus:outline-none focus:border-black"
                >
                  {markets.map((m) => (
                    <option key={m.symbol} value={m.symbol}>
                      {m.symbol} — {m.name} (${m.price})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-neutral-600 font-sans font-semibold mb-1">Target Price ($)</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g. 85000"
                  value={alertPrice}
                  onChange={(e) => setAlertPrice(e.target.value)}
                  required
                  className="w-full p-2 bg-neutral-50 border border-neutral-300 rounded-md text-black font-mono focus:outline-none focus:border-black"
                />
              </div>

              <div>
                <label className="block text-neutral-600 font-sans font-semibold mb-1">Trigger Condition</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setAlertCondition('ABOVE')}
                    className={`p-2 rounded font-bold transition-colors cursor-pointer border ${
                      alertCondition === 'ABOVE'
                        ? 'bg-emerald-600 text-white border-emerald-700'
                        : 'bg-white border-neutral-300 text-neutral-700'
                    }`}
                  >
                    Price Rises ABOVE Target
                  </button>
                  <button
                    type="button"
                    onClick={() => setAlertCondition('BELOW')}
                    className={`p-2 rounded font-bold transition-colors cursor-pointer border ${
                      alertCondition === 'BELOW'
                        ? 'bg-rose-600 text-white border-rose-700'
                        : 'bg-white border-neutral-300 text-neutral-700'
                    }`}
                  >
                    Price Drops BELOW Target
                  </button>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAlertModal(false)}
                  className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-md font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white rounded-md font-bold cursor-pointer"
                >
                  Set Live Alert
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
