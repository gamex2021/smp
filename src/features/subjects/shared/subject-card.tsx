"use client"

import { Button } from "@/components/ui/button"
import { MoreVertical, Plus } from 'lucide-react'
import Image from 'next/image'

interface BaseSubjectCardProps {
    name: string
    onClick?: () => void
    onAssign?: () => void
}

interface TeacherProps {
    teacher: true
    teacherName: string
    className: string
}


interface NonTeacherProps {
    teacher?: false
    teacherName?: never
    className?: never
}


type SubjectCardProps = BaseSubjectCardProps & (TeacherProps | NonTeacherProps)

export function SubjectCard({
    name,
    onClick,
    onAssign,
    teacher,
    teacherName,
    className
}: SubjectCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-[#2E8B57] rounded-2xl max-w-[300px] aspect-square p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
        >
            <div className="h-full flex flex-col">
                <h3 className="font-medium text-lg mb-4 text-[#F8FBFA] ">{name}</h3>
                <div className="flex-1 flex items-center bg-[#57a178] rounded-[16px] justify-center mb-4">
                    <Image src="/images/book.png" width={300} height={300} className='h-[63px] w-[63px]' alt='book' />
                </div>

                {
                    teacher ? (
                        <div className="flex justify-between w-full items-center gap-4">
                            <div className="space-y-1">
                                <p className="text-sm text-white/90">{teacherName}</p>
                                <p className="text-sm text-white/75">{className}</p>
                            </div>
                            <div className='px-2 py-2 bg-[#FFFFFF] rounded-[6.65px]'>
                                <MoreVertical className="h-5 w-5 text-[#2E8B57]" />
                            </div>
                        </div>
                    ) : (
                        <Button
                            size="default"
                            className="w-full bg-white hover:bg-white/90 text-[#11321F] font-medium rounded-xl"
                            onClick={(e) => {
                                e.stopPropagation()
                                onAssign?.()
                            }}
                        >
                            Assign
                            <div className='px-1 py-1 rounded-md bg-[#2E8B57]'>
                                <Plus className="h-4 w-4 text-white" />
                            </div>
                        </Button>
                    )
                }
            </div>
        </div>
    )
}