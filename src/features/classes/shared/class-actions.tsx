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
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { type Classes } from "../types"
import EditClassModal from "./edit-class-modal"
import DeleteClassModal from "./delete-class-modal"

interface ClassActionsProps {
  classItem: Classes
}

export default function ClassActions({ classItem }: ClassActionsProps) {
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
            aria-label="Class options"
          >
            <Image src="/images/box-edit.png" alt="Options" width={200} height={200} className="h-7 w-7" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link
              href={`/classes/${classItem._id}`}
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
        <EditClassModal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} classItem={classItem} />
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <DeleteClassModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          classItem={classItem}
        />
      )}
    </div>
  )
}
