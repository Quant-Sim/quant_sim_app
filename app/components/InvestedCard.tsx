'use client';

import {FaArrowRight} from 'react-icons/fa';
import {useUser} from '../context/UserContext';

export default function InvestedCard() {
    const user = useUser();

    if (!user) return null;

    return (
        <div className="bg-fox-dark-blue text-white p-6 rounded-2xl">
            <p className="text-sm text-gray-400">Invested</p>
            <div className="flex items-center justify-between mt-2">
                <p className="text-3xl font-bold">${user.invested_money.toFixed(2)}</p>
                <button className="bg-fox-purple w-8 h-8 rounded-full flex items-center justify-center">
                    <FaArrowRight/>
                </button>
            </div>
        </div>
    );
}