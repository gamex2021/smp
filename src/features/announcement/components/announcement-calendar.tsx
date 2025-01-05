'use client'

import React, { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface Event {
    id: number
    title: string
    date: Date
    time: string
    color: string
}

interface AnnouncementCalendarProps {
    events: Event[]
}

export function AnnouncementCalendar({ events }: AnnouncementCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date())

    const navigateMonth = (direction: 'prev' | 'next') => {
        setCurrentDate(prevDate => {
            const newDate = new Date(prevDate)
            if (direction === 'prev') {
                newDate.setMonth(newDate.getMonth() - 1)
            } else {
                newDate.setMonth(newDate.getMonth() + 1)
            }
            return newDate
        })
    }

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)
    const previousMonthDays = Array.from({ length: firstDayOfMonth }, (_, i) => i)

    const getEventsForDay = (day: number) => {
        return events.filter(event => {
            const eventDate = new Date(event.date)
            return eventDate.getDate() === day &&
                eventDate.getMonth() === currentDate.getMonth() &&
                eventDate.getFullYear() === currentDate.getFullYear()
        })
    }

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between bg-[#2E8B57] text-white px-4 sm:px-6 py-3 rounded-lg">
                <h2 className="text-base sm:text-lg font-medium">
                    {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </h2>
                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={() => navigateMonth('prev')}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white hover:bg-white/20"
                        onClick={() => navigateMonth('next')}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-gray-200 border rounded-lg overflow-hidden">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                    <div key={day} className="bg-gray-50 p-2 text-center text-xs sm:text-sm font-medium">
                        {day}
                    </div>
                ))}

                {previousMonthDays.map((_, index) => (
                    <div key={`prev-${index}`} className="bg-white p-2 sm:p-4 min-h-[60px] sm:min-h-[120px]">
                        <span className="text-gray-400 text-xs sm:text-sm">
                            {new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() - (previousMonthDays.length - index - 1)}
                        </span>
                    </div>
                ))}

                {days.map((day) => {
                    const dayEvents = getEventsForDay(day)

                    return (
                        <div key={day} className="bg-white p-2 sm:p-4 min-h-[60px] sm:min-h-[120px]">
                            <span className="font-medium text-xs sm:text-sm">{day}</span>
                            <div className="mt-1 sm:mt-2 space-y-1">
                                {dayEvents.slice(0, 2).map((event) => (
                                    <div
                                        key={event.id}
                                        className="text-xs px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-white truncate"
                                        style={{ backgroundColor: event.color }}
                                    >
                                        {event.title}
                                    </div>
                                ))}
                                {dayEvents.length > 2 && (
                                    <div className="text-xs text-gray-500">
                                        +{dayEvents.length - 2} more
                                    </div>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

