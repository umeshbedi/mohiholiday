"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'

export default function HeadImage({ image = "", title, isHalf = false }) {

    const [scale, setScale] = useState(1.5)

    useEffect(() => {

    }, [])

    return (
        <div style={{ width: "100%", height: isHalf ? 300 : 550, position: 'relative', overflow: 'hidden' }}>
            {!isHalf &&
                    <Image
                        src={image}
                        fill
                        loading='lazy'
                        style={{ objectFit: 'cover', transform: `scale(${scale})`, transition: 'transform 10s ease' }}
                        onLoad={() => setScale(1)}
                        alt={title}
                    />

               
            }

            <div style={{ position: 'absolute', display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%', background: isHalf?"url(https://static.vecteezy.com/system/resources/previews/009/743/046/large_2x/pastel-gradient-background-in-sky-blue-color-with-relaxing-pattern-vector.jpg)":"transparent" }}>
                <h1 style={{ color: 'white', textShadow: "2px 2px 4px #000000", textAlign: 'center' }}>{title}</h1>
            </div>
        </div>
    )
}
