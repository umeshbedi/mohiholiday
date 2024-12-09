import React, { useEffect, useRef, useState } from 'react'
import style from './Counter.module.css'
import MyButton from '../utils/MyButton'
import CountUp from 'react-countup'
import { useIsVisible } from '../utils/onVisible'
import { FaPlus } from 'react-icons/fa'
import { mobile } from '../utils/variables'

export default function Counter() {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        setIsMobile(mobile())
    }, [isMobile])

    const ref = useRef();
    const isVisible = useIsVisible(ref)

    function Timer({time, upText, lowText}) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 102, }}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <CountUp style={{ fontSize: "2.5rem", fontWeight: 800 }} duration={5} start={isVisible ? 100 : null} end={isVisible ? time : null} />
                    <FaPlus style={{ marginLeft: 3, marginTop: -10 }} />
                </div>
                <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>{upText}</p>
                <p style={{ fontSize: "1.2rem", fontWeight: 600 }}>{lowText}</p>
            </div>
        )
    }

    const timerVal = [
        {time:500, upText:"Tours", lowText:"Completed"},
        {time:650, upText:"Satisfied", lowText:"Clients"},
        {time:800, upText:"Rooms", lowText:"Booked"},
        {time:999, upText:"Activities", lowText:"Booked"},
    ]

    return (
        <div
            className={style.counterDiv}
            style={{
                position: 'relative',
                padding: isMobile?"2.5rem 0 2rem 0":'90px 0 116px',
                marginBottom:!isMobile?320:null
            }}
        >
            <div style={{ marginLeft: isMobile ? "5%" : '50%', paddingRight: "5%", zIndex:2 }}>
                <h1 style={{ fontWeight: 600}}>Discover with the Leaders of Andaman tourism. We are
                <br /><span style={{ fontWeight: 900, color: "var(--primaryColor)" }}>Mohi Holidays Leisures</span>
                </h1>
                <br />
                <p style={{  fontWeight: 400, fontStyle: 'italic' }}>Embark on a breathtaking journey that seamlessly combines the tropical paradises of Andaman  with Mohi Holidays Leisures. Experience the ultimate blend of tourism like never before, where every moment is an unforgettable adventure.</p>
                <p style={{  fontWeight: 400, fontStyle: 'italic' }}>{`Mohi Holidays Leisures invites you to discover the best of both worlds as you explore the stunning landscapes and cultures of Andaman . Picture yourself strolling along pristine, sun-kissed beaches with turquoise waters that stretch as far as the eye can see.`}</p>
                <br />
                <div style={{ width: 'fit-content' }}><MyButton name={"Know More"} slug={"/about-us"} /></div>
                <br />
                {!isMobile&&<br />}

                <div ref={ref} style={{display:'flex', flexWrap:'wrap', gap:"2.5rem", justifyContent:isMobile?'center':"left"}}>
                    {timerVal.map((item, index)=>(
                        <Timer key={index} time={item.time} lowText={item.lowText} upText={item.upText}/>
                    ))}
                    
                </div>
            </div>
        </div>
    )
}
