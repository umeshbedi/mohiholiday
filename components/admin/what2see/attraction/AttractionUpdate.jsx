import { db } from '@/firebase';
import { Button, Divider, Form, Input, message } from 'antd';
import React, { useEffect, useRef, useState } from 'react'

import JoditEditor from 'jodit-react';
import AttractionItemList from './ItemsList';


export default function Attraction({ collection, data }) {

    const [title, setTitle] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [thumbnail, setThumbnail] = useState("")
    const [metaDescription, setmetaDescription] = useState("")


    const [messageApi, contextHolder] = message.useMessage();
    const [loading, setLoading] = useState(false)

    const titleRef = useRef()
    const headerImageRef = useRef()
    const metaDescriptionRef = useRef()
    const thumbnailRef = useRef()

    // console.log(data)

    function Submit() {
        setLoading(true)
        db.collection(`${collection}`).add({
            title, headerImage, metaDescription, thumbnail,
            slug:`/attraction-${collection=="attractionBali"?"Bali":"Andaman"}/${title.split(" ").join("-")}`
        }).then((e) => {
            messageApi.success("Item Added Successfully!")
            setLoading(false)
        }).catch((err) => {
            messageApi.error(err.message)
        })
    }

    function EditData() {
        setLoading(true)
        db.collection(`${collection}`).doc(`${data.id}`).update({
            title, headerImage, metaDescription, thumbnail
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
                            setTitle(data.title)

                            setmetaDescription(data.metaDescription)
                            setHeaderImage(data.headerImage)
                            setThumbnail(data.thumbnail)
                            titleRef.current.value = data.title
                            metaDescriptionRef.current.value = data.metaDescription
                            headerImageRef.current.value = data.headerImage
                            thumbnailRef.current.value = data.thumbnail
                        } else {
                            setTitle("")

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


                <Form.Item label="Meta Description">
                    <input ref={metaDescriptionRef} defaultValue={metaDescription} placeholder='Enter Short Meta Description' onChange={(e) => setmetaDescription(e.target.value)} />
                </Form.Item>


                <Button loading={loading} onClick={data != undefined ? EditData : Submit} type='primary' style={{ marginBottom: '5%' }}>{data != undefined ? "Update" : "Add New"}</Button>

            </Form>
            {data !== undefined &&
                <AttractionItemList collection={collection} id={data.id} slug={data.slug}/>
            }
        </div>
    )
}
