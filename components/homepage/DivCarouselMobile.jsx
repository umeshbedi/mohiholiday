"use client"
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'
import style from '@/styles/Home.module.css'

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import Image from 'next/image';
import MyButton from '../utils/MyButton';
import { mobile, textShadow } from '../utils/variables';
import { sliderImages } from '../utils/localdb';




export default function DivCarouselMobile({ lightHead, darkHead, backgroundImage, sliderContent = [], button, category }) {

  const [containerStyle, setContainerStyle] = useState({ width: "90%", borderRadius: "100px 0 0 100px", })
  const [subHeadStyle, setsubHeadStyle] = useState({ display: 'flex' })
  const [sliderStyle, setSliderStyle] = useState({ width: '100%' })
  const [slides, setSlides] = useState(4.5)
  const [center, setcenter] = useState(true)

  const [buttonFocus, setButtonFocus] = useState(false)

  const slideRef = useRef()
  const containerRef = useRef()

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(mobile())
  }, [])


  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        backgroundImage: backgroundImage ? `linear-gradient(to bottom, rgba(0, 0, 0, 0.75) 0%, rgba(0, 0, 0, 0.4) 50%, rgba(0, 0, 0, 0.75) 100%), url(${backgroundImage})` : 'none',
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: "center bottom",
        backgroundRepeat: 'no-repeat',
        float: 'right',
        position: 'relative',
        marginBottom: isMobile ? '2.5rem' : "3.5rem",
        padding: '2.5rem 0'
      }}
    >
      <div
        style={{
          ...subHeadStyle,
          // backgroundColor: 'yellow',
          paddingLeft: isMobile ? "2.5rem" : '4.5rem',
          alignItems: 'center',
          zIndex: 2,
          paddingTop: "2rem"
        }}
      >

        <div style={{ zIndex: 2 }}>

          <h1
            data-aos="fade-up"
            data-aos-duration="1000"
            style={{ color: 'white', fontWeight: 900, lineHeight: 1.1, marginBottom: 20 }}>
            {lightHead} {darkHead && <span style={{ color: '#ccc' }}>{darkHead}</span>}
          </h1>

          <div
            data-aos="fade-up"
            data-aos-duration="1000"
            style={{ width: 'fit-content' }}>
            <MyButton name={button.name} slug={button.slug} />
          </div>

        </div>
      </div>

      <div style={{ display: 'flex', width: '100%', position: 'relative' }} >


        {/* for carousel */}
        <div
          style={sliderStyle}

        >
          <Swiper
            style={{ padding: `${isMobile ? .5 : 2.5}rem 10px`, "--swiper-navigation-color": "#fff", transition: 'ease-out' }}
            ref={slideRef}
            effect={"coverflow"}
            grabCursor={true}
            navigation={isMobile ? false : true}
            modules={[Pagination, Navigation]}
            slidesPerView={"auto"}
            spaceBetween={isMobile ? 10 : 15}
            rewind
            speed={1500}

          >
            {sliderContent.map((item, index) => (
              <SwiperSlide style={{ width: isMobile ? 210 : 270, height: isMobile ? 250 : 350 }} key={index} className='singleSwiper'>
                <Link href={item.slug}>
                  <div style={{
                    width: isMobile ? 210 : 270,
                    height: isMobile ? 250 : 350,
                    position: 'relative',
                    borderRadius: isMobile ? 25 : 50,
                    overflow: 'hidden'
                  }}>
                    <Image
                      src={item.thumbnail || null}
                      alt={item.name}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover', zIndex: -1 }}
                    />
                    <div style={{
                      position: 'absolute',
                      bottom: 0,
                      left: 0,
                      width: '100%',
                      background: 'linear-gradient(to top, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.4) 60%, rgba(0, 0, 0, 0) 100%)',
                      padding: isMobile ? '2.5rem 1rem 1rem 1rem' : '3.5rem 1.5rem 1.5rem 1.5rem',
                      boxSizing: 'border-box'
                    }}>
                      <h1 style={{
                        color: 'white',
                        fontWeight: 700,
                        fontSize: isMobile ? "1.05rem" : "1.25rem",
                        lineHeight: '1.3',
                        textShadow: textShadow,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                      }}>
                        {item.title || item.name}
                      </h1>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  )
}
