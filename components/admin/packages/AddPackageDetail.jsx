import { db } from '@/firebase'
import { DeleteOutlined, PlusOutlined, SaveOutlined } from '@ant-design/icons'
import { Button, Divider, Form, Input, Select, Space, Tabs, message } from 'antd'
import React, { useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import ImageUpload from '@/components/admin/media/ImageUpload';
import TravelJourney from './TravelJourney';
import { IncludesIconName } from '@/components/utils/variables';
import { FaCross } from 'react-icons/fa';
import AddHotelPackage from './AddHotelPackage';
import AddExHotelPackage from './AddExHotelPackage';



export default function AddPackageDetail({ packageFor = "" }) {

    const packagedb = db.collection(`${packageFor}`)

    const [packageItem, setPackageItem] = useState([])
    const [singlePackage, setSinglePackage] = useState([])

    const [messageApi, contextHolder] = message.useMessage()

    const [selectedGroup, setSelectedGroup] = useState(null)
    const [selectedGroupPackage, setSelectedGroupPackage] = useState(null)
    const [selectedGroupPackageDetail, setselectedGroupPackageDetail] = useState([])
    const [selectedSinglePackage, setSelectedSinglePackage] = useState(null)
    const [sSPD, setsSPD] = useState(null)

    const [isOffer, setIsOffer] = useState(null)
    const [isPrice, setIsPrice] = useState(null)

    let tempIcon = []


    useEffect(() => {
        packagedb.onSnapshot((snap) => {
            const packageTemp = []
            snap.forEach((snapdata) => {
                const singlePackageTemp = []
                packagedb.doc(`${snapdata.id}`).collection("singlePackage").onSnapshot((sn) => {
                    sn.forEach((single) => {
                        singlePackageTemp.push({ id: single.id, ...single.data() })
                    })
                })
                packageTemp.push({ id: snapdata.id, ...snapdata.data(), singlePackage: singlePackageTemp })
            })
            setPackageItem(packageTemp)
        })

    }, [packageFor])


    useEffect(() => {
        if (selectedGroupPackage != null) {
            packagedb.doc(`${selectedGroupPackage}`)
                .collection("singlePackage").onSnapshot((snap) => {
                    const singlePackageTemp = []
                    snap.forEach((sndata) => {
                        singlePackageTemp.push({ id: sndata.id, ...sndata.data() })
                    })
                    setSinglePackage(singlePackageTemp)
                })
        }
    }, [selectedGroupPackage])

    useEffect(() => {
        if (selectedGroup != null) {
            const result = packageItem.find(f => f.id == selectedGroup)
            setselectedGroupPackageDetail(result.singlePackage)
        }
    }, [selectedGroup])

    useEffect(() => {
        if (selectedSinglePackage != null) {
            const result = selectedGroupPackageDetail.find(f => f.id == selectedSinglePackage)
            setsSPD(result)
            setIsOffer(result.isOffer)
            setIsPrice(result.isPrice)
            if (result.hotelName != undefined) {
                localStorage.setItem("hotelName", JSON.stringify(result.hotelName))
            } else {
                localStorage.clear()
            }
            // setIncludeIcon(result.includeIcon)
        }
    }, [selectedSinglePackage])


    function submitPackageDetail(val) {
        // console.log(val)
        const tempIncludeIcon = []
        tempIcon.forEach((item) => {
            const res = IncludesIconName.find(f => f.name == item)
            tempIncludeIcon.push(res)
        });

        const groupSearch = packageItem.find(f => f.id == selectedGroup)
        const slug = `${groupSearch.name.split(" ").join("-")}-${sSPD.name.split(" ").join("-")}-${val.packageTitle.split(" ").join("-")}`

        packagedb.doc(`${selectedGroup}`)
            .collection("singlePackage").doc(`${selectedSinglePackage}`)
            .update({
                slug: `/package/${packageFor == 'packageBali' ? "Bali" : "Andaman"}/${slug}`,
                title: val.packageTitle,
                subtitle: val.packageSubTitle,
                highlights: val.highlights,
                inclusion: val.inclusion,
                overview: val.overview,
                exclusion: val.exclusion,
                metaDescription: val.metaDescription,
                metaTag: val.metaTag,
                price: val.price == undefined ? null : val.price,
                status: 'published',
                includeIcon: tempIcon.length != 0 ? tempIncludeIcon : sSPD.includeIcon,
                isOffer: isOffer == undefined ? false : isOffer,
                isPrice: isPrice == undefined ? false : isPrice,
                hotelName: JSON.parse(localStorage.getItem("hotelName")),
                hotelExName: JSON.parse(localStorage.getItem("hotelExName"))

            })
            .then(() => {
                messageApi.success("Added Package Details Successfully")
            })
            .catch((err) => {
                messageApi.error(err.message)
            })

    }
    // console.log(packageFor,selectedGroup)


    function AddSinglePackageDetail() {

        return (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20, padding: '1%', border: "solid .3px rgba(0,0,0,.2)" }}>
                {sSPD != null &&
                    <Form onFinish={(e) => submitPackageDetail(e)}>


                        <Form.Item name='packageTitle' initialValue={sSPD.title} label={"Package Title"} >
                            <Input required placeholder='Enter Package Title' />
                        </Form.Item>

                        <Form.Item name='packageSubTitle' initialValue={sSPD.subtitle} label={"Package Subtitle"}>
                            <Input required placeholder='Enter Package SubTitle' />
                        </Form.Item>

                        <Form.Item name={"isOffer"} label={"Is Offer"}>
                            <Input type='checkbox' style={{ width: 'fit-content' }} checked={isOffer != undefined ? isOffer : null}
                                onChange={(e) => setIsOffer(e.target.checked)}
                            />
                        </Form.Item>
                        


                        <div style={{ padding: '1%', border: "solid .3px rgba(0,0,0,.2)", marginBottom: '2rem' }}>
                            {/* <Form.Item name={"isPrice"} label={"Is Price"}>
                                <Input type='checkbox' style={{ width: 'fit-content' }} checked={isPrice != undefined ? isPrice : null}
                                    onChange={(e) => setIsPrice(e.target.checked)}
                                />
                            </Form.Item> */}
                            {/* {isPrice != undefined && isPrice && */}
                                <>
                                    {/* <Form.Item name='price' initialValue={sSPD.price} label={"Price"}>
                                        <Input type='number' required placeholder='Enter Price' />
                                    </Form.Item> */}
                                    <Form.Item label={"Without Hotel"}>
                                        <AddExHotelPackage />
                                    
                                    </Form.Item>
                                    <Form.Item label={"Inlclude Hotel"}>
                                        <AddHotelPackage />
                                    </Form.Item>
                                </>
                            {/* } */}

                        </div>

                        <Form.Item name='includeIcon' label={"Include Icon"}>
                            <Select
                                mode="multiple"
                                allowClear
                                style={{
                                    width: '100%',
                                }}
                                placeholder={"select includes icon and Name"}
                                defaultValue={sSPD.includeIcon.map((item) => {
                                    return item.name;
                                })}

                                onChange={(e) => {
                                    const tempArr = e;
                                    tempIcon = [...tempArr]
                                    // console.log(temparrr)

                                }}
                                options={IncludesIconName.map((item) => {
                                    return {
                                        label: item.name,
                                        value: item.name
                                    }
                                })}
                            />
                        </Form.Item>


                        <Form.Item name='overview' initialValue={sSPD.overview} label={"OverView"} >
                            <ReactQuill theme='snow' style={{ height: 100, marginBottom: 50 }} />
                        </Form.Item>

                        <TravelJourney data={sSPD.travelJourney} groupId={selectedGroup} packageId={selectedSinglePackage} packageFor={packageFor} />

                        <Form.Item name='highlights' initialValue={sSPD.highlights} label={"Highlights"} >
                            <ReactQuill theme='snow' style={{ height: 100, marginBottom: 50 }} />
                        </Form.Item>
                        <Form.Item name='inclusion' initialValue={sSPD.inclusion} label={"Inclusion"} >
                            <ReactQuill theme='snow' style={{ height: 100, marginBottom: 50 }} />
                        </Form.Item>
                        <Form.Item name='exclusion' initialValue={sSPD.exclusion} label={"Exclusion"} >
                            <ReactQuill theme='snow' style={{ height: 100, marginBottom: 50 }} />
                        </Form.Item>


                        <ImageUpload to={"Thumbnails"} groupId={selectedGroup} packageId={selectedSinglePackage} packageFor={packageFor} />
                        <ImageUpload to={"Images"} groupId={selectedGroup} packageId={selectedSinglePackage} packageFor={packageFor} />

                        <Divider>Seo Section</Divider>
                        <Form.Item name='metaDescription' initialValue={sSPD.metaDescription} label={"Short Meta Description"} >
                            <Input required placeholder='Short Description' />
                        </Form.Item>
                        <Form.Item name='metaTag' initialValue={sSPD.metaTag} label={"Comma Separated Tags"} >
                            <Input required placeholder='Enter Tags' />
                        </Form.Item>

                        <Button type='primary' htmlType='submit'>Publish</Button>


                    </Form>


                }

            </div>
        )
    }

    return (
        <div>
            {contextHolder}
            <h1 style={{ fontSize: '150%', marginBottom: 10 }}>Add Package Details</h1>
            {packageItem.length !== 0 &&
                <>
                    <Space>
                        <p>Select Package Group Name: </p>
                        <Select
                            placeholder={"select Package Name"}
                            onSelect={setSelectedGroup}
                            value={selectedGroup}
                            onFocus={() => {
                                setSelectedGroup(null);
                                setselectedGroupPackageDetail([]);
                                setSelectedGroupPackage(null);
                                setSelectedSinglePackage(null)
                            }}
                            options={packageItem.map((item, i) => {
                                return ({
                                    value: item.id,
                                    label: item.name
                                })
                            })}
                        />
                        {selectedGroup != null &&
                            <>
                                <p>Select Package Name: </p>
                                <Select
                                    placeholder={"select Package Name"}
                                    onSelect={setSelectedSinglePackage}
                                    value={selectedSinglePackage}
                                    options={selectedGroupPackageDetail.map((item, i) => {
                                        return ({
                                            value: item.id,
                                            label: item.name
                                        })
                                    })}
                                />
                            </>
                        }
                    </Space>


                    {selectedSinglePackage != null
                        ?
                        <AddSinglePackageDetail />
                        :
                        null
                    }


                </>
            }

        </div>
    )
}
