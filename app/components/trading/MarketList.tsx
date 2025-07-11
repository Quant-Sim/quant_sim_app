'use client';
import { useState } from 'react';
import { FaSearch, FaCog, FaCheckSquare, FaRegCheckSquare, FaStar, FaRegStar } from 'react-icons/fa';

const tickers = [
  { name: '삼성전자', symbol: '005930.KS', price: '75,000', change: '+1.20%', volume: '3,500억' },
  { name: '네이버', symbol: '035420.KS', price: '150,500', change: '-0.50%', volume: '1,200억' },
  { name: '카카오', symbol: '035720.KS', price: '90,250', change: '+0.80%', volume: '900억' },
  { name: 'SK하이닉스', symbol: '000660.KS', price: '120,000', change: '+2.00%', volume: '2,000억' },
  { name: '현대차', symbol: '005380.KS', price: '230,000', change: '-1.10%', volume: '1,800억' },
  // 추가 종목을 원하시면 이곳에 계속 추가하세요.
];

export default function MarketList() {
  const [activeTab, setActiveTab] = useState('원화');
  const [searchTerm, setSearchTerm] = useState('');
  const [owned, setOwned] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  // 기존 필터
  const baseFiltered = tickers.filter(item =>
    item.name.includes(searchTerm) || item.symbol.includes(searchTerm)
  );
  // 탭별 필터링
  const filteredTickers = activeTab === '보유'
    ? baseFiltered.filter(item => owned.includes(item.symbol))
    : activeTab === '관심'
    ? baseFiltered.filter(item => favorites.includes(item.symbol))
    : baseFiltered;
  // toggle 함수들
  const toggleOwned = (symbol: string) => {
    setOwned(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };
  const toggleFavorite = (symbol: string) => {
    setFavorites(prev =>
      prev.includes(symbol) ? prev.filter(s => s !== symbol) : [...prev, symbol]
    );
  };
  return (
    <div className="bg-white rounded-lg shadow-sm h-full text-sm">
      <div className="p-2">
        <div className="relative">
          <input
            type="text"
            placeholder="종목명/심볼 검색"
            className="w-full bg-gray-100 rounded p-2 pl-8 text-xs"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
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
        <div className="col-span-1"></div>
        <div className="col-span-1"></div>
      </div>
      <ul>
        {filteredTickers.map(ticker => (
          <li
            key={ticker.symbol}
            className="grid grid-cols-12 gap-1 text-center p-2 border-b hover:bg-gray-50 cursor-pointer"
          >
            <div className="col-span-3 text-left">
              <p className="font-bold">{ticker.name}</p>
              <p className="text-xs text-gray-400">{ticker.symbol}</p>
            </div>
            <div className="col-span-2 text-right font-semibold text-red-500">{ticker.price}</div>
            <div className="col-span-2 text-right text-red-500 text-xs">{ticker.change}</div>
            <div className="col-span-3 text-right text-xs">{ticker.volume}</div>
            {/* 보유 토글 */}
            <div className="col-span-1 flex items-center justify-center">
              {owned.includes(ticker.symbol) ? (
                <FaCheckSquare onClick={e => { e.stopPropagation(); toggleOwned(ticker.symbol); }} />
              ) : (
                <FaRegCheckSquare onClick={e => { e.stopPropagation(); toggleOwned(ticker.symbol); }} />
              )}
            </div>
            {/* 관심 토글 */}
            <div className="col-span-1 flex items-center justify-center">
              {favorites.includes(ticker.symbol) ? (
                <FaStar onClick={e => { e.stopPropagation(); toggleFavorite(ticker.symbol); }} />
              ) : (
                <FaRegStar onClick={e => { e.stopPropagation(); toggleFavorite(ticker.symbol); }} />
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}