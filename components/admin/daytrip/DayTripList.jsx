import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined, DeleteFilled, EditFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Tabs, Button, Input, Space, Table, Image, Skeleton } from 'antd'
import { db } from '@/firebase'
import firebase from 'firebase/compat/app';
import DayTripItemUpdate from './DayTripItemUpdate'


export default function DayTripList() {
    const [updateDiv, setUpdateDiv] = useState(null)

    const [currentIndex, setCurrentIndex] = useState(1)

    const [dayTripData, setDayTripData] = useState([])

    const dataBase = db.collection(`dayTrip`)

        useEffect(() => {
            dataBase.onSnapshot((snap) => {
                const tempDayTrip = []
                snap.forEach((sndata => {
                    const data = sndata.data()
                    tempDayTrip.push({ key: sndata.id, itemData:data, name:data.title, thumbnail:data.thumbnail })
    
                }))
                setDayTripData(tempDayTrip)
                console.log("From daytrip list: ", tempDayTrip)
            })
        }, [])

    // console.log("data from list", data.data)

    function moveToTrash({ dataToRemove }) {
        if (confirm("Are you sure want to delete")) {
            dataBase.doc(`${dataToRemove}`).delete()
            .then((e) => {
               alert("Data Removed Successfully!")
            }).catch((err) => {
                alert(err.message)
            })

        }
    }

    // const dataList = data.data.map((item, i) => {
    //     return {
    //         key: i,
    //         name: item.title,
    //         thumb: item.thumbnail,
    //         itemData: item,
    //     }
    // })




    const columns = [
        {
            title: 'Title',
            dataIndex: 'name',
            key: 'name',
            width: '60%',
            //   ...getColumnSearchProps('name'),
        },
        {
            title: 'Thumbnail',
            key: 'thumb',
            // width: '20%',
            //   ...getColumnSearchProps('city'),
            render: (_, record) => (
                // <>{record.thumb}</>
                <Image src={record.thumbnail} style={{ height: 50 }}
                    placeholder={<>
                        <Skeleton.Image active style={{ height: 50, width: "100%" }} />
                    </>}
                />
            )
        },

        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => setUpdateDiv(<DayTripItemUpdate id={record.key} data={record.itemData} allItemData={record.itemData}/>)} style={{ color: 'blue' }}><EditFilled /> Edit</a>
                    < a onClick={() => moveToTrash({ dataToRemove: record.key })} style={{ color: 'red' }}><DeleteFilled /> Delete</a>
                    {/* <p>{record.action}</p> */}
                </Space >
            ),
        },

    ];


    function ListOfData() {
        return (
            <div >

                <Button style={{ margin: "15px 0" }} type='dashed' onClick={() => {
                    setUpdateDiv(<DayTripItemUpdate data={undefined} />)                }}
                >
                    <PlusOutlined /> Add Trip
                </Button>
                <Table
                    dataSource={dayTripData}
                    columns={columns}
                    pagination={{ current: currentIndex, pageSize: 10, total: dayTripData.length }}
                    onChange={(e) => setCurrentIndex(e.current)}
                />;
                
            </div>
        )
    }

    // console.log("from activity list,", data)

    return (
        <div style={{ border: "1px solid grey", padding: '15px', borderRadius: 20, marginBottom: 20, marginTop: 20 }}>
            <h2>Day Trip List</h2>

            {updateDiv !== null ?
                (<div>
                    <div>
                        <ArrowLeftOutlined
                            style={{ fontSize: 20, cursor: 'pointer', margin: "15px 0" }}
                            onClick={() => setUpdateDiv(null)}

                        />
                    </div>
                    {updateDiv}
                </div>)
                :
                (<ListOfData />)
            }




        </div>
    )
}
