"use client"
import React, { useState } from 'react'

import { FiMail, FiMapPin, FiPhone } from 'react-icons/fi';
import { mobile } from '@/components/utils/variables';

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
                marginTop: '3rem'
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

    function InlineContactForm() {
        const [form, setForm] = useState({ name: '', email: '', phone: '', query: '', message: '' });
        const [submitted, setSubmitted] = useState(false);

        const inputStyle = {
            width: '100%',
            padding: '0.45rem 0.75rem',
            border: '1.5px solid #d9d9d9',
            borderRadius: '0.4rem',
            fontSize: '0.85rem',
            color: '#222',
            background: '#f0fbff',
            outline: 'none',
            boxSizing: 'border-box',
            fontFamily: 'inherit',
            transition: 'border-color 0.2s',
        };

        const requiredStar = <span style={{ color: 'var(--primaryColor)', fontWeight: 700, fontSize: '0.75rem' }}>*</span>;

        function handleChange(e) {
            setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
        }

        function handleSubmit(e) {
            e.preventDefault();
            const body = `Name: ${form.name}%0AEmail: ${form.email}%0APhone: ${form.phone}%0AQuery: ${form.query}%0AMessage: ${form.message}`;
            window.open(`mailto:infomohiholidays@gmail.com?subject=Contact Us - ${form.query || 'General'}&body=${body}`, '_blank');
            setSubmitted(true);
        }

        if (submitted) return (
            <div style={{ textAlign: 'center', padding: '1.2rem 0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
                <h3 style={{ fontWeight: 700, color: 'var(--primaryColor)', margin: '0 0 0.3rem', fontSize: '1rem' }}>Message Sent!</h3>
                <p style={{ color: '#555', fontSize: '0.85rem' }}>We'll get back to you within 24 hours.</p>
                <button onClick={() => setSubmitted(false)} style={{
                    marginTop: '1rem', background: 'var(--primaryColor)', color: 'white',
                    border: 'none', borderRadius: '3rem', padding: '0.5rem 1.4rem',
                    fontWeight: 600, cursor: 'pointer', fontSize: '0.85rem',
                }}>Send another</button>
            </div>
        );

        return (
            <form onSubmit={handleSubmit}>
                <h3 style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--primaryColor)', margin: '0 0 0.8rem' }}>Your details</h3>

                {/* Name */}
                <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.15rem' }}>{requiredStar}</div>
                    <input required name="name" value={form.name} onChange={handleChange}
                        placeholder="Name" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                        onBlur={e => e.target.style.borderColor = '#d9d9d9'} />
                </div>

                {/* Email */}
                <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.15rem' }}>{requiredStar}</div>
                    <input required type="email" name="email" value={form.email} onChange={handleChange}
                        placeholder="Email" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                        onBlur={e => e.target.style.borderColor = '#d9d9d9'} />
                </div>

                {/* Phone */}
                <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.15rem' }}>{requiredStar}</div>
                    <input required type="tel" name="phone" value={form.phone} onChange={handleChange}
                        placeholder="Phone" style={inputStyle}
                        onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                        onBlur={e => e.target.style.borderColor = '#d9d9d9'} />
                </div>

                {/* Query dropdown */}
                <div style={{ marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.15rem' }}>{requiredStar}</div>
                    <select required name="query" value={form.query} onChange={handleChange}
                        style={{
                            ...inputStyle, appearance: 'none', cursor: 'pointer',
                            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%2315aee8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`,
                            backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.75rem center',
                        }}
                        onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                        onBlur={e => e.target.style.borderColor = '#d9d9d9'}>
                        <option value="" disabled>Choose Your Query</option>
                        <option value="Package Enquiry">Package Enquiry</option>
                        <option value="Booking Support">Booking Support</option>
                        <option value="Cancellation / Refund">Cancellation / Refund</option>
                        <option value="Ferry / Activity Booking">Ferry / Activity Booking</option>
                        <option value="General">General</option>
                    </select>
                </div>

                {/* Message */}
                <div style={{ marginBottom: '1rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.15rem' }}>{requiredStar}</div>
                    <textarea required name="message" value={form.message} onChange={handleChange}
                        placeholder="What's on your mind?" rows={3}
                        style={{ ...inputStyle, resize: 'vertical' }}
                        onFocus={e => e.target.style.borderColor = 'var(--primaryColor)'}
                        onBlur={e => e.target.style.borderColor = '#d9d9d9'} />
                </div>

                {/* Submit */}
                <button type="submit" style={{
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    background: 'var(--primaryColor)', color: 'white', border: 'none',
                    borderRadius: '3rem', padding: '0.6rem 1.5rem',
                    fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                    transition: 'background 0.2s, transform 0.15s',
                }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#0d95cc'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--primaryColor)'; e.currentTarget.style.transform = 'none'; }}>
                    Submit <span style={{ fontSize: '1rem' }}>→</span>
                </button>
            </form>
        );
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

                        {/* Right: Inline Form */}
                        <div style={{ flex: '1 1 400px' }}>
                            <div style={{ background: 'white', borderRadius: '1rem', padding: '2rem 2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                                <InlineContactForm />
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
