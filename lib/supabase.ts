import { createClient } from '@supabase/supabase-js';

// .env.local 파일에서 환경 변수를 가져옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// URL이나 키가 없는 경우 에러를 발생시켜 설정이 누락되었음을 알립니다.
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be defined in .env.local');
}

// Supabase 클라이언트를 생성합니다.
// 이 supabase 객체를 프로젝트의 다른 파일에서 import하여 사용할 것입니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);