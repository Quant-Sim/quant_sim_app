'use client'; // 클라이언트 컴포넌트임을 명시 (가장 중요)

import React, { useState, useEffect } from 'react';
// 프로젝트 구조에 맞게 경로를 조정하세요.
import TradingHeader from '@/app/components/trading/TradingHeader';
import MainChart from '@/app/components/trading/MainChart';
import OrderPanel from '@/app/components/trading/OrderPanel'; // Order 타입 임포트 제거
import MarketList from '@/app/components/trading/MarketList';

export default function TradingPage() {
  // 현재가를 상태로 관리합니다. MainChart에서 받은 값으로 업데이트됩니다.
  const [currentPrice, setCurrentPrice] = useState<number>(67000000); // 초기값 설정

  // ⭐️ 사용자 잔고 상태 초기값을 고정된 값으로 설정하여 서버와 클라이언트의 초기 렌더링을 일치시킵니다. ⭐️
  const [krwBalance, setKrwBalance] = useState<number>(100000000); // 초기 잔고 1억원 (기본값)
  const [btcBalance, setBtcBalance] = useState<number>(0); // 초기 BTC 잔고 0

  // 컴포넌트 마운트 시 localStorage에서 잔고 데이터를 로드하고 상태를 업데이트합니다.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // ⭐️ localStorage에서 잔고 데이터를 로드하고 상태를 업데이트합니다. ⭐️
      const savedKrwBalance = localStorage.getItem('krwBalance');
      if (savedKrwBalance) {
        setKrwBalance(parseFloat(savedKrwBalance));
      }
      const savedBtcBalance = localStorage.getItem('btcBalance');
      if (savedBtcBalance) {
        setBtcBalance(parseFloat(savedBtcBalance));
      }
    }
  }, []); // 빈 의존성 배열로 컴포넌트 마운트 시 한 번만 실행

  // 잔고가 변경될 때마다 localStorage에 저장합니다.
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('krwBalance', krwBalance.toString());
      localStorage.setItem('btcBalance', btcBalance.toString());
    }
  }, [krwBalance, btcBalance]);

  // OrderPanel에서 새로운 주문이 발생했을 때 호출될 함수
  const handleNewOrder = (order: Omit<any, 'total' | 'timestamp' | 'time'>) => {
    const totalAmount = order.price * order.quantity;

    // 잔고 확인 및 업데이트 로직
    if (order.type === '매수') {
      // KRW 잔고 부족 시 경고 및 함수 종료
      if (krwBalance < totalAmount) {
        console.warn('잔고 부족: 매수 불가');
        // OrderPanel에서 메시지 UI를 통해 사용자에게 피드백이 제공됩니다.
        return;
      }
      // 매수 시 KRW 차감, BTC 증가
      setKrwBalance(prev => prev - totalAmount);
      setBtcBalance(prev => prev + order.quantity);
    } else { // 매도
      // BTC 잔고 부족 시 경고 및 함수 종료
      if (btcBalance < order.quantity) {
        console.warn('BTC 부족: 매도 불가');
        // OrderPanel에서 메시지 UI를 통해 사용자에게 피드백이 제공됩니다.
        return;
      }
      // 매도 시 KRW 증가, BTC 차감
      setKrwBalance(prev => prev + totalAmount);
      setBtcBalance(prev => prev - order.quantity);
    }

    // 주문 목록 상태 및 localStorage 저장 관련 코드 제거
  };

  return (
    <main className="bg-gray-50 min-h-screen p-4 flex flex-col">
      {/* TradingHeader 컴포넌트: KRW 및 BTC 잔고를 표시합니다. */}
      <TradingHeader/>
      
      {/* 메인 컨텐츠 영역: 그리드 레이아웃을 사용하며, 남은 수직 공간을 채웁니다. */}
      <div className="container mx-auto mt-4 grid grid-cols-1 lg:grid-cols-3 gap-4 flex-grow">
        {/* 차트와 주문 패널을 포함하는 좌측 큰 컬럼 */}
        <div className="lg:col-span-2 flex flex-col gap-4 w-full h-full">
          {/* MainChart 컴포넌트: 현재 가격 업데이트 콜백을 전달합니다. */}
          <MainChart onPriceChange={setCurrentPrice} />
          {/* OrderPanel 컴포넌트: 새 주문 콜백, 현재 가격, 잔고 정보를 전달합니다. */}
          <OrderPanel
            onNewOrder={handleNewOrder}
            currentPrice={currentPrice}
            krwBalance={krwBalance}
            btcBalance={btcBalance}
          />
        </div>
        {/* MarketList를 포함하는 우측 작은 컬럼 */}
        <div className="lg:col-span-1 h-full">
          <MarketList />
        </div>
      </div>
    </main>
  );
}
