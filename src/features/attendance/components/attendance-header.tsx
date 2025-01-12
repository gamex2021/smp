"use client";
import { Input } from '@/components/ui/input';
import React from 'react'
import { CiSearch } from "react-icons/ci";
import { format } from "date-fns"
import { Calendar as CalendarIcon, Search } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

type Props = object

const AttendanceHeader = (props: Props) => {
    const [date, setDate] = React.useState<Date>()

    return (
        <div>
            <div className='flex flex-col-reverse max-md:space-y-5 md:flex-row md:justify-between items-center px-2 py-2'>
                <h1 className='font-medium text-[18px] font-manrope max-md:my-4'>Attendance</h1>

                <div className="relative ">
                    <Search className="absolute left-3 top-5 -translate-y-1/2 h-[23px] w-[23px] text-muted-foreground" />
                    <Input
                        placeholder="Search for a name"
                        className="pl-9 w-full h-[40px] max-w-[320px] bg-white"
                    />
                </div>
            </div>
            <h1 className='text-sm '>Time and Attendance system are teachers time tracking feature</h1>

            {/* the date picker */}
            <div className='flex justify-end my-2'>
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP") : <span>Pick a date</span>}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                        // initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
        </div>
    )
}

export default AttendanceHeader