import { db } from '@/firebase';
import { DeleteFilled, DeleteOutlined, EditFilled, EditOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Modal, Select, Space, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import AddactivityDetails from './AddactivityDetails';


export default function Activity({activityFor}) {
    
    const activitydb = db.collection(`${activityFor}`)
    
    const [open, setOpen] = useState(false);

    const [name, setname] = useState("")
    const [thumbnail, setthumbnail] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [order, setOrder] = useState(0)
    
    const [selectedactivity, setselectedactivity] = useState(null)
    const [activityItem, setactivityItem] = useState([])
    const [SAD, setSAD] = useState(null)
    const [SIPD, setSIPD] = useState(null)
    const [SIPI, setSIPI] = useState(null)

    const [action, setAction] = useState("new")

    const [msg, showMsg] = message.useMessage()

    const nameRef = useRef()

    useEffect(() => {
        activitydb.onSnapshot((snap) => {
            const tempactivity = []
            snap.forEach((sndata => {
                tempactivity.push({ id: sndata.id, ...sndata.data() })
            }))
            setactivityItem(tempactivity)
        })
    }, [activityFor])

    // console.log(name)

   

    function deleteactivity() {
        setselectedactivity(null)
        setSAD(null)
        
        if (confirm("are you sure want to delete??")) {
            activitydb.doc(`${selectedactivity}`).delete()
            .then(() =>msg.success("deleted"))
            .catch((e)=>msg.error(e.message))
            
        
        } else { console.log("denied") }
    }

    useEffect(() => {
        if (selectedactivity != null) {
            const result = activityItem.find(f => f.id == selectedactivity)
            setSAD(result)
        }
    }, [selectedactivity, activityItem])

    // console.log(SAD)

    function updatePlace(name, about, metaDescription, thumbnail) {
        const tempSIPD = SAD.data
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
        const tempPlace = SAD.data
        tempPlace.splice(i, 1)
        activitydb.doc(`${selectedactivity}`).update({
            data: tempPlace
        }).then(() => { msg.success("deleted"); setSIPD(null); setAction("new"); setSIPI(null) })
    }

    return (
        <div>
            {showMsg}
            {/* <Button type='dashed' onClick={() => {
                setname("")
                setHeaderImage("")
                setthumbnail("")
                setOrder(0)
                setMetaDescription("")
                setIsEdit(false)
                setOpen(true)
            }} ><PlusOutlined /> Add new Activity
            </Button> */}


            <div>
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
                        <Button type='dashed'
                            style={{ color: 'red', background: 'none' }}
                            onClick={deleteactivity}>
                                <DeleteOutlined />
                        </Button>
                    }

                </Space>

                <Divider />

                {/* {SAD != null && selectedactivity != null &&
                    <>
                        {SAD.data.length != 0 &&
                            <div>
                                <h3 style={{ marginBottom: '2%' }}>Places of {SAD.name}</h3>
                                {SAD.data.map((d, i) => (
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

                    </>
                } */}
                <AddactivityDetails
                    details={SAD}
                    addNew={() => { setSAD(null); setselectedactivity(null) }}
                    activityFor={activityFor}
                />
            </div>



        </div>
    )
}
