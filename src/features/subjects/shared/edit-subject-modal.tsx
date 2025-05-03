"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { type Subject } from "../types"
import EditSubjectForm from "./edit-subject-form"

interface EditSubjectModalProps {
    isOpen: boolean
    onClose: () => void
    subject: Subject
}

export default function EditSubjectModal({ isOpen, onClose, subject }: EditSubjectModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Subject</DialogTitle>
                    <DialogDescription>Make changes to subject information. Click save when you&apos;re done.</DialogDescription>
                </DialogHeader>
                <EditSubjectForm subject={subject} onClose={onClose} />
            </DialogContent>
        </Dialog>
    )
}
