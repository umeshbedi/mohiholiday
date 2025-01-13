import { db } from '@/firebase';
import { DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Modal, Select, Space, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import ActivitiesDetails from './ActivitiesDetails';


const activitydb = db.collection("activity")

export default function Activities() {
    const [open, setOpen] = useState(false);

    const [name, setname] = useState("")
    const [thumbnail, setthumbnail] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [order, setOrder] = useState(0)

    const [edit, setEdit] = useState(false)

    const [selectedactivity, setselectedactivity] = useState(null)
    const [activityItem, setactivityItem] = useState([])
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
        activitydb.onSnapshot((snap) => {
            const tempactivity = []
            snap.forEach((sndata => {
                tempactivity.push({ id: sndata.id, ...sndata.data() })

            }))
            setactivityItem(tempactivity)
        })
    }, [])

    function addNewactivity() {
        if (name != "" && thumbnail != "" && headerImage != "" && metaDescription != "") {
            activitydb.add({
                name,
                slug: `/activity/${name.split(" ").join("-")}`,
                thumbnail,
                headerImage, metaDescription,
                order,
                data: []

            }).then(() => { msg.success("Added new activity Succussfully!"); setOpen(false) })
            // console.log(name)
        } else { msg.error("All Fields are required") }
    }

    function editactivity() {
        activitydb.doc(`${selectedactivity}`).update({
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

    function deleteactivity() {
        if (confirm("are you sure want to delete??")) {
            activitydb.doc(`${selectedactivity}`).delete().then(() =>
                msg.success("deleted"))
            setselectedactivity(null)
            setSIPD(null)
            setSIPI(null)
            setAction("new")
        } else { console.log("denied") }
    }

    useEffect(() => {
        if (selectedactivity != null) {
            const result = activityItem.find(f => f.id == selectedactivity)
            setSID(result)
        }
    }, [selectedactivity, activityItem])

    // console.log(SID)

    function updatePlace(name, about, metaDescription, thumbnail) {
        const tempSIPD = SID.data
        const editedPlace = {
            about, metaDescription, name, thumbnail,
            slug: tempSIPD[SIPI].slug,

        }
        tempSIPD[SIPI] = editedPlace
        activitydb.doc(`${selectedactivity}`).update({
            data: tempSIPD
        }).then(() => {
            msg.success("updated")
        })
    }

    function deletePlace(i) {
        const tempPlace = SID.data
        tempPlace.splice(i, 1)
        activitydb.doc(`${selectedactivity}`).update({
            data: tempPlace
        }).then(() => { msg.success("deleted"); setSIPD(null); setAction("new"); setSIPI(null) })
    }

    return (
        <div>
            {showMsg}
            <Button type='dashed' onClick={() => setOpen(true)} ><PlusOutlined /> Add new activity</Button>
            <div style={{ margin: '3% 0' }}>
                <Space>
                    <p>Select activity: </p>
                    <Select
                        placeholder={"select activity Name"}
                        onSelect={setselectedactivity}
                        value={selectedactivity}
                        options={activityItem.map((item, i) => {
                            return ({
                                value: item.id,
                                label: item.name
                            })
                        })}
                    />
                    {selectedactivity != null &&
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
                                onClick={deleteactivity}>
                                <DeleteOutlined />
                            </Button>

                        </Space>
                    }

                </Space>

                {SID != null && selectedactivity != null &&
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
                        <ActivitiesDetails
                            action={action}
                            SIPD={SIPD}
                            activitySlug={SID.slug}
                            activityId={selectedactivity}
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
                    <Button type='primary' key={'btn'} onClick={edit ? editactivity : addNewactivity}>{edit ? "Update" : "Add"}</Button>,
                ]}
            >
                <div style={{ flexDirection: 'column', display: 'flex', gap: 10, padding: '1%' }}>
                    <div>Order No.:
                        <input ref={orderRef} type='number' placeholder='Enter Order No.' onChange={(e) => setOrder(e.target.valueAsNumber)} />
                    </div>
                    <div>activity Name:
                        <input ref={nameRef} placeholder='Enter activity Name' onChange={(e) => setname(e.target.value)} />
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
