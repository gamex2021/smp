'use client'

import { useState } from 'react'
import { Pencil } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface EditableInputProps {
    label: string
    value: string
    type?: string
    onChange: (value: string) => void
}

export function EditableInput({
    label,
    value,
    type = 'text',
    onChange
}: EditableInputProps) {
    const [isEditing, setIsEditing] = useState(false)
    const [tempValue, setTempValue] = useState(value)

    const handleEdit = () => {
        if (isEditing) {
            onChange(tempValue)
        }
        setIsEditing(!isEditing)
    }

    return (
        <div className="space-y-2">
            <Label className='text-[#11321F]' htmlFor={label}>{label}</Label>
            <div className="relative">
                <Input
                    id={label}
                    type={type}
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    disabled={!isEditing}
                    className="pr-10 h-[50px]"
                />
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2"
                    onClick={handleEdit}
                >
                    <Image src="/images/edit-rectangle.png" width={200} height={200} alt="edit pencil" className="h-7 w-7"/>
                </Button>
            </div>
        </div>
    )
}

