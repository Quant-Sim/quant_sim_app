'use client';

import React, {createContext, useContext, useEffect, useRef, useState} from 'react';

export type Order = {
    type: '매수' | '매도';
    price: number;
    quantity: number;
    total: number;
    timestamp: string;
    time: number; // 차트 마커 표시를 위한 UNIX 타임스탬프 (초 단위)
};


type OrderContextType = {
    orders: { [key: string]: Order[] }; // 심볼별 주문 리스트
    setOrders: (orders: { [key: string]: Order[] }) => void;
};

const MAX_WINDOW_SIZE = 500;     // 윈도잉 최대 봉 개수
// THROTTLE_INTERVAL is defined but not used. You might want to implement throttling.
// const THROTTLE_INTERVAL = 200;   // ms 단위 업데이트 간격

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export const OrderProvider = ({children}: { children: React.ReactNode }) => {
    const [orders, setOrders] = useState<{ [key: string]: Order[] }>({});

    useEffect(() => {
        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws/order`);

        socket.onerror = (error) => {
            console.error('Order WebSocket error:', error);
        };

        socket.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const updated: { [key: string]: Order[] } = {};
            for (const [symbol, value] of Object.entries(data)) {
                updated[symbol] = value as Order[];
            }
            setOrders((prev) => {
                return updated;
            })
        };

        socket.onclose = () => {
            console.log('Order WebSocket disconnected.');
        };

        // 컴포넌트가 언마운트될 때 cleanup 함수가 실행됩니다.
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);

    return (
        <OrderContext.Provider value={{orders, setOrders}}>
            {children}
        </OrderContext.Provider>
    );
};

export const useOrderWebSocketData = () => {
    const ctx = useContext(OrderContext);
    if (!ctx) throw new Error('useOrderWebSocketData must be used inside a OrderProvider');
    return ctx;
}