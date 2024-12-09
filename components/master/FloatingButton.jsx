import Link from 'next/link'
import React from 'react'

export default function FloatingButton({ label, icon, link, top = "inherit", left = "inherit", bottom = "inherit", right = "inherit" }) {
    return (
        <div style={{ position: 'fixed', left: left, right: right, top: top, bottom: bottom, zIndex: 10, display: 'flex', alignItems: 'center', }} className='WhatsAppButton'>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Link href={link} target='blank'>
                    {icon}
                </Link>
            </div>

            {/* <p
                style={{
                    backgroundColor: 'black',
                    color: 'white',
                    fontSize: 15,
                    padding: "3px 10px",
                    borderRadius: "0 20px 0 0",
                    marginLeft: -5,
                    zIndex: -2
                }}
            >
                {label}</p> */}
        </div>
    )
}
