"use client"
import Link from 'next/link'
import React, { useEffect, useRef, useState } from 'react'


import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper/modules";
// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


import Image from 'next/image';

import MyButton from '../utils/MyButton';
import { mobile, textShadow } from '../utils/variables';





export default function DivCarousel({ lightHead, darkHead, backgroundImage, sliderContent = [], button, category }) {

  const [containerStyle, setContainerStyle] = useState({ width: "90%", borderRadius: "100px 0 0 100px", })
  const [subHeadStyle, setsubHeadStyle] = useState({ display: 'flex' })
  const [sliderStyle, setSliderStyle] = useState({ width: '100%' })
  const [slides, setSlides] = useState(4.5)
  const [center, setcenter] = useState(true)

  const slideRef = useRef()
  const containerRef = useRef()


  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(mobile())
  }, [isMobile])


  return (
    <div
      ref={containerRef}
      style={{
        ...containerStyle,
        backgroundImage: `linear-gradient(90deg, #000000 0%, rgba(190,190,190,0) 50%, #000000 100%), 
                          url(${backgroundImage})`,
        backgroundAttachment: 'fixed',
        backgroundSize: 'cover',
        backgroundPosition: "center bottom",
        padding: '2.8rem 0',
        backgroundRepeat: 'no-repeat',
        float: 'right',
        position: 'relative',
        marginBottom: "3.5rem",
        transition: 'all .5s'

      }}
    >
      <div
        style={{ display: isMobile ? "block" : 'flex', width: '100%', position: 'relative' }}
      >

        <div
          style={{
            ...subHeadStyle,
            width: isMobile ? "50%" : '35%',
            height: '100%',
            // backgroundColor: 'yellow',
            paddingLeft: isMobile ? "2.5rem" : '4.5rem',
            position: isMobile ? "relative" : 'absolute',
            alignItems: 'center',
            zIndex: 2,

          }}
        >
          <div>

            <h1
              data-aos="fade-up"
              data-aos-duration="1000"
              style={{ color: 'white', fontWeight: 900, lineHeight: 1.1, marginBottom: isMobile ? 25 : 40 }}>
              {lightHead} <span style={{ color: 'white' }}>{darkHead}</span>
            </h1>
            <div style={{ width: 'fit-content' }}>
              {category=="destination"&&
              <MyButton name={button.name} slug={button.slug} />
              }
            </div>
          </div>
        </div>

        {/* for carousel */}
        <div
          style={sliderStyle}

        >
          <Swiper
            style={{ padding: isMobile ? "3rem 0 1.5rem 10px" : "2.5rem 0", "--swiper-navigation-color": "#fff", transition: "ease-out" }}
            ref={slideRef}
            effect={"coverflow"}
            grabCursor={true}
            navigation={true}
            modules={[Pagination, Navigation]}
            centeredSlides={isMobile ? false : center}
            slidesPerView={slides}
            spaceBetween={isMobile ? 10 : 15}
            speed={1500}
            onSlideChange={(e) => {
              if (e.activeIndex > 0) {
                // setcenter(false)
                setSlides(4.8)
                setContainerStyle({ width: '100%', borderRadius: "0px", })
                setsubHeadStyle({ display: isMobile ? "block" : "none" })

              } else {
                setContainerStyle({ width: '90%', borderRadius: "100px 0 0 100px" })
                setsubHeadStyle({ display: "flex" })
                setSlides(4.3)
                // setcenter(true)
              }
            }}
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
                      alt={item.name || item.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      style={{ objectFit: 'cover', zIndex: -1 }}
                      loading='lazy'
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
