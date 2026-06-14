// API 날짜 형식을 화면 표시용 형식으로 변경 
// // 2026-05-29 10:04:46 → 2026.05.29 
export const formatNoticeDate = (createdAt: string) => { 
    return createdAt.split(" ")[0].replaceAll("-", "."); 
};