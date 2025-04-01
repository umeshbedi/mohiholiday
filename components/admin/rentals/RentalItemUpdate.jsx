import { db } from '@/firebase';
import { Button, Divider, Form, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'

import JoditEditor from 'jodit-react';


export default function RentalsItemUpdate({ collection, data }) {

    const [title, setTitle] = useState("")
    const [type, setType] = useState("null")
    const [price, setprice] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [distance, setdistance] = useState("")

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    const titleRef = useRef()
    const typeRef = useRef()
    const priceRef = useRef()
    const thumbnailRef = useRef()
    const distanceRef = useRef()

    function Submit() {
        setLoading(true)
        db.doc(`${collection}`).collection("cabs").add({
            title, price, distance, thumbnail, type
        }).then((e) => {
            messageApi.success("Item Added Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    function EditData() {
        setLoading(true)
        db.doc(`${collection}`).collection("cabs").doc(`${data.id}`).update({
            title, price, distance, thumbnail, type
        }).then((e) => {
            messageApi.success("Page Updated Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    console.log(type)
    useEffect(() => {

        if (data !== undefined) {

            db.doc(`${collection}`).collection("cabs").doc(`${data.id}`).get()
                .then((snap) => {
                    const data = snap.data()
                    if (data !== undefined) {
                        const dataLength = Object.keys(data).length
                        if (dataLength != 0) {
                            setTitle(data.title)
                            setType(data.type)
                            setdistance(data.distance)
                            setprice(data.price)
                            setThumbnail(data.thumbnail)
                            titleRef.current.value = data.title
                            typeRef.current.value = data.type==undefined?"null":data.type
                            priceRef.current.value = data.price
                            thumbnailRef.current.value = data.thumbnail
                            distanceRef.current.value = data.distance
                            
                        } else {
                            setTitle("")
                            setdistance("")
                            setprice("")
                            titleRef.current.value = ""
                            typeRef.current.value = "null"
                            priceRef.current.value = ""
                            thumbnailRef.current.value = ""
                            distanceRef.current.value = ""
                        }
                    }
                })
        }
    }, [data])

    return (
        <div>
            {contextHolder}

            <Form>
                <Form.Item label="Title">
                    <input ref={titleRef} defaultValue={title} placeholder='Enter Page Title' onChange={(e) => setTitle(e.target.value)} />
                </Form.Item>

                <Form.Item label="Type">
                    <select
                        ref={typeRef}
                        defaultValue={type==undefined?"null":type}
                        name="vehicletype"
                        onChange={(e) => {
                            if (e.target.value !== "null") {
                                setType(e.target.value);
                                console.log(e.target.value)
                            }
                        }}
                    >
                        <option value="null">select type</option>
                        <option value="4">4 Wheeler</option>
                        <option value="2">2 Wheeler</option>
                    </select>
                </Form.Item>

                <Form.Item label="Price">
                    <input ref={priceRef} type='number' defaultValue={price} placeholder='Enter Price' onChange={(e) => setprice(e.target.valueAsNumber)} />
                </Form.Item>

                <Form.Item label="Distance (KM)">
                    <input ref={distanceRef} type='number' defaultValue={distance} placeholder='Enter Kilometers' onChange={(e) => setdistance(e.target.valueAsNumber)} />
                </Form.Item>

                <Form.Item label="Vehicle Image">
                    <input ref={thumbnailRef} defaultValue={thumbnail} placeholder='Enter Cab Image url' onChange={(e) => setThumbnail(e.target.value)} />
                </Form.Item>

                <Button loading={loading} onClick={data != undefined ? EditData : Submit} type='primary' style={{ marginBottom: '5%' }}>{data != undefined ? "Update this Vehicle" : "Add Vehicle"}</Button>

            </Form>
        </div>
    )
}
