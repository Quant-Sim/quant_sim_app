'use client';

import { useState } from 'react'; // 💡 useState 임포트
import Link from 'next/link';
import { AppValues } from '../../cores/app_values';
import { FaGoogle } from 'react-icons/fa';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'; // 💡 Supabase 클라이언트 임포트

export default function SignUpPage() {
  // --- Supabase 연동을 위한 상태 관리 ---
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const supabase = createClientComponentClient();

  // --- Google로 가입하기 로직 ---
  const handleGoogleSignUp = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  // --- 이메일/비밀번호 가입 로직 ---
  const handleEmailSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // 추가 정보(full_name)를 Supabase에 저장합니다.
        data: {
          full_name: fullName,
        },
        emailRedirectTo: `${location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError('회원가입에 실패했습니다. 다시 시도해주세요.');
      console.error(error);
    } else {
      setSuccess(true);
    }
  };

  return (
      <div className="bg-white p-8 rounded-xl shadow-lg w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-fox-purple">{AppValues.appName}</h1>
          <p className="text-gray-500 mt-2">Create an account to start trading.</p>
        </div>

        {/* 에러 메시지 표시 영역 */}
        {error && (
            <div className="mb-4 text-center text-sm text-red-600 bg-red-50 p-3 rounded-lg">
              {error}
            </div>
        )}

        {/* 성공 메시지 또는 폼 표시 */}
        {success ? (
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <h2 className="text-xl font-semibold text-green-800">Check your email!</h2>
              <p className="text-gray-600 mt-2">
                A confirmation link has been sent to <strong>{email}</strong>.
              </p>
            </div>
        ) : (
            <>
              <div className="space-y-4">
                {/* Google로 가입하기 버튼 (onClick만 수정) */}
                <button
                    onClick={handleGoogleSignUp}
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  <FaGoogle className="text-red-500" />
                  <span>Sign up with Google</span>
                </button>

                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-gray-300"></div>
                  <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                  <div className="flex-grow border-t border-gray-300"></div>
                </div>
              </div>

              {/* 이메일/비밀번호 가입 폼 (onSubmit과 onChange만 추가) */}
              <form className="space-y-6 mt-4" onSubmit={handleEmailSignUp}>
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="John Doe"
                      required
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fox-purple"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                      type="email"
                      id="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fox-purple"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <input
                      type="password"
                      id="password"
                      name="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                      minLength={6}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fox-purple"
                  />
                </div>
                <div className="flex items-center">
                  <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      required
                      className="h-4 w-4 text-fox-purple border-gray-300 rounded focus:ring-fox-purple"
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                    I agree to the{' '}
                    <Link href="#" className="text-fox-purple hover:underline">
                      Terms and Conditions
                    </Link>
                  </label>
                </div>
                <div>
                  <button
                      type="submit"
                      className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-fox-purple hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-fox-purple"
                  >
                    Create Account
                  </button>
                </div>
              </form>
            </>
        )}

        <p className="mt-8 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-fox-purple hover:underline">
            Log in
          </Link>
        </p>
      </div>
  );
}