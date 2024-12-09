"use client"
import React from 'react'
import Title from '../master/Title'
import style from './WhatSay.module.css'
import { testimonials } from '../utils/localdb'
import Image from 'next/image'


export default function WhatSay() {
    return (
        <div>
            <Title title='What they Say' center/>

            <div className={style.SayContainer}>

                <div className={style.SayImage}>
                    <Image src={`/images/What they Say.jpg`} alt='What they say background Image' fill style={{ objectFit: 'fill' }} />
                </div>

                <div className={style.SayBox}>
                    <div className={style.arrowBox}/>
                    <h2 style={{fontSize:20, marginBottom:5}}>The Best experience I can have for the Bali and Andaman Trip is via Mohi Holidays Leisures only.</h2>
                    
                    <p style={{fontSize:18}}> I am a travel enthusiast and i have Traveled to Bali and Andaman During the Mohi Holidays Leisures which was unforgettable and i discovered more from the Islands with Local Expertise in depth.  </p>
                    <div className={style.SayAuthor}>
                        <div style={{ width: 80, height: 80, position: 'relative', borderRadius: 100, overflow: 'hidden' }}>
                            <Image src={`/images/Ravindra Patel.jpg`} alt='Ravindra Patel Influencer' fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div>
                            <p style={{ fontWeight: 'bold' }}>by Ravindra Patel</p>
                            <p >Influencer</p>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}
