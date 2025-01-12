'use client'

import { Edit2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StudentDetailsProps {
    student: {
        id: string
        name: string
        gender: string
        location: string
        position: string
        email: string
        phone: string
        payment: string
        parentPhone: string
        parentEmail: string
    }
}

export function StudentDetails({ student }: StudentDetailsProps) {
    return (
        <div className="min-h-[calc(100vh-4rem)]   p-4 md:p-6">
            <div className="max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {/* Left Column */}
                <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center  justify-between">
                        <h2 className="text-xl font-semibold">{student.name}</h2>
                        <Button variant="ghost" size="icon">
                            <Edit2 className="h-4 w-4" />
                        </Button>
                    </div>

                    <div className="bg-[#E8F4F0] rounded-lg p-4 md:p-6">
                        <div className="w-24 h-24 md:w-32 md:h-32 mx-auto rounded-full bg-gray-200 mb-4 md:mb-6" />
                    </div>

                    <div className="bg-[#E8F4F0]  rounded-lg p-4 md:p-6 space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Student ID:</span>
                            <div className="flex items-center gap-2">
                                <span>{student.id}</span>
                                <Button variant="ghost" size="icon">
                                    <Edit2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                        {/* Other fields remain the same */}
                    </div>
                </div>

                {/* Right Column */}
                <div className="bg-[#E8F4F0] rounded-lg p-4 md:p-6 space-y-4">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <Input defaultValue={student.email} className="bg-white" />
                        </div>
                        {/* Other fields remain the same */}
                    </div>
                    <Button className="w-full bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                        Save
                    </Button>
                </div>
            </div>
        </div>
    )
}

