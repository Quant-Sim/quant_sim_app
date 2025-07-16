'use client';
import React, {createContext, useContext, useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {StockInfo} from "@/app/context/PriceContext";

export type User = {
    username: string;
    email: string;
    full_name: string;
    id: number;
    is_active: boolean;
    balance: number;
    invested_money: number;
    stocks: MyStock[]; // 혹은 stocks: Stock[]; (Stock 타입 정의 시)
    portfolio: Portfolio;
} | null;

export type MyStock = {
    name: string;         // 회사 이름
    symbol: string;       // 주식 코드
    price: number;
    quantity: number;
    total: number;        // 보유 주식 총액 (예: 100주 * 5000원 = 500000원)
    change: number;       // 변동폭 (예: "+5.63")
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

type UserContextType = {
    user: User;
    setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({children}: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User>(null);
    const {data: session, status} = useSession(); // 👈 로그인 상태 가져오기
    const [stockInfos, setStockInfos] = useState<StockInfo[]>([]);

    useEffect(() => {
        if (status !== "authenticated" || !session?.user?.email) return;
        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/user/${session?.user?.email}`);

        socket.onopen = () => {
            console.log('✅User WebSocket opened');
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/backend/stock/list`)
                .then((response) => response.json())
                .then((stockInfo: StockInfo[]) => {
                    setStockInfos(stockInfo);
                })
                .catch((error) => {
                    console.error('Failed to fetch stock list:', error);
                });
        };

        socket.onmessage = (event) => {
            const updatedUser = JSON.parse(event.data);
            updatedUser['name'] = stockInfos.find(
                (stock) => stock.symbol === updatedUser['symbol']
            )?.name ?? updatedUser['symbol'];
            setUser(updatedUser);
            console.log("🧪 User updated:", updatedUser); // 추가
        };

        socket.onerror = (e) => console.error("User WebSocket Error:", e);
        socket.onclose = () => console.log('🔌User WebSocket closed');
        return () => socket.close();
    }, [status, session?.user?.email]);

    return <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>;
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};
