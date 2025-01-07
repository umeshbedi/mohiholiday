"use client"
import style from '@/styles/Home.module.css'
import Image from 'next/image'
import { FaMap, FaUser } from 'react-icons/fa'
import { CarFilled } from '@ant-design/icons'
import { boxShadow, mobile } from "@/components/utils/variables";
import { Divider, Modal } from "antd";
import React, { useState } from "react";
import ContactForm from '@/components/master/ContactForm'


export default function SingleCab({ thumbnail, title, price, distance }) {

    const [open, setOpen] = useState(false)

    function Icons({ icon = <></>, title = "" }) {
        return (
            <div className='text-gray-500 bg-white border rounded-full flex gap-2 items-center px-3'>
                {icon}
                <p className=' text-base'>{title}</p>
            </div>
        )
    }

    return (
        <div
            data-aos-anchor-placement="top-bottom"
            data-aos="fade-up"
            data-aos-duration="1000"
            style={{ backgroundColor: 'white', borderRadius: 30, boxShadow: boxShadow, margin: "0 20px 20px 20px" }}>
            <div
                style={{
                    width: "100%",
                    display: mobile() ? "block" : 'flex',
                    gap: "3%",
                    padding: mobile() ? "20px 20px 0 20px" : "20px 0 0 20px"
                }}
            >
                <div style={{ width: mobile() ? "100%" : "15%", display: 'flex', justifyContent: 'center', marginBottom: mobile() ? "1.5rem" : null }}>
                    <div style={{ width: mobile() ? 200 : 100, position: 'relative', height: mobile() ? 200 : 100 }}>
                        <Image src={thumbnail} fill style={{ objectFit: 'cover', borderRadius: 20 }} />
                    </div>

                </div>

                <div style={{ width: mobile() ? "100%" : "60%" }}>
                    <h2 style={{ fontWeight: 600, fontSize: "1.3rem", textAlign: mobile() ? "center" : null }}>{title}</h2>

                    <div style={{ width: '100%', position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'yellow', marginTop: "2rem" }}>
                        <div style={{ width: "90%", height: 1, background: '#98a6b3', position: 'absolute' }} />
                        <p style={{ position: 'absolute', alignSelf: 'center', background: 'white', border: "1px solid #98a6b3", borderRadius: 50, padding: "1px 15px", color: 'grey' }}>Distance: {distance} kms</p>
                    </div>
                </div>

                <div style={{ width: mobile() ? "100%" : "25%", flexDirection: 'column', display: "flex", justifyContent: 'space-between', borderLeft: mobile() ? null : "1px solid #e2e8ee", marginTop: mobile() ? "2.5rem" : null }}>
                    <div style={{ flexDirection: 'column', display: 'flex', alignItems: 'center' }}>
                        <h3>Offer Price:</h3>
                        <h1 style={{ fontSize: '2rem' }}>₹{price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</h1>
                    </div>
                    <div style={{ height: "3rem", width: '100%', background: "var(--primaryColor)", marginTop: "1.5rem", display: 'flex', alignItems: "center", justifyContent: 'center', cursor: 'pointer', borderRadius: mobile() ? 50 : null }}
                        onClick={() => {
                            setOpen(true);
                            setActivityDetails({
                                name: title,
                                distance: distance,
                                price: `₹${price}`
                            })
                        }}
                    >
                        <p style={{ fontSize: "1.2rem", color: "white" }}>Book Now</p>
                    </div>

                </div>
            </div>

            <div style={{ width: mobile() ? "100%" : "75%", height: 1, background: '#e2e8ee', margin: "1rem 0" }} />
            <div style={{ display: "flex", gap: ".5rem", marginBottom: "1rem", marginLeft: "1rem", }}>
                
                <Icons icon={<FaMap />} title='Pickup'/>
                <Icons icon={<CarFilled />} title='Cab'/>
                <Icons icon={<FaUser />} title='Travel Executive'/>
                
            </div>


            {/* <Footer /> */}

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={[]}
            >
                <h2>Booking:</h2>
                <Divider style={{ margin: '1%' }} />
                {/* <h1 style={{ margin: '1% 0', fontSize: '2rem' }}>{activityDetails.price}</h1> */}
                {/* <ContactForm
                    to={'activity'}
                    packageName={`Cab | ${data.title}`}
                    packageDetail={`
          <p>Cab Name: ${activityDetails.name}</p>
          <p>Price: ${activityDetails.price}</p>
          <p>Distance: ${activityDetails.distance} kms</p>
        `}
                /> */}
            </Modal>

        </div>
    )
}