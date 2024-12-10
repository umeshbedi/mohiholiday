import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, Modal, message } from 'antd'
import React, { useEffect, useRef, useState } from 'react'

import { db } from '@/firebase'

export default function AllPageBanner() {
    const [msg, showMsg] = message.useMessage()

    const [HomeBaliInsight, setHomeBaliInsight] = useState()
    const [HomeAndamanInsight, setHomeAndamanInsight] = useState()
    const [HomeCruizeInsight, setHomeCruizeInsight] = useState()
    const [GeneralInfoPage, setGeneralInfoPage] = useState()
    const [DestinationPage, setDestinationPage] = useState()
    const [AttractionPage, setAttractionPage] = useState()
    const [RentalPage, setRentalPage] = useState()
    const [PackageAndamanPage, setPackageAndamanPage] = useState()
    const [PackageBaliPage, setPackageBaliPage] = useState()
    const [ActivityAndamanPage, setActivityAndamanPage] = useState()
    const [ActivityBaliPage, setActivityBaliPage] = useState()


    const pagedb = db.doc(`pages/allPageBanner`)

    const HomeBaliInsightRef = useRef()
    const HomeAndamanInsightRef = useRef()
    const HomeCruizeInsightRef = useRef()
    const GeneralInfoPageRef = useRef()
    const DestinationPageRef = useRef()
    const AttractionPageRef = useRef()
    const RentalPageRef = useRef()
    const PackageAndamanPageRef = useRef()
    const PackageBaliPageRef = useRef()
    const ActivityAndamanPageRef = useRef()
    const ActivityBaliPageRef = useRef()

    function addAllBanner() {
        pagedb.update({
            HomeBaliInsight,
            HomeAndamanInsight,
            HomeCruizeInsight,
            GeneralInfoPage,
            DestinationPage,
            AttractionPage,
            RentalPage,
            PackageAndamanPage,
            PackageBaliPage,
            ActivityAndamanPage,
            ActivityBaliPage
        })
            .then(() => msg.success("Added Successfully!"))
            .catch(e => msg.error(e.message))


    }

    useEffect(() => {
        pagedb.onSnapshot(snap => {
            const data = snap.data()
            if (data !== undefined) {
                HomeBaliInsightRef.current.value = data.HomeBaliInsight
                HomeAndamanInsightRef.current.value = data.HomeAndamanInsight
                HomeCruizeInsightRef.current.value = data.HomeCruizeInsight
                GeneralInfoPageRef.current.value = data.GeneralInfoPage
                DestinationPageRef.current.value = data.DestinationPage
                AttractionPageRef.current.value = data.AttractionPage
                RentalPageRef.current.value = data.RentalPage
                PackageAndamanPageRef.current.value = data.PackageAndamanPage
                PackageBaliPageRef.current.value = data.PackageBaliPage
                ActivityAndamanPageRef.current.value = data.ActivityAndamanPage
                ActivityBaliPageRef.current.value = data.ActivityBaliPage

                setHomeBaliInsight(data.HomeBaliInsight)
                setHomeAndamanInsight(data.HomeAndamanInsight)
                setHomeCruizeInsight(data.HomeCruizeInsight)
                setGeneralInfoPage(data.GeneralInfoPage)
                setDestinationPage(data.DestinationPage)
                setAttractionPage(data.AttractionPage)
                setRentalPage(data.RentalPage)
                setPackageAndamanPage(data.PackageAndamanPage)
                setPackageBaliPage(data.PackageBaliPage)
                setActivityAndamanPage(data.ActivityAndamanPage)
                setActivityBaliPage(data.ActivityBaliPage)

            }
        })
    }, [])

    return (
        <div>
            {showMsg}
            <Form style={{ border: "solid 1px lightgrey", padding: '2%' }} onFinish={addAllBanner}>
                <h2 style={{ color: "grey" }}><i>All Pages Banner Image</i></h2>
                <br />

                <div >
                    <Form.Item name={'HomeBaliInsight'} label="Homepage Bali Destination Insight Image" style={{ width: "100%" }}>
                        <input ref={HomeBaliInsightRef} required type="text" placeholder='Enter Bali Destination Insight Image...' onBlur={(e) => setHomeBaliInsight(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'HomeAndamanInsight'} label="Homepage Andaman Destination Insight Image" style={{ width: "100%" }}>
                        <input ref={HomeAndamanInsightRef} required type="text" placeholder='Enter Andaman Destination Insight Image...' onBlur={(e) => setHomeAndamanInsight(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'HomeCruizeInsight'} label="Homepage Cruize Insight Image" style={{ width: "100%" }}>
                        <input ref={HomeCruizeInsightRef} required type="text" placeholder='Enter Cruize Insight Image...' onBlur={(e) => setHomeCruizeInsight(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'GeneralInfoPage'} label="General Info Page Banner" style={{ width: "100%" }}>
                        <input ref={GeneralInfoPageRef} required type="text" placeholder='Enter General Info Page Banner...' onBlur={(e) => setGeneralInfoPage(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'DestinationPage'} label="Destination Page Banner" style={{ width: "100%" }}>
                        <input ref={DestinationPageRef} required type="text" placeholder='Enter Destination Page Banner...' onBlur={(e) => setDestinationPage(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'AttractionPage'} label="Attraction Page Banner" style={{ width: "100%" }}>
                        <input ref={AttractionPageRef} required type="text" placeholder='Enter Attraction Page Banner...' onBlur={(e) => setAttractionPage(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'RentalPage'} label="Rental Page Banner" style={{ width: "100%" }}>
                        <input ref={RentalPageRef} required type="text" placeholder='Enter Rental Page Banner...' onBlur={(e) => setRentalPage(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'PackageAndamanPage'} label="Package Andaman Page Banner" style={{ width: "100%" }}>
                        <input ref={PackageAndamanPageRef} required type="text" placeholder='Enter Package Andaman Page Banner...' onBlur={(e) => setPackageAndamanPage(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'PackageBaliPage'} label="Package Bali Page Banner" style={{ width: "100%" }}>
                        <input ref={PackageBaliPageRef} required type="text" placeholder='Enter Package Bali Page Banner...' onBlur={(e) => setPackageBaliPage(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'ActivityAndamanPage'} label="Activity Andaman Page Banner" style={{ width: "100%" }}>
                        <input ref={ActivityAndamanPageRef} required type="text" placeholder='Enter Activity Andaman Page Banner...' onBlur={(e) => setActivityAndamanPage(e.target.value)} />
                    </Form.Item>
                    <Form.Item name={'ActivityBaliPage'} label="Activity Bali Page Banner" style={{ width: "100%" }}>
                        <input ref={ActivityBaliPageRef} required type="text" placeholder='Enter Activity Bali Page Banner...' onBlur={(e) => setActivityBaliPage(e.target.value)} />
                    </Form.Item>

                </div>
                <Button style={{ marginBottom: '3%' }} htmlType='submit' type='primary'>Submit All Pages Banner</Button>
            </Form>
            <br />
            <br />
        </div>
    )
}
