'use client';

import React, { useEffect, useRef, useState } from 'react';
import throttle from 'lodash.throttle';

declare global {
  interface Window {
    LightweightCharts: any;
  }
}

interface CandleData {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface VolumeData {
  time: number;
  value: number;
  color: string;
}

interface MainChartProps {
  onPriceChange: (price: number) => void;
}

const MAX_WINDOW_SIZE = 500;     // 윈도잉 최대 봉 개수
const THROTTLE_INTERVAL = 200;   // ms 단위 업데이트 간격

export default function MainChart({ onPriceChange }: MainChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  // 내부 버퍼 (최대 MAX_WINDOW_SIZE)
  const candleBufferRef = useRef<CandleData[]>([]);
  const volumeBufferRef = useRef<VolumeData[]>([]);

  const [isChartReady, setIsChartReady] = useState(false);
  const isInitialLoad = useRef(true);

  // 1. 차트 초기화
  useEffect(() => {
    const initChart = () => {
      if (!chartContainerRef.current || !window.LightweightCharts) {
        setTimeout(initChart, 100);
        return;
      }
      if (chartRef.current) {
        chartRef.current.remove();
      }

      const chart = window.LightweightCharts.createChart(
        chartContainerRef.current,
        {
          width: chartContainerRef.current.clientWidth,
          height: 400,
          layout: { backgroundColor: '#ffffff', textColor: '#000' },
          grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
          timeScale: { timeVisible: true, secondsVisible: true },
          rightPriceScale: { scaleMargins: { top: 0.1, bottom: 0.3 } },
          crosshair: {
            vertLine: { color: '#758696', width: 1, style: 1 },
            horzLine: { color: '#758696', width: 1, style: 1 },
          },
        }
      );
      chartRef.current = chart;

      const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });
      candleSeriesRef.current = candleSeries;

      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
        scaleMargins: { top: 0.8, bottom: 0 },
      });
      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.9, bottom: 0 },
      });
      volumeSeriesRef.current = volumeSeries;

      // 화면에 맞춰 초기 윈도잉 데이터를 설정
      chart.timeScale().fitContent();
      isInitialLoad.current = false;

      window.addEventListener('resize', () => {
        chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
      });

      setIsChartReady(true);
    };

    // LWC 스크립트 로딩
    if (!window.LightweightCharts) {
      const script = document.createElement('script');
      script.src =
        'https://unpkg.com/lightweight-charts@3.8.0/dist/lightweight-charts.standalone.production.js';
      script.async = true;
      script.onload = initChart;
      document.head.appendChild(script);
    } else {
      initChart();
    }

    return () => {
      chartRef.current?.remove();
      window.removeEventListener('resize', () => {});
    };
  }, []);

  // 2. WebSocket + 윈도잉 + 스로틀링
  useEffect(() => {
    if (!isChartReady) return;

    const ws = new WebSocket('ws://localhost:8080');

    // 실제 시리즈에 반영할 throttle 함수
    const throttledApply = throttle(() => {
      const candles = candleBufferRef.current;
      const volumes = volumeBufferRef.current;
      candleSeriesRef.current!.setData(candles);
      volumeSeriesRef.current!.setData(volumes);
    }, THROTTLE_INTERVAL);

    ws.onopen = () => {
      console.log('✅ WebSocket opened');
    };

    ws.onmessage = (evt) => {
      const data = JSON.parse(evt.data);
      const { candle, volume, initial } = data;

      // 버퍼에 추가
      candleBufferRef.current.push(candle);
      volumeBufferRef.current.push(volume);

      // 윈도우 크기 유지
      if (candleBufferRef.current.length > MAX_WINDOW_SIZE) {
        candleBufferRef.current.shift();
        volumeBufferRef.current.shift();
      }

      if (!initial) {
        // 초기 로드 이후에는 throttle 된 업데이트 적용
        throttledApply();
        onPriceChange(candle.close);
      }
    };

    ws.onerror = (err) => console.error('❌ WebSocket error', err);
    ws.onclose = () => console.log('🔌 WebSocket closed');

    return () => {
      ws.close();
      throttledApply.cancel();
    };
  }, [isChartReady, onPriceChange]);

  return (
    <div
      ref={chartContainerRef}
      className="w-full h-96 bg-white"
      style={{ margin: 0, padding: 0, overflow: 'hidden' }}
    />
  );
}
