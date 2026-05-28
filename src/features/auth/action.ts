'use server';

import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { login } from "../services/auth.service";
// import { login } from "@/services/auth.service"; // 실제 API 호출 함수

type ActionState = {
    success: boolean,
    message?: string;
    errors?: Record<string, string>
}

export const loginAction = async (prevState: ActionState, formData: FormData): Promise<ActionState> => {
    // 1. 백엔드 DTO(AuthLoginRequest)에 맞게 email -> username으로 수정
    console.log('쿠키시작');
    const username = formData.get("username") as string; 
    const password = formData.get("password") as string;

    const payload = { username, password };

    let data;
    try {
        // data는 AuthTokenResponse 형태이어야 함
        // { accessToken, refreshToken, requiresPasswordChange }
        data = await login(payload); 
    } catch(error) {
        return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown Error'
        }
    }

    const cookieStore = await cookies();

    cookieStore.set('accessToken', data.accessToken, {
        httpOnly: true,
        maxAge: 60 * 60, // 1시간
        path: '/'
    });

    if (data.refreshToken) {
        cookieStore.set('refreshToken', data.refreshToken, {
            httpOnly: true,
            maxAge: 60 * 60 * 24 * 7, // 7일
            path: '/'
        });
    }
    console.log('저장');

    redirect('/'); 
    // // 2. 임시 비밀번호 사용자 강제 변경 페이지로 리다이렉트 처리
    // if (data.requiresPasswordChange) {
    //     redirect('/auth/login/reset-password'); // 또는 /auth/login/newpw
    // } else {
        // redirect('/'); // 어드민 체크 로직이 필요하다면 추가
    // }
}