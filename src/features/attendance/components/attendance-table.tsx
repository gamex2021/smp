"use client";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { LuCalendarClock } from "react-icons/lu";

import { teachersAttendance } from '@/app/config/siteConfig';
import { A, L, P, W } from './attendance-status';
import Image from "next/image";

type Props = object


const Status = (text: string) => {
    if (text === "Present") {
        return <P />
    } else if (text === "Absent") {
        return <A />
    } else if (text === "Holiday") {
        return <W />
    } else {
        return <L />
    }
}


const AttendanceTable = (props: Props) => {
    return (
        <div className='border rounded-md px-2 py-2 w-[95vw] md:w-[100%]'>
            {/* the teachers list and the button to add more teachers */}
            <div className='flex justify-between items-center px-3'>
                <Select>
                    <SelectTrigger className="w-[180px] border-slate-300 my-1">
                        <div className='flex space-x-2 items-center my-2'>
                            <LuCalendarClock className='w-5 h-5' />
                            <SelectValue placeholder="Week" />
                        </div>

                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Weeks</SelectLabel>
                            <SelectItem value="apple">Week 1</SelectItem>
                            <SelectItem value="banana">Week 2</SelectItem>
                            <SelectItem value="blueberry">Week 3</SelectItem>
                            <SelectItem value="grapes">Week 4</SelectItem>
                            <SelectItem value="pineapple">Week 5</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

            </div>

            <ScrollArea className="h-[400px] w-full relative">
                <Table className=''>
                    <TableCaption>A list of your teachers Attendance.</TableCaption>
                    <TableHeader>
                        <TableRow>
                            <TableHead >Name</TableHead>
                            <TableHead >Day 1</TableHead>
                            <TableHead>Day 2</TableHead>
                            <TableHead>Day 3</TableHead>
                            <TableHead>Day 4</TableHead>
                            <TableHead>Day 5</TableHead>
                            <TableHead>Day 6</TableHead>
                            <TableHead >Day 7</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        {
                            teachersAttendance?.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                                                <Image
                                                    src={teacher.avatar}
                                                    alt={teacher.name}
                                                    width={32}
                                                    height={32}
                                                    className="object-cover"
                                                />
                                            </div>
                                            {teacher.name}
                                        </div>
                                    </TableCell>
                                    <TableCell >{Status(teacher?.Day1)}</TableCell>
                                    <TableCell >{Status(teacher?.Day2)}</TableCell>
                                    <TableCell >{Status(teacher?.Day3)}</TableCell>
                                    <TableCell >{Status(teacher?.Day4)}</TableCell>
                                    <TableCell >{Status(teacher?.Day5)}</TableCell>
                                    <TableCell >{Status(teacher?.Day6)}</TableCell>
                                    <TableCell >{Status(teacher?.Day7)}</TableCell>
                                </TableRow>
                            ))
                        }


                    </TableBody>

                </Table>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
        </div>
    )
}

export default AttendanceTable