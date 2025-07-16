'use client';

import {useUser} from "../context/UserContext"
import {useMemo} from "react";

export default function BalanceCard() {

    const nfKRW = useMemo(
        () => new Intl.NumberFormat('ko-KR'),
        []
    );

    const {user} = useUser();
    if(!user) return null;

    return (
    <div className="bg-fox-purple text-white p-6 rounded-2xl">
      <p className="text-sm opacity-80">Balance</p>
      <div className="flex items-baseline justify-between mt-2">
        <p className="text-2xl font-bold">{nfKRW.format(parseInt(user.balance.toFixed(0)))} KRW</p>
      </div>
    </div>
  );
}