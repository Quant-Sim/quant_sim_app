'use client';

import React, { useState, useMemo } from 'react';
import { FaSearch, FaStar, FaRegStar } from 'react-icons/fa';
import { usePriceWebSocketData } from '@/app/context/PriceContext';

interface MarketListProps {
    symbol: string;
    onSelect: (symbol: string) => void;
}

export default function MarketList({ symbol, onSelect }: MarketListProps) {
    const { stockInfos, prices, buffers } = usePriceWebSocketData();

    const [searchTerm, setSearchTerm] = useState('');
    const [favorites, setFavorites] = useState<Set<string>>(new Set());
    const [activeTab, setActiveTab] = useState<'전체' | '관심'>('전체');

    const toggleFav = (sym: string) => {
        setFavorites(prev => {
            const next = new Set(prev);
            if (next.has(sym)) next.delete(sym);
            else next.add(sym);
            return next;
        });
    };

    const filtered = useMemo(() => {
        return stockInfos.filter(s =>
            (activeTab === '전체' || favorites.has(s.symbol)) &&
            (s.name.includes(searchTerm) || s.symbol.includes(searchTerm))
        );
    }, [stockInfos, favorites, activeTab, searchTerm]);

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
                        onClick={() => setActiveTab(tab as '전체' | '관심')}
                        className={`flex-1 py-2 text-xs font-semibold ${
                            activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-500'
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
                <div className="col-span-1" />
            </div>

            {/* 종목 리스트 */}
            <ul className="overflow-auto flex-1">
                {filtered.map(info => {
                    const priceData = prices[info.symbol];
                    const price = priceData?.candle?.close ?? 0;
                    const volume = priceData?.volume?.value ?? 0;
                    const buffer = buffers.current[info.symbol] ?? [];
                    const prevCandle = buffer.length > 1 ? buffer[buffer.length - 2].candle : null;
                    const prevClose = prevCandle?.close ?? 0;
                    const currentClose = priceData?.candle.close ?? 0;
                    const change = prevClose > 0 ? ((currentClose - prevClose) / prevClose) * 100 : 0;

                    const isUp = change >= 0;

                    return (
                        <li
                            key={info.symbol}
                            onClick={() => onSelect(info.symbol)}
                            className={`grid grid-cols-10 items-center p-2 border-b hover:bg-gray-100 cursor-pointer ${
                                symbol === info.symbol ? 'bg-gray-100 font-bold' : ''
                            }`}
                        >
                            <div className="col-span-3 text-left">
                                <p className="font-bold">{info.name}</p>
                                <p className="text-xs text-gray-400">{info.symbol}</p>
                            </div>
                            <div className="col-span-2 text-right font-semibold">
                                {nfKRW.format(price)}
                            </div>
                            <div className={`col-span-2 text-right text-xs ${isUp ? 'text-red-500' : 'text-blue-500'}`}>
                                {isUp ? '+' : ''}
                                {nfPct.format(change)}%
                            </div>
                            <div className="col-span-2 text-right text-xs">
                                {nfKRW.format(Math.round(volume / 100000000))}
                            </div>
                            <div className="col-span-1 flex justify-center">
                                {favorites.has(info.symbol) ? (
                                    <FaStar className="text-yellow-500" onClick={() => toggleFav(info.symbol)} />
                                ) : (
                                    <FaRegStar onClick={() => toggleFav(info.symbol)} />
                                )}
                            </div>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}
