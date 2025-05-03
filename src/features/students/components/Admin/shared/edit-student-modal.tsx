"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import EditStudentForm from "./edit-student-form"
import type { Student } from "../../../types"

interface EditStudentModalProps {
  isOpen: boolean
  onClose: () => void
  student: Student
}

export default function EditStudentModal({ isOpen, onClose, student }: EditStudentModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>Make changes to student information. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <EditStudentForm student={student} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
