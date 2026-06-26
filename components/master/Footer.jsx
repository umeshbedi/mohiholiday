"use client"
import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { db } from '@/firebase'
import String2Html from './String2Html'
import {
  FacebookFilled,
  InstagramOutlined,
  TwitterOutlined,
  YoutubeFilled,
  LinkedinFilled,
  EnvironmentOutlined,
  PhoneOutlined,
  MailOutlined,
} from '@ant-design/icons'
import { FaAngleRight } from 'react-icons/fa'

const dayTrips = [
  { label: 'Car', href: '/trip/car' },
  { label: 'Boat', href: '/trip/boat' },
  { label: 'Combo', href: '/trip/combo' },
]
const cruises = [
  { label: 'Makruzz', href: '/ferry/Makruzz-Ferry' },
  { label: 'Nautika', href: '/ferry/Nautika' },
  { label: 'Green Ocean', href: '/ferry/Green-Ocean' },
  { label: 'ITT Majestic', href: '/ferry/ITT-Majestic' },
]

const quickLinks = [
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
  { label: 'Blogs', href: '/blog' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms & Conditions', href: '/terms' },
]

const destinations = [
  'Havelock Island', 'Neil Island', 'Port Blair',
  'Baratang', 'Diglipur', 'Mayabunder',
  'Rangat', 'Ross Island', 'North Bay',
  'Chidiya Tapu',
]

const paymentIcons = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/98/Visa_Inc._logo_%282005%E2%80%932014%29.svg/1920px-Visa_Inc._logo_%282005%E2%80%932014%29.svg.png', alt: 'Visa' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg', alt: 'Mastercard' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg', alt: 'UPI' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/0/0f/RuPay-Logo.png', alt: 'RuPay' },
]

const socials = [
  { icon: <FacebookFilled />, href: 'https://www.facebook.com/mohiholidays/', label: 'Facebook' },
  { icon: <InstagramOutlined />, href: 'https://www.instagram.com/mohiholidays/', label: 'Instagram' },

  { icon: <YoutubeFilled />, href: 'https://www.youtube.com/@mohiholidays', label: 'YouTube' },
]

function SectionHeading({ children }) {
  return (
    <div className="mb-5">
      <h3 className="text-white font-bold text-lg mb-2">{children}</h3>
      <div className="h-[3px] w-10 bg-[var(--primaryColor)] rounded-full" />
    </div>
  )
}

function FooterLink({ href, children }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-gray-300 hover:text-[var(--primaryColor)] transition-colors duration-200 text-sm py-[3px]"
    >
      <FaAngleRight className="text-[var(--primaryColor)] text-xs shrink-0" />
      {children}
    </Link>
  )
}

export default function Footer() {
  const pathname = usePathname()
  const [dbContent, setDbContent] = useState("")

  useEffect(() => {
    if (pathname?.startsWith('/admin')) return

    db.collection('pages').doc('footer').get()
      .then((snap) => {
        const data = snap.data()
        if (snap.exists && data?.about) {
          setDbContent(data.about)
        }
      })
      .catch((err) => {
        console.error("Error loading footer content:", err)
      })
  }, [pathname])

  if (pathname?.startsWith('/admin')) {
    return null
  }

  return (

    <>
      {/* Database-driven footer content */}
      
      {dbContent && <String2Html string={dbContent} id="db-footer-content" />}
    </>

  )
}
