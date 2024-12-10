import React, { useEffect, useState } from 'react'
import { ArrowLeftOutlined, DeleteFilled, EditFilled, PlusOutlined, SearchOutlined } from '@ant-design/icons'
import { Tabs, Button, Input, Space, Table, Image, Skeleton } from 'antd'
import { db } from '@/firebase'
import AttractionItemUpdate from './ItemUpdate'

export default function AttractionItemList({ collection, id, slug }) {
    const [updateDiv, setUpdateDiv] = useState(null)

    const [data, setdata] = useState([])

    const [currentIndex, setCurrentIndex] = useState(1)

    const dataBase = db.doc(`${collection}/${id}`).collection('popularAttraction')

    useEffect(() => {
        dataBase.onSnapshot((snap) => {
            const dataTemp = []
            snap.forEach((d) => {
                const data = d.data()
                if (data !== undefined) {
                    dataTemp.push({ id: d.id, ...data })
                }

            })

            setdata(dataTemp)
        })
    }, [id])

   

    function moveToTrash({id}){
        if (confirm("Are you sure want to delete")) {
            dataBase.doc(`${id}`).delete().then()
        }
    }

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
            render:(_,record)=>(
                <Image src={record.thumb} style={{height:50}}
                placeholder={<>
                <Skeleton.Image active style={{height:50, width:"100%"}}/>
                </>}
                />
            )
        },
        
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={()=>setUpdateDiv(<AttractionItemUpdate collection={`${collection}/${id}`} data={record.itemData} slug={slug}/>)} style={{ color: 'blue' }}><EditFilled/> Edit</a>
                    < a onClick={() => moveToTrash({ id: record.id })} style={{ color: 'red' }}><DeleteFilled/> Delete</a>
                    
                </Space >
            ),
        },

    ];


    function ListOfData() {
        return (
            <div >
                <Button style={{margin:"15px 0"}} type='dashed' onClick={()=>setUpdateDiv(<AttractionItemUpdate collection={`${collection}/${id}`} data={undefined} slug={slug}/>)}
                ><PlusOutlined/> Add Popular Attraction</Button>
                <Table 
                columns={columns} 
                pagination={{current:currentIndex, pageSize:10, total:data.length}}
                onChange={(e)=>setCurrentIndex(e.current)}
                dataSource={data.map((item, k) => {
                    return ({
                        key: k,
                        name: item.title,
                        id: item.id,
                        thumb:item.thumbnail,
                        itemData:item
                    })
                })} />
            </div>
        )
    }

    return (
        <div style={{border:"1px solid grey", padding:'15px', borderRadius:20, marginBottom:20}}>
            <h2>Popular Attraction</h2>

            {updateDiv !== null ?
                (<div>
                    <div>
                        <ArrowLeftOutlined 
                        style={{ fontSize: 20, cursor: 'pointer', margin:"15px 0" }} 
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
