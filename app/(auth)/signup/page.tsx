'use client'; // 💡 클라이언트 컴포넌트로 전환

import Link from 'next/link';
import {signIn, useSession} from 'next-auth/react'; // 💡 signIn 함수 임포트
import {AppValues} from '../../cores/app_values';
import {FaGoogle} from 'react-icons/fa';

export default function SignUpPage() {
    const handleGoogleSignIn = async () => {
        const result = await signIn('google', {redirect: false, callbackUrl: '/'});
        const {data: session, status} = useSession(); // 👈 로그인 상태 가져오기
        if (result?.ok && status === 'authenticated') {
            // 로그인 성공 시 실행할 함수 호출

            console.log('로그인 성공!');
            fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/backend/user/${session?.user?.email}`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    "username": session?.user?.name,
                    "email": session?.user?.email,
                    "full_name": session?.user?.name,
                    "password": '', // Google 로그인은 비밀번호가 없으므로 빈 문자열
                }),
            }).then(r => console.log('user created:', r)).catch(
                e => console.error('user create error:', e)
            )
        } else {
            // 실패 처리
            console.error('로그인 실패:', result);
        }
    };

    return (
        <div className="bg-white p-8 rounded-xl shadow-lg w-full">
            <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-fox-purple">{AppValues.appName}</h1>
                <p className="text-gray-500 mt-2">Create an account to start trading.</p>
            </div>

            <div className="space-y-4">
                {/* 💡 Google로 가입하기 버튼 */}
                <button
                    onClick={handleGoogleSignIn} // 클릭 시 Google 로그인/가입 실행
                    className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-800 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                    <FaGoogle className="text-red-500"/>
                    <span>Sign up with Google</span>
                </button>

                <div className="relative flex py-2 items-center">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-sm">OR</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                </div>
            </div>

            <form className="space-y-6 mt-4">
                {/* 기존 이메일/비밀번호 가입 폼 */}
                <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        placeholder="John Doe"
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
                        placeholder="you@example.com"
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
                        placeholder="••••••••"
                        className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-fox-purple"
                    />
                </div>
                <div className="flex items-center">
                    <input
                        id="terms"
                        name="terms"
                        type="checkbox"
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

            <p className="mt-8 text-center text-sm text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="font-medium text-fox-purple hover:underline">
                    Log in
                </Link>
            </p>
        </div>
    );
}