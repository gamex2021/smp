'use client'

import Image from 'next/image'
import { MoreHorizontal } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { TeachersPagination } from './teachers-pagination'


interface Teacher {
    id: number
    name: string
    class: string
    subject: string
    email: string
    avatar: string
}

interface TeachersTableProps {
    teachers: Teacher[]
    currentPage: number
    onPageChange: (page: number) => void
}

export function TeachersTable({ teachers, currentPage, onPageChange }: TeachersTableProps) {
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
                            <TableCell>{teacher.class}</TableCell>
                            <TableCell>{teacher.subject}</TableCell>
                            <TableCell>{teacher.email}</TableCell>
                            <TableCell>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-[#2E8B57] hover:text-[#2E8B57]/90"
                                >
                                    <Image src={"/images/box-edit.png"} alt='box-edit' width={200} height={200} className='h-7 w-7' />

                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <div className="py-4 px-6 border-t">
                <TeachersPagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(teachers.length / teachersPerPage)}
                    onPageChange={onPageChange}
                />
            </div>
        </div>
    )
}

