import Image from 'next/image'
import { cn } from '@/lib/utils'

interface ConversationItemProps {
    conversation: {
        name: string
        role: string
        lastMessage: string
        timestamp: string
        unreadCount: number
        avatar: string
        isTyping: boolean
    }
    isActive: boolean
    onClick: () => void
}

export function ConversationItem({
    conversation,
    isActive,
    onClick
}: ConversationItemProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "w-full px-4 py-3 flex items-start gap-3 hover:bg-white/50 transition-colors",
                isActive && "bg-white"
            )}
        >
            <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden">
                    <Image
                        src={conversation.avatar}
                        alt={conversation.name}
                        width={40}
                        height={40}
                        className="object-cover"
                    />
                </div>
            </div>
            <div className="flex-1 min-w-0 text-left">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="font-medium">{conversation.name}</p>
                        <p className="text-sm text-gray-500">{conversation.role}</p>
                    </div>
                    <div className='items-end text-end flex flex-col space-y-1'>
                        <span className="text-xs text-gray-500">{conversation.timestamp}</span>
                        {conversation.unreadCount > 0 && (
                            <div className="w-5 h-5 rounded-full bg-[#2E8B57] text-white text-xs flex items-center justify-center">
                                {conversation.unreadCount}
                            </div>
                        )}
                    </div>

                </div>
                <p className="text-sm text-gray-600 truncate mt-1">
                    {conversation.lastMessage}
                </p>
            </div>

        </button>
    )
}

