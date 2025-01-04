'use client'

import * as React from "react"
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface CalendarProps {
    mode?: "single"
    selected?: Date
    onSelect?: (date: Date | undefined) => void
    className?: string
}

function AdminAddEvent({
    mode = "single",
    selected,
    onSelect,
    className,
}: CalendarProps) {
    const [currentDate, setCurrentDate] = React.useState(new Date())

    // Get current month's days
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
    const startingDayIndex = firstDayOfMonth.getDay()
    const daysInMonth = lastDayOfMonth.getDate()

    // Get days from previous month
    const daysFromPreviousMonth = startingDayIndex
    const previousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
    const daysInPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate()

    // Get days for next month
    const daysFromNextMonth = 42 - (daysFromPreviousMonth + daysInMonth) // 42 is 6 rows * 7 days

    const days = [
        ...Array.from({ length: daysFromPreviousMonth }, (_, i) => ({
            date: new Date(previousMonth.getFullYear(), previousMonth.getMonth(), daysInPreviousMonth - daysFromPreviousMonth + i + 1),
            isCurrentMonth: false
        })),
        ...Array.from({ length: daysInMonth }, (_, i) => ({
            date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i + 1),
            isCurrentMonth: true
        })),
        ...Array.from({ length: daysFromNextMonth }, (_, i) => ({
            date: new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i + 1),
            isCurrentMonth: false
        }))
    ]

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat']
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
    }

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
    }

    return (
        <div className={cn("w-full rounded-[18.72px] h-full ", className)}>
            {/* Calendar Header */}
            <div className="flex items-center justify-between rounded-t-[18.72px] bg-[#2E8B57] px-6 py-5">
                <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-white leading-[35.05px]">
                        {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white hover:bg-emerald-500/20 hover:text-white"
                            onClick={goToPreviousMonth}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-white hover:bg-emerald-500/20 hover:text-white"
                            onClick={goToNextMonth}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <Button
                    variant="secondary"
                    size="sm"
                    className="bg-white text-emerald-600 hover:bg-white/90"
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add an event
                </Button>
            </div>

            {/* Calendar Grid */}
            <div className="bg-[#DEEDE5] rounded-b-[18.72px] p-4 shadow-md">
                {/* Week days header */}
                <div className="mb-4 grid grid-cols-7 text-center">
                    {weekDays.map((day) => (
                        <div key={day} className="text-sm font-medium text-gray-500">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Days grid */}
                <div className="grid grid-cols-7 gap-1 text-center">
                    {days.map(({ date, isCurrentMonth }, index) => {
                        const isSelected = selected?.toDateString() === date.toDateString()
                        const isToday = new Date().toDateString() === date.toDateString()

                        return (
                            <Button
                                key={index}
                                variant="ghost"
                                className={cn(
                                    "h-9 w-full p-0 font-normal",
                                    !isCurrentMonth && "text-gray-400",
                                    isSelected && "bg-emerald-600 text-white hover:bg-emerald-600 hover:text-white",
                                    isToday && !isSelected && "bg-emerald-100 text-emerald-600 hover:bg-emerald-100",
                                    !isSelected && "hover:bg-emerald-100 hover:text-emerald-600"
                                )}
                                onClick={() => onSelect?.(date)}
                            >
                                <time dateTime={date.toISOString()}>
                                    {date.getDate()}
                                </time>
                            </Button>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}


export default AdminAddEvent