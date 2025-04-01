"use client"
import React from 'react'

import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { mobile } from '@/components/utils/variables';
import ContactForm from '@/components/master/ContactForm';

import dynamic from 'next/dynamic'
import SHeader from '@/components/skeleton/SHeader'
import SHome from '@/components/skeleton/SHome'
import Location from '@/components/master/Location';

const Menu = dynamic(() => import("@/components/master/header"), { ssr: false, loading: () => <SHeader /> })
const HeadImage = dynamic(() => import("@/components/master/HeadImage"), { ssr: false, loading: () => <SHome /> })


export default function ContactUsPage() {


    function Address({Address, Locate, Phone}) {
        return (
            <div style={{ background: "black", padding: '3%', flexDirection: 'column', display: 'flex', gap:"1.5rem",width:mobile() ?"100%":"50%" }}>
                <div style={{ display: 'flex', color: 'white', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <h2 style={{ color: "var(--primaryColor)",alignItems:'center', display:'flex', gap:5 }}><FiMapPin style={{ fontSize: 25 }} />Address</h2>
                    <p style={{ textAlign: 'center', lineHeight: '140%' }}>
                        {Address}
                    </p>
                    <hr style={{ width: '80%' }} />
                </div>
                <div style={{ display: 'flex', color: 'white', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    
                    <h2 style={{ color: "var(--primaryColor)", alignItems:'center', display:'flex', gap:5 }}><FiMail style={{ fontSize: 25 }} />Email</h2>
                    <p style={{ textAlign: 'center', lineHeight: '140%' }}>infomohiholidays@gmail.com</p>
                    <hr style={{ width: '80%' }} />
                </div>
                <div style={{ display: 'flex', color: 'white', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                    <h2 style={{ color: "var(--primaryColor)",alignItems:'center', display:'flex', gap:5 }}><FiPhone style={{ fontSize: 25 }} />Phone/WA:</h2>
                    <p style={{ textAlign: 'center', lineHeight: '140%' }}>7695032900</p>

                </div>
                <div>
                    <Location location={Locate}/>
                </div>
            </div>
        )
    }

    return (
        <main>
            <Menu />
            <HeadImage image='/contact us page.jpg' title={"Contact Us"} />
            <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--lightBackground)' }}>
                <div style={{ width: '90%', margin: "3rem 0" }}>
                    <h1 style={{ color: "grey" }}><span style={{ color: "var(--primaryColor)" }}>Connect</span> With Us</h1><br />
                    <p>We would love to respond to your queries and help you get the best packages for Andaman</p>
                    <p>{`Feel free to contact us 24/7 Our Executives are available for you.`}</p>
                    <br />
                    <br />
                    <div style={{ display: 'flex', flexDirection: mobile() ? "column" : "row",background: 'white' }}>
                        {/* <Address
                        Address={"Jalan Raya Uluwatu-1, No. 9, Jimbaran (Opposite Intercontinental Resort and Hotel), South Kuta, Badung, Bali-80361"}
                        Phone={"+62 877-5023-3546"}
                        Locate={"-8.778500839250647, 115.16906022755067"}
                        /> */}
                        <div style={{ padding: '3%', height: 'fit-content', width:mobile() ? '100%':'50%' }}>
                            <ContactForm
                                packageName={"Contact Us"}
                                packageDetail={"Message from Contact Us Page"}
                            />
                        </div>
                        <Address
                        Address={"11/2 SN Road Goal Ghar, Opposite Hotel Shreesh, Port Blair, South Andaman"}
                        Phone={"+91 9434282120"}
                        Locate={"11.662393665832786, 92.73356481403471"}
                        />


                    </div>

                </div>
            </div>
        </main>
    )
}
