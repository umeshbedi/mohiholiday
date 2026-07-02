"use client"
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from 'next/image';
import { 
    ArrowRightOutlined, 
    HeartOutlined, 
    HeartFilled, 
    ClockCircleOutlined, 
    StarFilled 
} from '@ant-design/icons';

import { mobile } from '../utils/variables';
import Title from '../master/Title';

function ActivityCard({ item }) {
    // Generate mock details for layout matching
    const normalized = (item.title || "").toLowerCase();
    let mock = {
        price: 4500,
        originalPrice: 5400,
        discount: "20% OFF",
        duration: "60 min",
        rating: 5,
        certified: true
    };
    
    if (normalized.includes("north bay")) {
        mock = { price: 3500, originalPrice: 4500, discount: "22% OFF", duration: "45 min", rating: 5, certified: true };
    } else if (normalized.includes("nemo")) {
        mock = { price: 4000, originalPrice: 5000, discount: "20% OFF", duration: "60 min", rating: 5, certified: true };
    } else if (normalized.includes("chidiyatapu")) {
        mock = { price: 4800, originalPrice: 6000, discount: "20% OFF", duration: "60 min", rating: 5, certified: true };
    }

    const price = item.price || mock.price;
    const originalPrice = item.originalPrice || mock.originalPrice;
    const discount = item.discount || mock.discount;
    const duration = item.duration || mock.duration;
    const rating = item.rating || mock.rating;
    const certified = item.certified !== undefined ? item.certified : mock.certified;

    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="w-full bg-white rounded-[24px] shadow-lg overflow-hidden border border-gray-100 flex flex-col group mb-4 transition-all duration-300 hover:shadow-2xl">
            {/* Image Section */}
            <div className="relative w-full h-[180px] md:h-[220px] overflow-hidden">
                <Image 
                    src={item.thumbnail || "/images/cabimage2.jpg"} 
                    alt={item.title} 
                    fill 
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
                    className="object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                
                {/* Heart Button */}
                <button 
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsFavorite(!isFavorite);
                    }}
                    className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
                >
                    {isFavorite ? (
                        <HeartFilled className="text-red-500 text-base" />
                    ) : (
                        <HeartOutlined className="text-gray-400 hover:text-red-500 text-base transition-colors" />
                    )}
                </button>

                {/* Rating Stars */}
                <div className="absolute bottom-12 left-4 z-10 flex gap-0.5">
                    {Array.from({ length: rating }).map((_, idx) => (
                        <StarFilled key={idx} className="text-yellow-400 text-sm" />
                    ))}
                </div>

                {/* Badges */}
                {certified && (
                    <div className="absolute bottom-3 left-4 z-10 bg-[rgba(5,35,50,0.85)] text-white text-[11px] px-3.5 py-1 rounded-full font-bold tracking-wide border border-white/10 backdrop-blur-[2px]">
                        Certified
                    </div>
                )}

                <div className="absolute bottom-3 right-4 z-10 bg-[rgba(255,255,255,0.9)] text-gray-800 text-[11px] px-3 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm backdrop-blur-[2px]">
                    <ClockCircleOutlined className="text-gray-600" /> {duration}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-5 flex flex-col flex-grow justify-between gap-3 text-left">
                <div>
                    {/* Title */}
                    <h3 className="text-gray-950 font-extrabold text-[1rem] md:text-[1.125rem] leading-snug line-clamp-2 h-[2.6rem] md:h-[2.8rem] group-hover:text-[var(--primaryColor)] transition-colors duration-200" title={item.title}>
                        {item.title}
                    </h3>

                    {/* Price and Discount */}
                    <div className="flex items-center justify-between mt-3">
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-gray-400 line-through text-xs font-semibold">₹{originalPrice}</span>
                            <span className="text-gray-900 font-extrabold text-base md:text-lg">₹{price}</span>
                        </div>
                        {discount && (
                            <span className="bg-black text-white px-2.5 py-1 rounded-full text-[10px] font-bold">
                                {discount}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 mt-3 font-normal h-[2.2rem]">
                        {item.metaDescription || (item.about ? item.about.replace(/<[^>]*>/g, '').slice(0, 100) : '')}
                    </p>
                </div>

                {/* Book Now Button */}
                <Link href={item.slug} className="block mt-2">
                    <button className="w-full bg-[var(--primaryColor)] hover:bg-[#0f9cd3] text-white font-extrabold py-2.5 md:py-3 px-4 md:px-5 rounded-full flex items-center justify-between transition-all duration-300 shadow-md hover:shadow-lg shadow-blue-500/10">
                        <span className="tracking-wider text-[11px] font-black text-white">BOOK NOW</span>
                        <span className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-[var(--primaryColor)] font-bold">
                            <ArrowRightOutlined className="text-[10px] font-black" />
                        </span>
                    </button>
                </Link>
            </div>
        </div>
    );
}

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

            <div className='w-[100%] relative py-10' style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
                <div className="absolute inset-0 bg-black/50 z-0"></div>
                <h1 className='text-white text-center relative z-10'>Activities in Andaman</h1>
                <center className="relative z-10">
                    <div style={{ width: "90%", marginTop: 20 }}>
                        <Swiper
                            // effect={"coverflow"}
                            spaceBetween={isMobile ? 15 : 25}
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
                            // className="p-2"
                            style={{ paddingLeft: 10, paddingBottom: 40, paddingRight: 10 }}


                        >
                            {sliderContent.map((item, i) => (
                                <SwiperSlide key={i} style={{ width: isMobile ? 280 : 350 }}>
                                    <ActivityCard item={item} />
                                </SwiperSlide>
                            ))}


                        </Swiper>

                    </div>
                </center>
            </div>
        </div>
    )
}