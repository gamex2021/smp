'use client'

import { useState } from 'react'
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
import { StudentsPagination } from './students-pagination'



interface Student {
    id: number
    name: string
    class: string
    group: string
    gender: string
    phone: string
    email: string
    avatar: string
}

interface StudentsTableProps {
    initialStudents: Student[]
}

export function StudentsTable({ initialStudents }: StudentsTableProps) {
    const [page, setPage] = useState(1)
    const [studentsPerPage] = useState(6)

    const indexOfLastStudent = page * studentsPerPage
    const indexOfFirstStudent = indexOfLastStudent - studentsPerPage
    const currentStudents = initialStudents.slice(indexOfFirstStudent, indexOfLastStudent)

    return (
        <div className="bg-white rounded-lg border shadow-sm">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-12"></TableHead>
                        <TableHead className='text-[#11321F]'>Name</TableHead>
                        <TableHead className='text-[#11321F]'>Class</TableHead>
                        <TableHead className='text-[#11321F]'>Group</TableHead>
                        <TableHead className='text-[#11321F]'>Gender</TableHead>
                        <TableHead className='text-[#11321F]'>Phone number</TableHead>
                        <TableHead className='text-[#11321F]'>Email</TableHead>
                        <TableHead className="w-12">   <MoreHorizontal className="h-4 w-4" /></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentStudents.map((student, index) => (
                        <TableRow key={student.id}>
                            <TableCell>{indexOfFirstStudent + index + 1}</TableCell>
                            <TableCell>
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100">
                                        <Image
                                            src={student.avatar}
                                            alt={student.name}
                                            width={32}
                                            height={32}
                                            className="object-cover"
                                        />
                                    </div>
                                    {student.name}
                                </div>
                            </TableCell>
                            <TableCell>{student.class}</TableCell>
                            <TableCell>{student.group}</TableCell>
                            <TableCell>{student.gender}</TableCell>
                            <TableCell>{student.phone}</TableCell>
                            <TableCell>{student.email}</TableCell>
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
                <StudentsPagination
                    currentPage={page}
                    totalPages={Math.ceil(initialStudents.length / studentsPerPage)}
                    onPageChange={setPage}
                />
            </div>
        </div>
    )
}

