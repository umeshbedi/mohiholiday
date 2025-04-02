import { db } from '@/firebase';
import { Button, Divider, Form, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'

import JoditEditor from 'jodit-react';
import firebase from 'firebase/compat/app';

export default function ActivityItemUpdate({ collection, data, allItemData, index }) {

    const [title, setTitle] = useState("")
    const [about, setAbout] = useState("")
    const [thumbnail, setthumbnail] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [metaDescription, setMetaDescription] = useState("")

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    const titleRef = useRef()
    var headerImageRef = useRef(null)
    var thumbnailRef = useRef(null)
    var metaDescriptionRef = useRef(null)


    function submit() {
        const slug = `${allItemData.slug}/${title.split(" ").join("-")}`
        setLoading(true)
        db.doc(`${collection}`).update({
            data: firebase.firestore.FieldValue.arrayUnion({ 
                title, 
                thumbnail, 
                about, 
                headerImage, 
                metaDescription,
                slug
            })
        }).then((e) => {
            messageApi.success("Item Added Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    function editData() {
        allItemData.data[index] = { title, thumbnail, about, headerImage, metaDescription }
        
        setLoading(true)
        db.doc(`${collection}`).update({
            data: allItemData.data
        }).then((e) => {
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
            console.log("Index from update",index)
            console.log("all items data", allItemData)
        }
    }, [data])




    return (
        <div>
            {contextHolder}

            <Form>
                <Form.Item label="Title">
                    <input ref={titleRef} defaultValue={title} placeholder='Enter Page Title' onChange={(e) => setTitle(e.target.value)} />
                </Form.Item>

                <Form.Item label="Header Image Url">
                    <input ref={headerImageRef} defaultValue={headerImage} placeholder='Enter Header Image Url' onChange={(e) => setHeaderImage(e.target.value)} />
                </Form.Item>

                <Form.Item label="Thumbnail Url">
                    <input ref={thumbnailRef} defaultValue={thumbnail} placeholder='Enter Thumbnail Url' onChange={(e) => setthumbnail(e.target.value)} />
                </Form.Item>

                <div>
                    <h3 style={{ marginBottom: 10 }}>About Place:</h3>
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
