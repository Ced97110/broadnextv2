"use client"

import React, { useState } from 'react'
import Image from 'next/image';

export default function ImageLoading({ imageUrl }: { imageUrl: string }) {

    const [isLoading, setLoading] = useState(true);
    return (
        <>
        <div className='relative h-16 w-16'>
            <Image
                fill={true}
                src={imageUrl}
                alt='image'
                priority={true}
                className={`
                    object-contain
                    group-hover:opacity-75
                    duration-700
                    ease-in-out
                    ${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}
                `}
                onLoad={() => setLoading(false)}
            />
        </div>
        </>
    )
}