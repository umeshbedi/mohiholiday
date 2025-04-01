
import dynamic from 'next/dynamic'
import Image from 'next/image'

import React from 'react'
import style from '@/styles/packageName.module.css'
import { Divider } from 'antd'
import { db } from '@/firebase'
import Tile from '@/components/master/SingleTile'
import { notFound } from 'next/navigation'

const Menu = dynamic(() => import("@/components/master/header"))
const HeadImage = dynamic(() => import("@/components/master/HeadImage"))


export default async function ActivityPlace({ params, searchParams }) {

    const { activityPlace } = params;

    const resAndaman = await db.collection('activity').where("slug", "==", `/activity/${activityPlace}`).get()
    const entryAndaman = resAndaman.docs.map((entry) => {
        return ({ id: entry.id, ...entry.data() })
    });

    const data = entryAndaman[0]

    if (entryAndaman.length == 0) return notFound();



    return (
        <div>
            <main>


                <div>
                    <Menu />

                    <HeadImage image={data.headerImage} />

                    <div style={{ padding: "3rem 5%", width: "100%", display: 'flex', flexDirection: 'column', gap: "1rem" }}>
                        <h1 className='text-center'>{data.name}</h1>
                        <p>{data.metaDescription}</p>

                        <div style={{ display: "flex", justifyContent: 'center', width: "100%", marginTop: '2rem' }}>
                            <div className={style.packageRow}>
                                {data.data.map((item, index) => (
                                    <Tile key={index} thumbnail={item.thumbnail} name={item.title} slug={item.slug} />
                                ))}
                            </div>
                        </div>
                        <hr />


                    </div>




                </div>
            </main>

        </div>
    )
}

export async function generateMetadata({ params, searchParams }, parent) {
    const { activityPlace } = params;

    const resAndaman = await db.collection('activity').where("slug", "==", `/activity/${activityPlace}`).get()
    const entryAndaman = resAndaman.docs.map((entry) => {
        return ({ id: entry.id, ...entry.data() })
    });

    const data = entryAndaman[0]
    return {
        title: data.name,
        description: data.metaDescription,
        openGraph: {
            images: data.thumbnail,
            title: data.name,
            description: data.metaDescription,
        },

    }
}




