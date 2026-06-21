"use client"
import React, { useEffect, useState } from 'react'
import { Menu, Drawer, Space, Divider, Dropdown } from 'antd'
import style from './header.module.css'
import { FaAngleDown } from 'react-icons/fa'
import { IoIosMenu } from 'react-icons/io'
import { menu } from '../utils/localdb'
import Image from 'next/image'
import Link from 'next/link'
import { db, auth } from '@/firebase'
import { mobile } from '../utils/variables'
import { FacebookFilled, InstagramOutlined, TwitterOutlined, YoutubeFilled } from '@ant-design/icons'
import MegaMenu from './MegaMenu'
import { useAuth } from './AuthContext'
import { useRouter } from 'next/navigation'

export default function Header() {

    const [menuStyle, setMenuStyle] = useState({ padding: "1.5rem 5%", background: "none" })
    const [ferryList, setFerryList] = useState([])
    const [island, setIsland] = useState([])
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('home')
    const [isMobile, setIsMobile] = useState(false)
    const [logoImage, setLogoImage] = useState("/MH Logo For Website.png")
    const [megaMenuStyle, setMegaMenuStyle] = useState({visibility:"hidden", opacity:0})
    const [megaContent, setMegaContent] = useState([])
    const [activityList, setActivityList] = useState([])
    const [authDropOpen, setAuthDropOpen] = useState(false)
    const { currentUser } = useAuth()
    const router = useRouter()

    useEffect(() => {
        setIsMobile(mobile())

    }, [isMobile])

    const socialArr = [
        { icon: <InstagramOutlined /> },
        { icon: <FacebookFilled /> },
        { icon: <TwitterOutlined /> },
        { icon: <YoutubeFilled /> }
    ]

    function Social({ media }) {
        return (
            <a style={{ fontSize: "1.5rem", color: 'white' }}>
                {media}
            </a>
        )
    }

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 100) {
                setMenuStyle({ padding: ".5rem 5%", background: "rgba(0,0,0,.5)" })
                setLogoImage("/white-mohi-holidays-logo.png")
            }
            else {
                setMenuStyle({ padding: "1.5rem 5%", background: "none" })
                setLogoImage("/MH Logo For Website.png")
            }
        })
    }, [])

    useEffect(() => {
        db.collection('ferry').onSnapshot((snap) => {
            const tempFerry = []
            snap.forEach((sndata) => {
                tempFerry.push({ name: sndata.data().name, slug: sndata.data().slug, thumbnail:sndata.data().image, data:[] })
            })
            setFerryList(tempFerry)
        })

        db.collection('island').onSnapshot((snap) => {
            const tempIsland = []
            snap.forEach((sndata) => {
                tempIsland.push({ name: sndata.data().name, slug: sndata.data().slug, thumbnail:sndata.data().thumbnail, data:[] })
            })
            setIsland(tempIsland)
        })

        db.collection('activity').onSnapshot((snap) => {
            const tempactivity = []
            snap.forEach((sndata) => {
                tempactivity.push(sndata.data())
            })
            setActivityList(tempactivity)
        })

    }, [])

    

    function megaActive(megaFor){
        if(megaFor=="acitivity") setMegaContent(activityList);
        else if(megaFor=="ferry") setMegaContent(ferryList)
        else if (megaFor=="island") setMegaContent(island);
        setMegaMenuStyle({visibility:"visible", opacity:1})
    }

    function megaInactive() {
        setMegaMenuStyle({visibility:"hidden", opacity:0})
    }


    function DropdownMenu({ heading = "", content = [{ name: null, slug: null }], isMega = false }) {
        return (
            <li onMouseEnter={megaInactive}>
                <Link href="javascript:void(0)">{heading} ▾</Link>
                <ul className={style.dropdown}>
                    {isMega
                        ?
                        (<MegaMenu />)
                        :
                        (
                            content.map((item, index) => (
                                <li key={index}><Link href={item.slug}>{item.name}</Link></li>

                            ))
                        )
                    }
                </ul>
            </li>
        )
    }



    function RespMenu() {
        const initials = currentUser
            ? (currentUser.displayName || currentUser.email || 'U')
                .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
            : ''

        async function signOut() {
            await auth.signOut()
            router.replace('/')
        }

        return (
            <>
                <Menu
                    mode={isMobile ? 'inline' : 'horizontal'}
                    style={{
                        fontWeight: 'bold',
                        float: 'right',
                        width: isMobile ? '100%' : 'auto',
                        borderBottom: 0,
                        backgroundColor: "var(--primaryColor)",
                        color: 'white',
                        textTransform: 'uppercase',
                        //fontSize:'.5rem'

                    }}
                    disabledOverflow
                    onClick={(e) => { setActive(e.key); setOpen(false) }}
                    activeKey={active}
                    className={style.RespMenu}
                // forceSubMenuRender
                >

                    <Menu.SubMenu title={<p >Know{isMobile ? null : <FaAngleDown />}</p>}>
                        {menu.know.map((item, index) => (
                            <Menu.Item key={item.name}>
                                <Link style={{ textTransform: 'uppercase' }} target='blank' href={item.slug}>{item.name}</Link>
                            </Menu.Item>
                        ))
                        }
                    </Menu.SubMenu>

                    <Menu.SubMenu title={<p >Popular Islands{isMobile ? null : <FaAngleDown />}</p>}>
                        {
                            menu.what2see.map((name, key) => (
                                <Menu.Item key={name.name + key}>
                                    <Link target='blank' style={{ textTransform: 'uppercase' }}
                                        href={name.slug}>{name.name}</Link>
                                </Menu.Item>
                            ))
                        }
                    </Menu.SubMenu>

                    <Menu.Item key={'Rental'} >
                        <Link href={'/cabs'}><p>Rentals</p></Link>
                    </Menu.Item>

                    <Menu.SubMenu title={<p >Packages{isMobile ? null : <FaAngleDown />}</p>}>
                        {
                            menu.packages.map((name, key) => (
                                <Menu.Item key={name.name + key}>
                                    <Link target='blank' style={{ textTransform: 'uppercase' }}
                                        href={name.slug}>{name.name}</Link>
                                </Menu.Item>
                            ))
                        }
                    </Menu.SubMenu>

                    <Menu.SubMenu title={<p >Activities{isMobile ? null : <FaAngleDown />}</p>}>
                        {
                            menu.activity.map((name, key) => (
                                <Menu.Item key={name.name + key}>
                                    <Link target='blank' style={{ textTransform: 'uppercase' }}
                                        href={name.slug}>{name.name}</Link>
                                </Menu.Item>
                            ))
                        }
                    </Menu.SubMenu>

                    <Menu.SubMenu title={<p >Ferry{isMobile ? null : <FaAngleDown />}</p>}>
                        {
                            ferryList.map((ferry, key) => (
                                <Menu.Item key={key}>
                                    <Link target='blank' href={ferry.slug}>{ferry.name}</Link>
                                </Menu.Item>
                            ))
                        }
                    </Menu.SubMenu>

                    <Menu.Item key={'ContactUs'} >
                        <Link href={'/contact-us'}><p>Contact Us</p></Link>
                    </Menu.Item>

                    <Menu.Item key={'Blog'} >
                        <Link href={'/blog'}><p>Blog</p></Link>
                    </Menu.Item>

                    <Menu.Item key={'Hotels'} >
                        <Link href={'/hotels'}><p>Hotels</p></Link>
                    </Menu.Item>

                    {/* Auth items in mobile drawer */}
                    {isMobile && (
                        currentUser ? (
                            <>
                                <Menu.Item key={'dashboard'}>
                                    <Link href={'/dashboard'}><p>My Dashboard</p></Link>
                                </Menu.Item>
                                <Menu.Item key={'signout'} onClick={signOut}>
                                    <p style={{ color: '#ff4d4f' }}>Sign Out</p>
                                </Menu.Item>
                            </>
                        ) : (
                            <Menu.Item key={'login'}>
                                <Link href={'/auth'}><p>Login / Sign Up</p></Link>
                            </Menu.Item>
                        )
                    )}

                </Menu>
                {isMobile &&
                    <div style={{ width: "100%", height: "30%", display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <div style={{ display: 'flex', gap: "1.5rem" }}>
                            {socialArr.map((item, index) => (
                                <Social key={index} media={item.icon} />
                            ))}
                        </div>
                    </div>
                }
            </>
        )
    }

    // Auth helpers for desktop nav
    const desktopInitials = currentUser
        ? (currentUser.displayName || currentUser.email || 'U')
            .split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
        : ''

    async function desktopSignOut() {
        await auth.signOut()
        router.replace('/')
    }

    return (
        <div
            className={`relative ${style.menuContainer} bg-red-600`}
            style={menuStyle}
            onMouseEnter={() => setLogoImage("/white-mohi-holidays-logo.png")}
            onMouseLeave={() => setLogoImage("/MH Logo For Website.png")}
        >

            <Drawer
                placement='right'
                width={'100%'}
                open={open}
                onClose={() => setOpen(false)}
                style={{ background: "var(--primaryColor)", position: 'relative' }}

            >
                <RespMenu />

            </Drawer>

            <div>
                <div style={{ height: '100%', width: isMobile ? 200 : 250, position: 'relative', background: 'inherit' }}>
                    <Link href='/'>
                        <Image fill src={logoImage} alt='MH Logo' style={{ objectFit: "contain" }} />
                    </Link>
                </div>
            </div>

            <div className={style.menu}>
                {isMobile ?
                    (
                        <div
                            style={{ float: 'right', fontSize: 35, color: "white", display: 'flex', alignItems: 'center', gap: 10, padding: "5px 0" }}
                        >
                            <IoIosMenu onClick={() => setOpen(true)} />
                        </div>
                    ) :
                    (
                        <ul >
                            {/* <li onMouseEnter={megaInactive}><Link href="/">Home</Link></li> */}
                            <DropdownMenu heading='Know' content={menu.know} />
                            <li onMouseEnter={() => megaActive("island")}><Link href="javascript:void(0)">Popular Island ▾</Link></li>
                            {/* <DropdownMenu heading='Popular Islands' content={menu.popularIslands} /> */}
                            <li onMouseEnter={megaInactive}><Link href="/cabs">Rentals</Link></li>
                            <li onMouseEnter={megaInactive}><Link href="/package">Packages</Link></li>
                            <li onMouseEnter={() => megaActive("acitivity")}><Link href="javascript:void(0)">Activities ▾</Link></li>
                            <li onMouseEnter={() => megaActive("ferry")}><Link href="javascript:void(0)">Cruise ▾</Link></li>
                            {/* <DropdownMenu heading='Ferry' content={ferryList} /> */}
                            <DropdownMenu heading='Day Trips' content={menu.daytrips} />
                            <li onMouseEnter={megaInactive}><Link href="/contact-us">Contact Us</Link></li>
                            <li onMouseEnter={megaInactive}><Link href="/blog">Blog</Link></li>
                            <li onMouseEnter={megaInactive}><Link href="/hotels">Hotels</Link></li>

                            {/* ---- Auth Button (desktop) ---- */}
                            <li onMouseEnter={megaInactive} style={{ position: 'relative' }}>
                                {currentUser ? (
                                    <div
                                        style={{ position: 'relative', display: 'inline-block' }}
                                        onMouseEnter={() => setAuthDropOpen(true)}
                                        onMouseLeave={() => setAuthDropOpen(false)}
                                    >
                                        {/* Avatar circle */}
                                        <div style={{
                                            width: 36, height: 36, borderRadius: '50%',
                                            background: 'white', color: 'var(--primaryColor)',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer',
                                            overflow: 'hidden', flexShrink: 0,
                                        }}>
                                            {currentUser.photoURL
                                                ? <img src={currentUser.photoURL} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                                                : desktopInitials
                                            }
                                        </div>
                                        {/* Dropdown */}
                                        {authDropOpen && (
                                            <div style={{
                                                position: 'absolute', top: '100%', right: 0,
                                                background: 'white', borderRadius: '0.75rem',
                                                boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                                                minWidth: 180, zIndex: 999, padding: '0.5rem 0',
                                                border: '1px solid #f0f0f0',
                                            }}>
                                                <div style={{ padding: '0.6rem 1rem', fontSize: '0.8rem', color: '#888', fontWeight: 500, borderBottom: '1px solid #f5f5f5' }}>
                                                    {currentUser.displayName || currentUser.email}
                                                </div>
                                                <Link href="/dashboard" style={{
                                                    display: 'block', padding: '0.6rem 1rem',
                                                    color: '#111', fontWeight: 600, fontSize: '0.9rem',
                                                    transition: 'background 0.15s',
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#f5fbff'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                                >
                                                    📋 My Dashboard
                                                </Link>
                                                <button onClick={desktopSignOut} style={{
                                                    display: 'block', width: '100%', textAlign: 'left',
                                                    padding: '0.6rem 1rem', background: 'none', border: 'none',
                                                    color: '#cf1322', fontWeight: 600, fontSize: '0.9rem',
                                                    cursor: 'pointer', fontFamily: 'inherit',
                                                    transition: 'background 0.15s',
                                                }}
                                                    onMouseEnter={e => e.currentTarget.style.background = '#fff2f0'}
                                                    onMouseLeave={e => e.currentTarget.style.background = 'none'}
                                                >
                                                    🚪 Sign Out
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <Link
                                        href="/auth"
                                        id="header-login-btn"
                                        style={{
                                            background: 'white',
                                            color: 'var(--primaryColor)',
                                            borderRadius: '2rem',
                                            padding: '0.4rem 1.1rem',
                                            fontWeight: 700,
                                            fontSize: '0.88rem',
                                            display: 'inline-block',
                                            transition: 'opacity 0.2s',
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                                        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                                    >
                                        Login
                                    </Link>
                                )}
                            </li>
                        </ul>
                    )
                }

            </div>


            {/* Mega Menu */}
            <div 
            className={`w-[100%] left-0 absolute top-14 flex justify-center items-center ${style.activityItems}`}
            style={megaMenuStyle}
            
            >
                <div className='w-[80%] bg-white rounded-xl' onMouseLeave={megaInactive}>
                <MegaMenu content={megaContent}/>
                </div>
            </div>
        </div>
    )
}
