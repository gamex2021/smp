/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { AnnouncementCalendar } from './announcement-calendar'
import { AnnouncementList } from './announcement-list'
import { ViewToggle } from './view-toggle'

interface AnnouncementContentProps {
    initialAnnouncements: any[]
    initialEvents: any[]
}

export function AnnouncementContent({
    initialAnnouncements,
    initialEvents
}: AnnouncementContentProps) {
    const [view, setView] = useState<'list' | 'grid' | 'calendar'>('list')
    const [activeTab, setActiveTab] = useState<'recent' | 'scheduled' | 'archived' | 'deleted'>('recent')

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <h1 className="text-xl sm:text-2xl font-semibold">Announcements</h1>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
                    <ViewToggle view={view} onViewChange={setView} />
                    <div className="relative w-full sm:w-[300px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search for a announcement....."
                            className="pl-9"
                        />
                    </div>
                    <Button className="w-full sm:w-auto bg-[#2E8B57] hover:bg-[#2E8B57]/90">
                        <Plus className="h-4 w-4 mr-2" />
                        Add Announcement
                    </Button>
                </div>
            </div>

            {view === 'calendar' ? (
                <AnnouncementCalendar events={initialEvents} />
            ) : (
                <AnnouncementList
                    announcements={initialAnnouncements}
                    activeTab={activeTab}
                    onTabChange={setActiveTab}
                    view={view}
                />
            )}
        </div>
    )
}

