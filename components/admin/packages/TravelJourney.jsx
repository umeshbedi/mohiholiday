import { db } from '@/firebase'
import { DeleteFilled, EditFilled, PlusOutlined, SaveFilled } from '@ant-design/icons'
import { Button, Divider, Form, Input, Modal, Space, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'


export default function TravelJourney({ groupId, packageId, data, packageFor }) {
    
    const packagedb = db.collection(`${packageFor}`).doc(`${groupId}`).collection("singlePackage").doc(`${packageId}`)

    const [msg, showMsg] = message.useMessage()

    const [tjHeading, setTjHeading] = useState(null)
    const [tjImage, setTjImage] = useState(null)
    const [tjContent, setTjContent] = useState(null)

    const [tj, setTj] = useState([])
    const [tjedit, setTjedit] = useState(null)

    const [open, setOpen] = useState(false)

    const headingRef = useRef()
    const contentRef = useRef()
    const imageRef = useRef()

    function submit() {
        if (tjHeading != null && tjContent != null && tjImage != null) {
            const tempTravel = []
            tj.forEach(d => {
                tempTravel.push(d)
            })
            tempTravel.push({ heading: tjHeading, content: tjContent, image:tjImage })
            packagedb.update({
                travelJourney: tempTravel
            })
        } else {
            msg.error("Please Enter value")
        }
    }

    function tjEdit(e) {
        const tempTravel = [...tj]
        tempTravel[tjedit.index] = { heading: e.heading, content: e.content, image:e.image }
        console.log(tempTravel)
        packagedb.update({
            travelJourney: tempTravel
        }).then(() => { msg.success("updated"); setOpen(false) })
    }

    function deleteTj(e) {
        if (confirm("Are you really want to delete?")) {
            const tempTravel = []
            tj.forEach(d => {
                tempTravel.push(d)
            })
            tempTravel.splice(e, 1)
            packagedb.update({
                travelJourney: tempTravel
            })
        } else { console.log("denied") }
    }

    useEffect(() => {
        packagedb.onSnapshot((snap) => setTj(snap.data().travelJourney))
    }, [])


    return (
        <div>
            {showMsg}
            <Form >
                <Form.Item name='travelJourney' label={"Travel Journey"}>
                    <div style={{ padding: '1%', border: "solid .3px rgba(0,0,0,.2)" }}>
                        {tj.map((step, i) => (
                            <Space key={i} style={{ border: "solid 1px rgba(0,0,0,.2)", width: '100%', padding: '1%', marginBottom: 10 }}>
                                <p>#{i + 1}</p>
                                <div style={{ paddingRight: '8%', textAlign: 'justify' }}>
                                    <h3>{step.heading}</h3>
                                    <p>Image:<i>{step.image}</i></p>
                                    <p>{step.content}</p>
                                </div>
                                <Space style={{ position: 'absolute', right: '3%', cursor: 'pointer' }}>
                                    <EditFilled
                                        style={{ color: "grey" }}
                                        onClick={() => {
                                            setOpen(true);
                                            setTimeout(() => {
                                                headingRef.current.value = step.heading;
                                                contentRef.current.value = step.content
                                                imageRef.current.value = step.image
                                            }, 100);
                                            setTjedit({ index: i, ...step });
                                        }} />
                                    <DeleteFilled onClick={() => deleteTj(i)} style={{ color: 'red' }} />
                                </Space>
                            </Space>
                        ))}
                        <Form.Item name={'heading'} style={{ margin: 0 }}>
                            <Input required placeholder='Enter Heading' style={{ marginBottom: 10 }} onChange={e => setTjHeading(e.target.value)} />
                        </Form.Item>
                        <Form.Item name={'image'} style={{ margin: 0 }}>
                            <Input required placeholder='Enter Image Url' style={{ marginBottom: 10 }} onChange={e => setTjImage(e.target.value)} />
                        </Form.Item>
                        <Form.Item name={'content'} style={{ margin: 0 }}>
                            <Input.TextArea required rows={5} placeholder='Inner Content' style={{ marginBottom: 10 }} onChange={e => setTjContent(e.target.value)} />
                        </Form.Item>
                        <Button type='dashed' onClick={submit}><PlusOutlined /> Add Steps</Button>
                    </div>
                </Form.Item>
            </Form>





            <Modal open={open} onCancel={() => setOpen(false)} footer={[]}>
                <Form onFinish={tjEdit}>
                    {tjedit != null &&
                        <div style={{ padding: '2%' }}>
                            <Form.Item name={'heading'} initialValue={tjedit.heading} style={{ margin: 0 }}>
                                <input ref={headingRef} required placeholder='Enter Heading' style={{ marginBottom: 10, fontSize: 16 }} />
                            </Form.Item>
                            <Form.Item name={'image'} initialValue={tjedit.image} style={{ margin: 0 }}>
                                <input ref={imageRef} required placeholder='Enter Image Url' style={{ marginBottom: 10, fontSize: 16 }} />
                            </Form.Item>
                            <Form.Item name={'content'} initialValue={tjedit.content} style={{ margin: 0 }}>
                                <textarea ref={contentRef} required placeholder='Inner Content' rows={5} style={{ marginBottom: 10, width: '100%', borderRadius: 10, borderColor: "var(--lightGreyColor)", fontSize: 16 }} />
                            </Form.Item>
                            <Button type='primary' htmlType='submit'>Save</Button>
                        </div>
                    }
                </Form>
            </Modal>

        </div>
    )
}
