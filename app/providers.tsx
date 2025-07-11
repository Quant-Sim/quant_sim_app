'use client';

// next-auth의 SessionProvider는 더 이상 필요하지 않으므로 관련 코드를 모두 제거합니다.
// 이 파일은 나중에 다른 클라이언트 전용 Provider(예: 테마, 상태 관리 등)를
// 추가할 때를 위해 남겨두는 것이 좋습니다.

export default function Providers({ children }: { children: React.ReactNode }) {
  // SessionProvider 없이 자식 컴포넌트만 반환합니다.
  return <>{children}</>;
}