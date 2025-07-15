'use client';

import {SessionProvider} from 'next-auth/react';
import {UserProvider} from "@/app/context/UserContext";
import {PriceProvider} from "@/app/context/PriceContext";

export default function Providers({children}: { children: React.ReactNode }) {
    return (
        <SessionProvider>
            <UserProvider>
                <PriceProvider>
                    {children}
                </PriceProvider>
            </UserProvider>
        </SessionProvider>
    );
}