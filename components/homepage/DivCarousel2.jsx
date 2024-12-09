"use client"
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation, EffectCoverflow } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from 'next/image';
import { ArrowRightOutlined } from '@ant-design/icons';

import { mobile } from '../utils/variables';
import Title from '../master/Title';


export default function DivCarousel2({ lightHead, darkHead, backgroundImage, sliderContent = [], button, title }) {

    const [containerStyle, setContainerStyle] = useState({ width: "90%" })
    const [subHeadStyle, setsubHeadStyle] = useState({ display: 'flex' })
    const [sliderStyle, setSliderStyle] = useState({ width: '100%' })
    const [titleStyle, setTitleStyle] = useState({})

    const [activeIndex, setActiveIndex] = useState(0)

    const [buttonFocus, setButtonFocus] = useState(false)

    const slideRef = useRef()
    const containerRef = useRef()

    // console.log(activeIndex)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(mobile())

    }, [isMobile])




    return (
        <div
            ref={containerRef}
            style={{
                position: 'relative',
                marginBottom: "3.5rem",
                marginTop: "2rem"
            }}
        >
            <Title isdark title={title} center={true} />
            
            <div className='w-[100%] relative bg-gray-500 py-10'>
                <h1 className='text-white text-center'>Activities in Andaman</h1>
                <center>
                    <div style={{ width: "90%", marginTop: 20 }}>
                        <Swiper
                            // effect={"coverflow"}
                            spaceBetween={30}
                            modules={[Navigation]}
                            centeredSlides={false}
                            slidesPerView={"auto"}
                            coverflowEffect={{
                                rotate: 50,
                                stretch: 0,
                                depth: 100,
                                modifier: 1,
                                // slideShadows: true,
                            }}
                            pagination={true}
                            navigation
                            className="p-2"
                            style={{ paddingLeft: 25, paddingBottom: 40, paddingRight: 25 }}


                        >
                            {Array(6).fill(0).map((item, i) => (
                                <SwiperSlide key={i} style={{ width: 350 }}>
                                    <Link href={"/activities"}>
                                    <div style={{background: 'white',borderRadius: "30px",}}
                                        className=' shadow-2xl relative h-52 overflow-hidden'
                                    >
                                        <Image src={"/images/cabimage2.jpg"} alt='activities image' fill className='object-cover' />
                                        <div className='absolute w-full h-52 bg-[rgba(0,0,0,.3)] flex items-center justify-end pb-3 flex-col'>
                                            <h1 className='text-white text-2xl'>Activity Name</h1>
                                            <p className='text-white'>2 activities</p>
                                        </div>

                                    </div>
                                    </Link>


                                </SwiperSlide>
                            ))}


                        </Swiper>

                    </div>
                </center>
            </div>
        </div>
    )
}