"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { calculateInstallments, formatCurrency } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function InstallmentCalculator() {
    const [formData, setFormData] = useState({
        totalAmount: 0,
        numberOfInstallments: 3,
        minimumFirstPayment: 0,
    })

    const [installments, setInstallments] = useState<number[]>([])

    const handleCalculate = () => {
        const calculated = calculateInstallments(
            formData.totalAmount,
            formData.numberOfInstallments,
            formData.minimumFirstPayment,
        )
        setInstallments(calculated)
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Installment Calculator</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="grid gap-4 sm:grid-cols-3">
                        <div className="grid gap-2">
                            <Label>Total Amount</Label>
                            <Input
                                type="number"
                                value={formData.totalAmount}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        totalAmount: Number(e.target.value),
                                    }))
                                }
                                placeholder="Enter total amount"
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Number of Installments</Label>
                            <Input
                                type="number"
                                min="2"
                                max="12"
                                value={formData.numberOfInstallments}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        numberOfInstallments: Number(e.target.value),
                                    }))
                                }
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label>Minimum First Payment</Label>
                            <Input
                                type="number"
                                value={formData.minimumFirstPayment}
                                onChange={(e) =>
                                    setFormData((prev) => ({
                                        ...prev,
                                        minimumFirstPayment: Number(e.target.value),
                                    }))
                                }
                                placeholder="Enter minimum first payment"
                            />
                        </div>
                    </div>

                    <Button onClick={handleCalculate} className="w-full">
                        Calculate Installments
                    </Button>

                    {installments.length > 0 && (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Installment</TableHead>
                                        <TableHead>Amount</TableHead>
                                        <TableHead>Due Date</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {installments.map((amount, index) => {
                                        const dueDate = new Date()
                                        dueDate.setMonth(dueDate.getMonth() + index)

                                        return (
                                            <TableRow key={index}>
                                                <TableCell>#{index + 1}</TableCell>
                                                <TableCell>₦{formatCurrency(amount)}</TableCell>
                                                <TableCell>{dueDate.toLocaleDateString()}</TableCell>
                                            </TableRow>
                                        )
                                    })}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

