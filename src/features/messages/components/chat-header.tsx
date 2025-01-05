import { Video, Phone, Search } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ChatHeaderProps {
    conversation: {
        name: string
        isTyping: boolean
    }
}

export function ChatHeader({ conversation }: ChatHeaderProps) {
    return (
        <div className="px-6 py-4 border-b flex items-center justify-between bg-white">
            <div>
                <h2 className="font-semibold">{conversation.name}</h2>
                {conversation.isTyping && (
                    <p className="text-sm text-emerald-600">Typing....</p>
                )}
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon">
                    <div className='px-2 py-2 rounded-full bg-[#11321F33] '>
                        <Video className="h-5 w-5" />
                    </div>
                </Button>
                <Button variant="ghost" size="icon">
                    <div className='px-2 py-2 rounded-full bg-[#11321F33] '>
                        <Phone className="h-5 w-5" />
                    </div>
                </Button>
                <Button variant="ghost" size="icon">
                    <div className='px-2 py-2 rounded-full bg-[#11321F33] '>
                        <Search className="h-5 w-5" />
                    </div>
                </Button>
            </div>
        </div>
    )
}

