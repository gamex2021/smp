"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { useQuery } from "convex/react"
import { format } from "date-fns"
import { CalendarIcon, Download, FileDown, Search, X } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { cn } from "@/lib/utils"
import { type Id } from "~/_generated/dataModel"
import { api } from "~/_generated/api"
import { useDomain } from "@/context/DomainContext"

interface PaymentSearchProps {
    schoolId: Id<"schools">
}

export function PaymentSearch({ schoolId }: PaymentSearchProps) {
    const [filters, setFilters] = useState({
        query: "",
        startDate: "",
        endDate: "",
        status: undefined as "success" | "pending" | "failed" | undefined,
        paymentMethod: undefined as "cash" | "transfer" | "card" | "pos" | "cheque" | undefined,
        classId: undefined as Id<"classes"> | undefined,
        receiptNumber: "",
    })

    const [showFilters, setShowFilters] = useState(false)
    const [page, setPage] = useState(1)
    const itemsPerPage = 10
    // Change the state to store the actual cursor
    const [cursor, setCursor] = useState<string>()
    // get the school domain
    const { domain } = useDomain()
    // get the classes in the school
    const classes = useQuery(api.queries.class.getClassesData, {
        domain,
    });
    // get the payments
    const searchResults = useQuery(api.queries.payment.getPayments, {
        schoolId,
        filters: {
            ...filters,
            startDate: filters.startDate || undefined,
            endDate: filters.endDate || undefined,
            status: filters.status ?? undefined,
            classId: filters.classId ?? undefined,
            paymentMethod: filters.paymentMethod ?? undefined,
            receiptNumber: filters.receiptNumber || undefined,
        },
        cursor,
        numItems: itemsPerPage,
    })

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        setCursor(undefined)
        setPage(1)
    }

    const handleReset = () => {
        setFilters({
            query: "",
            startDate: "",
            endDate: "",
            status: undefined,
            paymentMethod: undefined,
            classId: undefined,
            receiptNumber: "",
        })
        setCursor(undefined)
        setPage(1)
    }

    const handleExport = async () => {
        // Generate CSV data
        const csvData = [
            ["Receipt Number", "Date", "Student", "Class", "Amount", "Method", "Status", "Description"],
            ...(searchResults?.payments ?? []).map((payment) => [
                payment.receiptNumber,
                format(new Date(payment.paymentDate), "dd/MM/yyyy"),
                payment.student?.name ?? "Unknown",
                payment.class?.name ?? "Unknown",
                payment.amount.toString(),
                payment.paymentMethod,
                payment.status,
                payment.description ?? "",
            ]),
        ]
            .map((row) => row.join(","))
            .join("\n")

        // Create and download file
        const blob = new Blob([csvData], { type: "text/csv" })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `payments-${format(new Date(), "yyyy-MM-dd")}.csv`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
    }


    // Update the pagination handlers
    const handleNextPage = () => {
        if (searchResults?.continueCursor) {
            setCursor(searchResults.continueCursor)
            setPage((p) => p + 1)
        }
    }

    const handlePreviousPage = () => {
        // We'll need to implement cursor stacking for "previous" functionality
        if (page > 1) {
            setCursor(undefined) // Reset to first page for now
            setPage(1)
        }
    }

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between">
                    <CardTitle>Search Payments</CardTitle>
                    <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
                        {showFilters ? "Hide Filters" : "Show Filters"}
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSearch} className="space-y-4">
                    <div className="flex gap-4">
                        <div className="flex-1">
                            <Input
                                placeholder="Search by receipt number or student name..."
                                value={filters.query}
                                onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                            />
                        </div>
                        <Button type="submit">
                            <Search className="h-4 w-4 mr-2" />
                            Search
                        </Button>
                        <Button type="button" variant="outline" onClick={handleReset}>
                            <X className="h-4 w-4 mr-2" />
                            Reset
                        </Button>
                    </div>

                    {showFilters && (
                        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Date Range</label>
                                <div className="flex gap-2">
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !filters.startDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {filters.startDate ? format(new Date(filters.startDate), "PPP") : "Start date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={filters.startDate ? new Date(filters.startDate) : undefined}
                                                onSelect={(date) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        startDate: date ? format(date, "yyyy-MM-dd") : "",
                                                    }))
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant="outline"
                                                className={cn(
                                                    "w-full justify-start text-left font-normal",
                                                    !filters.endDate && "text-muted-foreground",
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4" />
                                                {filters.endDate ? format(new Date(filters.endDate), "PPP") : "End date"}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={filters.endDate ? new Date(filters.endDate) : undefined}
                                                onSelect={(date) =>
                                                    setFilters((prev) => ({
                                                        ...prev,
                                                        endDate: date ? format(date, "yyyy-MM-dd") : "",
                                                    }))
                                                }
                                                initialFocus
                                            />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Status</label>
                                <Select
                                    value={filters.status}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value === "all" ? undefined : value as "success" | "pending" | "failed" | undefined }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All statuses" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All statuses</SelectItem>
                                        <SelectItem value="success">Success</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="failed">Failed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Payment Method</label>
                                <Select
                                    value={filters.paymentMethod}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, paymentMethod: value === "all" ? undefined : value as "cash" | "transfer" | "card" | "pos" | "cheque" | undefined }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All methods" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All methods</SelectItem>
                                        <SelectItem value="cash">Cash</SelectItem>
                                        <SelectItem value="transfer">Bank Transfer</SelectItem>
                                        <SelectItem value="card">Card Payment</SelectItem>
                                        <SelectItem value="pos">POS</SelectItem>
                                        <SelectItem value="cheque">Cheque</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Class</label>
                                <Select
                                    value={filters.classId}
                                    onValueChange={(value) => setFilters((prev) => ({ ...prev, classId: value === "all" ? undefined : value as Id<"classes"> | undefined }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="All classes" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All classes</SelectItem>
                                        {classes?.map((cls) => (
                                            <SelectItem key={cls._id} value={cls._id}>
                                                {cls.title}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <label className="text-sm font-medium">Receipt Number</label>
                                <Input
                                    placeholder="Enter receipt number"
                                    value={filters.receiptNumber}
                                    onChange={(e) => setFilters((prev) => ({ ...prev, receiptNumber: e.target.value }))}
                                />
                            </div>
                        </div>
                    )}
                </form>

                <div className="mt-6">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-muted-foreground">{searchResults?.payments.length ?? 0} results found</p>
                        <Button variant="outline" onClick={handleExport}>
                            <FileDown className="h-4 w-4 mr-2" />
                            Export Results
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Receipt No.</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Student</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Amount</TableHead>
                                    <TableHead>Method</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {searchResults?.payments.map((payment) => (
                                    <TableRow key={payment._id}>
                                        <TableCell className="font-medium">{payment.receiptNumber}</TableCell>
                                        <TableCell>{format(new Date(payment.paymentDate), "dd/MM/yyyy")}</TableCell>
                                        <TableCell>
                                            <div>
                                                <p className="font-medium">{payment.student?.name}</p>
                                                <p className="text-sm text-muted-foreground">{payment.student?.email}</p>
                                            </div>
                                        </TableCell>
                                        <TableCell>{payment.class?.name}</TableCell>
                                        <TableCell>₦{formatCurrency(payment.amount)}</TableCell>
                                        <TableCell className="capitalize">{payment.paymentMethod}</TableCell>
                                        <TableCell>
                                            <Badge
                                                variant={
                                                    payment.status === "success"
                                                        ? "default"
                                                        : payment.status === "pending"
                                                            ? "secondary"
                                                            : "destructive"
                                                }
                                            >
                                                {payment.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <Button variant="ghost" size="sm">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {!searchResults?.payments.length && (
                                    <TableRow>
                                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                                            No payments found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>

                    {searchResults?.payments.length ? (
                        <div className="flex items-center justify-between mt-4">
                            <p className="text-sm text-muted-foreground">
                                Page {page} of {Math.ceil((searchResults?.payments.length || 0) / itemsPerPage)}
                            </p>

                            <div className="flex gap-2">
                                <Button variant="outline" size="sm" onClick={handlePreviousPage} disabled={page === 1}>
                                    Previous
                                </Button>
                                <Button variant="outline" size="sm" onClick={handleNextPage} disabled={!searchResults?.continueCursor}>
                                    Next
                                </Button>
                            </div>

                        </div>
                    ) : null}
                </div>
            </CardContent >
        </Card >
    )
}

