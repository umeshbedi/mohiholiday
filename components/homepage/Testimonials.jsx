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


export default function Testimonials({ testimonialsData }) {

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(mobile())
    }, [isMobile])




    return (

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: "end", padding: '4.5rem 0' }}>
            {/* <img src="/images/Google-Reviews.png" alt="Google Reviews" style={{ height: 70 }} />
            <div style={{ display: 'flex', justifyContent: 'center', width: "100%" }}>
                <Title
                    title={"Mohi Holidays Leisures"}
                    isdark
                    center
                    margin={"2rem"}
                />
            </div> */}
            <div className='mx-14'>
                <h1 className='text-[var(--primaryColor)]'>Testimonials</h1>
            </div>


            <div style={{ width: isMobile ? "90%" : "75%", marginTop: 20 }}>
                <Swiper
                    // effect={"coverflow"}
                    spaceBetween={30}
                    grabCursor={true}
                    modules={[Pagination, EffectCoverflow, Navigation]}
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
                    {testimonialsData.map((item, i) => (
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
                                        <Image src={item.image==undefined?"/images/Ravindra Patel.jpg":item.image} alt='testimonials image' fill className='object-contain' />
                                    </div>

                                    <p className='text-lg'>{item.content.slice(0, 190)}</p>
                                </div>

                            </div>
                            <div style={{ background: 'white', borderRadius: '0 0 100px 0', width: '100%', marginTop: -2 }}>
                                <p style={{ background: "var(--primaryColor)", borderRadius: '100px 0 100px 0', color: 'white', textAlign: 'center', padding: 10, fontStyle: 'italic', fontWeight: 800 }}>— {item.name}</p>
                            </div>

                        </SwiperSlide>
                    ))}


                </Swiper>
                <h1 className='text-center text-[3rem] text-gray-300' style={{ fontFamily: "makaran" }}>ATITHI DEVO BHAVA</h1>
            </div>
        </div>
    )
}
