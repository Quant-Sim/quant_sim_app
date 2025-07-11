import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')?.value;
  const { pathname } = request.nextUrl;

  // 로그인/회원가입 페이지 경로
  const isAuthPath = pathname.startsWith('/login') || pathname.startsWith('/signup');

  // 로그인이 되어 있는데 /login 이나 /signup 페이지에 접속하려는 경우
  if (authToken && isAuthPath) {
    // 메인 대시보드로 리디렉션합니다.
    return NextResponse.redirect(new URL('/', request.url));
  }

  // 로그인이 안 되어 있는데, **로그인/회원가입 페이지가 아닌 다른 페이지**에 접속하려는 경우
  if (!authToken && !isAuthPath) {
    // 로그인 페이지로 리디렉션합니다.
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 그 외의 경우는 그냥 통과시킵니다.
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 아래 경로들과 일치하는 요청에만 미들웨어가 실행됩니다.
     * - api (API 라우트)
     * - _next/static (정적 파일)
     * - _next/image (이미지 최적화 파일)
     * - favicon.ico (파비콘 파일)
     * - /login, /signup (인증 관련 경로 자체는 리디렉션 로직에서 제외하지 않음)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};