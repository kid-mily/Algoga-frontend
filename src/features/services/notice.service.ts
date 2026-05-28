import { api } from "@/lib/api"

// 메인 공지 조회
export const getMainNotices = async () => {
  const response = await api.get('/api/v1/public/notices/main')

  return response.data.data
}