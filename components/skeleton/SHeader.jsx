import React from 'react'
import {Skeleton, Row, Col} from 'antd'
import style from '@/styles/Home.module.css'
export default function SHeader() {
  return (
    <div style={{ display: "flex", height: 50, backgroundColor: style.primaryColor, width: '100%', justifyContent: 'space-between', alignItems: 'center', padding:"0 5%" }}>

        <div style={{ width: '20%' }}>
          <Skeleton.Button active block />
        </div>
        <div style={{ width: '60%' }}>
          <Skeleton.Button active block />
        </div>
      </div>
  )
}
