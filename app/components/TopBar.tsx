import { FaSearch, FaBell } from 'react-icons/fa';

export default function TopBar() {
  return (
    <header className="flex justify-between items-center">
      <h1 className="text-2xl font-bold text-fox-dark-blue">Hello Matt,</h1>
      <div className="flex items-center gap-6">
        <div className="relative">
          <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-fox-text-gray" />
          <input
            type="text"
            placeholder="Search for stocks and more"
            className="bg-white border border-gray-200 rounded-lg py-2 pl-12 pr-4 w-72 focus:outline-none focus:ring-2 focus:ring-fox-purple"
          />
        </div>
        <button className="text-xl text-fox-text-gray hover:text-fox-dark-blue">
          <FaBell />
        </button>
        <div className="w-12 h-12 rounded-full bg-cover bg-center border-2 border-white shadow-md" style={{ backgroundImage: "url('https://randomuser.me/api/portraits/men/32.jpg')" }} />
      </div>
    </header>
  );
}