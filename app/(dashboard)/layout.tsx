import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen p-4 gap-4">
      <Sidebar />
      <main className="flex-1 flex flex-col">
        <Header />
        <div className="flex-1 mt-4 overflow-y-auto">
          {children}
        </div>
      </main>
    </div>
  );
}