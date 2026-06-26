"use client"
import { PhoneOutlined } from '@ant-design/icons'
import { usePathname } from 'next/navigation'

export default function RequestCallbackButton() {
  const pathname = usePathname()

  if (pathname?.startsWith('/admin')) {
    return null
  }


  function handleClick() {
    window.dispatchEvent(new CustomEvent('open-quote-popup'))
  }

  return (
    <button
      onClick={handleClick}
      style={{
        position: 'fixed',
        right: 0,
        top: '60%',
        transform: 'translateY(-50%)',
        zIndex: 1000,
        backgroundColor: 'var(--primaryColor)',
        color: 'white',
        writingMode: 'vertical-rl',
        textOrientation: 'mixed',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '18px 10px',
        borderRadius: '12px 0 0 12px',
        fontSize: '14px',
        fontWeight: 700,
        letterSpacing: '0.04em',
        border: 'none',
        boxShadow: '-3px 0 16px rgba(21,174,232,0.45)',
        transition: 'background-color 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
        userSelect: 'none',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.backgroundColor = '#0f9fd4'
        e.currentTarget.style.boxShadow = '-4px 0 22px rgba(21,174,232,0.65)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.backgroundColor = 'var(--primaryColor)'
        e.currentTarget.style.boxShadow = '-3px 0 16px rgba(21,174,232,0.45)'
      }}
    >
      {/* Phone icon — rotated to face upright when button is vertical */}
      <PhoneOutlined style={{ fontSize: '18px', transform: 'rotate(90deg)' }} />
      <span>Request a Callback</span>
    </button>
  )
}
