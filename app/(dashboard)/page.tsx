import BalanceCard from '../components/BalanceCard';
import InvestedCard from '../components/InvestedCard';
import MyStocks from '../components/MyStocks';
import PortfolioChart from '../components/PortfolioChart';
import TopBar from '../components/TopBar';

export default function Home() {
  return (
    <div className="w-full">
      <TopBar />
      <div className="mt-8 grid grid-cols-3 gap-8">
        <div className="col-span-3">
          <MyStocks />
        </div>
        <div className="col-span-1 flex flex-col gap-8">
          <BalanceCard />
          <InvestedCard />
        </div>
        <div className="col-span-2">
          <PortfolioChart />
        </div>
      </div>
    </div>
  );
}