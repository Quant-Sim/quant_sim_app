'use client';
import { useState } from 'react';

const timeRanges = ['1D', '5D', '1M', '6M', '1Y', '5Y', 'Max'];

export default function PortfolioChart() {
  const [activeRange, setActiveRange] = useState('1D');

  return (
    <div className="bg-white p-6 rounded-2xl h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-fox-dark-blue">Portfolio Analytics</h3>
        <div className="flex items-center gap-2">
          {timeRanges.map((range) => (
            <button
              key={range}
              onClick={() => setActiveRange(range)}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                activeRange === range
                  ? 'bg-fox-light-purple text-fox-purple'
                  : 'text-fox-text-gray hover:bg-gray-100'
              }`}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      <div className="relative h-64 mt-8">
        {/* Y-Axis Labels */}
        <div className="absolute -left-10 top-0 h-full flex flex-col justify-between text-xs text-fox-text-gray">
          <span>$15000</span>
          <span>$12000</span>
          <span>$9000</span>
          <span>$6000</span>
          <span>$3000</span>
          <span>$0</span>
        </div>

        {/* Chart SVG */}
        <svg width="100%" height="100%" viewBox="0 0 500 150" preserveAspectRatio="none">
          {/* Grid lines */}
          {[0, 30, 60, 90, 120, 150].map(y => (
            <line key={y} x1="0" y1={y} x2="500" y2={y} stroke="#f3f4f6" strokeWidth="1" />
          ))}
          {/* Chart line */}
          <polyline
            fill="none"
            stroke="#8b5cf6"
            strokeWidth="2"
            points="0,100 50,80 100,90 150,60 200,70 250,40 300,50 350,20 400,30 450,10 500,25"
          />
        </svg>

        {/* Tooltip */}
        <div className="absolute" style={{ left: '48%', top: '20%' }}>
          <div className="bg-fox-purple text-white text-center p-2 rounded-lg shadow-lg">
            <p className="text-xs font-light">Jan 30, 01:12:16 AM</p>
            <p className="font-bold">$14,032.56</p>
          </div>
          <div className="w-px h-16 bg-gray-300 mx-auto mt-1"></div>
          <div className="w-2.5 h-2.5 bg-fox-purple rounded-full border-2 border-white absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"></div>
        </div>

        {/* X-Axis Labels */}
        <div className="absolute -bottom-6 w-full flex justify-between text-xs text-fox-text-gray">
          <span>10 am</span>
          <span>11 am</span>
          <span>12 pm</span>
          <span>1 pm</span>
          <span>2 pm</span>
          <span>3 pm</span>
        </div>
      </div>
    </div>
  );
}