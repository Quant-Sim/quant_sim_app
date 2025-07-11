'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type PortfolioItem = {
  id: string;
  quantity: number;
  stock: {
    id: string;
    ticker: string;
    name: string;
    latest_price: number;
  };
};

export default function RealtimePortfolio() {
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  // 데이터 로드 함수 (API 호출)
  const fetchData = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (!response.ok) throw new Error('Failed to fetch');
      const data = await response.json();
      setPortfolio(data);
    } catch (error) {
      console.error(error);
    } finally {
      if (loading) setLoading(false);
    }
  };

  useEffect(() => {
    // 1. 첫 데이터는 API를 통해 즉시 로드
    fetchData();

    // 2. 'public' 스키마의 'portfolio_items' 테이블에 발생하는 모든 변경(*)을 구독
    const channel = supabase
      .channel('portfolio-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'portfolio_items' },
        (payload) => {
          console.log('실시간 변경 감지!', payload);
          // 변경이 감지되면, 데이터를 다시 로드하여 화면을 업데이트
          fetchData();
        }
      )
      .subscribe();

    // 3. 컴포넌트가 사라지면 구독 해제
    return () => {
      supabase.removeChannel(channel);
    };
  }, []); // 이 useEffect는 처음에 한 번만 실행됩니다.

  if (loading) {
    return <div>Loading portfolio...</div>;
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">My Stocks (Real-time)</h3>
      <ul>
        {portfolio.map((item) => (
          <li key={item.id} className="flex justify-between items-center py-2 border-b">
            <div>
              <p className="font-bold">{item.stock.ticker}</p>
              <p className="text-sm text-gray-500">{item.stock.name}</p>
            </div>
            <div>
              <p>수량: {item.quantity}</p>
              <p>현재가: ${item.stock.latest_price?.toLocaleString()}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}