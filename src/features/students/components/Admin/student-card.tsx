import Image from 'next/image'
import { MoreHorizontal, Mail, Phone } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Student } from '../../types'
import StudentActions from './shared/student-actions'

interface StudentCardProps {
    student: Student
}

export function StudentCard({ student }: StudentCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <div className="relative h-32 bg-[#2E8B57]/10">
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                            <Image
                                src={student.image ?? '/images/default-avatar.png'}
                                alt={student.name ?? ""}
                                width={80}
                                height={80}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="pt-12 pb-4">
                <div className="text-center space-y-1">
                    <h3 className="font-semibold">{student.name}</h3>
                    <p className="text-sm text-gray-500">
                        Class {student.currentClass?.title}
                    </p>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Phone className="h-4 w-4" />
                        {student.phone}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        {student.email}
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <StudentActions student={student} />
                </div>
            </CardContent>
        </Card>
    )
}

