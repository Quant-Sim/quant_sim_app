'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FaSearch, FaBell, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';

type NewsItem = {
  id: string;
  headline: string;
  sentiment: number;
  impact: number;
  timestamp: number;
};

export default function Header() {
  const { data: session } = useSession();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isNewsOpen, setIsNewsOpen] = useState(false);
  const [newsList, setNewsList] = useState<NewsItem[]>([]);
  const [toastVisible, setToastVisible] = useState(false); 
  const [toastMessage, setToastMessage] = useState('');   
  const dropdownRef = useRef<HTMLDivElement>(null);
  const newsRef = useRef<HTMLDivElement>(null);

  const userName = session?.user?.name ?? 'User';
  const userEmail = session?.user?.email ?? 'user@example.com';
  const userImage = session?.user?.image ?? '/default-avatar.png';

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
      if (
        newsRef.current &&
        !newsRef.current.contains(event.target as Node)
      ) {
        setIsNewsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 예시 뉴스 1개 테스트용 (마운트 직후 한 번 실행)
useEffect(() => {
  const testNews: NewsItem = {
    id: 'test-001',
    headline: '✅ [테스트] 신제품 출시로 주가 급등 예상',
    sentiment: 0.9,
    impact: 8,
    timestamp: Math.floor(Date.now() / 1000),
  };

  setNewsList((prev) => [testNews, ...prev.slice(0, 4)]); // 드롭다운용 추가
  setToastMessage(testNews.headline); // 알림용 메시지
  setToastVisible(true); // 알림 표시
  setTimeout(() => setToastVisible(false), 3000); // 3초 후 알림 제거
}, []);


  // WebSocket으로 뉴스 수신
  useEffect(() => {
const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/news`);

    ws.onmessage = (event) => {
      const news = JSON.parse(event.data) as NewsItem;
      setNewsList((prev) => [news, ...prev.slice(0, 4)]); // 최신 5개 유지

      // ✅ 뉴스 알림 표시
      setToastMessage(news.headline);
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000); // 3초 후 숨김
    };

    ws.onerror = (e) => console.error("WebSocket Error:", e);

    return () => ws.close();
  }, []);

  return (
    <>
      {/* ✅ 토스트 알림 UI */}
{toastVisible && (
  <div className="fixed top-4 right-4 bg-white border border-gray-300 shadow-lg rounded px-4 py-3 z-50 animate-fade-in flex items-start justify-between gap-4 w-96">
    <div>
      <strong className="text-gray-800 block">📢 뉴스 도착</strong>
      <p className="text-sm text-gray-600 mt-1">{toastMessage}</p>
    </div>
    <button
      onClick={() => setToastVisible(false)}
      className="text-gray-400 hover:text-gray-700 text-xl leading-none"
      aria-label="닫기"
    >
      &times;
    </button>
  </div>
)}


      <header className="flex items-center justify-between w-full px-6 py-4 bg-white shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-800">Hello, {userName}</h1>

        <div className="flex items-center gap-6">
          {/* 검색창 */}
          <div className="relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search for stocks and more"
              className="bg-white rounded-full py-2 pl-10 pr-4 w-64 border focus:outline-none focus:ring-2 focus:ring-fox-purple"
            />
          </div>

          {/* 알림 아이콘 + 드롭다운 */}
          <div className="relative" ref={newsRef}>
            <button
              onClick={() => setIsNewsOpen(!isNewsOpen)}
              className="relative text-gray-500 hover:text-gray-800"
            >
              <FaBell className="text-xl" />
              {newsList.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {newsList.length}
                </span>
              )}
            </button>

            {isNewsOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-10 max-h-96 overflow-auto">
                <div className="p-4 border-b font-semibold text-gray-700">📢 뉴스 알림</div>
                {newsList.map((news, idx) => (
                  <div key={news.id || idx} className="px-4 py-2 border-b hover:bg-gray-50">
                    <p className="text-sm text-gray-800">{news.headline}</p>
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>감정: {news.sentiment >= 0 ? '+' : ''}{news.sentiment.toFixed(2)}</span>
                      <span>{new Date(news.timestamp * 1000).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))}
                {newsList.length === 0 && (
                  <div className="p-4 text-sm text-gray-400">최근 뉴스 없음</div>
                )}
              </div>
            )}
          </div>

          {/* 프로필 아바타 + 드롭다운 */}
          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
              <Image
                src={userImage}
                alt="User Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl z-10">
                <div className="p-4 border-b">
                  <p className="font-semibold text-gray-800">{userName}</p>
                  <p className="text-sm text-gray-500">{userEmail}</p>
                </div>
                <div className="p-2">
                  <button
                    onClick={() => signOut({ callbackUrl: '/login' })}
                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-700 rounded-md hover:bg-gray-100"
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}
