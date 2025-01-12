import Image from 'next/image'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface StudentsTableProps {
    students: {
        id: number
        name: string
        class: string
        teacher: string
        number: number
        avatar: string
    }[]
    classId: string
}

export function TeacherStudentsTable({ students, classId }: StudentsTableProps) {
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Number</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Class</TableHead>
                    <TableHead>Teacher</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {students.map((student) => (
                    <TableRow key={student.id}>
                        <TableCell>{student.number}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full overflow-hidden">
                                    <Image
                                        src={student.avatar}
                                        alt={student.name}
                                        width={32}
                                        height={32}
                                        className="object-cover"
                                    />
                                </div>
                                <Link href={`/dashboard/students/${classId}/${student.id}`} className="hover:underline">
                                    {student.name}
                                </Link>
                            </div>
                        </TableCell>
                        <TableCell>{student.class}</TableCell>
                        <TableCell>{student.teacher}</TableCell>
                        <TableCell className="text-right">
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

