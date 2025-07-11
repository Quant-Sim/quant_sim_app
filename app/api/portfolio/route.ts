import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

// 이 API는 이제 어떤 로그인 방식을 사용했든 상관없이 동일하게 작동합니다.
export async function GET(request: Request) {
  const cookieStore = cookies();
  // createRouteHandlerClient는 요청에 담긴 쿠키를 자동으로 읽어서
  // 해당 사용자로 인증된 Supabase 클라이언트를 생성합니다.
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // 1. 현재 로그인한 사용자의 세션 정보를 가져옵니다.
    //    세션이 없거나 유효하지 않으면, 로그인하지 않은 사용자로 간주합니다.
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError || !session) {
      return NextResponse.json({ error: '인증되지 않은 사용자입니다.' }, { status: 401 });
    }

    // 2. 인증된 사용자의 고유 ID를 사용하여 포트폴리오 데이터를 조회합니다.
    //    이제 user_id를 하드코딩할 필요가 없습니다.
    const { data, error } = await supabase
        .from('portfolio_items')
        .select(`
        id,
        quantity,
        stock:stocks (
          id,
          ticker,
          name,
          latest_price
        )
      `)
        .eq('user_id', session.user.id); // <-- 가장 중요한 부분!

    if (error) {
      console.error('포트폴리오 조회 오류:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);

  } catch (error) {
    return NextResponse.json({ error: '서버 내부 오류' }, { status: 500 });
  }
}