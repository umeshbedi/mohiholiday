"use client"
import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase'
import { useAuth } from '@/components/master/AuthContext'
import style from '@/styles/dashboard.module.css'

function formatDate(timestamp) {
    if (!timestamp) return '—'
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
    return date.toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
    })
}

function StatusBadge({ status }) {
    const map = {
        Pending: style.statusPending,
        Confirmed: style.statusConfirmed,
        Cancelled: style.statusCancelled,
    }
    return (
        <span className={`${style.statusBadge} ${map[status] || style.statusPending}`}>
            {status || 'Pending'}
        </span>
    )
}

function EnquiryCard({ enquiry }) {
    return (
        <div className={style.card}>
            <div className={style.cardTopRow}>
                <h3 className={style.cardPackageName}>{enquiry.packageName || 'General Enquiry'}</h3>
                <StatusBadge status={enquiry.status} />
            </div>

            {enquiry.packageDetail && (
                <p className={style.cardDetail}>{enquiry.packageDetail}</p>
            )}

            <div className={style.cardMeta}>
                {enquiry.name && (
                    <div className={style.cardMetaRow}>
                        <strong>Name:</strong> {enquiry.name}
                    </div>
                )}
                {enquiry.mobile && (
                    <div className={style.cardMetaRow}>
                        <strong>Mobile:</strong> {enquiry.mobile}
                    </div>
                )}
                {enquiry.adults !== undefined && (
                    <div className={style.cardMetaRow}>
                        <strong>Adults:</strong> {enquiry.adults}
                        {enquiry.kids ? ` · Kids: ${enquiry.kids}` : ''}
                        {enquiry.infants ? ` · Infants: ${enquiry.infants}` : ''}
                    </div>
                )}
                {enquiry.date && (
                    <div className={style.cardMetaRow}>
                        <strong>Travel:</strong> {enquiry.date}
                    </div>
                )}
            </div>

            {enquiry.message && (
                <>
                    <div className={style.cardDivider} />
                    <p className={style.cardMessage}>"{enquiry.message}"</p>
                </>
            )}

            <div className={style.cardDate}>
                Submitted on {formatDate(enquiry.createdAt)}
            </div>
        </div>
    )
}

export default function DashboardPage() {
    const router = useRouter()
    const { currentUser } = useAuth()
    const [enquiries, setEnquiries] = useState([])
    const [loadingEnquiries, setLoadingEnquiries] = useState(true)

    // Redirect if not signed in
    useEffect(() => {
        if (currentUser === null) {
            router.replace('/auth')
        }
    }, [currentUser, router])

    // Fetch enquiries
    useEffect(() => {
        if (!currentUser) return
        const unsub = db
            .collection('enquiries')
            .doc(currentUser.uid)
            .collection('items')
            .orderBy('createdAt', 'desc')
            .onSnapshot((snap) => {
                const items = []
                snap.forEach(doc => items.push({ id: doc.id, ...doc.data() }))
                setEnquiries(items)
                setLoadingEnquiries(false)
            }, () => {
                setLoadingEnquiries(false)
            })
        return unsub
    }, [currentUser])

    // Loading state (auth not resolved yet)
    if (currentUser === undefined) {
        return (
            <div className={style.loading}>
                <div className={style.spinner} />
                <p style={{ color: '#888', fontSize: '0.95rem' }}>Loading your dashboard…</p>
            </div>
        )
    }

    if (!currentUser) return null // will redirect

    const initials = (currentUser.displayName || currentUser.email || 'U')
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)

    async function handleSignOut() {
        await auth.signOut()
        router.replace('/')
    }

    return (
        <div className={style.page}>
            {/* ---- Top Nav ---- */}
            <nav className={style.topbar}>
                <Link href="/" className={style.logoWrap}>
                    <Image
                        src="/MH Logo For Website.png"
                        alt="Mohi Holidays"
                        fill
                        style={{ objectFit: 'contain', objectPosition: 'left' }}
                    />
                </Link>
                <div className={style.topbarRight}>
                    <span className={style.userName}>
                        {currentUser.displayName || currentUser.email}
                    </span>
                    <div className={style.avatar}>
                        {currentUser.photoURL
                            ? <img src={currentUser.photoURL} alt="avatar" className={style.avatarImg} />
                            : initials
                        }
                    </div>
                    <button id="dashboard-signout-btn" className={style.signOutBtn} onClick={handleSignOut}>
                        Sign Out
                    </button>
                </div>
            </nav>

            {/* ---- Body ---- */}
            <div className={style.body}>
                {/* Welcome Banner */}
                <div className={style.welcomeBanner}>
                    <div className={style.welcomeText}>
                        <h2>
                            Hey, <span>{currentUser.displayName?.split(' ')[0] || 'Traveller'}</span>! 👋
                        </h2>
                        <p>
                            {enquiries.length > 0
                                ? `You have ${enquiries.length} enquir${enquiries.length === 1 ? 'y' : 'ies'} submitted. Our team will reach you soon.`
                                : 'Start exploring Andaman packages and submit your first enquiry!'}
                        </p>
                    </div>
                </div>

                {/* Enquiries Section */}
                <div className={style.sectionHead}>
                    <h2 className={style.sectionTitle}>My Enquiries</h2>
                    {enquiries.length > 0 && (
                        <span className={style.badge}>{enquiries.length}</span>
                    )}
                </div>

                {loadingEnquiries ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0' }}>
                        <div className={style.spinner} />
                    </div>
                ) : enquiries.length === 0 ? (
                    <div className={style.emptyState}>
                        <div className={style.emptyIcon}>🌊</div>
                        <h3>No enquiries yet</h3>
                        <p>
                            Browse our packages, activities, or ferry services<br />
                            and submit an enquiry — it will appear here instantly.
                        </p>
                        <Link href="/package" className={style.exploreBtn} id="explore-packages-btn">
                            Explore Packages →
                        </Link>
                    </div>
                ) : (
                    <div className={style.grid}>
                        {enquiries.map(enq => (
                            <EnquiryCard key={enq.id} enquiry={enq} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
