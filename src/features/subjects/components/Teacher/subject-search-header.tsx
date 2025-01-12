'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Search } from 'lucide-react'


export function TeacherSubjectSearchHeader() {


    return (
        <div className="flex flex-col space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-semibold">All Subjects</h1>
                <div className="flex items-center gap-4">
                    <Select defaultValue="every">
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="every">Every Subject</SelectItem>
                            <SelectItem value="core">Core Subjects</SelectItem>
                            <SelectItem value="elective">Elective Subjects</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="flex gap-2">
                <div className="relative ">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                        placeholder="Search for a subject......"
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

