import TradingHeader from '../../components/trading/TradingHeader';
import MainChart from '../../components/trading/MainChart';
import OrderPanel from '../../components/trading/OrderPanel';
import MarketList from '../../components/trading/MarketList';

export default function TradingPage() {
  return (
    <div className="w-full">
      <TradingHeader />
      <div className="mt-4 grid grid-cols-12 gap-4">
        <div className="col-span-8 flex flex-col gap-4">
          <MainChart />
          <OrderPanel />
        </div>
        <div className="col-span-4">
          <MarketList />
        </div>
      </div>
    </div>
  );
}