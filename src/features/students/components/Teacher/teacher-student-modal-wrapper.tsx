'use client'

import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog"
import { StudentDetails } from '../../shared/student-details'

interface StudentModalWrapperProps {
    student: {
        id: string
        name: string
        gender: string
        location: string
        position: string
        email: string
        phone: string
        payment: string
        parentPhone: string
        parentEmail: string
    }
}

export function TeacherStudentModalWrapper({ student }: StudentModalWrapperProps) {
    const router = useRouter()

    return (
        <Dialog open onOpenChange={() => router.back()}>
            <DialogTitle>
               
            </DialogTitle>
            <DialogContent className="max-w-3xl p-0">

                <StudentDetails student={student} />
            </DialogContent>
        </Dialog>
    )
}

