"use client"
import React, { useEffect, useState } from 'react'
import style from './Journey.module.css'

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Image from 'next/image';
import Title from '../master/Title';
import { mobile } from '../utils/variables';

export default function Journey({ youtube }) {

    const [activeIndex, setActiveIndex] = useState(1)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(mobile())

    }, [isMobile])
    
    return (
        <div>
            <Title title={"Witness the epic The Andaman Islands"} center={true}/>
            <Swiper
                style={{padding: isMobile?0:"0 20%"}}
                spaceBetween={30}
                // centeredSlides={true}
                initialSlide={1}
                navigation={true}
                modules={[Navigation]}
                // className={style.journeySwiper}
                rewind
                onSlideChange={(e) => {
                    setActiveIndex(e.activeIndex)
                }}
                onNavigationNext={() => {

                }}
            >
                {
                    youtube.TravelJourney.map((item, index) => (
                        <SwiperSlide key={index}>
                            <div>
                                <div
                                    // onMouseEnter={() => activeIndex == index ? playButton() : null}
                                    // onMouseOut={() => activeIndex == index ? removePlay() : null}
                                    style={{
                                        width: '100%',
                                        display: 'flex',
                                        alignItems: 'center',
                                        height: 450,
                                        position: 'relative',

                                    }}>

                                    {/* {frameVisible && activeIndex == index ?
                                        (
                                            <div style={{ borderRadius: 30, overflow: 'hidden', width: '100%' }}>
                                                <iframe
                                                    width="100%"
                                                    height="450px"
                                                    src={`https://www.youtube.com/embed/${item.video}?rel=0&amp;showinfo=0${video}`}
                                                    frameborder="0"
                                                    allowfullscreen="allowfullscreen"
                                                >
                                                </iframe>
                                            </div>)
                                        : (<Image
                                            src={item.image}
                                            fill
                                            loading='lazy'
                                            style={{ objectFit: 'cover', borderRadius: 20, transform: size }}
                                            placeholder='blur'
                                            blurDataURL={item.image}
                                        />)
                                    } */}
                                    <div style={{ borderRadius: 30, overflow: 'hidden', width: '100%' }}>
                                        <iframe
                                            width="100%"
                                            height="450px"
                                            src={`https://www.youtube.com/embed/${item.YoutubeLink.split("v=")[1]}?rel=0&amp;showinfo=0`}
                                            frameborder="0"
                                            allowfullscreen="allowfullscreen"
                                        >
                                        </iframe>
                                    </div>

                                    {activeIndex != index &&
                                        <div style={{
                                            height: 450,
                                            background: "rgba(255,255,255,.6)",
                                            position: 'absolute',
                                            width: '100%',

                                        }}
                                        />
                                    }


                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }




            </Swiper>
        </div>
    )
}
