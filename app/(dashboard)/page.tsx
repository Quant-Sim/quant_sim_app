import BalanceCard from '../components/BalanceCard';
import InvestedCard from '../components/InvestedCard';
import MyStocks from '../components/MyStocks';
import PortfolioChart from '../components/PortfolioChart';

export default function Home() {
    return (
        // 전체 페이지를 세로 방향 flex 컨테이너로 설정하고, 각 행 사이에 간격을 줍니다.
        <div className="flex w-full flex-col gap-8">

            {/* --- 1번째 행: My Stocks --- */}
            {/* 이 컴포넌트는 항상 전체 너비를 차지합니다. */}
            <MyStocks />

            {/* --- 2번째 행: 잔고 카드 및 포트폴리오 분석 차트 --- */}
            {/* 이 행을 Grid로 만듭니다. */}
            {/* 기본(모바일): 1열 그리드 (모든 요소가 세로로 쌓임) */}
            {/* 넓은 화면(lg) 이상: 3열 그리드 (차트가 더 넓은 공간을 차지) */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">

                {/* 왼쪽 열: 잔고 및 투자 카드 (넓은 화면에서 1칸 차지) */}
                <div className="flex flex-col gap-8 lg:col-span-1">
                    <BalanceCard />
                    <InvestedCard />
                </div>

                {/* 오른쪽 열: 포트폴리오 차트 (넓은 화면에서 2칸 차지) */}
                <div className="lg:col-span-2">
                    <PortfolioChart />
                </div>
            </div>
        </div>
    );
}