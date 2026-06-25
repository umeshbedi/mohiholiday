"use client"

import React, { useEffect, useState } from 'react'

import Head from 'next/head'
import { Button, Divider, Empty, Modal, Skeleton } from 'antd'

import Link from 'next/link'

import Image from 'next/image'
import { db } from '@/firebase'
import { boxShadow, mobile } from '@/components/utils/variables'
import ContactForm from '@/components/master/ContactForm'
import String2Html from '@/components/master/String2Html'
import dynamic from 'next/dynamic'
import SHeader from '@/components/skeleton/SHeader'
import SHome from '@/components/skeleton/SHome'

import Tile from '@/components/master/SingleTile'
import FAQ from '@/components/master/FAQ'
import { 
    ArrowRightOutlined, 
    HeartOutlined, 
    HeartFilled, 
    ClockCircleOutlined, 
    StarFilled 
} from '@ant-design/icons';

function OtherActivityCard({ item }) {
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
        <div className="w-full max-w-[300px] bg-white rounded-[20px] shadow-md overflow-hidden border border-gray-100 flex flex-col group mb-6 transition-all duration-300 hover:shadow-xl">
            {/* Image Section */}
            <div className="relative w-full h-[180px] overflow-hidden">
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
                    className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform duration-200"
                >
                    {isFavorite ? (
                        <HeartFilled className="text-red-500 text-sm" />
                    ) : (
                        <HeartOutlined className="text-gray-400 hover:text-red-500 text-sm transition-colors" />
                    )}
                </button>

                {/* Rating Stars */}
                <div className="absolute bottom-10 left-3 z-10 flex gap-0.5">
                    {Array.from({ length: rating }).map((_, idx) => (
                        <StarFilled key={idx} className="text-yellow-400 text-xs" />
                    ))}
                </div>

                {/* Badges */}
                {certified && (
                    <div className="absolute bottom-2.5 left-3 z-10 bg-[rgba(5,35,50,0.85)] text-white text-[10px] px-2.5 py-0.5 rounded-full font-bold tracking-wide border border-white/10 backdrop-blur-[2px]">
                        Certified
                    </div>
                )}

                <div className="absolute bottom-2.5 right-3 z-10 bg-[rgba(255,255,255,0.9)] text-gray-800 text-[10px] px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1 shadow-sm backdrop-blur-[2px]">
                    <ClockCircleOutlined className="text-gray-600" /> {duration}
                </div>
            </div>

            {/* Content Area */}
            <div className="p-4 flex flex-col flex-grow justify-between gap-2.5 text-left">
                <div>
                    {/* Title */}
                    <h3 className="text-gray-950 font-extrabold text-[0.95rem] leading-snug line-clamp-2 h-[2.5rem] group-hover:text-[var(--primaryColor)] transition-colors duration-200" title={item.title}>
                        {item.title}
                    </h3>

                    {/* Price and Discount */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-1">
                            <span className="text-gray-400 line-through text-[10px] font-semibold">₹{originalPrice}</span>
                            <span className="text-gray-900 font-extrabold text-base">₹{price}</span>
                        </div>
                        {discount && (
                            <span className="bg-black text-white px-2 py-0.5 rounded-full text-[9px] font-bold">
                                {discount}
                            </span>
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-gray-500 text-[11px] leading-relaxed line-clamp-2 mt-2 font-normal h-[2.0rem]">
                        {item.metaDescription || (item.about ? item.about.replace(/<[^>]*>/g, '').slice(0, 80) : '')}
                    </p>
                </div>

                {/* Book Now Button */}
                <Link href={item.slug} className="block mt-1">
                    <button className="w-full bg-[var(--primaryColor)] hover:bg-[#0f9cd3] text-white font-extrabold py-2.5 px-4 rounded-full flex items-center justify-between transition-all duration-300 shadow-md hover:shadow-lg shadow-blue-500/10">
                        <span className="tracking-wider text-[10px] font-black text-white">BOOK NOW</span>
                        <span className="w-5 h-5 rounded-full bg-white flex items-center justify-center text-[var(--primaryColor)] font-bold">
                            <ArrowRightOutlined className="text-[9px] font-black" />
                        </span>
                    </button>
                </Link>
            </div>
        </div>
    );
}

export default function SingleActivity({ data, sortedData, parentActivity }) {

  // console.log(data)
  const [open, setOpen] = useState(false)

  const [activityDetails, setActivityDetails] = useState({})

  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    setIsMobile(mobile())
  }, [isMobile])

  if (data == undefined) return <Skeleton active style={{ marginTop: '3%' }} />

  return (
    <>
        <div
          className='backCurve5'
          style={{ display: 'flex', justifyContent: 'center', }} id='packageContainer'>
          <div style={{ width: '90%', display: mobile() ? "block" : "flex", gap: '4%', marginTop: '3%' }}>
            <div
              style={{ width: mobile() ? '100%' : "70%", background: 'white', padding: '3%', display: 'flex', flexDirection: 'column', gap: 15 }}>
              <h1>{data.title}</h1>
              <Divider style={{ margin: "0", backgroundColor: "var(--lightGreyColor)", height: 1 }} />
              <String2Html id={'aboutIsland'} string={data.about} />
              <FAQ faqData={data.faqs} />
            </div>

            <div style={{ width: mobile() ? '100%' : '30%', background: 'white', padding: '3%', height: 'fit-content', flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
              <h2 style={{ textAlign: 'center', marginBottom: '1rem', fontWeight: 800 }}>Visit Other Activities of {parentActivity}</h2>
              <Divider style={{ backgroundColor: "var(--lightGreyColor)", height: 1, marginBottom: '1.5rem' }} />
              {sortedData.map((item, i) => (
                <div
                  data-aos="fade-up"
                  data-aos-anchor-placement="top-bottom"
                  data-aos-duration="2000"
                  key={i}>
                  <OtherActivityCard item={item} />
                </div>
              ))}
            </div>
          </div>
        </div>

      

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={[]}
      >
        <h2>Booking:</h2>
        <Divider style={{ margin: '1%' }} />
        <h1 style={{ margin: '1% 0', fontSize: '2rem' }}>₹{activityDetails.price}</h1>
        <ContactForm
          to={'activity'}
          packageName={data.name}
          packageDetail={`
          <p>Activity Name: ${activityDetails.name}</p>
          <p>Price: ₹${activityDetails.price}</p>
          <p>Duration: ${activityDetails.duration}</p>
        `}
        />
      </Modal>

    </>
  )
}

// export async function getStaticPaths() {
//   const allpaths = []
//   db.collection("activityAndaman").get().then((snap) => {
//     snap.forEach((sndata) => {
//       sndata.data().data.map(dta => {
//         allpaths.push(dta.slug)
//       })
//     })
//   })
//   db.collection("activityBali").get().then((snap) => {
//     snap.forEach((sndata) => {
//       sndata.data().data.map(dta => {
//         allpaths.push(dta.slug)
//       })
//     })
//   })


//   return {
//     paths: allpaths.map((path) => (
//       { params: { ActivityName: path } }
//     )),
//     fallback: true
//   }
// }

// export const getStaticProps = async (context) => {
//   const { activityPlace, ActivityName } = context.params;

//   const res = await db.collection(`activity${activityPlace}`).where("slug", "==", `/activity/${activityPlace}/${ActivityName}`).get()
//   const entry = res.docs.map((entry) => {
//     return ({ id: entry.id, ...entry.data() })
//   });

//   const resAll = await db.collection(`${activityPlace == "Andaman" ? "activityAndaman" : "activityBali"}`).get()
//   // console.log(resAll.size)

//   const entryAll = resAll.docs.map((entry) => {
//     return ({ id: entry.id, ...entry.data() })
//   });

//   let sortedData = []

//   function GetRand(num) {
//     var ran = Math.floor(Math.random() * num)
//     if (num > 4 && num - ran >= 4) {
//       for (let index = 0; index < 4; index++) {
//         sortedData.push(entryAll[ran])
//         ran += 1

//       }
//     }
//     else if (num <= 4) {
//       for (let index = 0; index < num; index++) {
//         sortedData.push(entryAll[index])
//       }
//     }
//     else { GetRand(num) }
//   }

//   GetRand(entryAll.length)

//   if (entry.length == 0) {
//     return {
//       notFound: true
//     };
//   }

//   return {
//     props: {
//       data: entry[0],
//       sortedData
//     },
//     revalidate: 60,

//   }

// }
