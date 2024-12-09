"use client"
import React, { useEffect, useState } from 'react'
import { Skeleton } from 'antd'
import { mobile } from '../utils/variables'

export default function SHome() {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        setIsMobile(mobile())
    }, [isMobile])
    return (
        <>
            <div style={{ width:"100%" }}>
            <Skeleton.Button block active style={{ height: 500}} />
                
            </div>
        </>
    )
}
