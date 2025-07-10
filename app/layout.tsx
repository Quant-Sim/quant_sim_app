import type { Metadata } from 'next';
import './globals.css';
import Sidebar from './components/Sidebar';

export const metadata: Metadata = {
  title: 'Foxstocks Dashboard',
  description: 'A dashboard UI for Foxstocks, created with Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko">
      <body>
        <div className="flex min-h-screen p-4">
          <Sidebar />
          <main className="flex-1 pl-8">{children}</main>
        </div>
      </body>
    </html>
  );
}