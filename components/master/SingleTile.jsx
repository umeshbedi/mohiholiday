import style from '@/styles/packageName.module.css'
import Image from 'next/image'

export default function Tile({ thumbnail, name, slug }) {
    return (
        <div
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-duration="1000"
                className={style.tile} style={{ height: 350, width: 250, position: 'relative', borderRadius: 40, overflow: 'hidden', marginBottom: '2rem' }}>
                <a href={slug}>

                    <Image
                        src={thumbnail}
                        alt={name}
                        fill
                        style={{ objectFit: 'cover' }}
                        loading='lazy'
                        placeholder='blur'
                        blurDataURL={thumbnail + '?blur'}
                    />
                </a>
                <h1 style={{
                    color: 'white',
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    bottom: 20,
                    textAlign: 'center',
                    position: 'absolute',
                    width: '100% ',
                    textShadow:textShadow
                }}
                >
                    {name}
                </h1>
            </div>
    )
}

import React from 'react'
import { textShadow } from '../utils/variables'


