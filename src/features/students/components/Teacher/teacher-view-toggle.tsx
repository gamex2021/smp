'use client'

import { LayoutGrid, List } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ViewToggleProps {
    view: 'cards' | 'table'
    onViewChange: (view: 'cards' | 'table') => void
}

export function TeacherViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
            <Button
                variant={view === 'cards' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('cards')}
                className={view === 'cards' ? 'bg-[#2E8B57] hover:bg-[#2E8B57]/90' : ''}
            >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Cards
            </Button>
            <Button
                variant={view === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('table')}
                className={view === 'table' ? 'bg-[#2E8B57] hover:bg-[#2E8B57]/90' : ''}
            >
                <List className="h-4 w-4 mr-2" />
                Table
            </Button>
        </div>
    )
}

