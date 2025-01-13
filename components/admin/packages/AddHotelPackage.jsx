"use client"
import { CloseCircleFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Input } from 'antd'
import React, { useState } from 'react'
import { useEffect } from 'react'


export default function AddHotelPackage() {
    const [hotels, setHotels] = useState([])

    useEffect(() => {
        setTimeout(() => {
            const localData = localStorage.getItem("hotelName")
            if (localData != null) {
                setHotels(JSON.parse(localData))
            }
            // console.log(localData)
        }, 500);
    }, [])

    function addHotels() {
        const hotelName = document.getElementById("hotelName")
        const tempHotel = [...hotels]
        tempHotel.push(hotelName.value)

        setHotels(tempHotel)
        localStorage.setItem("hotelName", JSON.stringify(tempHotel))
    }

    function removeHotel(i) {
        if (i > -1) { // only splice array when item is found
            const tempHotel = []
            hotels.map((item, index) => {
                if (i != index) {
                    tempHotel.push(item)
                }
            })
            console.log(tempHotel)
            setHotels(tempHotel)
            localStorage.setItem("hotelName", JSON.stringify(tempHotel))
        }
    }


    return (
        <div>
            {hotels.map((items, index) => (
                <p key={index}>{items} <CloseCircleFilled onClick={() => removeHotel(index)} /></p>
            ))}
            <Input id='hotelName' placeholder='Enter something...' />
            <Button type='dashed'
                onClick={addHotels}

            ><PlusOutlined /> Add</Button>

        </div>
    )
}
