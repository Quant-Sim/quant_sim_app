'use client';
import { useState } from 'react';
import { FaBitcoin, FaCog } from 'react-icons/fa';

export default function TradingHeader() {
  const [activeTab, setActiveTab] = useState('시세');

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FaBitcoin className="text-4xl text-yellow-500" />
          <div>
            <h2 className="text-xl font-bold">비트코인 <span className="text-sm font-normal text-gray-500">BTC/KRW</span></h2>
            <p className="text-2xl font-bold text-red-500 mt-1">151,002,000 <span className="text-lg font-normal">KRW</span></p>
            <p className="text-sm text-red-500 font-semibold">+0.20% ▲301,000</p>
          </div>
        </div>
        <div className="flex items-start self-start gap-4">
          <div className="flex border-b">
            {['시세', '정보'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
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
    </div>
  );
}