"use client"
import React, { useEffect, useState } from 'react'

import { mobile } from '../utils/variables'
import Title from '../master/Title'

export default function Authorities() {

    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(mobile())
    }, [isMobile])

    function Element({ image, content, heading, service = false }) {
        const imgUrl = `/authorities/${image}`
        return (
            <div
                data-aos-anchor-placement="top-bottom"
                data-aos="fade-up"
                data-aos-duration="900"
                id='cardImage' style={{ width: isMobile&&!service?160: 270, height: service ? "auto" : 250, background: 'rgba(255,255,255, 0.7)', display: 'flex', flexDirection: 'column', alignItems: 'center', borderRadius: 10 }}>
                <div style={{ width: 120, height: 120, borderRadius: 100, boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)', display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: 20, background: 'white' }}>
                    <img src={imgUrl} alt={image} style={{ height: service ? 50 : "auto" }} />
                </div>
                {service &&
                    <h2 style={{ marginTop: "20px" }}>{heading}</h2>
                }
                <p style={{ textAlign: 'center', padding: service ? '0 5%' : '0 3%', margin: "20px 0" }}>{content}</p>

            </div>
        )
    }

    return (
        <div style={{
            padding: "2rem 0 0 0",
            backgroundImage: "url('/authorities/auth background.png')",
            display: 'flex', flexDirection: 'column',
            alignItems: 'center',
            overflowY: 'hidden',
            background:"var(--lightBackground)"
        }}
        >
            <div style={{ display: 'flex', justifyContent: 'center', width:'100%'}}>
                <Title title='Accredited By' center/>
            </div>
            

            <div style={{
                display: "flex",
                gridGap: isMobile?20:30,
                padding: '0 0 2% 0',
                marginTop: isMobile ? '5%' : null,
                flexWrap: 'wrap',
                justifyContent: 'center'
            }}
            >

                <Element
                    image={"andamans5.png"}
                    content={"Accredited by local Andaman Tourism"}
                />
                <Element
                    image={"ministry.png"}
                    content={"Approved by ministry of Tourism, Govt. of India"}
                />
                <Element
                    image={"emerald.png"}
                    content={"Awarded by Dept. of Tourism, A&N Administration."}
                />
                <Element
                    image={"l EXPERTS.jpg"}
                    content={"LTC Package Experts"}
                />
                <Element
                    image={"About-msme.jpg"}
                    content={"Registered in Micro, Small & Medium Enterprises"}
                />
                <Element
                    image={"iatte.png"}
                    content={"Active Member, IATTE"}
                />

            </div>

            <div style={{
                marginTop: 30,
                backgroundImage: "url('/authorities/white background 3d box.webp')",
                width: '100%',
                backgroundSize: 'cover',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center',
                padding: "2rem 0",
                backgroundPositionY: 'top'
            }}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <Title title='Our Commitment' center/>
                </div>

                <div style={{
                    display: isMobile ? "flex" : 'grid',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gridGap: 30,
                    gridTemplateColumns: "repeat(3, auto)",
                    padding: '0 0 2% 0',
                    marginTop: isMobile ? '5%' : null
                }}
                >

                    <Element
                        image={"booking.svg"}
                        service
                        heading={"Instant Booking"}
                        content={"Get Instant booking voucher for your favourite service . No Delays, No wait"}
                    />
                    <Element
                        image={"telephone.svg"}
                        service
                        heading={"24 X 7 Helpline"}
                        content={"24×7 customer support for your Itinerary from our experienced Andaman operations staff"}
                    />
                    <Element
                        image={"gullak.svg"}
                        service
                        heading={"Guaranteed Savings"}
                        content={"Get best deals and offers for water Sports, sightseeing, ferry, Packages"}
                    />

                </div>
            </div>

        </div>
    )
}
