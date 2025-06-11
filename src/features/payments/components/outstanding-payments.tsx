/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import {
  useQuery,
  useMutation,
  useAction,
  usePaginatedQuery,
} from "convex/react";
import { Mail, AlertCircle, UserPlus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { type Id } from "~/_generated/dataModel";
import { useDomain } from "@/context/DomainContext";
import { api } from "~/_generated/api";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import CreateOutstandingForm from "./create-oustanding";
import PaymentActionsDropdown from "../shared/payment-actions-dropdown";
import { PaymentData } from "../types";

export function OutstandingPayments({ schoolId }: { schoolId: Id<"schools"> }) {
  const [selectedStudents, setSelectedStudents] = useState<Id<"users">[]>([]);
  const [filters, setFilters] = useState({
    classId: "all" as Id<"classes"> | "all",
    academicYear: "",
    termId: "all",
  });

  //* search for the class if needed
  const [classSearch, setClassSearch] = useState("");
  const [isCreateOutstandingFormOpen, setIsCreateOutstandingFormOpen] =
    useState(false);
  const { domain } = useDomain();

  // *get the classes in the school
  const {
    results: classes,
    status: classesStatus,
    loadMore: classesLoadMore,
  } = usePaginatedQuery(
    api.queries.class.getClassesData,
    domain ? { domain, search: classSearch } : "skip",
    { initialNumItems: 12 },
  );

  // *get all academic years and current year
  const academicYears = useQuery(api.queries.school.getAllAcademicYears, {
    schoolId,
  });
  const currentYear = useQuery(api.queries.school.getCurrentAcademicYear, {
    schoolId,
  });

  const outstandingPayments = useQuery(
    api.queries.fees.getOutstandingPayments,
    {
      schoolId,
      classId: filters.classId !== "all" ? filters.classId : undefined,
      academicYear: filters.academicYear || undefined,
      termId:
        filters.termId !== "all" ? Number.parseInt(filters.termId) : undefined,
      isCompulsory: true,
    },
  );

  const sendReminder = useAction(api.actions.notifications.sendPaymentReminder);
  const sendBulkReminders = useAction(
    api.actions.notifications.sendBulkPaymentReminders,
  );

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

  const handleSendBulkReminders = async () => {
    if (selectedStudents.length === 0) return;

    try {
      await sendBulkReminders({
        schoolId,
        studentIds: selectedStudents,
        filters: {
          classId: filters.classId !== "all" ? filters.classId : undefined,
          academicYear: filters.academicYear || undefined,
          termId:
            filters.termId !== "all"
              ? Number.parseInt(filters.termId)
              : undefined,
        },
      });
      toast.success(
        `Payment reminders sent to ${selectedStudents.length} students`,
      );
      setSelectedStudents([]);
    } catch (error) {
      toast.error("Failed to send reminders");
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allStudentIds =
        outstandingPayments
          ?.map((payment) => payment.studentId)
          .filter((id, index, self) => self.indexOf(id) === index) ?? [];
      setSelectedStudents(allStudentIds);
    } else {
      setSelectedStudents([]);
    }
  };

  const groupedPayments =
    outstandingPayments?.reduce(
      (acc, payment) => {
        if (!acc[payment.studentId]) {
          acc[payment.studentId] = {
            student: payment.student,
            class: payment.class,
            payments: [],
            totalOutstanding: 0,
          };
        }
        acc[payment.studentId].payments.push(payment);
        acc[payment.studentId].totalOutstanding += payment.remainingAmount;
        return acc;
      },
      {} as Record<Id<"users">, any>,
    ) ?? {};

  console.log(
    "the outstanding payments and the grouped payment",
    groupedPayments,
    outstandingPayments,
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Outstanding Payments</CardTitle>
          {/* //*CREATE AN OUTSTANDING, this will open an outstanding modal*/}
          <div className="flex h-8 w-8 items-center justify-center rounded-full">
            <Dialog
              open={isCreateOutstandingFormOpen}
              onOpenChange={setIsCreateOutstandingFormOpen}
            >
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <UserPlus className="size-5" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#11321f]">
                    Add New Outstanding Payment
                  </DialogTitle>
                  <DialogDescription>
                    Fill in a student&apos;s outstanding information below.
                  </DialogDescription>
                </DialogHeader>
                <ScrollArea className="h-[calc(90vh-10rem)] max-h-[calc(90vh-10rem)] p-3">
                  {/* //TODO: OUTSTANDING CREATE FORM HERE */}
                  <CreateOutstandingForm
                    onClose={() => setIsCreateOutstandingFormOpen(false)}
                  />
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>
          {/* /// */}
          {selectedStudents.length > 0 && (
            <Button onClick={handleSendBulkReminders}>
              <Mail className="mr-2 h-4 w-4" />
              Send Reminders ({selectedStudents.length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <Select
              value={filters.classId}
              onValueChange={(value: Id<"classes">) =>
                setFilters((prev) => ({ ...prev, classId: value }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Filter by class" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Classes</SelectItem>
                {classes?.map((cls) => (
                  <SelectItem key={cls._id} value={cls._id}>
                    {cls.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.academicYear}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, academicYear: value }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select academic year" />
              </SelectTrigger>
              <SelectContent>
                {academicYears?.map((year) => (
                  <SelectItem key={year._id} value={year.academicYear}>
                    {year.academicYear}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={filters.termId}
              onValueChange={(value) =>
                setFilters((prev) => ({ ...prev, termId: value }))
              }
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select term" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                {currentYear?.terms.map((term) => (
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

          {Object.keys(groupedPayments).length > 0 ? (
            <div className="space-y-6">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox
                          checked={
                            selectedStudents.length ===
                            Object.keys(groupedPayments).length
                          }
                          onCheckedChange={handleSelectAll}
                        />
                      </TableHead>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Outstanding Fees</TableHead>
                      <TableHead>Total Outstanding</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(groupedPayments).map(
                      ([studentId, data]) => (
                        <TableRow key={studentId}>
                          <TableCell>
                            <Checkbox
                              checked={selectedStudents.includes(
                                studentId as Id<"users">,
                              )}
                              onCheckedChange={(checked) => {
                                setSelectedStudents((prev) =>
                                  checked
                                    ? [...prev, studentId as Id<"users">]
                                    : prev.filter((id) => id !== studentId),
                                );
                              }}
                            />
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {data.student?.name}
                              </p>
                              <p className="text-sm text-gray-500">
                                {data.student?.email}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>{data.class?.name}</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              {data.payments.map((payment: any) => (
                                <div
                                  key={payment._id}
                                  className="flex items-center gap-2"
                                >
                                  <span className="text-sm">
                                    {payment.feeName}
                                  </span>
                                  <Badge
                                    variant={
                                      payment.status === "overdue"
                                        ? "destructive"
                                        : payment.status === "partial"
                                          ? "outline"
                                          : "secondary"
                                    }
                                  >
                                    ₦{formatCurrency(payment.remainingAmount)}
                                  </Badge>
                                  {payment.status === "overdue" && (
                                    <AlertCircle className="h-4 w-4 text-red-500" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell>
                            ₦{formatCurrency(data.totalOutstanding)}
                          </TableCell>
                          <TableCell>
                            <PaymentActionsDropdown
                              studentId={studentId as Id<"users">}
                              payments={(data as PaymentData) ?? []} // your payments data
                              onSendReminder={() => {
                                // Send reminder for all outstanding payments
                                data.payments.forEach(async (payment: any) => {
                                  await handleSendReminder(
                                    studentId as Id<"users">,
                                    payment._id,
                                  );
                                });
                              }}
                            />
                          </TableCell>
                        </TableRow>
                      ),
                    )}
                  </TableBody>
                </Table>
              </div>

              {outstandingPayments?.some((p) => p.status === "overdue") && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Overdue Payments</AlertTitle>
                  <AlertDescription>
                    Some payments are overdue. Please take immediate action.
                  </AlertDescription>
                </Alert>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-gray-500">
              No outstanding payments found
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
