'use client';

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaStar, FaRegStar } from 'react-icons/fa';

interface Ticker {
  name: string;
  symbol: string;
  price: number;      // 현재가 (숫자)
  change: number;     // 전일대비 등락률(%)
  volume: number;     // 거래대금 (억 단위)
}

const initialData: Ticker[] = [
  { name: '삼성전자', symbol: '005930.KS', price: 75_000,  change: 1.20, volume: 3_500 },
  { name: '네이버',   symbol: '035420.KS', price: 150_500, change: -0.50, volume: 1_200 },
  { name: '카카오',   symbol: '035720.KS', price: 90_250,  change: 0.80,  volume:   900 },
  { name: 'SK하이닉스', symbol: '000660.KS', price: 120_000, change: 2.00,  volume: 2_000 },
  { name: '현대차',   symbol: '005380.KS', price: 230_000, change: -1.10, volume: 1_800 },
];

export default function MarketList() {
  const [searchTerm, setSearchTerm] = useState('');
  const [tickers, setTickers] = useState<Ticker[]>(initialData);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [activeTab, setActiveTab] = useState<'전체' | '관심'>('전체');
  const timerRef = useRef<number>();

  // 1초마다 가격·등락·거래대금 랜덤 업데이트
  useEffect(() => {
    timerRef.current = window.setInterval(() => {
      setTickers(prev =>
        prev.map(t => {
          const deltaPct = (Math.random() * 2 - 1) * 1; // -1% ~ +1%
          const newPrice = Math.max(1, Math.round(t.price * (1 + deltaPct / 100)));
          const change = ((newPrice - t.price) / t.price) * 100;
          const volume = Math.round(800 + Math.random() * 3200);
          return { ...t, price: newPrice, change, volume };
        })
      );
    }, 1000);
    return () => window.clearInterval(timerRef.current);
  }, []);

  // 검색 + 탭 필터링
  const base = tickers.filter(t =>
    t.name.includes(searchTerm) || t.symbol.includes(searchTerm)
  );
  const filtered = activeTab === '관심'
    ? base.filter(t => favorites.has(t.symbol))
    : base;

  // 즐겨찾기 토글
  const toggleFav = (symbol: string) => {
    setFavorites(fav => {
      const next = new Set(fav);
      if (next.has(symbol)) next.delete(symbol);
      else next.add(symbol);
      return next;
    });
  };

  // 포맷터
  const nfKRW = new Intl.NumberFormat('ko-KR');
  const nfPct = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="bg-white rounded-lg shadow-sm h-full text-sm flex flex-col">
      {/* 검색창 */}
      <div className="p-2">
        <div className="relative">
          <input
            type="text"
            placeholder="종목명/심볼 검색"
            className="w-full bg-gray-100 rounded p-2 pl-8 text-xs"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
          <FaSearch className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b">
        {['전체', '관심'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`flex-1 py-2 text-xs font-semibold ${
              activeTab === tab
                ? 'border-b-2 border-black text-black'
                : 'text-gray-500'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 헤더 */}
      <div className="text-xs text-gray-500 grid grid-cols-10 gap-1 text-center p-2 bg-gray-50">
        <div className="col-span-3 text-left">한글명</div>
        <div className="col-span-2 text-right">현재가</div>
        <div className="col-span-2 text-right">전일대비</div>
        <div className="col-span-2 text-right">거래대금(억)</div>
        <div className="col-span-1"></div>
      </div>

      {/* 종목 리스트 */}
      <ul className="overflow-auto flex-1">
        {filtered.map(t => {
          const isUp = t.change >= 0;
          return (
            <li
              key={t.symbol}
              className="grid grid-cols-10 items-center p-2 border-b hover:bg-gray-50 cursor-default"
            >
              {/* 이름/심볼 */}
              <div className="col-span-3 text-left">
                <p className="font-bold">{t.name}</p>
                <p className="text-xs text-gray-400">{t.symbol}</p>
              </div>
              {/* 현재가 */}
              <div className="col-span-2 text-right font-semibold">
                {nfKRW.format(t.price)}
              </div>
              {/* 등락률 */}
              <div className={`col-span-2 text-right text-xs ${isUp ? 'text-red-500' : 'text-blue-500'}`}>
                {isUp ? '+' : ''}{nfPct.format(t.change)}%
              </div>
              {/* 거래대금 */}
              <div className="col-span-2 text-right text-xs">
                {nfKRW.format(t.volume)}
              </div>
              {/* 즐겨찾기 */}
              <div className="col-span-1 flex justify-center">
                {favorites.has(t.symbol) ? (
                  <FaStar className="text-yellow-500" onClick={() => toggleFav(t.symbol)} />
                ) : (
                  <FaRegStar onClick={() => toggleFav(t.symbol)} />
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
