/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client";

import type React from "react";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { usePaginatedQuery, useQuery } from "convex/react";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";
import { usePayments } from "../hooks/use-payment";
import { type Id } from "~/_generated/dataModel";
import { useDomain } from "@/context/DomainContext";
import { api } from "~/_generated/api";
import { toast } from "sonner";

export function PaymentForm({ schoolId }: { schoolId: Id<"schools"> }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { createPayment } = usePayments(schoolId);
  //   search for the student if needed
  const [studentSearch, setStudentSearch] = useState("");
  //   search for the class if needed
  const [classSearch, setClassSearch] = useState("");
  const [selectedAcademicYear, setSelectedAcademicYear] =
    useState<Id<"academicConfig">>();
  const { domain } = useDomain();
  const [selectedClass, setSelectedClass] = useState<any>(null);
  // Get students
  const {
    results: students,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.queries.student.getStudentsWithPagination,
    domain ? { domain, search: studentSearch } : "skip",
    { initialNumItems: 12 },
  );

  // *GET THE CURRENT ACADEMIC YEAR
  const currentYear = useQuery(api.queries.school.getCurrentAcademicYear, {
    schoolId,
  });

  // *get all academic years and current year
  const academicYears = useQuery(api.queries.school.getAllAcademicYears, {
    schoolId,
  });

  //*Get the academic config by Id
  const currentSelectedAcademicYear = useQuery(
    api.queries.school.getAcademicConfigById,
    selectedAcademicYear && schoolId
      ? {
          academicConfigId: selectedAcademicYear,
          schoolId,
        }
      : "skip",
  );

  // get the classes in the school
  const {
    results: classes,
    status: classesStatus,
    loadMore: classesLoadMore,
  } = usePaginatedQuery(
    api.queries.class.getClassesData,
    domain ? { domain, search: classSearch } : "skip",
    { initialNumItems: 12 },
  );

  // *THE FORM DATA FOR THE PAYMENT
  const [formData, setFormData] = useState({
    studentId: "" as Id<"users">,
    classId: "" as Id<"classes">,
    academicYear: currentYear?.academicYear ?? "",
    termId:
      currentSelectedAcademicYear?.currentTerm?.termNumber ??
      currentYear?.currentTerm?.termNumber ??
      1,
    amount: 0,
    feeId: "",
    feeName: "",
    paymentDate: new Date().toISOString().split("T")[0]!,
    paymentMethod: "cash" as "cash" | "transfer" | "card" | "pos" | "cheque",
    isInstallment: false,
    installmentNumber: 1,
    totalInstallments: 3,
    description: "",
  });

  console.log("the studentId", formData.studentId);

  // * GET THE OUTSTANDING PAYMENTS FOR THE SELECTED STUDENT
  const outstandingStudentPayment = useQuery(
    api.queries.fees.getOutstandingPaymentsForStudent,
    formData.studentId !== "" &&
      formData.classId !== "" &&
      formData.academicYear !== "" &&
      formData.feeId !== ""
      ? {
          studentId: formData.studentId,
          classId: formData.classId,
          academicYear: formData.academicYear,
          termId: formData.termId,
          feeId: formData.feeId,
          feeName: formData.feeName,
        }
      : "skip",
  );

  // console.log(
  //   "this is the outstanding payments for the selected student",
  //   outstandingStudentPayment,
  //   formData,
  // );

  // * USE EFFECT TO SET THE FORM DATA WITH THE AMOUNT THE STUDENT OWES
  useEffect(() => {
    if (outstandingStudentPayment?.amount) {
      setFormData((prev) => ({
        ...prev,
        amount: outstandingStudentPayment?.remainingAmount ?? 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        amount: 0,
      }));
    }
  }, [outstandingStudentPayment]);

  useEffect(() => {
    setFormData({
      ...formData,
      academicYear: currentYear?.academicYear ?? "",
      termId: currentYear?.currentTerm?.termNumber ?? 1,
    });
    setSelectedAcademicYear(currentYear?._id ?? undefined);
  }, [currentYear]);

  // *THIS IS THE CLASS FEE STRUCTURE , TO GET THE CURRENT SELECTED CLASS FEE STRUCTURE
  const classFeeStructureQuery = useQuery(
    api.queries.fees.getClassFeeStructure,
    {
      classId: formData.classId,
      academicYear: formData.academicYear,
      termId: formData.termId,
    },
  );

  useEffect(() => {
    if (formData.classId) {
      setSelectedClass(classFeeStructureQuery);
    } else {
      setSelectedClass(null);
    }
  }, [
    formData.classId,
    formData.academicYear,
    formData.termId,
    classFeeStructureQuery,
  ]);

  // console.log("selected class", selectedClass)

  // *FUNCTION TO ADD A PAYMENT FOR THE STUDENT
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.amount <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if ((outstandingStudentPayment?.remainingAmount ?? 0) < formData.amount) {
      toast.error(
        `Amount being paid cannot be more than student's outstanding payment of ${outstandingStudentPayment?.remainingAmount ?? 0}`,
      );
      return;
    }
    setLoading(true);

    try {
      await createPayment({
        ...formData,
        schoolId,
        amount: Number(formData.amount),
      });
      setOpen(false);
      setFormData({
        ...formData,
        studentId: "" as Id<"users">,
        amount: 0,
        feeId: "",
        feeName: "",
        description: "",
      });
    } catch (error) {
      console.error("Failed to create payment:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="">
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Record New Payment</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* //* CHOOSE A STUDENT */}
            <div className="grid gap-2">
              <Label>Student</Label>
              <Select
                value={formData.studentId}
                onValueChange={(value) => {
                  const student = students?.find((s) => s._id === value);
                  setFormData((prev) => ({
                    ...prev,
                    studentId: value as Id<"users">,
                    classId:
                      student?.currentClass?._id ?? ("" as Id<"classes">),
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students?.map((student) => (
                    <SelectItem key={student._id} value={student._id}>
                      {student.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Class</Label>
              <Select
                value={formData.classId}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    classId: value as Id<"classes">,
                    feeId: "",
                    feeName: "",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select class" />
                </SelectTrigger>
                <SelectContent>
                  {classes?.map((class_) => (
                    <SelectItem key={class_._id} value={class_._id}>
                      {class_.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* //* SELECT THE ACADEMIC YEAR OF THE PAYMENT */}
            <div className="grid gap-2">
              <Label>Academic Year</Label>
              <Select
                value={formData.academicYear}
                onValueChange={(value) => {
                  setFormData((prev) => ({
                    ...prev,
                    academicYear: value,
                    termId: 1, // Reset term when academic year changes
                    feeId: "",
                    feeName: "",
                  }));
                  //TODO: add the id of the selected academic year to the selectedAcademicYear state
                  const selectedYear = academicYears?.find(
                    (year) => year.academicYear === value,
                  );
                  setSelectedAcademicYear(selectedYear?._id);
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder={formData?.academicYear} />
                </SelectTrigger>
                <SelectContent>
                  {academicYears?.map((academicYear) => (
                    <SelectItem
                      key={academicYear._id}
                      value={academicYear.academicYear}
                    >
                      {academicYear.academicYear}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {/* //////// */}

            <div className="grid gap-2">
              <Label>Term</Label>
              <Select
                value={formData.termId.toString()}
                disabled={!selectedAcademicYear}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    termId: Number.parseInt(value),
                    feeId: "",
                    feeName: "",
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select term" />
                </SelectTrigger>
                <SelectContent>
                  {currentSelectedAcademicYear?.terms.map((term) => (
                    <SelectItem
                      key={term.termNumber}
                      value={term.termNumber.toString()}
                    >
                      {term.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* //* This is the Fee Type */}
            <div className="grid gap-2">
              <Label>Fee Type</Label>
              <Select
                value={formData.feeId}
                onValueChange={(value) => {
                  if (!formData.studentId) {
                    toast.error("Please select a student first");
                    return;
                  }
                  const fee = selectedClass?.fees.find(
                    (f: { id: string }) => f.id === value,
                  );
                  setFormData((prev) => ({
                    ...prev,
                    feeId: value,
                    feeName: fee?.name ?? "",
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fee type" />
                </SelectTrigger>
                <SelectContent>
                  {selectedClass?.fees.map(
                    (fee: {
                      id: React.Key | null | undefined;
                      name:
                        | string
                        | number
                        | bigint
                        | boolean
                        | React.ReactElement<
                            any,
                            string | React.JSXElementConstructor<any>
                          >
                        | Iterable<React.ReactNode>
                        | React.ReactPortal
                        | Promise<React.AwaitedReactNode>
                        | null
                        | undefined;
                      amount: {
                        toLocaleString: () =>
                          | string
                          | number
                          | bigint
                          | boolean
                          | React.ReactElement<
                              any,
                              string | React.JSXElementConstructor<any>
                            >
                          | Iterable<React.ReactNode>
                          | React.ReactPortal
                          | Promise<React.AwaitedReactNode>
                          | null
                          | undefined;
                      };
                    }) => (
                      <SelectItem key={fee.id} value={String(fee.id)}>
                        {fee.name} - ₦{Number(fee.amount).toLocaleString()}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label>Amount</Label>
              <Input
                type="number"
                disabled={!formData.feeId || !formData.studentId}
                value={formData.amount}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    amount: Number.parseFloat(e.target.value),
                  }))
                }
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label>Payment Date</Label>
              <Input
                type="date"
                value={formData.paymentDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentDate: e.target.value,
                  }))
                }
              />
            </div>

            <div className="grid gap-2">
              <Label>Payment Method</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value: any) =>
                  setFormData((prev) => ({
                    ...prev,
                    paymentMethod: value,
                  }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select payment method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                  <SelectItem value="card">Card Payment</SelectItem>
                  <SelectItem value="pos">POS</SelectItem>
                  <SelectItem value="cheque">Cheque</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border p-4">
            <div className="space-y-0.5">
              <Label>Installment Payment</Label>
              <p className="text-sm text-gray-500">
                Enable if this is part of an installment plan
              </p>
            </div>
            <Switch
              checked={formData.isInstallment}
              onCheckedChange={(checked) =>
                setFormData((prev) => ({
                  ...prev,
                  isInstallment: checked,
                }))
              }
            />
          </div>

          {formData.isInstallment && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="grid gap-2">
                <Label>Installment Number</Label>
                <Input
                  type="number"
                  min="1"
                  value={formData.installmentNumber}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      installmentNumber: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>

              <div className="grid gap-2">
                <Label>Total Installments</Label>
                <Input
                  type="number"
                  min="2"
                  value={formData.totalInstallments}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      totalInstallments: Number.parseInt(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
          )}

          <div className="grid gap-2">
            <Label>Description</Label>
            <Input
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Optional payment description"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Recording Payment..." : "Record Payment"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
