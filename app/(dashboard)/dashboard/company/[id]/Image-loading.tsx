"use client"

import React, { useState } from 'react'
import Image from 'next/image';

export default function ImageLoading({ imageUrl }: { imageUrl: string }) {

    const [isLoading, setLoading] = useState(true);
    return (
        <>
          <Image
            src={imageUrl}
            alt='image'
            width={50}
            height={50}
            priority
            className={`
                object-contain
                group-hover:opacity-75
                duration-700
                ease-in-out
                ${isLoading ? 'grayscale blur-2xl scale-110' : 'grayscale-0 blur-0 scale-100'}
            `}
            sizes='(max-width:768px) 100vw, (max-width: 1200px) 50vw, 25vw'
            onLoadingComplete={() => setLoading(false)}
        />
        </>
    )
}