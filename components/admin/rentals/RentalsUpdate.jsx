import { db } from '@/firebase';
import { Button, Divider, Form, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'

import JoditEditor from 'jodit-react';
import RentalsItemList from './RentalItemsList';
import FAQEditor from '../FAQEditor';


export default function RentalsUpdate({ collection, data }) {

    const [title, setTitle] = useState("")
    const [slug, setSlug] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [metaDescription, setmetaDescription] = useState("")
    const [faqs, setFaqs] = useState([])
    const [order, setOrder] = useState(0)

    const prefix = `/cabs/${collection=="rentalBali"?"Bali":"Andaman"}/`;

    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    function Submit() {
        setLoading(true)
        const finalSlug = (slug || title.toLowerCase().split(" ").join("-")).replace(new RegExp(`^${prefix}`, "i"), "");
        db.collection(`${collection}`).add({
            title, headerImage, metaDescription, thumbnail, order, faqs,
            slug: `${prefix}${finalSlug}`
        }).then((e) => {
            messageApi.success("Item Added Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    function EditData() {
        setLoading(true)
        const finalSlug = (slug || title.toLowerCase().split(" ").join("-")).replace(new RegExp(`^${prefix}`, "i"), "");
        db.collection(`${collection}`).doc(`${data.id}`).update({
            title, headerImage, metaDescription, thumbnail, order, faqs,
            slug: `${prefix}${finalSlug}`
        }).then((e) => {
            messageApi.success("Page Updated Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    useEffect(() => {

        if (data !== undefined) {

            db.collection(`${collection}`).doc(`${data.id}`).get()
                .then((snap) => {
                    const data = snap.data()
                    if (data !== undefined) {
                        const dataLength = Object.keys(data).length
                        if (dataLength != 0) {
                            setTitle(data.title || "")
                            setSlug(data.slug ? data.slug.replace(new RegExp(`^${prefix}`, "i"), "") : "")
                            setmetaDescription(data.metaDescription || "")
                            setHeaderImage(data.headerImage || "")
                            setThumbnail(data.thumbnail || "")
                            setOrder(data.order || 0)
                            setFaqs(data.faqs || [])
                        } else {
                            setTitle("")
                            setSlug("")
                            setmetaDescription("")
                            setHeaderImage("")
                            setThumbnail("")
                            setOrder(0)
                            setFaqs([])
                        }
                    }
                })
        }
    }, [data])



    return (
        <div>
            {contextHolder}

            <Form layout="vertical">
                <Form.Item label="Order No.">
                    <Input type='number' placeholder='Enter Order No.' value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                </Form.Item>
                <Form.Item label="Title">
                    <Input placeholder='Enter Page Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                </Form.Item>
                <Form.Item label="Slug">
                    <Input addonBefore={prefix} placeholder='enter-slug-name' value={slug} onChange={(e) => setSlug(e.target.value)} />
                </Form.Item>
                <Form.Item label="Header Image">
                    <Input placeholder='Enter header Image url' value={headerImage} onChange={(e) => setHeaderImage(e.target.value)} />
                </Form.Item>
                <Form.Item label="Thumbnail">
                    <Input placeholder='Enter Thumbnail Image url' value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
                </Form.Item>
                <Form.Item label="Meta Description">
                    <Input.TextArea rows={3} placeholder='Enter Short Meta Description' value={metaDescription} onChange={(e) => setmetaDescription(e.target.value)} />
                </Form.Item>
                
                <Divider style={{ margin: '10px 0' }} />
                <FAQEditor faqs={faqs} setFaqs={setFaqs} />

                <Button loading={loading} onClick={data != undefined ? EditData : Submit} type='primary' style={{ marginBottom: '5%' }}>{data != undefined ? "Update" : "Add New"}</Button>

            </Form>
            {data !== undefined &&
                <RentalsItemList collection={collection} id={data.id} />
            }
        </div>
    )
}
