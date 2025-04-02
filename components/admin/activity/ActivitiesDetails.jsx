import React, { useEffect, useState, useRef } from 'react'
import { Space, Button, Divider, message, Form } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import JoditEditor from 'jodit-react';
import { db } from '@/firebase';
import firebase from 'firebase/compat/app';
import style from '@/styles/component.module.css'


export default function ActivitiesDetails({ IslandId, IslandSlug, SIPD, action, update, addnewPlace }) {
    const [thumbnail, setThumbnail] = useState("")
    const [name, setName] = useState("")
    const [about, setAbout] = useState("")
    const [metaDescription, setMetaDescription] = useState("")

    const [msg, showMsg] = message.useMessage()

    const nameRef = useRef()
    const thumbRef = useRef()
    const metaDecRef = useRef()

    // console.log("from activity details", SIPD)

    useEffect(() => {
        if (SIPD != null && action == 'edit') {
            thumbRef.current.value = SIPD.thumbnail;
            nameRef.current.value = SIPD.name;
            metaDecRef.current.value = SIPD.metaDescription;
            setName(SIPD.name)
            setThumbnail(SIPD.thumbnail)
            setMetaDescription(SIPD.metaDescription)
            setAbout(SIPD.about)
        } else {
            thumbRef.current.value = "";
            nameRef.current.value = "";
            metaDecRef.current.value = "";
            setAbout("")
        }
    }, [SIPD, action])

    function addIslandItem() {
        if (thumbnail != "" && name != "" && about != "" && about != "<p><br></p>" && metaDescription != "") {
            db.doc(`island/${IslandId}`).update({
                data: firebase.firestore.FieldValue.arrayUnion({
                    thumbnail, name, about, metaDescription,
                    slug: `${IslandSlug}/${name.split(" ").join("-")}`
                })
            }).then(() => {
                msg.success("Place Added");
                setThumbnail("")
                setName("")
                setAbout("")
                thumbRef.current.value = "";
                nameRef.current.value = "";
                metaDecRef.current.value = "";

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
                <Form>
                    {SIPD != null &&
                        <h2 style={{ color: style.secondaryColor, marginBottom: 15 }}><i> Edit {SIPD.name}</i></h2>
                    }
                    
                    <div>
                        <Space>
                            <h3 >Name of Place:</h3>
                            <input ref={nameRef} required placeholder='Enter Name of Place' onChange={(e) => setName(e.target.value)} />
                        </Space>
                    </div>
                    <div>
                        <Space>
                            <h3 >Thumbnail Url:</h3>
                            <input ref={thumbRef} required placeholder='Enter Thumbnail Url' onChange={(e) => setThumbnail(e.target.value)} />
                        </Space>
                    </div>
                    <div>
                        <h3 style={{ marginBottom: 10 }}>About Place:</h3>
                        <JoditEditor value={about} onBlur={e => { setAbout(e) }} />
                    </div>
                    <div>
                        <Space>
                            <h3 >Meta Description:</h3>
                            <input ref={metaDecRef} required placeholder='Enter short Meta Description' onChange={(e) => setMetaDescription(e.target.value)} />
                        </Space>
                    </div>
                    <Divider />
                    <div>
                        <Space>
                            {action == 'new' ?
                                (<Button onClick={addIslandItem} type='primary'><PlusOutlined /> Add Place</Button>)
                                :
                                (<>
                                    <Button onClick={() => update(name, about, metaDescription, thumbnail)} type='primary'> Submit changes</Button>
                                    <Button onClick={addnewPlace} ><PlusOutlined /> Add New Place</Button>
                                </>)
                            }
                        </Space>
                    </div>
                </Form>
            </div>
        </div>
    )
}
