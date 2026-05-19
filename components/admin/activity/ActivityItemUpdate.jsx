"use client"
import { db } from '@/firebase';
import { Button, Divider, Form, Input, message, Card } from 'antd';
import React, { useEffect, useRef, useState } from 'react'

import JoditEditor from 'jodit-react';
import firebase from 'firebase/compat/app';
import FAQEditor from '@/components/admin/FAQEditor';

export default function ActivityItemUpdate({ collection, data, allItemData, index, submitted=(e)=>{void(e)} }) {

    const [title, setTitle] = useState("")
    const [about, setAbout] = useState("")
    const [thumbnail, setthumbnail] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [metaTitle, setMetaTitle] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [customSlug, setCustomSlug] = useState("")
    const [faqs, setFaqs] = useState([])

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    const titleRef = useRef()
    var headerImageRef = useRef(null)
    var thumbnailRef = useRef(null)
    var metaDescriptionRef = useRef(null)


    function submit() {
        const finalSlugSuffix = customSlug.trim() !== "" ? customSlug.split(" ").join("-") : title.split(" ").join("-")
        const slug = `${allItemData.slug}/${finalSlugSuffix}`
        setLoading(true)
        db.doc(`${collection}`).update({
            data: firebase.firestore.FieldValue.arrayUnion({ 
                title, 
                thumbnail, 
                about, 
                headerImage, 
                metaTitle,
                metaDescription,
                slug,
                faqs
            })
        }).then((e) => {
            messageApi.success("Item Added Successfully!")
            setLoading(false)
            submitted(true)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    function editData() {
        const finalSlugSuffix = customSlug.trim() !== "" ? customSlug.split(" ").join("-") : title.split(" ").join("-")
        const slug = `${allItemData.slug}/${finalSlugSuffix}`
        allItemData.data[index] = { title, thumbnail, about, headerImage, metaTitle, metaDescription, slug, faqs }
        
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
            setMetaTitle(data.metaTitle || "")
            setMetaDescription(data.metaDescription)
            setthumbnail(data.thumbnail)
            if(data.slug && allItemData?.slug) {
                const slugSuffix = data.slug.replace(`${allItemData.slug}/`, "");
                setCustomSlug(slugSuffix);
            } else if (data.title) {
                setCustomSlug(data.title.split(" ").join("-"));
            }
            setFaqs(data.faqs || [])
        }
    }, [data])




    return (
        <div>
            {contextHolder}

            <Form>
                <Form.Item label="Title">
                    <input ref={titleRef} defaultValue={title} placeholder='Enter Page Title' onChange={(e) => setTitle(e.target.value)} />
                </Form.Item>

                <Form.Item label="Slug">
                    <Input addonBefore={allItemData?.slug + '/'} value={data != undefined ? customSlug : (customSlug || title.split(" ").join("-"))} placeholder='Custom Slug (auto-generated if empty)' onChange={(e) => setCustomSlug(e.target.value)} />
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


                <FAQEditor faqs={faqs} setFaqs={setFaqs} />

                <Card title="SEO Settings" size="small" style={{ marginBottom: 20, marginTop: 20, backgroundColor: '#fafafa' }}>
                    <Form.Item label="Meta Title" style={{ marginBottom: 12 }}>
                        <Input value={metaTitle} placeholder='Enter Meta Title (SEO)' onChange={(e) => setMetaTitle(e.target.value)} />
                    </Form.Item>
                    
                    <Form.Item label="Meta Description" style={{ marginBottom: 0 }}>
                        <Input.TextArea value={metaDescription} placeholder='Enter Meta Description (SEO)' rows={3} onChange={(e) => setMetaDescription(e.target.value)} />
                    </Form.Item>
                </Card>
                
                <Button loading={loading} onClick={data != undefined ? editData : submit} type='primary' style={{ marginBottom: '5%' }}>{data != undefined ? "Update" : "Submit"}</Button>

            </Form>
        </div>
    )
}
