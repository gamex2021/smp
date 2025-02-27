/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarIcon, Plus, Save, Trash2 } from "lucide-react"
import { useMutation, useQuery } from "convex/react"
import { nanoid } from "nanoid"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { type Id } from "~/_generated/dataModel"
import { api } from "~/_generated/api"
import { useDomain } from "@/context/DomainContext"
import { toast } from "sonner"

interface ClassFeeConfigProps {
    schoolId: Id<"schools">
}

export function ClassFeeConfig({ schoolId }: ClassFeeConfigProps) {
    const [selectedClass, setSelectedClass] = useState("")
    const [selectedTerm, setSelectedTerm] = useState<number>(1)
    const { domain } = useDomain()

    const classes = useQuery(api.queries.class.getClassesData, {
        domain,
    });
    const currentYear = useQuery(api.queries.school.getCurrentAcademicYear, { schoolId })
    const feeStructure = useQuery(
        api.queries.fees.getClassFeeStructure,
        selectedClass
            ? {
                classId: selectedClass,
                academicYear: currentYear?.academicYear ?? "",
                termId: selectedTerm,
            }
            : "skip",
    )

    const setFeeStructure = useMutation(api.mutations.fees.setClassFeeStructure)

    const [fees, setFees] = useState<
        Array<{
            id: string
            name: string
            amount: number
            dueDate: string
            isCompulsory: boolean
            description?: string
            allowsInstallment: boolean
            installmentConfig?: {
                minimumFirstPayment: number
                maximumInstallments: number
                installmentDueDates: string[]
            }
            reminderDays: number[]
        }>
    >(feeStructure?.fees ?? [])

    // Update fees when fee structure changes
    useEffect(() => {
        if (feeStructure) {
            setFees(feeStructure.fees)
        }
    }, [feeStructure])

    const handleAddFee = () => {
        setFees((prev) => [
            ...prev,
            {
                id: nanoid(),
                name: "",
                amount: 0,
                dueDate: "",
                isCompulsory: true,
                description: "",
                allowsInstallment: false,
                reminderDays: [7, 3, 1], // Default reminder days
            },
        ])
    }

    const handleRemoveFee = (id: string) => {
        setFees((prev) => prev.filter((fee) => fee.id !== id))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!selectedClass || !currentYear) return

        try {
            await setFeeStructure({
                schoolId,
                classId: selectedClass as Id<"classes">,
                academicYear: currentYear.academicYear,
                termId: selectedTerm,
                fees,
            })

            toast.success("Fee structure updated successfully")
        } catch (error) {
            toast.error("Failed to update fee structure")
        }
    }

    if (!currentYear) {
        return (
            <Alert>
                <AlertDescription>Please configure an academic year first</AlertDescription>
            </Alert>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Class Fee Structure</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="grid gap-2">
                            <Label>Select Class</Label>
                            <Select value={selectedClass} onValueChange={setSelectedClass}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a class" />
                                </SelectTrigger>
                                <SelectContent>
                                    {classes?.map((cls) => (
                                        <SelectItem key={cls._id} value={cls._id}>
                                            {cls.title}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="grid gap-2">
                            <Label>Select Term</Label>
                            <Select
                                value={selectedTerm.toString()}
                                onValueChange={(value) => setSelectedTerm(Number.parseInt(value))}
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

                    <div className="space-y-4">
                        {fees.map((fee) => (
                            <div key={fee.id} className="rounded-lg border p-4 space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="font-medium">Fee Details</h4>
                                    <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveFee(fee.id)}>
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Fee Name</Label>
                                        <Input
                                            value={fee.name}
                                            onChange={(e) => {
                                                const newFees = fees.map((f) => (f.id === fee.id ? { ...f, name: e.target.value } : f))
                                                setFees(newFees.map(f => ({
                                                    ...f,
                                                    installmentConfig: f.installmentConfig ? {
                                                        ...f.installmentConfig,
                                                        maximumInstallments: f.installmentConfig.maximumInstallments ?? 2
                                                    } : undefined
                                                })))
                                            }}
                                            placeholder="e.g., Tuition Fee"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Amount (₦)</Label>
                                        <Input
                                            type="number"
                                            value={fee.amount}
                                            onChange={(e) => {
                                                const newFees = fees.map((f) =>
                                                    f.id === fee.id ? { ...f, amount: Number.parseFloat(e.target.value) } : f,
                                                )
                                                setFees(newFees.map(f => ({
                                                    ...f,
                                                    installmentConfig: f.installmentConfig ? {
                                                        ...f.installmentConfig,
                                                        maximumInstallments: f.installmentConfig.maximumInstallments ?? 2
                                                    } : undefined
                                                })))
                                            }}
                                            placeholder="0.00"
                                        />
                                    </div>
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label>Due Date</Label>
                                        <div className="relative">
                                            <Input
                                                type="date"
                                                value={fee.dueDate}
                                                onChange={(e) => {
                                                    const newFees = fees.map((f) => (f.id === fee.id ? { ...f, dueDate: e.target.value } : f))
                                                    setFees(newFees)
                                                }}
                                            />
                                            <CalendarIcon className="absolute right-3 top-2.5 h-4 w-4 text-gray-500" />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label>Description</Label>
                                        <Input
                                            value={fee.description}
                                            onChange={(e) => {
                                                const newFees = fees.map((f) => (f.id === fee.id ? { ...f, description: e.target.value } : f))
                                                setFees(newFees)
                                            }}
                                            placeholder="Optional description"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Compulsory Fee</Label>
                                        <p className="text-sm text-gray-500">Mark this fee as required for all students</p>
                                    </div>
                                    <Switch
                                        checked={fee.isCompulsory}
                                        onCheckedChange={(checked) => {
                                            const newFees = fees.map((f) => (f.id === fee.id ? { ...f, isCompulsory: checked } : f))
                                            setFees(newFees)
                                        }}
                                    />
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Allow Installment Payments</Label>
                                        <p className="text-sm text-gray-500">Enable payment in installments</p>
                                    </div>
                                    <Switch
                                        checked={fee.allowsInstallment}
                                        onCheckedChange={(checked) => {
                                            const newFees = fees.map((f) => (f.id === fee.id ? { ...f, allowsInstallment: checked } : f))
                                            setFees(newFees)
                                        }}
                                    />
                                </div>

                                {fee.allowsInstallment && (
                                    <div className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-2">
                                            <div className="grid gap-2">
                                                <Label>Minimum First Payment (%)</Label>
                                                <Input
                                                    type="number"
                                                    min="0"
                                                    max="100"
                                                    value={fee.installmentConfig?.minimumFirstPayment ?? 0}
                                                    onChange={(e) => {
                                                        const newFees: any = fees.map((f) =>
                                                            f.id === fee.id
                                                                ? {
                                                                    ...f,
                                                                    installmentConfig: {
                                                                        ...f.installmentConfig,
                                                                        minimumFirstPayment: Number.parseInt(e.target.value) ?? 0,
                                                                    },
                                                                }
                                                                : f,
                                                        )
                                                        setFees(newFees)
                                                    }}
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label>Maximum Installments</Label>
                                                <Input
                                                    type="number"
                                                    min="2"
                                                    max="12"
                                                    value={fee.installmentConfig?.maximumInstallments ?? 2}
                                                    onChange={(e) => {
                                                        const newFees: any = fees.map((f) =>
                                                            f.id === fee.id
                                                                ? {
                                                                    ...f,
                                                                    installmentConfig: {
                                                                        ...f.installmentConfig,
                                                                        maximumInstallments: Number.parseInt(e.target.value) ?? 2,
                                                                    },
                                                                }
                                                                : f,
                                                        )
                                                        setFees(newFees)
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <Label>Payment Reminders (days before due date)</Label>
                                    <div className="flex gap-2">
                                        {[7, 3, 1].map((days) => (
                                            <div key={days} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={fee.reminderDays.includes(days)}
                                                    onChange={(e) => {
                                                        const newFees = fees.map((f) => {
                                                            if (f.id !== fee.id) return f
                                                            return {
                                                                ...f,
                                                                reminderDays: e.target.checked
                                                                    ? [...f.reminderDays, days]
                                                                    : f.reminderDays.filter((d) => d !== days),
                                                            }
                                                        })
                                                        setFees(newFees)
                                                    }}
                                                />
                                                <span className="text-sm">{days} days</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <Button type="button" variant="outline" onClick={handleAddFee} className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add Fee
                        </Button>
                    </div>

                    <Button type="submit" className="w-full">
                        <Save className="h-4 w-4 mr-2" />
                        Save Fee Structure
                    </Button>
                </form>
            </CardContent>
        </Card>
    )
}

