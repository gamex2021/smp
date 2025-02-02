import Image from 'next/image'
import { Mail, MoreHorizontal, BookOpen, GraduationCap } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardHeader,
} from "@/components/ui/card"
import { Teacher } from '../types'

interface TeacherCardProps {
    teacher: Teacher
}

export function TeacherCard({ teacher }: TeacherCardProps) {
    return (
        <Card className="overflow-hidden">
            <CardHeader className="p-0">
                <div className="relative h-32 bg-[#2E8B57]/10">
                    <div className="absolute -bottom-10 left-1/2 -translate-x-1/2">
                        <div className="w-20 h-20 rounded-full border-4 border-white overflow-hidden bg-white">
                            <Image
                                src={teacher.image ?? ""}
                                alt={teacher?.name ?? "Teacher"}
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
                    <h3 className="font-semibold">{teacher.name}</h3>
                    <p className="text-sm text-gray-500">{teacher?.assignedClasses?.map(classes => classes?.title).join(', ')} Teacher</p>
                </div>
                <div className="mt-4 space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <GraduationCap className="h-4 w-4" />
                        Class {teacher?.assignedClasses?.map(classes => classes?.title).join(', ')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <BookOpen className="h-4 w-4" />
                        {teacher?.subjects?.map(subject => subject?.name).join(', ')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Mail className="h-4 w-4" />
                        {teacher.email}
                    </div>
                </div>
                <div className="mt-4 flex justify-end">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#2E8B57] hover:text-[#2E8B57]/90"
                    >
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}

