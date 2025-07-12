import Cookies from 'js-cookie';

// 백엔드에서 받아올 난수 데이터의 타입을 정의합니다.
// 이 타입은 다른 곳에서도 재사용할 수 있도록 export 합니다.
export interface RandomNumber {
    id: number;
    value: number;
    created_at: string;
}

/**
 * 백엔드 API에서 난수 목록을 가져오는 함수
 * @returns Promise<RandomNumber[]> - 성공 시 난수 배열을 반환
 * @throws 에러 발생 시 에러 객체를 던짐
 */
export const fetchRandomNumbers = async (): Promise<RandomNumber[]> => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/numbers`, {});

    // 3. 응답 상태 확인
    if (!response.ok) {
        // 응답이 실패하면 상세한 에러 메시지와 함께 오류 발생
        const errorData = await response.json();
        throw new Error(errorData.detail || '데이터를 가져오는 데 실패했습니다.');
    }
    // 4. 성공 시 JSON 데이터를 파싱하여 반환
    return response.json();
};