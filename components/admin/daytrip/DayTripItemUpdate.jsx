"use client"
import { db } from '@/firebase';
import { Button, Divider, Form, Input, InputNumber, Select, message } from 'antd';
const { TextArea } = Input;
import React, { useEffect, useRef, useState } from 'react'

import JoditEditor from 'jodit-react';
import firebase from 'firebase/compat/app';

export default function DayTripItemUpdate({ data, allItemData, id }) {

    const [title, setTitle] = useState("")
    const [about, setAbout] = useState("")
    const [thumbnail, setthumbnail] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [type, setType] = useState(null)
    const [location, setLocation] = useState("")
    const [duration, setDuration] = useState(0)
    const [price, setPrice] = useState(0)

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    function submit() {
        const slug = `trip/${type}/${title.split(" ").join("-")}`
        setLoading(true)
        db.collection('dayTrip').add({ title, thumbnail, about, headerImage, metaDescription, slug, type, location, duration, price })
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
            .update({ title, thumbnail, about, headerImage, metaDescription, type, location, duration, price })
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
        }
    }, [data])

    return (
        <div>
            {contextHolder}

            <Form layout="vertical">
                <Form.Item label="Title">
                    <Input
                        value={title}
                        placeholder='Enter Page Title'
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Location">
                    <Input
                        value={location}
                        placeholder='Enter Trip Location'
                        onChange={(e) => setLocation(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Trip Duration (hrs.)">
                    <InputNumber
                        min={0}
                        value={duration}
                        placeholder='Enter Trip Duration'
                        onChange={(val) => setDuration(val)}
                        style={{ width: '100%' }}
                    />
                </Form.Item>

                <Form.Item label="Price (Rs.)">
                    <InputNumber
                        min={0}
                        value={price}
                        placeholder='Enter Trip Price'
                        onChange={(val) => setPrice(val)}
                        style={{ width: '100%' }}
                        prefix="₹"
                    />
                </Form.Item>

                <Form.Item label="Type">
                    <Select
                        value={type}
                        placeholder="Select Trip Type"
                        onChange={(val) => setType(val)}
                        options={[
                            { value: 'car', label: 'Car' },
                            { value: 'boat', label: 'Boat' },
                            { value: 'combo', label: 'Combo' },
                        ]}
                    />
                </Form.Item>

                <Form.Item label="Header Image URL">
                    <Input
                        value={headerImage}
                        placeholder='Enter Header Image URL'
                        onChange={(e) => setHeaderImage(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Thumbnail URL">
                    <Input
                        value={thumbnail}
                        placeholder='Enter Thumbnail URL'
                        onChange={(e) => setthumbnail(e.target.value)}
                    />
                </Form.Item>

                <Form.Item label="Short Description">
                    <TextArea
                        value={metaDescription}
                        placeholder='Enter short description'
                        onChange={(e) => setMetaDescription(e.target.value)}
                        rows={4}
                    />
                </Form.Item>

                <div>
                    <p style={{ marginBottom: 10, fontSize: 14 }}>About Trip:</p>
                    <JoditEditor value={about} onBlur={e => { setAbout(e) }} />
                </div>

                <Button
                    loading={loading}
                    onClick={data != undefined ? editData : submit}
                    type='primary'
                    style={{ marginBottom: '5%', marginTop: '2rem' }}
                >
                    {data != undefined ? "Update" : "Submit"}
                </Button>

            </Form>
        </div>
    )
}
