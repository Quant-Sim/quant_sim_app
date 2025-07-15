'use client';

import React, {createContext, useContext, useEffect, useRef, useState} from 'react';

export type StockInfo = {
    symbol: string;
    name: string;
    sector: string;
    industry: string;
}

type CandleData = {
    time: number;
    open: number;
    high: number;
    low: number;
    close: number;
};

type VolumeData = {
    time: number;
    value: number;
    color: string;
};

type PriceData = {
    candle: CandleData;
    volume: VolumeData;
    initial: boolean;
    symbol: string;
};

type PriceContextType = {
    prices: { [key: string]: PriceData };
    buffers: React.MutableRefObject<{ [symbol: string]: PriceData[] }>;
    stockInfos: StockInfo[];
};

const MAX_WINDOW_SIZE = 500;     // 윈도잉 최대 봉 개수
// THROTTLE_INTERVAL is defined but not used. You might want to implement throttling.
// const THROTTLE_INTERVAL = 200;   // ms 단위 업데이트 간격

const PriceContext = createContext<PriceContextType | undefined>(undefined);

export const PriceProvider = ({children}: { children: React.ReactNode }) => {
    const [prices, setPrices] = useState<{ [key: string]: PriceData }>({});
    const [stockInfos, setStockInfos] = useState<StockInfo[]>([]);
    const buffers = useRef<{ [symbol: string]: PriceData[] }>({});
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        // WebSocket이 이미 연결되어 있으면 중복 연결을 방지합니다.
        if (socketRef.current) return;

        const socket = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws`);
        socketRef.current = socket;
        console.log('Trying to connect to WebSocket at:', socket.url);

        socket.onerror = (error) => {
            console.error('Price WebSocket error:', error);
        };

        socket.onopen = () => {
            console.log('Price WebSocket connected.');
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
            const data = JSON.parse(event.data);
            const updated: { [symbol: string]: PriceData } = {};
            for (const [symbol, value] of Object.entries(data)) {
                if (!buffers.current[symbol]) {
                    buffers.current[symbol] = [];
                }

                if (Array.isArray(value)) {
                    // value가 리스트일 경우
                    for (const update of value) {
                        buffers.current[symbol].push(update as PriceData);
                        // 윈도 크기 초과 시 제거
                        if (buffers.current[symbol].length > MAX_WINDOW_SIZE) {
                            buffers.current[symbol].shift();
                        }
                        updated[symbol] = update as PriceData; // 가장 최근 값으로 prices[symbol] 업데이트
                    }
                    console.log("buffer", symbol, buffers.current[symbol].length)
                } else {
                    // 단일 dict일 경우
                    buffers.current[symbol].push(value as PriceData);
                    if (buffers.current[symbol].length > MAX_WINDOW_SIZE) {
                        buffers.current[symbol].shift();
                    }
                    updated[symbol] = value as PriceData;
                }
            }
            setPrices((prev) => {
                // console.log("updated prices:", updated);
                return updated;
            });
        };


        socket.onclose = () => {
            console.log('Price WebSocket disconnected.');
            socketRef.current = null; // 연결이 닫히면 ref를 null로 설정합니다.
        };

        // 컴포넌트가 언마운트될 때 cleanup 함수가 실행됩니다.
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.close();
            }
        };
    }, []);


    return (
        <PriceContext.Provider value={{prices, buffers, stockInfos}}>
            {children}
        </PriceContext.Provider>
    );
};

export const usePriceWebSocketData = () => {
    const ctx = useContext(PriceContext);
    if (!ctx) throw new Error('usePriceWebSocketData must be used inside a PriceProvider');
    return ctx;
}