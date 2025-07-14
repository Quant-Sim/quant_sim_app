'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FaSearch, FaBell, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';

// === 뉴스 타입 정의 ===
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
    const [isNewsOpen, setIsNewsOpen] = useState(false); // 뉴스 드롭다운 상태
    const [newsList, setNewsList] = useState<NewsItem[]>([]); // 뉴스 데이터
    const [toastVisible, setToastVisible] = useState(false); // 토스트 표시 상태
    const [toastMessage, setToastMessage] = useState('');     //토스트 메시지

    const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 DOM을 참조하기 위한 ref
    const newsRef = useRef<HTMLDivElement>(null);     // 뉴스 드롭다운 참조

    // 세션에서 사용자 정보를 가져옵니다.
    const userName = session?.user?.name ?? 'User';
    const userEmail = session?.user?.email ?? 'user@example.com';
    const userImage = session?.user?.image ?? '/default-avatar.png'; // public 폴더에 기본 아바타 이미지가 있다고 가정

    const handleNewsClick = (id: string) => {
  setNewsList((prev) => prev.filter((news) => news.id !== id));
};

    // 드롭다운 메뉴 바깥을 클릭하면 메뉴가 닫히도록 하는 로직
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
            if (newsRef.current && !newsRef.current.contains(event.target as Node)) {
                setIsNewsOpen(false); // ✅ 뉴스 드롭다운 닫기
            }
        }
        // 이벤트 리스너 등록
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // WebSocket으로 뉴스 수신
    useEffect(() => {
        const WS_BASE = process.env.NEXT_PUBLIC_WS_BASE_URL;
        const ws = new WebSocket(`${WS_BASE}/ws/news`);

        ws.onmessage = (event) => {
            const news = JSON.parse(event.data) as NewsItem;
            setNewsList((prev) => [news, ...prev.slice(0, 4)]); // 최대 5개 유지

            // 토스트 알림 띄우기
            setToastMessage(news.headline);
            setToastVisible(true);
            setTimeout(() => setToastVisible(false), 3000); // 3초 후 자동 숨김
        };


        return () => ws.close();
    }, []);

    return (
        <>
            {/* 토스트 알림 UI */}
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

            <header className="flex items-center justify-between w-full">
                <h1 className="text-2xl font-semibold text-gray-800">Hello, {userName}</h1>
                <div className="flex items-center gap-6">
                    <div className="relative">
                        <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search for stocks and more"
                            className="bg-white rounded-full py-2 pl-10 pr-4 w-64 focus:outline-none focus:ring-2 focus:ring-fox-purple"
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
                                {newsList.map((news) => (
                                    <div
                                        key={news.id}
                                        className="px-4 py-2 border-b hover:bg-gray-50 cursor-pointer"
                                        onClick={() => handleNewsClick(news.id)} //
                                    >
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

                    {/* --- 프로필 드롭다운 섹션 --- */}
                    <div className="relative" ref={dropdownRef}>
                        {/* 사용자 아바타: 클릭하면 드롭다운 토글 */}
                        <button onClick={() => setIsDropdownOpen(!isDropdownOpen)} className="focus:outline-none">
                            <Image
                                src={userImage}
                                alt="User Avatar"
                                width={40}
                                height={40}
                                className="rounded-full"
                            />
                        </button>

                        {/* 드롭다운 메뉴: isDropdownOpen 상태에 따라 표시/숨김 */}
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
