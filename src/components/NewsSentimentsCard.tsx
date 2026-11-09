/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ExtractedNews } from '../types.js';
import { Newspaper, ExternalLink, TrendingUp, TrendingDown, Minus, Image as ImageIcon } from 'lucide-react';

interface NewsSentimentsCardProps {
  news: ExtractedNews[];
  symbol: string;
  assetName: string;
}

export const NewsSentimentsCard: React.FC<NewsSentimentsCardProps> = ({
  news,
  symbol,
  assetName,
}) => {
  const [filterSentiment, setFilterSentiment] = useState<'ALL' | 'BULLISH' | 'BEARISH'>('ALL');

  const filteredNews = useMemo(() => {
    if (filterSentiment === 'ALL') return news;
    return news.filter((n) => n.sentiment === filterSentiment);
  }, [news, filterSentiment]);

  // High-resolution 4:3 and 3:4 finance photography URLs
  const hdImages43 = [
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1642543492481-44e81e3914a7?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1621416894569-0f39ed31d247?w=800&auto=format&fit=crop&q=85',
    'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&auto=format&fit=crop&q=85',
  ];

  return (
    <div className="w-full bg-white border border-neutral-200 rounded-lg p-5 shadow-xs">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-neutral-200 gap-2">
        <div className="flex items-center gap-2">
          <Newspaper className="w-5 h-5 text-black" />
          <h2 className="text-base font-bold text-black font-sans">
            Real-Time News Sentiments & Visual Intelligence
          </h2>
        </div>

        {/* Sentiment Filter Tabs */}
        <div className="flex items-center gap-1 bg-neutral-100 p-0.5 rounded-md border border-neutral-200 text-xs font-mono">
          {(['ALL', 'BULLISH', 'BEARISH'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterSentiment(mode)}
              className={`px-2.5 py-1 rounded font-semibold text-[11px] transition-colors cursor-pointer ${
                filterSentiment === mode
                  ? 'bg-white text-black shadow-xs'
                  : 'text-neutral-500 hover:text-black'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Intro Subtitle */}
      <p className="text-xs text-neutral-500 my-3">
        Real-time market press analyzed for <strong className="text-black">{assetName} ({symbol})</strong> with high-resolution 4:3 visual holders and impact scoring.
      </p>

      {/* News Cards List with 4:3 HD Image Holders */}
      <div className="space-y-4">
        {filteredNews.map((item, idx) => {
          const isBull = item.sentiment === 'BULLISH';
          const isBear = item.sentiment === 'BEARISH';
          const imgUrl = hdImages43[idx % hdImages43.length];

          return (
            <div
              key={item.id}
              className="p-4 bg-white border border-neutral-200 rounded-lg hover:border-black transition-colors flex flex-col md:flex-row gap-4 items-start"
            >
              {/* High Resolution 4:3 Aspect Ratio Image Holder */}
              <div className="w-full md:w-36 aspect-[4/3] rounded-md bg-neutral-100 border border-neutral-200 overflow-hidden shrink-0 relative flex items-center justify-center">
                <img
                  src={imgUrl}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
                <span className="absolute bottom-1 right-1 px-1.5 py-0.5 bg-black/80 text-white text-[9px] font-mono font-bold rounded">
                  4:3 HD
                </span>
              </div>

              {/* Content Column */}
              <div className="flex-1 space-y-1.5 min-w-0">
                {/* Source & Timestamp */}
                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <span className="font-bold text-black">{item.source}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-neutral-500">{item.timeAgo}</span>
                  <span className="text-neutral-300">·</span>
                  <span className="text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded text-[10px] font-bold">
                    {item.keyFactor}
                  </span>
                </div>

                {/* Headline */}
                <h3 className="text-sm font-bold text-black leading-snug font-sans">
                  {item.title}
                </h3>

                {/* Snippet */}
                <p className="text-xs text-neutral-600 leading-relaxed font-sans">
                  {item.snippet}
                </p>

                {/* Bottom link / sentiment */}
                <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-[11px] font-mono">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-800 hover:text-black font-semibold flex items-center gap-1.5"
                  >
                    <span>Read full report</span>
                    <ExternalLink className="w-3.5 h-3.5 text-neutral-500" />
                  </a>

                  <span
                    className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                      isBull
                        ? 'bg-emerald-100 text-emerald-800'
                        : isBear
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-neutral-100 text-neutral-800'
                    }`}
                  >
                    {item.sentiment} ({item.impactScore >= 0 ? '+' : ''}{item.impactScore})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
