import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined, DeleteFilled, EditFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Tabs, Button, Input, Space, Table, Image, Skeleton } from 'antd'
import { db } from '@/firebase'
import ActivityItemUpdate from './ActivityItemUpdate'
import firebase from 'firebase/compat/app';

export default function ActivityItemsList({ data, id }) {
    const [updateDiv, setUpdateDiv] = useState(null)

    const [currentIndex, setCurrentIndex] = useState(1)

    const dataBase = db.doc(`activity/${id}`)

    // // useEffect(() => {
    // //     dataBase.onSnapshot((snap) => {
    // //         const dataTemp = []
    // //         snap.forEach((d) => {
    // //             const data = d.data()
    // //             if (data !== undefined) {
    // //                 dataTemp.push({ id: d.id, ...data })
    // //             }

    // //         })

    // //         setdata(dataTemp)
    // //     })
    // // }, [id])

    console.log("data from list", data.data)

    function moveToTrash({ dataToRemove }) {
        if (confirm("Are you sure want to delete")) {
            dataBase.update({
                data: firebase.firestore.FieldValue.arrayRemove(dataToRemove)
            }).then((e) => {
               alert("Data Removed Successfully!")
                
            }).catch((err) => {
                alert(err.message)
            })

        }
    }

    const dataList = data.data.map((item, i) => {
        return {
            key: i,
            name: item.title,
            thumb: item.thumbnail,
            itemData: item,
        }
    })




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
                <Image src={record.thumb} style={{ height: 50 }}
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
                    <a onClick={() => setUpdateDiv(<ActivityItemUpdate collection={`activity/${id}`} index={record.key} data={record.itemData} allItemData={data}/>)} style={{ color: 'blue' }}><EditFilled /> Edit</a>
                    < a onClick={() => moveToTrash({ dataToRemove: record.itemData })} style={{ color: 'red' }}><DeleteFilled /> Delete</a>
                    {/* <p>{record.action}</p> */}
                </Space >
            ),
        },

    ];


    function ListOfData() {
        return (
            <div >

                <Button style={{ margin: "15px 0" }} type='dashed' onClick={() => {
                    setUpdateDiv(<ActivityItemUpdate collection={`activity/${id}`} allItemData={data} data={undefined} />)
                }}
                >
                    <PlusOutlined /> Add Activity
                </Button>
                <Table
                    dataSource={dataList}
                    columns={columns}
                    pagination={{ current: currentIndex, pageSize: 10, total: data.length }}
                    onChange={(e) => setCurrentIndex(e.current)}
                />;
                {/* <Table 
                columns={columns} 
                pagination={{current:currentIndex, pageSize:10, total:data.length}}
                onChange={(e)=>setCurrentIndex(e.current)}
                dataSource={
                //     data.data.map((item, k) => {
                //     return ({
                //         key: k,
                //         name: item.title,
                //         id: item.id,
                //         thumb:item.thumbnail,
                //         itemData:item
                //     })
                // })
                [{key:"k", name:"Umesh", id:"rwerer", thumb:"sdfjasdfasdf"}]

                } /> */}
            </div>
        )
    }

    console.log("from activity list,", data)

    return (
        <div style={{ border: "1px solid grey", padding: '15px', borderRadius: 20, marginBottom: 20, marginTop: 20 }}>
            <h2>Activities List in {data.name}</h2>

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
