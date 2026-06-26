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
    <footer style={{ backgroundColor: '#0d1b2a' }}>
      {/* Main footer body */}
      <div className="px-[5%] py-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

        {/* ── Column 1: Brand + Contact + Socials ── */}
        <div className="flex flex-col gap-5">
          {/* Logo */}
          <div className="relative w-[180px] h-[60px]">
            <Image
              src="/white-mohi-holidays-logo.png"
              fill
              className="object-contain object-left"
              alt="Mohi Holidays Logo"
            />
          </div>

          {/* Tagline */}
          <p className="text-gray-300 text-sm leading-relaxed" style={{ textAlign: 'left' }}>
            We are Mohi Holidays — your trusted travel partner for the Andaman &amp; Nicobar Islands.
            We take you beyond the resort and into the heart of the islands,
            where every moment becomes a lasting memory.
          </p>

          {/* Contact info */}
          <div className="flex flex-col gap-3 text-sm text-gray-300">
            <div className="flex items-start gap-2">
              <EnvironmentOutlined className="text-[var(--primaryColor)] mt-[2px] shrink-0" />
              <span>Port Blair, Andaman &amp; Nicobar Islands – 744102</span>
            </div>
            <div className="flex items-center gap-2">
              <PhoneOutlined className="text-[var(--primaryColor)] shrink-0" />
              <a href="tel:+919876543210" className="hover:text-[var(--primaryColor)] transition-colors">
                +91 98765 43210
              </a>
            </div>
            <div className="flex items-center gap-2">
              <MailOutlined className="text-[var(--primaryColor)] shrink-0" />
              <a href="mailto:info@mohiholidays.com" className="hover:text-[var(--primaryColor)] transition-colors">
                info@mohiholidays.com
              </a>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex gap-3 mt-1">
            {socials.map(({ icon, href, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full flex items-center justify-center text-white text-base transition-all duration-200 hover:scale-110"
                style={{ backgroundColor: 'var(--primaryColor)' }}
              >
                {icon}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-8">
          
          <div>
          <SectionHeading>Cruises</SectionHeading>
          <div className="flex flex-col">
            {cruises.map(({ label, href }) => (
              <FooterLink key={label} href={href}>{label}</FooterLink>
            ))}
          </div>
        </div>

        {/* ── Column 2: Our Services ── */}
        <div>
          <SectionHeading>Day Trips</SectionHeading>
          <div className="flex flex-col">
            {dayTrips.map(({ label, href }) => (
              <FooterLink key={label} href={href}>{label}</FooterLink>
            ))}
          </div>
        </div>

        </div>

        {/* ── Column 3: Quick Links ── */}
        <div>
          <SectionHeading>Quick Links</SectionHeading>
          <div className="flex flex-col">
            {quickLinks.map(({ label, href }) => (
              <FooterLink key={label} href={href}>{label}</FooterLink>
            ))}
          </div>
        </div>

        {/* ── Column 4: Popular Destinations + Payment ── */}
        <div className="flex flex-col gap-8">
          <div>
            <SectionHeading>Popular Destinations</SectionHeading>
            <div className="flex flex-wrap gap-2">
              {destinations.map((dest) => (
                <Link
                  key={dest}
                  href={`/island/${dest.toLowerCase().replace(/ /g, '-')}`}
                  className="px-3 py-1 rounded-full text-xs text-gray-200 border border-gray-600 hover:border-[var(--primaryColor)] hover:text-[var(--primaryColor)] transition-all duration-200"
                >
                  {dest}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <SectionHeading>Secure Payment Options</SectionHeading>
            <div className="flex">
              {paymentIcons.map(({ src, alt }) => (
                <div
                  key={alt}
                  className="bg-white rounded-md px-2 py-1 flex items-center justify-center"
                  style={{ height: 36, minWidth: 52, transform: 'scale(0.7)' }}
                >
                  <img src={src} alt={alt} className="h-5 object-contain" />
                </div>
              ))}
              <div
                className="bg-white rounded-md px-3 py-1 flex items-center justify-center text-xs font-bold text-gray-700"
                style={{ height: 36, minWidth: 52, transform: 'scale(0.7)' }}
              >
                Net Banking
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Database-driven footer content */}
      {dbContent && (
        <div className="px-[5%] pb-8 text-gray-300 text-sm">
          <String2Html string={dbContent} id="db-footer-content" />
        </div>
      )}

      {/* ── Copyright bar ── */}
      <div
        className="border-t border-gray-700 px-[5%] py-4 flex flex-col sm:flex-row items-center justify-between gap-3"
      >
        <span className="text-gray-400 text-sm">
          © {new Date().getFullYear()} Mohi Holidays Leisures. All Rights Reserved.
        </span>
        <div className="flex gap-5 text-sm">
          <Link href="/terms" className="text-gray-400 hover:text-[var(--primaryColor)] transition-colors">
            Terms &amp; Conditions
          </Link>
          <Link href="/privacy-policy" className="text-gray-400 hover:text-[var(--primaryColor)] transition-colors">
            Privacy Policy
          </Link>
          <Link href="/cancellation-policy" className="text-gray-400 hover:text-[var(--primaryColor)] transition-colors">
            Cancellation Policy
          </Link>
        </div>
      </div>
    </footer>
  )
}
