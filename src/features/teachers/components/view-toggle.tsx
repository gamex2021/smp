'use client'

import { LayoutGrid, TableIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ViewToggleProps {
    view: 'table' | 'grid'
    onViewChange: (view: 'table' | 'grid') => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-2 bg-white rounded-lg border p-1">
            <Button
                variant={view === 'table' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('table')}
                className={view === 'table' ? 'bg-[#2E8B57] hover:bg-[#2E8B57]/90' : ''}
            >
                <TableIcon className="h-4 w-4 mr-2" />
                Table
            </Button>
            <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('grid')}
                className={view === 'grid' ? 'bg-[#2E8B57] hover:bg-[#2E8B57]/90' : ''}
            >
                <LayoutGrid className="h-4 w-4 mr-2" />
                Grid
            </Button>
        </div>
    )
}

