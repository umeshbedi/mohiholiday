import React, { useEffect, useState } from 'react'
import { mobile } from '../variables'
import { Skeleton } from 'antd'

export default function SHome() {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        setIsMobile(mobile())
    }, [isMobile])
    return (
        <>
            <Skeleton.Button active style={{ height: 500, width: '100%' }} />
            
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    width: isMobile ? '80%' :'70%',
                    marginTop: -40,
                    borderRadius: 3,
                    boxShadow: '0 0 30px 0 rgba(0, 0, 0, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px 20px',
                    gap: 15,
                    flexDirection: isMobile ? 'column' :'row',
                    backgroundColor: 'white'
                }}
                >
                    <Skeleton.Button active block />
                    <Skeleton.Button active block />
                    <Skeleton.Button active block />


                </div>

            </div>
        </>
    )
}
