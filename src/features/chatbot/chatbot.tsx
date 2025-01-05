'use client'

import Image from 'next/image'
import { useState } from 'react'
import { ChatDialog } from './chat-dialog'


export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-10 right-6 bg-[#2E8B57] px-[14px] py-[14px] rounded-full hover:scale-105 transition-transform shadow-lg"
            >
                <Image
                    src="/images/chat-smile.png"
                    alt="chatbot"
                    width={23}
                    height={21}
                    className="cursor-pointer"
                />
            </button>

            <ChatDialog
                open={isOpen}
                onOpenChange={setIsOpen}
            />
        </>
    )
}

