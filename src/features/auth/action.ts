'use server';

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { login } from "../services/auth.service";

type ActionState = {
    success: boolean,
    message?: string;
    errors?: Record<string, string>
}

export const loginAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    console.log('🖥️ [Server Action] 로그인 요청 시작');
    const username = formData.get("username") as string; 
    const password = formData.get("password") as string;

    const payload = { username, password };

    let data;
    try {
        data = await login(payload); 
        console.log('🖥️ [Server Action] API 응답 성공:', data); // 🌟 백엔드 터미널에서 데이터 구조를 꼭 확인하세요!
    } catch(error) {
        console.error('🖥️ [Server Action] API 요청 에러:', error);
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown Error'
        }
    }

    // 🌟 API 응답이 { data: { accessToken: "..." } } 형태일 수 있으므로 안전하게 꺼냅니다.
    const accessToken = data.accessToken || data.data?.accessToken;
    const refreshToken = data.refreshToken || data.data?.refreshToken;

    if (!accessToken) {
        console.error('🖥️ [Server Action] 에러: 응답에서 accessToken을 찾을 수 없습니다.');
        return {
            success: false,
            message: '토큰 발급에 실패했습니다. (응답 구조 오류)'
        };
    }

    const cookieStore = await cookies();

    cookieStore.set('accessToken', accessToken, {
        httpOnly: true,
        maxAge: 60 * 60, // 1시간
        path: '/'
    });

    if (refreshToken) {
        cookieStore.set('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7일
            path: '/'
        });
    }
    console.log('🖥️ [Server Action] 쿠키 저장 완료, 리다이렉트 실행');

    // redirect는 try-catch 밖에서 호출되어야 정상 동작합니다.
    redirect('/'); 
}