import dynamic from 'next/dynamic'
import Image from 'next/image'

import React from 'react'
import style from '@/styles/packageName.module.css'
import { Divider } from 'antd'
import { db } from '@/firebase'
import Tile from '@/components/master/SingleTile'
import { notFound } from 'next/navigation'
import SingleActivity from './SingleActivity'

const Menu = dynamic(() => import("@/components/master/header"))
const HeadImage = dynamic(() => import("@/components/master/HeadImage"))

export default async function ActivityName({ params }) {
    const { activityPlace, activityName } = params

    const resAndaman = await db.collection('activity').where("slug", "==", `/activity/${activityPlace}`).get()
    const entryAndaman = resAndaman.docs.map((entry) => {
        return ({ id: entry.id, ...entry.data() })
    });

    const data = entryAndaman[0]
    const singleActivity = data.data.filter(e => e.slug == `/activity/${activityPlace}/${activityName}`)
    const sortedData = data.data.filter(e => e.slug !== `/activity/${activityPlace}/${activityName}`)
    if (singleActivity.length == 0) return notFound()

    console.log("single activity: ", singleActivity)
    return (
        <main>
            <div>
                <Menu />
                <HeadImage image={singleActivity[0].headerImage} />
                <SingleActivity data={singleActivity[0]} parentActivity={data.name} sortedData={sortedData}/>
            </div>
        </main>
    )
}
