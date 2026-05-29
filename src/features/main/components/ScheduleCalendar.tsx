'use client'

import { useEffect, useState } from 'react'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import ScheduleSidebar from './ScheduleSidebar'
import { Schedule } from './types'
import { getMethodSchedules } from '@/features/services/schedule.service'


export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [schedules, setSchedules] = useState<Schedule[]>([])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  // 이전 달
  const prevMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() - 1))
  }

  // 다음 달
  const nextMonth = () => {
    setCurrentDate(new Date(year, currentDate.getMonth() + 1))
  }

  // year나 month가 바뀔 때마다 API 호출하여 데이터 갱신
  useEffect(() => {
    const schedulesApi = async () => {
      const data = await getMethodSchedules(year, month);
      setSchedules(data);
    };

    schedulesApi();
  }, [year, month]);

  return (
    <section className="overflow-hidden rounded-[32px] border border-[#E9EEF5] bg-white">
      <CalendarHeader
        year={year}
        month={month}
        prevMonth={prevMonth}
        nextMonth={nextMonth}
      />

      <div className="grid grid-cols-[1fr_360px]">
        <CalendarGrid
          year={year}
          month={month}
          schedules={schedules}
        />

        <ScheduleSidebar schedules={schedules} />
      </div>
    </section>
  )
}