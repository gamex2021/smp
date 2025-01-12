import Image from 'next/image'
import Link from 'next/link'
import { MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface StudentCardProps {
    classId: string
    student: {
        id: number
        name: string
        class: string
        teacher: string
        number: number
        avatar: string
    }
}

export function TeacherStudentCard({ classId, student }: StudentCardProps) {
    return (
        <Link
            href={`/students/${classId}/${student.id}`}
            className="bg-[#2E8B57] rounded-lg p-4 text-white relative group hover:shadow-lg transition-shadow"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/20 overflow-hidden">
                        <Image
                            src={student.avatar}
                            alt={student.name}
                            width={40}
                            height={40}
                            className="object-cover"
                        />
                    </div>
                    <div>
                        <h3 className="font-medium">{student.name}</h3>
                        <p className="text-sm text-white/80">
                            {student.class}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[#2E8B57] font-medium">
                        {student.number}
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-white"
                        onClick={(e) => {
                            e.preventDefault()
                            // Handle menu click
                        }}
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            <div className="mt-4 flex items-center gap-2">
                <div className="w-6 h-6 rounded-full bg-white/20 overflow-hidden">
                    <Image
                        src="/images/dummy-user.png"
                        alt={student.teacher}
                        width={24}
                        height={24}
                        className="object-cover"
                    />
                </div>
                <p className="text-sm text-white/80">{student.teacher}</p>
            </div>
        </Link>
    )
}

