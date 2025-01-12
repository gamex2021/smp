import { Plus } from 'lucide-react'

interface MoreCardProps {
    onClick?: () => void
}

export function StudentMoreCard({ onClick }: MoreCardProps) {
    return (
        <button
            onClick={onClick}
            className="w-full bg-gray-200 rounded-lg p-4 flex flex-col items-center justify-center min-h-[160px] hover:bg-gray-300 transition-colors"
        >
            <div className="rounded-full bg-white p-3 mb-2">
                <Plus className="h-6 w-6 text-gray-600" />
            </div>
            <span className="text-gray-600">More</span>
        </button>
    )
}
