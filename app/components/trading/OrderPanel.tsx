'use client';
import { useState } from 'react';
import { useEffect } from 'react';

export default function OrderPanel() {
  const [activeTab, setActiveTab] = useState('매수');
  const [simpleView, setSimpleView] = useState<'depth' | 'chart'>('depth');

  // Order type definition
  type Order = {
    type: '매수' | '매도';
    price: number;
    quantity: number;
    total: number;
    timestamp: string;
  };

  // Orders state
  const [orders, setOrders] = useState<Order[]>([]);

  // Inputs state
  const [price, setPrice] = useState<number>(151114000);
  const [quantity, setQuantity] = useState<number>(0);

  // Handle "+" and "-" buttons for price
  const changePrice = (delta: number) => {
    setPrice(prev => Math.max(0, prev + delta));
  };

  // Handle order
  const handleOrder = (orderType: '매수' | '매도') => {
    const total = price * quantity;
    const newOrder: Order = {
      type: orderType,
      price,
      quantity,
      total,
      timestamp: new Date().toLocaleString(),
    };
    // Save to state (could also send to backend here)
    setOrders(prev => [newOrder, ...prev]);
    // Reset quantity
    setQuantity(0);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex border-b">
        {['매수', '매도', '간편주문', '거래내역'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-sm font-bold ${
              activeTab === tab 
                ? (tab === '매수' ? 'bg-red-50 text-red-500 border-b-2 border-red-500' : 'bg-blue-50 text-blue-500 border-b-2 border-blue-500')
                : 'text-gray-500 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="p-4">
        {activeTab === '거래내역' ? (
          <div>
            <h3 className="font-bold mb-2">거래 내역</h3>
            <div className="overflow-auto max-h-96">
              <table className="w-full text-sm">
                <thead>
                  <tr>
                    <th className="text-left">시간</th>
                    <th className="text-left">유형</th>
                    <th className="text-right">가격</th>
                    <th className="text-right">수량</th>
                    <th className="text-right">총액</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, idx) => (
                    <tr key={idx}>
                      <td>{order.timestamp}</td>
                      <td>{order.type}</td>
                      <td className="text-right">{order.price.toLocaleString()}</td>
                      <td className="text-right">{order.quantity}</td>
                      <td className="text-right">{order.total.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            {/* existing 매수/매도, 간편주문 and mini-history JSX goes here unchanged */}
            {/* First cell */}
            {activeTab === '매수' || activeTab === '매도' ? (
              <div>
                <div className="flex items-center gap-4 mb-3">
                  <label className="font-semibold">주문유형</label>
                  <div className="flex gap-2 text-xs">
                    <label className="flex items-center gap-1"><input type="radio" name="orderType" defaultChecked /> 지정가</label>
                    <label className="flex items-center gap-1"><input type="radio" name="orderType" /> 시장가</label>
                    <label className="flex items-center gap-1"><input type="radio" name="orderType" /> 예약-지정가</label>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="grid grid-cols-3 items-center">
                    <label className="font-semibold text-gray-600">주문가능</label>
                    <p className="col-span-2 text-right font-semibold">0 <span className="font-normal">KRW</span></p>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label className="font-semibold text-gray-600">매수가격 (KRW)</label>
                    <div className="col-span-2 flex items-center border rounded-md">
                      <button className="px-2 text-lg text-gray-400" onClick={() => changePrice(-1000)}>-</button>
                      <input
                        type="number"
                        value={price}
                        onChange={e => setPrice(Number(e.target.value))}
                        className="w-full text-right font-semibold p-1 outline-none"
                      />
                      <button className="px-2 text-lg text-gray-400" onClick={() => changePrice(1000)}>+</button>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label className="font-semibold text-gray-600">주문수량 (BTC)</label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="col-span-2 border rounded-md p-1 text-right"
                    />
                  </div>
                  <div className="flex justify-end gap-1">
                    {['10%', '25%', '50%', '100%'].map(p => (
                      <button key={p} className="bg-gray-100 text-xs px-3 py-1 rounded hover:bg-gray-200">{p}</button>
                    ))}
                    <button className="bg-gray-100 text-xs px-3 py-1 rounded hover:bg-gray-200">직접입력</button>
                  </div>
                  <div className="grid grid-cols-3 items-center">
                    <label className="font-semibold text-gray-600">주문총액 (KRW)</label>
                    <p className="col-span-2 text-right font-semibold">{(price * quantity).toLocaleString()}</p>
                  </div>
                </div>
                {activeTab === '매수' && (
                  <button
                    onClick={() => handleOrder('매수')}
                    className="w-full mt-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600"
                  >
                    매수
                  </button>
                )}
                {activeTab === '매도' && (
                  <button
                    onClick={() => handleOrder('매도')}
                    className="w-full mt-4 py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600"
                  >
                    매도
                  </button>
                )}
              </div>
            ) : activeTab === '간편주문' ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">시장가 전액 매수</p>
                    <p className="text-xs text-gray-500">가격: 시장가, 총액: 가능 100%</p>
                  </div>
                  <button className="px-4 py-2 border rounded text-red-500 font-semibold">매수</button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">시장가 전액 매도</p>
                    <p className="text-xs text-gray-500">가격: 시장가, 수량: 가능 100%</p>
                  </div>
                  <button className="px-4 py-2 border rounded text-blue-500 font-semibold">매도</button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">지정가 전액 매수</p>
                    <p className="text-xs text-gray-500">가격: {price.toLocaleString()} KRW, 수량: 가능 100%</p>
                  </div>
                  <button className="px-4 py-2 border rounded text-red-500 font-semibold">매수</button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">지정가 전액 매도</p>
                    <p className="text-xs text-gray-500">가격: {price.toLocaleString()} KRW, 수량: 가능 100%</p>
                  </div>
                  <button className="px-4 py-2 border rounded text-blue-500 font-semibold">매도</button>
                </div>
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-semibold">일반 주문 취소</p>
                  </div>
                  <button className="px-4 py-2 border rounded text-gray-700 font-semibold">취소</button>
                </div>
              </div>
            ) : (
              <div />
            )}
            {/* Second cell */}
            {activeTab === '매수' || activeTab === '매도' ? (
              <div>
                <h3 className="font-bold mb-2">최근 체결</h3>
                <div className="overflow-auto max-h-40">
                  <table className="w-full text-xs">
                    <thead>
                      <tr>
                        <th className="text-left">시간</th>
                        <th className="text-right">가격</th>
                        <th className="text-right">수량</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map((order, idx) => (
                        <tr key={idx}>
                          <td>{order.timestamp}</td>
                          <td className="text-right">{order.price.toLocaleString()}</td>
                          <td className="text-right">{order.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : activeTab === '간편주문' ? (
              <div>
                {/* Sub-tabs for 간편주문 */}
                <div className="flex border-b mb-2 text-sm">
                  <button
                    onClick={() => setSimpleView('depth')}
                    className={`flex-1 py-2 ${simpleView === 'depth' ? 'border-b-2 border-gray-800 font-bold' : 'text-gray-500'}`}
                  >
                    마켓뎁스
                  </button>
                  <button
                    onClick={() => setSimpleView('chart')}
                    className={`flex-1 py-2 ${simpleView === 'chart' ? 'border-b-2 border-gray-800 font-bold' : 'text-gray-500'}`}
                  >
                    미니차트
                  </button>
                </div>
                {/* Content */}
                {simpleView === 'depth' ? (
                  <div className="h-full bg-gray-50 rounded p-4">
                    {/* Market depth placeholder */}
                    <p className="text-gray-400 text-center">[Market Depth Placeholder]</p>
                  </div>
                ) : (
                  <div className="h-full bg-gray-50 rounded p-4">
                    {/* Mini chart placeholder */}
                    <p className="text-gray-400 text-center">[Mini Chart Placeholder]</p>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <h3 className="font-bold mb-2">거래 내역</h3>
                <div className="overflow-auto max-h-64">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left">시간</th>
                        <th className="text-left">유형</th>
                        <th className="text-right">가격</th>
                        <th className="text-right">수량</th>
                        <th className="text-right">총액</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map((order, idx) => (
                        <tr key={idx}>
                          <td>{order.timestamp}</td>
                          <td>{order.type}</td>
                          <td className="text-right">{order.price.toLocaleString()}</td>
                          <td className="text-right">{order.quantity}</td>
                          <td className="text-right">{order.total.toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}