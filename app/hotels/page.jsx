"use client"
import React, { useEffect, useState, useMemo } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { db } from '@/firebase'
import SHeader from '@/components/skeleton/SHeader'
import SHome from '@/components/skeleton/SHome'

const Menu = dynamic(() => import("@/components/master/header"), { ssr: false, loading: () => <SHeader /> })
const HeadImage = dynamic(() => import("@/components/master/HeadImage"), { ssr: false, loading: () => <SHome /> })
const Footer = dynamic(() => import("@/components/master/Footer"), { ssr: false })

const LOCATIONS = [
    'Port Blair', 'Havelock Island', 'Neil Island', 'Little Andamans',
    'Diglipur (Ross and Smith Islands)', 'Butler Bay beach in Little Andaman',
    'Ross Island', 'Baratang Island', 'Long Island',
]

const AMENITY_ICONS = {
    restaurant: '🍽️', wifi: '📶', parking: '🅿️', pool: '🏊',
    bar: '🍸', gym: '🏋️', spa: '💆', ac: '❄️',
    roomservice: '🛎️', laundry: '👕', airport: '✈️', beach: '🏖️',
}

const ROOM_ICONS = {
    'Single': '🛏️', 'Double': '🛏️🛏️', 'Triple': '🛏️🛏️🛏️',
    'Suite': '👑', 'Family Room': '👨‍👩‍👧', 'Deluxe': '⭐', 'Cottage': '🏡', 'Villa': '🏰',
}

function StarRating({ rating }) {
    return (
        <span style={{ letterSpacing: 1 }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <span key={i} style={{ color: i < rating ? '#f5a623' : '#ddd', fontSize: '1rem' }}>★</span>
            ))}
        </span>
    )
}

function HotelCard({ hotel }) {
    return (
        <div style={{
            background: '#fff',
            borderRadius: '1.25rem',
            overflow: 'hidden',
            boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
            transition: 'transform 0.22s, box-shadow 0.22s',
            display: 'flex',
            flexDirection: 'column',
        }}
            onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-5px)'
                e.currentTarget.style.boxShadow = '0 12px 36px rgba(21,174,232,0.15)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.boxShadow = '0 2px 20px rgba(0,0,0,0.08)'
            }}
        >
            {/* Image + badge */}
            <div style={{ position: 'relative', height: 220, overflow: 'hidden', flexShrink: 0, background: '#e8f4ff' }}>
                {hotel.coverImage ? (
                    <img src={hotel.coverImage} alt={hotel.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.35s' }}
                        onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                    />
                ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem' }}>🏨</div>
                )}

                {/* Badge chip */}
                {hotel.badge && (
                    <div style={{
                        position: 'absolute', top: 14, left: '50%', transform: 'translateX(-50%)',
                        background: 'white', borderRadius: '2rem',
                        padding: '3px 14px', fontSize: '0.72rem', fontWeight: 700,
                        color: '#111', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                        whiteSpace: 'nowrap', letterSpacing: '0.04em',
                    }}>{hotel.badge}</div>
                )}

                {/* Amenity icons bar */}
                {hotel.amenities?.length > 0 && (
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        background: 'rgba(255,255,255,0.95)',
                        padding: '6px 14px',
                        display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap',
                    }}>
                        <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#555', marginRight: 4 }}>Features</span>
                        {hotel.amenities.slice(0, 8).map(a => (
                            <span key={a} style={{ fontSize: '1rem' }} title={a}>{AMENITY_ICONS[a] || '•'}</span>
                        ))}
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '1.1rem 1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#111', margin: 0, lineHeight: 1.3 }}>
                    {hotel.name}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontSize: '0.82rem', color: '#555', display: 'flex', alignItems: 'center', gap: 3 }}>
                        <span style={{ color: 'var(--primaryColor)' }}>📍</span> {hotel.location}
                    </span>
                    <StarRating rating={hotel.rating || 0} />
                </div>

                <p style={{
                    fontSize: '0.85rem', color: '#666', lineHeight: 1.55, margin: 0,
                    display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                    flex: 1,
                }}>{hotel.description}</p>

                {/* Room types */}
                {hotel.roomTypes?.length > 0 && (
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
                        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#888', marginRight: 6 }}>Rooms Space</span>
                        {hotel.roomTypes.slice(0, 5).map(r => (
                            <span key={r} title={r} style={{ marginRight: 4, fontSize: '0.9rem' }}>{ROOM_ICONS[r] || '🛏️'}</span>
                        ))}
                    </div>
                )}

                {/* CTA */}
                <Link href={`/hotels/${hotel.slug}`} style={{ marginTop: 4 }}>
                    <button style={{
                        width: '100%',
                        background: 'var(--primaryColor)',
                        color: 'white',
                        border: 'none',
                        borderRadius: '3rem',
                        padding: '0.6rem',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer',
                        transition: 'background 0.2s, transform 0.15s',
                        fontFamily: 'inherit',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = '#0d95cc'; e.currentTarget.style.transform = 'scale(1.02)' }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'var(--primaryColor)'; e.currentTarget.style.transform = 'none' }}
                    >
                        View Hotel
                    </button>
                </Link>
            </div>
        </div>
    )
}

function SkeletonCard() {
    return (
        <div style={{
            background: '#fff', borderRadius: '1.25rem', overflow: 'hidden',
            boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}>
            <div style={{ height: 220, background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
            <div style={{ padding: '1.1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ height: 18, background: '#f0f0f0', borderRadius: 6, width: '70%' }} />
                <div style={{ height: 14, background: '#f0f0f0', borderRadius: 6, width: '45%' }} />
                <div style={{ height: 40, background: '#f0f0f0', borderRadius: 6 }} />
                <div style={{ height: 36, background: '#e8f4ff', borderRadius: '3rem', marginTop: 6 }} />
            </div>
        </div>
    )
}

export default function HotelsPage() {
    const [hotels, setHotels] = useState([])
    const [loading, setLoading] = useState(true)
    const [filterRating, setFilterRating] = useState('')
    const [filterLocation, setFilterLocation] = useState('')
    const [ratingOpen, setRatingOpen] = useState(false)
    const [locationOpen, setLocationOpen] = useState(false)

    useEffect(() => {
        const unsub = db.collection('hotels').onSnapshot(snap => {
            const data = []
            snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
            const published = data
                .filter(h => h.published === true)
                .sort((a, b) => {
                    const at = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : 0
                    const bt = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : 0
                    return bt - at
                })
            setHotels(published)
            setLoading(false)
        }, err => { console.error(err); setLoading(false) })
        return () => unsub()
    }, [])

    const filtered = useMemo(() => {
        return hotels.filter(h => {
            const ratingOk = !filterRating
                || (filterRating === 'below3' && h.rating <= 2)
                || (filterRating === 'above3' && h.rating >= 3)
            const locationOk = !filterLocation || h.location === filterLocation
            return ratingOk && locationOk
        })
    }, [hotels, filterRating, filterLocation])

    const SelectDropdown = ({ label, open, setOpen, value, setValue, options }) => (
        <div style={{ position: 'relative', flex: 1 }}>
            <div onClick={() => { setOpen(o => !o); }}
                style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.7rem 1.1rem', background: '#fff', borderRadius: 8,
                    border: `1.5px solid ${open ? 'var(--primaryColor)' : '#e0e0e0'}`,
                    cursor: 'pointer', fontWeight: 500, fontSize: '0.9rem', color: value ? '#111' : '#999',
                    userSelect: 'none', minWidth: 200,
                }}>
                <span>{value ? (options.find(o => o.value === value)?.label || value) : label}</span>
                <span style={{ fontSize: '0.7rem', color: '#aaa', transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
            </div>
            {open && (
                <div style={{
                    position: 'absolute', top: 'calc(100% + 4px)', left: 0, right: 0, zIndex: 100,
                    background: '#fff', borderRadius: 8, boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
                    border: '1px solid #e8e8e8', overflow: 'hidden',
                }}>
                    <div onClick={() => { setValue(''); setOpen(false) }}
                        style={{
                            padding: '0.6rem 1rem', cursor: 'pointer', fontWeight: 600,
                            background: !value ? 'var(--primaryColor)' : '#fff',
                            color: !value ? 'white' : '#555', fontSize: '0.88rem',
                        }}>{label}</div>
                    {options.map(opt => (
                        <div key={opt.value} onClick={() => { setValue(opt.value); setOpen(false) }}
                            style={{
                                padding: '0.6rem 1rem', cursor: 'pointer',
                                background: value === opt.value ? 'var(--primaryColor)' : '#fff',
                                color: value === opt.value ? 'white' : '#333',
                                fontSize: '0.88rem',
                                transition: 'background 0.15s',
                            }}
                            onMouseEnter={e => { if (value !== opt.value) e.currentTarget.style.background = '#f0f9ff' }}
                            onMouseLeave={e => { if (value !== opt.value) e.currentTarget.style.background = '#fff' }}
                        >{opt.label}</div>
                    ))}
                </div>
            )}
        </div>
    )

    const ratingOptions = [
        { value: 'below3', label: '2 Stars & Below' },
        { value: 'above3', label: '3 Stars & Above' },
    ]

    const locationOptions = LOCATIONS.map(l => ({ value: l, label: l }))

    return (
        <main onClick={() => { setRatingOpen(false); setLocationOpen(false) }}>
            <Menu />

            {/* Hero with real background image */}
            <div style={{
                padding: '8rem 5% 3rem',
                textAlign: 'center',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
                minHeight: 340,
            }}>
                {/* Cover image */}
                <img
                    src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1600&q=80"
                    alt="Hotels in Andaman hero"
                    style={{
                        position: 'absolute', inset: 0,
                        width: '100%', height: '100%',
                        objectFit: 'cover', objectPosition: 'center',
                        pointerEvents: 'none',
                    }}
                />
                {/* Dark gradient overlay for readability */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(135deg, rgba(10,30,50,0.75) 0%, rgba(20,60,90,0.65) 50%, rgba(10,40,65,0.80) 100%)',
                    pointerEvents: 'none',
                }} />
                {/* Subtle dot texture */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)',
                    backgroundSize: '28px 28px',
                    pointerEvents: 'none',
                }} />

                {/* Content (above all overlays) */}
                <div style={{ position: 'relative', zIndex: 1 }}>
                    <h1 style={{
                        fontSize: 'clamp(2rem, 5vw, 3.5rem)', fontWeight: 900,
                        color: 'white', margin: '0 0 0.4rem',
                        textShadow: '0 3px 20px rgba(0,0,0,0.5)',
                        letterSpacing: '-0.5px',
                    }}>
                        Hotels in Andaman
                    </h1>
                    

                    {/* Filter card */}
                    <div onClick={e => e.stopPropagation()} style={{
                        background: 'white', borderRadius: '1.25rem',
                        padding: '1.5rem 2rem', marginTop: '2rem',
                        boxShadow: '0 8px 40px rgba(0,0,0,0.25)',
                        display: 'inline-block', minWidth: 'min(700px, 90vw)', textAlign: 'left',
                    }}>
                        <p style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--primaryColor)', margin: '0 0 1rem' }}>Filters</p>
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                            <SelectDropdown
                                label="--- Choose Rating ---"
                                open={ratingOpen} setOpen={setRatingOpen}
                                value={filterRating} setValue={setFilterRating}
                                options={ratingOptions}
                            />
                            <SelectDropdown
                                label="--- Choose Location ---"
                                open={locationOpen} setOpen={setLocationOpen}
                                value={filterLocation} setValue={setFilterLocation}
                                options={locationOptions}
                            />
                            <button onClick={() => { setFilterRating(''); setFilterLocation('') }}
                                style={{
                                    background: 'var(--primaryColor)', color: 'white', border: 'none',
                                    borderRadius: '50%', width: 44, height: 44, cursor: 'pointer',
                                    fontSize: '1.1rem', flexShrink: 0, display: 'flex',
                                    alignItems: 'center', justifyContent: 'center',
                                    boxShadow: '0 4px 12px rgba(21,174,232,0.35)',
                                }}>🔍</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Listing section */}
            <div style={{ background: 'var(--lightBackground)', padding: '3rem 5%' }}>
                {/* Results heading */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: 12 }}>
                    <div>
                        <h2 style={{ fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 900, color: '#111', margin: '0 0 0.2rem' }}>
                            Choose your<br />
                            <span style={{ color: 'var(--primaryColor)' }}>best experiences</span> in Andaman
                        </h2>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#555' }}>
                        {loading ? '...' : `${filtered.length} result${filtered.length !== 1 ? 's' : ''}`}
                    </span>
                </div>

                {/* Grid */}
                {loading ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                        {[1, 2, 3, 4, 5, 6].map(i => <SkeletonCard key={i} />)}
                    </div>
                ) : filtered.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏨</div>
                        <h2 style={{ color: '#aaa', fontWeight: 600 }}>No hotels found</h2>
                        <p style={{ color: '#bbb', fontSize: '0.95rem' }}>Try adjusting your filters.</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                        {filtered.map(hotel => <HotelCard key={hotel.id} hotel={hotel} />)}
                    </div>
                )}
            </div>

            

            <style>{`
                @keyframes shimmer {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }
            `}</style>
        </main>
    )
}
