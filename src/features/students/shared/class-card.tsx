import { ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface ClassCardProps {
    id: number
    name: string
    studentCount: number
}

export function ClassCard({ id, name, studentCount }: ClassCardProps) {
    return (
        <Link
            href={`/students/${id}`}
            className="bg-[#2E8B57] rounded-lg p-4 text-white relative group hover:shadow-lg transition-shadow"
        >
            <div className="bg-white rounded-full p-3 w-12 h-12 mb-4 flex items-center justify-center">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#2E8B57"
                    strokeWidth="2"
                    className="w-6 h-6"
                >
                    <path d="M4 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7z" />
                    <path d="M8 5v14M16 5v14" />
                </svg>
            </div>
            <div className="space-y-1">
                <h3 className="font-medium">{name}</h3>
                <p className="text-sm text-white/80">{studentCount} Students</p>
            </div>
            <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
    )
}

