import type { Metadata } from 'next';
import './globals.css';
import Providers from './providers'; // 💡 Providers 임포트

export const metadata: Metadata = {
  title: 'Quant Sim Dashboard',
  description: 'A dashboard UI for Qunat Sim, created with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        {/* 💡 Providers로 전체를 감싸줍니다. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}