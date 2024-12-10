import { db } from '@/firebase';
import { Button, Divider, Form, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'

import JoditEditor from 'jodit-react';


export default function PageUpdate({ pageName }) {
    
    const [title, setTitle] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [metaDescription, setmetaDescription] = useState("")
    const [about, setAbout] = useState("")

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    const titleRef = useRef()
    const headerImageRef = useRef()
    const metaDescriptionRef = useRef()

    function Submit() {
        setLoading(true)
        db.collection('pages').doc(`${pageName}`).update({
            title, headerImage, metaDescription, about
        }).then((e) => {
            messageApi.success("Page Updated Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    useEffect(() => {
        db.collection('pages').doc(`${pageName}`).get()
            .then((snap) => {
                const data = snap.data()
                if (data!==undefined) {
                    
                    const dataLength = Object.keys(data).length
                    if (dataLength!=0) {
                        setTitle(data.title)
                        setAbout(data.about)
                        setmetaDescription(data.metaDescription)
                        setHeaderImage(data.headerImage)
                        titleRef.current.value = data.title
                        metaDescriptionRef.current.value = data.metaDescription
                        headerImageRef.current.value = data.headerImage
                    }else{
                        setTitle("")
                        setAbout("")
                        setmetaDescription("")
                        setHeaderImage("")
                        titleRef.current.value = ""
                        metaDescriptionRef.current.value = ""
                        headerImageRef.current.value = ""
                    }
                }
            })
    }, [pageName])

    return (
        <div>
            {contextHolder}

            <h1 style={{ fontSize: '200%', marginBottom: 20 }}>{pageName}</h1>
            <Form>
                <Form.Item label="Title">
                    <input ref={titleRef} defaultValue={title} placeholder='Enter Page Title' onChange={(e)=>setTitle(e.target.value)}/>
                </Form.Item>
                <Form.Item label="Header Image">
                    <input ref={headerImageRef} defaultValue={headerImage} placeholder='Enter header Image url' onChange={(e)=>setHeaderImage(e.target.value)}/>
                </Form.Item>
                <Form.Item >
                    <JoditEditor onBlur={e => setAbout(e)} value={about} />
                </Form.Item>

                <Form.Item label="Meta Description">
                    <input ref={metaDescriptionRef} defaultValue={metaDescription} placeholder='Enter Short Meta Description' onChange={(e)=>setmetaDescription(e.target.value)}/>
                </Form.Item>

                <Button loading={loading} onClick={Submit} type='primary' style={{ marginBottom: '5%' }}>Save</Button>
                
            </Form>
        </div>
    )
}
