import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import { db } from '@/firebase'

const testimonialdb = db.doc(`pages/testimonials`)

export default function TestiMonials() {
    const [testimonials, settestimonials] = useState([])

    const [name, setname] = useState(null)
    const [content, setcontent] = useState(null)

    const [index, setIndex] = useState(null)

    const [msg, showMsg] = message.useMessage()

    const [open, setOpen] = useState(false)

    const nameRef = useRef()
    const contentRef = useRef()

    function addtestimonials(e) {
        const temptestimonials = [...testimonials]
        temptestimonials.push(e)
        settestimonials(temptestimonials)
        testimonialdb.update({ testimonials: temptestimonials })
            .then(() => { msg.success("added") })
            .catch((e) => { msg.error(e.message) })
    }



    function deletetestimonials(i) {
        const temptestimonials = [...testimonials]
        temptestimonials.splice(i, 1)
        settestimonials(temptestimonials)
        testimonialdb.update({ testimonials: temptestimonials })
            .then(() => { msg.success("deleted") })
            .catch((e) => { msg.error(e.message) })
    }

    function Edittestimonials() {
        const temptestimonials = [...testimonials]
        temptestimonials[index] = { name, content }
        settestimonials(temptestimonials)
        setOpen(false)
        testimonialdb.update({ testimonials: temptestimonials })
            .then(() => { msg.success("updated") })
            .catch((e) => { msg.error(e.message) })
    }

    useEffect(() => {
        testimonialdb.onSnapshot((snap) => {
            const data = snap.data()
            
            if (data !== undefined) {
                settestimonials(data.testimonials)
            }

        })

    }, [])

    return (
        <div>
            {showMsg}
            <Form style={{ border: "solid 1px lightgrey", padding: '2%' }} onFinish={addtestimonials}>
                <h2 style={{ color: "grey" }}><i>Add TestiMonials</i></h2>
                <br />
                {testimonials.length != 0 &&
                    testimonials.map((item, i) => (
                        <div key={i}>
                            <p style={{ color: "grey", marginBottom: '1%' }}><b><i>
                                #{i + 1}. {item.name} | {item.content} |  <span>
                                    <EditFilled onClick={() => {
                                        setOpen(true)
                                        setTimeout(() => {
                                            nameRef.current.value = item.name;
                                            setname(item.name)
                                            contentRef.current.value = item.content;
                                            setcontent(item.content)
                                            setIndex(i)
                                        }, 100);

                                    }} />
                                </span> | <span style={{ color: 'red' }}>
                                    <DeleteFilled
                                        onClick={() => deletetestimonials(i)} />
                                </span>
                            </i></b></p>
                        </div>
                    ))
                }
                <Form.Item name={'name'} label="Name">
                    <input required type="text" placeholder='Enter Name of person...' />
                </Form.Item>
                <Form.Item name={'content'} label="Content">
                    <Input required type="text" placeholder='Enter Content...' />
                </Form.Item>
                <Button htmlType='submit'><PlusOutlined /> Add New</Button>
            </Form>
            <br />

            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={[<Button key={0} type='primary' onClick={Edittestimonials}>Save</Button>]}
            >
                <div style={{ padding: '3%' }}>
                    <Form.Item name={'name'} label="name">
                        <input ref={nameRef} type="text" placeholder='Enter name...' onChange={(e) => setname(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'content'} label="Content">
                        <input ref={contentRef} type="text" placeholder='Enter content...' onChange={(e) => setcontent(e.target.value)} />
                    </Form.Item>

                </div>
            </Modal>
        </div>
    )
}
