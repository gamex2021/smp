'use client'

import { Search, MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"



export function SearchHeader() {
    return (
        <div className="flex flex-col space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">All Classes</h1>
                <Select defaultValue="jss1">
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select class" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="jss1">Jss 1</SelectItem>
                        <SelectItem value="jss2">Jss 2</SelectItem>
                        <SelectItem value="jss3">Jss 3</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {/* Search Bar */}
            <div className="flex gap-2">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search for a class......"
                        className="pl-9 w-full"
                    />
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className="shrink-0"
                >
                    <MoreHorizontal className="h-5 w-5" />
                </Button>
            </div>
        </div>
    )
}

