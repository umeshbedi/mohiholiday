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


    function Address({ Address, Locate, Phone }) {
        return (
            <div style={{
                display: 'flex',
                flexDirection: mobile() ? 'column' : 'row',
                width: '100%',
                background: 'black',
            }}>
                {/* Contact details: Address, Email, Phone */}
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1.5rem',
                    padding: '3%',
                    width: mobile() ? '100%' : '50%',
                }}>
                    <div style={{ display: 'flex', color: 'white', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <h2 style={{ color: "var(--primaryColor)", alignItems: 'center', display: 'flex', gap: 5 }}><FiMapPin style={{ fontSize: 25 }} />Address</h2>
                        <p style={{ textAlign: 'center', lineHeight: '140%' }}>
                            {Address}
                        </p>
                        <hr style={{ width: '80%' }} />
                    </div>
                    <div style={{ display: 'flex', color: 'white', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <h2 style={{ color: "var(--primaryColor)", alignItems: 'center', display: 'flex', gap: 5 }}><FiMail style={{ fontSize: 25 }} />Email</h2>
                        <p style={{ textAlign: 'center', lineHeight: '140%' }}>infomohiholidays@gmail.com</p>
                        <hr style={{ width: '80%' }} />
                    </div>
                    <div style={{ display: 'flex', color: 'white', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                        <h2 style={{ color: "var(--primaryColor)", alignItems: 'center', display: 'flex', gap: 5 }}><FiPhone style={{ fontSize: 25 }} />Phone/WA:</h2>
                        <p style={{ textAlign: 'center', lineHeight: '140%' }}>7695032900</p>
                    </div>
                </div>

                {/* Map */}
                <div style={{ width: mobile() ? '100%' : '50%', minHeight: 300 }}>
                    <iframe
                        src="https://maps.google.com/maps?q=11.662398942228341,92.73098987458573&z=17&output=embed"
                        width="100%"
                        height="100%"
                        style={{ border: 0, display: 'block', minHeight: 300 }}
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                    />
                </div>
            </div>
        )
    }

    return (
        <main>
            <Menu />
            <HeadImage image='/contact us page.jpg' title={"Contact Us"} isHalf />

            {/* Urgent Support Banner */}
            <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 1rem', background: 'var(--lightBackground)' }}>
                <div style={{
                    background: 'var(--primaryColor)',
                    borderRadius: '1.5rem',
                    width: '90%',
                    maxWidth: 1100,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '2rem',
                    padding: '3rem 4rem',
                }}>
                    {/* Left text */}
                    <div style={{ flex: '1 1 300px' }}>
                        <h2 style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 900, color: 'white', margin: '0 0 1rem' }}>
                            Need Urgent<br />Support?
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', lineHeight: '1.6', margin: 0, maxWidth: 360 }}>
                            Reach out by call, WhatsApp, or email – choose what's convenient, and our team will step in immediately to support you.
                        </p>
                    </div>

                    {/* Right buttons */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: '0 1 auto' }}>
                        {[
                            { label: 'Call Us Instantly', href: 'tel:7695032900' },
                            { label: 'WhatsApp Us', href: 'https://wa.me/917695032900' },
                            { label: 'Drop Us an Email', href: 'mailto:infomohiholidays@gmail.com' },
                        ].map(({ label, href }) => (
                            <a key={label} href={href} style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                background: 'white',
                                color: 'var(--primaryColor)',
                                textDecoration: 'none',
                                borderRadius: '3rem',
                                padding: '0.85rem 1rem 0.85rem 1.75rem',
                                fontWeight: 600,
                                fontSize: '1rem',
                                minWidth: 260,
                                gap: '1.5rem',
                                transition: 'background 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#e0f7fd'}
                                onMouseLeave={e => e.currentTarget.style.background = 'white'}
                            >
                                {label}
                                <span style={{
                                    background: 'var(--primaryColor)',
                                    borderRadius: '50%',
                                    width: 36, height: 36,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white',
                                    fontWeight: 700,
                                    fontSize: '1.1rem',
                                    flexShrink: 0,
                                }}>→</span>
                            </a>
                        ))}
                    </div>
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', background: 'var(--lightBackground)', padding: '4rem 0' }}>
                <div style={{ width: '90%', maxWidth: 1200 }}>
                    <div style={{
                        display: 'flex',
                        flexDirection: mobile() ? 'column' : 'row',
                        gap: '4rem',
                        alignItems: 'flex-start',
                    }}>
                        {/* Left: Intro copy */}
                        <div style={{ flex: '1 1 380px', maxWidth: mobile() ? '100%' : 480 }}>
                            {/* Badge */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                                <div style={{
                                    width: 48, height: 48,
                                    borderRadius: '50%',
                                    border: '2px solid #111',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '1.4rem',
                                }}>🎧</div>
                                <span style={{
                                    fontWeight: 700,
                                    fontSize: '0.78rem',
                                    letterSpacing: '0.12em',
                                    textTransform: 'uppercase',
                                    color: '#111',
                                }}>Real Humans, Real Help</span>
                            </div>

                            {/* Heading */}
                            <h1 style={{
                                fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
                                fontWeight: 900,
                                color: '#111',
                                lineHeight: 1.1,
                                margin: '0 0 1.5rem',
                            }}>Write to us.</h1>

                            {/* Body copy */}
                            <p style={{
                                fontSize: '1rem',
                                color: '#444',
                                lineHeight: '1.7',
                                margin: 0,
                                maxWidth: 420,
                            }}>
                                Got a ferry to catch? An activity to book? Or just want to know where to eat
                                and chill on the islands? Drop us a message, we promise real humans will reply
                                within 24 hours (and maybe overshare island secrets).
                            </p>
                        </div>

                        {/* Right: Form + Address stacked */}
                        <div style={{ flex: '1 1 400px' }}>
                            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem', marginBottom: '1.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                                <ContactForm
                                    packageName={"Contact Us"}
                                    packageDetail={"Message from Contact Us Page"}
                                />
                            </div>

                        </div>
                    </div>

                    <Address
                        Address={"11/2 SN Road Goal Ghar, Opposite Hotel Shreesh, Port Blair, South Andaman"}
                        Phone={"+91 9434282120"}
                    />
                </div>
            </div>
        </main>
    )
}
