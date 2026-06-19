"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { auth, db } from '@/firebase'
import firebase from 'firebase/compat/app'
import { useAuth } from '@/components/master/AuthContext'
import style from '@/styles/auth.module.css'

// Google icon SVG
function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 48 48" aria-hidden="true">
            <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
            <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z" />
            <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
            <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
        </svg>
    )
}

export default function AuthPage() {
    const router = useRouter()
    const { currentUser } = useAuth()

    const [activeTab, setActiveTab] = useState('signin') // 'signin' | 'signup'
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    // Redirect if already signed in
    useEffect(() => {
        if (currentUser) {
            router.replace('/dashboard')
        }
    }, [currentUser, router])

    function clearMessages() {
        setError('')
        setSuccess('')
    }

    // ---------- Email/Password Sign In ----------
    async function handleSignIn(e) {
        e.preventDefault()
        clearMessages()
        setLoading(true)
        try {
            await auth.signInWithEmailAndPassword(email, password)
            router.replace('/dashboard')
        } catch (err) {
            setError(friendlyError(err.code))
        } finally {
            setLoading(false)
        }
    }

    // ---------- Email/Password Sign Up ----------
    async function handleSignUp(e) {
        e.preventDefault()
        clearMessages()
        if (!name.trim()) { setError('Please enter your full name.'); return }
        setLoading(true)
        try {
            const cred = await auth.createUserWithEmailAndPassword(email, password)
            // Update display name
            await cred.user.updateProfile({ displayName: name.trim() })
            // Create user doc in Firestore
            await db.collection('users').doc(cred.user.uid).set({
                name: name.trim(),
                email: email.toLowerCase(),
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            })
            setSuccess('Account created! Redirecting to your dashboard…')
            setTimeout(() => router.replace('/dashboard'), 1200)
        } catch (err) {
            setError(friendlyError(err.code))
        } finally {
            setLoading(false)
        }
    }

    // ---------- Google Sign In ----------
    async function handleGoogle() {
        clearMessages()
        setLoading(true)
        try {
            const provider = new firebase.auth.GoogleAuthProvider()
            const cred = await auth.signInWithPopup(provider)
            // Create/update user doc
            await db.collection('users').doc(cred.user.uid).set({
                name: cred.user.displayName || '',
                email: cred.user.email || '',
                photo: cred.user.photoURL || '',
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            }, { merge: true })
            router.replace('/dashboard')
        } catch (err) {
            setError(friendlyError(err.code))
        } finally {
            setLoading(false)
        }
    }

    function friendlyError(code) {
        const map = {
            'auth/user-not-found': 'No account found with this email.',
            'auth/wrong-password': 'Incorrect password. Please try again.',
            'auth/email-already-in-use': 'This email is already registered. Try signing in.',
            'auth/weak-password': 'Password must be at least 6 characters.',
            'auth/invalid-email': 'Please enter a valid email address.',
            'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
            'auth/network-request-failed': 'Network error. Please check your connection.',
            'auth/invalid-credential': 'Invalid credentials. Please check your email and password.',
        }
        return map[code] || 'Something went wrong. Please try again.'
    }

    return (
        <div className={style.wrapper}>
            {/* ---- Left Hero ---- */}
            <div className={style.hero}>
                <div className={style.heroLogo}>
                    <Image
                        src="/white-mohi-holidays-logo.png"
                        alt="Mohi Holidays"
                        fill
                        style={{ objectFit: 'contain', objectPosition: 'left' }}
                    />
                </div>

                <h1 className={style.heroTagline}>
                    Your Andaman<br />
                    Adventure<br />
                    <span>Starts Here.</span>
                </h1>

                <p className={style.heroSub}>
                    Sign in to track your holiday enquiries, manage bookings,
                    and get personalised travel recommendations — all in one place.
                </p>

                <div className={style.heroBadges}>
                    <span className={style.badge}>🏝️ Island Packages</span>
                    <span className={style.badge}>⛴️ Ferry Bookings</span>
                    <span className={style.badge}>🤿 Activities</span>
                    <span className={style.badge}>🚗 Cab Rentals</span>
                </div>
            </div>

            {/* ---- Right Form Panel ---- */}
            <div className={style.formPanel}>
                <div className={style.formHeader}>
                    <h2 className={style.formTitle}>
                        {activeTab === 'signin' ? 'Welcome back 👋' : 'Create your account'}
                    </h2>
                    <p className={style.formSub}>
                        {activeTab === 'signin'
                            ? 'Sign in to view your enquiries and dashboard.'
                            : 'Join Mohi Holidays and start planning your trip.'}
                    </p>
                </div>

                {/* Tabs */}
                <div className={style.tabs}>
                    <button
                        id="auth-tab-signin"
                        className={`${style.tab} ${activeTab === 'signin' ? style.tabActive : ''}`}
                        onClick={() => { setActiveTab('signin'); clearMessages() }}
                    >
                        Sign In
                    </button>
                    <button
                        id="auth-tab-signup"
                        className={`${style.tab} ${activeTab === 'signup' ? style.tabActive : ''}`}
                        onClick={() => { setActiveTab('signup'); clearMessages() }}
                    >
                        Sign Up
                    </button>
                </div>

                {/* Error / Success messages */}
                {error && <div className={style.errorMsg}>⚠️ {error}</div>}
                {success && <div className={style.successMsg}>✅ {success}</div>}

                {/* ---- Sign In Form ---- */}
                {activeTab === 'signin' && (
                    <form onSubmit={handleSignIn} id="signin-form">
                        <div className={style.field}>
                            <label htmlFor="signin-email" className={style.label}>Email</label>
                            <input
                                id="signin-email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className={style.input}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={style.field}>
                            <label htmlFor="signin-password" className={style.label}>Password</label>
                            <input
                                id="signin-password"
                                type="password"
                                required
                                placeholder="Enter your password"
                                className={style.input}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            id="signin-submit"
                            type="submit"
                            className={style.btnPrimary}
                            disabled={loading}
                        >
                            {loading ? 'Signing in…' : 'Sign In →'}
                        </button>
                    </form>
                )}

                {/* ---- Sign Up Form ---- */}
                {activeTab === 'signup' && (
                    <form onSubmit={handleSignUp} id="signup-form">
                        <div className={style.field}>
                            <label htmlFor="signup-name" className={style.label}>Full Name</label>
                            <input
                                id="signup-name"
                                type="text"
                                required
                                placeholder="Your full name"
                                className={style.input}
                                value={name}
                                onChange={e => setName(e.target.value)}
                            />
                        </div>
                        <div className={style.field}>
                            <label htmlFor="signup-email" className={style.label}>Email</label>
                            <input
                                id="signup-email"
                                type="email"
                                required
                                placeholder="you@example.com"
                                className={style.input}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                            />
                        </div>
                        <div className={style.field}>
                            <label htmlFor="signup-password" className={style.label}>Password</label>
                            <input
                                id="signup-password"
                                type="password"
                                required
                                minLength={6}
                                placeholder="Min. 6 characters"
                                className={style.input}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                        <button
                            id="signup-submit"
                            type="submit"
                            className={style.btnPrimary}
                            disabled={loading}
                        >
                            {loading ? 'Creating account…' : 'Create Account →'}
                        </button>
                    </form>
                )}

                {/* Divider + Google */}
                <div className={style.divider}>or continue with</div>
                <button
                    id="google-signin-btn"
                    type="button"
                    className={style.btnGoogle}
                    onClick={handleGoogle}
                    disabled={loading}
                >
                    <GoogleIcon /> Continue with Google
                </button>

                <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.85rem', color: '#888' }}>
                    <Link href="/" style={{ color: '#15aee8', fontWeight: 600 }}>
                        ← Back to Mohi Holidays
                    </Link>
                </p>
            </div>
        </div>
    )
}
