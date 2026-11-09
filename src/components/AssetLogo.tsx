/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AssetLogoProps {
  symbol: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

export const AssetLogo: React.FC<AssetLogoProps> = ({ symbol, size = 'sm' }) => {
  const sizeClasses = {
    xs: 'w-4 h-4 text-[8px]',
    sm: 'w-5 h-5 text-[10px]',
    md: 'w-7 h-7 text-xs',
    lg: 'w-9 h-9 text-sm',
  }[size];

  // Map each symbol to an authentic round small logo/badge
  const getLogoConfig = (sym: string) => {
    switch (sym) {
      // Crypto
      case 'BTC/USD':
        return { bg: 'bg-[#F7931A]', text: 'text-white font-bold', content: '₿', title: 'Bitcoin' };
      case 'ETH/USD':
        return { bg: 'bg-[#627EEA]', text: 'text-white font-bold', content: 'Ξ', title: 'Ethereum' };
      case 'SOL/USD':
        return { bg: 'bg-gradient-to-tr from-[#9945FF] to-[#14F195]', text: 'text-white font-black', content: '◎', title: 'Solana' };
      case 'BNB/USD':
        return { bg: 'bg-[#F3BA2F]', text: 'text-neutral-900 font-bold', content: '⬡', title: 'BNB' };
      case 'XRP/USD':
        return { bg: 'bg-black', text: 'text-white font-black', content: '✕', title: 'XRP' };

      // Commodities & Oil
      case 'OIL_WTI':
        return { bg: 'bg-neutral-900 border border-neutral-700', text: 'text-amber-400 font-black', content: '🛢', title: 'Crude Oil WTI' };
      case 'OIL_BRENT':
        return { bg: 'bg-neutral-800 border border-neutral-700', text: 'text-amber-300 font-black', content: '🛢', title: 'Brent Oil' };
      case 'GOLD':
        return { bg: 'bg-[#EAB308]', text: 'text-neutral-950 font-black', content: 'Au', title: 'Gold XAU' };
      case 'SILVER':
        return { bg: 'bg-neutral-300 border border-neutral-400', text: 'text-neutral-900 font-bold', content: 'Ag', title: 'Silver XAG' };
      case 'NATGAS':
        return { bg: 'bg-sky-500', text: 'text-white font-bold', content: '🔥', title: 'Natural Gas' };

      // Tech Giants
      case 'NVDA':
        return { bg: 'bg-[#76B900]', text: 'text-white font-black', content: 'N', title: 'NVIDIA' };
      case 'AAPL':
        return { bg: 'bg-neutral-900', text: 'text-white font-bold', content: '', title: 'Apple' };
      case 'TSLA':
        return { bg: 'bg-[#E82127]', text: 'text-white font-black', content: 'T', title: 'Tesla' };
      case 'MSFT':
        return { bg: 'bg-[#00A4EF]', text: 'text-white font-bold', content: '田', title: 'Microsoft' };
      case 'AMZN':
        return { bg: 'bg-[#FF9900]', text: 'text-black font-black', content: 'a', title: 'Amazon' };
      case 'GOOGL':
        return { bg: 'bg-[#4285F4]', text: 'text-white font-black', content: 'G', title: 'Alphabet Google' };
      case 'META':
        return { bg: 'bg-[#0668E1]', text: 'text-white font-black', content: 'M', title: 'Meta' };
      case 'AMD':
        return { bg: 'bg-[#ED1C24]', text: 'text-white font-bold text-[8px]', content: 'AMD', title: 'AMD' };
      case 'INTC':
        return { bg: 'bg-[#0071C5]', text: 'text-white font-bold text-[9px]', content: 'intel', title: 'Intel' };
      case 'NFLX':
        return { bg: 'bg-[#E50914]', text: 'text-white font-black', content: 'N', title: 'Netflix' };
      case 'CRM':
        return { bg: 'bg-[#00A1E0]', text: 'text-white font-bold text-[9px]', content: 'sf', title: 'Salesforce' };
      case 'ADBE':
        return { bg: 'bg-[#FF0000]', text: 'text-white font-black', content: 'A', title: 'Adobe' };

      // Financials & Payments
      case 'JPM':
        return { bg: 'bg-[#117ACA]', text: 'text-white font-bold text-[8px]', content: 'JPM', title: 'JPMorgan Chase' };
      case 'BAC':
        return { bg: 'bg-[#E31837]', text: 'text-white font-bold text-[8px]', content: 'BofA', title: 'Bank of America' };
      case 'GS':
        return { bg: 'bg-[#7399C6]', text: 'text-white font-bold text-[9px]', content: 'GS', title: 'Goldman Sachs' };
      case 'MS':
        return { bg: 'bg-[#002B49]', text: 'text-white font-bold text-[9px]', content: 'MS', title: 'Morgan Stanley' };
      case 'BRK.B':
        return { bg: 'bg-[#183059]', text: 'text-white font-bold text-[8px]', content: 'BRK', title: 'Berkshire Hathaway' };
      case 'V':
        return { bg: 'bg-[#1A1F71]', text: 'text-[#F7B600] font-black', content: 'V', title: 'Visa' };
      case 'MA':
        return { bg: 'bg-[#EB001B]', text: 'text-[#F79E1B] font-bold text-[8px]', content: 'MC', title: 'Mastercard' };
      case 'PYPL':
        return { bg: 'bg-[#003087]', text: 'text-[#0079C1] font-black', content: 'P', title: 'PayPal' };
      case 'C':
        return { bg: 'bg-[#003B70]', text: 'text-red-500 font-bold', content: 'citi', title: 'Citigroup' };
      case 'WFC':
        return { bg: 'bg-[#D71E28]', text: 'text-[#FFCD41] font-bold text-[8px]', content: 'WFC', title: 'Wells Fargo' };

      // Healthcare & Pharmaceuticals
      case 'JNJ':
        return { bg: 'bg-[#D51900]', text: 'text-white font-bold text-[8px]', content: 'JNJ', title: 'Johnson & Johnson' };
      case 'LLY':
        return { bg: 'bg-[#D52B1E]', text: 'text-white font-serif font-bold', content: 'Lilly', title: 'Eli Lilly' };
      case 'PFE':
        return { bg: 'bg-[#0093D0]', text: 'text-white font-bold text-[8px]', content: 'PFE', title: 'Pfizer' };
      case 'MRK':
        return { bg: 'bg-[#00857C]', text: 'text-white font-bold text-[8px]', content: 'MRK', title: 'Merck' };
      case 'ABBV':
        return { bg: 'bg-[#00143C]', text: 'text-cyan-400 font-bold text-[8px]', content: 'abbv', title: 'AbbVie' };
      case 'UNH':
        return { bg: 'bg-[#002677]', text: 'text-white font-bold text-[8px]', content: 'UNH', title: 'UnitedHealth' };
      case 'CVS':
        return { bg: 'bg-[#CC0000]', text: 'text-white font-bold text-[8px]', content: 'CVS', title: 'CVS Health' };
      case 'MRNA':
        return { bg: 'bg-[#ED1B2D]', text: 'text-white font-bold text-[8px]', content: 'MRNA', title: 'Moderna' };

      // Consumer Goods & Retail
      case 'WMT':
        return { bg: 'bg-[#0071CE]', text: 'text-[#FFC220] font-black', content: '✻', title: 'Walmart' };
      case 'PG':
        return { bg: 'bg-[#003CAE]', text: 'text-white font-bold text-[9px]', content: 'P&G', title: 'Procter & Gamble' };
      case 'KO':
        return { bg: 'bg-[#F40009]', text: 'text-white font-serif font-bold text-[9px]', content: 'Coke', title: 'Coca-Cola' };
      case 'PEP':
        return { bg: 'bg-[#004B93]', text: 'text-white font-bold text-[9px]', content: 'PEP', title: 'PepsiCo' };
      case 'COST':
        return { bg: 'bg-[#005DAA]', text: 'text-[#E31837] font-black text-[8px]', content: 'COST', title: 'Costco' };
      case 'HD':
        return { bg: 'bg-[#F96302]', text: 'text-white font-black text-[9px]', content: 'HD', title: 'Home Depot' };
      case 'NKE':
        return { bg: 'bg-black', text: 'text-white font-black text-[9px]', content: '✔', title: 'Nike' };
      case 'MCD':
        return { bg: 'bg-[#DA291C]', text: 'text-[#FFC72C] font-black', content: 'M', title: "McDonald's" };
      case 'SBUX':
        return { bg: 'bg-[#006241]', text: 'text-white font-bold text-[8px]', content: '★', title: 'Starbucks' };
      case 'TGT':
        return { bg: 'bg-[#CC0000]', text: 'text-white font-bold', content: '◎', title: 'Target' };

      // Industrials, Energy & Materials
      case 'XOM':
        return { bg: 'bg-[#ED1B2D]', text: 'text-white font-black text-[8px]', content: 'XOM', title: 'ExxonMobil' };
      case 'CVX':
        return { bg: 'bg-[#005480]', text: 'text-white font-bold text-[8px]', content: 'CVX', title: 'Chevron' };
      case 'GE':
        return { bg: 'bg-[#005CA9]', text: 'text-white font-serif font-bold text-[9px]', content: 'GE', title: 'General Electric' };
      case 'CAT':
        return { bg: 'bg-[#FFCD11]', text: 'text-black font-black text-[8px]', content: 'CAT', title: 'Caterpillar' };
      case 'BA':
        return { bg: 'bg-[#0033A0]', text: 'text-white font-bold text-[9px]', content: 'BA', title: 'Boeing' };
      case 'FDX':
        return { bg: 'bg-[#4D148C]', text: 'text-[#FF6600] font-black text-[8px]', content: 'FDX', title: 'FedEx' };
      case 'UPS':
        return { bg: 'bg-[#351C15]', text: 'text-[#FFB500] font-bold text-[8px]', content: 'UPS', title: 'UPS' };
      case 'MMM':
        return { bg: 'bg-[#FF0000]', text: 'text-white font-black text-[9px]', content: '3M', title: '3M' };
      case 'F':
        return { bg: 'bg-[#002C6C]', text: 'text-white font-serif font-bold', content: 'Ford', title: 'Ford' };
      case 'GM':
        return { bg: 'bg-[#00539B]', text: 'text-white font-bold text-[9px]', content: 'gm', title: 'General Motors' };

      // World Stocks & Indices
      case 'TSM':
        return { bg: 'bg-[#D92D20]', text: 'text-white font-black text-[9px]', content: 'TSM', title: 'TSMC Taiwan' };
      case '^N225':
        return { bg: 'bg-white border border-rose-300 shadow-xs', text: 'text-rose-600 font-black text-[9px]', content: 'JP', title: 'Nikkei 225 Japan' };
      case '^FTSE':
        return { bg: 'bg-[#0B1E36]', text: 'text-white font-bold text-[9px]', content: 'UK', title: 'FTSE 100 London' };
      case '^GDAXI':
        return { bg: 'bg-neutral-900 border border-amber-400', text: 'text-amber-400 font-bold text-[9px]', content: 'DE', title: 'DAX 40 Germany' };
      case 'BABA':
        return { bg: 'bg-[#FF6A00]', text: 'text-white font-black', content: 'B', title: 'Alibaba' };
      case 'ASML':
        return { bg: 'bg-[#0A2540]', text: 'text-white font-bold text-[9px]', content: 'AS', title: 'ASML Europe' };
      case 'SPY':
        return { bg: 'bg-[#0F172A]', text: 'text-white font-mono font-bold text-[9px]', content: 'S&P', title: 'SPDR S&P 500' };
      case 'QQQ':
        return { bg: 'bg-[#1E3A8A]', text: 'text-white font-mono font-bold text-[9px]', content: 'QQQ', title: 'Nasdaq 100' };

      // Forex Pairs & DXY
      case 'DXY':
        return { bg: 'bg-neutral-900 border border-emerald-500', text: 'text-emerald-400 font-black text-[9px]', content: 'DXY', title: 'US Dollar Index' };
      case 'EUR/USD':
        return { bg: 'bg-[#003399]', text: 'text-white font-bold', content: '€', title: 'EUR/USD' };
      case 'GBP/USD':
        return { bg: 'bg-[#C8102E]', text: 'text-white font-bold', content: '£', title: 'GBP/USD' };
      case 'USD/JPY':
        return { bg: 'bg-[#BC002D]', text: 'text-white font-bold', content: '¥', title: 'USD/JPY' };
      case 'AUD/USD':
        return { bg: 'bg-[#00843D]', text: 'text-white font-bold text-[9px]', content: 'A$', title: 'AUD/USD' };
      case 'USD/CAD':
        return { bg: 'bg-[#D52B1E]', text: 'text-white font-bold text-[9px]', content: 'C$', title: 'USD/CAD' };
      case 'USD/CHF':
        return { bg: 'bg-[#D52B1E]', text: 'text-white font-bold text-[9px]', content: 'Fr', title: 'Swiss Franc' };
      case 'USD/CNY':
        return { bg: 'bg-[#DE2910]', text: 'text-amber-300 font-bold', content: '¥', title: 'Chinese Yuan' };
      case 'USD/INR':
        return { bg: 'bg-[#FF9933]', text: 'text-white font-bold', content: '₹', title: 'Indian Rupee' };
      case 'USD/MXN':
        return { bg: 'bg-[#006847]', text: 'text-white font-bold text-[8px]', content: 'MX$', title: 'Mexican Peso' };
      case 'USD/BRL':
        return { bg: 'bg-[#009739]', text: 'text-yellow-300 font-bold text-[8px]', content: 'R$', title: 'Brazilian Real' };
      case 'USD/SGD':
        return { bg: 'bg-[#EF3340]', text: 'text-white font-bold text-[8px]', content: 'S$', title: 'Singapore Dollar' };
      case 'NZD/USD':
        return { bg: 'bg-[#00247D]', text: 'text-white font-bold text-[8px]', content: 'NZ$', title: 'New Zealand Dollar' };
      case 'USD/KRW':
        return { bg: 'bg-white border border-neutral-300', text: 'text-rose-600 font-bold', content: '₩', title: 'Korean Won' };
      case 'USD/ZAR':
        return { bg: 'bg-[#007A4D]', text: 'text-amber-400 font-bold text-[8px]', content: 'R', title: 'South African Rand' };

      default:
        return { bg: 'bg-neutral-800', text: 'text-white font-bold text-[9px]', content: sym.replace('^', '').slice(0, 3), title: sym };
    }
  };

  const config = getLogoConfig(symbol);

  return (
    <span
      className={`${sizeClasses} ${config.bg} ${config.text} rounded-full flex items-center justify-center shrink-0 shadow-xs select-none`}
      title={config.title}
    >
      {config.content}
    </span>
  );
};
