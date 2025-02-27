/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
"use client"

import { useState } from "react"
import { FileDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { type Id } from "~/_generated/dataModel"
import { usePayments } from "../hooks/use-payment"

export function TransactionTable({ schoolId }: { schoolId: Id<"schools"> }) {
    const [currentPage, setCurrentPage] = useState(1)
    const { payments, filters, setFilters } = usePayments(schoolId)

    if (!payments) {
        return (
            <div className="w-full">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="text-[#11321F]">Transaction Id</TableHead>
                                <TableHead className="text-[#11321F]">Date</TableHead>
                                <TableHead className="text-[#11321F]">Student</TableHead>
                                <TableHead className="text-[#11321F]">Amount</TableHead>
                                <TableHead className="text-[#11321F]">Method</TableHead>
                                <TableHead className="text-[#11321F]">Status</TableHead>
                                <TableHead className="text-[#11321F]">Receipt</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {[...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    {[...Array(7)].map((_, j) => (
                                        <TableCell key={j}>
                                            <Skeleton className="h-6 w-full" />
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        )
    }

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-[#11321F]">Transaction Id</TableHead>
                            <TableHead className="text-[#11321F]">Date</TableHead>
                            <TableHead className="text-[#11321F]">Student</TableHead>
                            <TableHead className="text-[#11321F]">Amount</TableHead>
                            <TableHead className="text-[#11321F]">Method</TableHead>
                            <TableHead className="text-[#11321F]">Status</TableHead>
                            <TableHead className="text-[#11321F]">Receipt</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {payments?.payments?.map((payment) => (
                            <TableRow key={payment._id}>
                                <TableCell>{payment._id}</TableCell>
                                <TableCell>{new Date(payment.paymentDate).toLocaleDateString()}</TableCell>
                                <TableCell>{payment.student?.name ?? "Unknown"}</TableCell>
                                <TableCell>₦{payment.amount}</TableCell>
                                <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                                <TableCell>
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${payment.status === "success"
                                                ? "bg-green-100 text-green-800"
                                                : payment.status === "pending"
                                                    ? "bg-blue-100 text-blue-800"
                                                    : "bg-red-100 text-red-800"
                                            }`}
                                    >
                                        {payment.status}
                                    </span>
                                </TableCell>
                                <TableCell>
                                    <Button variant="ghost" size="icon">
                                        <FileDown className="h-4 w-4" />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <div className="flex items-center justify-between px-4 py-4">
                <div className="invisible"></div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="default"
                        size="icon"
                        className="bg-[#2E8B57] hover:bg-[#2E8B57]/90"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {[1, 2, 3, 4].map((number) => (
                        <Button
                            key={number}
                            variant={currentPage === number ? "default" : "outline"}
                            size="icon"
                            className={currentPage === number ? "bg-[#2E8B57] hover:bg-[#2E8B57]/90" : ""}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </Button>
                    ))}
                    <span className="mx-2">...</span>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(29)}>
                        29
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setCurrentPage(30)}>
                        30
                    </Button>
                    <Button
                        variant="default"
                        size="icon"
                        className="bg-[#2E8B57] hover:bg-[#2E8B57]/90"
                        onClick={() => setCurrentPage(Math.min(30, currentPage + 1))}
                        disabled={currentPage === 30}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <Button variant="outline" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Export
                </Button>
            </div>
        </div>
    )
}

