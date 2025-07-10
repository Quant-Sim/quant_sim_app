'use client';
import { useState } from 'react';
import { FaSearch, FaCog } from 'react-icons/fa';

const coins = [
  { name: '하이퍼레인', symbol: 'HYPER/KRW', price: '413.0', change: '+192.70%', volume: '346,660백만', isNew: true },
  { name: '엑스알피(리플)', symbol: 'XRP/KRW', price: '3,321', change: '+1.90%', volume: '503,474백만' },
  { name: '비트코인', symbol: 'BTC/KRW', price: '151,113,000', change: '+0.27%', volume: '293,081백만' },
  { name: '이더리움', symbol: 'ETH/KRW', price: '3,791,000', change: '+1.07%', volume: '251,726백만' },
];

export default function MarketList() {
  const [activeTab, setActiveTab] = useState('원화');
  return (
    <div className="bg-white rounded-lg shadow-sm h-full text-sm">
      <div className="p-2">
        <div className="relative">
          <input type="text" placeholder="코인명/심볼검색" className="w-full bg-gray-100 rounded p-2 pl-8 text-xs"/>
          <FaSearch className="absolute left-2.5 top-2.5 text-gray-400" />
        </div>
      </div>
      <div className="flex border-b mt-1">
        {['원화', '보유', '관심'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-2 font-semibold text-xs ${activeTab === tab ? 'border-b-2 border-black text-black' : 'text-gray-500'}`}
          >
            {tab}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500 grid grid-cols-10 gap-1 text-center p-2 bg-gray-50">
        <div className="col-span-3 text-left">한글명</div>
        <div className="col-span-2 text-right">현재가</div>
        <div className="col-span-2 text-right">전일대비</div>
        <div className="col-span-3 text-right">거래대금</div>
      </div>
      <ul>
        {coins.map(coin => (
          <li key={coin.symbol} className="grid grid-cols-10 gap-1 text-center p-2 border-b hover:bg-gray-50 cursor-pointer">
            <div className="col-span-3 text-left">
              <p className="font-bold">{coin.name}</p>
              <p className="text-xs text-gray-400">{coin.symbol}</p>
            </div>
            <div className="col-span-2 text-right font-semibold text-red-500">{coin.price}</div>
            <div className="col-span-2 text-right text-red-500 text-xs">{coin.change}</div>
            <div className="col-span-3 text-right text-xs">{coin.volume}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}