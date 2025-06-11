/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Trash2, Save, X } from "lucide-react";
import { useMutation } from "convex/react";
import type { PaymentData, Payment } from "../types";
import type { Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";
import { toast } from "sonner";
import debounce from "lodash.debounce"; // install via npm if not already

interface PaymentEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: PaymentData;
}

interface EditingPayment {
  id: Id<"outstandingPayments">;
  remainingAmount: number;
  originalAmount: number;
}

interface DeleteConfirmation {
  payment: Payment | null;
  isOpen: boolean;
  emailConfirmation: string;
}

export default function PaymentEditModal({
  isOpen,
  onClose,
  paymentData,
}: PaymentEditModalProps) {
  const [editingPayments, setEditingPayments] = useState<
    Map<string, EditingPayment>
  >(new Map());
  const [deleteConfirmation, setDeleteConfirmation] =
    useState<DeleteConfirmation>({
      payment: null,
      isOpen: false,
      emailConfirmation: "",
    });
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const updatePayment = useMutation(
    api.mutations.fees.updateOutstandingPaymentById,
  );
  const deletePayment = useMutation(
    api.mutations.fees.deleteOutstandingPaymentById,
  );

  const debouncedEditAmount = debounce(
    (paymentId: Id<"outstandingPayments">, newAmount: string) => {
      const numericAmount = Number.parseFloat(newAmount) || 0;
      const payment = paymentData.payments.find((p) => p._id === paymentId);
      if (!payment) return;

      setEditingPayments((prev) => {
        const updated = new Map(prev);
        updated.set(paymentId, {
          id: paymentId,
          remainingAmount: numericAmount,
          originalAmount: payment.remainingAmount,
        });
        return updated;
      });
    },
    300, // milliseconds
  );

  const handleEditAmount = useCallback(
    (paymentId: Id<"outstandingPayments">, newAmount: string) => {
      debouncedEditAmount(paymentId, newAmount);
    },
    [debouncedEditAmount],
  );

  const handleSavePayment = async (paymentId: Id<"outstandingPayments">) => {
    const editingPayment = editingPayments.get(paymentId);
    if (!editingPayment) return;

    if (editingPayment.remainingAmount < 0) {
      toast.error("Remaining amount cannot be negative.");
      return;
    }

    const payment = paymentData.payments.find((p) => p._id === paymentId);
    if (!payment) return;

    if (editingPayment.remainingAmount > payment.amount) {
      toast.error("Remaining amount cannot exceed the total amount.");
      return;
    }

    setIsUpdating(true);
    try {
      await updatePayment({
        outstandingId: paymentId,
        remainingAmount: editingPayment.remainingAmount,
      });

      setEditingPayments((prev) => {
        const updated = new Map(prev);
        updated.delete(paymentId);
        return updated;
      });

      toast.success("The payment amount has been successfully updated.");
    } catch {
      toast.error("Failed to update payment. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = (paymentId: Id<"outstandingPayments">) => {
    setEditingPayments((prev) => {
      const updated = new Map(prev);
      updated.delete(paymentId);
      return updated;
    });
  };

  const handleDeleteClick = (payment: Payment) => {
    setDeleteConfirmation({
      payment,
      isOpen: true,
      emailConfirmation: "",
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirmation.payment) return;

    if (
      deleteConfirmation.emailConfirmation.toLowerCase() !==
      paymentData.student.email.toLowerCase()
    ) {
      toast.error(
        "Please enter the correct student email to confirm deletion.",
      );
      return;
    }

    setIsDeleting(true);
    try {
      await deletePayment({
        outstandingId: deleteConfirmation.payment._id,
      });

      toast.success("The outstanding payment has been successfully deleted.");
      setDeleteConfirmation({
        payment: null,
        isOpen: false,
        emailConfirmation: "",
      });
    } catch {
      toast.error("Failed to delete payment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadgeVariant = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "default";
      case "partial":
        return "secondary";
      case "overdue":
        return "destructive";
      default:
        return "outline";
    }
  };

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);

  const getTermName = (termId: number) => {
    const termNames = {
      1: "First Term",
      2: "Second Term",
      3: "Third Term",
    };
    return termNames[termId as keyof typeof termNames] || `Term ${termId}`;
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          className="max-h-[80vh] max-w-4xl overflow-y-auto"
        >
          <DialogHeader>
            <DialogTitle>Edit Student Payments</DialogTitle>
            <DialogDescription>
              Manage outstanding payments for {paymentData.student.name} (
              {paymentData.student.email})
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted/50 p-4">
              <div>
                <Label>Student</Label>
                <p className="font-medium">{paymentData.student.name}</p>
                <p className="text-sm text-muted-foreground">
                  {paymentData.student.email}
                </p>
              </div>
              <div>
                <Label>Class</Label>
                <p className="font-medium">{paymentData.class.name}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Outstanding Payments</h3>
                <Badge variant="outline">
                  Total: {formatCurrency(paymentData.totalOutstanding)}
                </Badge>
              </div>

              {paymentData.payments.map((payment) => {
                const editingPayment = editingPayments.get(payment._id);
                const isEditing = !!editingPayment;

                return (
                  <Card key={payment._id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {payment.feeName}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={getStatusBadgeVariant(payment.status)}
                          >
                            {payment.status}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteClick(payment)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                        <div>
                          <Label>Academic Year</Label>
                          <p className="font-medium">{payment.academicYear}</p>
                        </div>
                        <div>
                          <Label>Term</Label>
                          <p className="font-medium">
                            {getTermName(payment.termId)}
                          </p>
                        </div>
                        <div>
                          <Label>Total Amount</Label>
                          <p className="font-medium">
                            {formatCurrency(payment.amount)}
                          </p>
                        </div>
                        <div>
                          <Label>Amount Paid</Label>
                          <p className="font-medium">
                            {formatCurrency(payment.amountPaid)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-end gap-2">
                        <div className="flex-1">
                          <Label htmlFor={`remaining-${payment._id}`}>
                            Remaining Amount
                          </Label>
                          <Input
                            id={`remaining-${payment._id}`}
                            type="number"
                            step="0.01"
                            min="0"
                            max={payment.amount}
                            defaultValue={payment.remainingAmount}
                            onChange={(e) =>
                              handleEditAmount(payment._id, e.target.value)
                            }
                          />
                        </div>
                        <div className="flex gap-2">
                          {isEditing && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => handleSavePayment(payment._id)}
                                disabled={isUpdating}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleCancelEdit(payment._id)}
                                disabled={isUpdating}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </>
                          )}
                        </div>
                      </div>

                      {payment.dueDate && (
                        <div className="text-sm text-muted-foreground">
                          Due Date:{" "}
                          {new Date(payment.dueDate).toLocaleDateString()}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={deleteConfirmation.isOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmation({
              payment: null,
              isOpen: false,
              emailConfirmation: "",
            });
          }
        }}
      >
        <DialogContent onPointerDownOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle>Delete Payment</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this payment for{" "}
              <strong>{paymentData.student.name}</strong>?
              <br />
              <strong>Payment:</strong> {deleteConfirmation.payment?.feeName} –{" "}
              {deleteConfirmation.payment &&
                formatCurrency(deleteConfirmation.payment.remainingAmount)}
              <br />
              This action cannot be undone. Confirm by entering their email.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="email-confirm">Student Email</Label>
            <Input
              id="email-confirm"
              type="email"
              placeholder={paymentData.student.email}
              value={deleteConfirmation.emailConfirmation}
              onChange={(e) =>
                setDeleteConfirmation((prev) => ({
                  ...prev,
                  emailConfirmation: e.target.value,
                }))
              }
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() =>
                setDeleteConfirmation({
                  payment: null,
                  isOpen: false,
                  emailConfirmation: "",
                })
              }
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteConfirm}
              disabled={
                isDeleting ||
                deleteConfirmation.emailConfirmation.toLowerCase() !==
                  paymentData.student.email.toLowerCase()
              }
              variant="destructive"
            >
              {isDeleting ? "Deleting..." : "Delete Payment"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
