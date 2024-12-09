import React from 'react'

export default function Suspended() {
  return (
    <div style={{
        fontFamily: 'Arial, sans-serif',
        margin: '0 auto',
        padding: '20px',
        backgroundColor: '#f2f2f2',
        color: '#333',
        textAlign: 'center',
        maxWidth: '600px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        borderRadius: '5px'
    }}>
        <img src="/suspended.jpg" alt="Suspended Image" style={{
            maxWidth: '100%',
            height: 'auto',
            marginBottom: '20px'
        }} />
        <h1 style={{ color: '#ff0000' }}>Account Suspended</h1>
        <p>Sorry, your account has been suspended due to overdue hosting payments. Please contact your hosting provider to resolve this issue.</p>
    </div>
  )
}
