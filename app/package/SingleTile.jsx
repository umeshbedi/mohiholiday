import React from 'react'
import Image from 'next/image'
import style from '@/styles/packageName.module.css'

export default function SingleTile({ thumbnail, name, slug, price, type }) {
    return (
        <a href={slug} style={{ textDecoration: 'none', display: 'block' }}>
            <div
                data-aos="fade-up"
                data-aos-anchor-placement="top-bottom"
                data-aos-duration="1000"
                className={style.tile}
                style={{
                    borderRadius: 18,
                    overflow: 'hidden',
                    position: 'relative',
                    cursor: 'pointer',
                    height: 420,
                }}
            >
                {/* Full-card background image */}
                <Image
                    src={thumbnail}
                    alt={name}
                    fill
                    style={{ objectFit: 'cover' }}
                    loading='lazy'
                />

                {/* Type badge — top left */}
                {type && (
                    <span style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        backgroundColor: 'rgba(255,255,255,0.88)',
                        color: '#333',
                        fontWeight: 600,
                        fontSize: '0.7rem',
                        padding: '4px 13px',
                        borderRadius: 999,
                        backdropFilter: 'blur(6px)',
                        zIndex: 2,
                    }}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                )}

                {/* Glassmorphism bottom content */}
                <div style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '14px 14px 16px',
                    background: 'rgba(255, 255, 255, 0.18)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    borderTop: '1px solid rgba(255,255,255,0.25)',
                    zIndex: 2,
                }}>
                    {/* Title */}
                    <h3 style={{
                        margin: '0 0 10px 0',
                        fontSize: '0.92rem',
                        fontWeight: 700,
                        color: '#fff',
                        lineHeight: 1.4,
                        textShadow: '0 1px 4px rgba(0,0,0,0.4)',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>
                        {name}
                    </h3>

                    {/* Price + Book Now */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                        <div>
                            <p style={{
                                margin: 0,
                                fontSize: '0.68rem',
                                color: 'rgba(255,255,255,0.80)',
                                fontWeight: 500,
                            }}>
                                Starting at
                            </p>
                            <p style={{
                                margin: 0,
                                fontSize: '1.15rem',
                                fontWeight: 700,
                                color: '#fff',
                                lineHeight: 1.2,
                            }}>
                                ₹{price ?? '—'}
                            </p>
                        </div>

                        <div style={{
                            backgroundColor: 'var(--primaryColor)',
                            color: '#fff',
                            fontWeight: 700,
                            fontSize: '0.8rem',
                            padding: '9px 16px',
                            borderRadius: 10,
                            whiteSpace: 'nowrap',
                            boxShadow: '0 3px 12px rgba(21,174,232,0.4)',
                        }}>
                            Book Now
                        </div>
                    </div>
                </div>

            </div>
        </a>
    )
}
