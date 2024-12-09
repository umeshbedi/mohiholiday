import { ArrowRightOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react'
import style from '@/styles/Home.module.css'
import Link from 'next/link';
import { mobile } from './variables';

export default function MyButton({ name, slug }) {
    const [display, setDisplay] = useState('none')
    const [padding, setPadding] = useState("10px 20px")
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(mobile())
    }, [isMobile])
    
    return (
        <Link target='blank'
            onMouseOver={() => { setDisplay("inline-block"); setPadding("10px 35px 10px 20px") }}
            onMouseOut={() => { setDisplay("none"); setPadding("10px 20px") }}
            style={{
                background: "var(--primaryColor)",
                padding: padding,
                borderRadius: 50,
                color: 'white',
                fontWeight: 700,
                marginTop: 20,
                cursor: 'pointer',
                position: 'relative',
                transition: "padding .5s",
                display: 'flex',
                alignItems: 'center',
                marginBottom: isMobile ? "2.5rem" : null
            }}
            href={slug}>
            {name} <ArrowRightOutlined style={{ display: display, position: 'absolute', right: 10 }} />
        </Link>
    )
}
