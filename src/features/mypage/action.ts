import { changeMyPassword, updateMyProfile } from "@/features/services/mypage.service";
import { SubmitMyPageEditPayload } from "./types";

export async function submitMyPageEdit(
    payload: SubmitMyPageEditPayload
): Promise<void> {
    await updateMyProfile({
        nickname: payload.nickname,
        email: payload.email,
        phone: payload.phone,
        profileImage: payload.profileImage,
    });

    if (payload.currentPassword && payload.newPassword) {
        await changeMyPassword({
        currentPassword: payload.currentPassword,
        newPassword: payload.newPassword,
        });
    }
}