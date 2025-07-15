'use client';

import throttle from 'lodash.throttle';
import React, { useEffect, useRef, useState } from 'react';
import { usePriceWebSocketData } from '@/app/context/PriceContext';
import {set} from "es-toolkit/compat";

declare global {
  interface Window {
    LightweightCharts: any;
  }
}
interface MainChartProps {
  symbol: string;
}

const MAX_WINDOW_SIZE = 500;

export default function MainChart({ symbol }: MainChartProps) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);
  const candleSeriesRef = useRef<any>(null);
  const volumeSeriesRef = useRef<any>(null);

  const { buffers } = usePriceWebSocketData();

  const [isChartReady, setIsChartReady] = useState(false);

  // 차트 초기화
  useEffect(() => {
    const initChart = () => {
      console.log("init")
      if (!chartContainerRef.current || !window.LightweightCharts) {
        setTimeout(initChart, 100);
        return;
      }

      if (chartRef.current) {
        chartRef.current.remove();
      }

      const chart = window.LightweightCharts.createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth,
        height: 400,
        layout: { backgroundColor: '#ffffff', textColor: '#000000' },
        grid: { vertLines: { color: '#eee' }, horzLines: { color: '#eee' } },
        timeScale: { timeVisible: true, secondsVisible: true },
        rightPriceScale: { scaleMargins: { top: 0.1, bottom: 0.3 } },
        crosshair: {
          vertLine: { color: '#758696', width: 1, style: 1 },
          horzLine: { color: '#758696', width: 1, style: 1 },
        },
      });

      chartRef.current = chart;

      candleSeriesRef.current = chart.addCandlestickSeries({
        upColor: '#26a69a',
        downColor: '#ef5350',
        borderVisible: false,
        wickUpColor: '#26a69a',
        wickDownColor: '#ef5350',
      });

      volumeSeriesRef.current = chart.addHistogramSeries({
        color: '#26a69a',
        priceFormat: { type: 'volume' },
        priceScaleId: 'volume',
        scaleMargins: { top: 0.8, bottom: 0 },
      });

      chart.priceScale('volume').applyOptions({
        scaleMargins: { top: 0.9, bottom: 0 },
      });

      chart.timeScale().fitContent();

      window.addEventListener('resize', () => {
        chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
      });

      setIsChartReady(true);
    };

    if (!window.LightweightCharts) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/lightweight-charts@3.8.0/dist/lightweight-charts.standalone.production.js';
      script.async = true;
      script.onload = initChart;
      document.head.appendChild(script);
    } else {
      initChart();
    }

    return () => {
      chartRef.current?.remove();
    };
  }, [symbol]);

  // 차트 데이터 반영
  useEffect(() => {
    if (!isChartReady) return;
    const interval = setInterval(() => {
      const buffer = buffers.current[symbol];
      if (!buffer || buffer.length === 0) return;

      const candleData = buffer.map((entry) => entry.candle);
      const volumeData = buffer.map((entry) => entry.volume);

      candleSeriesRef.current?.setData(candleData);
      volumeSeriesRef.current?.setData(volumeData);
    }, 1000); // 1초마다 갱신

    return () => clearInterval(interval);
  }, [isChartReady, symbol]);


  return (
      <div
          ref={chartContainerRef}
          className="w-full h-96 bg-white"
          style={{ margin: 0, padding: 0, overflow: 'hidden' }}
      />
  );
}
