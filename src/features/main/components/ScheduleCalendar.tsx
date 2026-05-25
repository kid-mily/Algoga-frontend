'use client'

import { useState } from 'react'
import CalendarHeader from './CalendarHeader'
import CalendarGrid from './CalendarGrid'
import { schedules } from './mockData'
import ScheduleSidebar from './ScheduleSidebar'


export default function ScheduleCalendar() {
  const [currentDate, setCurrentDate] =
    useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth() + 1

  const prevMonth = () => {
    setCurrentDate(
      new Date(
        year,
        currentDate.getMonth() - 1
      )
    )
  }

  const nextMonth = () => {
    setCurrentDate(
      new Date(
        year,
        currentDate.getMonth() + 1
      )
    )
  }

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