"use client"
import React, { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { db } from '@/firebase'
import SHeader from '@/components/skeleton/SHeader'
import SHome from '@/components/skeleton/SHome'

const Menu = dynamic(() => import("@/components/master/header"), { ssr: false, loading: () => <SHeader /> })
const HeadImage = dynamic(() => import("@/components/master/HeadImage"), { ssr: false, loading: () => <SHome /> })
const Footer = dynamic(() => import("@/components/master/Footer"), { ssr: false })

function formatDate(ts) {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

function BlogCard({ post }) {
    return (
        <Link href={`/blog/${post.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <article style={{
                background: '#fff',
                borderRadius: '1.25rem',
                overflow: 'hidden',
                boxShadow: '0 2px 16px rgba(0,0,0,0.07)',
                transition: 'transform 0.22s, box-shadow 0.22s',
                cursor: 'pointer',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
            }}
                onMouseEnter={e => {
                    e.currentTarget.style.transform = 'translateY(-5px)'
                    e.currentTarget.style.boxShadow = '0 10px 32px rgba(21,174,232,0.15)'
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.transform = 'none'
                    e.currentTarget.style.boxShadow = '0 2px 16px rgba(0,0,0,0.07)'
                }}
            >
                {/* Cover image */}
                <div style={{ width: '100%', height: 220, background: '#e8f4ff', overflow: 'hidden', flexShrink: 0 }}>
                    {post.coverImage ? (
                        <img
                            src={post.coverImage}
                            alt={post.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                            onMouseLeave={e => e.currentTarget.style.transform = 'none'}
                        />
                    ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>
                            🏝️
                        </div>
                    )}
                </div>

                {/* Content */}
                <div style={{ padding: '1.25rem 1.5rem', flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {/* Tags */}
                    {post.tags?.length > 0 && (
                        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                            {post.tags.slice(0, 3).map(tag => (
                                <span key={tag} style={{
                                    background: 'var(--primaryColor)',
                                    color: 'white',
                                    fontSize: '0.7rem',
                                    fontWeight: 700,
                                    padding: '2px 10px',
                                    borderRadius: '2rem',
                                    letterSpacing: '0.04em',
                                    textTransform: 'uppercase',
                                }}>{tag}</span>
                            ))}
                        </div>
                    )}

                    {/* Title */}
                    <h2 style={{
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        color: '#111',
                        lineHeight: 1.35,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}>{post.title}</h2>

                    {/* Excerpt */}
                    <p style={{
                        fontSize: '0.9rem',
                        color: '#555',
                        lineHeight: 1.6,
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        flex: 1,
                    }}>{post.excerpt}</p>

                    {/* Footer */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #f0f0f0' }}>
                        <span style={{ fontSize: '0.78rem', color: '#888', fontWeight: 500 }}>
                            {post.author && <>by <strong>{post.author}</strong> · </>}{formatDate(post.createdAt)}
                        </span>
                        <span style={{
                            color: 'var(--primaryColor)',
                            fontWeight: 700,
                            fontSize: '0.82rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 4,
                        }}>Read more →</span>
                    </div>
                </div>
            </article>
        </Link>
    )
}

export default function BlogPage() {
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // Fetch all blogs (no compound query = no composite index needed),
        // then filter published and sort client-side.
        const unsub = db.collection('blogs')
            .onSnapshot(snap => {
                const data = []
                snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
                const published = data
                    .filter(p => p.published === true)
                    .sort((a, b) => {
                        const aTime = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime()
                        const bTime = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime()
                        return bTime - aTime
                    })
                setPosts(published)
                setLoading(false)
            }, err => {
                console.error('Blog fetch error:', err)
                setLoading(false)
            })
        return () => unsub()
    }, [])

    return (
        <main>
            <Menu />
            <HeadImage image='/contact us page.jpg' title="Our Blog" isHalf />

            <div style={{ background: 'var(--lightBackground)', minHeight: '60vh', padding: '4rem 0' }}>
                <div style={{ width: '90%', maxWidth: 1200, margin: '0 auto' }}>

                    {/* Section heading */}
                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <div style={{
                            display: 'inline-block',
                            background: 'var(--primaryColor)',
                            color: 'white',
                            fontSize: '0.78rem',
                            fontWeight: 700,
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            padding: '4px 16px',
                            borderRadius: '2rem',
                            marginBottom: '1rem',
                        }}>Travel Stories & Tips</div>
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#111', margin: '0 0 1rem' }}>
                            Explore Andaman Through Our Stories
                        </h1>
                        <p style={{ color: '#555', fontSize: '1rem', maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
                            Insider guides, travel tips, and island stories from the Mohi Holidays team.
                        </p>
                    </div>

                    {/* Grid */}
                    {loading ? (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: 28,
                        }}>
                            {[1, 2, 3].map(i => (
                                <div key={i} style={{ height: 380, borderRadius: '1.25rem', background: '#e8e8e8', animation: 'pulse 1.5s infinite' }} />
                            ))}
                        </div>
                    ) : posts.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '4rem', color: '#888' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📝</div>
                            <h2 style={{ color: '#aaa', fontWeight: 600 }}>No posts yet</h2>
                            <p style={{ color: '#bbb', fontSize: '0.95rem' }}>Check back soon for travel stories and tips!</p>
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
                            gap: 28,
                        }}>
                            {posts.map(post => (
                                <BlogCard key={post.id} post={post} />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </main>
    )
}
