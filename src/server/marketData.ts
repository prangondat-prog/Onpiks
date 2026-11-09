/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MarketAsset, Candle } from '../types.js';

export interface AssetConfig {
  symbol: string;
  name: string;
  category: 'crypto' | 'commodity' | 'stock' | 'world_stock' | 'forex';
  sector?: 'Tech' | 'Financials' | 'Healthcare' | 'Consumer' | 'Industrials' | 'Energy' | 'Crypto' | 'Commodity' | 'Forex';
  region?: string;
  provider: 'binance' | 'yahoo';
  ticker: string;
  currency: string;
  precision: number;
  unit?: string;
  defaultPrice: number;
}

export const SUPPORTED_ASSETS: AssetConfig[] = [
  // ================= Crypto =================
  { symbol: 'BTC/USD', name: 'Bitcoin', category: 'crypto', sector: 'Crypto', region: 'Global', provider: 'binance', ticker: 'BTCUSDT', currency: 'USD', precision: 2, defaultPrice: 76000 },
  { symbol: 'ETH/USD', name: 'Ethereum', category: 'crypto', sector: 'Crypto', region: 'Global', provider: 'binance', ticker: 'ETHUSDT', currency: 'USD', precision: 2, defaultPrice: 2850 },
  { symbol: 'SOL/USD', name: 'Solana', category: 'crypto', sector: 'Crypto', region: 'Global', provider: 'binance', ticker: 'SOLUSDT', currency: 'USD', precision: 2, defaultPrice: 195 },
  { symbol: 'BNB/USD', name: 'BNB', category: 'crypto', sector: 'Crypto', region: 'Global', provider: 'binance', ticker: 'BNBUSDT', currency: 'USD', precision: 2, defaultPrice: 620 },
  { symbol: 'XRP/USD', name: 'XRP', category: 'crypto', sector: 'Crypto', region: 'Global', provider: 'binance', ticker: 'XRPUSDT', currency: 'USD', precision: 4, defaultPrice: 0.58 },

  // ================= Commodities & Oil =================
  { symbol: 'OIL_WTI', name: 'Crude Oil (WTI)', category: 'commodity', sector: 'Energy', region: 'Americas', provider: 'yahoo', ticker: 'CL=F', currency: 'USD', precision: 2, unit: 'bbl', defaultPrice: 90.8 },
  { symbol: 'OIL_BRENT', name: 'Brent Crude Oil', category: 'commodity', sector: 'Energy', region: 'Europe/Global', provider: 'yahoo', ticker: 'BZ=F', currency: 'USD', precision: 2, unit: 'bbl', defaultPrice: 94.2 },
  { symbol: 'GOLD', name: 'Gold (XAU/USD)', category: 'commodity', sector: 'Commodity', region: 'Global', provider: 'yahoo', ticker: 'GC=F', currency: 'USD', precision: 2, unit: 'oz', defaultPrice: 2680 },
  { symbol: 'SILVER', name: 'Silver (XAG/USD)', category: 'commodity', sector: 'Commodity', region: 'Global', provider: 'yahoo', ticker: 'SI=F', currency: 'USD', precision: 2, unit: 'oz', defaultPrice: 31.5 },
  { symbol: 'NATGAS', name: 'Natural Gas', category: 'commodity', sector: 'Energy', region: 'Americas', provider: 'yahoo', ticker: 'NG=F', currency: 'USD', precision: 3, unit: 'MMBtu', defaultPrice: 2.85 },

  // ================= Tech Giants =================
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'AAPL', currency: 'USD', precision: 2, defaultPrice: 235.0 },
  { symbol: 'MSFT', name: 'Microsoft Corporation', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'MSFT', currency: 'USD', precision: 2, defaultPrice: 422.0 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'GOOGL', currency: 'USD', precision: 2, defaultPrice: 284.5 },
  { symbol: 'AMZN', name: 'Amazon.com, Inc.', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'AMZN', currency: 'USD', precision: 2, defaultPrice: 198.0 },
  { symbol: 'NVDA', name: 'NVIDIA Corporation', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'NVDA', currency: 'USD', precision: 2, defaultPrice: 145.5 },
  { symbol: 'META', name: 'Meta Platforms, Inc.', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'META', currency: 'USD', precision: 2, defaultPrice: 610.0 },
  { symbol: 'TSLA', name: 'Tesla, Inc.', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'TSLA', currency: 'USD', precision: 2, defaultPrice: 288.0 },
  { symbol: 'AMD', name: 'Advanced Micro Devices', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'AMD', currency: 'USD', precision: 2, defaultPrice: 148.0 },
  { symbol: 'INTC', name: 'Intel Corporation', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'INTC', currency: 'USD', precision: 2, defaultPrice: 24.5 },
  { symbol: 'NFLX', name: 'Netflix, Inc.', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'NFLX', currency: 'USD', precision: 2, defaultPrice: 760.0 },
  { symbol: 'CRM', name: 'Salesforce, Inc.', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'CRM', currency: 'USD', precision: 2, defaultPrice: 310.0 },
  { symbol: 'ADBE', name: 'Adobe Inc.', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'ADBE', currency: 'USD', precision: 2, defaultPrice: 515.0 },

  // ================= Financials & Payments =================
  { symbol: 'JPM', name: 'JPMorgan Chase & Co.', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'JPM', currency: 'USD', precision: 2, defaultPrice: 334.5 },
  { symbol: 'BAC', name: 'Bank of America Corporation', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'BAC', currency: 'USD', precision: 2, defaultPrice: 45.2 },
  { symbol: 'GS', name: 'Goldman Sachs Group, Inc.', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'GS', currency: 'USD', precision: 2, defaultPrice: 540.0 },
  { symbol: 'MS', name: 'Morgan Stanley', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'MS', currency: 'USD', precision: 2, defaultPrice: 128.0 },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway Inc.', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'BRK-B', currency: 'USD', precision: 2, defaultPrice: 570.8 },
  { symbol: 'V', name: 'Visa Inc.', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'V', currency: 'USD', precision: 2, defaultPrice: 305.0 },
  { symbol: 'MA', name: 'Mastercard Incorporated', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'MA', currency: 'USD', precision: 2, defaultPrice: 515.0 },
  { symbol: 'PYPL', name: 'PayPal Holdings, Inc.', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'PYPL', currency: 'USD', precision: 2, defaultPrice: 82.5 },
  { symbol: 'C', name: 'Citigroup Inc.', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'C', currency: 'USD', precision: 2, defaultPrice: 68.4 },
  { symbol: 'WFC', name: 'Wells Fargo & Company', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'WFC', currency: 'USD', precision: 2, defaultPrice: 68.8 },

  // ================= Healthcare & Pharmaceuticals =================
  { symbol: 'JNJ', name: 'Johnson & Johnson', category: 'stock', sector: 'Healthcare', region: 'USA', provider: 'yahoo', ticker: 'JNJ', currency: 'USD', precision: 2, defaultPrice: 162.0 },
  { symbol: 'LLY', name: 'Eli Lilly and Company', category: 'stock', sector: 'Healthcare', region: 'USA', provider: 'yahoo', ticker: 'LLY', currency: 'USD', precision: 2, defaultPrice: 1350.0 },
  { symbol: 'PFE', name: 'Pfizer Inc.', category: 'stock', sector: 'Healthcare', region: 'USA', provider: 'yahoo', ticker: 'PFE', currency: 'USD', precision: 2, defaultPrice: 28.5 },
  { symbol: 'MRK', name: 'Merck & Co., Inc.', category: 'stock', sector: 'Healthcare', region: 'USA', provider: 'yahoo', ticker: 'MRK', currency: 'USD', precision: 2, defaultPrice: 105.0 },
  { symbol: 'ABBV', name: 'AbbVie Inc.', category: 'stock', sector: 'Healthcare', region: 'USA', provider: 'yahoo', ticker: 'ABBV', currency: 'USD', precision: 2, defaultPrice: 195.0 },
  { symbol: 'UNH', name: 'UnitedHealth Group', category: 'stock', sector: 'Healthcare', region: 'USA', provider: 'yahoo', ticker: 'UNH', currency: 'USD', precision: 2, defaultPrice: 580.0 },
  { symbol: 'CVS', name: 'CVS Health Corporation', category: 'stock', sector: 'Healthcare', region: 'USA', provider: 'yahoo', ticker: 'CVS', currency: 'USD', precision: 2, defaultPrice: 58.2 },
  { symbol: 'MRNA', name: 'Moderna, Inc.', category: 'stock', sector: 'Healthcare', region: 'USA', provider: 'yahoo', ticker: 'MRNA', currency: 'USD', precision: 2, defaultPrice: 48.5 },

  // ================= Consumer Goods & Retail =================
  { symbol: 'WMT', name: 'Walmart Inc.', category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'WMT', currency: 'USD', precision: 2, defaultPrice: 125.5 },
  { symbol: 'PG', name: 'The Procter & Gamble Co.', category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'PG', currency: 'USD', precision: 2, defaultPrice: 174.0 },
  { symbol: 'KO', name: 'The Coca-Cola Company', category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'KO', currency: 'USD', precision: 2, defaultPrice: 68.5 },
  { symbol: 'PEP', name: 'PepsiCo, Inc.', category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'PEP', currency: 'USD', precision: 2, defaultPrice: 168.0 },
  { symbol: 'COST', name: 'Costco Wholesale Corp.', category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'COST', currency: 'USD', precision: 2, defaultPrice: 920.0 },
  { symbol: 'HD', name: 'Home Depot, Inc.', category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'HD', currency: 'USD', precision: 2, defaultPrice: 398.0 },
  { symbol: 'NKE', name: 'Nike, Inc.', category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'NKE', currency: 'USD', precision: 2, defaultPrice: 78.5 },
  { symbol: 'MCD', name: "McDonald's Corporation", category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'MCD', currency: 'USD', precision: 2, defaultPrice: 298.0 },
  { symbol: 'SBUX', name: 'Starbucks Corporation', category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'SBUX', currency: 'USD', precision: 2, defaultPrice: 98.5 },
  { symbol: 'TGT', name: 'Target Corporation', category: 'stock', sector: 'Consumer', region: 'USA', provider: 'yahoo', ticker: 'TGT', currency: 'USD', precision: 2, defaultPrice: 152.0 },

  // ================= Industrials, Energy & Materials =================
  { symbol: 'XOM', name: 'Exxon Mobil Corporation', category: 'stock', sector: 'Energy', region: 'USA', provider: 'yahoo', ticker: 'XOM', currency: 'USD', precision: 2, defaultPrice: 165.8 },
  { symbol: 'CVX', name: 'Chevron Corporation', category: 'stock', sector: 'Energy', region: 'USA', provider: 'yahoo', ticker: 'CVX', currency: 'USD', precision: 2, defaultPrice: 158.0 },
  { symbol: 'GE', name: 'General Electric Company', category: 'stock', sector: 'Industrials', region: 'USA', provider: 'yahoo', ticker: 'GE', currency: 'USD', precision: 2, defaultPrice: 185.0 },
  { symbol: 'CAT', name: 'Caterpillar Inc.', category: 'stock', sector: 'Industrials', region: 'USA', provider: 'yahoo', ticker: 'CAT', currency: 'USD', precision: 2, defaultPrice: 395.0 },
  { symbol: 'BA', name: 'The Boeing Company', category: 'stock', sector: 'Industrials', region: 'USA', provider: 'yahoo', ticker: 'BA', currency: 'USD', precision: 2, defaultPrice: 152.0 },
  { symbol: 'FDX', name: 'FedEx Corporation', category: 'stock', sector: 'Industrials', region: 'USA', provider: 'yahoo', ticker: 'FDX', currency: 'USD', precision: 2, defaultPrice: 285.0 },
  { symbol: 'UPS', name: 'United Parcel Service', category: 'stock', sector: 'Industrials', region: 'USA', provider: 'yahoo', ticker: 'UPS', currency: 'USD', precision: 2, defaultPrice: 134.0 },
  { symbol: 'MMM', name: '3M Company', category: 'stock', sector: 'Industrials', region: 'USA', provider: 'yahoo', ticker: 'MMM', currency: 'USD', precision: 2, defaultPrice: 132.0 },
  { symbol: 'F', name: 'Ford Motor Company', category: 'stock', sector: 'Industrials', region: 'USA', provider: 'yahoo', ticker: 'F', currency: 'USD', precision: 2, defaultPrice: 11.2 },
  { symbol: 'GM', name: 'General Motors Company', category: 'stock', sector: 'Industrials', region: 'USA', provider: 'yahoo', ticker: 'GM', currency: 'USD', precision: 2, defaultPrice: 54.5 },

  // ================= World Stocks & Indices =================
  { symbol: 'TSM', name: 'TSMC (Taiwan Semi)', category: 'world_stock', sector: 'Tech', region: 'Asia/Taiwan', provider: 'yahoo', ticker: 'TSM', currency: 'USD', precision: 2, defaultPrice: 375.4 },
  { symbol: '^N225', name: 'Nikkei 225 (Japan)', category: 'world_stock', sector: 'Industrials', region: 'Asia/Tokyo', provider: 'yahoo', ticker: '^N225', currency: 'JPY', precision: 2, defaultPrice: 57434 },
  { symbol: '^FTSE', name: 'FTSE 100 (London)', category: 'world_stock', sector: 'Financials', region: 'Europe/UK', provider: 'yahoo', ticker: '^FTSE', currency: 'GBP', precision: 2, defaultPrice: 10673 },
  { symbol: '^GDAXI', name: 'DAX 40 (Germany)', category: 'world_stock', sector: 'Industrials', region: 'Europe/Germany', provider: 'yahoo', ticker: '^GDAXI', currency: 'EUR', precision: 2, defaultPrice: 19450 },
  { symbol: 'BABA', name: 'Alibaba Group', category: 'world_stock', sector: 'Consumer', region: 'Asia/China', provider: 'yahoo', ticker: 'BABA', currency: 'USD', precision: 2, defaultPrice: 98.5 },
  { symbol: 'ASML', name: 'ASML Holding', category: 'world_stock', sector: 'Tech', region: 'Europe/Netherlands', provider: 'yahoo', ticker: 'ASML', currency: 'USD', precision: 2, defaultPrice: 720.0 },
  { symbol: 'SPY', name: 'S&P 500 ETF (SPDR)', category: 'stock', sector: 'Financials', region: 'USA', provider: 'yahoo', ticker: 'SPY', currency: 'USD', precision: 2, defaultPrice: 588.0 },
  { symbol: 'QQQ', name: 'Invesco QQQ (Nasdaq 100)', category: 'stock', sector: 'Tech', region: 'USA', provider: 'yahoo', ticker: 'QQQ', currency: 'USD', precision: 2, defaultPrice: 495.0 },

  // ================= US Dollar Index & Global Country Forex =================
  { symbol: 'DXY', name: 'US Dollar Index', category: 'forex', sector: 'Forex', region: 'USA/Global', provider: 'yahoo', ticker: 'DX-Y.NYB', currency: 'USD', precision: 2, defaultPrice: 104.25 },
  { symbol: 'EUR/USD', name: 'Euro / US Dollar', category: 'forex', sector: 'Forex', region: 'Europe/USA', provider: 'yahoo', ticker: 'EURUSD=X', currency: 'USD', precision: 4, defaultPrice: 1.085 },
  { symbol: 'GBP/USD', name: 'British Pound / USD', category: 'forex', sector: 'Forex', region: 'UK/USA', provider: 'yahoo', ticker: 'GBPUSD=X', currency: 'USD', precision: 4, defaultPrice: 1.298 },
  { symbol: 'USD/JPY', name: 'US Dollar / Yen', category: 'forex', sector: 'Forex', region: 'USA/Japan', provider: 'yahoo', ticker: 'JPY=X', currency: 'JPY', precision: 2, defaultPrice: 153.2 },
  { symbol: 'AUD/USD', name: 'Aussie Dollar / USD', category: 'forex', sector: 'Forex', region: 'Australia/USA', provider: 'yahoo', ticker: 'AUDUSD=X', currency: 'USD', precision: 4, defaultPrice: 0.658 },
  { symbol: 'USD/CAD', name: 'US Dollar / CAD', category: 'forex', sector: 'Forex', region: 'USA/Canada', provider: 'yahoo', ticker: 'CAD=X', currency: 'CAD', precision: 4, defaultPrice: 1.389 },
  { symbol: 'USD/CHF', name: 'US Dollar / Swiss Franc', category: 'forex', sector: 'Forex', region: 'Switzerland', provider: 'yahoo', ticker: 'CHF=X', currency: 'CHF', precision: 4, defaultPrice: 0.865 },
  { symbol: 'USD/CNY', name: 'US Dollar / Chinese Yuan', category: 'forex', sector: 'Forex', region: 'China', provider: 'yahoo', ticker: 'CNY=X', currency: 'CNY', precision: 4, defaultPrice: 7.124 },
  { symbol: 'USD/INR', name: 'US Dollar / Indian Rupee', category: 'forex', sector: 'Forex', region: 'India', provider: 'yahoo', ticker: 'INR=X', currency: 'INR', precision: 2, defaultPrice: 84.08 },
  { symbol: 'USD/MXN', name: 'US Dollar / Mexican Peso', category: 'forex', sector: 'Forex', region: 'Mexico', provider: 'yahoo', ticker: 'MXN=X', currency: 'MXN', precision: 3, defaultPrice: 20.15 },
  { symbol: 'USD/BRL', name: 'US Dollar / Brazilian Real', category: 'forex', sector: 'Forex', region: 'Brazil', provider: 'yahoo', ticker: 'BRL=X', currency: 'BRL', precision: 3, defaultPrice: 5.72 },
  { symbol: 'USD/SGD', name: 'US Dollar / Singapore Dollar', category: 'forex', sector: 'Forex', region: 'Singapore', provider: 'yahoo', ticker: 'SGD=X', currency: 'SGD', precision: 4, defaultPrice: 1.321 },
  { symbol: 'NZD/USD', name: 'Kiwi Dollar / USD', category: 'forex', sector: 'Forex', region: 'New Zealand', provider: 'yahoo', ticker: 'NZDUSD=X', currency: 'USD', precision: 4, defaultPrice: 0.598 },
  { symbol: 'USD/KRW', name: 'US Dollar / Korean Won', category: 'forex', sector: 'Forex', region: 'South Korea', provider: 'yahoo', ticker: 'KRW=X', currency: 'KRW', precision: 1, defaultPrice: 1385.5 },
  { symbol: 'USD/ZAR', name: 'US Dollar / South African Rand', category: 'forex', sector: 'Forex', region: 'South Africa', provider: 'yahoo', ticker: 'ZAR=X', currency: 'ZAR', precision: 3, defaultPrice: 17.65 },
];

// In-memory cache for live quotes
interface QuoteCache {
  timestamp: number;
  assets: MarketAsset[];
}
let quoteCache: QuoteCache | null = null;
const CACHE_TTL_MS = 800; // Ultra-fast sub-second cache for high-frequency trading

const candleCache = new Map<string, { timestamp: number; candles: Candle[] }>();

export async function fetchLiveMarkets(): Promise<MarketAsset[]> {
  const now = Date.now();
  if (quoteCache && now - quoteCache.timestamp < CACHE_TTL_MS) {
    return quoteCache.assets;
  }

  const results: MarketAsset[] = [];

  const binanceConfigs = SUPPORTED_ASSETS.filter((a) => a.provider === 'binance');
  const yahooConfigs = SUPPORTED_ASSETS.filter((a) => a.provider === 'yahoo');

  // Fetch Binance in parallel
  const binancePromises = binanceConfigs.map(async (cfg) => {
    try {
      const res = await fetch(`https://api.binance.com/api/v3/ticker/24hr?symbol=${cfg.ticker}`, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
        },
      });
      if (!res.ok) throw new Error(`Binance HTTP ${res.status}`);
      const data = await res.json();
      const price = parseFloat(data.lastPrice);
      const change = parseFloat(data.priceChange);
      const changePercent = parseFloat(data.priceChangePercent);
      const high = parseFloat(data.highPrice);
      const low = parseFloat(data.lowPrice);
      const volNum = parseFloat(data.volume);

      return {
        symbol: cfg.symbol,
        name: cfg.name,
        category: cfg.category,
        sector: cfg.sector,
        region: cfg.region,
        price: Number(price.toFixed(cfg.precision)),
        change24h: Number(change.toFixed(cfg.precision)),
        change24hPercent: Number(changePercent.toFixed(2)),
        high24h: Number(high.toFixed(cfg.precision)),
        low24h: Number(low.toFixed(cfg.precision)),
        volume24h: volNum > 1000000 ? `${(volNum / 1000000).toFixed(1)}M` : `${(volNum / 1000).toFixed(1)}K`,
        currency: cfg.currency,
        precision: cfg.precision,
        unit: cfg.unit,
        lastUpdated: new Date().toLocaleTimeString(),
      } as MarketAsset;
    } catch (err: any) {
      console.error(`Binance fetch failed for ${cfg.symbol}:`, err.message);
      return fallbackAsset(cfg);
    }
  });

  // Batch Yahoo requests
  const fetchYahooBatch = async (configs: AssetConfig[]) => {
    return Promise.all(
      configs.map(async (cfg) => {
        try {
          // Using a more reliable Yahoo Chart endpoint version
          const res = await fetch(
            `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cfg.ticker)}?interval=1d&range=1d`,
            {
              headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'application/json',
                'Referer': 'https://finance.yahoo.com'
              },
            }
          );
          if (!res.ok) throw new Error(`Yahoo HTTP ${res.status}`);
          const json = await res.json();
          const meta = json?.chart?.result?.[0]?.meta;
          if (!meta) throw new Error('No metadata in Yahoo response');

          const price = meta.regularMarketPrice ?? cfg.defaultPrice;
          const prevClose = meta.chartPreviousClose || meta.previousClose || price;
          const change = price - prevClose;
          const changePercent = prevClose ? (change / prevClose) * 100 : 0;
          const high = meta.regularMarketDayHigh || price * 1.005;
          const low = meta.regularMarketDayLow || price * 0.995;
          const volNum = meta.regularMarketVolume || 1200000;

          return {
            symbol: cfg.symbol,
            name: cfg.name,
            category: cfg.category,
            sector: cfg.sector,
            region: cfg.region,
            price: Number(price.toFixed(cfg.precision)),
            change24h: Number(change.toFixed(cfg.precision)),
            change24hPercent: Number(changePercent.toFixed(2)),
            high24h: Number(high.toFixed(cfg.precision)),
            low24h: Number(low.toFixed(cfg.precision)),
            volume24h: volNum > 1000000 ? `${(volNum / 1000000).toFixed(1)}M` : `${(volNum / 1000).toFixed(1)}K`,
            currency: cfg.currency,
            precision: cfg.precision,
            unit: cfg.unit,
            lastUpdated: new Date().toLocaleTimeString(),
          } as MarketAsset;
        } catch (err: any) {
          console.warn(`Yahoo fetch failed for ${cfg.symbol}:`, err.message);
          return fallbackAsset(cfg);
        }
      })
    );
  };

  const binanceResults = await Promise.all(binancePromises);
  const yahooResults = await fetchYahooBatch(yahooConfigs);

  for (const item of [...binanceResults, ...yahooResults]) {
    if (item) results.push(item);
  }

  quoteCache = {
    timestamp: now,
    assets: results,
  };

  return results;
}

function fallbackAsset(cfg: AssetConfig): MarketAsset {
  const base = cfg.defaultPrice;
  // Add a tiny random jitter so "demo" mode doesn't look completely frozen
  const jitter = 1 + (Math.random() - 0.5) * 0.0005;
  const price = base * jitter;
  return {
    symbol: cfg.symbol,
    name: cfg.name,
    category: cfg.category,
    sector: cfg.sector,
    region: cfg.region,
    price: Number(price.toFixed(cfg.precision)),
    change24h: Number((price * 0.008).toFixed(cfg.precision)),
    change24hPercent: 0.85,
    high24h: Number((price * 1.005).toFixed(cfg.precision)),
    low24h: Number((price * 0.995).toFixed(cfg.precision)),
    volume24h: '1.5M',
    currency: cfg.currency,
    precision: cfg.precision,
    unit: cfg.unit,
    lastUpdated: new Date().toLocaleTimeString(),
  };
}

export async function fetchCandles(symbol: string, timeframe: string = '1d'): Promise<Candle[]> {
  const cfg = SUPPORTED_ASSETS.find((a) => a.symbol === symbol) || SUPPORTED_ASSETS[0];
  const normalizedTf = timeframe.toLowerCase();
  const cacheKey = `${cfg.symbol}_${normalizedTf}`;
  const now = Date.now();
  const cached = candleCache.get(cacheKey);

  if (cached && now - cached.timestamp < 15000) {
    return cached.candles;
  }

  let candles: Candle[] = [];

  if (cfg.provider === 'binance') {
    try {
      let interval = '1d';
      if (normalizedTf === '1m') interval = '1m';
      else if (normalizedTf === '3m') interval = '3m';
      else if (normalizedTf === '10m') interval = '5m';
      else if (normalizedTf === '15m') interval = '15m';
      else if (normalizedTf === '1h') interval = '1h';
      else if (normalizedTf === '2h') interval = '2h';
      else if (normalizedTf === '4h') interval = '4h';

      const limit = 45;
      const res = await fetch(
        `https://api.binance.com/api/v3/klines?symbol=${cfg.ticker}&interval=${interval}&limit=${limit}`,
        { 
          headers: { 
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' 
          } 
        }
      );
      if (res.ok) {
        const raw = await res.json();
        candles = raw.map((k: any) => {
          const t = k[0];
          const d = new Date(t);
          const timeStr = normalizedTf.includes('m') || normalizedTf.includes('h')
            ? `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
            : `${d.getMonth() + 1}/${d.getDate()}`;

          return {
            time: t,
            dateStr: timeStr,
            open: Number(parseFloat(k[1]).toFixed(cfg.precision)),
            high: Number(parseFloat(k[2]).toFixed(cfg.precision)),
            low: Number(parseFloat(k[3]).toFixed(cfg.precision)),
            close: Number(parseFloat(k[4]).toFixed(cfg.precision)),
            volume: Math.round(parseFloat(k[5])),
          };
        });
      }
    } catch (err: any) {
      console.error(`Binance candle fetch failed for ${cfg.symbol}:`, err.message);
    }
  } else {
    try {
      let interval = '1d';
      let range = '2mo';

      if (['1m', '3m', '10m', '15m'].includes(normalizedTf)) {
        interval = normalizedTf === '1m' ? '1m' : '5m';
        range = '1d';
      } else if (normalizedTf === '1h' || normalizedTf === '2h' || normalizedTf === '4h') {
        interval = '60m';
        range = '7d';
      }

      const res = await fetch(
        `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(cfg.ticker)}?interval=${interval}&range=${range}`,
        {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Accept': 'application/json',
            'Referer': 'https://finance.yahoo.com'
          },
        }
      );
      if (res.ok) {
        const json = await res.json();
        const r = json?.chart?.result?.[0];
        if (r && r.timestamp && r.indicators?.quote?.[0]) {
          const timestamps = r.timestamp;
          const q = r.indicators.quote[0];
          const list: Candle[] = [];
          for (let i = 0; i < timestamps.length; i++) {
            if (q.close[i] !== null && q.open[i] !== null) {
              const d = new Date(timestamps[i] * 1000);
              const timeStr = normalizedTf.includes('m') || normalizedTf.includes('h')
                ? `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
                : `${d.getMonth() + 1}/${d.getDate()}`;

              list.push({
                time: timestamps[i] * 1000,
                dateStr: timeStr,
                open: Number(Number(q.open[i]).toFixed(cfg.precision)),
                high: Number(Number(q.high[i]).toFixed(cfg.precision)),
                low: Number(Number(q.low[i]).toFixed(cfg.precision)),
                close: Number(Number(q.close[i]).toFixed(cfg.precision)),
                volume: Math.round(q.volume?.[i] || 10000),
              });
            }
          }
          candles = list.slice(-45);
        }
      }
    } catch (err: any) {
      console.warn(`Yahoo candle fetch failed for ${cfg.symbol}:`, err.message);
    }
  }

  if (candles.length < 5) {
    candles = generateRealisticCandles(cfg, 35, normalizedTf);
  }

  candleCache.set(cacheKey, { timestamp: now, candles });
  return candles;
}

function generateRealisticCandles(cfg: AssetConfig, count: number, timeframe: string = '1d'): Candle[] {
  const result: Candle[] = [];
  let price = cfg.defaultPrice;
  const now = Date.now();
  let stepMs = 86400000;

  if (timeframe === '1m') stepMs = 60000;
  else if (timeframe === '3m') stepMs = 180000;
  else if (timeframe === '10m') stepMs = 600000;
  else if (timeframe === '15m') stepMs = 900000;
  else if (timeframe === '1h') stepMs = 3600000;
  else if (timeframe === '2h') stepMs = 7200000;
  else if (timeframe === '4h') stepMs = 14400000;

  for (let i = count; i >= 0; i--) {
    const time = now - i * stepMs;
    const d = new Date(time);
    const dateStr = timeframe.includes('m') || timeframe.includes('h')
      ? `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`
      : `${d.getMonth() + 1}/${d.getDate()}`;

    const volatility = 0.012;
    const changePct = (Math.random() - 0.49) * volatility;
    const open = price;
    const close = Number((open * (1 + changePct)).toFixed(cfg.precision));
    const high = Number((Math.max(open, close) * (1 + Math.random() * 0.005)).toFixed(cfg.precision));
    const low = Number((Math.min(open, close) * (1 - Math.random() * 0.005)).toFixed(cfg.precision));
    const volume = Math.floor(Math.random() * 50000) + 15000;

    result.push({
      time,
      dateStr,
      open,
      high,
      low,
      close,
      volume,
    });

    price = close;
  }
  return result;
}
