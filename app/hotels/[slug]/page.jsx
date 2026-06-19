"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { db } from '@/firebase'
import SHeader from '@/components/skeleton/SHeader'

const Menu = dynamic(() => import("@/components/master/header"), { ssr: false, loading: () => <SHeader /> })
const Footer = dynamic(() => import("@/components/master/Footer"), { ssr: false })

const AMENITY_ICONS = {
    restaurant: { icon: '🍽️', label: 'Restaurant' },
    wifi: { icon: '📶', label: 'Free WiFi' },
    parking: { icon: '🅿️', label: 'Parking' },
    pool: { icon: '🏊', label: 'Swimming Pool' },
    bar: { icon: '🍸', label: 'Bar' },
    gym: { icon: '🏋️', label: 'Gym' },
    spa: { icon: '💆', label: 'Spa' },
    ac: { icon: '❄️', label: 'Air Conditioning' },
    roomservice: { icon: '🛎️', label: 'Room Service' },
    laundry: { icon: '👕', label: 'Laundry' },
    airport: { icon: '✈️', label: 'Airport Transfer' },
    beach: { icon: '🏖️', label: 'Beach Access' },
}

function StarRating({ rating }) {
    return (
        <span style={{ letterSpacing: 2 }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < rating ? '#f5a623' : '#ddd', fontSize: '1.3rem' }}>★</span>
            ))}
        </span>
    )
}

export default function HotelDetailPage() {
    const { slug } = useParams()
    const [hotel, setHotel] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        if (!slug) return
        db.collection('hotels')
            .where('slug', '==', slug)
            .where('published', '==', true)
            .limit(1)
            .get()
            .then(snap => {
                if (snap.empty) setNotFound(true)
                else setHotel({ id: snap.docs[0].id, ...snap.docs[0].data() })
                setLoading(false)
            })
            .catch(() => { setNotFound(true); setLoading(false) })
    }, [slug])

    if (loading) return (
        <main>
            <Menu />
            <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center', color: '#aaa' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🏨</div>
                    <p style={{ fontSize: '1rem' }}>Loading hotel details…</p>
                </div>
            </div>
            <Footer />
        </main>
    )

    if (notFound || !hotel) return (
        <main>
            <Menu />
            <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏨</div>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', marginBottom: '0.5rem' }}>Hotel Not Found</h1>
                <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>This hotel doesn't exist or has been removed.</p>
                <Link href="/hotels" style={{
                    background: 'var(--primaryColor)', color: 'white',
                    padding: '0.65rem 1.8rem', borderRadius: '3rem',
                    fontWeight: 700, fontSize: '0.95rem',
                }}>← Back to Hotels</Link>
            </div>
            <Footer />
        </main>
    )

    return (
        <main>
            <Menu />

            {/* Hero cover */}
            <div style={{ width: '100%', height: 'clamp(260px, 48vh, 500px)', overflow: 'hidden', position: 'relative' }}>
                {hotel.coverImage ? (
                    <img src={hotel.coverImage} alt={hotel.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                    <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #8eafc5, #5a7d96)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '6rem' }}>🏨</div>
                )}
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)' }} />

                {/* Badge */}
                {hotel.badge && (
                    <div style={{
                        position: 'absolute', bottom: 150, left: '50%', transform: 'translateX(-50%)',
                        background: 'white', borderRadius: '2rem', padding: '4px 18px',
                        fontWeight: 700, fontSize: '0.8rem', boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                    }}>{hotel.badge}</div>
                )}

                {/* Name overlay */}
                <div style={{ position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: 860, textAlign: 'center' }}>
                    <h1 style={{ color: 'white', fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 900, lineHeight: 1.2, textShadow: '0 2px 16px rgba(0,0,0,0.5)', margin: 0 }}>
                        {hotel.name}
                    </h1>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 8 }}>
                        <span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>📍 {hotel.location}</span>
                        <StarRating rating={hotel.rating || 0} />
                    </div>
                </div>
            </div>

            {/* Body */}
            <div style={{ background: 'var(--lightBackground)', padding: '3rem 0 5rem' }}>
                <div style={{ width: '90%', maxWidth: 960, margin: '0 auto' }}>

                    {/* Back link */}
                    <Link href="/hotels" style={{
                        color: 'var(--primaryColor)', fontWeight: 600, fontSize: '0.9rem',
                        display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: '2rem',
                    }}>← All Hotels</Link>

                    {/* Info cards row */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: '2rem' }}>
                        <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>📍</div>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', marginBottom: 2 }}>Location</div>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#111' }}>{hotel.location}</div>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>⭐</div>
                            <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', marginBottom: 4 }}>Star Rating</div>
                            <StarRating rating={hotel.rating || 0} />
                        </div>
                        {hotel.roomTypes?.length > 0 && (
                            <div style={{ background: '#fff', borderRadius: '1rem', padding: '1.25rem', textAlign: 'center', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                                <div style={{ fontSize: '1.8rem', marginBottom: 4 }}>🛏️</div>
                                <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#555', marginBottom: 4 }}>Room Types</div>
                                <div style={{ fontSize: '0.82rem', color: '#777', lineHeight: 1.6 }}>
                                    {hotel.roomTypes.join(' · ')}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Description */}
                    {hotel.description && (
                        <p style={{
                            fontSize: '1.05rem', color: '#555', lineHeight: 1.75,
                            fontStyle: 'italic', marginBottom: '2rem',
                            padding: '1rem 1.5rem', background: '#e8f6fd',
                            borderLeft: '4px solid var(--primaryColor)',
                            borderRadius: '0 0.75rem 0.75rem 0',
                        }}>{hotel.description}</p>
                    )}

                    {/* Amenities */}
                    {hotel.amenities?.length > 0 && (
                        <div style={{ background: '#fff', borderRadius: '1.25rem', padding: '1.5rem 2rem', marginBottom: '2rem', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#111', marginBottom: '1rem' }}>Hotel Amenities</h2>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16 }}>
                                {hotel.amenities.map(a => {
                                    const info = AMENITY_ICONS[a] || { icon: '✓', label: a }
                                    return (
                                        <div key={a} style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#f8fbff', padding: '8px 14px', borderRadius: '3rem', border: '1px solid #e0f0ff' }}>
                                            <span style={{ fontSize: '1.2rem' }}>{info.icon}</span>
                                            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#444' }}>{info.label}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    {/* Rich content */}
                    {hotel.content && (
                        <article className="contentDiv blog-content" style={{
                            background: '#fff', borderRadius: '1.25rem',
                            padding: 'clamp(1.5rem, 4vw, 2.5rem)',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                            fontSize: '1.05rem', lineHeight: 1.8, color: '#222',
                            marginBottom: '2rem',
                        }} dangerouslySetInnerHTML={{ __html: hotel.content }} />
                    )}

                    {/* CTA */}
                    <div style={{ textAlign: 'center', background: '#fff', borderRadius: '1.25rem', padding: '2.5rem', boxShadow: '0 2px 16px rgba(0,0,0,0.06)' }}>
                        <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🏝️</div>
                        <h2 style={{ fontWeight: 800, color: '#111', marginBottom: '0.5rem' }}>Ready to Book {hotel.name}?</h2>
                        <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
                            Contact our team and we'll handle everything — bookings, transfers, and island experiences.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                            <a href="https://wa.me/917695032900" target="_blank" rel="noreferrer" style={{
                                background: '#25d366', color: 'white', padding: '0.75rem 2rem',
                                borderRadius: '3rem', fontWeight: 700, fontSize: '0.95rem',
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                boxShadow: '0 4px 16px rgba(37,211,102,0.3)',
                                transition: 'transform 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                            >💬 WhatsApp Us</a>
                            <Link href="/contact-us" style={{
                                background: 'var(--primaryColor)', color: 'white', padding: '0.75rem 2rem',
                                borderRadius: '3rem', fontWeight: 700, fontSize: '0.95rem',
                                display: 'inline-flex', alignItems: 'center', gap: 8,
                                boxShadow: '0 4px 16px rgba(21,174,232,0.3)',
                                transition: 'transform 0.2s',
                            }}
                                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                                onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                            >✉️ Contact Us</Link>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
