"use client"
import React, { useEffect, useState } from 'react'
// import "react-multi-carousel/lib/styles.css";

import { Swiper, SwiperSlide } from "swiper/react";
// Import Swiper styles
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import { EffectCoverflow, Pagination, Navigation } from "swiper/modules";
import { FaQuoteLeft } from 'react-icons/fa';

// import style from '@/styles/Home.module.css'
import { mobile } from '../utils/variables';
import Title from '../master/Title';
import { testimonials } from '../utils/localdb';
import Image from 'next/image';


export default function Activities({ activitiesData }) {

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(mobile())
    }, [isMobile])




    return (

        <div className='bg-[var(--primaryColor)]'>
            

            <div style={{ width: isMobile ? "90%" : "75%", marginTop: 20 }}>
                <Swiper
                    // effect={"coverflow"}
                    spaceBetween={30}
                    grabCursor={true}
                    modules={[EffectCoverflow, Navigation]}
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
                        <SwiperSlide
                            key={i}
                            style={{ width: 350 }}
                        >

                            <div
                                style={{
                                    background: 'white',
                                    borderRadius: "30px 30px 0 0",
                                    padding: "40px 30px 10px 35px"
                                }}
                                className=' shadow-2xl'
                            >

                                <div>
                                    <div className='relative w-[100%] h-40 mb-2'>
                                        <Image src={"/images/cabimage2.jpg"} alt='activities image' fill className='object-contain' />
                                    </div>

                                    
                                </div>

                            </div>
                            <div style={{ background: 'white', borderRadius: '0 0 100px 0', width: '100%', marginTop: -2 }}>
                                <p style={{ background: "var(--primaryColor)", borderRadius: '100px 0 100px 0', color: 'white', textAlign: 'center', padding: 30, fontStyle: 'italic', fontWeight: 800 }}>— {item.name}</p>
                            </div>

                        </SwiperSlide>
                    ))}


                </Swiper>
            
            </div>
        </div>
    )
}
