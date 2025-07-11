'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AppValues } from '@/app/cores/app_values';
import { FaGoogle } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  // 4. Supabase 클라이언트와 라우터를 초기화합니다.
  const supabase = createClientComponentClient();
  const router = useRouter();
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // 이전 에러 메시지 초기화

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError('로그인 정보가 올바르지 않습니다.');
      console.error('Sign in error:', error.message);
    } else {
      // 로그인 성공 시, 홈페이지로 이동하고 페이지를 새로고침하여
      // 서버의 로그인 상태를 즉시 반영합니다.
      router.push('/');
      router.refresh();
    }
  };
  const handleGoogleSignIn = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };




  return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fox-purple">{AppValues.appName}</h1>
          <p className="text-gray-500 mt-2">Welcome back! Please enter your details.</p>
        </div>

        {/* --- Google 로그인 버튼 섹션 --- */}
        <div className="space-y-4">
          <button
              onClick={handleGoogleSignIn}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <FaGoogle className="text-red-500" />
            <span>Sign in with Google</span>
          </button>

          {/* --- "OR" 구분선 --- */}
          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>
        </div>

        {/* --- 기존 이메일/비밀번호 로그인 폼 --- */}
        <form className="space-y-6 mt-4">
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

        {/* --- 회원가입 링크 --- */}
        <p className="mt-8 text-center text-sm text-gray-600">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium text-fox-purple hover:underline">
            Sign up
          </Link>
        </p>
      </div>
  );
}