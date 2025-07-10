'use client';
import { useState } from 'react';

export default function OrderPanel() {
  const [activeTab, setActiveTab] = useState('매수');

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
      <div className="p-4 grid grid-cols-2 gap-4 text-sm">
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
                <button className="px-2 text-lg text-gray-400">-</button>
                <input type="text" defaultValue="151,114,000" className="w-full text-right font-semibold p-1 outline-none" />
                <button className="px-2 text-lg text-gray-400">+</button>
              </div>
            </div>
            <div className="grid grid-cols-3 items-center">
              <label className="font-semibold text-gray-600">주문수량 (BTC)</label>
              <input type="text" className="col-span-2 border rounded-md p-1 text-right" />
            </div>
            <div className="flex justify-end gap-1">
              {['10%', '25%', '50%', '100%'].map(p => (
                <button key={p} className="bg-gray-100 text-xs px-3 py-1 rounded hover:bg-gray-200">{p}</button>
              ))}
              <button className="bg-gray-100 text-xs px-3 py-1 rounded hover:bg-gray-200">직접입력</button>
            </div>
            <div className="grid grid-cols-3 items-center">
              <label className="font-semibold text-gray-600">주문총액 (KRW)</label>
              <p className="col-span-2 text-right font-semibold">0</p>
            </div>
          </div>
          <button className="w-full mt-4 py-3 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600">
            매수
          </button>
        </div>
        <div>
          {/* This would be an order book component in a real app */}
          <div className="h-full bg-gray-50 rounded flex items-center justify-center">
            <p className="text-gray-400">[Order Book Placeholder]</p>
          </div>
        </div>
      </div>
    </div>
  );
}