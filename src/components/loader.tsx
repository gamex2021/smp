import React from 'react'
import { TbLoader2 } from 'react-icons/tb'


const Loader = () => {
    return (
        <div className='w-full flex justify-center'>
            <TbLoader2 className='w-7 h-7 animate-spin' />
        </div>
    )
}

export default Loader