'use client';

import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { dataSets } from '../data/local/chart-data';

const timeRanges = ['1D', '5D', '1M', '6M', '1Y', 'Max'];

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-fox-purple text-white p-3 rounded-lg shadow-lg">
                <p className="text-sm font-semibold">{`Value : $${payload[0].value.toLocaleString()}`}</p>
                <p className="text-xs">{`Time : ${label}`}</p>
            </div>
        );
    }
    return null;
};

export default function PortfolioChart() {
    const [activeRange, setActiveRange] = useState('1D');

    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Portfolio Analytics</h3>
                <div className="flex gap-4 text-sm font-medium text-gray-500">
                    {timeRanges.map((range) => (
                        <span
                            key={range}
                            onClick={() => setActiveRange(range)}
                            className={`cursor-pointer ${
                                activeRange === range
                                    ? 'text-fox-purple font-bold'
                                    : 'hover:text-gray-800'
                            }`}
                        >
              {range}
            </span>
                    ))}
                </div>
            </div>
            <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        // 2. import한 데이터를 사용합니다. (이 부분은 변경 없음)
                        data={dataSets[activeRange]}
                        margin={{ top: 5, right: 10, left: 30, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} tick={{ fill: '#9ca3af' }} />
                        <YAxis
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${(value / 1000)}k`}
                            domain={['dataMin - 1000', 'dataMax + 1000']}
                            tick={{ fill: '#9ca3af' }}
                            tickMargin={10}
                        />
                        <Tooltip
                            content={<CustomTooltip />}
                            wrapperStyle={{ outline: 'none' }}
                            position={{ y: 60 }}
                            cursor={{ stroke: '#8884d8', strokeWidth: 1, strokeDasharray: '3 3' }}
                        />
                        <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={{ r: 5 }} activeDot={{ r: 8 }} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}