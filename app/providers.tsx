'use client';

import {SessionProvider} from 'next-auth/react';
import {UserProvider} from "@/app/context/UserContext";
import {PriceProvider} from "@/app/context/PriceContext";
import {OrderProvider} from "@/app/context/OrderContext";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <UserProvider>
                <PriceProvider>
                    <OrderProvider>
                        {children}
                    </OrderProvider>
                </PriceProvider>
            </UserProvider>
        </SessionProvider>
    );
}