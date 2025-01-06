'use client'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface LocationSelectProps {
    value: string
    onChange: (value: string) => void
}

export function LocationSelect({ value, onChange }: LocationSelectProps) {
    const locations = [
        'Nigeria',
        'Ghana',
        'Kenya',
        'South Africa',
        'Uganda',
    ]

    return (
        <div className="space-y-2">
            <Label>Location</Label>
            <Select value={value} onValueChange={onChange}>
                <SelectTrigger className="h-[50px]">
                    <SelectValue placeholder="Select location" />
                </SelectTrigger>
                <SelectContent>
                    {locations.map((location) => (
                        <SelectItem key={location} value={location}>
                            {location}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

