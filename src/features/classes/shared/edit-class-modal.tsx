"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import EditClassForm from "./edit-class-form"
import { type Classes } from "../types"

interface EditClassModalProps {
  isOpen: boolean
  onClose: () => void
  classItem: Classes
}

export default function EditClassModal({ isOpen, onClose, classItem }: EditClassModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Class</DialogTitle>
          <DialogDescription>Make changes to class information. Click save when you're done.</DialogDescription>
        </DialogHeader>
        <EditClassForm classItem={classItem} onClose={onClose} />
      </DialogContent>
    </Dialog>
  )
}
