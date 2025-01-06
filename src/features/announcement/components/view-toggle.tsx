'use client'

import { LayoutGrid, List, Calendar } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ViewToggleProps {
    view: 'list' | 'grid' | 'calendar'
    onViewChange: (view: 'list' | 'grid' | 'calendar') => void
}

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-1 sm:gap-2 bg-white rounded-lg border p-1">
            <Button
                variant={view === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('list')}
                className={`text-xs sm:text-sm ${view === 'list' ? 'bg-[#2E8B57] hover:bg-[#2E8B57]/90' : ''}`}
            >
                <List className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                List
            </Button>
            <Button
                variant={view === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('grid')}
                className={`text-xs sm:text-sm ${view === 'grid' ? 'bg-[#2E8B57] hover:bg-[#2E8B57]/90' : ''}`}
            >
                <LayoutGrid className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Grid
            </Button>
            <Button
                variant={view === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewChange('calendar')}
                className={`text-xs sm:text-sm ${view === 'calendar' ? 'bg-[#2E8B57] hover:bg-[#2E8B57]/90' : ''}`}
            >
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                Calendar
            </Button>
        </div>
    )
}

