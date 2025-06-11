"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Mail, Edit, MoreVertical } from "lucide-react";
import type { PaymentData } from "../types";
import type { Id } from "~/_generated/dataModel";
import PaymentEditModal from "./payment-edit-modal";

interface PaymentActionsDropdownProps {
  studentId: Id<"users">;
  payments: PaymentData;
  onSendReminder: () => void;
}

export default function PaymentActionsDropdown({
  studentId,
  payments,
  onSendReminder,
}: PaymentActionsDropdownProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleModalClose = () => {
    setIsEditModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={onSendReminder}>
            <Mail className="mr-2 h-4 w-4" />
            Send Reminder
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Payments
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <PaymentEditModal
        isOpen={isEditModalOpen}
        onClose={handleModalClose}
        paymentData={payments}
      />
    </>
  );
}
