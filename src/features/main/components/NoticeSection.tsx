'use client'

import { useEffect, useState } from 'react'
import NoticeItem from './NoticeItem'
import { getMainNotices, Notice } from '@/features/services/notice.service'

const colorMap: Record<string, string> = {
  EVENT: 'blue',
  NOTICE: 'gray',
  UPDATE: 'indigo',
}

export default function NoticeSection() {
  // const [notices, setNotices] = useState<Notice[]>([])
  const [notices, setNotices] = useState<Notice[]>([
  {
    noticeId: 1,
    tag: 'EVENT',
    title: '여름 맞이 이벤트 안내',
    date: '2026-05-22',
    time: '15:30',
  },
  {
    noticeId: 2,
    tag: 'NOTICE',
    title: '서비스 점검 공지',
    date: '2026-05-21',
    time: '18:00',
  },
  {
    noticeId: 3,
    tag: 'UPDATE',
    title: '신규 기능 업데이트',
    date: '2026-05-20',
    time: '12:00',
  },
])

  // useEffect(() => {
  //   const fetchNotices = async () => {
  //     try {
  //       const data = await getMainNotices()
  //       setNotices(data)
  //     } catch (error) {
  //       console.error(error)
  //     }
  //   }
  //   fetchNotices()
  // }, [])

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
            color={colorMap[notice.tag]}
          />
        ))}
      </ul>
    </div>
  )
}