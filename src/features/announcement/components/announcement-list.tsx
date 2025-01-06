/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { MoreHorizontal } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { AnnouncementCard } from './announcement-card'

interface AnnouncementListProps {
    announcements: any[]
    activeTab: 'recent' | 'scheduled' | 'archived' | 'deleted'
    onTabChange: (tab: 'recent' | 'scheduled' | 'archived' | 'deleted') => void
    view: 'list' | 'grid'
}

export function AnnouncementList({
    announcements,
    activeTab,
    onTabChange,
    view
}: AnnouncementListProps) {
    const tabs = [
        { id: 'recent', label: 'Recent' },
        { id: 'scheduled', label: 'Scheduled' },
        { id: 'archived', label: 'Archived' },
        { id: 'deleted', label: 'Deleted' },
    ] as const

    const filteredAnnouncements = announcements.filter(
        announcement => announcement.status === activeTab
    )

    return (
        <div className="space-y-6">
            <div className="bg-[#2E8B57] rounded-full p-1">
                <nav className="flex flex-wrap justify-between">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => onTabChange(tab.id)}
                            className={`
                flex-1 px-3 sm:px-6 py-2 text-xs sm:text-sm font-medium rounded-full
                ${activeTab === tab.id
                                    ? 'bg-white text-[#2E8B57]'
                                    : 'text-white hover:bg-white/10'
                                }
              `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </nav>
            </div>

            {view === 'grid' ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredAnnouncements.map((announcement) => (
                        <AnnouncementCard
                            key={announcement.id}
                            announcement={announcement}
                        />
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg border overflow-x-auto">
                    <div className="grid grid-cols-[1fr,auto,auto] gap-4 p-4 border-b">
                        <div className="text-sm font-medium">Event</div>
                        <div className="text-sm font-medium">Date</div>
                        <div className="text-sm font-medium">Action</div>
                    </div>
                    {filteredAnnouncements.map((announcement) => (
                        <div
                            key={announcement.id}
                            className="grid grid-cols-[1fr,auto,auto] gap-4 p-4 border-b last:border-0 items-center hover:bg-gray-50"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${activeTab === 'scheduled' ? 'bg-yellow-400' : 'bg-[#2E8B57]'
                                    }`} />
                                <span className="text-sm">{announcement.title}</span>
                            </div>
                            <div className="text-sm text-gray-500">{announcement.date}</div>
                            <Button variant="ghost" size="icon">
                                <MoreHorizontal className="h-4 w-4" />
                            </Button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}

