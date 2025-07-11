import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const { pathname } = req.nextUrl;

  // 규칙 1: 로그인한 사용자가 로그인/회원가입 페이지에 접근하는 것을 막습니다.
  if (session && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // 규칙 2: 로그인하지 않은 사용자가 보호된 페이지에 접근하는 것을 막습니다. (가장 중요!)
  // 로그인 페이지, 회원가입 페이지를 제외한 모든 페이지를 보호합니다.
  if (!session && pathname !== '/login' && pathname !== '/signup') {
    // 사용자를 로그인 페이지로 보냅니다.
    // 원래 가려던 경로를 'redirectedFrom' 쿼리 파라미터로 추가하여
    // 로그인 후에 원래 페이지로 돌아갈 수 있도록 합니다. (선택적이지만 권장)
    const redirectUrl = req.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set(`redirectedFrom`, pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// 미들웨어가 실행될 경로를 지정합니다.
export const config = {
  matcher: [
    /*
     * 아래 경로를 제외한 모든 요청 경로에서 미들웨어를 실행합니다.
     * 이 설정은 미들웨어가 불필요한 리소스(이미지, API 등)를 검사하지 않도록 하여 성능을 최적화합니다.
     */
    '/((?!api|auth|_next/static|_next/image|favicon.ico).*)',
  ],
};