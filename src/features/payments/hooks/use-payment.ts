/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { type Id } from "~/_generated/dataModel";
import { api } from "~/_generated/api";
import { toast } from "sonner";

type PaymentDataType = {
  studentId: Id<"users">;
  classId: Id<"classes">;
  schoolId: Id<"schools">;
  academicYear: string;
  termId: number;
  amount: number;
  feeId: string;
  feeName: string;
  paymentDate: string;
  paymentMethod: "cash" | "transfer" | "card" | "pos" | "cheque";
  isInstallment: boolean;
  installmentNumber: number;
  totalInstallments: number;
  description: string;
};

type InstallmentDataType = {
  schoolId: Id<"schools">;
  studentId: Id<"users">;
  outstandingPaymentId: Id<"outstandingPayments">;
  amount: number;
  paymentDate: string;
  description: string | undefined;
  paymentMethod: "cash" | "transfer" | "card" | "pos" | "cheque";
};
export function usePayments(schoolId: Id<"schools">) {
  const [filters, setFilters] = useState({
    academicYear: undefined as string | undefined,
    termId: undefined as number | undefined,
    classId: undefined as Id<"classes"> | undefined,
    status: undefined as "success" | "pending" | "failed" | undefined,
    startDate: undefined as string | undefined,
    endDate: undefined as string | undefined,
    receiptNumber: undefined as string | undefined,
  });

  // Queries
  const payments = useQuery(api.queries.payment.getPayments, {
    schoolId,
    filters,
    numItems: 10,
  });

  const metrics = useQuery(api.queries.payment.getPaymentMetrics, {
    schoolId,
    academicYear: filters.academicYear,
    termId: filters.termId,
  });

  const outstandingPayments = useQuery(
    api.queries.fees.getOutstandingPayments,
    {
      schoolId,
      academicYear: filters.academicYear,
      termId: filters.termId,
      classId: filters.classId,
    },
  );

  // Mutations
  const createPayment = useMutation(api.mutations.payment.createPayment);
  const updatePaymentStatus = useMutation(
    api.mutations.payment.updatePaymentStatus,
  );
  const recordInstallment = useMutation(
    api.mutations.payment.recordInstallment,
  );
  const sendReminder = useAction(api.actions.notifications.sendPaymentReminder);

  // Actions
  const handleCreatePayment = async (paymentData: PaymentDataType) => {
    try {
      console.log("the paymentData", paymentData)
      const result = await createPayment(paymentData);
      toast.success("Payment recorded successfully");
      return result;
    } catch (error) {
      toast.error("Failed to record payment");
      throw error;
    }
  };

  const handleInstallmentPayment = async (
    installmentData: InstallmentDataType,
  ) => {
    try {
      const result = await recordInstallment(installmentData);
      toast.success("Installment payment recorded successfully");
      return result;
    } catch (error) {
      toast.error("Failed to record installment payment");
      throw error;
    }
  };

  const handleSendReminder = async (
    studentId: Id<"users">,
    outstandingId: Id<"outstandingPayments">,
  ) => {
    try {
      await sendReminder({
        studentId,
        outstandingPaymentId: outstandingId,
      });
      toast.success("Payment reminder sent successfully");
    } catch (error) {
      toast.error("Failed to send reminder");
      throw error;
    }
  };

  return {
    // Data
    payments,
    metrics,
    outstandingPayments,
    filters,

    // Actions
    setFilters,
    createPayment: handleCreatePayment,
    updatePaymentStatus,
    recordInstallment: handleInstallmentPayment,
    sendReminder: handleSendReminder,
  };
}
