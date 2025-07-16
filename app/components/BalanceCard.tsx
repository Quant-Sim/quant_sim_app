'use client';

import {useUser} from "../context/UserContext"

export default function BalanceCard() {
    const {user} = useUser();
    if(!user) return null;

    return (
    <div className="bg-fox-purple text-white p-6 rounded-2xl">
      <p className="text-sm opacity-80">Balance</p>
      <div className="flex items-baseline justify-between mt-2">
        <p className="text-3xl font-bold">${user.balance.toFixed(0)}</p>
        <p className="bg-white/20 text-xs font-semibold px-2 py-1 rounded-md">+5.63%</p>
      </div>
    </div>
  );
}