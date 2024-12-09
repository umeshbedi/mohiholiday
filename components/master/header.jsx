"use client"
import React, { useEffect, useState } from 'react'
import { Menu, Drawer, Space, Divider, Dropdown } from 'antd'
import style from './header.module.css'
import { FaAngleDown } from 'react-icons/fa'
import { IoIosMenu } from 'react-icons/io'
import { menu } from '../utils/localdb'
import Image from 'next/image'
import Link from 'next/link'
import { db } from '@/firebase'
import { mobile } from '../utils/variables'
import { FacebookFilled, InstagramOutlined, TwitterOutlined, YoutubeFilled } from '@ant-design/icons'

export default function Header() {

    const [menuStyle, setMenuStyle] = useState({ padding: "1.5rem 5%", background: "none" })
    const [ferryList, setFerryList] = useState([])
    const [open, setOpen] = useState(false);
    const [active, setActive] = useState('home')
    const [isMobile, setIsMobile] = useState(false)
    const [logoImage, setLogoImage] = useState("/MH Logo For Website.png")

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
                tempFerry.push({ name: sndata.data().name, slug: sndata.data().slug })
            })
            setFerryList(tempFerry)
        })
    }, [])


    function Dropdown({ heading = "", content = [{ name: null, slug: null }] }) {
        return (
            <li>
                <Link href="javascript:void(0)">{heading} ▾</Link>
                <ul className={style.dropdown}>
                    {content.map((item, index) => (
                        <li key={index}><Link target='blank' href={item.slug}>{item.name}</Link></li>

                    ))}
                </ul>
            </li>
        )
    }

    function MegaMenu() {

    }

    function RespMenu() {
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

                    }}
                    disabledOverflow
                    onClick={(e) => { setActive(e.key); setOpen(false) }}
                    activeKey={active}
                    className={style.RespMenu}
                // forceSubMenuRender
                >

                    <Menu.Item key={'home'} >
                        <Link href={'/'}><p >Home</p></Link>
                    </Menu.Item>
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

    return (
        <div className={style.menuContainer} style={menuStyle}
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
                            <li><Link href="/">Home</Link></li>
                            <Dropdown heading='Know' content={menu.know} />
                            <Dropdown heading='Popular Islands' content={menu.popularIslands} />
                            <li><Link href="/cabs">Rentals</Link></li>
                            <li><Link href="/package/Andaman">Packages</Link></li>
                            <li><Link href="/activity/Andaman">Activities</Link></li>
                            {/* <Dropdown heading='Packages' content={menu.packages} /> */}
                            {/* <Dropdown heading='Activities' content={menu.activity} /> */}
                            <Dropdown heading='Ferry' content={ferryList} />
                            <li><Link href="/contact-us">Contact Us</Link></li>
                        </ul>
                    )
                }

            </div>
        </div>
    )
}
