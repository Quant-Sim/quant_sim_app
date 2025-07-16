'use client';

import {FaArrowRight} from 'react-icons/fa';
import {useUser} from '../context/UserContext';
import {useEffect, useMemo, useState} from "react";
import {usePriceWebSocketData} from "@/app/context/PriceContext";

export default function InvestedCard() {
    const {user} = useUser();
    const {prices} = usePriceWebSocketData();

    const nfKRW = useMemo(
        () => new Intl.NumberFormat('ko-KR'),
        []
    );

    if (!user) return null;

    let newInvestedMoney = 0;
    user.stocks.forEach(
        (stock) => {
            if (prices[stock.symbol]) {
                const price = prices[stock.symbol].candle.close;
                newInvestedMoney += stock.quantity * price;
            }
        }
    )

    const percentage = user.invested_money > 0
        ? (newInvestedMoney / user.invested_money * 100) - 100
        : 0;

    // 2. 조건에 따라 포맷팅된 문자열 생성
    const formattedPercentage = percentage > 0
        ? `+${percentage.toFixed(3)}`
        : percentage.toFixed(3);


    return (
        <div className="bg-fox-dark-blue text-white p-6 rounded-2xl">
            {/* 1. 두 요소를 감싸는 flex 컨테이너를 만듭니다. */}
            <div className="flex items-center justify-between">
                {/* 왼쪽 요소 */}
                <p className="text-sm text-gray-400">Invested</p>

                {/* 오른쪽 요소 (수익률) */}
                {/* 클래스명에 오타가 있어 수정했습니다: w-24bg-white/20 -> w-24 bg-white/20 */}
                <p className="bg-white/20 text-xs font-semibold px-2 py-1 rounded-md">
                    {formattedPercentage}%
                </p>
            </div>

            {/* 아래쪽 내용은 그대로 유지됩니다. */}
            <div className="flex items-center justify-between mt-4"> {/* 위쪽과 간격을 주기 위해 mt-4 추가 */}
                <p className="text-2xl font-bold">{nfKRW.format(parseInt(newInvestedMoney.toFixed(0)))}KRW</p>
                <button className="bg-fox-purple w-8 h-8 rounded-full flex items-center justify-center">
                    <FaArrowRight/>
                </button>
            </div>
        </div>
    );
}