'use client';

import React, { useState, useEffect } from 'react';

// Order 타입을 외부에서 사용할 수 있도록 export 합니다.
// 차트와 데이터를 공유하기 위함입니다.
export type Order = {
  type: '매수' | '매도';
  price: number;
  quantity: number;
  total: number;
  timestamp: string;
  time: number; // 차트 마커 표시를 위한 UNIX 타임스탬프 (초 단위)
};

// OrderPanel 컴포넌트가 받을 props의 타입을 정의합니다.
type OrderPanelProps = {
  onNewOrder: (order: Omit<Order, 'total' | 'timestamp' | 'time'>) => void;
  currentPrice: number;
  krwBalance: number; // krwBalance prop 추가
  btcBalance: number; // btcBalance prop 추가
};

export default function OrderPanel({ onNewOrder, currentPrice, krwBalance, btcBalance }: OrderPanelProps) {
  const [activeTab, setActiveTab] = useState('매수');
  const [simpleView, setSimpleView] = useState<'depth' | 'chart'>('depth'); // 간편주문 탭 내부 뷰
  const [quantity, setQuantity] = useState<number>(0);
  const [price, setPrice] = useState<number>(currentPrice);
  const [message, setMessage] = useState<string | null>(null); // 사용자 메시지 상태

  useEffect(() => {
    setPrice(currentPrice); // currentPrice prop이 변경될 때 주문 가격 업데이트
  }, [currentPrice]);

  // Load persisted orders from backend
  const [localOrders, setLocalOrders] = useState<Order[]>([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/orders`)
      .then(res => res.json())
      .then((data: Order[]) => setLocalOrders(data))
      .catch(err => console.error('Failed to load orders:', err));
  }, []);

  // 가격 증감 함수
  const changePrice = (delta: number) => {
    // 가격은 정수로 표시되므로 Math.round 또는 parseInt 사용
    setPrice(prev => Math.max(0, Math.round(prev + delta)));
  };

  // 주문 처리 함수
  const handleOrder = (orderType: '매수' | '매도') => {
    if (quantity <= 0) {
      setMessage('주문 수량은 0보다 커야 합니다.'); // alert 대신 메시지 표시
      return;
    }

    // OrderPanel 내에서 추가적인 잔고 검사 (page.tsx에서 이미 검사하지만, UI 피드백을 위해 여기에도 추가)
    const totalAmount = price * quantity;
    if (orderType === '매수') {
      if (krwBalance < totalAmount) {
        setMessage('잔고가 부족하여 매수할 수 없습니다.');
        return;
      }
    } else { // 매도
      if (btcBalance < quantity) {
        setMessage('판매할 비트코인이 부족합니다.');
        return;
      }
    }

    onNewOrder({
      type: orderType,
      price,
      quantity: parseFloat(quantity.toFixed(8)), // 수량은 소수점 8자리까지 유지 (비트코인 등은 소수점 길 수 있음)
    });
    // Send the order to backend
    fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: orderType,
        price,
        quantity,
      }),
    })
      .then(res => res.json())
      .then(data => {
        console.log('Order API response:', data);
      })
      .catch(err => {
        console.error('Failed to send order:', err);
      });
    setQuantity(0);
    setMessage(null); // 주문 성공 시 메시지 초기화
  };

  const safeOrders = localOrders;

  // 헬퍼 함수: 숫자 포맷팅 (소수점 자릿수와 쉼표)
  const formatPriceKRW = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return '0'; // 유효하지 않은 숫자 처리
    return Math.round(num).toLocaleString('ko-KR');
  };

  // 수량 포맷팅 (BTC): 소수점 4-8자리까지 허용
  const formatQuantityBTC = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return '0.0000';
    // toFixed(8)로 계산은 하되, 표시할 때는 불필요한 0을 제거하고 최소 4자리까지 표시
    return parseFloat(num.toFixed(8)).toLocaleString('ko-KR', {
      minimumFractionDigits: 4,
      maximumFractionDigits: 8,
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      {/* 탭 메뉴 */}
      <div className="flex border-b">
        {['매수', '매도', '간편주문', '거래내역'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-bold transition-colors ${
              activeTab === tab
                ? tab === '매수' ? 'bg-red-50 text-red-500 border-b-2 border-red-500'
                : tab === '매도' ? 'bg-blue-50 text-blue-500 border-b-2 border-blue-500'
                : 'bg-gray-100 text-gray-800 border-b-2 border-gray-800' // 간편주문, 거래내역 탭 활성화 색상
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 탭 콘텐츠 */}
      <div className="p-4">
        {message && ( // 메시지가 있을 경우 표시
          <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-2 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-2" onClick={() => setMessage(null)}>
              <svg className="fill-current h-6 w-6 text-yellow-500" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        {activeTab === '거래내역' ? (
          // --- 거래내역 탭 ---
          <div>
            <h3 className="font-bold mb-2 text-base">거래 내역</h3>
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm text-left">
                <thead>
                  <tr className="text-gray-500">
                    <th className="py-2 font-normal">시간</th>
                    <th className="font-normal">유형</th>
                    <th className="text-right font-normal">가격(KRW)</th>
                    <th className="text-right font-normal">수량(BTC)</th>
                    <th className="text-right font-normal">총액(KRW)</th>
                  </tr>
                </thead>
                <tbody>
                  {safeOrders.length > 0 ? (
                    safeOrders.slice(0, 15).map((order, idx) => ( // 최근 15개만 표시
                      <tr key={idx} className={`align-middle ${order.type === '매수' ? 'text-red-600' : 'text-blue-600'}`}>
                        <td className="py-1">{order.timestamp}</td>
                        <td>{order.type}</td>
                        <td className="text-right">{formatPriceKRW(order.price)}</td> {/* 가격 정수 표시 */}
                        <td className="text-right">{formatQuantityBTC(order.quantity)}</td> {/* 수량 소수점 4-8자리 */}
                        <td className="text-right">{formatPriceKRW(order.total)}</td> {/* 총액 정수 표시 */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-gray-400">
                        거래 내역이 없습니다.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          // --- 매수 / 매도 / 간편주문 탭 공통 레이아웃 ---
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {/* 왼쪽 컬럼: 주문 입력 영역 (매수/매도 탭) */}
            {activeTab === '매수' || activeTab === '매도' ? (
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <label className="font-semibold">주문유형</label>
                  <div className="flex gap-2 text-xs">
                    <label className="flex items-center gap-1"><input type="radio" name="orderType" defaultChecked /> 지정가</label>
                    <label className="flex items-center gap-1"><input type="radio" name="orderType" /> 시장가</label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 items-center">
                    <label className="font-semibold text-gray-600">주문가능</label>
                    {/* 현재 탭에 따라 주문가능 금액 표시 */}
                    <p className="col-span-2 text-right font-semibold">
                      {activeTab === '매수' ? `${formatPriceKRW(krwBalance)} KRW` : `${formatQuantityBTC(btcBalance)} BTC`}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label className="font-semibold text-gray-600">주문가격</label>
                    <div className="col-span-2 flex items-center border rounded-md">
                      <button className="px-2 text-lg text-gray-400" onClick={() => changePrice(-1000)}>-</button>
                      {/* 입력 필드에 price를 정수 형태로 표시 */}
                      <input
                        type="number"
                        value={Math.round(price)}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="w-full text-right font-semibold p-1 outline-none"
                      />
                      <button className="px-2 text-lg text-gray-400" onClick={() => changePrice(1000)}>+</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label className="font-semibold text-gray-600">주문수량</label>
                    {/* 수량 입력 필드. 직접 입력할 때는 소수점 다 받도록 하고, 표시될 때만 포맷팅 */}
                    <input
                      type="number"
                      value={quantity || ''}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="col-span-2 border rounded-md p-1 text-right"
                      placeholder="BTC"
                      step="0.0001" // 소수점 단위 조절 (필요에 따라)
                    />
                  </div>
                  <div className="flex justify-end gap-1">
                    {['10%', '25%', '50%', '100%'].map(p => (
                      // 백분율 버튼 클릭 시 수량 계산
                      <button
                        key={p}
                        className="bg-gray-100 text-xs px-3 py-1 rounded hover:bg-gray-200"
                        onClick={() => {
                          const percent = parseFloat(p) / 100;
                          if (activeTab === '매수') {
                            // KRW 잔고 기반으로 매수 가능한 BTC 수량 계산
                            const maxQuantity = krwBalance / price;
                            setQuantity(maxQuantity * percent);
                          } else {
                            // BTC 잔고 기반으로 매도 가능한 BTC 수량 계산
                            setQuantity(btcBalance * percent);
                          }
                        }}
                      >
                        {p}
                      </button>
                    ))}
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label className="font-semibold text-gray-600">주문총액</label>
                    {/* 총액을 정수로 표시 */}
                    <p className="col-span-2 text-right font-semibold">{formatPriceKRW(price * quantity)}</p>
                  </div>
                </div>
                {activeTab === '매수' && <button onClick={() => handleOrder('매수')} className="w-full mt-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600">매수</button>}
                {activeTab === '매도' && <button onClick={() => handleOrder('매도')} className="w-full mt-4 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600">매도</button>}
              </div>
            ) : activeTab === '간편주문' ? (
              // 간편주문 탭 내용
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="font-semibold">시장가 전액 매수</p>
                    <button className="px-4 py-2 border rounded text-red-500 font-semibold"
                            onClick={() => handleOrder('매수')}>매수</button>
                </div>
                <div className="flex justify-between items-center">
                    <p className="font-semibold">시장가 전액 매도</p>
                    <button className="px-4 py-2 border rounded text-blue-500 font-semibold"
                            onClick={() => handleOrder('매도')}>매도</button>
                </div>
                <div className="flex justify-between items-center"><p className="font-semibold">지정가 전액 매수</p><button className="px-4 py-2 border rounded text-red-500 font-semibold">매수</button></div>
                <div className="flex justify-between items-center"><p className="font-semibold">지정가 전액 매도</p><button className="px-4 py-2 border rounded text-blue-500 font-semibold">매도</button></div>
                <div className="flex justify-between items-center"><p className="font-semibold">일반 주문 취소</p><button className="px-4 py-2 border rounded text-gray-700 font-semibold">취소</button></div>
              </div>
            ) : null}

            {/* 오른쪽 컬럼: 최근 체결 또는 마켓뎁스/미니차트 (매수/매도/간편주문 탭에 따라 다름) */}
            {activeTab === '매수' || activeTab === '매도' ? (
              <div>
                <h3 className="font-bold mb-2 text-base">최근 체결</h3>
                <div className="overflow-auto max-h-64">
                  <table className="w-full text-xs">
                    <thead><tr className="text-gray-500"><th className="text-left font-normal">시간</th><th className="text-right font-normal">가격</th><th className="text-right font-normal">수량</th></tr></thead>
                    <tbody>
                      {safeOrders.slice(0, 15).map((order, idx) => ( // 최근 15개만 표시
                        <tr key={idx} className={order.type === '매수' ? 'text-red-500' : 'text-blue-500'}>
                          <td>{order.timestamp}</td>
                          <td className="text-right">{formatPriceKRW(order.price)}</td>
                          <td className="text-right">{formatQuantityBTC(order.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === '간편주문' ? (
              <div>
                <div className="flex border-b mb-2 text-sm">
                  <button onClick={() => setSimpleView('depth')} className={`flex-1 py-2 ${simpleView === 'depth' ? 'border-b-2 border-gray-800 font-bold' : 'text-gray-500'}`}>마켓뎁스</button>
                  <button onClick={() => setSimpleView('chart')} className={`flex-1 py-2 ${simpleView === 'chart' ? 'border-b-2 border-gray-800 font-bold' : 'text-gray-500'}`}>미니차트</button>
                </div>
                {simpleView === 'depth' ? <div className="h-full bg-gray-50 rounded p-4 flex items-center justify-center"><p className="text-gray-400">[Market Depth Placeholder]</p></div> : <div className="h-full bg-gray-50 rounded p-4 flex items-center justify-center"><p className="text-gray-400">[Mini Chart Placeholder]</p></div>}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
}