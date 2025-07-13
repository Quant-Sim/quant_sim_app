'use client'; // 클라이언트 전용 컴포넌트임을 Next.js에게 알려줍니다.

import React, { useState, useEffect, useRef } from 'react';
import TradingHeader from '@/app/components/trading/TradingHeader';
import MainChart from '@/app/components/trading/MainChart';
import OrderPanel from '@/app/components/trading/OrderPanel';
import MarketList from '@/app/components/trading/MarketList';

export default function TradingPage() {
  // 현재가
  const [currentPrice, setCurrentPrice] = useState<number>(67_000_000);

  // 잔고: KRW 1억, BTC 0
  const [krwBalance, setKrwBalance] = useState<number>(100_000_000);
  const [btcBalance, setBtcBalance] = useState<number>(0);

  // 첫 세이브 때를 건너뛰기 위한 ref
  const isFirstSave = useRef(true);

  // 1) 마운트 시 localStorage에서 잔고 불러오기
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedKrw = localStorage.getItem('krwBalance');
    const savedBtc = localStorage.getItem('btcBalance');
    if (savedKrw !== null) setKrwBalance(parseFloat(savedKrw));
    if (savedBtc !== null) setBtcBalance(parseFloat(savedBtc));
  }, []); // 빈 배열: 딱 한 번만 실행

  // 2) krwBalance 또는 btcBalance가 바뀔 때 localStorage에 저장
  useEffect(() => {
    // 마운트 직후 첫 렌더링 때는 저장을 건너뛰고
    if (isFirstSave.current) {
      isFirstSave.current = false;
      return;
    }
    if (typeof window === 'undefined') return;
    localStorage.setItem('krwBalance', krwBalance.toString());
    localStorage.setItem('btcBalance', btcBalance.toString());
  }, [krwBalance, btcBalance]);

  // 3) 새 주문이 들어왔을 때 잔고 업데이트
  const handleNewOrder = (order: { type: '매수' | '매도'; price: number; quantity: number }) => {
    const total = order.price * order.quantity;
    if (order.type === '매수') {
      if (krwBalance < total) {
        console.warn('잔고 부족: 매수 불가');
        return;
      }
      setKrwBalance(prev => prev - total);
      setBtcBalance(prev => prev + order.quantity);
    } else {
      if (btcBalance < order.quantity) {
        console.warn('BTC 부족: 매도 불가');
        return;
      }
      setKrwBalance(prev => prev + total);
      setBtcBalance(prev => prev - order.quantity);
    }
  };

  return (
    <main className="bg-gray-50 min-h-screen p-4 flex flex-col">
      {/* 잔고 표시 헤더 */}
     <TradingHeader currentPrice={currentPrice} />

      {/* 메인 레이아웃 */}
      <div className="container mx-auto mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        {/* 좌측: 차트 + 주문 패널 */}
        <div className="lg:col-span-2 flex flex-col gap-4 w-full h-full">
          <MainChart onPriceChange={setCurrentPrice} />
          <OrderPanel
            onNewOrder={handleNewOrder}
            currentPrice={currentPrice}
            krwBalance={krwBalance}
            btcBalance={btcBalance}
          />
        </div>

        {/* 우측: 마켓 리스트 */}
        <div className="lg:col-span-1 h-full">
          <MarketList />
        </div>
      </div>
    </main>
  );
}
