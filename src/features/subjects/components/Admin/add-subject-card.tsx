"use client";
import { Plus } from 'lucide-react'


export function AddSubjectCard() {
    return (
        <button
            // onClick={onClick}
            className="w-full h-full bg-gray-100 rounded-lg p-4 flex flex-col items-center justify-center min-h-[200px] hover:bg-gray-200 transition-colors"
        >
            <div className="rounded-full bg-white p-3 mb-2 shadow-sm">
                <Plus className="h-6 w-6 text-gray-600" />
            </div>
            <span className="text-gray-600">Add New Subject</span>
        </button>
    )
}

