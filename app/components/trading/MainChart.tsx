'use client';

import React, { useEffect, useRef } from 'react';

// TypeScript 타입 선언 - 글로벌 Window 객체에 LightweightCharts 추가
declare global {
  interface Window {
    LightweightCharts: any;
  }
}

const MainChart = () => {
  // 차트 컨테이너와 차트 인스턴스를 위한 ref
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    // Lightweight Charts 라이브러리 동적 로드 함수
    const loadChart = async () => {
      // CDN에서 라이브러리가 이미 로드되었는지 확인
      if (!(window as any).LightweightCharts) {
        // 스크립트 태그 생성 및 CDN에서 라이브러리 로드
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/lightweight-charts@3.8.0/dist/lightweight-charts.standalone.production.js';
        script.onload = () => initChart(); // 로드 완료 시 차트 초기화
        document.head.appendChild(script);
      } else {
        // 이미 로드되어 있으면 바로 차트 초기화
        initChart();
      }
    };

    // 차트 초기화 함수
    const initChart = () => {
      // 컨테이너 요소와 라이브러리 존재 여부 확인
      if (!chartContainerRef.current || !(window as any).LightweightCharts) return;

      // 차트 생성 및 기본 설정
      const chart = (window as any).LightweightCharts.createChart(chartContainerRef.current, {
        width: chartContainerRef.current.clientWidth, // 컨테이너 너비에 맞춤
        height: 400, // 고정 높이 설정
        layout: {
          backgroundColor: '#ffffff', // 배경색 흰색
          textColor: '#000', // 텍스트 색상 검은색
        },
        grid: {
          vertLines: { color: '#eee' }, // 수직 그리드 라인 색상
          horzLines: { color: '#eee' }, // 수평 그리드 라인 색상
        },
        timeScale: {
          timeVisible: true, // 시간 표시 활성화
          secondsVisible: true, // 초 단위 표시 활성화
        },
        rightPriceScale: {
          scaleMargins: {
            top: 0.1, // 상단 여백 10%
            bottom: 0.3, // 하단 여백 30% (거래량 영역 확보)
          },
        },
        crosshair: {
          vertLine: {
            color: '#758696', // 십자선 수직선 색상
            width: 1, // 선 두께
            style: 1, // 선 스타일 (실선)
          },
          horzLine: {
            color: '#758696', // 십자선 수평선 색상
            width: 1, // 선 두께
            style: 1, // 선 스타일 (실선)
          },
        },
      });

      // 캔들스틱 시리즈 추가
      const candleSeries = chart.addCandlestickSeries({
        upColor: '#26a69a', // 상승 캔들 색상 (녹색)
        downColor: '#ef5350', // 하락 캔들 색상 (빨간색)
        borderVisible: false, // 테두리 표시 비활성화
        wickUpColor: '#26a69a', // 상승 꼬리 색상
        wickDownColor: '#ef5350', // 하락 꼬리 색상
      });

      // 예시 데이터 (실제 BTC 가격 형태의 OHLC 데이터)
      const exampleData = [
        { time: 1720000000, open: 65000, high: 66500, low: 64800, close: 66200 },
        { time: 1720000600, open: 66200, high: 67100, low: 65900, close: 66800 },
        { time: 1720001200, open: 66800, high: 67200, low: 66400, close: 66900 },
        { time: 1720001800, open: 66900, high: 67800, low: 66700, close: 67500 },
        { time: 1720002400, open: 67500, high: 68200, low: 67200, close: 67800 },
        { time: 1720003000, open: 67800, high: 68500, low: 67600, close: 68100 },
        { time: 1720003600, open: 68100, high: 68800, low: 67900, close: 68400 },
        { time: 1720004200, open: 68400, high: 69000, low: 68200, close: 68700 },
        { time: 1720004800, open: 68700, high: 69200, low: 68500, close: 68900 },
        { time: 1720005400, open: 68900, high: 69500, low: 68800, close: 69200 },
      ];

      // 캔들스틱 데이터 설정
      candleSeries.setData(exampleData);

      // 거래량 히스토그램 시리즈 추가
      const volumeSeries = chart.addHistogramSeries({
        color: '#26a69a', // 기본 거래량 색상
        priceFormat: {
          type: 'volume', // 거래량 형태로 포맷팅
        },
        priceScaleId: 'volume', // 별도의 가격 스케일 ID 지정
        scaleMargins: {
          top: 0.8, // 상단 여백 80% (거래량 영역을 하단 20%로 축소)
          bottom: 0, // 하단 여백 0%
        },
      });

      // 거래량 전용 프라이스 스케일 설정
      chart.priceScale('volume').applyOptions({
        scaleMargins: {
          top: 0.9, // 상단 여백 90% (거래량 영역 높이 10%로 축소)
          bottom: 0, // 하단 여백 0%
        },
      });

      // 거래량 데이터 (각 시간대별 거래량과 색상)
      const volumeData = [
        { time: 1720000000, value: 85, color: '#26a69a' }, // 상승 거래량
        { time: 1720000600, value: 92, color: '#26a69a' }, // 상승 거래량
        { time: 1720001200, value: 78, color: '#ef5350' }, // 하락 거래량
        { time: 1720001800, value: 110, color: '#26a69a' }, // 상승 거래량
        { time: 1720002400, value: 95, color: '#26a69a' }, // 상승 거래량
        { time: 1720003000, value: 120, color: '#26a69a' }, // 상승 거래량
        { time: 1720003600, value: 88, color: '#ef5350' }, // 하락 거래량
        { time: 1720004200, value: 105, color: '#26a69a' }, // 상승 거래량
        { time: 1720004800, value: 76, color: '#ef5350' }, // 하락 거래량
        { time: 1720005400, value: 115, color: '#26a69a' }, // 상승 거래량
      ];

      // 거래량 데이터 설정
      volumeSeries.setData(volumeData);

      // 차트 인스턴스 저장
      chartRef.current = chart;

      // 윈도우 리사이즈 이벤트 핸들러
      const handleResize = () => {
        if (chartRef.current && chartContainerRef.current) {
          // 창 크기 변경 시 차트 크기 조정
          chartRef.current.applyOptions({
            width: chartContainerRef.current.clientWidth,
            height: 400, // 고정 높이 유지
          });
        }
      };

      // 리사이즈 이벤트 리스너 등록
      window.addEventListener('resize', handleResize);

      // 실시간 데이터 업데이트 시뮬레이션
      const updateInterval = setInterval(() => {
        // 마지막 데이터 포인트 가져오기
        const lastData = exampleData[exampleData.length - 1];
        const newTime = lastData.time + 600; // 10분 간격으로 새 데이터 생성
        
        // 새로운 가격 계산 (랜덤 변동)
        const newPrice = lastData.close + (Math.random() - 0.5) * 1000;
        const newHigh = Math.max(lastData.close, newPrice) + Math.random() * 200;
        const newLow = Math.min(lastData.close, newPrice) - Math.random() * 200;
        
        // 새로운 캔들 데이터 생성
        const newCandle = {
          time: newTime,
          open: lastData.close, // 이전 종가를 시가로 사용
          high: newHigh,
          low: newLow,
          close: newPrice,
        };

        // 새로운 거래량 데이터 생성
        const newVolume = {
          time: newTime,
          value: Math.floor(Math.random() * 500000) + 700000, // 랜덤 거래량
          color: newPrice > lastData.close ? '#26a69a' : '#ef5350', // 가격 상승/하락에 따른 색상
        };

        // 차트에 새 데이터 업데이트
        candleSeries.update(newCandle);
        volumeSeries.update(newVolume);
        
        // 데이터 배열에 새 데이터 추가
        exampleData.push(newCandle);
        
        // 데이터가 너무 많아지면 오래된 데이터 제거 (성능 최적화)
        if (exampleData.length > 100) {
          exampleData.shift();
        }
      }, 1000); // 1초마다 업데이트

      // 클린업 함수 반환
      return () => {
        window.removeEventListener('resize', handleResize); // 리사이즈 이벤트 해제
        clearInterval(updateInterval); // 업데이트 인터벌 해제
        if (chartRef.current) {
          chartRef.current.remove(); // 차트 인스턴스 제거
        }
      };
    };

    // 차트 로드 시작
    loadChart();

    // 컴포넌트 언마운트 시 클린업
    return () => {
      if (chartRef.current) {
        chartRef.current.remove(); // 차트 인스턴스 제거
      }
    };
  }, []); // 의존성 배열이 빈 배열이므로 마운트 시에만 실행

  return (
    <div 
      ref={chartContainerRef}
      className="w-full h-96 bg-white" // Tailwind CSS: 전체 너비, 높이 384px, 흰색 배경
      style={{ 
        margin: 0, // 마진 제거
        padding: 0, // 패딩 제거
        overflow: 'hidden' // 오버플로우 숨김
      }}
    />
  );
};

export default MainChart;