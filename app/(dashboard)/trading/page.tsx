'use client';

import React, {useState, useRef, useMemo, useCallback, useEffect} from 'react';
import TradingHeader from '@/app/components/trading/TradingHeader';
import MainChart from '@/app/components/trading/MainChart';
import OrderPanel from '@/app/components/trading/OrderPanel';
import MarketList from '@/app/components/trading/MarketList';
import {usePriceWebSocketData, StockInfo} from '@/app/context/PriceContext';
import {useUser} from '@/app/context/UserContext';

export default function TradingPage() {

    const {stockInfos} = usePriceWebSocketData();  // { BTC: { candle, volume, ... } }
    const {user} = useUser();

    const [btcBalance, setBtcBalance] = useState<number>(0);
    const [currentStockInfo, setcurrentStockInfo] = useState<StockInfo>({
        symbol: 'BTC',
        name: '비트코인',
        sector: '',
        industry: ''
    });
    const krwBalance = useMemo(() => user?.balance ?? 0, [user]);

    const handleNewOrder = useCallback((order: { type: '매수' | '매도'; price: number; quantity: number }) => {
        const total = order.price * order.quantity;

        if (order.type === '매수') {
            if (krwBalance < total) {
                console.warn('잔고 부족: 매수 불가');
                return;
            }
        }
    }, [krwBalance, btcBalance]);

    return (
        <main className="bg-gray-50 min-h-screen p-4 flex flex-col">
            {/* 상단: 잔고 및 현재가 표시 */}
            <TradingHeader
                symbol={currentStockInfo.symbol}
            />

            {/* 메인 레이아웃 */}
            <div className="container mx-auto mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
                {/* 좌측: 차트 + 주문 */}
                <div className="lg:col-span-2 flex flex-col gap-4 w-full h-full">
                    <MainChart
                        symbol={currentStockInfo.symbol}
                    />
                    <OrderPanel
                        onNewOrder={handleNewOrder}
                        symbol={currentStockInfo.symbol}
                    />
                </div>

                {/* 우측: 마켓 선택 */}
                <div className="lg:col-span-1 h-full">
                    <MarketList
                        symbol={currentStockInfo.symbol}
                        onSelect={(info) => {
                            setcurrentStockInfo(stockInfos.find(stock => stock.symbol === info)
                                ?? {
                                    symbol: 'BTC',
                                    name: '비트코인',
                                    sector: '',
                                    industry: ''
                                });
                        }}
                    />
                </div>
            </div>
        </main>
    );
}
