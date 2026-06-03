"use client"
import React, {useEffect, useState} from 'react'
import { ConfigProvider, Segmented } from 'antd'
import SingleTile from './SingleTile'
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
                <ConfigProvider
                    theme={{
                        components: {
                            Segmented: {
                                itemSelectedBg: '#15aee8',
                                itemSelectedColor: '#ffffff',
                                trackBg: '#e0f5fd',
                                borderRadius: 999,
                                borderRadiusSM: 999,
                                borderRadiusLG: 999,
                            }
                        }
                    }}
                >
                    <Segmented
                        options={tabTemp}
                        size='large'
                        onChange={fetchData}
                        style={{
                            boxShadow: '0px 4px 24px rgba(21,174,232,0.18)',
                            borderRadius: 999,
                            padding: 4,
                        }}
                    />
                </ConfigProvider>
            </div>

            <div style={{ display: "flex", justifyContent: 'center', width: "100%", }}>
                <div className={style.packageRow}>
                    {packageData.map((item, index) => (
                        <SingleTile key={index} thumbnail={item.thumbnail} name={item.name} slug={item.slug} price={item.price} type={item.type} />
                    ))}
                </div>
            </div>
        </React.Fragment>
    )
}
