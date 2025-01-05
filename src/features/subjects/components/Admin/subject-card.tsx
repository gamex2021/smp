"use client"

import { Book, Plus } from 'lucide-react'
import { Button } from "@/components/ui/button"
import Image from 'next/image'

interface SubjectCardProps {
    name: string
    onClick?: () => void
    onAssign?: () => void
}

export function SubjectCard({ name, onClick, onAssign }: SubjectCardProps) {
    return (
        <div
            onClick={onClick}
            className="bg-[#2E8B57] rounded-2xl max-w-[300px] aspect-square p-4 text-white cursor-pointer hover:shadow-lg transition-all duration-200"
        >
            <div className="h-full flex flex-col">
                <h3 className="font-medium text-lg mb-4 text-[#F8FBFA] ">{name}</h3>
                <div className="flex-1 flex items-center bg-[#57a178] rounded-[16px] justify-center mb-4">
                    <Image src="/images/book.png" width={300} height={300} className='h-[63px] w-[63px]' alt='bool' />
                </div>
                <Button
                    size="default"
                    className="w-full bg-white hover:bg-white/90 text-[#11321F] font-medium rounded-xl"
                    onClick={(e) => {
                        e.stopPropagation()
                        onAssign?.()
                    }}
                >
                    Assign
                    <div className='px-1 py-1 rounded-md bg-[#2E8B57]'>
                        <Plus className="h-4 w-4 text-white" />
                    </div>

                </Button>
            </div>
        </div>
    )
}

