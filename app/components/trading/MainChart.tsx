// This is a static placeholder for a trading chart.
// In a real application, this would be an integration with a charting library like TradingView.
export default function MainChart() {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center gap-4 text-xs font-semibold">
          {['1분', '30분', '1시간', '4시간', '일'].map(t => (
            <button key={t} className="text-gray-500 hover:text-black">{t}</button>
          ))}
        </div>
        <div className="text-xs text-gray-500">
          BTC/KRW - 1일 - UPBIT
        </div>
      </div>
      <div className="h-80 w-full flex items-center justify-center bg-gray-50 mt-2">
        <p className="text-gray-400">[Chart Placeholder]</p>
        {/* A real implementation would have a candlestick chart here */}
      </div>
      <div className="text-xs text-gray-400 text-right mt-1">
        19:44:07 (UTC+9)
      </div>
    </div>
  );
}