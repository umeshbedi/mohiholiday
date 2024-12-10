import { db } from '@/firebase';
import { DeleteOutlined, PlusOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Select, Space, message } from 'antd'
import React, { useEffect, useState } from 'react'
import AddFerryDetails from './AddFerryDetails';

const ferrydb = db.collection("ferry")

export default function Ferry() {
    const [open, setOpen] = useState(false);
    const [ferryName, setFerryName] = useState("")
    const [selectedFerry, setSelectedFerry] = useState(null)
    const [ferryItem, setFerryItem] = useState([])
    const [sfD, setSfD] = useState(null)

    const [msg, showMsg] = message.useMessage()

    useEffect(() => {
        ferrydb.onSnapshot((snap) => {
            const tempFerry = []
            snap.forEach((sndata => {
                tempFerry.push({ id: sndata.id, ...sndata.data() })
            }))
            setFerryItem(tempFerry)
        })
    }, [])

    function addNewFerry() {
        if (ferryName != "") {
            ferrydb.add({
                name: ferryName,
                slug: `/ferry/${ferryName.split(" ").join("-")}`,
                about: "",
                termAndCondtion: "",
                ticket: [],
                image: "",
                classes: [],
                metaDescription: "",
                metaTag: ""
            }).then(() => { msg.success("Added new ferry Succussfully!"); setOpen(false) })
            // console.log(ferryName)
        } else { msg.error("Please enter ferry name") }
    }

    function deleteFerry() {
        if (confirm("are you sure want to delete??")) {
            ferrydb.doc(`${selectedFerry}`).delete().then(() => msg.success("deleted"))
            setSelectedFerry(null)
        } else { console.log("denied") }
    }

    useEffect(() => {
        if (selectedFerry != null) {
            const result = ferryItem.find(f => f.id == selectedFerry)
            setSfD(result)
        }
    }, [selectedFerry])

    return (
        <div>
            {showMsg}
            <Button type='dashed' onClick={() => setOpen(true)} ><PlusOutlined /> Add new Ferry</Button>
            <div style={{ margin: '3% 0' }}>
                <Space>
                    <p>Select Ferry: </p>
                    <Select
                        placeholder={"select Ferry Name"}
                        onSelect={setSelectedFerry}
                        value={selectedFerry}
                        // onFocus={()=>setSfD(null)}
                        options={ferryItem.map((item, i) => {
                            return ({
                                value: item.id,
                                label: item.name
                            })
                        })}
                    />
                    {selectedFerry != null &&
                        <Button type='dashed' style={{ color: 'red', background: 'none' }}
                            onClick={deleteFerry}><DeleteOutlined /> Delete Ferry</Button>
                    }

                </Space>

                {sfD != null && selectedFerry != null &&
                    <AddFerryDetails details={sfD} ferryId={selectedFerry} />
                }
            </div>

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={[
                    <Button type='primary' key={'btn'} onClick={addNewFerry}>Add</Button>,
                ]}
            >
                <div style={{ flexDirection: 'column', display: 'flex', gap: 10, padding: '1%' }}>
                    <p>Ferry Name:</p>
                    <Input placeholder='Enter Ferry Name' onChange={(e) => setFerryName(e.target.value)} />
                </div>
            </Modal>
        </div>
    )
}
