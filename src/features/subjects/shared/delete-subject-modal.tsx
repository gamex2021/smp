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
import { useMutation, useQuery } from "convex/react"
import { toast } from "sonner"
import { api } from "~/_generated/api"
import { type Subject } from "../types"
import { TbLoader3 } from "react-icons/tb"
import { useDomain } from "@/context/DomainContext"

interface DeleteSubjectModalProps {
    isOpen: boolean
    onClose: () => void
    subject: Subject
}

export default function DeleteSubjectModal({ isOpen, onClose, subject }: DeleteSubjectModalProps) {
    const [nameConfirmation, setNameConfirmation] = useState("")
    const [loading, setLoading] = useState(false)
    const { domain } = useDomain()

    // Get school info
    const schoolInfo = useQuery(api.queries.school.findSchool, { domain })

    // Delete subject mutation
    const deleteSubject = useMutation(api.mutations.subject.deleteSubject)

    const handleDelete = async () => {
        if (nameConfirmation !== subject.name) {
            toast.error("Subject name does not match")
            return
        }

        if (!schoolInfo?.id) {
            toast.error("Could not get school info.")
            return
        }

        setLoading(true)
        try {
            await deleteSubject({
                subjectId: subject._id,
                schoolId: schoolInfo.id,
            })
            toast.success("Subject deleted successfully")
            onClose()
        } catch (error) {
            console.error("Error deleting subject:", error)
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
                        <DialogTitle>Delete Subject</DialogTitle>
                    </div>
                    <DialogDescription className="pt-2">
                        This action cannot be undone. This will permanently delete the subject &apos;{subject.name}&apos; and remove all
                        associated data from our servers.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
                        <p>Deleting this subject will:</p>
                        <ul className="list-disc pl-5 mt-2 space-y-1">
                            <li>Remove it from all classes where it is taught</li>
                            <li>Remove all teacher assignments for this subject</li>
                            <li>Delete all curriculum materials associated with it</li>
                            <li>This action is permanent and cannot be reversed</li>
                        </ul>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="name-confirmation">
                            Type <span className="font-semibold">{subject.name}</span> to confirm
                        </Label>
                        <Input
                            id="name-confirmation"
                            value={nameConfirmation}
                            onChange={(e) => setNameConfirmation(e.target.value)}
                            placeholder={subject.name}
                            aria-describedby="name-confirmation-description"
                        />
                        <p id="name-confirmation-description" className="text-xs text-gray-500">
                            Please type the subject name to confirm deletion
                        </p>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between">
                    <Button variant="outline" onClick={onClose} type="button">
                        Cancel
                    </Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={nameConfirmation !== subject.name || loading}>
                        {loading ? <TbLoader3 className="w-7 h-7 animate-spin" /> : "Delete Subject"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
