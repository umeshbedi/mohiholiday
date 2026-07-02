import { db } from '@/firebase';
import { DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Modal, Select, Space, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import AddIslandDetails from './AddIslandDetails';


const Islanddb = db.collection("island")

export default function Island() {
    const [open, setOpen] = useState(false);

    const [name, setname] = useState("")
    const [slug, setSlug] = useState("")
    const [title, setTitle] = useState("")
    const [thumbnail, setthumbnail] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [order, setOrder] = useState(0)

    const [edit, setEdit] = useState(false)

    const [selectedIsland, setselectedIsland] = useState(null)
    const [islandItem, setislandItem] = useState([])
    const [SID, setSID] = useState(null)
    const [SIPD, setSIPD] = useState(null)
    const [SIPI, setSIPI] = useState(null)

    const [action, setAction] = useState("new")

    const [msg, showMsg] = message.useMessage()

    useEffect(() => {
        Islanddb.onSnapshot((snap) => {
            const tempIsland = []
            snap.forEach((sndata => {
                tempIsland.push({ id: sndata.id, ...sndata.data() })

            }))
            setislandItem(tempIsland)
        })
    }, [])

    function addNewIsland() {
        if (name != "" && thumbnail != "" && headerImage != "" && metaDescription != "") {
            const finalSlug = (slug || name.toLowerCase().split(" ").join("-")).replace(/^\/island\//i, "");
            Islanddb.add({
                name,
                slug: `/island/${finalSlug}`,
                title,
                thumbnail,
                headerImage, metaDescription,
                order,
                data: []

            }).then(() => { msg.success("Added new Island Succussfully!"); setOpen(false) })
            // console.log(name)
        } else { msg.error("All Fields are required") }
    }

    function editIsland() {
        const finalSlug = (slug || name.toLowerCase().split(" ").join("-")).replace(/^\/island\//i, "");
        Islanddb.doc(`${selectedIsland}`).update({
            name, order, metaDescription, headerImage, thumbnail, slug: `/island/${finalSlug}`, title
        }).then(() => {
            msg.success("Updated")
            setname("")
            setSlug("")
            setTitle("")
            setthumbnail("")
            setHeaderImage("")
            setMetaDescription("")
            setOrder(0)
            setEdit(false)
            setOpen(false)
        })
    }

    function deleteIsland() {
        if (confirm("are you sure want to delete??")) {
            Islanddb.doc(`${selectedIsland}`).delete().then(() =>
                msg.success("deleted"))
            setselectedIsland(null)
            setSIPD(null)
            setSIPI(null)
            setAction("new")
        } else { console.log("denied") }
    }

    useEffect(() => {
        if (selectedIsland != null) {
            const result = islandItem.find(f => f.id == selectedIsland)
            setSID(result)
        }
    }, [selectedIsland, islandItem])

    // console.log(SID)

    function updatePlace(name, about, metaDescription, thumbnail, slug, title, faqs, order, headerImage) {
        const tempSIPD = SID.data
        const finalSlug = (slug || name.toLowerCase().split(" ").join("-")).replace(new RegExp(`^${SID.slug}/`, "i"), "");
        const editedPlace = {
            about, metaDescription, name, thumbnail,
            slug: `${SID.slug}/${finalSlug}`,
            title,
            faqs,
            order: order ? Number(order) : null,
            headerImage: headerImage || ""
        }
        tempSIPD[SIPI] = editedPlace
        Islanddb.doc(`${selectedIsland}`).update({
            data: tempSIPD
        }).then(() => {
            msg.success("updated")
        })
    }



    function deletePlace(i) {
        const tempPlace = SID.data
        tempPlace.splice(i, 1)
        Islanddb.doc(`${selectedIsland}`).update({
            data: tempPlace
        }).then(() => { msg.success("deleted"); setSIPD(null); setAction("new"); setSIPI(null) })
    }

    return (
        <div>
            {showMsg}
            <Button type='dashed' onClick={() => setOpen(true)} ><PlusOutlined /> Add new Island</Button>
            <div style={{ margin: '3% 0' }}>
                <Space>
                    <p>Select Island: </p>
                    <Select
                        placeholder={"select Island Name"}
                        onSelect={setselectedIsland}
                        value={selectedIsland}
                        options={islandItem.map((item, i) => {
                            return ({
                                value: item.id,
                                label: item.name
                            })
                        })}
                    />
                    {selectedIsland != null &&
                        <Space>
                            <Button type='dashed'
                                style={{ color: '#25527b', background: 'none' }}
                                onClick={() => {
                                    setOpen(true)
                                    setEdit(true)
                                    setname(SID.name || "")
                                    setSlug(SID.slug ? SID.slug.replace(/^\/island\//i, "") : "")
                                    setTitle(SID.title || "")
                                    setthumbnail(SID.thumbnail || "")
                                    setHeaderImage(SID.headerImage || "")
                                    setMetaDescription(SID.metaDescription || "")
                                    setOrder(SID.order || 0)

                                }}>
                                <EditOutlined />
                            </Button>
                            <Button type='dashed'
                                style={{ color: 'red', background: 'none' }}
                                onClick={deleteIsland}>
                                <DeleteOutlined />
                            </Button>

                        </Space>
                    }

                </Space>

                {SID != null && selectedIsland != null &&
                    <>
                        {SID.data.length != 0 &&
                            <div>
                                <Divider />
                                <h3 style={{ marginBottom: '2%' }}>Places of {SID.name}</h3>
                                {SID.data.map((d, i) => (
                                    <div key={i} style={{ display: 'flex', gap: 10, color: '#25527b' }}>
                                        <p> <b> #{i + 1}:</b></p>
                                        <div style={{ marginBottom: 10 }}>
                                            <p>{d.name}  {" | "}
                                                <span style={{ cursor: 'pointer' }}><EditFilled onClick={() => {
                                                    setAction("edit"); setSIPD(d); setSIPI(i)
                                                }} /> {" | "} <DeleteFilled
                                                        onClick={() => deletePlace(i)} style={{ color: 'red' }} /></span>
                                            </p>
                                        </div>

                                    </div>
                                ))}
                            </div>
                        }
                        <AddIslandDetails
                            action={action}
                            SIPD={SIPD}
                            IslandSlug={SID.slug}
                            IslandId={selectedIsland}
                            update={updatePlace}
                            addnewPlace={() => { setSIPD(null); setAction("new"); setSIPI(null) }}
                        />

                    </>
                }
            </div>


            {/* ///PopUp Modal SEction//// */}
            <Modal
                open={open}
                onCancel={() => {
                    setname("")
                    setSlug("")
                    setTitle("")
                    setthumbnail("")
                    setHeaderImage("")
                    setMetaDescription("")
                    setOrder(0)
                    setEdit(false)
                    setOpen(false)
                }}
                footer={[
                    <Button type='primary' key={'btn'} onClick={edit ? editIsland : addNewIsland}>{edit ? "Update" : "Add"}</Button>,
                ]}
            >
                <div style={{ flexDirection: 'column', display: 'flex', gap: 10, padding: '1%' }}>
                    <div><label>Order No.:</label>
                        <Input type='number' placeholder='Enter Order No.' value={order} onChange={(e) => setOrder(Number(e.target.value))} />
                    </div>
                    <div><label>Island Name:</label>
                        <Input placeholder='Enter Island Name' value={name} onChange={(e) => setname(e.target.value)} />
                    </div>
                    <div><label>Slug:</label>
                        <Input addonBefore='/island/' placeholder='enter-slug-name' value={slug} onChange={(e) => setSlug(e.target.value)} />
                    </div>
                    <div><label>Header Image Url:</label>
                        <Input placeholder='Enter Header Image Url' value={headerImage} onChange={(e) => setHeaderImage(e.target.value)} />
                    </div>
                    <div><label>Thumbnail Url:</label>
                        <Input placeholder='Enter Thumbnail Url' value={thumbnail} onChange={(e) => setthumbnail(e.target.value)} />
                    </div>
                    
                    <Divider style={{ margin: '10px 0' }}>SEO Section</Divider>
                    
                    <div><label>SEO Title:</label>
                        <Input placeholder='Enter SEO Title' value={title} onChange={(e) => setTitle(e.target.value)} />
                    </div>
                    <div><label>Meta Description:</label>
                        <Input.TextArea rows={3} placeholder='Enter Short Meta Description' value={metaDescription} onChange={(e) => setMetaDescription(e.target.value)} />
                    </div>
                </div>
            </Modal>
        </div>
    )
}
