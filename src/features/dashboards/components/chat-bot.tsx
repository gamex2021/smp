import Image from 'next/image'
import React from 'react'

type Props = object

const Chatbot = (props: Props) => {
    return (
        <div className='bg-[#2E8B57] px-[14px] py-[14px] rounded-full hover:scale-105'>
            <Image src="/images/chat-smile.png" alt='chatbot' width={300} height={300} className='w-[23px] h-[21px] cursor-pointer ' />
        </div>
    )
}

export default Chatbot