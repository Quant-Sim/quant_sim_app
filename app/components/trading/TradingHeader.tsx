'use client';

import React, {useState, useRef, useEffect, useMemo} from 'react';
import {FaBitcoin, FaCog} from 'react-icons/fa';
import {StockInfo, usePriceWebSocketData} from "@/app/context/PriceContext";

interface TradingHeaderProps {
    symbol: string;
}

export default function TradingHeader({symbol}: TradingHeaderProps) {
    const { prices, stockInfos } = usePriceWebSocketData();
    const priceData = prices[symbol];
    const stockInfo = stockInfos.find((info) => info.symbol === symbol);

    const currentPrice = priceData?.candle?.close ?? 0;
    const [activeTab, setActiveTab] = useState<'시세' | '정보'>('시세');
    const prevPriceRef = useRef<number>(currentPrice);

    const prevPrice = prevPriceRef.current;
    const diff = currentPrice - prevPrice;
    const pct = prevPrice > 0 ? (diff / prevPrice) * 100 : 0;
    const isUp = diff >= 0;

    useEffect(() => {
        prevPriceRef.current = currentPrice;
    }, [currentPrice]);

    // 숫자 포맷터
    const nfKRW = useMemo(
        () => new Intl.NumberFormat('ko-KR'),
        []
    );

    const nfPct = useMemo(
        () =>
            new Intl.NumberFormat('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            }),
        []
    );

    if (!stockInfo) {
        return <div className="p-4">종목 정보를 불러오는 중...</div>;
    }

    return (
        <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <FaBitcoin className="text-4xl text-yellow-500" />
                    <div>
                        {/* 타이틀 */}
                        <h2 className="text-xl font-bold">
                            {stockInfo.name}{' '}
                            <span className="text-sm font-normal text-gray-500">
                {stockInfo.symbol}/KRW
              </span>
                        </h2>
                        {/* 현재가 */}
                        <p className="text-2xl font-bold text-red-500 mt-1">
                            {nfKRW.format(currentPrice)}{' '}
                            <span className="text-lg font-normal">KRW</span>
                        </p>
                        {/* 등락률 + 등락폭 */}
                        <p
                            className={`text-sm font-semibold ${
                                isUp ? 'text-red-500' : 'text-blue-500'
                            }`}
                        >
                            {isUp && '+'}
                            {nfPct.format(pct)}% {isUp ? '▲' : '▼'}
                            {nfKRW.format(Math.abs(diff))}
                        </p>
                    </div>
                </div>

                <div className="flex items-start self-start gap-4">
                    {/* 탭 */}
                    <div className="flex border-b">
                        {['시세', '정보'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`px-6 py-2 text-sm font-semibold ${
                                    activeTab === tab
                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                        : 'text-gray-500'
                                }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                    <button className="p-2 text-gray-500 hover:text-gray-800">
                        <FaCog className="text-xl" />
                    </button>
                </div>
            </div>

            {activeTab === '정보' && (
                <div className="mt-4 text-sm text-gray-700 space-y-2">
                    <p>
                        회사 소개 :{' '}
                        <span className="font-semibold">
              {stockInfo.sector || '알 수 없음'}
            </span>
                    </p>
                    <p>
                        산업군 : <span className="font-semibold">{stockInfo.industry || '-'}</span>
                    </p>
                </div>
            )}
        </div>
    );
}