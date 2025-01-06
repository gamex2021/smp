'use client'

import { useState } from 'react'
import { FileDown, ChevronLeft, ChevronRight } from 'lucide-react'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"

interface Transaction {
    id: string
    date: string
    reason: string
    method: string
    source: string
    status: string
}

interface TransactionTableProps {
    initialData: Transaction[]
}

export function TransactionTable({ initialData }: TransactionTableProps) {
    const [currentPage, setCurrentPage] = useState(1)
    const totalPages = 30
    const pageNumbers = [1, 2, 3, 4]

    return (
        <div className="w-full">
            <div className="overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className='text-[#11321F]'>Transaction Id</TableHead>
                            <TableHead className='text-[#11321F]'>Date</TableHead>
                            <TableHead className='text-[#11321F]'>Reason</TableHead>
                            <TableHead className='text-[#11321F]'>Method</TableHead>
                            <TableHead className='text-[#11321F]'>Source</TableHead>
                            <TableHead className='text-[#11321F]'>Status</TableHead>
                            <TableHead className='text-[#11321F]'>Receipt</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {initialData.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.id}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell>{transaction.reason}</TableCell>
                                <TableCell>{transaction.method}</TableCell>
                                <TableCell>{transaction.source}</TableCell>
                                <TableCell>{transaction.status}</TableCell>
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
                <div className='invisible'></div>
                <div className="flex items-center gap-1">
                    <Button
                        variant="default"
                        size="icon"
                        className="bg-[#2E8B57] hover:bg-[#2E8B57]/90"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    {pageNumbers.map((number) => (
                        <Button
                            key={number}
                            variant={currentPage === number ? 'default' : 'outline'}
                            size="icon"
                            className={currentPage === number ? 'bg-[#2E8B57] hover:bg-[#2E8B57]/90' : ''}
                            onClick={() => setCurrentPage(number)}
                        >
                            {number}
                        </Button>
                    ))}
                    <span className="mx-2">...</span>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(29)}
                    >
                        29
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(30)}
                    >
                        30
                    </Button>
                    <Button
                        variant="default"
                        size="icon"
                        className="bg-[#2E8B57] hover:bg-[#2E8B57]/90"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>

                <Button variant="outline" className="gap-2">
                    <FileDown className="h-4 w-4" />
                    Import Sheet
                </Button>
            </div>
        </div>
    )
}

