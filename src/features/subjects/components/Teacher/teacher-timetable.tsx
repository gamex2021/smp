"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import React from "react"

interface TimeSlot {
  time: string
  subject?: {
    name: string
    class: string
    startColumn: number
    endColumn: number
  }
}

const days = [
  { name: "Sun", date: "01" },
  { name: "Mon", date: "02" },
  { name: "Tue", date: "03" },
  { name: "Wed", date: "04" },
  { name: "Thur", date: "05" },
  { name: "Fri", date: "06" },
  { name: "Sat", date: "07" },
]

const timeSlots: TimeSlot[] = [
  { time: "09:00" },
  { time: "10:00" },
  { 
    time: "11:00",
    subject: {
      name: "Mathematics",
      class: "Class 2b",
      startColumn: 1,
      endColumn: 7
    }
  },
  { time: "12:00" },
  { 
    time: "13:00",
    subject: {
      name: "English Language",
      class: "Class 2b",
      startColumn: 1,
      endColumn: 7
    }
  },
  { time: "14:00" },
  { time: "15:00" },
  { time: "16:00" },
]

export default function Timetable() {
  return (
    <div className="w-full p-6 bg-[#e6f3ed] rounded-xl mt-[30px]">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-[#11321F]">Timetable</h2>
        <Select defaultValue="this-week">
          <SelectTrigger className="w-[140px] bg-white/80 border-0">
            <SelectValue placeholder="Select Week" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="this-week">This Week</SelectItem>
            <SelectItem value="next-week">Next Week</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-8 gap-1 mb-4">
        <div className="col-span-1"></div>
        {days.map((day, index) => (
          <div
            key={day.name}
            className={cn(
              "flex flex-col items-center p-3 rounded-lg text-center",
              index === 3 ? "bg-emerald-600 text-white" : "bg-[#cce3d8]"
            )}
          >
            <span className="text-sm font-medium">{day.name}</span>
            <span className="text-sm mt-1">{day.date}</span>
          </div>
        ))}
      </div>

      <div className="relative grid grid-cols-8 gap-1">
        {timeSlots.map((slot, rowIndex) => (
          <React.Fragment key={slot.time}>
            <div className="py-6 text-sm text-gray-600">{slot.time}</div>
            {slot.subject ? (
              <>
                <div
                  className={cn(
                    "col-span-7 bg-emerald-600 text-white p-2 rounded",
                    rowIndex === timeSlots.length - 1 ? "rounded-b-lg" : ""
                  )}
                >
                  <div className="text-sm font-medium">
                    {slot.subject.name}
                    <span className="ml-2 opacity-75">{slot.subject.class}</span>
                  </div>
                </div>
              </>
            ) : (
              <>
                {Array.from({ length: 7 }).map((_, colIndex) => (
                  <div
                    key={colIndex}
                    className={cn(
                      "border border-dashed border-emerald-200",
                      rowIndex === timeSlots.length - 1 ? "rounded-b-lg" : ""
                    )}
                  />
                ))}
              </>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  )
}

