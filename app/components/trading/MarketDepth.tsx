

'use client';
import React from 'react';

interface DepthEntry {
  price: number;
  volume: number;
}

interface MarketDepthProps {
  symbol?: string;
}

const mockDepth: { bids: DepthEntry[]; asks: DepthEntry[] } = {
  bids: [
    { price: 15962000, volume: 1.2 },
    { price: 15961000, volume: 0.8 },
    { price: 15960000, volume: 0.5 },
    { price: 15959000, volume: 2.1 },
    { price: 15958000, volume: 1.5 },
  ],
  asks: [
    { price: 15963000, volume: 0.9 },
    { price: 15964000, volume: 1.0 },
    { price: 15965000, volume: 0.7 },
    { price: 15966000, volume: 1.3 },
    { price: 15967000, volume: 0.4 },
  ],
};

export default function MarketDepth({ symbol = 'BTC/KRW' }: MarketDepthProps) {
  return (
    <div className="h-full bg-gray-50 rounded p-4 flex flex-col">
      <h3 className="font-bold mb-2">{symbol} 마켓뎁스</h3>
      <div className="flex-1 overflow-auto">
        <div className="grid grid-cols-2 text-xs">
          <div>
            <p className="font-semibold mb-1 text-right">Bids (매수)</p>
            {mockDepth.bids.map((entry, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-red-500">{entry.price.toLocaleString()}</span>
                <span>{entry.volume}</span>
              </div>
            ))}
          </div>
          <div>
            <p className="font-semibold mb-1 text-right">Asks (매도)</p>
            {mockDepth.asks.map((entry, idx) => (
              <div key={idx} className="flex justify-between">
                <span className="text-blue-500">{entry.price.toLocaleString()}</span>
                <span>{entry.volume}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}