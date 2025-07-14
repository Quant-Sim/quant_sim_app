'use client';
import React, {createContext, useContext, useEffect, useState} from "react";
import {useSession} from "next-auth/react";

export type User = {
    username: string;
    email: string;
    full_name: string;
    id: number;
    is_active: boolean;
    balance: number;
    invested_money: number;
    stocks: Stock[]; // 혹은 stocks: Stock[]; (Stock 타입 정의 시)
    portfolio: Portfolio;
};

export type Stock = {
    name: string;         // 회사 이름
    symbol: string;       // 주식 코드
    value: string;        // 현재 주가 (문자열 형태로 전달됨)
    change: string;       // 변동폭 (예: "+5.63")
    color: string;        // 배경 색상 클래스 (Tailwind CSS 클래스)
    chartColor: string;   // 차트 색상 (Hex 색상 코드)
    points: string;       // SVG polyline points
};

export type Portfolio = {
    "1D": PortfolioItem[];
    "5D": PortfolioItem[];
    "1M": PortfolioItem[];
    "6M": PortfolioItem[];
    "1Y": PortfolioItem[];
    "Max": PortfolioItem[];
}

export type PortfolioItem = {
    date: string;    // 날짜 (ISO 형식 권장: "YYYY-MM-DD")
    value: number;   // 해당 날짜의 포트폴리오 총 가치
    change: number;  // 전일 대비 변화율 (예: 0.023 = 2.3%)
};


const UserContext = createContext<User | null>(null);

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const {data: session, status} = useSession(); // 👈 로그인 상태 가져오기

    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.email) return;
        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/user/${session?.user?.email}`);

        socket.onopen = () => console.log('✅User WebSocket opened');

        socket.onmessage = (event) => {
            const updatedUser = JSON.parse(event.data);
            setUser(updatedUser);
            console.log("🧪 User updated:", updatedUser); // 추가
        };

        socket.onerror = (e) => console.error("User WebSocket Error:", e);
        socket.onclose = () => console.log('🔌User WebSocket closed');
        return () => socket.close();
    }, [status, session?.user?.email]);

    return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    return useContext(UserContext);
};
