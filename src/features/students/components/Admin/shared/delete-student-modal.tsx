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
import type { Student } from "../../../types"
import { TbLoader3 } from "react-icons/tb"
import { useDomain } from "@/context/DomainContext"

interface DeleteStudentModalProps {
    isOpen: boolean
    onClose: () => void
    student: Student
}

export default function DeleteStudentModal({ isOpen, onClose, student }: DeleteStudentModalProps) {
    const [emailConfirmation, setEmailConfirmation] = useState("")
    const [loading, setLoading] = useState(false)
    const { school } = useDomain()

    // Get school info
    const deleteStudent = useAction(api.mutations.student.deleteStudent)

    const handleDelete = async () => {
        if (!school?._id) {
            return null
        }
        if (emailConfirmation !== student.email) {
            toast.error("Email does not match")
            return
        }

        setLoading(true)
        try {
            await deleteStudent({
                studentId: student._id,
                schoolId: school?._id,
            })
            toast.success("Student deleted successfully")
            onClose()
        } catch (error) {
            console.error("Error deleting student:", error)
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
                        <DialogTitle>Delete Student</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        This action cannot be undone. This will permanently delete {student.name}'s account and remove their data
                        from our servers.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                        <p>Deleting this student will:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Remove all their personal information</li>
                            <li>Remove them from their assigned class</li>
                            <li>Delete all their academic records</li>
                            <li>Make their account inaccessible</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email-confirmation">
                            Type <span className="font-semibold">{student.email}</span> to confirm
                        </Label>
                        <Input
                            id="email-confirmation"
                            value={emailConfirmation}
                            onChange={(e) => setEmailConfirmation(e.target.value)}
                            placeholder={student.email}
                            aria-describedby="email-confirmation-description"
                        />
                        <p id="email-confirmation-description" className="text-xs text-gray-500">
                            Please type the student's email address to confirm deletion
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
                        disabled={emailConfirmation !== student.email || loading}
                    >
                        {loading ? <TbLoader3 className="w-7 h-7 animate-spin" /> : "Delete Student"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
