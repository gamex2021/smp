'use client'

import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { MoreHorizontal } from 'lucide-react'
import Image from 'next/image'
import { type Teacher } from '../types'
import TeacherActions from "../shared/teacher-actions"




interface TeachersTableProps {
    teachers: Teacher[]
    currentPage: number
    onPageChange: (page: number) => void
}

export function TeachersTable({ teachers, currentPage }: TeachersTableProps) {
    const teachersPerPage = 6
    const indexOfLastTeacher = currentPage * teachersPerPage
    const indexOfFirstTeacher = indexOfLastTeacher - teachersPerPage
    const currentTeachers = teachers.slice(indexOfFirstTeacher, indexOfLastTeacher)

    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='text-[#11321F]'>Name</TableHead>
                        <TableHead className='text-[#11321F]'>Class</TableHead>
                        <TableHead className='text-[#11321F]'>Subject</TableHead>
                        <TableHead className='text-[#11321F]'>Email</TableHead>
                        <TableHead className="w-12">  <MoreHorizontal className="h-4 w-4" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentTeachers.map((teacher) => (
                        <TableRow key={teacher._id}>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                                        <Image
                                            src={teacher.image ?? ""}
                                            alt={teacher?.name ?? "Teacher"}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    </div>
                                    {teacher.name}
                                </div>
                            </TableCell>
                            <TableCell>{
                                teacher?.assignedClasses?.map(classes => classes?.title).join(', ')
                            }</TableCell>
                            <TableCell>{
                                teacher?.subjects?.map(subject => subject?.name).join(', ')
                            }</TableCell>
                            <TableCell>{teacher.email}</TableCell>
                            <TableCell>
                                {/* Actions to edit or delete a teacher from the table */}
                                <TeacherActions teacher={teacher} />
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            {/* <div className="py-4 px-6 border-t">
                <TeachersPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(teachers.length / teachersPerPage)}
                    onPageChange={onPageChange}
                />
            </div> */}
        </div>
    )
}

