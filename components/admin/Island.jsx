import { db } from '@/firebase';
import { DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Modal, Select, Space, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import AddIslandDetails from './AddIslandDetails';


const Islanddb = db.collection("island")

export default function Island() {
    const [open, setOpen] = useState(false);

    const [name, setname] = useState("")
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

    var orderRef = useRef(null)
    var nameRef = useRef(null)
    var headerImageRef = useRef(null)
    var thumbnailRef = useRef(null)
    var metaDescriptionRef = useRef(null)

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
            Islanddb.add({
                name,
                slug: `/island/${name.split(" ").join("-")}`,
                thumbnail,
                headerImage, metaDescription,
                order,
                data: []

            }).then(() => { msg.success("Added new Island Succussfully!"); setOpen(false) })
            // console.log(name)
        } else { msg.error("All Fields are required") }
    }

    function editIsland() {
        Islanddb.doc(`${selectedIsland}`).update({
            name, order, metaDescription, headerImage, thumbnail
        }).then(() => {
            msg.success("Updated")
            setname("")
            setthumbnail("")
            setHeaderImage("")
            setMetaDescription("")
            setOrder(0)
            nameRef.current.value = "";
            orderRef.current.value = 0;
            headerImageRef.current.value = "";
            thumbnailRef.current.value = "";
            metaDescriptionRef.current.value = "";
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

    function updatePlace(name, about, metaDescription, thumbnail) {
        const tempSIPD = SID.data
        const editedPlace = {
            about, metaDescription, name, thumbnail,
            slug: tempSIPD[SIPI].slug,

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
                                    setname(SID.name)
                                    setthumbnail(SID.thumbnail)
                                    setHeaderImage(SID.headerImage)
                                    setMetaDescription(SID.metaDescription)
                                    setOrder(SID.order)
                                    setTimeout(() => {
                                        nameRef.current.value = SID.name;
                                        orderRef.current.value = SID.order;
                                        headerImageRef.current.value = SID.headerImage;
                                        thumbnailRef.current.value = SID.thumbnail;
                                        metaDescriptionRef.current.value = SID.metaDescription;
                                    }, 100);

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
                    setthumbnail("")
                    setHeaderImage("")
                    setMetaDescription("")
                    setOrder(0)
                    nameRef.current.value = "";
                    orderRef.current.value = 0;
                    headerImageRef.current.value = "";
                    thumbnailRef.current.value = "";
                    metaDescriptionRef.current.value = "";
                    setEdit(false)
                    setOpen(false)
                }}
                footer={[
                    <Button type='primary' key={'btn'} onClick={edit ? editIsland : addNewIsland}>{edit ? "Update" : "Add"}</Button>,
                ]}
            >
                <div style={{ flexDirection: 'column', display: 'flex', gap: 10, padding: '1%' }}>
                    <div>Order No.:
                        <input ref={orderRef} type='number' placeholder='Enter Order No.' onChange={(e) => setOrder(e.target.valueAsNumber)} />
                    </div>
                    <div>Island Name:
                        <input ref={nameRef} placeholder='Enter Island Name' onChange={(e) => setname(e.target.value)} />
                    </div>
                    <div>Header Image Url:
                        <input ref={headerImageRef} placeholder='Enter Header Image Url' onChange={(e) => setHeaderImage(e.target.value)} />
                    </div>
                    <div>Thumbnail Url:
                        <input ref={thumbnailRef} placeholder='Enter Thumbnail Url' onChange={(e) => setthumbnail(e.target.value)} />
                    </div>
                    <div>Meta Description:
                        <input ref={metaDescriptionRef} placeholder='Enter Short Meta Description' onChange={(e) => setMetaDescription(e.target.value)} />
                    </div>

                </div>
            </Modal>
        </div>
    )
}
