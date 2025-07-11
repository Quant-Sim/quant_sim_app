import type {Metadata} from 'next';
import './globals.css';
import Providers from './providers'; // SessionProvider를 포함한 컴포넌트

export const metadata: Metadata = {
    title: 'Quant Sim Dashboard',
    description: 'A dashboard UI for Quant Sim, created with Next.js',
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="ko">
        {/* body에 기본 배경색을 지정해줍니다. */}
        <body className="bg-fox-light-gray">
        <Providers>{children}</Providers>
        </body>
        </html>
    );
}