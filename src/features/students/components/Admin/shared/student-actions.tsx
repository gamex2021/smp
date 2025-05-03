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
import type { Student } from "../../../types"
import Link from "next/link"
import { usePathname } from "next/navigation"
import EditStudentModal from "./edit-student-modal"
import DeleteStudentModal from "./delete-student-modal"

interface StudentActionsProps {
  student: Student
}

export default function StudentActions({ student }: StudentActionsProps) {
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
            className="text-[#4B6CB7] hover:text-[#4B6CB7]/90"
            aria-label="Student options"
          >
            <Image src="/images/box-edit.png" alt="Options" width={200} height={200} className="h-7 w-7" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/students/${student._id}`}
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
        <EditStudentModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} student={student} />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteStudentModal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} student={student} />
      )}
    </div>
  )
}
