"use client";

import { useState, useMemo, useCallback } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CalendarDays, DollarSign, AlertCircle } from "lucide-react";
import { useQuery } from "convex/react";
import { api } from "~/_generated/api";
import type { Id } from "~/_generated/dataModel";

interface FeeItem {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
  isCompulsory: boolean;
  description?: string;
  allowsInstallment: boolean;
  reminderDays: number[];
}

interface TermFeeStructure {
  termId: number;
  termName: string;
  fees: FeeItem[];
}

interface SelectedPayment {
  termId: number;
  termName: string;
  feeId: string;
  feeName: string;
  originalAmount: number;
  proratedAmount: number;
  dueDate: string;
  isCompulsory: boolean;
}

interface OutstandingPaymentSelectorProps {
  classId: Id<"classes"> | undefined;
  schoolId: Id<"schools"> | undefined;
  academicYear: string | undefined;
  terms: Array<{ termNumber: number; name: string; status: string }>;
  onPaymentsChange: (payments: SelectedPayment[]) => void;
}

export function OutstandingPaymentSelector({
  classId,
  schoolId,
  academicYear,
  terms,
  onPaymentsChange,
}: OutstandingPaymentSelectorProps) {
  const [selectedTerms, setSelectedTerms] = useState<Set<number>>(new Set());
  const [selectedPayments, setSelectedPayments] = useState<SelectedPayment[]>(
    [],
  );

  // Get fee structures for all selected terms
  const termFeeStructures = useMemo(() => {
    const structures: TermFeeStructure[] = [];

    selectedTerms.forEach((termId) => {
      const term = terms.find((t) => t.termNumber === termId);
      if (term) {
        structures.push({
          termId,
          termName: term.name,
          fees: [], // Will be populated by individual queries
        });
      }
    });

    return structures;
  }, [selectedTerms, terms]);

  const handleTermToggle = (termId: number) => {
    const newSelectedTerms = new Set(selectedTerms);

    if (newSelectedTerms.has(termId)) {
      newSelectedTerms.delete(termId);
      // Remove all payments for this term
      const updatedPayments = selectedPayments.filter(
        (p) => p.termId !== termId,
      );
      setSelectedPayments(updatedPayments);
      onPaymentsChange(updatedPayments);
    } else {
      newSelectedTerms.add(termId);
    }
    
    console.log("here", newSelectedTerms)
    setSelectedTerms(newSelectedTerms);
  };

  const handleFeeToggle = useCallback(
    (termId: number, termName: string, fee: FeeItem, isSelected: boolean) => {
      setSelectedPayments((prev) => {
        let updatedPayments = [...prev];

        if (isSelected) {
          updatedPayments.push({
            termId,
            termName,
            feeId: fee.id,
            feeName: fee.name,
            originalAmount: fee.amount,
            proratedAmount: fee.amount,
            dueDate: fee.dueDate,
            isCompulsory: fee.isCompulsory,
          });
        } else {
          updatedPayments = updatedPayments.filter(
            (p) => !(p.termId === termId && p.feeId === fee.id),
          );
        }

        onPaymentsChange(updatedPayments);
        return updatedPayments;
      });
    },
    [onPaymentsChange],
  );

  const handleProratedAmountChange = useCallback(
    (termId: number, feeId: string, amount: number) => {
      setSelectedPayments((prev) => {
        const updatedPayments = prev.map((payment) => {
          if (payment.termId === termId && payment.feeId === feeId) {
            return { ...payment, proratedAmount: amount };
          }
          return payment;
        });

        onPaymentsChange(updatedPayments);
        return updatedPayments;
      });
    },
    [onPaymentsChange],
  );
  const getTotalAmount = () => {
    return selectedPayments.reduce(
      (total, payment) => total + payment.proratedAmount,
      0,
    );
  };

  const selectedFeesMap = useMemo(() => {
    const map = new Map<number, SelectedPayment[]>();
    for (const payment of selectedPayments) {
      if (!map.has(payment.termId)) {
        map.set(payment.termId, []);
      }
      map.get(payment.termId)!.push(payment);
    }
    return map;
  }, [selectedPayments]);

  if (!classId || !academicYear || terms.length === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span>
              Please select a class first to configure outstanding payments
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Outstanding Payments Configuration
          </CardTitle>
          <CardDescription>
            Select terms and fees to create outstanding payments for this
            student
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Term Selection */}
          <div>
            <Label className="text-sm font-medium">Select Terms</Label>
            <div className="mt-2 grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3">
              {terms.map((term) => (
                <div
                  key={term.termNumber}
                  className={`flex cursor-pointer items-center space-x-2 rounded-lg border p-3 transition-colors ${
                    selectedTerms.has(term.termNumber)
                      ? "border-primary bg-primary/10"
                      : "hover:bg-muted/50"
                  }`}
                  onClick={() => handleTermToggle(term.termNumber)}
                >
                  {/* <Checkbox
                    checked={selectedTerms.has(term.termNumber)}
                    onChange={undefined}
                  /> */}
                  <div className="flex-1">
                    <div className="font-medium">{term.name}</div>
                    <Badge
                      variant={
                        term.status === "active" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {term.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fee Structure for Selected Terms */}
          {selectedTerms.size > 0 && (
            <div className="space-y-4">
              <Separator />
              <div>
                <Label className="text-sm font-medium">Configure Fees</Label>
                <ScrollArea className="mt-2 h-[400px]">
                  <Accordion type="multiple" className="w-full space-y-2">
                    {Array.from(selectedTerms).map((termId) => (
                      <TermFeeSelector
                        key={termId}
                        termId={termId}
                        termName={
                          terms.find((t) => t.termNumber === termId)?.name ?? ""
                        }
                        classId={classId}
                        academicYear={academicYear}
                        selectedFees={selectedFeesMap.get(termId) ?? []}
                        onFeeToggle={handleFeeToggle}
                        onProratedAmountChange={handleProratedAmountChange}
                      />
                    ))}
                  </Accordion>
                </ScrollArea>
              </div>
            </div>
          )}

          {/* Summary */}
          {selectedPayments.length > 0 && (
            <div className="space-y-2">
              <Separator />
              <div className="flex items-center justify-between">
                <span className="font-medium">Total Outstanding Amount:</span>
                <span className="text-lg font-bold text-primary">
                  ${getTotalAmount().toFixed(2)}
                </span>
              </div>
              <div className="text-sm text-muted-foreground">
                {selectedPayments.length} fee(s) selected across{" "}
                {selectedTerms.size} term(s)
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface TermFeeSelectorProps {
  termId: number;
  termName: string;
  classId: Id<"classes">;
  academicYear: string;
  selectedFees: SelectedPayment[];
  onFeeToggle: (
    termId: number,
    termName: string,
    fee: FeeItem,
    isSelected: boolean,
  ) => void;
  onProratedAmountChange: (
    termId: number,
    feeId: string,
    amount: number,
  ) => void;
}

function TermFeeSelector({
  termId,
  termName,
  classId,
  academicYear,
  selectedFees,
  onFeeToggle,
  onProratedAmountChange,
}: TermFeeSelectorProps) {
  const classFeeStructure = useQuery(api.queries.fees.getClassFeeStructure, {
    classId,
    termId,
    academicYear,
  });

  const fees = classFeeStructure?.fees ?? [];

  return (
    <AccordionItem value={`term-${termId}`} className="rounded-lg border">
      <AccordionTrigger className="px-4 py-3 hover:no-underline">
        <div className="mr-4 flex w-full items-center justify-between">
          <div className="text-left">
            <div className="font-medium">{termName}</div>
            <div className="text-sm text-muted-foreground">
              {fees.length} fee(s) available • {selectedFees.length} selected
            </div>
          </div>
          <div className="flex items-center gap-2">
            {selectedFees.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                $
                {selectedFees
                  .reduce((sum, fee) => sum + fee.proratedAmount, 0)
                  .toFixed(2)}
              </Badge>
            )}
          </div>
        </div>
      </AccordionTrigger>

      <AccordionContent className="px-4 pb-4">
        <div className="space-y-3">
          {fees.length === 0 ? (
            <div className="py-4 text-center text-muted-foreground">
              <AlertCircle className="mx-auto mb-2 h-8 w-8" />
              <p>No fee structure found for this term</p>
              <p className="text-sm">Please set up the fee structure first</p>
            </div>
          ) : (
            fees.map((fee) => {
              const isSelected = selectedFees.some((sf) => sf.feeId === fee.id);
              const selectedFee = selectedFees.find(
                (sf) => sf.feeId === fee.id,
              );

              return (
                <div key={fee.id} className="space-y-2">
                  <div className="flex items-start space-x-3 rounded-lg border p-3">
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={(checked) =>
                        onFeeToggle(termId, termName, fee, checked as boolean)
                      }
                    />
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">{fee.name}</div>
                          {fee.description && (
                            <div className="text-sm text-muted-foreground">
                              {fee.description}
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="font-medium">
                            ${fee.amount.toFixed(2)}
                          </div>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <CalendarDays className="h-3 w-3" />
                            {new Date(fee.dueDate).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {fee.isCompulsory && (
                          <Badge variant="destructive" className="text-xs">
                            Compulsory
                          </Badge>
                        )}
                        {fee.allowsInstallment && (
                          <Badge variant="outline" className="text-xs">
                            Installment Available
                          </Badge>
                        )}
                      </div>

                      {isSelected && (
                        <div className="space-y-2 border-t pt-2">
                          <Label className="text-sm">Prorated Amount</Label>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="number"
                              min="0"
                              max={fee.amount}
                              step="0.01"
                              value={selectedFee?.proratedAmount ?? fee.amount}
                              onChange={(e) =>
                                onProratedAmountChange(
                                  termId,
                                  fee.id,
                                  Number.parseFloat(e.target.value) || 0,
                                )
                              }
                              className="w-32"
                            />
                            <span className="text-sm text-muted-foreground">
                              of ${fee.amount.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
