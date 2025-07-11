import Link from 'next/link';
import {AppValues} from "@/app/cores/app_values";

export default function LoginPage() {
  return (
    <div className="bg-white p-8 rounded-xl shadow-lg w-full">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-fox-purple">{AppValues.appName}</h1>
        <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
      </div>

      <form className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="you@example.com"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fox-purple"
            required
          />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <Link href="#" className="text-sm text-fox-purple hover:underline">
              Forgot password?
            </Link>
          </div>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="••••••••"
            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fox-purple"
            required
          />
        </div>

        <div>
          <button
            type="submit"
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-fox-purple hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fox-purple"
          >
            Log In
          </button>
        </div>
      </form>

      <p className="mt-8 text-center text-sm text-gray-600">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-medium text-fox-purple hover:underline">
          Sign up
        </Link>
      </p>
    </div>
  );
}