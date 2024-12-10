import { db } from '@/firebase'
import { DeleteOutlined, EditOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Modal, Select, Space, Tabs, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'



export default function AddPackage({packageFor=""}) {
    
    const packagedb = db.collection(`${packageFor}`)

    const [packageItem, setPackageItem] = useState([])
    const [singlePackage, setSinglePackage] = useState([])

    const [messageApi, contextHolder] = message.useMessage()

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedSinglePackage, setSelectedSinglePackage] = useState(null)

    const [edit, setEdit] = useState(false)

    const orderRef = useRef()
    const nameRef = useRef()
    const metaDescriptionRef = useRef()

    
    useEffect(() => {
        packagedb.onSnapshot((snap) => {
            const packageTemp = []
            snap.forEach((snapdata) => {
                const singlePackageTemp = []
                packagedb.doc(`${snapdata.id}`).collection("singlePackage").onSnapshot((sn) => {
                    sn.forEach((single) => {
                        singlePackageTemp.push(single.data())
                    })
                })
                packageTemp.push({ id: snapdata.id, ...snapdata.data(), singlePackage: singlePackageTemp })
            })
            setPackageItem(packageTemp)
        })

    }, [packageFor])
    
    function updateSinglePackage(e) {
        packagedb.doc(`${selectedSinglePackage}`)
        .collection("singlePackage")
        .doc(`${e.id}`)
        .update({order:Number(e.order), name:e.name})
        .then(()=>messageApi.success("saved"))
        .catch(e=>messageApi.error(e.message))
        
    }

    useEffect(() => {
        if (selectedSinglePackage != null) {
            packagedb.doc(`${selectedSinglePackage}`)
                .collection("singlePackage").onSnapshot((snap) => {
                    const singlePackageTemp = []
                    snap.forEach((sndata) => {
                        singlePackageTemp.push({ id: sndata.id, ...sndata.data() })
                    })
                    setSinglePackage(singlePackageTemp)
                })
        }
    }, [selectedSinglePackage])


    function AddPacakgeGroup(value) {
        const slug = value.package_name.split(" ").join("-")
        
        if (edit) {
            packagedb.doc(`${selectedSinglePackage}`).update({
                name: value.package_name,
                meteDescription: value.meteDescription,
                order: Number(value.order)
            })
                .then(() => { messageApi.success("Updated!") })
                .catch((err) => { messageApi.error(err.message) })
        } else {
            packagedb.add({
                name: value.package_name,
                slug: `/package/${slug}`,
                meteDescription: value.meteDescription,
                order: Number(value.order)
            })
                .then(() => { messageApi.success("Added new Package Group Successfully!") })
                .catch((err) => { messageApi.error(err.message) })
        }

    }

    function deleteGroup() {
        packagedb.doc(`${selectedSinglePackage}`).delete()
            .then(() => { messageApi.success("Deleted Successfully!"); setSelectedGroup(null) })
            .catch((e) => messageApi.error(e.message))
    }

    function deleteSinglePackage(val) {
        if (selectedSinglePackage != null) {
            packagedb.doc(`${selectedSinglePackage}`)
                .collection("singlePackage").doc(`${val}`).delete()
                .then(() => messageApi.success("Deleted Successfully!"))
                .catch((e) => messageApi.error(e.message))
        }

    }




    function SelectedGrp() {
        const result = packageItem.find(f => f.name == selectedGroup)
        // console.log(result)
        if (result != undefined) {
            setSelectedSinglePackage(result.id)
        }
        const pos = packageItem.findIndex(i => i.name == selectedGroup)
        console.log(packageFor)

        function addPackage(val) {
            const value = val.package_name
            packagedb.doc(`${result.id}`)
                .collection("singlePackage")
                .add({
                    name: value,
                    slug: "",
                    images: [],
                    thumbnail: "",
                    travelJourney: [],
                    title: "",
                    subtitle: "",
                    highlights: "",
                    inclusion: "",
                    overview: "",
                    exclusion: "",
                    metaDescription: "",
                    metaTag: "",
                    status: 'draft',
                    includeIcon: []

                })
                .then(() => {
                    messageApi.success("Added new Package Successfully")
                })
                .catch((err) => {
                    messageApi.error(err.message)
                })

        }

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, padding: '1%', border: "solid .3px rgba(0,0,0,.2)", width: 'fit-content' }}>
                {result !== undefined &&
                    singlePackage.map((res, i) => (
                        <Form key={i} onFinish={updateSinglePackage}>
                            <Space>
                                <Form.Item name='id' initialValue={res.id} style={{ margin: 0, fontWeight: 'bold' }} />
                                <Form.Item name='name' initialValue={res.name} label={`Package #${i + 1}`} style={{ margin: 0, fontWeight: 'bold' }}>
                                    <Input required placeholder='Enter Package Name' />
                                </Form.Item>
                                <Form.Item label="Order No." name="order" initialValue={res.order} style={{ margin: 0, fontWeight: 'bold' }}>
                                    <Input type='number' defaultValue={res.order} placeholder='Enter Order No.' />
                                </Form.Item>

                                <Button type='dashed' style={{ color: 'grey' }} htmlType='submit'>< SaveOutlined /></Button>
                                <Button type='dashed' style={{ color: 'red' }} onClick={() => deleteSinglePackage(res.id)} >< DeleteOutlined /></Button>
                            </Space>
                        </Form>
                    ))

                }
                <Form onFinish={addPackage}>
                    <Space>
                        <Form.Item name='package_name' label={"Package Name"} style={{ margin: 0 }}>
                            <Input required placeholder='Enter Package Name' />
                        </Form.Item>
                        <Button type='dashed' style={{ color: 'grey' }} htmlType='submit'>< PlusOutlined />Add New Package</Button>
                    </Space>
                </Form>

            </div>
        )
    }

    return (
        <div>
            {contextHolder}
            <h1 style={{ fontSize: '150%', marginBottom: 10 }}>Packages</h1>
            {packageItem.length !== 0 &&
                <>
                    <Space>
                        <p>Select Package Group Name: </p>
                        <Select
                            placeholder={"select Package Name"}
                            onSelect={setSelectedGroup}
                            value={selectedGroup}
                            options={packageItem.map((item, i) => {
                                return ({
                                    value: item.name,
                                    label: item.name
                                })
                            })}
                        />
                        {selectedGroup != null &&
                            <Space>
                                <Button type='dashed'
                                    style={{ color: "grey", background: 'none' }}
                                    onClick={() => {
                                        const res = packageItem.find(f => f.id == selectedSinglePackage)
                                        nameRef.current.value = res.name
                                        orderRef.current.value = res.order
                                        metaDescriptionRef.current.value = res.meteDescription
                                        setEdit(true)
                                        const a = document.createElement("a")
                                        a.href = "#addPackageGroup"
                                        a.click()
                                    }}>
                                    <EditOutlined />
                                </Button>
                                <Button type='dashed' style={{ color: 'red', background: 'none' }} onClick={deleteGroup}><DeleteOutlined /></Button>
                            </Space>
                        }
                    </Space>

                    {selectedGroup != null
                        ?
                        <SelectedGrp />
                        :
                        null
                    }


                </>
            }
            <Divider />
            {/* Add new package group name div */}
            <div style={{ width: 'fit-content', marginBottom: '3%' }}>
                <h2 id='addPackageGroup' style={{ color: "grey" }}><i>{edit ? "Edit" : "Add New Package Group"}</i></h2>
                <Form style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, padding: '1%' }}
                    onFinish={(e) => AddPacakgeGroup(e)}
                >

                    <Form.Item name='order' initialValue={0} label="Order No." style={{ margin: 0 }}>
                        <input ref={orderRef}  required type='number' placeholder='Enter Order No.' />
                    </Form.Item>
                    <Form.Item name='package_name' label="Group Name" style={{ margin: 0 }}>
                        <input ref={nameRef} required placeholder='Enter Package Group Name' />
                    </Form.Item>
                    <Form.Item name='meteDescription' label="Short Description" style={{ margin: 0 }}>
                        <input ref={metaDescriptionRef} required placeholder='Enter Short Meta Description' />
                    </Form.Item>
                    <div>
                        {edit ?
                            (<Space>
                                <Button type='primary' htmlType='submit'>Update</Button>
                                <Button type='dashed' style={{ color: 'grey' }} onClick={() => {
                                    setEdit(false);
                                    orderRef.current.value = 0
                                    nameRef.current.value = ""
                                    metaDescriptionRef.current.value = ""
                                }}>< PlusOutlined />Add New</Button>
                            </Space>)
                            :
                            <Button type='dashed' style={{ color: 'grey' }} htmlType='submit'>< PlusOutlined />Add</Button>
                        }
                    </div>

                </Form>
            </div>


        </div>
    )
}
