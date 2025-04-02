import { db } from '@/firebase';
import { Button, Divider, Form, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'

import JoditEditor from 'jodit-react';
import firebase from 'firebase/compat/app';

export default function DayTripItemUpdate({ data, allItemData, id }) {

    const [title, setTitle] = useState("")
    const [about, setAbout] = useState("")
    const [thumbnail, setthumbnail] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [type, setType] = useState("null")
    const [location, setLocation] = useState("")
    const [duration, setDuration] = useState(0)
    const [price, setPrice] = useState(0)


    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    let titleRef = useRef()
    let headerImageRef = useRef(null)
    let thumbnailRef = useRef(null)
    let metaDescriptionRef = useRef(null)
    let typeRef = useRef()
    let priceRef = useRef()
    let locationRef = useRef()
    let durationRef = useRef()


    function submit() {
        const slug = `trip/${type}/${title.split(" ").join("-")}`
        setLoading(true)
        db.collection('dayTrip').add({title, thumbnail, about, headerImage, metaDescription, slug, type, location, duration, price})
        .then((e) => {
            messageApi.success("Item Added Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    function editData() {
        setLoading(true)
        db.doc(`dayTrip/${id}`)
        .update({title, thumbnail, about, headerImage, metaDescription, type, location, duration, price})
        .then((e) => {
            messageApi.success("Item Updated Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    useEffect(() => {
        if (data != undefined) {
            setAbout(data.about)
            setTitle(data.title)
            setHeaderImage(data.headerImage)
            setMetaDescription(data.metaDescription)
            setthumbnail(data.thumbnail)
            setType(data.type)
            setPrice(data.price)
            setDuration(data.duration)
            setLocation(data.location)
            typeRef.current.value = data.type
            durationRef.current.value = data.duration
            priceRef.current.value = data.price
            // console.log("Index from update", id)
            // console.log("all items data", allItemData)
        }
    }, [data])




    return (
        <div>
            {contextHolder}

            <Form>
                <Form.Item label="Title">
                    <input ref={titleRef} defaultValue={title} placeholder='Enter Page Title' onChange={(e) => setTitle(e.target.value)} />
                </Form.Item>

                <Form.Item label="Location">
                    <input ref={locationRef} defaultValue={location} placeholder='Enter Trip Location' onChange={(e) => setLocation(e.target.value)} />
                </Form.Item>

                <Form.Item label="Trip Duration (hrs.)">
                    <input type='number' min={0} ref={durationRef} defaultValue={duration} placeholder='Enter Trip Duration' onChange={(e) => setDuration(e.target.valueAsNumber)} />
                </Form.Item>

                <Form.Item label="Price (Rs.)">
                    <input type='number' min={0} ref={priceRef} defaultValue={price} placeholder='Enter Trip Price' onChange={(e) => setPrice(e.target.valueAsNumber)} />
                </Form.Item>

                <Form.Item label="Type">
                    <select
                        ref={typeRef}
                        defaultValue={type == undefined ? "null" : type}
                        name="trip-type"
                        className='p-1'
                        onChange={(e) => {
                            if (e.target.value !== "null") {
                                setType(e.target.value);
                                console.log(e.target.value)
                            }
                        }}
                    >
                        <option value="null">select Trip type</option>
                        <option value="car">Car</option>
                        <option value="boat">Boat</option>
                        <option value="combo">Combo</option>
                    </select>
                </Form.Item>

                <Form.Item label="Header Image Url">
                    <input ref={headerImageRef} defaultValue={headerImage} placeholder='Enter Header Image Url' onChange={(e) => setHeaderImage(e.target.value)} />
                </Form.Item>

                <Form.Item label="Thumbnail Url">
                    <input ref={thumbnailRef} defaultValue={thumbnail} placeholder='Enter Thumbnail Url' onChange={(e) => setthumbnail(e.target.value)} />
                </Form.Item>

                <div>
                    <p style={{ marginBottom: 10, fontSize:14 }}>About Trip:</p>
                    <JoditEditor value={about} onBlur={e => { setAbout(e) }} />
                </div>

                <Form.Item label="Meta Description">
                    <input ref={metaDescriptionRef} defaultValue={metaDescription} placeholder='Enter Thumbnail Url' onChange={(e) => setMetaDescription(e.target.value)} />
                </Form.Item>

                <Button loading={loading} onClick={data != undefined ? editData : submit} type='primary' style={{ marginBottom: '5%' }}>{data != undefined ? "Update" : "Submit"}</Button>

            </Form>
        </div>
    )
}
