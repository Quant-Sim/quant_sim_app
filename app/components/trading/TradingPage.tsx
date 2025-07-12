'use client'; // 클라이언트 컴포넌트임을 명시 (가장 중요)

import React, { useState, useEffect } from 'react';
// 프로젝트 구조에 맞게 경로를 조정하세요.
import TradingHeader from '@/app/components/trading/TradingHeader';
import MainChart from '@/app/components/trading/MainChart';
import OrderPanel, { Order } from '@/app/components/trading/OrderPanel'; // Order 타입 임포트
import MarketList from '@/app/components/trading/MarketList';

export default function TradingPage() {
  // 주문 목록 상태를 관리합니다. 초기값은 빈 배열로 설정하고, 클라이언트에서 localStorage 로드
  const [orders, setOrders] = useState<Order[]>([]);

  // 현재가를 상태로 관리합니다. MainChart에서 받은 값으로 업데이트됩니다.
  const [currentPrice, setCurrentPrice] = useState<number>(67000000); // 초기값 설정

  // 사용자 잔고 상태 추가 (localStorage에서 로드)
  const [krwBalance, setKrwBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedBalance = localStorage.getItem('krwBalance');
      return savedBalance ? parseFloat(savedBalance) : 100000000; // 초기 잔고 1억원 (기본값)
    }
    return 100000000;
  });

  const [btcBalance, setBtcBalance] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedBalance = localStorage.getItem('btcBalance');
      return savedBalance ? parseFloat(savedBalance) : 0; // 초기 BTC 잔고 0
    }
    return 0;
  });

  // 컴포넌트 마운트 시 localStorage에서 주문 데이터를 로드합니다.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedOrders = localStorage.getItem('tradeOrders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    }
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // 주문 목록이 변경될 때마다 localStorage에 저장합니다.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('tradeOrders', JSON.stringify(orders));
    }
  }, [orders]);

  // 잔고가 변경될 때마다 localStorage에 저장합니다.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('krwBalance', krwBalance.toString());
      localStorage.setItem('btcBalance', btcBalance.toString());
    }
  }, [krwBalance, btcBalance]);

  // OrderPanel에서 새로운 주문이 발생했을 때 호출될 함수
  const handleNewOrder = (order: Omit<Order, 'total' | 'timestamp' | 'time'>) => {
    const totalAmount = order.price * order.quantity;

    // 잔고 확인 및 업데이트 로직
    if (order.type === '매수') {
      if (krwBalance < totalAmount) {
        // OrderPanel에서 메시지 처리
        console.warn('잔고 부족: 매수 불가');
        return;
      }
      setKrwBalance(prev => prev - totalAmount);
      setBtcBalance(prev => prev + order.quantity);
    } else { // 매도
      if (btcBalance < order.quantity) {
        // OrderPanel에서 메시지 처리
        console.warn('BTC 부족: 매도 불가');
        return;
      }
      setKrwBalance(prev => prev + totalAmount);
      setBtcBalance(prev => prev - order.quantity);
    }

    const newOrder: Order = {
      ...order,
      total: totalAmount,
      timestamp: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit' }), // 한국 시간 HH:MM:SS
      time: Math.floor(Date.now() / 1000), // 차트 마커용 UNIX 타임스탬프 (초 단위)
    };
    // 새로운 주문을 목록의 맨 앞에 추가하여 최신 주문이 먼저 보이도록 합니다.
    setOrders(prevOrders => [newOrder, ...prevOrders]);
  };

  return (
    <main className="bg-gray-50 min-h-screen p-4 flex flex-col">
      {/* TradingHeader 컴포넌트: 잔고 표시 */}
      
      <div className="container mx-auto mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        {/* 차트와 주문 패널 영역 */}
        <div className="lg:col-span-2 flex flex-col gap-4 w-full h-full">
          {/* MainChart에 orders prop과 onPriceChange prop 전달 */}
          <MainChart orders={orders} onPriceChange={setCurrentPrice} />
          {/* OrderPanel에 orders, onNewOrder, currentPrice, 잔고 prop 전달 */}
          <OrderPanel
            orders={orders}
            onNewOrder={handleNewOrder}
            currentPrice={currentPrice}
            krwBalance={krwBalance}
            btcBalance={btcBalance}
          />
        </div>
        {/* MarketList 영역 */}
        <div className="lg:col-span-1 h-full">
          <MarketList />
        </div>
      </div>
    </main>
  );
}
