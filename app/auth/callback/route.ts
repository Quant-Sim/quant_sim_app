import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });
    // 인증 코드를 세션으로 교환하고, 브라우저에 쿠키를 설정합니다.
    await supabase.auth.exchangeCodeForSession(code);
  }

  // 모든 작업이 끝난 후, 사용자를 최종 목적지인 홈페이지로 보냅니다.
  return NextResponse.redirect(requestUrl.origin);
}