'use client';

import React, {useEffect, useRef, useState} from 'react';


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

const initialCandleData: CandleData[] = [
    {time: 1720000000, open: 65000, high: 66500, low: 64800, close: 66200},
    {time: 1720000600, open: 66200, high: 67100, low: 65900, close: 66800},
    {time: 1720001200, open: 66800, high: 67200, low: 66400, close: 66900},
    {time: 1720001800, open: 66900, high: 67800, low: 66700, close: 67500},
    {time: 1720002400, open: 67500, high: 68200, low: 67200, close: 67800},
    {time: 1720003000, open: 67800, high: 68500, low: 67600, close: 68100},
    {time: 1720003600, open: 68100, high: 68800, low: 67900, close: 68400},
    {time: 1720004200, open: 68400, high: 69000, low: 68200, close: 68700},
    {time: 1720004800, open: 68700, high: 69200, low: 68500, close: 68900},
    {time: 1720005400, open: 68900, high: 69500, low: 68800, close: 69200},
];

const initialVolumeData: VolumeData[] = [
    {time: 1720000000, value: 85, color: '#26a69a'},
    {time: 1720000600, value: 92, color: '#26a69a'},
    {time: 1720001200, value: 78, color: '#ef5350'},
    {time: 1720001800, value: 110, color: '#26a69a'},
    {time: 1720002400, value: 95, color: '#26a69a'},
    {time: 1720003000, value: 120, color: '#26a69a'},
    {time: 1720003600, value: 88, color: '#ef5350'},
    {time: 1720004200, value: 105, color: '#26a69a'},
    {time: 1720004800, value: 76, color: '#ef5350'},
    {time: 1720005400, value: 115, color: '#26a69a'},
];

interface MainChartProps {
    onPriceChange: (price: number) => void;
}

const MainChart = ({onPriceChange}: MainChartProps) => {
    console.log('🔨 MainChart mounted');
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);
    const candleSeriesRef = useRef<any>(null);
    const volumeSeriesRef = useRef<any>(null);

    const [candleData, setCandleData] = useState<CandleData[]>(initialCandleData);
    const [volumeData, setVolumeData] = useState<VolumeData[]>(initialVolumeData);
    const [isChartReady, setIsChartReady] = useState(false);
    const isInitialLoad = useRef(true);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const savedCandleData = localStorage.getItem('candleData');
            const savedVolumeData = localStorage.getItem('volumeData');
            if (savedCandleData) setCandleData(JSON.parse(savedCandleData));
            if (savedVolumeData) setVolumeData(JSON.parse(savedVolumeData));
        }
    }, []);

    useEffect(() => {
        const loadChartScriptAndInit = () => {
            if (!window.LightweightCharts) {
                const script = document.createElement('script');
                script.src = 'https://unpkg.com/lightweight-charts@3.8.0/dist/lightweight-charts.standalone.production.js';
                script.async = true;
                script.onload = initChart;
                document.head.appendChild(script);
            } else {
                initChart();
            }
        };

        const initChart = () => {
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
                layout: {backgroundColor: '#ffffff', textColor: '#000'},
                grid: {vertLines: {color: '#eee'}, horzLines: {color: '#eee'}},
                timeScale: {timeVisible: true, secondsVisible: true},
                rightPriceScale: {scaleMargins: {top: 0.1, bottom: 0.3}},
                crosshair: {
                    vertLine: {color: '#758696', width: 1, style: 1},
                    horzLine: {color: '#758696', width: 1, style: 1},
                },
            });

            chartRef.current = chart;

            const candleSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });
            candleSeries.setData(candleData);
            candleSeriesRef.current = candleSeries;

            const volumeSeries = chart.addHistogramSeries({
                color: '#26a69a',
                priceFormat: {type: 'volume'},
                priceScaleId: 'volume',
                scaleMargins: {top: 0.8, bottom: 0},
            });
            chart.priceScale('volume').applyOptions({
                scaleMargins: {top: 0.9, bottom: 0},
            });
            volumeSeries.setData(volumeData);
            volumeSeriesRef.current = volumeSeries;

            if (isInitialLoad.current && chartRef.current) {
                chartRef.current.timeScale().fitContent();
                isInitialLoad.current = false;
            }

            setIsChartReady(true); // ✅ WebSocket 연결 시작 가능

            const handleResize = () => {
                chartRef.current?.applyOptions({
                    width: chartContainerRef.current?.clientWidth || 0,
                });
            };
            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);
                chartRef.current?.remove();
                chartRef.current = null;
                candleSeriesRef.current = null;
                volumeSeriesRef.current = null;
            };
        };

        loadChartScriptAndInit();
    }, [candleData, volumeData]);


    useEffect(() => {
        if (!isChartReady || !candleSeriesRef.current || !volumeSeriesRef.current) return;

        console.log('🧠 WebSocket 연결 시작');
        // @ts-ignore
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}/ws`);

        const candleBuffer: CandleData[] = [];
        const volumeBuffer: VolumeData[] = [];
        let initialized = false;

        ws.onopen = () => console.log('✅ WebSocket opened');

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            const {candle, volume, initial} = data;

            if (initial) {
                // 초기 데이터면 버퍼에 저장
                candleBuffer.push(candle);
                volumeBuffer.push(volume);
            } else {
                // 최초 실시간 데이터 도착 시 버퍼 렌더링
                if (!initialized) {
                    candleSeriesRef.current.setData([...candleBuffer, candle]);
                    volumeSeriesRef.current.setData([...volumeBuffer, volume]);
                    initialized = true;
                } else {
                    // 이후는 실시간 업데이트
                    candleSeriesRef.current.update(candle);
                    volumeSeriesRef.current.update(volume);
                }

                onPriceChange(candle.close);
            }
        };

        ws.onerror = (error) => console.error('❌ WebSocket error:', error);
        ws.onclose = () => console.log('🔌 WebSocket closed');

        return () => {
            ws.close();
        };
    }, [isChartReady, onPriceChange]);


    return (
        <div
            ref={chartContainerRef}
            className="w-full h-96 bg-white"
            style={{margin: 0, padding: 0, overflow: 'hidden'}}
        />
    );
};

export default MainChart;