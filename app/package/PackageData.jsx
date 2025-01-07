"use client"
import React, {useEffect, useState} from 'react'
import { Segmented } from 'antd'
import Tile from '@/components/master/SingleTile'
import style from '@/styles/packageName.module.css'

export default function PackageData({data, allData}) {

    const [packageData, setPackageData] = useState([])
    const [tabName, setTabName] = useState([])


    function fetchData(id) {
        const getID = data.find(f => f.name == id)
        const parentID = allData.find(f => f.parentID == getID.id)
        setPackageData(parentID.childData)
    }

    useEffect(() => {
        if (data != undefined && allData != undefined) {
            fetchData(data[0].name)
        }
    }, [data])

    // if (data == undefined) return <SHome />
    let tabTemp = []
    data.map((item, index) => {
        tabTemp.push(item.name)
    })

    return (
        <React.Fragment>
            <div style={{ marginTop: '2rem', overflowX: 'scroll', padding: 20 }} className='segmented'>
                <Segmented options={tabTemp} size='large' onChange={fetchData} style={{ boxShadow: "0px 0px 20px rgba(0,0,0,.2)" }} />
            </div>

            <div style={{ display: "flex", justifyContent: 'center', width: "100%", }}>
                <div className={style.packageRow}>
                    {packageData.map((item, index) => (
                        <Tile key={index} thumbnail={item.thumbnail} name={item.title} slug={item.slug} />
                    ))}
                </div>
            </div>
        </React.Fragment>
    )
}
