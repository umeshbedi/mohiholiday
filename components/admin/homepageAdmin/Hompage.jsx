import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
// import style from '@/styles/component.module.scss'
import { db } from '@/firebase'
import TravelJourney from './TravelJourney'
import AllPageBanner from './AllPageBanner'


export default function Hompage() {

  const hompagedb = db.doc(`pages/homepage`)
  const [banner, setBanner] = useState([])
  // const [editBanner, setEditBanner] = useState({ index: null, heading: null, subHeading: null, image: null })

  const [title, setTitle] = useState("")
  const [metaDescription, setmetaDescription] = useState("")
  const [metaTag, setMetaTag] = useState("")

  const titleRef = useRef()
  const metaDescriptionRef = useRef()
  const metaTagRef = useRef()

  const [heading, setHeading] = useState(null)
  const [subHeading, setSubHeading] = useState(null)
  const [image, setImage] = useState(null)
  const [index, setIndex] = useState(null)

  const headingRef = useRef()
  const subHeadingRef = useRef()
  const imageRef = useRef()

  const [msg, showMsg] = message.useMessage()

  const [open, setOpen] = useState(false)
  function addBanner(e) {
    const tempBanner = [...banner]
    tempBanner.push(e)
    setBanner(tempBanner)
  }

  function submit() {
    hompagedb.update({ banner, title, metaDescription, metaTag })
      .then(() => { msg.success("submitted") })
      .catch((e) => { msg.error(e.message) })
    // console.log(title, metaDescription, metaTag)
  }

  function deleteBanner(i) {
    const tempBanner = [...banner]
    tempBanner.splice(i, 1)
    setBanner(tempBanner)
  }

  function EditBanner() {
    const tempBanner = [...banner]
    tempBanner[index] = { heading, subHeading, image }
    setBanner(tempBanner)
    setOpen(false)
  }

  useEffect(() => {
    hompagedb.onSnapshot((snap) => {
      const data = snap.data()
      if (data !== undefined) {
        setBanner(data.banner)
        setTitle(data.title)
        setmetaDescription(data.metaDescription)
        setMetaTag(data.metaTag)
        titleRef.current.value = data.title
        metaDescriptionRef.current.value = data.metaDescription
        metaTagRef.current.value = data.metaTag
      }
    })

  }, [])

  return (
    <div>
      {showMsg}
      <Form style={{ border: "solid 1px lightgrey", padding: '2%' }} onFinish={addBanner}>
        <h2 style={{ color: "grey" }}><i>Add Banner Image</i></h2>
        <br />
        <div style={{ height: banner.length > 4 ? 150 : null, overflowY: 'scroll' }}>
          {banner.length != 0 &&
            banner.map((item, i) => (
              <div key={i}>
                <p style={{ color: "grey", marginBottom: '1%', fontWeight: 400, fontSize: 16 }}><b><i>
                  #{i + 1}. {item.heading} | {item.subHeading} | {item.image} | <span style={{ color: 'var(--primaryColor)' }}>
                    <EditFilled onClick={() => {
                      setOpen(true)
                      setTimeout(() => {
                        headingRef.current.value = item.heading;
                        setHeading(item.heading)
                        subHeadingRef.current.value = item.subHeading;
                        setSubHeading(item.subHeading)
                        imageRef.current.value = item.image
                        setImage(item.image)
                        setIndex(i)
                      }, 100);

                    }} />
                  </span> |
                  <span style={{ color: 'red' }}>
                    <DeleteFilled
                      onClick={() => deleteBanner(i)} />
                  </span>
                </i></b></p>
              </div>
            ))
          }
        </div>
        <Form.Item name={'heading'} label="Heading">
          <input required type="text" placeholder='Enter Heading...' />
        </Form.Item>
        <Form.Item name={'subHeading'} label="Sub Heading">
          <input required type="text" placeholder='Enter SubHeading...' />
        </Form.Item>
        <Form.Item name={'image'} label="Banner Image Url">
          <input required type="text" placeholder='Enter SubHeading...' />
        </Form.Item>
        <Button htmlType='submit'><PlusOutlined /> Add New</Button>
      </Form>
      <br />

      <Form >
        <Form.Item label="Homepage Title">
          <input
            ref={titleRef}
            onChange={(e) => setTitle(e.target.value)}
            type="text" placeholder='Enter Title...' />
        </Form.Item>
        <Form.Item label="Meta Description">
          <input
            ref={metaDescriptionRef}
            onChange={(e) => setmetaDescription(e.target.value)}
            type="text" placeholder='Enter Description...' />
        </Form.Item>
        <Form.Item label="Meta Tag">
          <input
            ref={metaTagRef}
            onChange={(e) => setMetaTag(e.target.value)}
            type="text" placeholder='Comma Separated tags...' />
        </Form.Item>
        <Button style={{ marginBottom: '3%' }} onClick={submit} type='primary'>Submit Banner & Meta</Button>
      </Form>
      <br />

      <TravelJourney />
      <AllPageBanner />

      {/* Model section here */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={[<Button key={0} type='primary' onClick={EditBanner}>Save</Button>]}
      >
        <div style={{ padding: '3%' }}>
          <Form.Item name={'heading'} label="Heading">
            <input ref={headingRef} type="text" placeholder='Enter Heading...' onChange={(e) => setHeading(e.target.value)} />
          </Form.Item>
          <Form.Item name={'subHeading'} label="Sub Heading">
            <input ref={subHeadingRef} type="text" placeholder='Enter SubHeading...' onChange={(e) => setSubHeading(e.target.value)} />
          </Form.Item>
          <Form.Item name={'image'} label="Banner Image Url">
            <input ref={imageRef} type="text" placeholder='Enter SubHeading...' onChange={(e) => setImage(e.target.value)} />
          </Form.Item>
        </div>
      </Modal>
    </div>
  )
}
