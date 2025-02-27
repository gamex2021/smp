/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useQuery } from "convex/react"
import { Switch } from "@/components/ui/switch"
import { Plus } from "lucide-react"
import { usePayments } from "../hooks/use-payment"
import { type Id } from "~/_generated/dataModel"
import { useDomain } from "@/context/DomainContext"
import { api } from "~/_generated/api"

export function PaymentForm({ schoolId }: { schoolId: Id<"schools"> }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const { createPayment } = usePayments(schoolId)

    const { domain } = useDomain()
    // Get students
    const students = useQuery(api.queries.student.getStudentsWithPagination, {
        domain,
        numItems: 100,
    })
    const currentYear = useQuery(api.queries.school.getCurrentAcademicYear, { schoolId })
    // get the classes in the school
    const classes = useQuery(api.queries.class.getClassesData, {
        domain,
    });


    const [formData, setFormData] = useState({
        studentId: "" as Id<"users">,
        classId: "" as Id<"classes">,
        academicYear: currentYear?.academicYear ?? "",
        termId: currentYear?.currentTerm?.termNumber ?? 1,
        amount: 0,
        feeId: "",
        feeName: "",
        paymentDate: new Date().toISOString().split("T")[0]!,
        paymentMethod: "cash" as "cash" | "transfer" | "card" | "pos" | "cheque",
        isInstallment: false,
        installmentNumber: 1,
        totalInstallments: 3,
        description: "",
    })

    useEffect(() => {
        setFormData({
            ...formData,
            academicYear: currentYear?.academicYear ?? "",
            termId: currentYear?.currentTerm?.termNumber ?? 1,
        })
    }, [currentYear])

    const [selectedClass, setSelectedClass] = useState<any>(null)

    const classFeeStructureQuery = useQuery(api.queries.fees.getClassFeeStructure, {
        classId: formData.classId,
        academicYear: formData.academicYear,
        termId: formData.termId,
    });

    useEffect(() => {
        if (formData.classId) {
            setSelectedClass(classFeeStructureQuery)
        } else {
            setSelectedClass(null)
        }
    }, [formData.classId, formData.academicYear, formData.termId, classFeeStructureQuery])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            await createPayment({
                ...formData,
                schoolId,
                amount: Number(formData.amount),
            })
            setOpen(false)
            setFormData({
                ...formData,
                studentId: "" as Id<"users">,
                amount: 0,
                feeId: "",
                feeName: "",
                description: "",
            })
        } catch (error) {
            console.error("Failed to create payment:", error)
        } finally {
            setLoading(false)
        }
    }

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
                        <div className="grid gap-2">
                            <Label>Student</Label>
                            <Select
                                value={formData.studentId}
                                onValueChange={(value) => {
                                    const student = students?.students?.find((s) => s._id === value)
                                    setFormData((prev) => ({
                                        ...prev,
                                        studentId: value as Id<"users">,
                                        classId: student?.currentClass?._id ?? "" as Id<"classes">,
                                    }))
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select student" />
                                </SelectTrigger>
                                <SelectContent>
                                    {students?.students?.map((student) => (
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
                        <div className="grid gap-2">
                            <Label>Academic Year</Label>
                            <Input value={formData.academicYear} disabled />
                        </div>

                        <div className="grid gap-2">
                            <Label>Term</Label>
                            <Select
                                value={formData.termId.toString()}
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
                                    {currentYear?.terms.map((term) => (
                                        <SelectItem key={term.termNumber} value={term.termNumber.toString()}>
                                            {term.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Fee Type</Label>
                            <Select
                                value={formData.feeId}
                                onValueChange={(value) => {
                                    const fee = selectedClass?.fees.find((f: { id: string }) => f.id === value)
                                    setFormData((prev) => ({
                                        ...prev,
                                        feeId: value,
                                        feeName: fee?.name ?? "",
                                        amount: fee?.amount ?? 0,
                                    }))
                                }}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select fee type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {selectedClass?.fees.map((fee: { id: React.Key | null | undefined; name: string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined; amount: { toLocaleString: () => string | number | bigint | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | Promise<React.AwaitedReactNode> | null | undefined } }) => (
                                        <SelectItem key={fee.id} value={String(fee.id)}>
                                            {fee.name} - ₦{Number(fee.amount).toLocaleString()}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Amount</Label>
                            <Input
                                type="number"
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
                            <p className="text-sm text-gray-500">Enable if this is part of an installment plan</p>
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
    )
}

