import { db } from '@/firebase';
import { Button, Divider, Form, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'

import JoditEditor from 'jodit-react';


export default function AttractionItemUpdate({ collection, data , slug}) {

    const [title, setTitle] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [metaDescription, setmetaDescription] = useState("")
    const [about, setAbout] = useState("")

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    const titleRef = useRef()
    const headerImageRef = useRef()
    const metaDescriptionRef = useRef()
    const thumbnailRef = useRef()

    
    function Submit() {
        setLoading(true)
        db.doc(`${collection}`).collection("popularAttraction").add({
            title, headerImage, metaDescription, about, thumbnail,
            slug:`${slug}/${title.split(" ").join("-")}`
        }).then((e) => {
            messageApi.success("Item Added Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    function EditData() {
        setLoading(true)
        db.doc(`${collection}`).collection("popularAttraction").doc(`${data.id}`).update({
            title, headerImage, metaDescription, about, thumbnail
        }).then((e) => {
            messageApi.success("Page Updated Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }


    useEffect(() => {

        if (data !== undefined) {

            db.doc(`${collection}`).collection("popularAttraction").doc(`${data.id}`).get()
                .then((snap) => {
                    const data = snap.data()
                    if (data !== undefined) {
                        const dataLength = Object.keys(data).length
                        if (dataLength != 0) {
                            setTitle(data.title)
                            setAbout(data.about)
                            setmetaDescription(data.metaDescription)
                            setHeaderImage(data.headerImage)
                            setThumbnail(data.thumbnail)
                            titleRef.current.value = data.title
                            metaDescriptionRef.current.value = data.metaDescription
                            headerImageRef.current.value = data.headerImage
                            thumbnailRef.current.value = data.thumbnail
                        } else {
                            setTitle("")
                            setAbout("")
                            setmetaDescription("")
                            setHeaderImage("")
                            titleRef.current.value = ""
                            metaDescriptionRef.current.value = ""
                            headerImageRef.current.value = ""
                            thumbnailRef.current.value = ""
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
                <Form.Item label="Header Image">
                    <input ref={headerImageRef} defaultValue={headerImage} placeholder='Enter header Image url' onChange={(e) => setHeaderImage(e.target.value)} />
                </Form.Item>
                <Form.Item label="Thumbnail">
                    <input ref={thumbnailRef} defaultValue={thumbnail} placeholder='Enter header Image url' onChange={(e) => setThumbnail(e.target.value)} />
                </Form.Item>
                <Form.Item >
                    <JoditEditor onBlur={e => setAbout(e)} value={about} />
                </Form.Item>

                <Form.Item label="Meta Description">
                    <input ref={metaDescriptionRef} defaultValue={metaDescription} placeholder='Enter Short Meta Description' onChange={(e) => setmetaDescription(e.target.value)} />
                </Form.Item>

                <Button loading={loading} onClick={data != undefined ? EditData : Submit} type='primary' style={{ marginBottom: '5%' }}>{data != undefined ? "Update this Attraction" : "Add Popular Attraction"}</Button>

            </Form>
        </div>
    )
}
