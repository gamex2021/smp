/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import { useState } from 'react'
import { ConversationsList } from './conversations-list'
import { ChatArea } from './chat-area'

interface MessagesContentProps {
    initialConversations: any[]
    initialMessages: any[]
    currentUser: {
        name: string
        role: string
        avatar: string
    }
}

export function MessagesContent({
    initialConversations,
    initialMessages,
    currentUser
}: MessagesContentProps) {
    const [activeConversation, setActiveConversation] = useState(initialConversations[0])

    return (
        <div className="flex h-full bg-gray-50">
            <ConversationsList
                conversations={initialConversations}
                activeConversation={activeConversation}
                onSelectConversation={setActiveConversation}
            />
            <div className="flex-1 flex flex-col min-w-0">
                <ChatArea
                    messages={initialMessages}
                    currentUser={currentUser}
                    conversation={activeConversation}
                />
            </div>
        </div>
    )
}

