import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

const handler = NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  // 💡 아래 pages 옵션을 추가합니다.
  pages: {
    signIn: '/login', // 로그인 페이지의 경로를 지정합니다.
    error: '/login',  // 로그인 오류 발생 시 이동할 페이지 (예: 쿼리 파라미터로 에러 표시 가능)
  },
});

export { handler as GET, handler as POST };