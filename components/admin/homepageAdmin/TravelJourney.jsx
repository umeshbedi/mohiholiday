import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

import { db } from '@/firebase'


export default function TravelJourney() {
    const hompagedb = db.doc(`pages/travelJourney`)
    const [msg, showMsg] = message.useMessage()
    const [open, setOpen] = useState(false)

    const [Travelbanner, setTravelbanner] = useState([])

    const [YoutubeLink, setYoutubeLink] = useState(null)
    const YoutubeLinkRef = useRef()

    const [index, setIndex] = useState(null)

    function submit() {
        hompagedb.update({ TravelJourney:Travelbanner })
          .then(() => { msg.success("submitted") })
          .catch((e) => { msg.error(e.message) })
        // console.log(title, metaDescription, metaTag)
      }

    function addJourney(e) {
        const tempTravelbanner = [...Travelbanner]
        tempTravelbanner.push(e)
        setTravelbanner(tempTravelbanner)
    }

    function deleteTravelbanner(i) {
        const tempTravelbanner = [...Travelbanner]
        tempTravelbanner.splice(i, 1)
        setTravelbanner(tempTravelbanner)
    }

    function EditTravelbanner() {
        const tempTravelbanner = [...Travelbanner]
        tempTravelbanner[index] = { YoutubeLink }
        setTravelbanner(tempTravelbanner)
        setOpen(false)
    }

    useEffect(() => {
        hompagedb.onSnapshot((snap) => {
          const data = snap.data()
          if (data !== undefined) {
            setTravelbanner(data.TravelJourney)
            
          }
        })
    
      }, [])

    return (
        <div>
            {showMsg}
            <Form style={{ border: "solid 1px lightgrey", padding: '2%' }} onFinish={addJourney}>
                <h2 style={{ color: "grey" }}><i>Add Travel Journey</i></h2>
                <br />
                <div style={{ height: Travelbanner.length > 4 ? 150 : null, overflowY: 'scroll' }}>
                    {Travelbanner.length != 0 &&
                        Travelbanner.map((item, i) => (
                            <div key={i}>
                                <p style={{ color: "grey", marginBottom: '1%', fontWeight: 400, fontSize: 16 }}><b><i>
                                    #{i + 1}. {item.YoutubeLink} | <span style={{ color: 'var(--primaryColor)' }}>
                                        <EditFilled onClick={() => {
                                            setOpen(true)
                                            setTimeout(() => {
                                                YoutubeLinkRef.current.value = item.YoutubeLink;
                                                setYoutubeLink(item.YoutubeLink)

                                                setIndex(i)
                                            }, 100);

                                        }} />
                                    </span> |
                                    <span style={{ color: 'red' }}>
                                        <DeleteFilled
                                            onClick={() => deleteTravelbanner(i)} />
                                    </span>
                                </i></b></p>
                            </div>
                        ))
                    }
                </div>
                <div style={{display:'flex'}}>
                    <Form.Item name={'YoutubeLink'} label="Youtube Link" style={{width:"70%"}}>
                    <input required type="text" placeholder='Enter Youtube Link...' />
                </Form.Item>

                <Button htmlType='submit'><PlusOutlined /> Add New</Button>
                </div>
            <Button style={{ marginBottom: '3%' }} onClick={submit} type='primary'>Submit Travel Journey</Button>
            </Form>
            
            <br />
            <br />

            {/* Model section here */}
            <Modal
                open={open}
                onCancel={() => setOpen(false)}
                footer={[<Button key={0} type='primary' onClick={EditTravelbanner}>Save</Button>]}
            >
                <div style={{ padding: '3%' }}>
                    <Form.Item name={'YoutubeLink'} label="YoutubeLink">
                        <input ref={YoutubeLinkRef} type="text" placeholder='Enter YoutubeLink...' onChange={(e) => setYoutubeLink(e.target.value)} />
                    </Form.Item>

                </div>
            </Modal>

        </div>
    )
}
