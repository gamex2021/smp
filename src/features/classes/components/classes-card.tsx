"use client"

import { Briefcase, ChevronRight } from 'lucide-react'

interface ClassCardProps {
    name: string
    teacher: string
    students: number
    onClick?: () => void
}

export function ClassCard({ name, teacher, students, onClick }: ClassCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-[#2E8B57] rounded-2xl p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200 w-full max-w-[280px]"
        >
            <div className="flex items-start justify-between">
                <div className="space-y-4 w-full">
                    <h3 className="text-lg font-medium">{name}</h3>
                    <div className='grid place-content-center'>
                        <div className="bg-white rounded-full p-3 w-14  h-14 flex items-center justify-center">
                            <Briefcase className="h-10 w-10 text-[#2E8B57]" />
                        </div>
                    </div>

                    <div className="flex justify-between w-full items-center gap-4">

                        <div className="space-y-1">
                            <p className="text-sm text-white/90">{teacher}</p>
                            <p className="text-sm text-white/75">{students} Students</p>
                        </div>
                        <div className='px-2 py-2 bg-[#FFFFFF] rounded-[6.65px]'>
                            <ChevronRight className="h-5 w-5 text-[#2E8B57]" />
                        </div>
                    </div>
                </div>


            </div>
        </div>
    )
}

