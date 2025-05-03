"use client"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { MoreVertical, Plus } from 'lucide-react'
import Image from 'next/image'
import AssignSubjectToTeacher from "../components/Admin/components/assign-subject-to-teacher"
import { type Id } from "~/_generated/dataModel"
import { type Subject } from "../types"
import SubjectActions from "./subject-actions"

interface BaseSubjectCardProps {
    id: Id<"subjects">
    name: string
    onClick?: () => void
    onAssign?: () => void
    subject: Subject
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
    id,
    name,
    onClick,
    onAssign,
    teacher,
    teacherName,
    className,
    subject
}: SubjectCardProps) {

    console.log("subject", subject)
    return (
        <div
            onClick={onClick}
            className="bg-[#2E8B57] rounded-2xl max-w-[300px] aspect-square p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
        >

            {/* the subject actin to delete, view and edit the subject */}
            <div className="flex justify-end">
                <SubjectActions subject={subject} />
            </div>

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
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button
                                    size="default"
                                    className="w-full bg-white hover:bg-white/90 text-[#11321F] font-medium rounded-xl"
                                >
                                    Assign
                                    <div className='px-1 py-1 rounded-md bg-[#2E8B57]'>
                                        <Plus className="h-4 w-4 text-white" />
                                    </div>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Assign subject</DialogTitle>
                                    <DialogDescription>
                                        Assign the subject to a teacher
                                    </DialogDescription>
                                </DialogHeader>
                                {/* this is the component that assigns the subject to a teacher , so they are assigning the teacher to a subject in the class, so we will be using the subjectTeachers schema here which joins the teacher, subject and also the class */}
                                <AssignSubjectToTeacher subjectId={id} />
                            </DialogContent>
                        </Dialog>

                    )
                }
            </div>
        </div>
    )
}