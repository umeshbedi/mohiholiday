"use client"
import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { Carousel, Row, Col, Space, Button, Skeleton } from 'antd'
import { LeftOutlined, RightOutlined } from '@ant-design/icons'
import Link from 'next/link'
import Image from 'next/image'
import { mobile, textShadow } from '../utils/variables';

export default function Slider({ sliderData }) {

    const [height, setHeight] = useState(null)

    const [opacity, setOpactiy] = useState(null)
    const [marginBottom, setMarginBottom] = useState("2rem")

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(mobile())
    }, [isMobile])


    useEffect(() => {
        setHeight(document.documentElement.clientHeight - 50)
    }, [])

    return (
        <div>
            <Swiper

                spaceBetween={30}
                centeredSlides={true}
                speed={2000}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: true,
                    pauseOnMouseEnter: true
                }}
                grabCursor={true}
                navigation={true}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper"
                onSlideChangeTransitionStart={(e) => {
                    setOpactiy(0)
                    setMarginBottom(0)
                }}
                onSlideChangeTransitionEnd={() => {
                    setOpactiy(1)
                    setMarginBottom("2rem")
                }}
            >
                {
                    sliderData.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div >
                                <div
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: height,
                                        position: 'relative',

                                    }}>

                                    <Image
                                        src={item.image}
                                        alt={`mohi holiday slider image ${index}`}
                                        fill
                                        loading='lazy'
                                        style={{ objectFit: 'cover' }}
                                        placeholder='blur'
                                        blurDataURL={item.image + '?blur'}
                                    />
                                    <div style={{
                                        height: height,
                                        // backgroundImage: `linear-gradient(0deg,rgba(0,0,0, 0.9),rgba(0,0,0, .3),rgba(0,0,0, 0))`,
                                        position: 'absolute',
                                        width: '100%',

                                    }}
                                    />

                                    <div style={{ width: '100%', position: 'absolute',  display: 'flex', justifyContent: 'center', alignItems: "flex-end", height: '100%' }}>
                                        <div style={{ textAlign: 'center' }}>
                                            <h1
                                                style={{
                                                    color: 'white',
                                                    fontWeight: 800,
                                                    // marginBottom: marginBottom,
                                                    transition: 'all .5s ease',
                                                    opacity: opacity,
                                                    textShadow: textShadow
                                                }}
                                            >{item.heading}
                                            </h1>
                                            <p
                                                style={{
                                                    color: 'white',
                                                    fontWeight: 600,
                                                    marginBottom: marginBottom,
                                                    transition: 'all .5s ease',
                                                    opacity: opacity,
                                                    textAlign: 'center'
                                                }}
                                            >{item.subHeading}
                                            </p>

                                            
                                        </div>

                                    </div>

                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }




            </Swiper>
        </div>
    )
}
