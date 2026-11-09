/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Candle, TechnicalIndicators } from '../types.js';

export function calculateTechnicals(candles: Candle[]): TechnicalIndicators {
  if (candles.length < 5) {
    const lastPrice = candles[candles.length - 1]?.close || 100;
    return {
      rsi14: 50,
      rsiSignal: 'NEUTRAL',
      sma20: lastPrice,
      ema50: lastPrice,
      trend: 'SIDEWAYS',
      macd: { macd: 0, signal: 0, histogram: 0 },
      pivots: {
        pivot: lastPrice,
        r1: lastPrice * 1.01,
        r2: lastPrice * 1.02,
        s1: lastPrice * 0.99,
        s2: lastPrice * 0.98,
      },
      atr: lastPrice * 0.015,
    };
  }

  const closes = candles.map((c) => c.close);
  const len = closes.length;
  const currentClose = closes[len - 1];

  // RSI 14
  let rsi14 = 50;
  if (len >= 15) {
    let gains = 0;
    let losses = 0;
    for (let i = len - 14; i < len; i++) {
      const diff = closes[i] - closes[i - 1];
      if (diff >= 0) gains += diff;
      else losses += Math.abs(diff);
    }
    const avgGain = gains / 14;
    const avgLoss = losses / 14;
    if (avgLoss === 0) {
      rsi14 = 100;
    } else {
      const rs = avgGain / avgLoss;
      rsi14 = Number((100 - 100 / (1 + rs)).toFixed(1));
    }
  }

  let rsiSignal: 'OVERSOLD' | 'NEUTRAL' | 'OVERBOUGHT' = 'NEUTRAL';
  if (rsi14 >= 70) rsiSignal = 'OVERBOUGHT';
  else if (rsi14 <= 30) rsiSignal = 'OVERSOLD';

  // SMA 20
  const smaPeriod = Math.min(20, len);
  const smaSlice = closes.slice(len - smaPeriod);
  const sma20 = Number((smaSlice.reduce((a, b) => a + b, 0) / smaPeriod).toFixed(2));

  // EMA 50
  const emaPeriod = Math.min(50, len);
  const k = 2 / (emaPeriod + 1);
  let ema50 = closes[len - emaPeriod] || currentClose;
  for (let i = len - emaPeriod + 1; i < len; i++) {
    ema50 = closes[i] * k + ema50 * (1 - k);
  }
  ema50 = Number(ema50.toFixed(2));

  // Trend detection
  let trend: 'BULLISH' | 'BEARISH' | 'SIDEWAYS' = 'SIDEWAYS';
  if (currentClose > sma20 && sma20 > ema50) {
    trend = 'BULLISH';
  } else if (currentClose < sma20 && sma20 < ema50) {
    trend = 'BEARISH';
  } else if (currentClose > sma20) {
    trend = 'BULLISH';
  } else if (currentClose < sma20) {
    trend = 'BEARISH';
  }

  // MACD (12, 26, 9)
  const calcEMA = (data: number[], period: number) => {
    const factor = 2 / (period + 1);
    let val = data[0];
    for (let i = 1; i < data.length; i++) {
      val = data[i] * factor + val * (1 - factor);
    }
    return val;
  };

  let macdVal = 0;
  let signalVal = 0;
  let histVal = 0;
  if (len >= 26) {
    const ema12 = calcEMA(closes.slice(-12), 12);
    const ema26 = calcEMA(closes.slice(-26), 26);
    macdVal = Number((ema12 - ema26).toFixed(2));
    signalVal = Number((macdVal * 0.8).toFixed(2)); // approximate 9-period smoothing
    histVal = Number((macdVal - signalVal).toFixed(2));
  }

  // Pivot Points using previous completed candle
  const prevCandle = candles[len - 2] || candles[len - 1];
  const high = prevCandle.high;
  const low = prevCandle.low;
  const close = prevCandle.close;

  const pivot = Number(((high + low + close) / 3).toFixed(2));
  const r1 = Number((2 * pivot - low).toFixed(2));
  const s1 = Number((2 * pivot - high).toFixed(2));
  const r2 = Number((pivot + (high - low)).toFixed(2));
  const s2 = Number((pivot - (high - low)).toFixed(2));

  // Average True Range (ATR 14)
  let trSum = 0;
  const atrPeriod = Math.min(14, len - 1);
  for (let i = len - atrPeriod; i < len; i++) {
    const c = candles[i];
    const prevC = candles[i - 1];
    const tr = Math.max(
      c.high - c.low,
      Math.abs(c.high - prevC.close),
      Math.abs(c.low - prevC.close)
    );
    trSum += tr;
  }
  const atr = Number((trSum / (atrPeriod || 1)).toFixed(2));

  return {
    rsi14,
    rsiSignal,
    sma20,
    ema50,
    trend,
    macd: {
      macd: macdVal,
      signal: signalVal,
      histogram: histVal,
    },
    pivots: {
      pivot,
      r1,
      r2,
      s1,
      s2,
    },
    atr,
  };
}
