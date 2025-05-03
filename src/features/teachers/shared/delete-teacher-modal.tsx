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
import type { Teacher } from "../types"
import { TbLoader3 } from "react-icons/tb"

interface DeleteTeacherModalProps {
    isOpen: boolean
    onClose: () => void
    teacher: Teacher
}

export default function DeleteTeacherModal({ isOpen, onClose, teacher }: DeleteTeacherModalProps) {
    const [emailConfirmation, setEmailConfirmation] = useState("")
    const [loading, setLoading] = useState(false)

    const deleteTeacher = useAction(api.mutations.teacher.deleteTeacher)

    const handleDelete = async () => {
        if (emailConfirmation !== teacher.email) {
            toast.error("Email does not match")
            return
        }

        setLoading(true)
        try {
            await deleteTeacher({ teacherId: teacher._id })
            toast.success("Teacher deleted successfully")
            onClose()
        } catch (error) {
            console.error("Error deleting teacher:", error)
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
                        <DialogTitle>Delete Teacher</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        This action cannot be undone. This will permanently delete {teacher.name}&apos;s account and remove their data
                        from our servers.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                        <p>Deleting this teacher will:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Remove all their personal information</li>
                            <li>Remove them from any assigned classes and subjects</li>
                            <li>Make their account inaccessible</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email-confirmation">
                            Type <span className="font-semibold">{teacher.email}</span> to confirm
                        </Label>
                        <Input
                            id="email-confirmation"
                            value={emailConfirmation}
                            onChange={(e) => setEmailConfirmation(e.target.value)}
                            placeholder={teacher.email}
                            aria-describedby="email-confirmation-description"
                        />
                        <p id="email-confirmation-description" className="text-xs text-gray-500">
                            Please type the teacher&apos;s email address to confirm deletion
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
                        disabled={emailConfirmation !== teacher.email || loading}
                    >
                        {loading ? <TbLoader3 className="w-7 h-7 animate-spin" /> : "Delete Teacher"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
