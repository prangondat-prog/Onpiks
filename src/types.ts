/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type AssetCategory =
  | 'all'
  | 'crypto'
  | 'commodity'
  | 'stock'
  | 'world_stock'
  | 'forex'
  | 'financial'
  | 'healthcare'
  | 'consumer'
  | 'industrial';

export type ActiveTaskView = 'home' | 'trade' | 'updown' | 'analyze' | 'dashboard';

export interface UserTrade {
  id: string;
  symbol: string;
  type: 'LONG' | 'SHORT' | 'BUY' | 'SELL';
  price: number;
  amount: number;
  time: string;
  status: 'OPEN' | 'CLOSED';
  pnl?: number;
  pnlPercent?: number;
  isDemo: boolean;
}

export interface MarketAsset {
  symbol: string;
  name: string;
  category: 'crypto' | 'commodity' | 'stock' | 'world_stock' | 'forex';
  sector?: 'Tech' | 'Financials' | 'Healthcare' | 'Consumer' | 'Industrials' | 'Energy' | 'Crypto' | 'Commodity' | 'Forex';
  region?: string;
  price: number;
  change24h: number;
  change24hPercent: number;
  high24h: number;
  low24h: number;
  volume24h: string;
  currency: string;
  precision: number;
  unit?: string;
  lastUpdated: string;
}

export interface Candle {
  time: number;
  dateStr: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface TechnicalIndicators {
  rsi14: number;
  rsiSignal: 'OVERSOLD' | 'NEUTRAL' | 'OVERBOUGHT';
  sma20: number;
  ema50: number;
  trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS';
  macd: {
    macd: number;
    signal: number;
    histogram: number;
  };
  pivots: {
    pivot: number;
    r1: number;
    r2: number;
    s1: number;
    s2: number;
  };
  atr: number;
}

export interface ExtractedNews {
  id: string;
  title: string;
  source: string;
  url: string;
  snippet: string;
  timeAgo: string;
  sentiment: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  impactScore: number;
  keyFactor: string;
}

export interface GoogleTrendAnalytics {
  searchInterestScore: number;
  searchVelocityPct: string;
  sentimentStatus: 'ACCELERATING' | 'HIGH INTEREST' | 'STABLE CONSOLIDATION' | 'FADING';
  breakoutQueries: string[];
  topRegions: { country: string; interest: number }[];
  searchHistory: { label: string; value: number }[];
  retailVsInstitutional: 'RETAIL ACCUMULATION' | 'INSTITUTIONAL FLOW' | 'BALANCED';
}

export interface GoogleTradeExecution {
  signal: 'BUY / LONG' | 'SELL / SHORT' | 'NEUTRAL / HOLD';
  confidenceScore: number;
  orderType: 'LIMIT BUY' | 'LIMIT SELL' | 'MARKET LONG' | 'MARKET SHORT';
  holdDuration: string;
  timeWindow: string;
  bidAskPressure: {
    buyPressurePct: number;
    sellPressurePct: number;
    ratio: string;
  };
  demandForecast: {
    todayDemandScore: number;
    futureDemandScore: number;
    demandOutlook: string;
  };
  entryPrice: number;
  target1: number;
  target2: number;
  target3: number;
  stopLoss: number;
  riskReward: string;
  suggestedRisk: string;
  checklist: {
    rule: string;
    passed: boolean;
    detail: string;
  }[];
}

export interface PredictedCandle {
  open: number;
  predictedHigh: number;
  predictedLow: number;
  predictedClose: number;
  predictedChangePercent: number;
  color: 'green' | 'red';
  bodyRatio: number;
  upperWickRatio: number;
  lowerWickRatio: number;
  description: string;
}

export interface TradeSetup {
  action: 'BUY / LONG' | 'SELL / SHORT' | 'HOLD / WATCH';
  bias: 'BULLISH' | 'BEARISH' | 'NEUTRAL';
  entryZone: string;
  target1: number;
  target2: number;
  stopLoss: number;
  riskReward: string;
  invalidationLevel: number;
  holdDuration: string;
  strategySummary: string;
}

export interface TradeHistoryItem {
  id: string;
  symbol: string;
  side: 'BUY' | 'SELL';
  entryPrice: number;
  exitPrice: number;
  amount: number;
  pnl: number;
  pnlPercent: number;
  executedTime: string;
  holdTimeStr: string;
  status: 'COMPLETED' | 'CLOSED_PROFIT' | 'STOP_LOSS';
}

export interface PendingOrderItem {
  id: string;
  symbol: string;
  type: 'LIMIT_BUY' | 'LIMIT_SELL' | 'STOP_LIMIT';
  targetEntry: number;
  amount: number;
  tp: number;
  sl: number;
  createdTime: string;
  expiresIn: string;
  status: 'PENDING' | 'WAITING_TRIGGER';
}

export interface BrainPrediction {
  symbol: string;
  assetName: string;
  timestamp: string;
  direction: 'UP' | 'DOWN';
  directionLabel: string;
  upProbability: number;
  downProbability: number;
  confidence: 'HIGH' | 'MODERATE' | 'SPECULATIVE';
  todayCandleStatus: 'FORMING';
  predictedCandle: PredictedCandle;
  tradeSetup: TradeSetup;
  googleTrade: GoogleTradeExecution;
  googleTrends: GoogleTrendAnalytics;
  technicals: TechnicalIndicators;
  newsSentiments: ExtractedNews[];
  tradeHistory: TradeHistoryItem[];
  pendingOrders: PendingOrderItem[];
  brainFactors: {
    newsSentimentScore: number;
    technicalMomentumScore: number;
    googleTrendsScore: number;
    orderFlowScore: number;
    overallScore: number;
    summaryText: string;
    catalysts: string[];
  };
}
