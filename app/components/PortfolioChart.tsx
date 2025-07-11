'use client';

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// 샘플 데이터
const data = [
    { name: '10 am', value: 8500 },
    { name: '11 am', value: 10500 },
    { name: '12 pm', value: 9800 },
    { name: '01 pm', value: 12400 },
    { name: '02 pm', value: 11000 },
    { name: '03 pm', value: 13800 },
    { name: '04 pm', value: 13200 },
];

// 커스텀 툴팁 컴포넌트
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
    return (
        <div className="bg-white p-6 rounded-lg shadow-md h-full">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Portfolio Analytics</h3>
                <div className="flex gap-4 text-sm font-medium text-gray-500">
                    <span className="text-fox-purple cursor-pointer">1D</span>
                    <span className="hover:text-gray-800 cursor-pointer">5D</span>
                    <span className="hover:text-gray-800 cursor-pointer">1M</span>
                    <span className="hover:text-gray-800 cursor-pointer">6M</span>
                    <span className="hover:text-gray-800 cursor-pointer">1Y</span>
                    <span className="hover:text-gray-800 cursor-pointer">Max</span>
                </div>
            </div>
            <div style={{ width: '100%', height: 320 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={data}
                        // --- Y축 위치 변경에 따른 마진 수정 ---
                        // 왼쪽 여백(left)을 줄이고, 오른쪽 여백(right)을 늘려 Y축 레이블 공간을 확보합니다.
                        margin={{
                            top: 5,
                            right: 5, // Y축 레이블이 들어갈 공간
                            left: 10,
                            bottom: 5,
                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                        <XAxis dataKey="name" tickLine={false} axisLine={false} dy={10} tick={{ fill: '#9ca3af' }} />
                        <YAxis
                            // --- 1. Y축을 오른쪽으로 이동시키는 속성 ---
                            orientation="right"
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `$${(value / 1000)}k`}
                            domain={['dataMin - 1000', 'dataMax + 1000']}
                            tick={{ fill: '#9ca3af' }}
                            // Y축 레이블과 축 사이의 간격을 조정
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