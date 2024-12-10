import React, { useEffect, useState } from 'react'
import JoditEditor from 'jodit-react';
import { db } from '@/firebase';
import { Button, Divider, Form, Select, Space, message } from 'antd';
import { DeleteFilled, PlusOutlined } from '@ant-design/icons';


export default function AddactivityDetails({ details, activityId, addNew, activityFor }) {
    
    const activitydb = db.collection(`${activityFor}`)

    const [msg, showMsg] = message.useMessage()

    const [ticket, setTicket] = useState([])
    const [selectedTicket, setSelectedTicket] = useState(null)
    const [classes, setClasses] = useState([])

    const [name, setname] = useState("")
    const [thumbnail, setthumbnail] = useState("")
    const [headerImage, setHeaderImage] = useState("")
    const [metaDescription, setMetaDescription] = useState("")
    const [order, setOrder] = useState(0)
    const [about, setAbout] = useState("")
    const [data, setData] = useState([])


    useEffect(() => {
        if (details != null) {
            setname(details.name)
            setHeaderImage(details.headerImage)
            setthumbnail(details.thumbnail)
            setOrder(details.order)
            setMetaDescription(details.metaDescription)
            setAbout(details.about)
            setData(details.data)
        }
        else {
            setname("")
            setHeaderImage("")
            setthumbnail("")
            setOrder(0)
            setMetaDescription("")
            setAbout("")
            setData([])
        }
        // console.table(details)
    }, [details])

    function addNewactivity() {
        if (name != "" &&
            thumbnail != "" &&
            headerImage != "" &&
            metaDescription != "" &&
            about != ""
        ) {
            activitydb.add({
                name,
                slug: `/activity/${activityFor=="activityBali"?"Bali":"Andaman"}/${name.split(" ").join("-")}`,
                thumbnail,
                headerImage,
                metaDescription,
                order,
                data,
                about

            }).then(() => { msg.success("Added new activity Succussfully!") })

        } else { msg.error("All Fields are required") }
    }

    function updateActivity() {
        activitydb.doc(`${details.id}`).update({ name, thumbnail, headerImage, metaDescription, order, data, about })
            .then(() => { msg.success("Added new activity Succussfully!") })
    }


    function addCategory(e) {
        e.preventDefault();
        const tg = e.target
        const catDetail = {
            name: tg.name.value,
            thumbnail: tg.thumbnail.value,
            duration: tg.duration.value,
            price: tg.price.value,
        }

        const tempData = [...data]
        tempData.push(catDetail)
        setData(tempData)
    }
        
    function deleteCategory(i) {
        const tempData = [...data]
        tempData.splice(i, 1)
        setData(tempData)
    }

   
    return (
        <div style={{ marginTop: '2%', flexDirection: 'column', display: 'flex', gap: 20 }}>
            {showMsg}
            <Form>
                <h2 style={{ color: "grey" }}><i> {details == null ? "Add New Activity Below" : `Edit ${name}`} </i></h2><br />
                <Space>
                    <Form.Item label="Order No.">
                        <input type='number' defaultValue={order} placeholder='Enter Order No.' onChange={(e) => setOrder(e.target.valueAsNumber)} />
                    </Form.Item>
                </Space>
                <Form.Item label="Activity Name">
                    <input defaultValue={name} placeholder='Enter Activity Name' onChange={(e) => setname(e.target.value)} />
                </Form.Item>
                <Form.Item label="Header Image Url">
                    <input defaultValue={headerImage} placeholder='Enter Header Image Url' onChange={(e) => setHeaderImage(e.target.value)} />
                </Form.Item>
                <Form.Item label="Thumbnail Url">
                    <input defaultValue={thumbnail} placeholder='Enter Thumbnail Url' onChange={(e) => setthumbnail(e.target.value)} />
                </Form.Item>
                <Form.Item >
                    <JoditEditor config={{ placeholder: 'Write About Activity...' }} onBlur={e => { setAbout(e) }} value={about} />
                </Form.Item>
                <Form.Item label="Meta Description">
                    <input required defaultValue={metaDescription} placeholder='Enter Meta Description' onChange={(e) => setMetaDescription(e.target.value)} />
                </Form.Item>
            </Form>
            <Divider />
            <div>
                <h3 style={{ marginBottom: 10 }}>Activities in this Category:</h3>
                {data.map((tk, i) => (
                    <div key={i} style={{ display: 'flex', gap: 10, color: '#25527b' }}>
                        <p> <b> #{i + 1}:</b></p>
                        <div style={{ marginBottom: 10 }}>
                            <p>{tk.name} {" | "}
                                <span>{tk.duration}</span>{" | "}
                                <span>₹{tk.price}</span>{" | "}
                                <span>{tk.thumbnail}</span>
                                <span style={{ color: 'red', cursor: 'pointer' }} onClick={() => { deleteCategory(i) }}> <DeleteFilled /></span>
                            </p>
                        </div>

                    </div>
                ))

                }
                <form onSubmit={addCategory} style={{ flexDirection: 'column', display: 'flex', gap: 10 }}>
                    <div>
                        <Space>
                            <Form.Item name='name' label="Name:" style={{ margin: 0 }}>
                                <input required placeholder='Enter Name' />
                            </Form.Item>
                            <Form.Item name='thumbnail' label="Thumbnail:" style={{ margin: 0 }}>
                                <input required placeholder='Enter Thumbnail Url' />
                            </Form.Item>
                        </Space>
                    </div>
                    <div>
                        <Space>
                            <Form.Item name='duration' label="Duration:" style={{ margin: 0 }}>
                                <input required placeholder='Enter duration' />
                            </Form.Item>
                            <Form.Item name='price' label="Price:" style={{ margin: 0 }}>
                                <input required placeholder='Enter Price' type='number' />
                            </Form.Item>
                        </Space>
                    </div>
                    <div>
                        <Button htmlType='submit' type='dashed'><PlusOutlined />Add</Button>
                    </div>
                </form>
            </div>

            <Divider />

            <div style={{ marginBottom: '3%' }}>
                <Space>
                    <Button onClick={details != null ? updateActivity : addNewactivity} type='primary'>{details != null ? "Update Activity" : "Add New Activity"}</Button>
                    {details != null &&
                        <Button type='dashed' onClick={addNew}><PlusOutlined /> Add New</Button>
                    }
                </Space>

            </div>

        </div>
    )
}
