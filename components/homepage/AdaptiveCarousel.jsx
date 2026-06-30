"use client"
import React, { useEffect, useState } from 'react'
import DivCarouselMobile from './DivCarouselMobile'
import DivCarousel from './DivCarousel'
import { mobile } from '../utils/variables'

export default function AdaptiveCarousel({ mobileProps, desktopProps }) {
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setIsMobile(mobile())
    setMounted(true)
  }, [])

  if (!mounted) {
    // Render desktop version during SSR to match the server HTML and prevent hydration mismatch
    return <DivCarousel {...desktopProps} />
  }

  if (isMobile) {
    return <DivCarouselMobile {...mobileProps} />
  }

  return <DivCarousel {...desktopProps} />
}
