"use client"
import React from 'react'
import Title from '../master/Title'
import style from './WhatSay.module.css'
import { testimonials } from '../utils/localdb'
import Image from 'next/image'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Autoplay, Pagination, Navigation } from 'swiper/modules'

const sayImages = [
    { src: '/images/What they Say.jpg', alt: 'What they say - slide 1' },
    { src: '/images/1UKB.webp', alt: 'What they say - slide 2' },
    { src: '/images/cabimage2.jpg', alt: 'What they say - slide 3' },
]

export default function WhatSay() {
    return (
        <div>
            <Title title='Stories made by Mohi Holidays' center/>

            <div className={style.SayContainer}>

                <div className={style.SayImage}>
                    <Swiper
                        spaceBetween={0}
                        centeredSlides={true}
                        loop={true}
                        speed={800}
                        autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[Autoplay, Pagination, Navigation]}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {sayImages.map((img, index) => (
                            <SwiperSlide key={index}>
                                <div style={{ position: 'relative', width: '100%', height: '100%' }}>
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                <div className={style.SayBox} style={{padding:'2%'}}>
                    <div className={style.arrowBox}/>
                    <p style={{fontSize:16.5, textAlign:'justify'}}> 
                    Every journey tells a different story, and at Mohi Holidays, we feel privileged to be a part of those unforgettable moments. From the first welcome in the Andaman Islands to the last goodbye, every smile in these photographs reflects memories of beautiful beaches, peaceful sunsets, island adventures, and experiences that stay close to the heart.    
                    Our greatest reward is seeing our guests return home with happiness, cherished memories, and stories worth sharing for years to come. At Mohi Holidays, we don’t just arrange holidays — we create journeys that become lifelong memories.
                    </p>
                </div>
            </div>

        </div>
    )
}
