'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient, Session } from '@supabase/auth-helpers-nextjs';
import { FaSearch, FaBell, FaSignOutAlt } from 'react-icons/fa';
import Image from 'next/image';

export default function Header() {
    const [session, setSession] = useState<Session | null>(null);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const supabase = createClientComponentClient();
    const router = useRouter();

    // 컴포넌트가 마운트될 때 Supabase 세션을 가져옵니다.
    useEffect(() => {
        const getSession = async () => {
            const { data } = await supabase.auth.getSession();
            setSession(data.session);
        };
        getSession();

        // 인증 상태 변경(로그인, 로그아웃)을 감지하여 세션을 업데이트합니다.
        const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
        });

        // 컴포넌트 언마운트 시 리스너를 정리합니다.
        return () => {
            authListener?.subscription.unsubscribe();
        };
    }, [supabase.auth]);

    // 드롭다운 메뉴 바깥을 클릭하면 메뉴가 닫히도록 하는 로직
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [dropdownRef]);

    // Supabase 세션에서 사용자 정보를 추출합니다.
    // Google 로그인: user_metadata.full_name, user_metadata.avatar_url
    // 이메일 가입: user_metadata.full_name (우리가 직접 넣어준 값)
    const userName = session?.user?.user_metadata?.full_name || session?.user?.email?.split('@')[0] || 'User';
    const userEmail = session?.user?.email ?? 'user@example.com';
    const userImage = session?.user?.user_metadata?.avatar_url ?? '/default-avatar.png';

    // 로그아웃 핸들러
    const handleSignOut = async () => {
        await supabase.auth.signOut();
        // 로그아웃 후 로그인 페이지로 이동하고, 페이지를 새로고침하여 상태를 초기화합니다.
        router.push('/login');
        router.refresh();
    };

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

                {/* --- 프로필 드롭다운 섹션 (로직만 수정) --- */}
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
                                    onClick={handleSignOut} // 💡 로그아웃 함수 변경
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