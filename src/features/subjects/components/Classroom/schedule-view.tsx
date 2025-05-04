"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, isSameDay } from "date-fns"
import { Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface ScheduleEvent {
  id: string
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  type: "lecture" | "lab" | "exam" | "assignment" | "office_hours"
  description?: string
}

interface ScheduleViewProps {
  schedule: ScheduleEvent[]
}

export default function ScheduleView({ schedule }: ScheduleViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const startDate = startOfWeek(currentDate, { weekStartsOn: 1 }) // Start from Monday

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startDate, i))

  const getEventsByDay = (date: Date) => {
    return schedule.filter((event) => isSameDay(new Date(event.date), date))
  }

  const getEventTypeColor = (type: ScheduleEvent["type"]) => {
    switch (type) {
      case "lecture":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
      case "lab":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400"
      case "exam":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
      case "assignment":
        return "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      case "office_hours":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
    }
  }

  const previousWeek = () => {
    setCurrentDate((prev) => addDays(prev, -7))
  }

  const nextWeek = () => {
    setCurrentDate((prev) => addDays(prev, 7))
  }

  const today = () => {
    setCurrentDate(new Date())
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-green-700 dark:text-green-400">Class Schedule</h2>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={previousWeek}>
            Previous
          </Button>
          <Button variant="outline" size="sm" onClick={today}>
            Today
          </Button>
          <Button variant="outline" size="sm" onClick={nextWeek}>
            Next
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-4 mb-4">
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`text-center p-2 rounded-md ${
              isSameDay(day, new Date())
                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium"
                : ""
            }`}
          >
            <div className="text-xs uppercase tracking-wider mb-1">{format(day, "EEE")}</div>
            <div className="text-lg font-semibold">{format(day, "d")}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {weekDays.map((day, index) => {
          const events = getEventsByDay(day)

          return (
            <div key={index} className="min-h-[100px]">
              {events.length > 0 ? (
                <div className="space-y-2">
                  {events.map((event) => (
                    <Card key={event.id} className="border-green-100 dark:border-green-900/50">
                      <CardHeader className="p-3 pb-2">
                        <div className="flex items-start justify-between">
                          <h4 className="font-medium text-sm text-green-700 dark:text-green-400">{event.title}</h4>
                          <Badge className={getEventTypeColor(event.type)}>{event.type.replace("_", " ")}</Badge>
                        </div>
                      </CardHeader>

                      <CardContent className="p-3 pt-0">
                        <div className="space-y-1 text-xs">
                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <Clock className="h-3 w-3" />
                            <span>
                              {event.startTime} - {event.endTime}
                            </span>
                          </div>

                          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                            <MapPin className="h-3 w-3" />
                            <span>{event.location}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="h-full min-h-[100px] border border-dashed border-gray-200 dark:border-gray-700 rounded-md flex items-center justify-center">
                  <span className="text-xs text-gray-500">No events</span>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
