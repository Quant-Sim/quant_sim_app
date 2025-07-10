'use client'; // 클라이언트 컴포넌트로 전환

import Link from 'next/link'; // Link 임포트
import { usePathname } from 'next/navigation'; // 현재 경로를 알기 위한 훅
import {
  FaChartPie,
  FaUserFriends,
  FaBook,
  FaWallet,
  FaExchangeAlt,
  FaChalkboardTeacher,
  FaSignOutAlt,
  FaRegLightbulb,
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const navItems = [
  { href: '/', label: 'Dashboard', icon: <MdDashboard /> },
  { href: '#', label: 'Portfolio', icon: <FaChartPie /> },
  { href: '/trading', label: 'Trading & Market', icon: <FaUserFriends /> },
  { href: '#', label: 'Reasearch Portal', icon: <FaBook /> },
  { href: '#', label: 'Wallet Transfer Pay', icon: <FaWallet /> },
  { href: '#', label: 'Reporting & Transaction', icon: <FaExchangeAlt /> },
  { href: '#', label: 'Tutorial', icon: <FaChalkboardTeacher /> },
];

export default function Sidebar() {
  const pathname = usePathname(); // 현재 경로 가져오기

  return (
    <aside className="w-64 bg-white rounded-3xl flex flex-col p-6 shadow-sm">
      <div className="text-2xl font-bold text-fox-dark-blue mb-12">Foxstocks</div>

      <p className="text-xs text-fox-text-gray font-semibold mb-2">USER PANEL</p>
      <nav className="flex-1">
        <ul>
          {navItems.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
                  pathname === item.href // 현재 경로와 링크의 href가 같으면 활성화
                    ? 'bg-fox-light-purple text-fox-purple'
                    : 'text-fox-dark-blue hover:bg-fox-light-gray'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="bg-[#E8FDEB] rounded-xl p-4 text-center mb-8">
        <div className="inline-block bg-white p-2 rounded-full shadow-md mb-2">
          <FaRegLightbulb className="text-yellow-400 text-2xl" />
        </div>
        <h3 className="font-semibold text-sm text-fox-dark-blue mb-1">Thoughts Time</h3>
        <p className="text-xs text-fox-dark-blue">
          If you aren&apos;t willing to own a stock for 10 years, don&apos;t even think about owning it for 10 minutes.
        </p>
      </div>

      <a href="#" className="flex items-center gap-3 px-4 py-2 text-fox-text-gray hover:text-fox-dark-blue">
        <FaSignOutAlt />
        <span className="font-semibold">Logout</span>
      </a>
    </aside>
  );
}