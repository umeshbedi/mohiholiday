import React, { useEffect, useRef, useState } from 'react'
import { Space, Button, Divider, message, Input } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import JoditEditor from 'jodit-react';
import { db } from '@/firebase';
import firebase from 'firebase/compat/app';
import style from '@/styles/component.module.css'
import FAQEditor from './FAQEditor';

export default function AddIslandDetails({ IslandId, IslandSlug, SIPD, action, update, addnewPlace }) {
    const [thumbnail, setThumbnail] = useState("")
    const [name, setName] = useState("")
    const [slug, setSlug] = useState("")
    const [title, setTitle] = useState("")
    const [about, setAbout] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [faqs, setFaqs] = useState([])
    const [order, setOrder] = useState("")
    const [headerImage, setHeaderImage] = useState("")

    const [msg, showMsg] = message.useMessage()

    useEffect(() => {
        if (SIPD != null && action == 'edit') {
            setName(SIPD.name || "")
            setSlug(SIPD.slug ? SIPD.slug.replace(new RegExp(`^${IslandSlug}/`, "i"), "") : "")
            setTitle(SIPD.title || "")
            setThumbnail(SIPD.thumbnail || "")
            setMetaDescription(SIPD.metaDescription || "")
            setAbout(SIPD.about || "")
            setFaqs(SIPD.faqs || [])
            setOrder(SIPD.order || "")
            setHeaderImage(SIPD.headerImage || "")
        }else{
            setName("")
            setSlug("")
            setTitle("")
            setThumbnail("")
            setMetaDescription("")
            setAbout("")
            setFaqs([])
            setOrder("")
            setHeaderImage("")
        }
    }, [SIPD, action, IslandSlug])

    function addIslandItem() {
        if (thumbnail != "" && name != "" && about != "" && about != "<p><br></p>" && metaDescription != "") {
            const finalSlug = (slug || name.toLowerCase().split(" ").join("-")).replace(new RegExp(`^${IslandSlug}/`, "i"), "");
            db.doc(`island/${IslandId}`).update({
                data: firebase.firestore.FieldValue.arrayUnion({
                    thumbnail, name, about, metaDescription,
                    slug: `${IslandSlug}/${finalSlug}`,
                    title,
                    faqs,
                    order: order ? Number(order) : null,
                    headerImage: headerImage || ""
                })
            }).then(() => {
                msg.success("Place Added");
                setThumbnail("")
                setName("")
                setSlug("")
                setTitle("")
                setAbout("")
                setMetaDescription("")
                setFaqs([])
                setOrder("")
                setHeaderImage("")
            })
        } else {
            msg.error("All fields are required")
        }
    }
    return (
        <div>
            {showMsg}
            <Divider />
            <div style={{ flexDirection: 'column', display: 'flex', gap: 10 }}>
                {SIPD!=null&&
                    <h2 style={{color:style.secondaryColor, marginBottom:15}}><i> Edit {SIPD.name}</i></h2>
                }
                 <div>
                    <h3 style={{ marginBottom: 5 }}>Order No:</h3>
                    <Input type="number" placeholder='Enter Order No' value={order} onChange={(e) => setOrder(e.target.value)} />
                </div>
                <div>
                    <h3 style={{ marginBottom: 5 }}>Name of Place:</h3>
                    <Input required placeholder='Enter Name of Place' value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                    <h3 style={{ marginBottom: 5 }}>Slug:</h3>
                    <Input addonBefore={`${IslandSlug}/`} placeholder='enter-slug-name' value={slug} onChange={(e) => setSlug(e.target.value)} />
                </div>
                <div>
                    <h3 style={{ marginBottom: 5 }}>Thumbnail Url:</h3>
                    <Input required placeholder='Enter Thumbnail Url' value={thumbnail} onChange={(e) => setThumbnail(e.target.value)} />
                </div>
               
                <div>
                    <h3 style={{ marginBottom: 5 }}>Heading Image Url:</h3>
                    <Input placeholder='Enter Heading Image Url' value={headerImage} onChange={(e) => setHeaderImage(e.target.value)} />
                </div>
                <div>
                    <h3 style={{ marginBottom: 10 }}>About Place:</h3>
                    <JoditEditor value={about} onBlur={e => { setAbout(e) }} />
                </div>
                
                <Divider style={{ margin: '10px 0' }} />
                <FAQEditor faqs={faqs} setFaqs={setFaqs} />

                <Divider style={{ margin: '10px 0' }}>SEO Section</Divider>
                
                <div>
                    <h3 style={{ marginBottom: 5 }}>SEO Title:</h3>
                    <Input placeholder='Enter SEO Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                </div>
                <div>
                    <h3 style={{ marginBottom: 5 }}>Meta Description:</h3>
                    <Input.TextArea rows={3} required placeholder='Enter short Meta Description' value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                </div>
                <Divider/>
                <div>
                    <Space>
                        {action=='new'?
                        (<Button onClick={addIslandItem} type='primary'><PlusOutlined /> Add Place</Button>)
                        :
                        (<>
                        <Button onClick={()=>update(name, about, metaDescription, thumbnail, slug, title, faqs, order, headerImage)} type='primary'> Submit changes</Button>
                        <Button onClick={addnewPlace} ><PlusOutlined /> Add New Place</Button>
                        </>)
                    }
                    </Space>
                </div>
            </div>
        </div>
    )
}
