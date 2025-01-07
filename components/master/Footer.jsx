"use client"
import React, { useEffect, useState } from 'react'
import style from '@/styles/Home.module.css'
import Image from 'next/image'
import { FacebookFilled, FacebookOutlined, InstagramOutlined, TwitterOutlined, YoutubeFilled } from '@ant-design/icons'

export default function Footer() {

  const socialArr = [
  {icon:<InstagramOutlined />}, 
  {icon:<FacebookFilled />}, 
  {icon:<TwitterOutlined />}, 
  {icon:<YoutubeFilled />}
]

  function Social({ media }) {
    return (
      <a style={{ fontSize: "1.5rem", color: 'white' }}>
        {media}
      </a>
    )
  }

  const [borderwidth, setBorderwidth] = useState('0px')

  useEffect(()=>{
    setTimeout(() => {
      if (borderwidth=="0px") {
        setBorderwidth("15px")
      }else{
        setBorderwidth("0px")
      }
    }, 2000);
  },[borderwidth])

  return (
    <div
      style={{
        // height: 400,
        backgroundColor: `rgba(0,0,0,1)`,
        display: 'flex',
        flexDirection: 'column',
        gap: "1rem",
        paddingBottom:50,
        alignItems:'center'
      }}
    >

      {/* <div style={{ height: 200, width:200, position: 'relative', marginTop: "3.5rem", background:'white', borderRadius:150, overflow:'hidden', border:`${borderwidth} solid var(--primaryColor)`, transition:'border 2s ease' }}>
        <Image src={"/PH JPG 1.jpg"} fill style={{ objectFit: 'contain', transform:'scale(.9)' }} alt='Pustaholiday Logo'/>
      </div> */}
{/* 
      <div style={{ display: 'flex', gap: '4.5rem', justifyContent: 'center', marginTop: '2rem' }}>
        <a style={{ fontSize: "1.2rem", fontWeight: 500, color: 'white' }}>Blogs</a>
        <a style={{ fontSize: "1.2rem", fontWeight: 500, color: 'white' }}>Contact Us</a>
      </div> */}
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem' }}>
        {socialArr.map((item, index) => (
          <Social key={index} media={item.icon} />
        ))}
      </div>
      
      
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginTop: '2rem', textAlign:'center', padding:'0 10%' }}>
        <a style={{ fontSize: "1rem", fontWeight: 500, color: 'white' }}>Copyright @ 2024 Mohi Holidays Leisures. All Rights Reserved TGA</a>
        
      </div>
      
      <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
        <a style={{ fontSize: "1rem", fontWeight: 500, color: 'white' }}>Privacy Policy</a>
        <a style={{ fontSize: "1rem", fontWeight: 500, color: 'white' }}>|</a>
        <a style={{ fontSize: "1rem", fontWeight: 500, color: 'white' }}>Cookie Policy</a>
      </div>
    </div>
  )
}
