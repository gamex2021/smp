import React from 'react'

type Props = object

export const A = (props: Props) => {
    return (
        <div className='bg-[#ADADAD] w-[20px] h-[20px] grid place-content-center rounded-full text-sm text-white font-semibold'>
            A
        </div>
    )
}

export const P = () => {
    return (
        <div className='bg-emerald-600 w-[20px] h-[20px] grid place-content-center rounded-full text-sm text-white font-semibold'>
            P
        </div>
    )
}

export const W = () => {
    return (
        <div className='bg-amber-500 w-[20px] h-[20px] grid place-content-center rounded-full text-sm text-white font-semibold'>
            W
        </div>
    )
}

export const L = () => {
    return (
        <div className='bg-[#3A90E6] w-[20px] h-[20px] grid place-content-center rounded-full text-sm text-white font-semibold'>
            L
        </div>
    )

}
