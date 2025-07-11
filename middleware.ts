export { default } from "next-auth/middleware"

export const config = {
  matcher: [
    /*
     * 아래의 경로들을 보호합니다.
     * 사용자가 이 경로들에 접근하면, next-auth 미들웨어가
     * 자동으로 로그인 여부를 확인하고, 로그인이 안 되어있으면
     * next.config.js에 설정된 로그인 페이지로 리디렉션합니다.
     */
    '/',
    '/trading/:path*',
  ]
};