'use client'

import { useState, useEffect } from 'react'
import NoticeItem from './NoticeItem'
import { Notice } from './Types' 
import { api } from '@/lib/api' 

const colorMap: Record<string, string> = {
  EVENT: 'blue',
  NOTICE: 'gray',
  UPDATE: 'indigo',
}

export default function NoticeSection() {
  const [notices, setNotices] = useState<Notice[]>([])

  useEffect(() => {
    const fetchNotices = async () => {
      try {
        // 🌟 fetch 대신 커스텀 api(axios) 사용
        const response = await api.get('/api/v1/public/notices/main')
        
        // axios는 응답 객체의 `data` 프로퍼티 안에 실제 서버 응답을 담아줍니다.
        // 서버 응답 구조가 { status, code, message, data: [...] } 이므로 
        // response.data (전체 JSON) -> response.data.data (공지사항 배열) 로 접근합니다.
        const result = response.data

        if (result.status === 200 && result.data) {
          setNotices(result.data)
        }
      } catch (error) {
        console.error('공지사항 데이터를 가져오는데 실패했습니다:', error)
      }
    }
    
    fetchNotices()
  }, [])

  return (
    <div className="w-1/2 h-full bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-[#0A1628]">
          공지사항
        </h2>

        <button className="text-sm text-gray-400 hover:text-gray-600 transition">
          더보기
        </button>
      </div>

      <ul className='divide-y divide-gray-100'>
        {notices.map((notice) => (
          <NoticeItem
            key={notice.noticeId}
            category={notice.tag}
            title={notice.title}
            date={notice.date}
            color={colorMap[notice.tag] || 'gray'}
          />
        ))}
      </ul>
    </div>
  )
}