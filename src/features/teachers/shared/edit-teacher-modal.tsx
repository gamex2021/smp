"use client"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import EditTeacherForm from "./edit-teacher-form"
import type { Teacher } from "../types"

interface EditTeacherModalProps {
    isOpen: boolean
    onClose: () => void
    teacher: Teacher
}

export default function EditTeacherModal({ isOpen, onClose, teacher }: EditTeacherModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Teacher</DialogTitle>
                    <DialogDescription>Make changes to teacher information. Click save when you are done.</DialogDescription>
                </DialogHeader>
                <EditTeacherForm teacher={teacher} onClose={onClose} />
            </DialogContent>
        </Dialog>
    )
}
