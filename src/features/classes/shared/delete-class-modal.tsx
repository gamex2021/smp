"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertTriangle } from "lucide-react"
import { useState } from "react"
import { useAction } from "convex/react"
import { toast } from "sonner"
import { api } from "~/_generated/api"
import { TbLoader3 } from "react-icons/tb"
import { type Classes } from "../types"

interface DeleteClassModalProps {
  isOpen: boolean
  onClose: () => void
  classItem: Classes
}

export default function DeleteClassModal({ isOpen, onClose, classItem }: DeleteClassModalProps) {
  const [titleConfirmation, setTitleConfirmation] = useState("")
  const [loading, setLoading] = useState(false)

  // Delete class action
  const deleteClass = useAction(api.mutations.class.deleteClass)

  const handleDelete = async () => {
    if (titleConfirmation !== classItem.title) {
      toast.error("Class title does not match")
      return
    }

    setLoading(true)
    try {
      await deleteClass({
        classId: classItem._id,
      })
      toast.success("Class deleted successfully")
      onClose()
    } catch (error) {
      console.error("Error deleting class:", error)
      toast.error(`${error instanceof Error ? error.message : "Something went wrong"}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 text-red-500">
            <AlertTriangle className="h-6 w-6" />
            <DialogTitle>Delete Class</DialogTitle>
          </div>
          <DialogDescription className="pt-2">
            This action cannot be undone. This will permanently delete the class &apos;{classItem.title}&apos; and remove all
            associated data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
            <p>Deleting this class will:</p>
            <ul className="list-disc pl-5 mt-2 space-y-1">
              <li>Remove all students assigned to this class</li>
              <li>Remove all teacher assignments for this class</li>
              <li>Delete all subject assignments for this class</li>
              <li>Remove all academic records associated with this class</li>
              <li>This action is permanent and cannot be reversed</li>
            </ul>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title-confirmation">
              Type <span className="font-semibold">{classItem.title}</span> to confirm
            </Label>
            <Input
              id="title-confirmation"
              value={titleConfirmation}
              onChange={(e) => setTitleConfirmation(e.target.value)}
              placeholder={classItem.title}
              aria-describedby="title-confirmation-description"
            />
            <p id="title-confirmation-description" className="text-xs text-gray-500">
              Please type the class title to confirm deletion
            </p>
          </div>
        </div>

        <DialogFooter className="sm:justify-between">
          <Button variant="outline" onClick={onClose} type="button">
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={titleConfirmation !== classItem.title || loading}
          >
            {loading ? <TbLoader3 className="w-7 h-7 animate-spin" /> : "Delete Class"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
