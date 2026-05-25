import { api } from "@/lib/api"

export interface Notice {
  noticeId: number
  tag: string
  title: string
  date: string
  time: string
}

// 메인 공지 조회
export const getMainNotices = async () => {
  const response = await api.get('/api/v1/notice/main')

  return response.data.data
}