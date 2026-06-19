"use client"
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { db } from '@/firebase'
import SHeader from '@/components/skeleton/SHeader'

const Menu = dynamic(() => import("@/components/master/header"), { ssr: false, loading: () => <SHeader /> })
const Footer = dynamic(() => import("@/components/master/Footer"), { ssr: false })

function formatDate(ts) {
    if (!ts) return ''
    const d = ts.toDate ? ts.toDate() : new Date(ts)
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
}

export default function BlogPostPage() {
    const { slug } = useParams()
    const [post, setPost] = useState(null)
    const [loading, setLoading] = useState(true)
    const [notFound, setNotFound] = useState(false)

    useEffect(() => {
        if (!slug) return
        db.collection('blogs')
            .where('slug', '==', slug)
            .where('published', '==', true)
            .limit(1)
            .get()
            .then(snap => {
                if (snap.empty) {
                    setNotFound(true)
                } else {
                    setPost({ id: snap.docs[0].id, ...snap.docs[0].data() })
                }
                setLoading(false)
            })
            .catch(() => { setNotFound(true); setLoading(false) })
    }, [slug])

    if (loading) {
        return (
            <main>
                <Menu />
                <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ textAlign: 'center', color: '#aaa' }}>
                        <div style={{ fontSize: '2rem', marginBottom: 12 }}>⏳</div>
                        <p style={{ fontSize: '1rem' }}>Loading post…</p>
                    </div>
                </div>
                <Footer />
            </main>
        )
    }

    if (notFound || !post) {
        return (
            <main>
                <Menu />
                <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🏝️</div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', marginBottom: '0.5rem' }}>Post Not Found</h1>
                    <p style={{ color: '#666', fontSize: '1rem', marginBottom: '2rem' }}>This blog post doesn't exist or has been unpublished.</p>
                    <Link href="/blog" style={{
                        background: 'var(--primaryColor)', color: 'white',
                        padding: '0.65rem 1.8rem', borderRadius: '3rem',
                        fontWeight: 700, fontSize: '0.95rem', textDecoration: 'none',
                        transition: 'opacity 0.2s',
                    }}>← Back to Blog</Link>
                </div>
                <Footer />
            </main>
        )
    }

    return (
        <main>
            <Menu />

            {/* Hero cover */}
            {post.coverImage && (
                <div style={{ width: '100%', height: 'clamp(240px, 45vh, 480px)', overflow: 'hidden', position: 'relative' }}>
                    <img
                        src={post.coverImage}
                        alt={post.title}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                        position: 'absolute', inset: 0,
                        background: 'linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.55) 100%)',
                    }} />
                    {/* Title overlay */}
                    <div style={{
                        position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
                        width: '90%', maxWidth: 860, textAlign: 'center',
                    }}>
                        <h1 style={{ color: 'white', fontSize: 'clamp(1.6rem, 4vw, 2.8rem)', fontWeight: 900, lineHeight: 1.25, textShadow: '0 2px 12px rgba(0,0,0,0.4)' }}>
                            {post.title}
                        </h1>
                    </div>
                </div>
            )}

            {/* Article container */}
            <div style={{ background: 'var(--lightBackground)', padding: '3rem 0 5rem' }}>
                <div style={{ width: '90%', maxWidth: 860, margin: '0 auto' }}>

                    {/* Back link */}
                    <div style={{ marginBottom: '2rem' }}>
                        <Link href="/blog" style={{
                            color: 'var(--primaryColor)', fontWeight: 600, fontSize: '0.9rem',
                            display: 'inline-flex', alignItems: 'center', gap: 4,
                            transition: 'opacity 0.2s',
                        }}
                            onMouseEnter={e => e.currentTarget.style.opacity = '0.75'}
                            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                        >
                            ← All Posts
                        </Link>
                    </div>

                    {/* Title (if no cover image) */}
                    {!post.coverImage && (
                        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 900, color: '#111', marginBottom: '1rem', lineHeight: 1.2 }}>
                            {post.title}
                        </h1>
                    )}

                    {/* Meta bar */}
                    <div style={{
                        display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center',
                        marginBottom: '1.75rem', paddingBottom: '1.25rem',
                        borderBottom: '1px solid #e0e0e0',
                    }}>
                        {post.author && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <div style={{
                                    width: 32, height: 32, borderRadius: '50%',
                                    background: 'var(--primaryColor)', color: 'white',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontWeight: 800, fontSize: '0.8rem', flexShrink: 0,
                                }}>
                                    {post.author.charAt(0).toUpperCase()}
                                </div>
                                <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#333' }}>{post.author}</span>
                            </div>
                        )}
                        {post.createdAt && (
                            <span style={{ color: '#888', fontSize: '0.85rem' }}>📅 {formatDate(post.createdAt)}</span>
                        )}
                        {post.tags?.length > 0 && (
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {post.tags.map(tag => (
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
                    </div>

                    {/* Excerpt */}
                    {post.excerpt && (
                        <p style={{
                            fontSize: '1.1rem', color: '#555', lineHeight: 1.7,
                            fontStyle: 'italic', marginBottom: '2rem',
                            padding: '1rem 1.5rem', background: '#e8f6fd',
                            borderLeft: '4px solid var(--primaryColor)',
                            borderRadius: '0 0.75rem 0.75rem 0',
                        }}>{post.excerpt}</p>
                    )}

                    {/* Article body */}
                    <article
                        className="contentDiv blog-content"
                        style={{
                            background: '#fff',
                            borderRadius: '1.25rem',
                            padding: 'clamp(1.5rem, 4vw, 3rem)',
                            boxShadow: '0 2px 16px rgba(0,0,0,0.05)',
                            fontSize: '1.05rem',
                            lineHeight: 1.8,
                            color: '#222',
                        }}
                        dangerouslySetInnerHTML={{ __html: post.content }}
                    />

                    {/* Bottom CTA */}
                    <div style={{ marginTop: '3rem', textAlign: 'center' }}>
                        <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1rem' }}>Ready to explore Andaman?</p>
                        <Link href="/contact-us" style={{
                            display: 'inline-block',
                            background: 'var(--primaryColor)', color: 'white',
                            padding: '0.75rem 2.5rem', borderRadius: '3rem',
                            fontWeight: 700, fontSize: '1rem', textDecoration: 'none',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            boxShadow: '0 4px 16px rgba(21,174,232,0.3)',
                        }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(21,174,232,0.4)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(21,174,232,0.3)' }}
                        >
                            Plan Your Trip →
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    )
}
