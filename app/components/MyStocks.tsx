'use client';

import {FaArrowRight} from 'react-icons/fa';
import {MyStock, useUser} from "../context/UserContext";
import {usePriceWebSocketData} from "@/app/context/PriceContext";

const MiniChart = ({points, color}: { points: string, color: string }) => (
    <svg width="100" height="40" viewBox="0 0 100 40" className="opacity-70">
        <polyline fill="none" stroke={color} strokeWidth="2" points={points}/>
    </svg>
);

const stocks = [
    {
        name: 'Nvidia',
        symbol: 'NVDA',
        value: '203.65',
        change: '+5.63',
        color: 'bg-green-100',
        chartColor: '#22c55e',
        points: "0,30 20,20 40,25 60,15 80,10 100,18"
    },
    {
        name: 'Meta',
        symbol: 'META',
        value: '151.74',
        change: '-4.44',
        color: 'bg-purple-100',
        chartColor: '#a855f7',
        points: "0,10 20,15 40,12 60,25 80,30 100,22"
    },
    {
        name: 'Tesla Inc',
        symbol: 'TSLA',
        value: '177.90',
        change: '+17.63',
        color: 'bg-yellow-100',
        chartColor: '#f59e0b',
        points: "0,35 20,30 40,10 60,15 80,5 100,12"
    },
    {
        name: 'Apple Inc',
        symbol: 'AAPL',
        value: '145.93',
        change: '+23.41',
        color: 'bg-blue-100',
        chartColor: '#3b82f6',
        points: "0,20 20,25 40,15 60,18 80,10 100,5"
    },
    {
        name: 'Advanced Micro',
        symbol: 'AMD',
        value: '75.40',
        change: '+25.45',
        color: 'bg-red-100',
        chartColor: '#ef4444',
        points: "0,15 20,10 40,20 60,25 80,35 100,30"
    },
];

export default function MyStocks() {
    const {user} = useUser();

    if (!user) return null;

    return (
        <div>
            <h2 className="text-lg font-bold text-fox-dark-blue mb-4">My Stocks</h2>
            <div className="grid grid-cols-6 gap-4">
                {user.stocks.map((stock: MyStock) => (
                    <div key={stock.symbol} className={`p-4 rounded-xl ${stock.color}`}>
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="font-bold text-fox-dark-blue">{stock.symbol}</p>
                                <p className="text-xs text-gray-500">{stock.name}</p>
                            </div>
                            <p className={`text-xs font-semibold ${stock.change>=0 ? 'text-green-600' : 'text-red-600'}`}>{stock.change}</p>
                        </div>
                        <div className="mt-2">
                            <p className="text-xs text-gray-500">Current Value</p>
                            <p className="text-2xl font-bold text-fox-dark-blue">${stock.total}</p>
                        </div>
                        <div className="mt-2">
                            <MiniChart points={stock.points} color={stock.chartColor}/>
                        </div>
                    </div>
                ))}
                <div
                    className="flex items-center justify-center bg-fox-purple rounded-xl cursor-pointer hover:opacity-90">
                    <FaArrowRight className="text-white text-2xl"/>
                </div>
            </div>
        </div>
    );
}