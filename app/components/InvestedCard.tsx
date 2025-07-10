import { FaArrowRight } from 'react-icons/fa';

export default function InvestedCard() {
  return (
    <div className="bg-fox-dark-blue text-white p-6 rounded-2xl">
      <p className="text-sm text-gray-400">Invested</p>
      <div className="flex items-center justify-between mt-2">
        <p className="text-3xl font-bold">$7,532.21</p>
        <button className="bg-fox-purple w-8 h-8 rounded-full flex items-center justify-center">
          <FaArrowRight />
        </button>
      </div>
    </div>
  );
}