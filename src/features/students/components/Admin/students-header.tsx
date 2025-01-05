'use client'

import { Search, User, UserPlus } from 'lucide-react'
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ViewToggle } from './view-toggle'


interface StudentsHeaderProps {
    view: 'table' | 'grid'
    onViewChange: (view: 'table' | 'grid') => void
}

export function StudentsHeader({ view, onViewChange }: StudentsHeaderProps) {
    return (
        <div className="flex flex-col space-y-6 mb-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">All Students</h1>
                <div className="flex items-center gap-4">
                    <ViewToggle view={view} onViewChange={onViewChange} />
                    <Select defaultValue="all">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select class" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Class</SelectItem>
                            <SelectItem value="1">Class 1</SelectItem>
                            <SelectItem value="2">Class 2</SelectItem>
                            <SelectItem value="3">Class 3</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="relative ">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search for a student......"
                        className="pl-9 w-full"
                    />
                </div>
                <div className="w-8 h-8 rounded-full  flex items-center justify-center">
                    <UserPlus className="h-7 w-7 text-[#123b24]" />
                </div>
            </div>
        </div>
    )
}

