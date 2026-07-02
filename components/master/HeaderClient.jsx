"use client"
import React, { useEffect, useState } from 'react'
import { Menu, Drawer, Space, Divider, Dropdown } from 'antd'
import style from './header.module.css'
import { FaAngleDown } from 'react-icons/fa'
import { IoIosMenu } from 'react-icons/io'
import { menu } from '../utils/localdb'
import Image from 'next/image'
import Link from 'next/link'
import { auth } from '@/firebase'
import { mobile } from '../utils/variables'
import { FacebookFilled, InstagramOutlined, YoutubeFilled } from '@ant-design/icons'
import MegaMenu from './MegaMenu'
import { useAuth } from './AuthContext'
import { useRouter } from 'next/navigation'

export default function HeaderClient({ initialIslands, initialFerries, initialActivities }) {

    const [menuStyle, setMenuStyle] = useState({ padding: "1.5rem 5%", background: "none" })
    const [ferryList] = useState(initialFerries || [])
    const [island] = useState(initialIslands || [])
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('home')
    const [isMobile, setIsMobile] = useState(false)
    const [logoImage, setLogoImage] = useState("/MH Logo For Website.png")
    const [megaMenuStyle, setMegaMenuStyle] = useState({visibility:"hidden", opacity:0})
    const [megaContent, setMegaContent] = useState([])
    const [activityList] = useState(initialActivities || [])
    const [authDropOpen, setAuthDropOpen] = useState(false)
    const { currentUser } = useAuth()
    const router = useRouter()

    useEffect(() => {
        setIsMobile(mobile())
    }, [])

    const socialArr = [
        { icon: <InstagramOutlined />, url: 'https://www.instagram.com/mohiholidays/' },
        { icon: <FacebookFilled />, url: 'https://www.facebook.com/mohiholidays/' },
        { icon: <YoutubeFilled />, url: 'https://www.youtube.com/@mohiholidays' }
    ]

    function Social({ media, url = '#' }) {
        return (
            <a href={url} target="_blank" rel="noopener noreferrer" className={style.socialIcon}>
                {media}
            </a>
        )
    }

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 100) {
                setMenuStyle({ padding: ".5rem 5%", background: "rgba(0,0,0,.5)" })
                setLogoImage("/white-mohi-holidays-logo.png")
            }
            else {
                setMenuStyle({ padding: "1.5rem 5%", background: "none" })
                setLogoImage("/MH Logo For Website.png")
            }
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
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
        async function signOut() {
            await auth.signOut()
            router.replace('/')
        }

        return (
            <div style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                height: '100%', 
                justifyContent: 'space-between',
                background: '#0d1b2a'
            }}>
                <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0' }}>
                    <Menu
                        mode={isMobile ? 'inline' : 'horizontal'}
                        theme="dark"
                        style={{
                            fontWeight: '600',
                            width: '100%',
                            borderRight: 0,
                            backgroundColor: "transparent",
                            color: 'white',
                            textTransform: 'uppercase',
                        }}
                        disabledOverflow
                        onClick={(e) => { setActive(e.key); setOpen(false) }}
                        activeKey={active}
                        className={style.RespMenu}
                    >
                        <Menu.SubMenu title={<p>Know{isMobile ? null : <FaAngleDown />}</p>}>
                            {menu.know.map((item, index) => (
                                <Menu.Item key={item.name}>
                                    <Link style={{ textTransform: 'uppercase' }} href={item.slug}>{item.name}</Link>
                                </Menu.Item>
                            ))
                            }
                        </Menu.SubMenu>

                        <Menu.SubMenu title={<p>Popular Islands{isMobile ? null : <FaAngleDown />}</p>}>
                            {
                                island.map((name, key) => (
                                    <Menu.Item key={name.name + key}>
                                        <Link style={{ textTransform: 'uppercase' }} href={name.slug}>{name.name}</Link>
                                    </Menu.Item>
                                ))
                            }
                        </Menu.SubMenu>

                        <Menu.Item key={'Rental'}>
                            <Link href={'/cabs'}><p>Rentals</p></Link>
                        </Menu.Item>
                        <Menu.Item key={'Package'}>
                            <Link href={'/package'}><p>Packages</p></Link>
                        </Menu.Item>

                        <Menu.SubMenu title={<p>Activities{isMobile ? null : <FaAngleDown />}</p>}>
                            {
                                activityList.map((activity, key) => (
                                    <Menu.SubMenu key={activity.name + key} title={activity.name}>
                                        {activity.data && activity.data.map((subAct, subKey) => (
                                            <Menu.Item key={subAct.title + subKey}>
                                                <Link href={subAct.slug}>{subAct.title}</Link>
                                            </Menu.Item>
                                        ))}
                                    </Menu.SubMenu>
                                ))
                            }
                        </Menu.SubMenu>


                        <Menu.SubMenu title={<p>Cruise{isMobile ? null : <FaAngleDown />}</p>}>
                            {
                                ferryList.map((ferry, key) => (
                                    <Menu.Item key={key}>
                                        <Link href={ferry.slug}>{ferry.name}</Link>
                                    </Menu.Item>
                                ))
                            }
                        </Menu.SubMenu>

                        <Menu.SubMenu title={<p>Day Trips{isMobile ? null : <FaAngleDown />}</p>}>
                            {
                                menu.daytrips.map((name, key) => (
                                    <Menu.Item key={name.name + key}>
                                        <Link style={{ textTransform: 'uppercase' }} href={name.slug}>{name.name}</Link>
                                    </Menu.Item>
                                ))
                            }
                        </Menu.SubMenu>

                        <Menu.Item key={'Blog'}>
                            <Link href={'/blog'}><p>Blog</p></Link>
                        </Menu.Item>

                        <Menu.Item key={'Hotels'}>
                            <Link href={'/hotels'}><p>Hotels</p></Link>
                        </Menu.Item>

                        <Menu.Item key={'ContactUs'}>
                            <Link href={'/contact-us'}><p>Contact Us</p></Link>
                        </Menu.Item>


                        {/* Auth items in mobile drawer */}
                        {isMobile && currentUser && (
                            <Menu.Item key={'dashboard'}>
                                <Link href={'/dashboard'}><p>My Dashboard</p></Link>
                            </Menu.Item>
                        )}
                        {isMobile && currentUser && (
                            <Menu.Item key={'signout'} onClick={signOut}>
                                <p style={{ color: '#ff4d4f' }}>Sign Out</p>
                            </Menu.Item>
                        )}
                        {isMobile && !currentUser && (
                            <Menu.Item key={'login'}>
                                <Link href={'/auth'}><p>Login / Sign Up</p></Link>
                            </Menu.Item>
                        )}

                    </Menu>
                </div>
                {isMobile && (
                    <div style={{ 
                        padding: '1.5rem', 
                        borderTop: '1px solid rgba(255, 255, 255, 0.08)', 
                        background: '#0a1420',
                        display: 'flex', 
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '1rem'
                    }}>
                        <div style={{ display: 'flex', gap: "1.2rem" }}>
                            {socialArr.map((item, index) => (
                                <Social key={index} media={item.icon} url={item.url} />
                            ))}
                        </div>
                        <div style={{ color: 'rgba(255, 255, 255, 0.45)', fontSize: '0.75rem' }}>
                            © {new Date().getFullYear()} Mohi Holidays.
                        </div>
                    </div>
                )}
            </div>
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
                width={320}
                open={open}
                onClose={() => setOpen(false)}
                styles={{
                    body: { padding: 0, background: "#0d1b2a" },
                    header: { background: "#0d1b2a", borderBottom: "1px solid rgba(255, 255, 255, 0.08)" },
                    mask: { backdropFilter: 'blur(4px)' }
                }}
                title={
                    <div style={{ display: 'flex', alignItems: 'center', height: '40px' }}>
                        <img src="/white-mohi-holidays-logo.png" alt="Mohi Holidays Logo" style={{ height: '32px', objectFit: 'contain' }} />
                    </div>
                }
                closeIcon={<span style={{ color: 'white', fontSize: '1.25rem' }}>✕</span>}
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
                            <li onMouseEnter={megaInactive}><Link href="/blog">Blog</Link></li>
                            <li onMouseEnter={megaInactive}><Link href="/hotels">Hotels</Link></li>
                            <li onMouseEnter={megaInactive}><Link href="/contact-us"
                                style={{ background: 'var(--primaryColor)', borderRadius: 50, padding: "5px 20px", color: "white", marginRight: 10 }}
                            >Contact</Link></li>

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
