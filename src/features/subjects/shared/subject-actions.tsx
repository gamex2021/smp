"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { EditIcon, Eye, TrashIcon } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type Subject } from "../types"
import EditSubjectModal from "./edit-subject-modal"
import DeleteSubjectModal from "./delete-subject-modal"

interface SubjectActionsProps {
    subject: Subject
}

export default function SubjectActions({ subject }: SubjectActionsProps) {
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const pathname = usePathname()

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-[#2E8B57] hover:text-[#2E8B57]/90"
                        aria-label="Subject options"
                    >
                        <Image src="/images/box-edit.png" alt="Options" width={200} height={200} className="h-7 w-7" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link
                            href={`/subjects/${subject._id}`}
                            className="flex items-center gap-2 cursor-pointer"
                            scroll={false}
                            prefetch={true}
                        >
                            <Eye className="h-4 w-4" />
                            <span>View</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center gap-2 cursor-pointer" onClick={() => setIsEditModalOpen(true)}>
                        <EditIcon className="h-4 w-4" />
                        <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        className="flex items-center gap-2 cursor-pointer text-red-500 focus:text-red-500"
                        onClick={() => setIsDeleteModalOpen(true)}
                    >
                        <TrashIcon className="h-4 w-4" />
                        <span>Delete</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Edit Modal */}
            {isEditModalOpen && (
                <EditSubjectModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} subject={subject} />
            )}

            {/* Delete Modal */}
            {isDeleteModalOpen && (
                <DeleteSubjectModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} subject={subject} />
            )}
        </div>
    )
}
