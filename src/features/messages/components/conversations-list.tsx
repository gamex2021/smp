/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { Camera, Edit, Search, SlidersHorizontal } from 'lucide-react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ConversationItem } from './conversation-item'


interface ConversationsListProps {
    conversations: any[]
    activeConversation: any
    onSelectConversation: (conversation: any) => void
}

export function ConversationsList({
    conversations,
    activeConversation,
    onSelectConversation
}: ConversationsListProps) {
    return (
        <div className="w-80 border-r bg-[#DEEDE5] flex flex-col">
            <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                    <h1 className="text-xl font-semibold">Messages</h1>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="icon">
                            <div className='px-2 py-2 rounded-full bg-[#11321F33] '>
                                <Camera className="h-5 w-5 " />
                            </div>
                        </Button>
                        <Button variant="ghost" size="icon">
                            <div className='px-2 py-2 rounded-full bg-[#11321F33] '>
                                <Edit className="h-5 w-5" />
                            </div>
                        </Button>
                    </div>
                </div>
                <div className="flex gap-2">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                            placeholder="Search for a something......"
                            className="pl-9 w-full border-[0.65px] border-[#11321F66]"
                        />
                    </div>
                    <Button variant="ghost" size="icon">
                        <SlidersHorizontal className="h-5 w-5" />
                    </Button>
                </div>
            </div>
            <div className="flex-1 overflow-y-auto">
                {conversations.map((conversation) => (
                    <ConversationItem
                        key={conversation.id}
                        conversation={conversation}
                        isActive={activeConversation?.id === conversation.id}
                        onClick={() => onSelectConversation(conversation)}
                    />
                ))}
            </div>
        </div>
    )
}

