'use client'

import { Search, MoreHorizontal } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

interface SearchHeaderProps {
    type: 'class' | 'group' | 'student'
    className?: string
}

export function SearchHeader({ type, className = '' }: SearchHeaderProps) {
    const placeholder = `Search for a ${type}......`

    return (
        <div className={`flex gap-2 ${className}`}>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                    placeholder={placeholder}
                    className="pl-9 w-full"
                />
            </div>
            <Button
                variant="ghost"
                size="icon"
            >
                <MoreHorizontal className="h-5 w-5" />
            </Button>
        </div>
    )
}

