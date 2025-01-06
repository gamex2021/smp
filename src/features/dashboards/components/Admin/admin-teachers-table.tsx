"use client";
import React from 'react'
import { UserPlus2 } from "lucide-react";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Image from 'next/image';
import { HiDotsVertical } from "react-icons/hi";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { teachers } from '../../lib/data';

type Props = object

const TeachersTable = (props: Props) => {
    return (
        <div className='border border-[#11321F99] rounded-[20px] px-[34px] py-[22px] w-[86vw] md:w-[70vw] h-full xl:w-[100%]  2xl:w-[100%]'>
            {/* the teachers list and the button to add more teachers */}
            <div className='flex justify-between items-center px-3'>
                <h1 className='text-[16px] font-semibold text-[#11321F] '>Teachers List</h1>

                {/* Add a teacher button */}
                <UserPlus2 className='w-5 h-5 text-slate-700 cursor-pointer' />
            </div>

            <ScrollArea className="h-[500px] w-full relative">
                <Table className=''>
                    <TableCaption>A list of your teachers.</TableCaption>
                    <TableHeader>   
                        <TableRow >
                            <TableHead className='text-[#11321F99] font-normal leading-[24.96px]'>Name</TableHead>
                            <TableHead className='text-[#11321F99] font-normal leading-[24.96px]'>Class</TableHead>
                            <TableHead className='text-[#11321F99] font-normal leading-[24.96px]'>Subject</TableHead>
                            <TableHead className='text-[#11321F99] font-normal leading-[24.96px]'>Email</TableHead>
                            <TableHead className="text-right text-[#11321F99] font-normal leading-[24.96px]">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>

                        {
                            teachers?.map((teacher) => (
                                <TableRow key={teacher.id}>
                                    <TableCell className="font-medium flex space-x-2 items-center w-full text-[#11321F]">
                                        <Image src={teacher.src} alt={teacher.name} width={500} height={500} className='w-10 h-10 object-cover object-top rounded-full' />
                                        <h1 >{teacher.name}</h1>
                                    </TableCell>
                                    <TableCell className='text-[#11321F]'>{teacher.class}</TableCell>
                                    <TableCell className='text-[#11321F]'>{teacher.subject}</TableCell>
                                    <TableCell className='text-[#11321F]'>{teacher.email}</TableCell>
                                    <TableCell className="flex justify-end"><HiDotsVertical className='w-5 h-5 text-slate-500 cursor-pointer' /></TableCell>
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

export default TeachersTable