'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FaSearch, FaBell, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function Header() {
    const { data: session } = useSession();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null); // 드롭다운 DOM을 참조하기 위한 ref

    // 세션에서 사용자 정보를 가져옵니다.
    const userName = session?.user?.name ?? 'User';
    const userEmail = session?.user?.email ?? 'user@example.com';
    const userImage = session?.user?.image ?? '/default-avatar.png'; // public 폴더에 기본 아바타 이미지가 있다고 가정

    // 드롭다운 메뉴 바깥을 클릭하면 메뉴가 닫히도록 하는 로직
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        // 이벤트 리스너 등록
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            // 컴포넌트가 언마운트될 때 이벤트 리스너 제거
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);


    return (
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
                <button className="text-gray-500 hover:text-gray-800">
                    <FaBell className="text-xl" />
                </button>

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
    );
}