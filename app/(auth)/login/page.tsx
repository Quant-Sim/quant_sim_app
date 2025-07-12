'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppValues } from '@/app/cores/app_values';
import { FaGoogle } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// --- 스피너 컴포넌트 ---
// 별도 파일로 만들어도 좋지만, 이 페이지에서만 사용되므로 여기에 직접 정의합니다.
const Spinner = () => (
    <div className="w-12 h-12 border-4 border-t-transparent border-white rounded-full animate-spin"></div>
);

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false); // 1. 로딩 상태 추가

  const supabase = createClientComponentClient();
  const router = useRouter();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // 2. 로딩 시작
    setError(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('로그인 정보가 올바르지 않습니다.');
      console.error('Sign in error:', error.message);
      setLoading(false); // 2. 에러 시 로딩 종료
    } else {
      router.push('/');
      router.refresh();
      // 성공 시 페이지가 이동하므로, 로딩 상태를 끌 필요가 없습니다.
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true); // 2. 로딩 시작
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
    // 구글 페이지로 이동하므로, 로딩 상태를 끌 필요가 없습니다.
  };

  return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full relative"> {/* 5. relative 추가 */}
        {/* --- 로딩 오버레이 및 스피너 --- */}
        {loading && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl z-10">
              <Spinner />
            </div>
        )}

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fox-purple">{AppValues.appName}</h1>
          <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {/* 에러 메시지 표시 */}
        {error && (
            <div className="mb-4 text-center text-sm text-red-600 bg-red-100 p-3 rounded-lg">
              {error}
            </div>
        )}

        <div className="space-y-4">
          <button
              onClick={handleGoogleSignIn}
              disabled={loading} // 로딩 중 버튼 비활성화
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FaGoogle className="text-red-500" />
            <span>Sign in with Google</span>
          </button>

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </div>

        <form onSubmit={handleSignIn} className="space-y-6 mt-4"> {/* 4. onSubmit 추가 */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                value={email} // 3. value 연결
                onChange={(e) => setEmail(e.target.value)} // 3. onChange 연결
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fox-purple"
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
                value={password} // 3. value 연결
                onChange={(e) => setPassword(e.target.value)} // 3. onChange 연결
                required
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fox-purple"
            />
          </div>
          <div>
            <button
                type="submit"
                disabled={loading} // 로딩 중 버튼 비활성화
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-fox-purple hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fox-purple disabled:opacity-50 disabled:cursor-not-allowed"
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